import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        const alerts = await db.getAlerts()
        res.status(200).json({ alerts })
        break

      case "POST":
        const { glacier_id, alert_type, message, severity } = req.body

        if (!glacier_id || !alert_type || !message) {
          return res.status(400).json({
            error: "Missing required fields: glacier_id, alert_type, message",
          })
        }

        const newAlert = await db.createAlert({
          glacier_id,
          alert_type,
          message,
          severity: severity || 5,
          is_active: true,
        })

        res.status(201).json({ alert: newAlert })
        break

      case "PATCH":
        const { id, is_active } = req.body

        if (!id || typeof is_active !== "boolean") {
          return res.status(400).json({
            error: "Missing required fields: id, is_active",
          })
        }

        const updatedAlert = await db.updateAlertStatus(id, is_active)

        if (!updatedAlert) {
          return res.status(404).json({ error: "Alert not found" })
        }

        res.status(200).json({ alert: updatedAlert })
        break

      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH"])
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
