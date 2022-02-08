output "s3_domain_name" {
  description = "S3 bucket domain name"
  value       = aws_s3_bucket.metis_s3.bucket_domain_name
}

output "pg_hostname" {
  description = "PostgreSQL instance hostname"
  value       = aws_db_instance.metis_pg.address
}

output "pg_port" {
  description = "PostgreSQL instance port"
  value       = aws_db_instance.metis_pg.port
}

output "pg_username" {
  description = "PostgreSQL instance root username"
  value       = aws_db_instance.metis_pg.username
  sensitive   = true
}

output "node_api_url" {
  value = heroku_app.metis_api.web_url
}

output "redis_url" {
  value = heroku_app.metis_api.all_config_vars.REDIS_URL
  sensitive = true
}

output "redis_tls_url" {
  value = heroku_app.metis_api.all_config_vars.REDIS_TLS_URL
  sensitive = true
}
