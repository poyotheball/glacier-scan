import type { NextApiRequest, NextApiResponse } from "next"

// Mock glacier images data
const mockGlacierImages = [
  {
    id: "mock-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    uploadDate: "2024-01-15T10:30:00Z",
    status: "completed",
    confidence: 0.92,
    healthScore: 3.2,
    riskLevel: "high",
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "mock-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    uploadDate: "2024-01-14T15:45:00Z",
    status: "completed",
    confidence: 0.95,
    healthScore: 7.8,
    riskLevel: "low",
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "mock-3",
    glacierName: "Glacier Bay",
    location: "Alaska, USA",
    uploadDate: "2024-01-13T09:15:00Z",
    status: "processing",
    confidence: null,
    healthScore: null,
    riskLevel: null,
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "mock-4",
    glacierName: "Vatnajökull",
    location: "Iceland",
    uploadDate: "2024-01-12T14:20:00Z",
    status: "pending",
    confidence: null,
    healthScore: null,
    riskLevel: null,
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "mock-5",
    glacierName: "Athabasca Glacier",
    location: "Canada",
    uploadDate: "2024-01-11T11:00:00Z",
    status: "failed",
    confidence: null,
    healthScore: null,
    riskLevel: null,
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
    error: "Image quality too low for analysis",
  },
  {
    id: "mock-6",
    glacierName: "Mer de Glace",
    location: "France",
    uploadDate: "2024-01-10T16:30:00Z",
    status: "completed",
    confidence: 0.88,
    healthScore: 4.5,
    riskLevel: "medium",
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { page = "1", limit = "10", status } = req.query

    let filteredImages = mockGlacierImages

    // Filter by status if provided
    if (status && status !== "all") {
      filteredImages = mockGlacierImages.filter((img) => img.status === status)
    }

    // Pagination
    const pageNum = Number.parseInt(page as string)
    const limitNum = Number.parseInt(limit as string)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum

    const paginatedImages = filteredImages.slice(startIndex, endIndex)

    return res.status(200).json({
      images: paginatedImages,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredImages.length / limitNum),
        totalItems: filteredImages.length,
        hasNext: endIndex < filteredImages.length,
        hasPrev: pageNum > 1,
      },
    })
  }

  if (req.method === "POST") {
    // Mock creating a new glacier image analysis
    const newImage = {
      id: `mock-${Date.now()}`,
      glacierName: req.body.glacierName || "Unknown Glacier",
      location: req.body.location || "Unknown Location",
      uploadDate: new Date().toISOString(),
      status: "pending",
      confidence: null,
      healthScore: null,
      riskLevel: null,
      imageUrl: req.body.imageUrl || "/placeholder.jpg",
      thumbnailUrl: req.body.thumbnailUrl || "/placeholder.jpg",
    }

    return res.status(201).json(newImage)
  }

  res.setHeader("Allow", ["GET", "POST"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
