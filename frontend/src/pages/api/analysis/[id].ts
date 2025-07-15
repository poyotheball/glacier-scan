import type { NextApiRequest, NextApiResponse } from "next"
import { getGlacierById, getGlacierTrends } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid glacier ID" })
  }

  try {
    const glacier = await getGlacierById(id)

    if (!glacier) {
      return res.status(404).json({ error: "Glacier not found" })
    }

    const trends = await getGlacierTrends(id)

    const analysisData = {
      glacier,
      trends,
      analysis: {
        riskLevel: glacier.status,
        changeRate: calculateChangeRate(trends),
        predictions: generatePredictions(trends),
        recommendations: getRecommendations(glacier.status),
      },
    }

    res.status(200).json(analysisData)
  } catch (error) {
    console.error("Analysis API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

function calculateChangeRate(trends: any[]) {
  if (trends.length < 2) return 0

  const recent = trends[trends.length - 1]
  const previous = trends[trends.length - 2]

  return ((recent.area - previous.area) / previous.area) * 100
}

function generatePredictions(trends: any[]) {
  return {
    nextYear: {
      area: trends[trends.length - 1]?.area * 0.98,
      confidence: 85,
    },
    fiveYear: {
      area: trends[trends.length - 1]?.area * 0.9,
      confidence: 70,
    },
  }
}

function getRecommendations(status: string) {
  const recommendations = {
    healthy: ["Continue regular monitoring", "Maintain current conservation efforts", "Document seasonal variations"],
    warning: ["Increase monitoring frequency", "Implement protective measures", "Study environmental factors"],
    critical: [
      "Immediate intervention required",
      "Emergency conservation protocols",
      "Detailed impact assessment needed",
    ],
  }

  return recommendations[status as keyof typeof recommendations] || []
}
