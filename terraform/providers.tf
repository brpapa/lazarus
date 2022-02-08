provider "aws" {
  profile    = var.aws_profile
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key

  # apply tags to all aws resources
  default_tags {
    tags = {
      App         = "metis"
      Environment = "prod"
    }
  }
}

provider "heroku" {
  api_key = var.heroku_api_key
  email   = var.heroku_email
}
