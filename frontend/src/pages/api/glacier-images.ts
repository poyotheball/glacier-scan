import type { NextApiRequest, NextApiResponse } from "next"

// Mock glacier images data for testing
const mockGlacierImages = [
  {
    id: "img-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    uploadDate: "2024-01-15T10:30:00Z",
    analysisId: "mock-1",
    status: "completed",
    confidence: 0.92,
    healthScore: 3.2,
    riskLevel: "high",
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "img-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    uploadDate: "2024-01-14T14:20:00Z",
    analysisId: "mock-2",
    status: "completed",
    confidence: 0.88,
    healthScore: 7.8,
    riskLevel: "low",
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "img-3",
    glacierName: "Glacier Bay",
    location: "Alaska, USA",
    uploadDate: "2024-01-13T09:15:00Z",
    analysisId: "mock-3",
    status: "processing",
    confidence: null,
    healthScore: null,
    riskLevel: null,
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "img-4",
    glacierName: "Vatnajökull",
    location: "Iceland",
    uploadDate: "2024-01-12T16:45:00Z",
    analysisId: "mock-4",
    status: "pending",
    confidence: null,
    healthScore: null,
    riskLevel: null,
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
  {
    id: "img-5",
    glacierName: "Athabasca Glacier",
    location: "Canada",
    uploadDate: "2024-01-11T11:30:00Z",
    analysisId: "mock-5",
    status: "failed",
    confidence: null,
    healthScore: null,
    riskLevel: null,
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
    error: "Image quality too low for analysis",
  },
  {
    id: "img-6",
    glacierName: "Mer de Glace",
    location: "France",
    uploadDate: "2024-01-10T13:20:00Z",
    analysisId: "mock-6",
    status: "completed",
    confidence: 0.85,
    healthScore: 4.1,
    riskLevel: "medium",
    imageUrl: "/placeholder.jpg",
    thumbnailUrl: "/placeholder.jpg",
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { status, limit = "10", offset = "0" } = req.query

    let filteredImages = mockGlacierImages

    // Filter by status if provided
    if (status && typeof status === "string") {
      filteredImages = filteredImages.filter((img) => img.status === status)
    }

    // Apply pagination
    const limitNum = Number.parseInt(limit as string, 10)
    const offsetNum = Number.parseInt(offset as string, 10)
    const paginatedImages = filteredImages.slice(offsetNum, offsetNum + limitNum)

    return res.status(200).json({
      success: true,
      data: paginatedImages,
      pagination: {
        total: filteredImages.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < filteredImages.length,
      },
    })
  }

  if (req.method === "POST") {
    // Mock creating a new glacier image analysis
    const { glacierName, location, imageUrl } = req.body

    if (!glacierName || !location || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: glacierName, location, imageUrl",
      })
    }

    const newImage = {
      id: `img-${Date.now()}`,
      glacierName,
      location,
      uploadDate: new Date().toISOString(),
      analysisId: `analysis-${Date.now()}`,
      status: "pending",
      confidence: null,
      healthScore: null,
      riskLevel: null,
      imageUrl,
      thumbnailUrl: imageUrl,
    }

    return res.status(201).json({
      success: true,
      data: newImage,
      message: "Analysis started successfully",
    })
  }

  return res.status(405).json({ message: "Method not allowed" })
}
