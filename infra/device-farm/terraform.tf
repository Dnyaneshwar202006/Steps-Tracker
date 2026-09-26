terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }

  backend "s3" {
    bucket       = "prod-tfstate-state-tracker"
    key          = "device-farm/terraform.tfstate"
    region       = "ap-south-1"
    use_lockfile = true
  }
}
