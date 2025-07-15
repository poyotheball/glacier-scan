import type { NextApiRequest, NextApiResponse } from "next"

interface GlacierImage {
  id: string
  glacierName: string
  uploadDate: string
  status: "completed" | "processing" | "pending" | "failed"
  analysisId: string | null
  imageUrl: string
  thumbnailUrl: string
  fileSize: number
  dimensions: { width: number; height: number }
  metadata: {
    captureDate?: string
    location?: { lat: number; lng: number }
    altitude?: number
    weather?: string
  }
}

const mockGlacierImages: GlacierImage[] = [
  {
    id: "img-1",
    glacierName: "Franz Josef Glacier",
    uploadDate: "2024-01-15T10:30:00Z",
    status: "completed",
    analysisId: "mock-1",
    imageUrl: "/placeholder.svg?height=400&width=600",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 2048576,
    dimensions: { width: 1920, height: 1080 },
    metadata: {
      captureDate: "2024-01-14",
      location: { lat: -43.4668, lng: 170.1926 },
      altitude: 300,
      weather: "Clear",
    },
  },
  {
    id: "img-2",
    glacierName: "Perito Moreno Glacier",
    uploadDate: "2024-01-12T14:20:00Z",
    status: "completed",
    analysisId: "mock-2",
    imageUrl: "/placeholder.svg?height=400&width=600",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 3145728,
    dimensions: { width: 2048, height: 1536 },
    metadata: {
      captureDate: "2024-01-11",
      location: { lat: -50.4648, lng: -73.0307 },
      altitude: 200,
      weather: "Partly Cloudy",
    },
  },
  {
    id: "img-3",
    glacierName: "Glacier Bay",
    uploadDate: "2024-01-10T09:15:00Z",
    status: "processing",
    analysisId: null,
    imageUrl: "/placeholder.svg?height=400&width=600",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 1572864,
    dimensions: { width: 1600, height: 1200 },
    metadata: {
      captureDate: "2024-01-09",
      location: { lat: 58.5, lng: -137.0 },
      altitude: 150,
      weather: "Overcast",
    },
  },
  {
    id: "img-4",
    glacierName: "Vatnajökull",
    uploadDate: "2024-01-08T16:45:00Z",
    status: "pending",
    analysisId: null,
    imageUrl: "/placeholder.svg?height=400&width=600",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 4194304,
    dimensions: { width: 2560, height: 1440 },
    metadata: {
      captureDate: "2024-01-07",
      location: { lat: 64.4, lng: -17.0 },
      altitude: 500,
      weather: "Snow",
    },
  },
  {
    id: "img-5",
    glacierName: "Mendenhall Glacier",
    uploadDate: "2024-01-05T11:30:00Z",
    status: "failed",
    analysisId: null,
    imageUrl: "/placeholder.svg?height=400&width=600",
    thumbnailUrl: "/placeholder.svg?height=150&width=200",
    fileSize: 2621440,
    dimensions: { width: 1800, height: 1200 },
    metadata: {
      captureDate: "2024-01-04",
      location: { lat: 58.4186, lng: -134.5853 },
      altitude: 100,
      weather: "Rain",
    },
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { status, limit = "10", offset = "0" } = req.query

    let filteredImages = mockGlacierImages

    // Filter by status if provided
    if (status && status !== "all") {
      filteredImages = filteredImages.filter((img) => img.status === status)
    }

    // Apply pagination
    const limitNum = Number.parseInt(limit as string)
    const offsetNum = Number.parseInt(offset as string)
    const paginatedImages = filteredImages.slice(offsetNum, offsetNum + limitNum)

    return res.status(200).json({
      images: paginatedImages,
      total: filteredImages.length,
      hasMore: offsetNum + limitNum < filteredImages.length,
    })
  }

  res.setHeader("Allow", ["GET"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
