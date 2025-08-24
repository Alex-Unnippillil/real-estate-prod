variable "region" {
  description = "AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "bucket_name" {
  description = "S3 bucket name for application assets."
  type        = string
  default     = "real-estate-assets"
}

variable "db_name" {
  description = "Name of the RDS database."
  type        = string
  default     = "realestate"
}

variable "db_username" {
  description = "Master username for the database."
  type        = string
  default     = "admin"
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for the database in GB."
  type        = number
  default     = 20
}

variable "cluster_name" {
  description = "Name of the ECS cluster."
  type        = string
  default     = "real-estate-cluster"
}

variable "tags" {
  description = "Common tags to apply to resources."
  type        = map(string)
  default     = {}
}
