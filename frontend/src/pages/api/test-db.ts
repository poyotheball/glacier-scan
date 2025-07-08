import type { NextApiRequest, NextApiResponse } from "next"
import { query } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test database connection
    const result = await query("SELECT id, name FROM glaciers LIMIT 1")

    res.status(200).json({
      status: "success",
      message: "Database connection successful",
      sampleData: result.rows,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test failed:", error)
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
