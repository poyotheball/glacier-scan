import type { NextApiRequest, NextApiResponse } from "next"

interface AnalysisData {
  id: string
  glacierName: string
  location: string
  analysisDate: string
  status: "completed" | "processing" | "pending" | "failed"
  healthScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  metrics: {
    iceVolume: number
    surfaceArea: number
    meltRate: number
    confidence: number
  }
  historicalData: Array<{
    date: string
    iceVolume: number
    surfaceArea: number
    meltRate: number
  }>
  predictions: {
    oneYear: { volumeChange: number; confidence: number }
    fiveYear: { volumeChange: number; confidence: number }
    tenYear: { volumeChange: number; confidence: number }
  }
  environmentalFactors: {
    avgTemperature: number
    precipitation: number
    seasonalVariation: number
  }
  comparison: {
    regional: { name: string; healthScore: number }[]
    global: { avgHealthScore: number; percentile: number }
  }
}

const mockAnalysisData: Record<string, AnalysisData> = {
  "mock-1": {
    id: "mock-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    analysisDate: "2024-01-15",
    status: "completed",
    healthScore: 3.2,
    riskLevel: "critical",
    metrics: {
      iceVolume: 1250000,
      surfaceArea: 32.5,
      meltRate: 2.8,
      confidence: 87,
    },
    historicalData: [
      { date: "2020-01-01", iceVolume: 1800000, surfaceArea: 45.2, meltRate: 1.2 },
      { date: "2021-01-01", iceVolume: 1650000, surfaceArea: 42.1, meltRate: 1.8 },
      { date: "2022-01-01", iceVolume: 1480000, surfaceArea: 38.7, meltRate: 2.1 },
      { date: "2023-01-01", iceVolume: 1350000, surfaceArea: 35.4, meltRate: 2.5 },
      { date: "2024-01-01", iceVolume: 1250000, surfaceArea: 32.5, meltRate: 2.8 },
    ],
    predictions: {
      oneYear: { volumeChange: -12.5, confidence: 89 },
      fiveYear: { volumeChange: -45.2, confidence: 76 },
      tenYear: { volumeChange: -72.8, confidence: 62 },
    },
    environmentalFactors: {
      avgTemperature: 8.5,
      precipitation: 3200,
      seasonalVariation: 15.2,
    },
    comparison: {
      regional: [
        { name: "Fox Glacier", healthScore: 4.1 },
        { name: "Tasman Glacier", healthScore: 3.8 },
        { name: "Hooker Glacier", healthScore: 5.2 },
      ],
      global: { avgHealthScore: 6.2, percentile: 15 },
    },
  },
  "mock-2": {
    id: "mock-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    analysisDate: "2024-01-12",
    status: "completed",
    healthScore: 7.8,
    riskLevel: "low",
    metrics: {
      iceVolume: 28500000,
      surfaceArea: 250.3,
      meltRate: 0.3,
      confidence: 94,
    },
    historicalData: [
      { date: "2020-01-01", iceVolume: 28200000, surfaceArea: 248.1, meltRate: 0.2 },
      { date: "2021-01-01", iceVolume: 28350000, surfaceArea: 249.2, meltRate: 0.1 },
      { date: "2022-01-01", iceVolume: 28400000, surfaceArea: 249.8, meltRate: 0.2 },
      { date: "2023-01-01", iceVolume: 28450000, surfaceArea: 250.1, meltRate: 0.3 },
      { date: "2024-01-01", iceVolume: 28500000, surfaceArea: 250.3, meltRate: 0.3 },
    ],
    predictions: {
      oneYear: { volumeChange: 1.2, confidence: 91 },
      fiveYear: { volumeChange: 3.8, confidence: 84 },
      tenYear: { volumeChange: 5.2, confidence: 71 },
    },
    environmentalFactors: {
      avgTemperature: 2.1,
      precipitation: 800,
      seasonalVariation: 8.7,
    },
    comparison: {
      regional: [
        { name: "Upsala Glacier", healthScore: 5.9 },
        { name: "Spegazzini Glacier", healthScore: 6.8 },
        { name: "Viedma Glacier", healthScore: 6.2 },
      ],
      global: { avgHealthScore: 6.2, percentile: 85 },
    },
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    const analysisData = mockAnalysisData[id as string]

    if (!analysisData) {
      return res.status(404).json({ error: "Analysis not found" })
    }

    return res.status(200).json(analysisData)
  }

  res.setHeader("Allow", ["GET"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
