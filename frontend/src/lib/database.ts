import { Pool } from "pg"

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Types
export interface Glacier {
  id: string
  name: string
  region: string
  country: string
  location: {
    latitude: number
    longitude: number
  }
  created_at?: string
  updated_at?: string
  measurements?: Measurement[]
  images?: GlacierImage[]
}

export interface Measurement {
  id: string
  glacier_id: string
  date: string
  ice_volume: number
  surface_area: number
  melt_rate: number
  elevation_change?: number
  created_at?: string
}

export interface GlacierImage {
  id: string
  glacier_id: string | null
  image_url: string
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results?: any
  created_at?: string
  updated_at?: string
}

export interface Alert {
  id: string
  glacier_id: string
  alert_type: "critical" | "warning" | "info"
  message: string
  severity: number
  is_active: boolean
  created_at: string
  glacier_name?: string
}

// Database operations class
class Database {
  private pool: Pool

  constructor() {
    this.pool = pool
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect()
      await client.query("SELECT NOW()")
      client.release()
      return true
    } catch (error) {
      console.error("Database connection failed:", error)
      return false
    }
  }

  // Glacier operations
  async getGlaciers(): Promise<Glacier[]> {
    const client = await this.pool.connect()
    try {
      const query = `
        SELECT 
          g.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', m.id,
                'date', m.date,
                'ice_volume', m.ice_volume,
                'surface_area', m.surface_area,
                'melt_rate', m.melt_rate,
                'elevation_change', m.elevation_change
              ) ORDER BY m.date DESC
            ) FILTER (WHERE m.id IS NOT NULL), 
            '[]'
          ) as measurements,
          COALESCE(
            json_agg(
              json_build_object(
                'id', gi.id,
                'image_url', gi.image_url,
                'upload_date', gi.upload_date,
                'analysis_status', gi.analysis_status,
                'analysis_results', gi.analysis_results
              ) ORDER BY gi.upload_date DESC
            ) FILTER (WHERE gi.id IS NOT NULL), 
            '[]'
          ) as images
        FROM glaciers g
        LEFT JOIN measurements m ON g.id = m.glacier_id
        LEFT JOIN glacier_images gi ON g.id = gi.glacier_id
        GROUP BY g.id
        ORDER BY g.name
      `

      const result = await client.query(query)
      return result.rows.map((row) => ({
        ...row,
        location: typeof row.location === "string" ? JSON.parse(row.location) : row.location,
      }))
    } finally {
      client.release()
    }
  }

  async getGlacierById(id: string): Promise<Glacier | null> {
    const client = await this.pool.connect()
    try {
      const query = `
        SELECT 
          g.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', m.id,
                'date', m.date,
                'ice_volume', m.ice_volume,
                'surface_area', m.surface_area,
                'melt_rate', m.melt_rate,
                'elevation_change', m.elevation_change
              ) ORDER BY m.date DESC
            ) FILTER (WHERE m.id IS NOT NULL), 
            '[]'
          ) as measurements,
          COALESCE(
            json_agg(
              json_build_object(
                'id', gi.id,
                'image_url', gi.image_url,
                'upload_date', gi.upload_date,
                'analysis_status', gi.analysis_status,
                'analysis_results', gi.analysis_results
              ) ORDER BY gi.upload_date DESC
            ) FILTER (WHERE gi.id IS NOT NULL), 
            '[]'
          ) as images
        FROM glaciers g
        LEFT JOIN measurements m ON g.id = m.glacier_id
        LEFT JOIN glacier_images gi ON g.id = gi.glacier_id
        WHERE g.id = $1
        GROUP BY g.id
      `

      const result = await client.query(query, [id])
      if (result.rows.length === 0) return null

      const row = result.rows[0]
      return {
        ...row,
        location: typeof row.location === "string" ? JSON.parse(row.location) : row.location,
      }
    } finally {
      client.release()
    }
  }

  async createGlacier(glacier: Omit<Glacier, "id" | "created_at" | "updated_at">): Promise<Glacier> {
    const client = await this.pool.connect()
    try {
      const query = `
        INSERT INTO glaciers (name, region, country, location)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `

      const result = await client.query(query, [
        glacier.name,
        glacier.region,
        glacier.country,
        JSON.stringify(glacier.location),
      ])

      const row = result.rows[0]
      return {
        ...row,
        location: typeof row.location === "string" ? JSON.parse(row.location) : row.location,
      }
    } finally {
      client.release()
    }
  }

  // Measurement operations
  async createMeasurement(measurement: Omit<Measurement, "id" | "created_at">): Promise<Measurement> {
    const client = await this.pool.connect()
    try {
      const query = `
        INSERT INTO measurements (glacier_id, date, ice_volume, surface_area, melt_rate, elevation_change)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `

      const result = await client.query(query, [
        measurement.glacier_id,
        measurement.date,
        measurement.ice_volume,
        measurement.surface_area,
        measurement.melt_rate,
        measurement.elevation_change || 0,
      ])

      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async getMeasurementsByGlacierId(glacierId: string): Promise<Measurement[]> {
    const client = await this.pool.connect()
    try {
      const query = `
        SELECT * FROM measurements 
        WHERE glacier_id = $1 
        ORDER BY date DESC
      `

      const result = await client.query(query, [glacierId])
      return result.rows
    } finally {
      client.release()
    }
  }

  // Glacier Image operations
  async createGlacierImage(image: Omit<GlacierImage, "id" | "created_at" | "updated_at">): Promise<GlacierImage> {
    const client = await this.pool.connect()
    try {
      const query = `
        INSERT INTO glacier_images (glacier_id, image_url, upload_date, analysis_status, analysis_results)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `

      const result = await client.query(query, [
        image.glacier_id,
        image.image_url,
        image.upload_date,
        image.analysis_status,
        image.analysis_results ? JSON.stringify(image.analysis_results) : null,
      ])

      const row = result.rows[0]
      return {
        ...row,
        analysis_results: row.analysis_results ? JSON.parse(row.analysis_results) : null,
      }
    } finally {
      client.release()
    }
  }

  async getGlacierImageById(id: string): Promise<GlacierImage | null> {
    const client = await this.pool.connect()
    try {
      const query = `
        SELECT gi.*, g.name as glacier_name, g.region, g.country, g.location
        FROM glacier_images gi
        LEFT JOIN glaciers g ON gi.glacier_id = g.id
        WHERE gi.id = $1
      `

      const result = await client.query(query, [id])
      if (result.rows.length === 0) return null

      const row = result.rows[0]
      return {
        ...row,
        analysis_results: row.analysis_results ? JSON.parse(row.analysis_results) : null,
        glacier: row.glacier_name
          ? {
              name: row.glacier_name,
              region: row.region,
              country: row.country,
              location: typeof row.location === "string" ? JSON.parse(row.location) : row.location,
            }
          : undefined,
      }
    } finally {
      client.release()
    }
  }

  async updateGlacierImageStatus(id: string, status: string, results?: any): Promise<GlacierImage | null> {
    const client = await this.pool.connect()
    try {
      const query = `
        UPDATE glacier_images 
        SET analysis_status = $2, analysis_results = $3, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `

      const result = await client.query(query, [id, status, results ? JSON.stringify(results) : null])

      if (result.rows.length === 0) return null

      const row = result.rows[0]
      return {
        ...row,
        analysis_results: row.analysis_results ? JSON.parse(row.analysis_results) : null,
      }
    } finally {
      client.release()
    }
  }

  // Alert operations
  async getAlerts(): Promise<Alert[]> {
    const client = await this.pool.connect()
    try {
      const query = `
        SELECT a.*, g.name as glacier_name
        FROM alerts a
        LEFT JOIN glaciers g ON a.glacier_id = g.id
        WHERE a.is_active = true
        ORDER BY a.created_at DESC
      `

      const result = await client.query(query)
      return result.rows
    } finally {
      client.release()
    }
  }

  async createAlert(alert: Omit<Alert, "id" | "created_at">): Promise<Alert> {
    const client = await this.pool.connect()
    try {
      const query = `
        INSERT INTO alerts (glacier_id, alert_type, message, severity, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `

      const result = await client.query(query, [
        alert.glacier_id,
        alert.alert_type,
        alert.message,
        alert.severity,
        alert.is_active,
      ])

      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async updateAlertStatus(id: string, isActive: boolean): Promise<Alert | null> {
    const client = await this.pool.connect()
    try {
      const query = `
        UPDATE alerts 
        SET is_active = $2
        WHERE id = $1
        RETURNING *
      `

      const result = await client.query(query, [id, isActive])
      return result.rows.length > 0 ? result.rows[0] : null
    } finally {
      client.release()
    }
  }

  // Statistics
  async getGlacierStats(): Promise<{
    totalGlaciers: number
    totalMeasurements: number
    totalImages: number
    activeAlerts: number
  }> {
    const client = await this.pool.connect()
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM glaciers) as total_glaciers,
          (SELECT COUNT(*) FROM measurements) as total_measurements,
          (SELECT COUNT(*) FROM glacier_images) as total_images,
          (SELECT COUNT(*) FROM alerts WHERE is_active = true) as active_alerts
      `

      const result = await client.query(query)
      const row = result.rows[0]

      return {
        totalGlaciers: Number.parseInt(row.total_glaciers),
        totalMeasurements: Number.parseInt(row.total_measurements),
        totalImages: Number.parseInt(row.total_images),
        activeAlerts: Number.parseInt(row.active_alerts),
      }
    } finally {
      client.release()
    }
  }

  // Close pool connection
  async close(): Promise<void> {
    await this.pool.end()
  }
}

// Export singleton instance
export const db = new Database()
export default db
