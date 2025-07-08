terraform {
  required_version = ">= 1.6"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.12"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud SQL instance
resource "google_sql_database_instance" "glacier_scan_db" {
  name             = "glacier-scan-db"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier = "db-f1-micro"
    
    database_flags {
      name  = "shared_preload_libraries"
      value = "postgis"
    }
    
    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        value = "0.0.0.0/0"
        name  = "all"
      }
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "glacier_scan" {
  name     = "glacier_scan"
  instance = google_sql_database_instance.glacier_scan_db.name
}

resource "google_sql_user" "glacier_scan_user" {
  name     = "glacier_scan"
  instance = google_sql_database_instance.glacier_scan_db.name
  password = var.db_password
}

# Cloud Run services
resource "google_cloud_run_v2_service" "glacier_scan_api" {
  name     = "glacier-scan-api"
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/glacier-scan-api:latest"
      
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${google_sql_user.glacier_scan_user.name}:${var.db_password}@${google_sql_database_instance.glacier_scan_db.connection_name}/${google_sql_database.glacier_scan.name}"
      }
      
      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }
    }
  }
}

resource "google_cloud_run_v2_service" "glacier_scan_ai" {
  name     = "glacier-scan-ai"
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/glacier-scan-ai:latest"
      
      resources {
        limits = {
          cpu    = "2"
          memory = "4Gi"
        }
      }
    }
  }
}

# IAM
resource "google_cloud_run_service_iam_member" "api_public" {
  service  = google_cloud_run_v2_service.glacier_scan_api.name
  location = google_cloud_run_v2_service.glacier_scan_api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "ai_public" {
  service  = google_cloud_run_v2_service.glacier_scan_ai.name
  location = google_cloud_run_v2_service.glacier_scan_ai.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
