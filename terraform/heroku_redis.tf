resource "heroku_addon" "redis" {
  app  = heroku_app.metis_api.name
  plan = "heroku-redis:hobby-dev"
}

resource "heroku_addon_attachment" "redis" {
  app_id  = heroku_app.metis_api.id
  addon_id = heroku_addon.redis.id
}