import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test database connection
    const { data: glaciers, error } = await supabase.from("glaciers").select("id, name").limit(1)

    if (error) {
      throw error
    }

    res.status(200).json({
      status: "success",
      message: "Database connection successful",
      sampleData: glaciers,
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
