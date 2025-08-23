terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_backup_vault" "this" {
  name = var.backup_vault_name
}

resource "aws_backup_plan" "this" {
  name = "${var.backup_vault_name}-plan"

  rule {
    rule_name         = "rds-backup"
    target_vault_name = aws_backup_vault.this.name
    schedule          = var.schedule_expression

    lifecycle {
      delete_after = var.retention_days
    }
  }
}

resource "aws_iam_role" "backup" {
  name = "${var.backup_vault_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "backup.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_backup_selection" "this" {
  name         = "${var.backup_vault_name}-selection"
  iam_role_arn = aws_iam_role.backup.arn
  plan_id      = aws_backup_plan.this.id
  resources    = [var.db_resource_arn]
}
