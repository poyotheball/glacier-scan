import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const mockImages = [
    {
      id: "img-1",
      glacierId: "mock-1",
      url: "/placeholder.jpg",
      date: "2024-01-15",
      type: "satellite",
      resolution: "10m",
      metadata: {
        sensor: "Landsat 8",
        cloudCover: 5,
        quality: "high",
      },
    },
    {
      id: "img-2",
      glacierId: "mock-1",
      url: "/placeholder.jpg",
      date: "2023-01-15",
      type: "satellite",
      resolution: "10m",
      metadata: {
        sensor: "Landsat 8",
        cloudCover: 12,
        quality: "medium",
      },
    },
    {
      id: "img-3",
      glacierId: "mock-2",
      url: "/placeholder.jpg",
      date: "2024-01-14",
      type: "aerial",
      resolution: "5m",
      metadata: {
        sensor: "Drone Survey",
        cloudCover: 0,
        quality: "high",
      },
    },
  ]

  const { glacierId } = req.query

  if (glacierId) {
    const filtered = mockImages.filter((img) => img.glacierId === glacierId)
    return res.status(200).json(filtered)
  }

  res.status(200).json(mockImages)
}
