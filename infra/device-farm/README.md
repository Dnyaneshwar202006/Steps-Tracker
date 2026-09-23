# AWS Device Farm infrastructure

This Terraform stack provisions the Device Farm project and one available-device pool for each of Android 10–13.

Each pool selects exactly one currently available device for its Android version. The workflow schedules one fuzz test per value in `android_os_versions` (default: 10, 11, 12, and 13), guaranteeing version coverage when the matching devices are available.

## One-time bootstrap

First apply `infra/remote-access`. It creates the versioned, encrypted S3 bucket
`prod-tfstate-state-tracker` used by this stack. Device Farm state is stored at
`device-farm/terraform.tfstate`; S3 lockfiles prevent concurrent applies.

Add the following GitHub repository secrets from an IAM user or role with permission to manage Device Farm and read/write the Terraform state bucket:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

The Android release workflow provisions this Terraform stack before it runs the fuzz tests.

## Local use

```sh
terraform -chdir=infra/device-farm init
terraform -chdir=infra/device-farm plan
terraform -chdir=infra/device-farm apply
```

Do not commit Terraform state or AWS credentials.
