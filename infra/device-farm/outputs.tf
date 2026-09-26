output "device_farm_project_arn" {
  value       = module.device_farm.project_arn
  description = "ARN of the Terraform-managed Device Farm project."
}

output "device_farm_device_pool_arn" {
  value       = module.device_farm.device_pool_arns
  description = "Android-version-to-device-pool ARN mapping."
}

output "device_farm_input_bucket" {
  value       = module.artifacts.input_bucket_name
  description = "Upload APKs under releases/ in this bucket to begin a Device Farm execution."
}

output "device_farm_reports_bucket" {
  value       = module.artifacts.reports_bucket_name
  description = "Bucket containing logs, screenshots, and test summaries."
}

output "device_farm_notification_topic_arn" {
  value       = module.notifications.topic_arn
  description = "SNS topic publishing test completion and failure emails."
}
