import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const glaciers = await db.getGlaciers()
      res.status(200).json(glaciers)
    } catch (error) {
      console.error("Error fetching glaciers:", error)
      res.status(500).json({ error: "Failed to fetch glaciers" })
    }
  } else if (req.method === "POST") {
    try {
      const { name, location, region, country } = req.body

      const glacier = await db.createGlacier({
        name,
        location,
        region,
        country,
      })

      res.status(201).json(glacier)
    } catch (error) {
      console.error("Error creating glacier:", error)
      res.status(500).json({ error: "Failed to create glacier" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
