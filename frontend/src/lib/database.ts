import { Pool } from "pg"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Database query helper
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Database types
export interface Glacier {
  id: string
  name: string
  location: { latitude: number; longitude: number }
  region: string
  country: string
  created_at: string
  updated_at: string
}

export interface Measurement {
  id: string
  glacier_id: string
  date: string
  ice_volume: number
  surface_area: number
  melt_rate: number
  created_at: string
}

export interface GlacierImage {
  id: string
  glacier_id: string
  image_url: string
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results: any
  created_at: string
}

export interface Alert {
  id: string
  glacier_id: string
  alert_type: string
  alert_message: string
  created_at: string
}

// Database operations
export const db = {
  // Glaciers
  async getGlaciers() {
    const result = await query(`
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'date', m.date,
              'ice_volume', m.ice_volume,
              'surface_area', m.surface_area,
              'melt_rate', m.melt_rate
            )
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
            )
          ) FILTER (WHERE gi.id IS NOT NULL), 
          '[]'
        ) as glacier_images
      FROM glaciers g
      LEFT JOIN measurements m ON g.id = m.glacier_id
      LEFT JOIN glacier_images gi ON g.id = gi.glacier_id
      GROUP BY g.id
      ORDER BY g.name
    `)
    return result.rows
  },

  async getGlacierById(id: string) {
    const result = await query(
      `
      SELECT 
        g.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'date', m.date,
              'ice_volume', m.ice_volume,
              'surface_area', m.surface_area,
              'melt_rate', m.melt_rate
            )
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
            )
          ) FILTER (WHERE gi.id IS NOT NULL), 
          '[]'
        ) as glacier_images
      FROM glaciers g
      LEFT JOIN measurements m ON g.id = m.glacier_id
      LEFT JOIN glacier_images gi ON g.id = gi.glacier_id
      WHERE g.id = $1
      GROUP BY g.id
    `,
      [id],
    )
    return result.rows[0]
  },

  async createGlacier(glacier: Omit<Glacier, "id" | "created_at" | "updated_at">) {
    const result = await query(
      `
      INSERT INTO glaciers (name, location, region, country)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [glacier.name, JSON.stringify(glacier.location), glacier.region, glacier.country],
    )
    return result.rows[0]
  },

  // Measurements
  async createMeasurement(measurement: Omit<Measurement, "id" | "created_at">) {
    const result = await query(
      `
      INSERT INTO measurements (glacier_id, date, ice_volume, surface_area, melt_rate)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [
        measurement.glacier_id,
        measurement.date,
        measurement.ice_volume,
        measurement.surface_area,
        measurement.melt_rate,
      ],
    )
    return result.rows[0]
  },

  // Glacier Images
  async createGlacierImage(image: Omit<GlacierImage, "id" | "created_at">) {
    const result = await query(
      `
      INSERT INTO glacier_images (glacier_id, image_url, upload_date, analysis_status, analysis_results)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [
        image.glacier_id,
        image.image_url,
        image.upload_date,
        image.analysis_status,
        JSON.stringify(image.analysis_results),
      ],
    )
    return result.rows[0]
  },

  async updateGlacierImageStatus(imageUrl: string, status: string, results?: any) {
    const result = await query(
      `
      UPDATE glacier_images 
      SET analysis_status = $1, analysis_results = $2
      WHERE image_url = $3
      RETURNING *
    `,
      [status, results ? JSON.stringify(results) : null, imageUrl],
    )
    return result.rows[0]
  },

  // Alerts
  async getAlerts() {
    const result = await query(`
      SELECT a.*, g.name as glacier_name
      FROM alerts a
      JOIN glaciers g ON a.glacier_id = g.id
      ORDER BY a.created_at DESC
    `)
    return result.rows
  },

  async createAlert(alert: Omit<Alert, "id" | "created_at">) {
    const result = await query(
      `
      INSERT INTO alerts (glacier_id, alert_type, alert_message)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [alert.glacier_id, alert.alert_type, alert.alert_message],
    )
    return result.rows[0]
  },
}
