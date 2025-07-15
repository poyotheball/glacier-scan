import { neon } from "@neondatabase/serverless"

// Use Neon serverless for better Windows compatibility
const sql = neon(process.env.DATABASE_URL || "")

export interface Glacier {
  id: string
  name: string
  location: string
  latitude: number
  longitude: number
  area_km2: number
  elevation_m: number
  last_updated: string
  status: "stable" | "retreating" | "advancing" | "critical"
  health_score: number
}

export interface GlacierAnalysis {
  id: string
  glacier_id: string
  analysis_date: string
  ice_coverage_percent: number
  volume_km3: number
  retreat_rate_m_year: number
  temperature_avg_c: number
  precipitation_mm: number
  health_score: number
  notes: string
}

export async function getGlaciers(): Promise<Glacier[]> {
  try {
    const result = await sql`
      SELECT * FROM glaciers 
      ORDER BY last_updated DESC
    `
    return result as Glacier[]
  } catch (error) {
    console.error("Database error:", error)
    // Return mock data if database is not available
    return [
      {
        id: "mock-1",
        name: "Franz Josef Glacier",
        location: "New Zealand",
        latitude: -43.4668,
        longitude: 170.1953,
        area_km2: 32.4,
        elevation_m: 3000,
        last_updated: "2024-01-15T10:30:00Z",
        status: "retreating",
        health_score: 65,
      },
      {
        id: "mock-2",
        name: "Perito Moreno Glacier",
        location: "Argentina",
        latitude: -50.4648,
        longitude: -73.0311,
        area_km2: 250.0,
        elevation_m: 2950,
        last_updated: "2024-01-14T14:20:00Z",
        status: "stable",
        health_score: 82,
      },
      {
        id: "mock-3",
        name: "Athabasca Glacier",
        location: "Canada",
        latitude: 52.1943,
        longitude: -117.2284,
        area_km2: 6.0,
        elevation_m: 2845,
        last_updated: "2024-01-13T09:15:00Z",
        status: "critical",
        health_score: 34,
      },
    ]
  }
}

export async function getGlacierAnalysis(glacierId: string): Promise<GlacierAnalysis[]> {
  try {
    const result = await sql`
      SELECT * FROM glacier_analysis 
      WHERE glacier_id = ${glacierId}
      ORDER BY analysis_date DESC
      LIMIT 10
    `
    return result as GlacierAnalysis[]
  } catch (error) {
    console.error("Database error:", error)
    // Return mock data if database is not available
    return [
      {
        id: `analysis-${glacierId}-1`,
        glacier_id: glacierId,
        analysis_date: "2024-01-15T10:30:00Z",
        ice_coverage_percent: 78.5,
        volume_km3: 2.4,
        retreat_rate_m_year: 12.3,
        temperature_avg_c: -2.1,
        precipitation_mm: 1250,
        health_score: glacierId === "mock-1" ? 65 : glacierId === "mock-2" ? 82 : 34,
        notes: "Significant retreat observed in the terminus region",
      },
    ]
  }
}
