output "db_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.this.endpoint
}

output "db_password" {
  description = "Generated database password"
  value       = random_password.db.result
  sensitive   = true
}
