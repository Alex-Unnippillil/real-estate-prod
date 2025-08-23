variable "name" {
  description = "Name of the ECS cluster."
  type        = string
}

variable "tags" {
  description = "Tags to apply to the ECS cluster."
  type        = map(string)
  default     = {}
}
