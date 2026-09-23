terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Created by infra/remote-access. The backend region is independent from the
  # us-west-2 provider region used by AWS Device Farm.
  backend "s3" {
    bucket       = "prod-tfstate-state-tracker"
    key          = "device-farm/terraform.tfstate"
    region       = "ap-south-1"
    use_lockfile = true
  }
}
