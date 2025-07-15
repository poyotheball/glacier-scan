import { neon } from "@neondatabase/serverless"

// Use Neon serverless for better Windows compatibility
const sql = neon(process.env.DATABASE_URL || "")

export interface Glacier {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  elevation: number
  area_km2: number
  ice_volume_km3: number
  last_measured: string
  status: "stable" | "retreating" | "advancing"
  created_at: string
  updated_at: string
}

export interface GlacierMeasurement {
  id: string
  glacier_id: string
  measurement_date: string
  ice_volume_km3: number
  surface_area_km2: number
  melt_rate_mm_year: number
  temperature_avg_c: number
  precipitation_mm: number
  confidence_score: number
  created_at: string
}

export interface GlacierImage {
  id: string
  glacier_id: string
  image_url: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results: any
  uploaded_at: string
  processed_at?: string
}

export interface Alert {
  id: string
  glacier_id: string
  alert_type: "critical_melt" | "rapid_retreat" | "volume_loss" | "temperature_spike"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  is_active: boolean
  created_at: string
  resolved_at?: string
}

class Database {
  async getGlaciers(): Promise<Glacier[]> {
    try {
      const result = await sql`
        SELECT * FROM glaciers 
        ORDER BY name ASC
      `
      return result as Glacier[]
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  async getGlacierById(id: string): Promise<Glacier | null> {
    try {
      const result = await sql`
        SELECT * FROM glaciers 
        WHERE id = ${id}
        LIMIT 1
      `
      return (result[0] as Glacier) || null
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  async createGlacier(glacier: Omit<Glacier, "id" | "created_at" | "updated_at">): Promise<Glacier | null> {
    try {
      const result = await sql`
        INSERT INTO glaciers (name, location, latitude, longitude, elevation, area_km2, ice_volume_km3, last_measured, status)
        VALUES (${glacier.name}, ${glacier.location}, ${glacier.latitude}, ${glacier.longitude}, 
                ${glacier.elevation}, ${glacier.area_km2}, ${glacier.ice_volume_km3}, ${glacier.last_measured}, ${glacier.status})
        RETURNING *
      `
      return result[0] as Glacier
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  async getMeasurements(glacierId?: string): Promise<GlacierMeasurement[]> {
    try {
      const result = glacierId
        ? await sql`SELECT * FROM glacier_measurements WHERE glacier_id = ${glacierId} ORDER BY measurement_date DESC`
        : await sql`SELECT * FROM glacier_measurements ORDER BY measurement_date DESC`
      return result as GlacierMeasurement[]
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  async createMeasurement(
    measurement: Omit<GlacierMeasurement, "id" | "created_at">,
  ): Promise<GlacierMeasurement | null> {
    try {
      const result = await sql`
        INSERT INTO glacier_measurements 
        (glacier_id, measurement_date, ice_volume_km3, surface_area_km2, melt_rate_mm_year, 
         temperature_avg_c, precipitation_mm, confidence_score)
        VALUES (${measurement.glacier_id}, ${measurement.measurement_date}, ${measurement.ice_volume_km3},
                ${measurement.surface_area_km2}, ${measurement.melt_rate_mm_year}, ${measurement.temperature_avg_c},
                ${measurement.precipitation_mm}, ${measurement.confidence_score})
        RETURNING *
      `
      return result[0] as GlacierMeasurement
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  async getGlacierImages(glacierId?: string): Promise<GlacierImage[]> {
    try {
      const result = glacierId
        ? await sql`SELECT * FROM glacier_images WHERE glacier_id = ${glacierId} ORDER BY uploaded_at DESC`
        : await sql`SELECT * FROM glacier_images ORDER BY uploaded_at DESC`
      return result as GlacierImage[]
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  async createGlacierImage(image: Omit<GlacierImage, "id" | "uploaded_at">): Promise<GlacierImage | null> {
    try {
      const result = await sql`
        INSERT INTO glacier_images (glacier_id, image_url, analysis_status, analysis_results, processed_at)
        VALUES (${image.glacier_id}, ${image.image_url}, ${image.analysis_status}, 
                ${JSON.stringify(image.analysis_results)}, ${image.processed_at})
        RETURNING *
      `
      return result[0] as GlacierImage
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  async updateGlacierImageStatus(id: string, status: GlacierImage["analysis_status"], results?: any): Promise<boolean> {
    try {
      await sql`
        UPDATE glacier_images 
        SET analysis_status = ${status}, 
            analysis_results = ${results ? JSON.stringify(results) : null},
            processed_at = ${status === "completed" ? new Date().toISOString() : null}
        WHERE id = ${id}
      `
      return true
    } catch (error) {
      console.error("Database error:", error)
      return false
    }
  }

  async getAlerts(isActive?: boolean): Promise<(Alert & { glacier_name: string })[]> {
    try {
      const result = await sql`
        SELECT a.*, g.name as glacier_name
        FROM alerts a
        JOIN glaciers g ON a.glacier_id = g.id
        ${isActive !== undefined ? sql`WHERE a.is_active = ${isActive}` : sql``}
        ORDER BY a.created_at DESC
      `
      return result as (Alert & { glacier_name: string })[]
    } catch (error) {
      console.error("Database error:", error)
      return []
    }
  }

  async createAlert(alert: Omit<Alert, "id" | "created_at">): Promise<Alert | null> {
    try {
      const result = await sql`
        INSERT INTO alerts (glacier_id, alert_type, severity, message, is_active, resolved_at)
        VALUES (${alert.glacier_id}, ${alert.alert_type}, ${alert.severity}, 
                ${alert.message}, ${alert.is_active}, ${alert.resolved_at})
        RETURNING *
      `
      return result[0] as Alert
    } catch (error) {
      console.error("Database error:", error)
      return null
    }
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<boolean> {
    try {
      const setClause = Object.entries(updates)
        .map(([key, value]) => `${key} = ${value}`)
        .join(", ")

      await sql`UPDATE alerts SET ${sql.unsafe(setClause)} WHERE id = ${id}`
      return true
    } catch (error) {
      console.error("Database error:", error)
      return false
    }
  }

  async getStats() {
    try {
      const [glaciers, measurements, images, alerts] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM glaciers`,
        sql`SELECT COUNT(*) as count FROM glacier_measurements`,
        sql`SELECT COUNT(*) as count FROM glacier_images`,
        sql`SELECT COUNT(*) as count FROM alerts WHERE is_active = true`,
      ])

      return {
        totalGlaciers: Number(glaciers[0]?.count || 0),
        totalMeasurements: Number(measurements[0]?.count || 0),
        totalImages: Number(images[0]?.count || 0),
        activeAlerts: Number(alerts[0]?.count || 0),
      }
    } catch (error) {
      console.error("Database error:", error)
      return {
        totalGlaciers: 0,
        totalMeasurements: 0,
        totalImages: 0,
        activeAlerts: 0,
      }
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; stats?: any }> {
    try {
      const result = await sql`SELECT NOW() as current_time`
      const stats = await this.getStats()

      return {
        success: true,
        message: "Database connection successful",
        stats,
      }
    } catch (error) {
      return {
        success: false,
        message: `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }
}

export const db = new Database()
