terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  alias  = "destination"
  region = var.destination_region
}

resource "aws_s3_bucket" "source" {
  bucket = var.source_bucket_name
}

resource "aws_s3_bucket_versioning" "source" {
  bucket = aws_s3_bucket.source.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket" "destination" {
  provider = aws.destination
  bucket   = var.destination_bucket_name
}

resource "aws_s3_bucket_versioning" "destination" {
  provider = aws.destination
  bucket   = aws_s3_bucket.destination.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_iam_role" "replication" {
  name = "${var.source_bucket_name}-replication-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "s3.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "replication" {
  name = "${var.source_bucket_name}-replication-policy"
  role = aws_iam_role.replication.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["s3:GetReplicationConfiguration", "s3:ListBucket"],
        Effect   = "Allow",
        Resource = [aws_s3_bucket.source.arn]
      },
      {
        Action   = ["s3:GetObjectVersion", "s3:GetObjectVersionAcl"],
        Effect   = "Allow",
        Resource = ["${aws_s3_bucket.source.arn}/*"]
      },
      {
        Action   = ["s3:ReplicateObject", "s3:ReplicateDelete"],
        Effect   = "Allow",
        Resource = ["${aws_s3_bucket.destination.arn}/*"]
      }
    ]
  })
}

resource "aws_s3_bucket_replication_configuration" "this" {
  bucket = aws_s3_bucket.source.id
  role   = aws_iam_role.replication.arn

  rule {
    id     = "replication"
    status = "Enabled"

    destination {
      bucket        = aws_s3_bucket.destination.arn
      storage_class = "STANDARD"
    }
  }
}
