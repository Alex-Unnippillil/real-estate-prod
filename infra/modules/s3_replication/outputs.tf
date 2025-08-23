output "source_bucket_arn" {
  description = "ARN of the source S3 bucket"
  value       = aws_s3_bucket.source.arn
}

output "destination_bucket_arn" {
  description = "ARN of the replicated S3 bucket"
  value       = aws_s3_bucket.destination.arn
}
