variable "function_name" { type = string }
variable "source_dir" { type = string }
variable "bucket_arn" { type = string }
variable "notification_topic_arn" { type = string }
variable "queue_arn" { type = string }
variable "queue_url" { type = string }
variable "project_arn" { type = string }
variable "device_pools" { type = list(object({ version = string, arn = string })) }
variable "tags" { type = map(string) }
