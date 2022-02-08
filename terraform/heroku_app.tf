resource "heroku_app" "metis_api" {
  name   = "metis-node-api"
  region = "us"
  stack = "container"
}
