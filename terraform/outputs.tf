output "api_url" {
  description = "URL of the API service"
  value       = google_cloud_run_v2_service.glacier_scan_api.uri
}

output "ai_service_url" {
  description = "URL of the AI service"
  value       = google_cloud_run_v2_service.glacier_scan_ai.uri
}

output "database_connection_name" {
  description = "Database connection name"
  value       = google_sql_database_instance.glacier_scan_db.connection_name
}
