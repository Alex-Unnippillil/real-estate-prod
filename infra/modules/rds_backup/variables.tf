variable "db_resource_arn" {
  description = "ARN of the RDS database instance or cluster to back up"
  type        = string
}

variable "backup_vault_name" {
  description = "Name of the AWS Backup vault"
  type        = string
  default     = "rds-backup-vault"
}

variable "schedule_expression" {
  description = "Cron expression for backup schedule"
  type        = string
  default     = "cron(0 5 * * ? *)" # Daily at 05:00 UTC
}

variable "retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 30
}
