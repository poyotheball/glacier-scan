import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { data: glaciers, error } = await supabase
        .from("glaciers")
        .select(`
          *,
          measurements (
            id,
            date,
            ice_volume,
            surface_area,
            melt_rate
          ),
          glacier_images (
            id,
            image_url,
            upload_date,
            analysis_status,
            analysis_results
          )
        `)
        .order("name")

      if (error) throw error

      res.status(200).json(glaciers)
    } catch (error) {
      console.error("Error fetching glaciers:", error)
      res.status(500).json({ error: "Failed to fetch glaciers" })
    }
  } else if (req.method === "POST") {
    try {
      const { name, location, region, country } = req.body

      const { data: glacier, error } = await supabase
        .from("glaciers")
        .insert({
          name,
          location,
          region,
          country,
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json(glacier)
    } catch (error) {
      console.error("Error creating glacier:", error)
      res.status(500).json({ error: "Failed to create glacier" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
