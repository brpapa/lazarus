variable "heroku_api_key" {
  type      = string
  sensitive = true
}

variable "heroku_email" {
  type      = string
  sensitive = true
}

variable "aws_profile" {
  type    = string
}

variable "aws_access_key" {
  type      = string
  sensitive = true
}

variable "aws_secret_key" {
  type      = string
  sensitive = true
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "pg_root_username" {
  type      = string
  sensitive = true
}

variable "pg_root_password" {
  type      = string
  sensitive = true
}