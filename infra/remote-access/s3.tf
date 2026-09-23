resource "aws_s3_bucket" "terraform-s3_bucket" {
  bucket = "prod-tfstate-state-tracker"

  tags = {
    Name = "prod-tfstate-step-tracker"
  }
}

resource "aws_s3_bucket_public_access_block" "terraform-s3_bucket" {
  bucket = aws_s3_bucket.terraform-s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "terraform-s3_bucket" {
  bucket = aws_s3_bucket.terraform-s3_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform-s3_bucket" {
  bucket = aws_s3_bucket.terraform-s3_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
