import type { NextApiRequest, NextApiResponse } from "next"

// Mock analysis data
const mockAnalyses = {
  "mock-1": {
    id: "mock-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    analysisDate: "2024-01-15T10:30:00Z",
    status: "completed",
    confidence: 0.92,
    healthScore: 3.2,
    riskLevel: "high",
    keyMetrics: {
      iceVolume: {
        current: 2.8,
        change: -15.3,
        unit: "km³",
        trend: "declining",
      },
      surfaceArea: {
        current: 32.1,
        change: -8.7,
        unit: "km²",
        trend: "declining",
      },
      meltRate: {
        current: 1.2,
        change: 23.5,
        unit: "m/year",
        trend: "increasing",
      },
      thickness: {
        current: 87.3,
        change: -12.1,
        unit: "m",
        trend: "declining",
      },
    },
    historicalData: [
      { date: "2020-01-01", iceVolume: 3.3, surfaceArea: 35.2, meltRate: 0.8, thickness: 99.1 },
      { date: "2021-01-01", iceVolume: 3.1, surfaceArea: 34.1, meltRate: 0.9, thickness: 95.7 },
      { date: "2022-01-01", iceVolume: 2.9, surfaceArea: 33.5, meltRate: 1.0, thickness: 91.2 },
      { date: "2023-01-01", iceVolume: 2.8, surfaceArea: 32.8, meltRate: 1.1, thickness: 88.9 },
      { date: "2024-01-01", iceVolume: 2.8, surfaceArea: 32.1, meltRate: 1.2, thickness: 87.3 },
    ],
    predictions: {
      oneYear: { iceVolume: 2.6, surfaceArea: 31.2, confidence: 0.89 },
      fiveYear: { iceVolume: 2.1, surfaceArea: 28.5, confidence: 0.72 },
      tenYear: { iceVolume: 1.5, surfaceArea: 24.8, confidence: 0.58 },
    },
    environmentalFactors: {
      avgTemperature: 8.2,
      temperatureChange: 1.8,
      precipitation: 2800,
      precipitationChange: -12.3,
      seasonalVariation: "high",
    },
    comparisonData: {
      regional: {
        avgHealthScore: 4.1,
        avgVolumeChange: -8.2,
        totalGlaciers: 23,
      },
      global: {
        avgHealthScore: 5.3,
        avgVolumeChange: -5.1,
        totalGlaciers: 198000,
      },
    },
    alerts: [
      {
        type: "critical",
        message: "Accelerated ice loss detected in lower elevation areas",
        date: "2024-01-10T08:00:00Z",
      },
      {
        type: "warning",
        message: "Unusual melt patterns observed in recent satellite imagery",
        date: "2024-01-08T14:30:00Z",
      },
    ],
  },
  "mock-2": {
    id: "mock-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    analysisDate: "2024-01-14T15:45:00Z",
    status: "completed",
    confidence: 0.95,
    healthScore: 7.8,
    riskLevel: "low",
    keyMetrics: {
      iceVolume: {
        current: 195.2,
        change: 2.1,
        unit: "km³",
        trend: "stable",
      },
      surfaceArea: {
        current: 258.3,
        change: 0.8,
        unit: "km²",
        trend: "stable",
      },
      meltRate: {
        current: 0.3,
        change: -5.2,
        unit: "m/year",
        trend: "decreasing",
      },
      thickness: {
        current: 756.1,
        change: 1.2,
        unit: "m",
        trend: "stable",
      },
    },
    historicalData: [
      { date: "2020-01-01", iceVolume: 191.1, surfaceArea: 256.8, meltRate: 0.4, thickness: 744.2 },
      { date: "2021-01-01", iceVolume: 192.8, surfaceArea: 257.1, meltRate: 0.35, thickness: 748.9 },
      { date: "2022-01-01", iceVolume: 194.2, surfaceArea: 257.9, meltRate: 0.32, thickness: 752.3 },
      { date: "2023-01-01", iceVolume: 194.8, surfaceArea: 258.1, meltRate: 0.31, thickness: 754.7 },
      { date: "2024-01-01", iceVolume: 195.2, surfaceArea: 258.3, meltRate: 0.3, thickness: 756.1 },
    ],
    predictions: {
      oneYear: { iceVolume: 195.8, surfaceArea: 258.7, confidence: 0.93 },
      fiveYear: { iceVolume: 197.1, surfaceArea: 259.8, confidence: 0.81 },
      tenYear: { iceVolume: 198.5, surfaceArea: 261.2, confidence: 0.69 },
    },
    environmentalFactors: {
      avgTemperature: 2.1,
      temperatureChange: 0.8,
      precipitation: 800,
      precipitationChange: 5.2,
      seasonalVariation: "moderate",
    },
    comparisonData: {
      regional: {
        avgHealthScore: 6.2,
        avgVolumeChange: -2.1,
        totalGlaciers: 48,
      },
      global: {
        avgHealthScore: 5.3,
        avgVolumeChange: -5.1,
        totalGlaciers: 198000,
      },
    },
    alerts: [],
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    const analysis = mockAnalyses[id as string]

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" })
    }

    return res.status(200).json(analysis)
  }

  res.setHeader("Allow", ["GET"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
