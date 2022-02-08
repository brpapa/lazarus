# get all available AZ for configured region
data "aws_availability_zones" "available" {}

# create resources: aws_vpc, aws_route_table, aws_route, aws_internet_gateway, aws_subnet
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.77.0"

  cidr                 = "10.0.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]

  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_security_group" "metis_security_group" {
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # ingress {
  #   from_port   = 6379
  #   to_port     = 6379
  #   protocol    = "ssh"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }

  # egress {
  #   from_port   = 6379
  #   to_port     = 6379
  #   protocol    = "ssh"
  #   cidr_blocks = ["0.0.0.0/0"]
  # }
}
