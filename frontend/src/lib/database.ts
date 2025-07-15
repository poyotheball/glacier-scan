import { neon } from "@neondatabase/serverless"

// Mock database connection for development
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export interface GlacierData {
  id: string
  name: string
  location: string
  area: number
  volume: number
  elevation: number
  temperature: number
  status: "healthy" | "warning" | "critical"
  lastUpdated: string
  coordinates: {
    lat: number
    lng: number
  }
  trends: {
    date: string
    area: number
    volume: number
    temperature: number
  }[]
}

// Mock data for development
const mockGlaciers: GlacierData[] = [
  {
    id: "mock-1",
    name: "Franz Josef Glacier",
    location: "New Zealand",
    area: 32.5,
    volume: 4.2,
    elevation: 2800,
    temperature: -2.1,
    status: "warning",
    lastUpdated: "2024-01-15T10:30:00Z",
    coordinates: { lat: -43.4668, lng: 170.1953 },
    trends: [
      { date: "2020-01", area: 35.2, volume: 4.8, temperature: -2.5 },
      { date: "2021-01", area: 34.1, volume: 4.6, temperature: -2.3 },
      { date: "2022-01", area: 33.8, volume: 4.4, temperature: -2.2 },
      { date: "2023-01", area: 33.2, volume: 4.3, temperature: -2.1 },
      { date: "2024-01", area: 32.5, volume: 4.2, temperature: -2.1 },
    ],
  },
  {
    id: "mock-2",
    name: "Perito Moreno Glacier",
    location: "Argentina",
    area: 250.0,
    volume: 28.5,
    elevation: 2100,
    temperature: -1.8,
    status: "healthy",
    lastUpdated: "2024-01-14T14:20:00Z",
    coordinates: { lat: -50.4947, lng: -73.0356 },
    trends: [
      { date: "2020-01", area: 248.5, volume: 28.2, temperature: -2.0 },
      { date: "2021-01", area: 249.2, volume: 28.3, temperature: -1.9 },
      { date: "2022-01", area: 249.8, volume: 28.4, temperature: -1.8 },
      { date: "2023-01", area: 250.1, volume: 28.5, temperature: -1.8 },
      { date: "2024-01", area: 250.0, volume: 28.5, temperature: -1.8 },
    ],
  },
  {
    id: "mock-3",
    name: "Vatnajökull Glacier",
    location: "Iceland",
    area: 8100.0,
    volume: 3300.0,
    elevation: 2110,
    temperature: -3.2,
    status: "critical",
    lastUpdated: "2024-01-13T09:15:00Z",
    coordinates: { lat: 64.4069, lng: -16.7314 },
    trends: [
      { date: "2020-01", area: 8250.0, volume: 3400.0, temperature: -3.8 },
      { date: "2021-01", area: 8200.0, volume: 3380.0, temperature: -3.6 },
      { date: "2022-01", area: 8150.0, volume: 3350.0, temperature: -3.4 },
      { date: "2023-01", area: 8120.0, volume: 3320.0, temperature: -3.3 },
      { date: "2024-01", area: 8100.0, volume: 3300.0, temperature: -3.2 },
    ],
  },
]

export async function getGlaciers(): Promise<GlacierData[]> {
  if (!sql) {
    // Return mock data for development
    return mockGlaciers
  }

  try {
    const result = await sql`
      SELECT 
        id,
        name,
        location,
        area,
        volume,
        elevation,
        temperature,
        status,
        last_updated as "lastUpdated",
        coordinates
      FROM glaciers
      ORDER BY last_updated DESC
    `
    return result as GlacierData[]
  } catch (error) {
    console.error("Database error:", error)
    return mockGlaciers
  }
}

export async function getGlacierById(id: string): Promise<GlacierData | null> {
  if (!sql) {
    // Return mock data for development
    return mockGlaciers.find((g) => g.id === id) || null
  }

  try {
    const result = await sql`
      SELECT 
        id,
        name,
        location,
        area,
        volume,
        elevation,
        temperature,
        status,
        last_updated as "lastUpdated",
        coordinates
      FROM glaciers
      WHERE id = ${id}
    `
    return (result[0] as GlacierData) || null
  } catch (error) {
    console.error("Database error:", error)
    return mockGlaciers.find((g) => g.id === id) || null
  }
}

export async function getGlacierTrends(id: string): Promise<GlacierData["trends"]> {
  if (!sql) {
    // Return mock data for development
    const glacier = mockGlaciers.find((g) => g.id === id)
    return glacier?.trends || []
  }

  try {
    const result = await sql`
      SELECT 
        date,
        area,
        volume,
        temperature
      FROM glacier_trends
      WHERE glacier_id = ${id}
      ORDER BY date ASC
    `
    return result as GlacierData["trends"]
  } catch (error) {
    console.error("Database error:", error)
    const glacier = mockGlaciers.find((g) => g.id === id)
    return glacier?.trends || []
  }
}
