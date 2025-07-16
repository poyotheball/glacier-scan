import { neon } from "@neondatabase/serverless"

// Mock data for development
export const mockGlaciers = [
  {
    id: "mock-1",
    name: "Franz Josef Glacier",
    location: "New Zealand",
    status: "healthy",
    lastAnalyzed: "2024-01-15T10:30:00Z",
    area: 32.5,
    volume: 4.2,
    thickness: 180,
    velocity: 0.8,
    temperature: -2.5,
    healthScore: 85,
    trend: "stable",
    images: [
      {
        id: 1,
        url: "/placeholder.jpg",
        caption: "Franz Josef Glacier overview",
        date: "2024-01-15",
        type: "satellite",
      },
      {
        id: 2,
        url: "/placeholder.jpg",
        caption: "Terminus detail",
        date: "2024-01-15",
        type: "aerial",
      },
    ],
    historicalData: [
      { date: "2020-01", area: 35.2, volume: 4.8, thickness: 195 },
      { date: "2021-01", area: 34.1, volume: 4.6, thickness: 190 },
      { date: "2022-01", area: 33.5, volume: 4.4, thickness: 185 },
      { date: "2023-01", area: 32.8, volume: 4.3, thickness: 182 },
      { date: "2024-01", area: 32.5, volume: 4.2, thickness: 180 },
    ],
    recommendations: [
      "Continue monitoring ice velocity changes",
      "Increase observation frequency during summer months",
      "Monitor terminus position for retreat indicators",
    ],
  },
  {
    id: "mock-2",
    name: "Perito Moreno Glacier",
    location: "Argentina",
    status: "warning",
    lastAnalyzed: "2024-01-14T14:20:00Z",
    area: 250.0,
    volume: 28.5,
    thickness: 170,
    velocity: 2.1,
    temperature: -1.8,
    healthScore: 72,
    trend: "declining",
    images: [
      {
        id: 3,
        url: "/placeholder.jpg",
        caption: "Perito Moreno calving front",
        date: "2024-01-14",
        type: "ground",
      },
    ],
    historicalData: [
      { date: "2020-01", area: 258.5, volume: 30.2, thickness: 185 },
      { date: "2021-01", area: 255.8, volume: 29.8, thickness: 180 },
      { date: "2022-01", area: 253.2, volume: 29.2, thickness: 175 },
      { date: "2023-01", area: 251.5, volume: 28.8, thickness: 172 },
      { date: "2024-01", area: 250.0, volume: 28.5, thickness: 170 },
    ],
    recommendations: [
      "Investigate causes of accelerated retreat",
      "Implement enhanced monitoring protocols",
      "Consider climate impact assessment",
    ],
  },
]

export async function getGlacierById(id: string) {
  // For development, return mock data
  return mockGlaciers.find((glacier) => glacier.id === id) || null
}

export async function getAllGlaciers() {
  // For development, return mock data
  return mockGlaciers
}

export async function getGlacierImages(glacierId: string) {
  const glacier = await getGlacierById(glacierId)
  return glacier?.images || []
}

// Database connection for production
let sql: any = null

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
}

export async function testDatabaseConnection() {
  if (!sql) {
    return { success: false, message: "No database URL configured" }
  }

  try {
    const result = await sql`SELECT NOW() as current_time`
    return { success: true, message: "Database connected successfully", data: result }
  } catch (error) {
    return { success: false, message: "Database connection failed", error }
  }
}
