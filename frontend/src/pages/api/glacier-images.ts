import type { NextApiRequest, NextApiResponse } from "next"

interface GlacierImage {
  id: string
  glacierId: string
  url: string
  caption: string
  date: string
  type: "satellite" | "ground" | "aerial"
  coordinates?: {
    lat: number
    lng: number
  }
}

const mockImages: GlacierImage[] = [
  {
    id: "img-1",
    glacierId: "mock-1",
    url: "/placeholder.svg?height=400&width=600",
    caption: "Franz Josef Glacier - Current terminus position",
    date: "2024-01-15",
    type: "satellite",
    coordinates: { lat: -43.4668, lng: 170.1953 },
  },
  {
    id: "img-2",
    glacierId: "mock-1",
    url: "/placeholder.svg?height=400&width=600",
    caption: "Franz Josef Glacier - Historical comparison",
    date: "2024-01-15",
    type: "aerial",
    coordinates: { lat: -43.4668, lng: 170.1953 },
  },
  {
    id: "img-3",
    glacierId: "mock-2",
    url: "/placeholder.svg?height=400&width=600",
    caption: "Perito Moreno Glacier - Stable terminus",
    date: "2024-01-14",
    type: "ground",
    coordinates: { lat: -50.4648, lng: -73.0311 },
  },
  {
    id: "img-4",
    glacierId: "mock-2",
    url: "/placeholder.svg?height=400&width=600",
    caption: "Perito Moreno Glacier - Ice calving event",
    date: "2024-01-14",
    type: "aerial",
    coordinates: { lat: -50.4648, lng: -73.0311 },
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { glacierId, type, limit = "10" } = req.query

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  let filteredImages = mockImages

  // Filter by glacier ID if provided
  if (glacierId) {
    filteredImages = filteredImages.filter((img) => img.glacierId === glacierId)
  }

  // Filter by type if provided
  if (type && type !== "all") {
    filteredImages = filteredImages.filter((img) => img.type === type)
  }

  // Apply limit
  const limitNum = Number.parseInt(limit as string, 10)
  if (!isNaN(limitNum)) {
    filteredImages = filteredImages.slice(0, limitNum)
  }

  res.status(200).json({
    images: filteredImages,
    total: filteredImages.length,
    page: 1,
    limit: limitNum,
  })
}
