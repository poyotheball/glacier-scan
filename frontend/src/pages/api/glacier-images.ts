import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Get all glacier images with their associated glacier data
      const client = await db.pool.connect()

      const query = `
        SELECT 
          gi.*,
          g.name as glacier_name,
          g.region,
          g.country,
          g.location
        FROM glacier_images gi
        LEFT JOIN glaciers g ON gi.glacier_id = g.id
        ORDER BY gi.upload_date DESC
      `

      const result = await client.query(query)
      client.release()

      const images = result.rows.map((row) => ({
        id: row.id,
        glacier_id: row.glacier_id,
        image_url: row.image_url,
        upload_date: row.upload_date,
        analysis_status: row.analysis_status,
        analysis_results: row.analysis_results ? JSON.parse(row.analysis_results) : null,
        glacier: row.glacier_name
          ? {
              name: row.glacier_name,
              region: row.region,
              country: row.country,
              location: typeof row.location === "string" ? JSON.parse(row.location) : row.location,
            }
          : null,
      }))

      res.status(200).json(images)
    } catch (error) {
      console.error("Error fetching glacier images:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
