import type { NextApiRequest, NextApiResponse } from "next"

// Mock analysis data for testing
const mockAnalysisData = {
  "mock-1": {
    id: "mock-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    analysisDate: "2024-01-15T10:30:00Z",
    status: "completed",
    confidence: 0.92,
    healthScore: 3.2,
    riskLevel: "high",
    metrics: {
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
    historicalData: {
      iceVolume: [
        { date: "2020-01-01", value: 3.5 },
        { date: "2021-01-01", value: 3.3 },
        { date: "2022-01-01", value: 3.1 },
        { date: "2023-01-01", value: 2.9 },
        { date: "2024-01-01", value: 2.8 },
      ],
      surfaceArea: [
        { date: "2020-01-01", value: 38.2 },
        { date: "2021-01-01", value: 36.8 },
        { date: "2022-01-01", value: 35.1 },
        { date: "2023-01-01", value: 33.4 },
        { date: "2024-01-01", value: 32.1 },
      ],
      meltRate: [
        { date: "2020-01-01", value: 0.8 },
        { date: "2021-01-01", value: 0.9 },
        { date: "2022-01-01", value: 1.0 },
        { date: "2023-01-01", value: 1.1 },
        { date: "2024-01-01", value: 1.2 },
      ],
    },
    predictions: {
      oneYear: { iceVolume: 2.6, confidence: 0.89 },
      fiveYear: { iceVolume: 2.1, confidence: 0.75 },
      tenYear: { iceVolume: 1.5, confidence: 0.62 },
    },
    environmentalFactors: {
      avgTemperature: 8.3,
      temperatureChange: 1.8,
      precipitation: 2800,
      precipitationChange: -12.5,
      seasonalVariation: "high",
    },
    comparisonData: {
      regional: [
        { name: "Fox Glacier", value: 2.1, change: -18.2 },
        { name: "Tasman Glacier", value: 15.8, change: -9.3 },
        { name: "Hooker Glacier", value: 1.9, change: -14.7 },
      ],
      global: {
        averageChange: -11.2,
        percentile: 78,
      },
    },
  },
  "mock-2": {
    id: "mock-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    analysisDate: "2024-01-14T14:20:00Z",
    status: "completed",
    confidence: 0.88,
    healthScore: 7.8,
    riskLevel: "low",
    metrics: {
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
        change: 1.3,
        unit: "m",
        trend: "stable",
      },
    },
    historicalData: {
      iceVolume: [
        { date: "2020-01-01", value: 191.2 },
        { date: "2021-01-01", value: 192.8 },
        { date: "2022-01-01", value: 194.1 },
        { date: "2023-01-01", value: 194.9 },
        { date: "2024-01-01", value: 195.2 },
      ],
      surfaceArea: [
        { date: "2020-01-01", value: 256.1 },
        { date: "2021-01-01", value: 257.2 },
        { date: "2022-01-01", value: 257.8 },
        { date: "2023-01-01", value: 258.0 },
        { date: "2024-01-01", value: 258.3 },
      ],
      meltRate: [
        { date: "2020-01-01", value: 0.35 },
        { date: "2021-01-01", value: 0.33 },
        { date: "2022-01-01", value: 0.32 },
        { date: "2023-01-01", value: 0.31 },
        { date: "2024-01-01", value: 0.3 },
      ],
    },
    predictions: {
      oneYear: { iceVolume: 195.8, confidence: 0.91 },
      fiveYear: { iceVolume: 197.2, confidence: 0.82 },
      tenYear: { iceVolume: 198.5, confidence: 0.71 },
    },
    environmentalFactors: {
      avgTemperature: 2.1,
      temperatureChange: 0.8,
      precipitation: 800,
      precipitationChange: 5.2,
      seasonalVariation: "moderate",
    },
    comparisonData: {
      regional: [
        { name: "Upsala Glacier", value: 45.2, change: -22.1 },
        { name: "Spegazzini Glacier", value: 32.8, change: -8.9 },
        { name: "Viedma Glacier", value: 978.1, change: -15.3 },
      ],
      global: {
        averageChange: -11.2,
        percentile: 15,
      },
    },
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Analysis ID is required" })
  }

  const analysisData = mockAnalysisData[id as keyof typeof mockAnalysisData]

  if (!analysisData) {
    return res.status(404).json({ message: "Analysis not found" })
  }

  res.status(200).json({
    success: true,
    data: analysisData,
  })
}
