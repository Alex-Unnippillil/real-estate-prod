variable "cidr_block" {
  description = "CIDR block for the VPC."
  type        = string
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks."
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to the VPC resources."
  type        = map(string)
  default     = {}
}
