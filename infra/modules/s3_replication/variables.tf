variable "source_bucket_name" {
  description = "Name of the primary S3 bucket"
  type        = string
}

variable "destination_bucket_name" {
  description = "Name of the replica S3 bucket"
  type        = string
}

variable "destination_region" {
  description = "AWS region for the replica bucket"
  type        = string
}
