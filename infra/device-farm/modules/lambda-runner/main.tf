data "archive_file" "function" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = "${path.module}/device-farm-runner.zip"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "function" {
  name               = "${var.function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "logging" {
  role       = aws_iam_role.function.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "permissions" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${var.input_bucket_arn}/*"]
  }
  statement {
    actions   = ["s3:PutObject"]
    resources = ["${var.reports_bucket_arn}/*"]
  }
  statement {
    actions = [
      "devicefarm:CreateUpload",
      "devicefarm:GetUpload",
      "devicefarm:ScheduleRun",
      "devicefarm:GetRun",
      "devicefarm:ListArtifacts",
      "devicefarm:ListJobs",
      "devicefarm:ListSuites",
      "devicefarm:ListTests"
    ]
    resources = ["*"]
  }
  statement {
    actions   = ["sns:Publish"]
    resources = [var.notification_topic_arn]
  }
  statement {
    actions   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes", "sqs:SendMessage"]
    resources = [var.queue_arn]
  }
}

resource "aws_iam_role_policy" "permissions" {
  name   = "${var.function_name}-permissions"
  role   = aws_iam_role.function.id
  policy = data.aws_iam_policy_document.permissions.json
}

resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 30
  tags              = var.tags
}

resource "aws_lambda_function" "function" {
  function_name    = var.function_name
  role             = aws_iam_role.function.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  architectures    = ["arm64"]
  filename         = data.archive_file.function.output_path
  source_code_hash = data.archive_file.function.output_base64sha256
  timeout          = 300
  memory_size      = 1024

  environment {
    variables = {
      REPORTS_BUCKET         = replace(var.reports_bucket_arn, "arn:aws:s3:::", "")
      NOTIFICATION_TOPIC_ARN = var.notification_topic_arn
      STATUS_QUEUE_URL       = var.queue_url
      PROJECT_ARN            = var.project_arn
      DEVICE_POOLS           = jsonencode(var.device_pools)
    }
  }

  depends_on = [aws_cloudwatch_log_group.function]
  tags       = var.tags
}

resource "aws_lambda_event_source_mapping" "sqs" {
  event_source_arn = var.queue_arn
  function_name    = aws_lambda_function.function.arn
  batch_size       = 1
  enabled          = true
}
