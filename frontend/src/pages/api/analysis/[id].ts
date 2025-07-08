import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

// Mock analysis data generator
function generateMockAnalysisData(imageId: string, glacierName: string, region: string, country: string) {
  const baseVolume = Math.random() * 50 + 10 // 10-60 km³
  const baseSurfaceArea = Math.random() * 100 + 20 // 20-120 km²
  const baseMeltRate = Math.random() * 3 + 0.5 // 0.5-3.5 m/yr

  // Generate historical measurements (last 5 years)
  const measurements = []
  const currentDate = new Date()

  for (let i = 60; i >= 0; i -= 6) {
    // Every 6 months for 5 years
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() - i)

    const volumeDecline = (60 - i) * 0.02 // Gradual decline over time
    const seasonalVariation = Math.sin((i / 6) * Math.PI) * 0.1 // Seasonal variation

    measurements.push({
      date: date.toISOString().split("T")[0],
      ice_volume: Math.max(0, baseVolume - volumeDecline + seasonalVariation),
      surface_area: Math.max(0, baseSurfaceArea - volumeDecline * 1.5 + seasonalVariation),
      melt_rate: baseMeltRate + volumeDecline * 0.1 + seasonalVariation * 0.2,
      elevation_change: -(volumeDecline * 2) + seasonalVariation,
    })
  }

  const currentVolume = measurements[measurements.length - 1].ice_volume
  const healthScore = Math.max(1, Math.min(10, 10 - baseMeltRate * 2))

  let riskLevel: "low" | "medium" | "high" | "critical"
  if (healthScore >= 8) riskLevel = "low"
  else if (healthScore >= 6) riskLevel = "medium"
  else if (healthScore >= 4) riskLevel = "high"
  else riskLevel = "critical"

  return {
    id: imageId,
    glacier_name: glacierName,
    region: region,
    country: country,
    location: {
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
    },
    upload_date: new Date().toISOString(),
    analysis_status: "completed" as const,
    analysis_results: {
      ice_volume: currentVolume,
      surface_area: measurements[measurements.length - 1].surface_area,
      melt_rate: measurements[measurements.length - 1].melt_rate,
      elevation_change: measurements[measurements.length - 1].elevation_change,
      health_score: Math.round(healthScore * 10) / 10,
      confidence: 0.85 + Math.random() * 0.1,
      risk_level: riskLevel,
      predictions: {
        volume_change_1yr: -(Math.random() * 5 + 2),
        volume_change_5yr: -(Math.random() * 20 + 10),
        volume_change_10yr: -(Math.random() * 40 + 25),
      },
      environmental_factors: {
        temperature_trend: Math.random() * 2 + 1,
        precipitation_change: (Math.random() - 0.5) * 20,
        seasonal_variation: Math.random() * 15 + 5,
      },
      comparison_data: {
        regional_average: baseVolume * (0.8 + Math.random() * 0.4),
        global_average: baseVolume * (0.7 + Math.random() * 0.6),
        historical_baseline: baseVolume * 1.2,
      },
    },
    image_url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(glacierName)}`,
    measurements: measurements,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid analysis ID" })
  }

  try {
    // Try to get real data from database first
    const glacierImage = await db.getGlacierImageById(id)

    if (glacierImage && glacierImage.analysis_status === "completed") {
      // Return real analysis data if available
      const analysisData = {
        id: glacierImage.id,
        glacier_name: glacierImage.glacier?.name || "Unknown Glacier",
        region: glacierImage.glacier?.region || "Unknown Region",
        country: glacierImage.glacier?.country || "Unknown Country",
        location: glacierImage.glacier?.location || { latitude: 0, longitude: 0 },
        upload_date: glacierImage.upload_date,
        analysis_status: glacierImage.analysis_status,
        analysis_results: glacierImage.analysis_results || {},
        image_url: glacierImage.image_url,
        measurements: [], // Would need to fetch from measurements table
      }

      return res.status(200).json(analysisData)
    }

    // Generate mock data for testing
    const mockGlaciers = [
      { name: "Franz Josef Glacier", region: "West Coast", country: "New Zealand" },
      { name: "Perito Moreno", region: "Patagonia", country: "Argentina" },
      { name: "Glacier Bay", region: "Alaska", country: "United States" },
      { name: "Vatnajökull", region: "Iceland", country: "Iceland" },
      { name: "Mont Blanc Glacier", region: "Alps", country: "France" },
      { name: "Athabasca Glacier", region: "Alberta", country: "Canada" },
    ]

    const randomGlacier = mockGlaciers[Math.floor(Math.random() * mockGlaciers.length)]
    const mockData = generateMockAnalysisData(id, randomGlacier.name, randomGlacier.region, randomGlacier.country)

    res.status(200).json(mockData)
  } catch (error) {
    console.error("Error fetching analysis data:", error)
    res.status(500).json({
      error: "Failed to fetch analysis data",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
