variable "aws_region" {
  description = "AWS region for Device Farm. Device Farm mobile testing is available in us-west-2."
  type        = string
  default     = "us-west-2"
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
