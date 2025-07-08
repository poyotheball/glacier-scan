import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Get glacier image data
    const imageData = await db.getGlacierImageById(id as string)

    if (!imageData) {
      return res.status(404).json({ error: "Analysis not found" })
    }

    // Mock comprehensive analysis data
    const analysisData = {
      id: imageData.id,
      glacier_name: imageData.glacier?.name || "Unknown Glacier",
      region: imageData.glacier?.region || "Unknown Region",
      country: imageData.glacier?.country || "Unknown Country",
      location: imageData.glacier?.location || { latitude: 0, longitude: 0 },
      upload_date: imageData.upload_date,
      analysis_status: imageData.analysis_status,
      image_url: imageData.image_url,
      analysis_results: imageData.analysis_results || {
        ice_volume: 45.2 + Math.random() * 20,
        surface_area: 125.8 + Math.random() * 50,
        melt_rate: 2.3 + Math.random() * 2,
        elevation_change: -1.2 + Math.random() * 0.8,
        health_score: Math.floor(Math.random() * 10) + 1,
        confidence: 0.85 + Math.random() * 0.1,
        risk_level: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
        predictions: {
          volume_change_1yr: -2.5 + Math.random() * 2,
          volume_change_5yr: -12.8 + Math.random() * 8,
          volume_change_10yr: -28.4 + Math.random() * 15,
        },
        environmental_factors: {
          temperature_trend: 1.2 + Math.random() * 1.5,
          precipitation_change: -5.2 + Math.random() * 15,
          seasonal_variation: 15.8 + Math.random() * 10,
        },
        comparison_data: {
          regional_average: 38.5 + Math.random() * 15,
          global_average: 42.1 + Math.random() * 20,
          historical_baseline: 52.3 + Math.random() * 25,
        },
      },
      measurements: generateMockMeasurements(),
    }

    res.status(200).json(analysisData)
  } catch (error) {
    console.error("Error fetching analysis data:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

function generateMockMeasurements() {
  const measurements = []
  const startDate = new Date("2020-01-01")
  const endDate = new Date()

  let currentVolume = 50 + Math.random() * 20
  let currentArea = 130 + Math.random() * 40
  let currentMeltRate = 1.5 + Math.random() * 1.5
  let currentElevation = 2500 + Math.random() * 500

  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 3)) {
    // Simulate gradual decline with seasonal variation
    const seasonalFactor = Math.sin((d.getMonth() / 12) * 2 * Math.PI) * 0.1

    currentVolume *= 0.995 + seasonalFactor + (Math.random() - 0.5) * 0.01
    currentArea *= 0.996 + seasonalFactor + (Math.random() - 0.5) * 0.01
    currentMeltRate *= 1.002 + Math.abs(seasonalFactor) + (Math.random() - 0.5) * 0.02
    currentElevation -= 0.5 + Math.random() * 1

    measurements.push({
      date: d.toISOString().split("T")[0],
      ice_volume: Math.max(0, currentVolume),
      surface_area: Math.max(0, currentArea),
      melt_rate: Math.max(0, currentMeltRate),
      elevation_change: currentElevation,
    })
  }

  return measurements
}
