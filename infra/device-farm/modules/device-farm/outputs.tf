output "project_arn" { value = aws_devicefarm_project.mobile.arn }
output "device_pool_arns" { value = { for version, pool in aws_devicefarm_device_pool.android_compatibility : version => pool.arn } }
output "device_pools" {
  value = [for version, pool in aws_devicefarm_device_pool.android_compatibility : { version = version, arn = pool.arn }]
}
