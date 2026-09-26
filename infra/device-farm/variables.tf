variable "aws_region" {
  description = "AWS region for the event-driven runtime services: S3, SQS, Lambda, CloudWatch Logs, and SNS."
  type        = string
  default     = "ap-south-1"
}

variable "device_farm_region" {
  description = "AWS region for Device Farm mobile projects and device pools."
  type        = string
  default     = "us-west-2"
}

variable "notification_email" {
  description = "Email address subscribed to final Device Farm result notifications. Leave empty to omit the subscription."
  type        = string
  default     = "harshpoojary10b@gmail.com"
}

variable "input_object_prefix" {
  description = "Only APK objects written under this prefix trigger a test run."
  type        = string
  default     = "releases/"
}

variable "project_name" {
  description = "Name of the Device Farm project."
  type        = string
  default     = "steps-tracker-android"
}

variable "device_pool_name" {
  description = "Name of the Device Farm pool that selects available Android devices."
  type        = string
  default     = "android-compatibility"
}

variable "android_os_versions" {
  description = "Android OS major versions Device Farm must test."
  type        = list(string)
  default     = ["10", "11", "12", "13"]

  validation {
    condition     = length(var.android_os_versions) > 0
    error_message = "At least one Android OS version must be selected."
  }
}

variable "tags" {
  description = "Tags applied to resources that support tagging."
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
    Project   = "steps-tracker"
  }
}
