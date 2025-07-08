import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Test database connection
    const isConnected = await db.testConnection()

    if (!isConnected) {
      return res.status(500).json({
        success: false,
        error: "Database connection failed",
      })
    }

    // Get basic stats
    const stats = await db.getGlacierStats()

    res.status(200).json({
      success: true,
      message: "Database connection successful",
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    res.status(500).json({
      success: false,
      error: "Database test failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
