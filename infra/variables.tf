variable "region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "ami_id" {
  description = "AMI ID for instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener"
  type        = string
}

variable "asg_min_size" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Maximum number of instances"
  type        = number
  default     = 2
}

variable "asg_desired_capacity" {
  description = "Desired number of instances"
  type        = number
  default     = 1
}
