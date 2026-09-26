provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

provider "aws" {
  alias  = "devicefarm"
  region = var.device_farm_region

  default_tags {
    tags = var.tags
  }
}
