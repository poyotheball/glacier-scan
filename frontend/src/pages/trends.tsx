"use client"

import { useState, useEffect } from "react"
import type { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { supabase } from "@/lib/supabase"
import GlacierTrendChart from "@/components/charts/GlacierTrendChart"
import MultiMetricChart from "@/components/charts/MultiMetricChart"
import ComparisonChart from "@/components/charts/ComparisonChart"
import HealthScoreChart from "@/components/charts/HealthScoreChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp, BarChart3, Activity } from "lucide-react"

interface Measurement {
  date: string
  ice_volume: number
  surface_area: number
  melt_rate: number
}

interface Glacier {
  id: string
  name: string
  region: string
  country: string
  measurements: Measurement[]
}

interface GlacierHealth {
  name: string
  healthScore: number
  status: "critical" | "warning" | "moderate" | "stable"
}

export default function TrendsPage() {
  const [glaciers, setGlaciers] = useState<Glacier[]>([])
  const [selectedGlacier, setSelectedGlacier] = useState<Glacier | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<"ice_volume" | "surface_area" | "melt_rate">("ice_volume")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGlacierData()
  }, [])

  const loadGlacierData = async () => {
    try {
      const { data, error } = await supabase
        .from("glaciers")
        .select(
          `
          *,
          measurements (
            date,
            ice_volume,
            surface_area,
            melt_rate
          )
        `,
        )
        .order("name")

      if (error) throw error

      const glacierData = (data || []).filter((glacier) => glacier.measurements && glacier.measurements.length > 0)
      setGlaciers(glacierData)
      if (glacierData.length > 0) {
        setSelectedGlacier(glacierData[0])
      }
    } catch (error) {
      console.error("Error loading glacier data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate health scores for glaciers
  const calculateHealthScore = (measurements: Measurement[]): number => {
    if (measurements.length < 2) return 5 // neutral score for insufficient data

    const latest = measurements[measurements.length - 1]
    const earliest = measurements[0]

    // Calculate percentage changes
    const volumeChange = ((latest.ice_volume - earliest.ice_volume) / earliest.ice_volume) * 100
    const areaChange = ((latest.surface_area - earliest.surface_area) / earliest.surface_area) * 100
    const meltRateIncrease = ((latest.melt_rate - earliest.melt_rate) / earliest.melt_rate) * 100

    // Health score calculation (0-10 scale, 10 = healthiest)
    let score = 10

    // Penalize volume loss
    if (volumeChange < 0) score += volumeChange * 0.1 // Each 1% loss = -0.1 points

    // Penalize area loss
    if (areaChange < 0) score += areaChange * 0.05 // Each 1% loss = -0.05 points

    // Penalize melt rate increase
    if (meltRateIncrease > 0) score -= meltRateIncrease * 0.02 // Each 1% increase = -0.02 points

    return Math.max(0, Math.min(10, score))
  }

  const getHealthStatus = (score: number): "critical" | "warning" | "moderate" | "stable" => {
    if (score < 3) return "critical"
    if (score < 5) return "warning"
    if (score < 7) return "moderate"
    return "stable"
  }

  const glacierHealthData: GlacierHealth[] = glaciers.map((glacier) => {
    const healthScore = calculateHealthScore(glacier.measurements)
    return {
      name: glacier.name,
      healthScore,
      status: getHealthStatus(healthScore),
    }
  })

  // Prepare comparison data
  const comparisonColors = [
    "#3B82F6", // blue
    "#10B981", // emerald
    "#EF4444", // red
    "#F59E0B", // amber
    "#8B5CF6", // violet
    "#06B6D4", // cyan
    "#84CC16", // lime
    "#F97316", // orange
  ]

  const comparisonData = glaciers.slice(0, 6).map((glacier, index) => ({
    name: glacier.name,
    measurements: glacier.measurements,
    color: comparisonColors[index % comparisonColors.length],
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading glacier trend data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Glacier Trends & Analytics</h1>
              <p className="text-gray-600 mt-2">Interactive visualizations of glacier changes over time</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <BarChart3 className="w-4 h-4 mr-1" />
                {glaciers.length} Glaciers
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="w-4 h-4 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Status</p>
                  <p className="text-2xl font-bold text-red-600">
                    {glacierHealthData.filter((g) => g.status === "critical").length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warning Status</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {glacierHealthData.filter((g) => g.status === "warning").length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stable Glaciers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {glacierHealthData.filter((g) => g.status === "stable").length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(glacierHealthData.reduce((sum, g) => sum + g.healthScore, 0) / glacierHealthData.length).toFixed(
                      1,
                    )}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Score Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Glacier Health Score Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthScoreChart glaciers={glacierHealthData} height={350} />
          </CardContent>
        </Card>

        {/* Individual Glacier Analysis */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Individual Glacier Analysis</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {glaciers.map((glacier) => (
                    <Button
                      key={glacier.id}
                      variant={selectedGlacier?.id === glacier.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGlacier(glacier)}
                      className="text-xs"
                    >
                      {glacier.name}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {selectedGlacier && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedGlacier.name}</h3>
                        <p className="text-gray-600">
                          {selectedGlacier.region}, {selectedGlacier.country}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedMetric === "ice_volume" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedMetric("ice_volume")}
                        >
                          Volume
                        </Button>
                        <Button
                          variant={selectedMetric === "surface_area" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedMetric("surface_area")}
                        >
                          Area
                        </Button>
                        <Button
                          variant={selectedMetric === "melt_rate" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedMetric("melt_rate")}
                        >
                          Melt Rate
                        </Button>
                      </div>
                    </div>
                    <GlacierTrendChart
                      measurements={selectedGlacier.measurements}
                      glacierName={selectedGlacier.name}
                      metric={selectedMetric}
                      height={350}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Multi-Metric View</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedGlacier && (
                  <MultiMetricChart
                    measurements={selectedGlacier.measurements}
                    glacierName={selectedGlacier.name}
                    height={350}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="grid lg:grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Glacier Comparison</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={selectedMetric === "ice_volume" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("ice_volume")}
                >
                  Ice Volume
                </Button>
                <Button
                  variant={selectedMetric === "surface_area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("surface_area")}
                >
                  Surface Area
                </Button>
                <Button
                  variant={selectedMetric === "melt_rate" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("melt_rate")}
                >
                  Melt Rate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ComparisonChart glaciers={comparisonData} metric={selectedMetric} height={400} />
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Most Critical</h4>
                <p className="text-red-700">
                  {glacierHealthData.find((g) => g.status === "critical")?.name || "None"} shows the most concerning
                  trends with rapid ice loss.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Most Stable</h4>
                <p className="text-green-700">
                  {glacierHealthData
                    .filter((g) => g.status === "stable")
                    .sort((a, b) => b.healthScore - a.healthScore)[0]?.name || "None"}{" "}
                  maintains the best stability indicators.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Trend Analysis</h4>
                <p className="text-blue-700">
                  Overall trend shows{" "}
                  {glacierHealthData.filter((g) => g.status === "critical").length > 2 ? "accelerating" : "moderate"}{" "}
                  glacier retreat across the monitored network.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
})
