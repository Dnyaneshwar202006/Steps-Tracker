import {
  CreateUploadCommand,
  DeviceFarmClient,
  GetRunCommand,
  GetUploadCommand,
  ListArtifactsCommand,
  ListJobsCommand,
  ListSuitesCommand,
  ListTestsCommand,
  ScheduleRunCommand
} from "@aws-sdk/client-device-farm";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const deviceFarm = new DeviceFarmClient({ region: "us-west-2" });
const s3 = new S3Client({});
const sns = new SNSClient({});
const sqs = new SQSClient({});
const devicePools = JSON.parse(process.env.DEVICE_POOLS ?? "[]");
const queueUrl = process.env.STATUS_QUEUE_URL;

const delaySeconds = 60;
const maxChecks = 120;
const safeName = (value) => String(value).replace(/[^A-Za-z0-9._-]/g, "_");
const decodeKey = (key) => decodeURIComponent(key.replace(/\+/g, " "));

const bodyToBuffer = async (body) => {
  if (typeof body.transformToByteArray === "function") return Buffer.from(await body.transformToByteArray());
  const chunks = [];
  for await (const chunk of body) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const enqueue = (message, delay = 0) => sqs.send(new SendMessageCommand({
  QueueUrl: queueUrl,
  MessageBody: JSON.stringify(message),
  DelaySeconds: delay
}));

const putJson = (bucket, key, value) => s3.send(new PutObjectCommand({
  Bucket: bucket,
  Key: key,
  Body: JSON.stringify(value, null, 2),
  ContentType: "application/json"
}));

const listAll = async (Command, request, property) => {
  const values = [];
  let nextToken;
  do {
    const response = await deviceFarm.send(new Command({ ...request, nextToken }));
    values.push(...(response[property] ?? []));
    nextToken = response.nextToken;
  } while (nextToken);
  return values;
};

const publishResult = async ({ status, runs = [], message = "" }) => {
  const passed = status === "COMPLETED" && runs.every((run) => run.result === "PASSED");
  await sns.send(new PublishCommand({
    TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
    Subject: passed ? "Device Farm tests passed" : "Device Farm tests failed",
    Message: message || JSON.stringify({ result: passed ? "PASSED" : "FAILED", runs }, null, 2)
  }));
};

const createUpload = async ({ bucket, key }) => {
  const apk = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const upload = await deviceFarm.send(new CreateUploadCommand({
    projectArn: process.env.PROJECT_ARN,
    name: key.split("/").at(-1),
    type: "ANDROID_APP"
  }));
  const response = await fetch(upload.upload.url, {
    method: "PUT",
    body: await bodyToBuffer(apk.Body),
    headers: { "content-type": "application/vnd.android.package-archive" }
  });
  if (!response.ok) throw new Error(`Device Farm upload PUT failed: ${response.status}`);
  return upload.upload.arn;
};

const scheduleRuns = async (uploadArn) => Promise.all(devicePools.map(async (devicePool) => {
  const response = await deviceFarm.send(new ScheduleRunCommand({
    projectArn: process.env.PROJECT_ARN,
    appArn: uploadArn,
    devicePoolArn: devicePool.arn,
    name: `apk-${devicePool.version}-${Date.now()}`,
    test: { type: "BUILTIN_FUZZ", parameters: { event_count: "500", throttle: "100" } }
  }));
  return { version: devicePool.version, runArn: response.run.arn };
}));

const collectReport = async (run, reportsBucket, reportRoot) => {
  const prefix = `${reportRoot}/android-${safeName(run.version)}`;
  const deviceFarmRun = (await deviceFarm.send(new GetRunCommand({ arn: run.runArn }))).run;
  await putJson(reportsBucket, `${prefix}/run.json`, deviceFarmRun);
  await putJson(reportsBucket, `${prefix}/run-summary.json`, {
    result: deviceFarmRun.result,
    status: deviceFarmRun.status,
    webUrl: deviceFarmRun.webUrl,
    counters: deviceFarmRun.counters
  });

  const jobs = await listAll(ListJobsCommand, { arn: run.runArn }, "jobs");
  await putJson(reportsBucket, `${prefix}/jobs.json`, jobs);
  for (const job of jobs) {
    const suites = await listAll(ListSuitesCommand, { arn: job.arn }, "suites");
    await putJson(reportsBucket, `${prefix}/suites/${safeName(job.arn)}.json`, suites);
    for (const suite of suites) {
      const tests = await listAll(ListTestsCommand, { arn: suite.arn }, "tests");
      await putJson(reportsBucket, `${prefix}/tests/${safeName(suite.arn)}.json`, tests);
    }
  }

  for (const type of ["LOG", "FILE", "SCREENSHOT"]) {
    const artifacts = await listAll(ListArtifactsCommand, { arn: run.runArn, type }, "artifacts");
    await putJson(reportsBucket, `${prefix}/${type}.json`, artifacts);
    for (const artifact of artifacts) {
      if (!artifact.url) continue;
      const response = await fetch(artifact.url);
      if (!response.ok) throw new Error(`Could not download ${type} artifact: ${response.status}`);
      await s3.send(new PutObjectCommand({
        Bucket: reportsBucket,
        Key: `${prefix}/${type}-${safeName(artifact.name ?? "artifact")}.${safeName(artifact.extension ?? "bin")}`,
        Body: Buffer.from(await response.arrayBuffer())
      }));
    }
  }
  return { version: run.version, result: deviceFarmRun.result, webUrl: deviceFarmRun.webUrl, reportPrefix: prefix };
};

const handleInitialUpload = async (s3Event) => {
  for (const record of s3Event.Records ?? []) {
    if (!record.s3?.object?.key) continue;
    const bucket = record.s3.bucket.name;
    const key = decodeKey(record.s3.object.key);
    const uploadArn = await createUpload({ bucket, key });
    await enqueue({ action: "check-upload", bucket, key, uploadArn, attempts: 0 }, 30);
  }
};

const handleUploadCheck = async (message) => {
  const upload = (await deviceFarm.send(new GetUploadCommand({ arn: message.uploadArn }))).upload;
  if (upload.status === "FAILED") {
    await publishResult({ status: "FAILED", message: `Device Farm rejected APK: s3://${message.bucket}/${message.key}` });
    return;
  }
  if (upload.status !== "SUCCEEDED") {
    if (message.attempts >= maxChecks) {
      await publishResult({ status: "FAILED", message: "Timed out waiting for Device Farm to process the APK." });
      return;
    }
    await enqueue({ ...message, attempts: message.attempts + 1 }, delaySeconds);
    return;
  }
  const runs = await scheduleRuns(message.uploadArn);
  const reportRoot = `executions/${safeName(message.uploadArn.split(":").at(-1))}`;
  await enqueue({ action: "check-runs", runs, reportsBucket: process.env.REPORTS_BUCKET, reportRoot, attempts: 0 }, delaySeconds);
};

const handleRunCheck = async (message) => {
  const statuses = await Promise.all(message.runs.map(async (run) => ({
    ...run,
    ...(await deviceFarm.send(new GetRunCommand({ arn: run.runArn }))).run
  })));
  if (statuses.some((run) => run.status !== "COMPLETED")) {
    if (message.attempts >= maxChecks) {
      await publishResult({ status: "FAILED", message: "Timed out waiting for Device Farm test runs." });
      return;
    }
    await enqueue({ ...message, attempts: message.attempts + 1 }, delaySeconds);
    return;
  }
  const reports = [];
  for (const run of message.runs) reports.push(await collectReport(run, message.reportsBucket, message.reportRoot));
  await publishResult({ status: "COMPLETED", runs: reports });
};

export const handler = async (event) => {
  for (const record of event.Records ?? []) {
    const message = JSON.parse(record.body);
    if (!message.action) await handleInitialUpload(message);
    else if (message.action === "check-upload") await handleUploadCheck(message);
    else if (message.action === "check-runs") await handleRunCheck(message);
    else throw new Error(`Unsupported queue message action: ${message.action}`);
  }
};
