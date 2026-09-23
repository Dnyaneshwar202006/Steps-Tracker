output "device_farm_project_arn" {
  value       = aws_devicefarm_project.mobile.arn
  description = "ARN of the Terraform-managed Device Farm project."
}

output "device_farm_device_pool_arn" {
  value       = { for version, pool in aws_devicefarm_device_pool.android_compatibility : version => pool.arn }
  description = "Android-version-to-device-pool ARN mapping."
}
