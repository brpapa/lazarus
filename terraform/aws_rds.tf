# WARNING: this RDS instance is publicly accessible for simplicity

resource "aws_db_subnet_group" "lazarus_db_subnet_group" {
  name       = "lazarus-db-subnet-group"
  subnet_ids = module.vpc.public_subnets
}

# enable connection logging
resource "aws_db_parameter_group" "lazarus_parameter_group" {
  family = "postgres12"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_db_instance" "lazarus_pg" {
  identifier           = "lazarus-pg"
  instance_class       = "db.t2.micro"
  allocated_storage    = 5
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "12"
  username             = var.pg_root_username
  password             = var.pg_root_password
  parameter_group_name = aws_db_parameter_group.lazarus_parameter_group.name
  # collection of subnets that this RDS instance can be provisioned in
  db_subnet_group_name   = aws_db_subnet_group.lazarus_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.lazarus_security_group.id]
  publicly_accessible    = true
  # disable taking a final backup when this instance is destroyed later
  skip_final_snapshot = true
}