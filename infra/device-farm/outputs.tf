output "device_farm_project_arn" {
  value       = module.device_farm.project_arn
  description = "ARN of the Terraform-managed Device Farm project."
}

output "device_farm_device_pool_arn" {
  value       = module.device_farm.device_pool_arns
  description = "Android-version-to-device-pool ARN mapping."
}

output "device_farm_input_bucket" {
  value       = module.artifacts.bucket_name
  description = "Single Device Farm bucket. Upload APKs under releases/ to begin a test."
}

output "device_farm_reports_bucket" {
  value       = module.artifacts.bucket_name
  description = "Same Device Farm bucket; reports are written under executions/."
}

output "device_farm_notification_topic_arn" {
  value       = module.notifications.topic_arn
  description = "SNS topic publishing test completion and failure emails."
}
