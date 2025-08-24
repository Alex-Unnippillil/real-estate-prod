resource "aws_vpc" "this" {
  cidr_block = var.cidr_block
  tags       = merge({ Name = "real-estate-vpc" }, var.tags)
}

locals {
  subnet_map = { for idx, cidr in var.public_subnets : idx => cidr }
}

resource "aws_subnet" "public" {
  for_each                = local.subnet_map
  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value
  map_public_ip_on_launch = true
  tags                    = merge({ Name = "public-${each.key}" }, var.tags)
}
