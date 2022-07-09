resource "heroku_addon" "redis" {
  app  = heroku_app.lazarus_api.name
  plan = "heroku-redis:hobby-dev"
}

resource "heroku_addon_attachment" "redis" {
  app_id  = heroku_app.lazarus_api.id
  addon_id = heroku_addon.redis.id
}