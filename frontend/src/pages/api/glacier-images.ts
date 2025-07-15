import type { NextApiRequest, NextApiResponse } from "next"

// Mock glacier images data for testing
const mockGlacierImages = [
  {
    id: "img-1",
    glacier_id: "franz-josef",
    glacier_name: "Franz Josef Glacier",
    image_url: "/placeholder.svg?height=200&width=300",
    analysis_status: "completed",
    uploaded_at: "2024-01-15T10:30:00Z",
    processed_at: "2024-01-15T10:45:00Z",
    analysis_results: {
      ice_volume_km3: 2.8,
      surface_area_km2: 32.4,
      melt_rate_mm_year: 1250,
      confidence_score: 0.92,
      health_score: 3.2,
      risk_level: "high",
    },
  },
  {
    id: "img-2",
    glacier_id: "perito-moreno",
    glacier_name: "Perito Moreno Glacier",
    image_url: "/placeholder.svg?height=200&width=300",
    analysis_status: "completed",
    uploaded_at: "2024-01-14T14:20:00Z",
    processed_at: "2024-01-14T14:35:00Z",
    analysis_results: {
      ice_volume_km3: 195.2,
      surface_area_km2: 250.8,
      melt_rate_mm_year: 420,
      confidence_score: 0.95,
      health_score: 7.8,
      risk_level: "low",
    },
  },
  {
    id: "img-3",
    glacier_id: "glacier-bay",
    glacier_name: "Glacier Bay",
    image_url: "/placeholder.svg?height=200&width=300",
    analysis_status: "processing",
    uploaded_at: "2024-01-16T09:15:00Z",
    processed_at: null,
    analysis_results: null,
  },
  {
    id: "img-4",
    glacier_id: "vatnajokull",
    glacier_name: "Vatnajökull",
    image_url: "/placeholder.svg?height=200&width=300",
    analysis_status: "pending",
    uploaded_at: "2024-01-16T11:45:00Z",
    processed_at: null,
    analysis_results: null,
  },
  {
    id: "img-5",
    glacier_id: "columbia",
    glacier_name: "Columbia Glacier",
    image_url: "/placeholder.svg?height=200&width=300",
    analysis_status: "failed",
    uploaded_at: "2024-01-15T16:20:00Z",
    processed_at: "2024-01-15T16:25:00Z",
    analysis_results: null,
  },
  {
    id: "img-6",
    glacier_id: "mendenhall",
    glacier_name: "Mendenhall Glacier",
    image_url: "/placeholder.svg?height=200&width=300",
    analysis_status: "completed",
    uploaded_at: "2024-01-13T13:10:00Z",
    processed_at: "2024-01-13T13:25:00Z",
    analysis_results: {
      ice_volume_km3: 1.2,
      surface_area_km2: 15.8,
      melt_rate_mm_year: 890,
      confidence_score: 0.87,
      health_score: 4.5,
      risk_level: "medium",
    },
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { status, glacier_id, page = "1", limit = "10" } = req.query

    let filteredImages = [...mockGlacierImages]

    // Filter by status
    if (status && status !== "all") {
      filteredImages = filteredImages.filter((img) => img.analysis_status === status)
    }

    // Filter by glacier_id
    if (glacier_id) {
      filteredImages = filteredImages.filter((img) => img.glacier_id === glacier_id)
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
        current_page: pageNum,
        total_pages: Math.ceil(filteredImages.length / limitNum),
        total_items: filteredImages.length,
        items_per_page: limitNum,
      },
      stats: {
        total: mockGlacierImages.length,
        completed: mockGlacierImages.filter((img) => img.analysis_status === "completed").length,
        processing: mockGlacierImages.filter((img) => img.analysis_status === "processing").length,
        pending: mockGlacierImages.filter((img) => img.analysis_status === "pending").length,
        failed: mockGlacierImages.filter((img) => img.analysis_status === "failed").length,
      },
    })
  }

  if (req.method === "POST") {
    // Mock creating a new glacier image
    const { glacier_id, image_url } = req.body

    const newImage = {
      id: `img-${Date.now()}`,
      glacier_id,
      glacier_name: `Glacier ${glacier_id}`,
      image_url,
      analysis_status: "pending" as const,
      uploaded_at: new Date().toISOString(),
      processed_at: null,
      analysis_results: null,
    }

    return res.status(201).json(newImage)
  }

  res.setHeader("Allow", ["GET", "POST"])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
