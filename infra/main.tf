module "vpc" {
  source         = "./modules/vpc"
  cidr_block     = var.vpc_cidr_block
  public_subnets = var.public_subnets
  tags           = var.tags
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = var.bucket_name
  tags        = var.tags
}

module "rds" {
  source                 = "./modules/rds"
  db_name                = var.db_name
  username               = var.db_username
  instance_class         = var.db_instance_class
  allocated_storage      = var.db_allocated_storage
  subnet_ids             = module.vpc.public_subnet_ids
  vpc_security_group_ids = []
  tags                   = var.tags
}

module "ecs" {
  source = "./modules/ecs"
  name   = var.cluster_name
  tags   = var.tags
}

# Store important identifiers and secrets in SSM Parameter Store
resource "aws_ssm_parameter" "vpc_id" {
  name  = "/real-estate/vpc/id"
  type  = "String"
  value = module.vpc.vpc_id
}

resource "aws_ssm_parameter" "public_subnets" {
  name  = "/real-estate/vpc/public_subnets"
  type  = "String"
  value = join(",", module.vpc.public_subnet_ids)
}

resource "aws_ssm_parameter" "assets_bucket" {
  name  = "/real-estate/s3/assets_bucket"
  type  = "String"
  value = module.s3.bucket_name
}

resource "aws_ssm_parameter" "rds_endpoint" {
  name  = "/real-estate/rds/endpoint"
  type  = "String"
  value = module.rds.db_endpoint
}

resource "aws_ssm_parameter" "rds_password" {
  name  = "/real-estate/rds/password"
  type  = "SecureString"
  value = module.rds.db_password
}

resource "aws_ssm_parameter" "ecs_cluster" {
  name  = "/real-estate/ecs/cluster_arn"
  type  = "String"
  value = module.ecs.cluster_arn
}
