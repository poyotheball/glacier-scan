import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const alerts = await db.getAlerts()
      res.status(200).json(alerts)
    } catch (error) {
      console.error("Error fetching alerts:", error)
      res.status(500).json({ error: "Failed to fetch alerts" })
    }
  } else if (req.method === "POST") {
    try {
      const { glacier_id, alert_type, alert_message } = req.body

      const alert = await db.createAlert({
        glacier_id,
        alert_type,
        alert_message,
      })

      res.status(201).json(alert)
    } catch (error) {
      console.error("Error creating alert:", error)
      res.status(500).json({ error: "Failed to create alert" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
