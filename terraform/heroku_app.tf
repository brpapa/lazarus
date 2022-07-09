resource "heroku_app" "lazarus_api" {
  name   = "lazarus-node-api"
  region = "us"
  stack = "container"
}
