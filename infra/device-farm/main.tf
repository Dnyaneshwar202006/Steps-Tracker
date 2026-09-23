
resource "aws_devicefarm_project" "mobile" {
  name = var.project_name
}

resource "aws_devicefarm_device_pool" "android_compatibility" {
  for_each = toset(var.android_os_versions)

  name        = "${var.device_pool_name}-android-${each.value}"
  description = "Available Android ${each.value} devices for release APK fuzz testing."
  project_arn = aws_devicefarm_project.mobile.arn
  max_devices = 1

  rule {
    attribute = "PLATFORM"
    operator  = "EQUALS"
    value     = "\"ANDROID\""
  }

  rule {
    attribute = "AVAILABILITY"
    operator  = "EQUALS"
    value     = "\"AVAILABLE\""
  }

  rule {
    attribute = "OS_VERSION"
    operator  = "EQUALS"
    value     = jsonencode(each.value)
  }
}
