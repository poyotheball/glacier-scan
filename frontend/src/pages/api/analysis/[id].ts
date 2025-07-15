import type { NextApiRequest, NextApiResponse } from "next"

// Mock analysis data for testing
const mockAnalysisData = {
  "mock-1": {
    id: "mock-1",
    glacier_id: "franz-josef",
    glacier_name: "Franz Josef Glacier",
    location: "New Zealand",
    analysis_date: "2024-01-15",
    status: "completed",
    confidence_score: 0.92,

    // Current metrics
    current_metrics: {
      ice_volume_km3: 2.8,
      surface_area_km2: 32.4,
      melt_rate_mm_year: 1250,
      health_score: 3.2,
      risk_level: "high",
    },

    // Historical data for charts
    historical_data: [
      { date: "2020-01-01", ice_volume: 3.5, surface_area: 38.2, melt_rate: 980 },
      { date: "2020-07-01", ice_volume: 3.4, surface_area: 37.8, melt_rate: 1020 },
      { date: "2021-01-01", ice_volume: 3.2, surface_area: 36.9, melt_rate: 1100 },
      { date: "2021-07-01", ice_volume: 3.1, surface_area: 36.2, melt_rate: 1150 },
      { date: "2022-01-01", ice_volume: 3.0, surface_area: 35.1, melt_rate: 1180 },
      { date: "2022-07-01", ice_volume: 2.9, surface_area: 34.6, melt_rate: 1200 },
      { date: "2023-01-01", ice_volume: 2.9, surface_area: 33.8, melt_rate: 1220 },
      { date: "2023-07-01", ice_volume: 2.8, surface_area: 33.1, melt_rate: 1240 },
      { date: "2024-01-01", ice_volume: 2.8, surface_area: 32.4, melt_rate: 1250 },
    ],

    // Predictions
    predictions: {
      one_year: { ice_volume: 2.6, surface_area: 31.2, confidence: 0.88 },
      five_year: { ice_volume: 2.1, surface_area: 27.8, confidence: 0.72 },
      ten_year: { ice_volume: 1.5, surface_area: 22.1, confidence: 0.58 },
    },

    // Environmental factors
    environmental_factors: {
      avg_temperature_c: 2.3,
      temperature_change: "+1.2°C since 2020",
      precipitation_mm: 2800,
      precipitation_change: "-15% since 2020",
      seasonal_variation: "High summer melt, moderate winter accumulation",
    },

    // Regional comparison
    regional_comparison: [
      { name: "Franz Josef", value: 3.2, status: "critical" },
      { name: "Fox Glacier", value: 4.1, status: "warning" },
      { name: "Tasman Glacier", value: 5.8, status: "stable" },
      { name: "Regional Average", value: 4.4, status: "warning" },
    ],

    // Key insights
    key_insights: [
      "Accelerating ice loss over past 2 years",
      "Surface area reduction of 15% since 2020",
      "Melt rate increased by 27% above historical average",
      "Critical threshold reached - immediate monitoring required",
    ],
  },

  "mock-2": {
    id: "mock-2",
    glacier_id: "perito-moreno",
    glacier_name: "Perito Moreno Glacier",
    location: "Argentina",
    analysis_date: "2024-01-10",
    status: "completed",
    confidence_score: 0.95,

    current_metrics: {
      ice_volume_km3: 195.2,
      surface_area_km2: 250.8,
      melt_rate_mm_year: 420,
      health_score: 7.8,
      risk_level: "low",
    },

    historical_data: [
      { date: "2020-01-01", ice_volume: 194.8, surface_area: 249.2, melt_rate: 380 },
      { date: "2020-07-01", ice_volume: 195.1, surface_area: 249.8, melt_rate: 390 },
      { date: "2021-01-01", ice_volume: 195.0, surface_area: 250.1, melt_rate: 400 },
      { date: "2021-07-01", ice_volume: 195.2, surface_area: 250.3, melt_rate: 410 },
      { date: "2022-01-01", ice_volume: 195.1, surface_area: 250.2, melt_rate: 405 },
      { date: "2022-07-01", ice_volume: 195.3, surface_area: 250.5, melt_rate: 415 },
      { date: "2023-01-01", ice_volume: 195.2, surface_area: 250.6, melt_rate: 418 },
      { date: "2023-07-01", ice_volume: 195.1, surface_area: 250.7, melt_rate: 420 },
      { date: "2024-01-01", ice_volume: 195.2, surface_area: 250.8, melt_rate: 420 },
    ],

    predictions: {
      one_year: { ice_volume: 195.0, surface_area: 250.5, confidence: 0.92 },
      five_year: { ice_volume: 194.2, surface_area: 249.8, confidence: 0.85 },
      ten_year: { ice_volume: 193.1, surface_area: 248.9, confidence: 0.78 },
    },

    environmental_factors: {
      avg_temperature_c: -2.1,
      temperature_change: "+0.3°C since 2020",
      precipitation_mm: 800,
      precipitation_change: "+5% since 2020",
      seasonal_variation: "Stable with balanced accumulation and ablation",
    },

    regional_comparison: [
      { name: "Perito Moreno", value: 7.8, status: "stable" },
      { name: "Upsala Glacier", value: 4.2, status: "warning" },
      { name: "Spegazzini Glacier", value: 5.9, status: "stable" },
      { name: "Regional Average", value: 6.0, status: "stable" },
    ],

    key_insights: [
      "Remarkably stable glacier with minimal changes",
      "Balanced ice dynamics with steady calving rate",
      "Temperature increases offset by precipitation gains",
      "Excellent example of glacier equilibrium",
    ],
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    const analysisData = mockAnalysisData[id as keyof typeof mockAnalysisData]

    if (!analysisData) {
      return res.status(404).json({ error: "Analysis not found" })
    }

    return res.status(200).json(analysisData)
  }

  res.setHeader("Allow", ["GET"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
