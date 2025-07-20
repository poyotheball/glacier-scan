// Mock database for development
export interface Glacier {
  id: string
  name: string
  location: string
  status: "healthy" | "warning" | "critical"
  healthScore: number
  area: number
  thickness: number
  velocity: number
  temperature: number
  lastUpdated: string
  trend: "up" | "down" | "stable"
  images: Array<{
    url: string
    caption: string
    date: string
  }>
  recommendations: string[]
}

export const mockGlaciers: Glacier[] = [
  {
    id: "mock-1",
    name: "Franz Josef Glacier",
    location: "New Zealand",
    status: "warning",
    healthScore: 72,
    area: 32.5,
    thickness: 285,
    velocity: 1.2,
    temperature: -2.1,
    lastUpdated: "2024-01-15T10:30:00Z",
    trend: "down",
    images: [
      {
        url: "/placeholder.jpg",
        caption: "Franz Josef Glacier overview from helicopter",
        date: "2024-01-15",
      },
      {
        url: "/placeholder.jpg",
        caption: "Terminal face showing retreat",
        date: "2024-01-10",
      },
    ],
    recommendations: [
      "Monitor retreat rate closely",
      "Increase measurement frequency",
      "Consider protective measures for downstream areas",
    ],
  },
  {
    id: "mock-2",
    name: "Perito Moreno Glacier",
    location: "Argentina",
    status: "healthy",
    healthScore: 89,
    area: 250.8,
    thickness: 558,
    velocity: 2.1,
    temperature: -3.8,
    lastUpdated: "2024-01-14T14:20:00Z",
    trend: "stable",
    images: [
      {
        url: "/placeholder.jpg",
        caption: "Perito Moreno calving front",
        date: "2024-01-14",
      },
      {
        url: "/placeholder.jpg",
        caption: "Ice formation detail",
        date: "2024-01-12",
      },
    ],
    recommendations: [
      "Continue regular monitoring",
      "Maintain current observation schedule",
      "Document calving events",
    ],
  },
  {
    id: "mock-3",
    name: "Jakobshavn Glacier",
    location: "Greenland",
    status: "critical",
    healthScore: 34,
    area: 110.2,
    thickness: 1200,
    velocity: 17.5,
    temperature: -1.2,
    lastUpdated: "2024-01-13T09:15:00Z",
    trend: "down",
    images: [
      {
        url: "/placeholder.jpg",
        caption: "Jakobshavn showing rapid retreat",
        date: "2024-01-13",
      },
      {
        url: "/placeholder.jpg",
        caption: "Crevasse field indicating stress",
        date: "2024-01-11",
      },
    ],
    recommendations: [
      "Urgent: Implement emergency monitoring",
      "Alert downstream communities",
      "Coordinate with international research teams",
    ],
  },
]

export async function getGlaciers(): Promise<Glacier[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGlaciers
}

export async function getGlacierById(id: string): Promise<Glacier | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGlaciers.find((glacier) => glacier.id === id) || null
}
