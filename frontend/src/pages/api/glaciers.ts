import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        const glaciers = await db.getGlaciers()
        res.status(200).json({ glaciers })
        break

      case "POST":
        const { name, region, country, location } = req.body

        if (!name || !region || !country || !location) {
          return res.status(400).json({
            error: "Missing required fields: name, region, country, location",
          })
        }

        const newGlacier = await db.createGlacier({
          name,
          region,
          country,
          location,
        })

        res.status(201).json({ glacier: newGlacier })
        break

      default:
        res.setHeader("Allow", ["GET", "POST"])
        res.status(405).json({ error: `Method ${req.method} not allowed` })
    }
  } catch (error) {
    console.error("API Error:", error)
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
