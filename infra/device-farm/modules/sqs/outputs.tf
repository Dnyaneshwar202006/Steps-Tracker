output "queue_arn" {
  value      = aws_sqs_queue.events.arn
  depends_on = [aws_sqs_queue_policy.allow_s3]
}

output "queue_url" { value = aws_sqs_queue.events.url }
