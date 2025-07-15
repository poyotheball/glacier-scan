import { neon } from "@neondatabase/serverless"

// Mock database connection for development
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export interface GlacierData {
  id: string
  name: string
  location: string
  area: number
  volume: number
  status: "stable" | "retreating" | "advancing"
  lastUpdated: string
  healthScore: number
  temperature: number
  precipitation: number
  images: string[]
}

export interface AnalysisData {
  id: string
  glacierId: string
  analysisDate: string
  metrics: {
    area: number
    volume: number
    thickness: number
    velocity: number
    temperature: number
    precipitation: number
  }
  trends: {
    areaChange: number
    volumeChange: number
    temperatureChange: number
  }
  recommendations: string[]
  alerts: Array<{
    type: "warning" | "critical" | "info"
    message: string
    date: string
  }>
}

// Mock data for development
const mockGlaciers: GlacierData[] = [
  {
    id: "mock-1",
    name: "Franz Josef Glacier",
    location: "New Zealand",
    area: 32.5,
    volume: 4.2,
    status: "retreating",
    lastUpdated: "2024-01-15",
    healthScore: 65,
    temperature: -2.5,
    precipitation: 3200,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
  },
  {
    id: "mock-2",
    name: "Perito Moreno Glacier",
    location: "Argentina",
    area: 250.0,
    volume: 28.0,
    status: "stable",
    lastUpdated: "2024-01-14",
    healthScore: 82,
    temperature: -4.1,
    precipitation: 800,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
  },
  {
    id: "mock-3",
    name: "Athabasca Glacier",
    location: "Canada",
    area: 6.0,
    volume: 0.8,
    status: "retreating",
    lastUpdated: "2024-01-13",
    healthScore: 45,
    temperature: -1.8,
    precipitation: 1200,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
  },
]

const mockAnalyses: AnalysisData[] = [
  {
    id: "analysis-1",
    glacierId: "mock-1",
    analysisDate: "2024-01-15",
    metrics: {
      area: 32.5,
      volume: 4.2,
      thickness: 180,
      velocity: 0.5,
      temperature: -2.5,
      precipitation: 3200,
    },
    trends: {
      areaChange: -2.3,
      volumeChange: -1.8,
      temperatureChange: 0.8,
    },
    recommendations: [
      "Monitor ice velocity changes more frequently",
      "Install additional temperature sensors",
      "Increase observation frequency during summer months",
    ],
    alerts: [
      {
        type: "warning",
        message: "Accelerated retreat detected in lower terminus",
        date: "2024-01-15",
      },
      {
        type: "info",
        message: "New satellite imagery available",
        date: "2024-01-14",
      },
    ],
  },
  {
    id: "analysis-2",
    glacierId: "mock-2",
    analysisDate: "2024-01-14",
    metrics: {
      area: 250.0,
      volume: 28.0,
      thickness: 170,
      velocity: 2.0,
      temperature: -4.1,
      precipitation: 800,
    },
    trends: {
      areaChange: 0.1,
      volumeChange: 0.3,
      temperatureChange: -0.2,
    },
    recommendations: [
      "Continue current monitoring schedule",
      "Document calving events",
      "Maintain weather station network",
    ],
    alerts: [
      {
        type: "info",
        message: "Glacier showing stable conditions",
        date: "2024-01-14",
      },
    ],
  },
]

export async function getGlaciers(): Promise<GlacierData[]> {
  if (sql) {
    try {
      const result = await sql`SELECT * FROM glaciers ORDER BY name`
      return result as GlacierData[]
    } catch (error) {
      console.warn("Database not available, using mock data:", error)
    }
  }
  return mockGlaciers
}

export async function getGlacierById(id: string): Promise<GlacierData | null> {
  if (sql) {
    try {
      const result = await sql`SELECT * FROM glaciers WHERE id = ${id}`
      return (result[0] as GlacierData) || null
    } catch (error) {
      console.warn("Database not available, using mock data:", error)
    }
  }
  return mockGlaciers.find((g) => g.id === id) || null
}

export async function getAnalysisById(id: string): Promise<AnalysisData | null> {
  if (sql) {
    try {
      const result = await sql`SELECT * FROM analyses WHERE id = ${id}`
      return (result[0] as AnalysisData) || null
    } catch (error) {
      console.warn("Database not available, using mock data:", error)
    }
  }
  return mockAnalyses.find((a) => a.id === id) || null
}

export async function getAnalysesByGlacierId(glacierId: string): Promise<AnalysisData[]> {
  if (sql) {
    try {
      const result = await sql`SELECT * FROM analyses WHERE glacier_id = ${glacierId} ORDER BY analysis_date DESC`
      return result as AnalysisData[]
    } catch (error) {
      console.warn("Database not available, using mock data:", error)
    }
  }
  return mockAnalyses.filter((a) => a.glacierId === glacierId)
}
