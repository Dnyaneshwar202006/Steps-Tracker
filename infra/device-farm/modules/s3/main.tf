resource "aws_s3_bucket" "input" {
  bucket        = var.bucket_name
  force_destroy = true
  tags          = var.tags
}

resource "aws_s3_bucket_public_access_block" "input" {
  bucket                  = aws_s3_bucket.input.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "input" {
  bucket = aws_s3_bucket.input.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "input" {
  bucket = aws_s3_bucket.input.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_lifecycle_configuration" "input" {
  bucket = aws_s3_bucket.input.id
  rule {
    id     = "expire-uploaded-apks"
    status = "Enabled"
    filter { prefix = "" }
    expiration { days = 14 }
    noncurrent_version_expiration { noncurrent_days = 7 }
  }
}



resource "aws_s3_bucket_notification" "apk_uploaded" {
  bucket = aws_s3_bucket.input.id
  queue {
    queue_arn     = var.queue_arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = var.input_object_prefix
    filter_suffix = ".apk"
  }
}
