
data "aws_caller_identity" "current" {}

# Preserve existing Device Farm resources that were created before this module
# was introduced; these moves prevent Terraform from replacing them.
moved {
  from = aws_devicefarm_project.mobile
  to   = module.device_farm.aws_devicefarm_project.mobile
}

moved {
  from = aws_devicefarm_device_pool.android_compatibility["10"]
  to   = module.device_farm.aws_devicefarm_device_pool.android_compatibility["10"]
}

moved {
  from = aws_devicefarm_device_pool.android_compatibility["11"]
  to   = module.device_farm.aws_devicefarm_device_pool.android_compatibility["11"]
}

moved {
  from = aws_devicefarm_device_pool.android_compatibility["12"]
  to   = module.device_farm.aws_devicefarm_device_pool.android_compatibility["12"]
}

moved {
  from = aws_devicefarm_device_pool.android_compatibility["13"]
  to   = module.device_farm.aws_devicefarm_device_pool.android_compatibility["13"]
}

locals {
  artifact_bucket_prefix = "${var.project_name}-${data.aws_caller_identity.current.account_id}"
}

module "device_farm" {
  source = "./modules/device-farm"

  providers = {
    aws = aws.devicefarm
  }

  project_name        = var.project_name
  device_pool_name    = var.device_pool_name
  android_os_versions = var.android_os_versions
  tags                = var.tags
}

module "test_queue" {
  source = "./modules/sqs"

  name               = "${var.project_name}-apk-events"
  source_bucket_name = "${local.artifact_bucket_prefix}-input"
  tags               = var.tags
}

module "artifacts" {
  source              = "./modules/s3"
  bucket_name         = "${local.artifact_bucket_prefix}-input"
  input_object_prefix = var.input_object_prefix
  queue_arn           = module.test_queue.queue_arn
  tags                = var.tags
}

module "notifications" {
  source = "./modules/sns"

  name               = "${var.project_name}-results"
  notification_email = var.notification_email
  tags               = var.tags
}

module "device_farm_runner" {
  source                 = "./modules/lambda-runner"
  function_name          = "${var.project_name}-runner"
  source_dir             = abspath("${path.root}/../../lambda/device-farm-runner")
  bucket_arn             = module.artifacts.bucket_arn
  notification_topic_arn = module.notifications.topic_arn
  queue_arn              = module.test_queue.queue_arn
  queue_url              = module.test_queue.queue_url
  project_arn            = module.device_farm.project_arn
  device_pools           = module.device_farm.device_pools
  tags                   = var.tags
}
