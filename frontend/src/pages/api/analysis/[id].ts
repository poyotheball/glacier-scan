import type { NextApiRequest, NextApiResponse } from "next"

interface AnalysisData {
  id: string
  glacierName: string
  location: string
  analysisDate: string
  status: "stable" | "retreating" | "advancing" | "critical"
  healthScore: number
  metrics: {
    iceCoverage: number
    volume: number
    retreatRate: number
    temperature: number
    precipitation: number
  }
  historicalData: Array<{
    date: string
    iceCoverage: number
    volume: number
    temperature: number
  }>
  recommendations: string[]
  images: Array<{
    id: string
    url: string
    caption: string
    date: string
  }>
}

const mockAnalysisData: Record<string, AnalysisData> = {
  "mock-1": {
    id: "mock-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    analysisDate: "2024-01-15T10:30:00Z",
    status: "retreating",
    healthScore: 65,
    metrics: {
      iceCoverage: 78.5,
      volume: 2.4,
      retreatRate: 12.3,
      temperature: -2.1,
      precipitation: 1250,
    },
    historicalData: [
      { date: "2020-01", iceCoverage: 85.2, volume: 2.8, temperature: -2.8 },
      { date: "2021-01", iceCoverage: 82.1, volume: 2.6, temperature: -2.5 },
      { date: "2022-01", iceCoverage: 80.3, volume: 2.5, temperature: -2.3 },
      { date: "2023-01", iceCoverage: 79.1, volume: 2.45, temperature: -2.2 },
      { date: "2024-01", iceCoverage: 78.5, volume: 2.4, temperature: -2.1 },
    ],
    recommendations: [
      "Monitor terminus position monthly",
      "Install additional temperature sensors",
      "Increase observation frequency during summer months",
      "Coordinate with local tourism operators for access restrictions",
    ],
    images: [
      {
        id: "img-1",
        url: "/placeholder.svg?height=300&width=400",
        caption: "Current glacier terminus - January 2024",
        date: "2024-01-15",
      },
      {
        id: "img-2",
        url: "/placeholder.svg?height=300&width=400",
        caption: "Comparison with 2020 position",
        date: "2024-01-15",
      },
    ],
  },
  "mock-2": {
    id: "mock-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    analysisDate: "2024-01-14T14:20:00Z",
    status: "stable",
    healthScore: 82,
    metrics: {
      iceCoverage: 94.2,
      volume: 28.7,
      retreatRate: 2.1,
      temperature: -3.4,
      precipitation: 800,
    },
    historicalData: [
      { date: "2020-01", iceCoverage: 93.8, volume: 28.5, temperature: -3.6 },
      { date: "2021-01", iceCoverage: 94.1, volume: 28.6, temperature: -3.5 },
      { date: "2022-01", iceCoverage: 94.0, volume: 28.65, temperature: -3.4 },
      { date: "2023-01", iceCoverage: 94.1, volume: 28.68, temperature: -3.4 },
      { date: "2024-01", iceCoverage: 94.2, volume: 28.7, temperature: -3.4 },
    ],
    recommendations: [
      "Continue current monitoring schedule",
      "Document calving events",
      "Maintain tourist viewing platforms",
      "Study ice dynamics for research purposes",
    ],
    images: [
      {
        id: "img-3",
        url: "/placeholder.svg?height=300&width=400",
        caption: "Stable terminus position - January 2024",
        date: "2024-01-14",
      },
      {
        id: "img-4",
        url: "/placeholder.svg?height=300&width=400",
        caption: "Ice calving activity",
        date: "2024-01-14",
      },
    ],
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const analysisData = mockAnalysisData[id as string]

  if (!analysisData) {
    return res.status(404).json({ message: "Analysis not found" })
  }

  res.status(200).json(analysisData)
}
