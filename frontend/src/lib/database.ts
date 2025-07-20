// Mock database for development
export interface GlacierData {
  id: string
  name: string
  region: string
  country: string
  location: {
    latitude: number
    longitude: number
  }
  status: "healthy" | "warning" | "critical"
  healthScore: number
  area: number
  thickness: number
  lastUpdated: string
  trend: "stable" | "declining" | "improving"
  images: Array<{
    url: string
    caption: string
    date: string
  }>
  metrics: {
    iceVolume: number
    surfaceArea: number
    elevation: number
    temperature: number
    precipitationRate: number
    meltRate: number
  }
  historicalData: Array<{
    year: number
    area: number
    thickness: number
    temperature: number
  }>
  recommendations: string[]
}

// Mock data for development
export const mockGlaciers: GlacierData[] = [
  {
    id: "mock-1",
    name: "Franz Josef Glacier",
    region: "West Coast",
    country: "New Zealand",
    location: {
      latitude: -43.4668,
      longitude: 170.1881,
    },
    status: "warning",
    healthScore: 65,
    area: 32.5,
    thickness: 150,
    lastUpdated: "2024-01-15",
    trend: "declining",
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
    metrics: {
      iceVolume: 4.2,
      surfaceArea: 32.5,
      elevation: 2700,
      temperature: -2.1,
      precipitationRate: 1200,
      meltRate: 0.8,
    },
    historicalData: [
      { year: 2020, area: 35.2, thickness: 165, temperature: -2.5 },
      { year: 2021, area: 34.1, thickness: 160, temperature: -2.3 },
      { year: 2022, area: 33.4, thickness: 155, temperature: -2.2 },
      { year: 2023, area: 32.8, thickness: 152, temperature: -2.1 },
      { year: 2024, area: 32.5, thickness: 150, temperature: -2.1 },
    ],
    recommendations: [
      "Monitor terminal retreat rate monthly",
      "Install additional temperature sensors",
      "Increase observation frequency during summer months",
    ],
  },
  {
    id: "mock-2",
    name: "Perito Moreno Glacier",
    region: "Patagonia",
    country: "Argentina",
    location: {
      latitude: -50.4684,
      longitude: -73.0347,
    },
    status: "healthy",
    healthScore: 85,
    area: 250,
    thickness: 170,
    lastUpdated: "2024-01-14",
    trend: "stable",
    images: [
      {
        url: "/placeholder.jpg",
        caption: "Perito Moreno ice front",
        date: "2024-01-14",
      },
      {
        url: "/placeholder.jpg",
        caption: "Calving event captured",
        date: "2024-01-12",
      },
    ],
    metrics: {
      iceVolume: 42.5,
      surfaceArea: 250,
      elevation: 2950,
      temperature: -3.2,
      precipitationRate: 800,
      meltRate: 0.3,
    },
    historicalData: [
      { year: 2020, area: 248, thickness: 168, temperature: -3.4 },
      { year: 2021, area: 249, thickness: 169, temperature: -3.3 },
      { year: 2022, area: 250, thickness: 170, temperature: -3.2 },
      { year: 2023, area: 250, thickness: 170, temperature: -3.2 },
      { year: 2024, area: 250, thickness: 170, temperature: -3.2 },
    ],
    recommendations: [
      "Continue current monitoring protocol",
      "Document calving events for research",
      "Maintain tourist viewing platforms",
    ],
  },
  {
    id: "mock-3",
    name: "Athabasca Glacier",
    region: "Alberta",
    country: "Canada",
    location: {
      latitude: 52.1744,
      longitude: -117.2481,
    },
    status: "critical",
    healthScore: 35,
    area: 6.0,
    thickness: 90,
    lastUpdated: "2024-01-13",
    trend: "declining",
    images: [
      {
        url: "/placeholder.jpg",
        caption: "Athabasca Glacier showing significant retreat",
        date: "2024-01-13",
      },
      {
        url: "/placeholder.jpg",
        caption: "Historical markers showing ice loss",
        date: "2024-01-11",
      },
    ],
    metrics: {
      iceVolume: 0.54,
      surfaceArea: 6.0,
      elevation: 2100,
      temperature: -1.2,
      precipitationRate: 600,
      meltRate: 1.5,
    },
    historicalData: [
      { year: 2020, area: 7.2, thickness: 105, temperature: -1.8 },
      { year: 2021, area: 6.8, thickness: 100, temperature: -1.6 },
      { year: 2022, area: 6.4, thickness: 95, temperature: -1.4 },
      { year: 2023, area: 6.2, thickness: 92, temperature: -1.3 },
      { year: 2024, area: 6.0, thickness: 90, temperature: -1.2 },
    ],
    recommendations: [
      "Urgent: Implement enhanced monitoring",
      "Study rapid retreat patterns",
      "Update visitor education materials",
      "Consider intervention strategies",
    ],
  },
]

// Database functions
export async function getGlaciers(): Promise<GlacierData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockGlaciers
}

export async function getGlacierById(id: string): Promise<GlacierData | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockGlaciers.find((glacier) => glacier.id === id) || null
}

export async function getGlacierSummary() {
  const glaciers = await getGlaciers()
  return {
    total: glaciers.length,
    healthy: glaciers.filter((g) => g.status === "healthy").length,
    warning: glaciers.filter((g) => g.status === "warning").length,
    critical: glaciers.filter((g) => g.status === "critical").length,
    averageHealthScore: Math.round(glaciers.reduce((sum, g) => sum + g.healthScore, 0) / glaciers.length),
  }
}
