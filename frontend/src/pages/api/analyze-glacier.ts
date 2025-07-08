import type { NextApiRequest, NextApiResponse } from "next"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { db } from "@/lib/database"

const GlacierAnalysisSchema = z.object({
  glacierName: z.string().describe('Identified glacier name or "Unknown Glacier"'),
  confidence: z.number().min(0).max(1).describe("Confidence level of identification"),
  changes: z.object({
    iceVolumeChange: z.number().describe("Percentage change in ice volume"),
    surfaceAreaChange: z.number().describe("Percentage change in surface area"),
    meltRate: z.number().describe("Estimated melt rate in meters per year"),
    elevationChange: z.number().describe("Average elevation change in meters per year"),
  }),
  confidenceIntervals: z.object({
    iceVolumeChange: z.object({
      lower: z.number(),
      upper: z.number(),
    }),
    surfaceAreaChange: z.object({
      lower: z.number(),
      upper: z.number(),
    }),
    meltRate: z.object({
      lower: z.number(),
      upper: z.number(),
    }),
  }),
  recommendations: z.array(z.string()).describe("Analysis recommendations and insights"),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { imageUrl, glacierId } = req.body

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" })
  }

  try {
    // Update status to processing
    await db.updateGlacierImageStatus(imageUrl, "processing")

    // Use AI to analyze the glacier image
    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: GlacierAnalysisSchema,
      prompt: `Analyze this glacier satellite image: ${imageUrl}
      
      Please provide:
      1. Glacier identification (if recognizable)
      2. Estimated changes in ice volume, surface area, and melt rate
      3. Confidence intervals for your estimates
      4. Recommendations for further monitoring
      
      If a glacier ID is provided: ${glacierId || "None provided"}
      
      Base your analysis on visible features like:
      - Ice coverage and thickness
      - Crevasse patterns
      - Terminus position
      - Surface texture and color
      - Surrounding terrain
      
      Provide realistic estimates based on typical glacier behavior patterns.`,
    })

    // Save analysis results
    await db.updateGlacierImageStatus(imageUrl, "completed", analysis)

    // If glacier was identified and we have measurements, save them
    if (glacierId && analysis.changes) {
      await db.createMeasurement({
        glacier_id: glacierId,
        date: new Date().toISOString().split("T")[0],
        ice_volume: Math.abs(analysis.changes.iceVolumeChange),
        surface_area: Math.abs(analysis.changes.surfaceAreaChange),
        melt_rate: analysis.changes.meltRate,
      })
    }

    res.status(200).json({ success: true, analysis })
  } catch (error) {
    console.error("Analysis failed:", error)

    // Update status to failed
    await db.updateGlacierImageStatus(imageUrl, "failed")

    res.status(500).json({ error: "Analysis failed" })
  }
}
