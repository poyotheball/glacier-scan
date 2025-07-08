import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/database"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Get all glacier images from database
      const glaciers = await db.getGlaciers()

      // Extract all images from all glaciers
      const allImages = glaciers.flatMap((glacier) =>
        (glacier.images || []).map((image) => ({
          ...image,
          glacier_name: glacier.name,
          region: glacier.region,
          country: glacier.country,
          location: glacier.location,
        })),
      )

      // If no real data, generate mock data for testing
      if (allImages.length === 0) {
        const mockImages = [
          {
            id: "mock-1",
            glacier_id: "glacier-1",
            glacier_name: "Franz Josef Glacier",
            region: "West Coast",
            country: "New Zealand",
            image_url: "/placeholder.svg?height=300&width=400&text=Franz+Josef",
            upload_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            analysis_status: "completed" as const,
            analysis_results: { health_score: 6.5, risk_level: "medium" },
          },
          {
            id: "mock-2",
            glacier_id: "glacier-2",
            glacier_name: "Perito Moreno",
            region: "Patagonia",
            country: "Argentina",
            image_url: "/placeholder.svg?height=300&width=400&text=Perito+Moreno",
            upload_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            analysis_status: "completed" as const,
            analysis_results: { health_score: 8.2, risk_level: "low" },
          },
          {
            id: "mock-3",
            glacier_id: "glacier-3",
            glacier_name: "Glacier Bay",
            region: "Alaska",
            country: "United States",
            image_url: "/placeholder.svg?height=300&width=400&text=Glacier+Bay",
            upload_date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            analysis_status: "processing" as const,
            analysis_results: null,
          },
          {
            id: "mock-4",
            glacier_id: "glacier-4",
            glacier_name: "Vatnajökull",
            region: "Iceland",
            country: "Iceland",
            image_url: "/placeholder.svg?height=300&width=400&text=Vatnajokull",
            upload_date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            analysis_status: "completed" as const,
            analysis_results: { health_score: 4.1, risk_level: "critical" },
          },
          {
            id: "mock-5",
            glacier_id: "glacier-5",
            glacier_name: "Mont Blanc Glacier",
            region: "Alps",
            country: "France",
            image_url: "/placeholder.svg?height=300&width=400&text=Mont+Blanc",
            upload_date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            analysis_status: "completed" as const,
            analysis_results: { health_score: 5.8, risk_level: "high" },
          },
          {
            id: "mock-6",
            glacier_id: "glacier-6",
            glacier_name: "Athabasca Glacier",
            region: "Alberta",
            country: "Canada",
            image_url: "/placeholder.svg?height=300&width=400&text=Athabasca",
            upload_date: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
            analysis_status: "failed" as const,
            analysis_results: null,
          },
        ]

        return res.status(200).json({ images: mockImages })
      }

      res.status(200).json({ images: allImages })
    } catch (error) {
      console.error("Error fetching glacier images:", error)
      res.status(500).json({
        error: "Failed to fetch glacier images",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
