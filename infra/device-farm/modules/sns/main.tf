resource "aws_sns_topic" "results" {
  name              = var.name
  kms_master_key_id = "alias/aws/sns"
  tags              = var.tags
}

resource "aws_sns_topic_subscription" "email" {
  count     = var.notification_email == "" ? 0 : 1
  topic_arn = aws_sns_topic.results.arn
  protocol  = "email"
  endpoint  = var.notification_email
}
