resource "random_password" "db" {
  length  = 16
  special = true
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.db_name}-subnet-group"
  subnet_ids = var.subnet_ids
  tags       = var.tags
}

resource "aws_db_instance" "this" {
  identifier             = var.db_name
  engine                 = "postgres"
  instance_class         = var.instance_class
  allocated_storage      = var.allocated_storage
  db_subnet_group_name   = aws_db_subnet_group.this.name
  username               = var.username
  password               = random_password.db.result
  skip_final_snapshot    = true
  vpc_security_group_ids = var.vpc_security_group_ids
  tags                   = var.tags
}
