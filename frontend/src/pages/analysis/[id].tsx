"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Download,
  Share2,
  BarChart3,
  Calendar,
  Thermometer,
  Droplets,
  Mountain,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Layers,
  Settings,
  RefreshCw,
} from "lucide-react"
import { GlacierTrendChart } from "@/components/charts/GlacierTrendChart"
import { MultiMetricChart } from "@/components/charts/MultiMetricChart"
import { ComparisonChart } from "@/components/charts/ComparisonChart"

interface AnalysisData {
  id: string
  glacier_name: string
  region: string
  country: string
  location: {
    latitude: number
    longitude: number
  }
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results: {
    ice_volume: number
    surface_area: number
    melt_rate: number
    elevation_change: number
    health_score: number
    confidence: number
    risk_level: "low" | "medium" | "high" | "critical"
    predictions: {
      volume_change_1yr: number
      volume_change_5yr: number
      volume_change_10yr: number
    }
    environmental_factors: {
      temperature_trend: number
      precipitation_change: number
      seasonal_variation: number
    }
    comparison_data: {
      regional_average: number
      global_average: number
      historical_baseline: number
    }
  }
  image_url: string
  measurements: Array<{
    date: string
    ice_volume: number
    surface_area: number
    melt_rate: number
    elevation_change: number
  }>
}

export default function AnalysisView() {
  const router = useRouter()
  const { id } = router.query
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // View options state
  const [viewMode, setViewMode] = useState<"overview" | "detailed" | "comparison">("overview")
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")
  const [timeRange, setTimeRange] = useState<"1y" | "5y" | "10y" | "all">("5y")
  const [showPredictions, setShowPredictions] = useState(true)
  const [showConfidence, setShowConfidence] = useState(false)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["ice_volume", "surface_area", "melt_rate"])
  const [zoomLevel, setZoomLevel] = useState([100])
  const [showGrid, setShowGrid] = useState(true)
  const [animateCharts, setAnimateCharts] = useState(true)

  useEffect(() => {
    if (id) {
      fetchAnalysisData(id as string)
    }
  }, [id])

  const fetchAnalysisData = async (analysisId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analysis/${analysisId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch analysis data")
      }
      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: "pdf" | "png" | "csv" | "json") => {
    // Export functionality
    console.log(`Exporting as ${format}`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // Show toast notification
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "pending":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "critical":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analysis data...</p>
        </div>
      </div>
    )
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Analysis data not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{analysisData.glacier_name} Analysis</h1>
                <p className="text-sm text-gray-500">
                  {analysisData.region}, {analysisData.country}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(analysisData.analysis_status)}>{analysisData.analysis_status}</Badge>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Select onValueChange={(value) => handleExport(value as any)}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - View Options */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  View Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* View Mode */}
                <div>
                  <Label className="text-sm font-medium">View Mode</Label>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Chart Type */}
                <div>
                  <Label className="text-sm font-medium">Chart Type</Label>
                  <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range */}
                <div>
                  <Label className="text-sm font-medium">Time Range</Label>
                  <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1y">Last Year</SelectItem>
                      <SelectItem value="5y">Last 5 Years</SelectItem>
                      <SelectItem value="10y">Last 10 Years</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Display Options */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Display Options</Label>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="predictions" className="text-sm">
                      Show Predictions
                    </Label>
                    <Switch id="predictions" checked={showPredictions} onCheckedChange={setShowPredictions} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidence" className="text-sm">
                      Confidence Intervals
                    </Label>
                    <Switch id="confidence" checked={showConfidence} onCheckedChange={setShowConfidence} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-sm">
                      Show Grid
                    </Label>
                    <Switch id="grid" checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="animate" className="text-sm">
                      Animate Charts
                    </Label>
                    <Switch id="animate" checked={animateCharts} onCheckedChange={setAnimateCharts} />
                  </div>
                </div>

                <Separator />

                {/* Zoom Level */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Zoom Level: {zoomLevel[0]}%</Label>
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    max={200}
                    min={50}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Metric Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Metrics</Label>
                  <div className="space-y-2">
                    {[
                      { id: "ice_volume", label: "Ice Volume", icon: Mountain },
                      { id: "surface_area", label: "Surface Area", icon: Layers },
                      { id: "melt_rate", label: "Melt Rate", icon: Droplets },
                      { id: "elevation_change", label: "Elevation", icon: TrendingDown },
                    ].map(({ id, label, icon: Icon }) => (
                      <div key={id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={id}
                          checked={selectedMetrics.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMetrics([...selectedMetrics, id])
                            } else {
                              setSelectedMetrics(selectedMetrics.filter((m) => m !== id))
                            }
                          }}
                          className="rounded"
                        />
                        <Icon className="h-4 w-4" />
                        <Label htmlFor={id} className="text-sm">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Health Score</p>
                      <p className="text-2xl font-bold">{analysisData.analysis_results.health_score}/10</p>
                    </div>
                    <div className={`p-2 rounded-full ${getRiskColor(analysisData.analysis_results.risk_level)}`}>
                      {analysisData.analysis_results.health_score >= 7 ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ice Volume</p>
                      <p className="text-2xl font-bold">{analysisData.analysis_results.ice_volume.toFixed(1)} km³</p>
                    </div>
                    <Mountain className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Melt Rate</p>
                      <p className="text-2xl font-bold">{analysisData.analysis_results.melt_rate.toFixed(2)} m/yr</p>
                    </div>
                    <Droplets className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-2xl font-bold">
                        {(analysisData.analysis_results.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Analysis Content */}
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Glacier Trends Over Time</CardTitle>
                    <CardDescription>
                      Historical data and future predictions for {analysisData.glacier_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GlacierTrendChart
                      data={analysisData.measurements}
                      metric="ice_volume"
                      showPredictions={showPredictions}
                      showConfidence={showConfidence}
                      animate={animateCharts}
                    />
                  </CardContent>
                </Card>

                {/* Environmental Factors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Temperature Trend</p>
                        <p className="text-lg font-semibold">
                          +{analysisData.analysis_results.environmental_factors.temperature_trend.toFixed(1)}°C
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Precipitation Change</p>
                        <p className="text-lg font-semibold">
                          {analysisData.analysis_results.environmental_factors.precipitation_change > 0 ? "+" : ""}
                          {analysisData.analysis_results.environmental_factors.precipitation_change.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Seasonal Variation</p>
                        <p className="text-lg font-semibold">
                          {analysisData.analysis_results.environmental_factors.seasonal_variation.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-6">
                {/* Multi-Metric Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Metric Analysis</CardTitle>
                    <CardDescription>Comprehensive view of all glacier metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MultiMetricChart
                      data={analysisData.measurements}
                      selectedMetrics={selectedMetrics}
                      timeRange={timeRange}
                      animate={animateCharts}
                    />
                  </CardContent>
                </Card>

                {/* Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Future Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">1 Year</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {analysisData.analysis_results.predictions.volume_change_1yr > 0 ? "+" : ""}
                          {analysisData.analysis_results.predictions.volume_change_1yr.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Volume Change</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">5 Years</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {analysisData.analysis_results.predictions.volume_change_5yr > 0 ? "+" : ""}
                          {analysisData.analysis_results.predictions.volume_change_5yr.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Volume Change</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">10 Years</p>
                        <p className="text-2xl font-bold text-red-600">
                          {analysisData.analysis_results.predictions.volume_change_10yr > 0 ? "+" : ""}
                          {analysisData.analysis_results.predictions.volume_change_10yr.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Volume Change</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6">
                {/* Comparison Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Comparison</CardTitle>
                    <CardDescription>
                      How {analysisData.glacier_name} compares to regional and global averages
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ComparisonChart
                      currentGlacier={{
                        name: analysisData.glacier_name,
                        data: analysisData.measurements,
                      }}
                      comparisonData={[
                        {
                          name: "Regional Average",
                          value: analysisData.analysis_results.comparison_data.regional_average,
                        },
                        {
                          name: "Global Average",
                          value: analysisData.analysis_results.comparison_data.global_average,
                        },
                        {
                          name: "Historical Baseline",
                          value: analysisData.analysis_results.comparison_data.historical_baseline,
                        },
                      ]}
                      metric="ice_volume"
                    />
                  </CardContent>
                </Card>

                {/* Comparison Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Comparison Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Metric</th>
                            <th className="text-right p-2">{analysisData.glacier_name}</th>
                            <th className="text-right p-2">Regional Avg</th>
                            <th className="text-right p-2">Global Avg</th>
                            <th className="text-right p-2">Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Ice Volume (km³)</td>
                            <td className="text-right p-2">{analysisData.analysis_results.ice_volume.toFixed(1)}</td>
                            <td className="text-right p-2">
                              {analysisData.analysis_results.comparison_data.regional_average.toFixed(1)}
                            </td>
                            <td className="text-right p-2">
                              {analysisData.analysis_results.comparison_data.global_average.toFixed(1)}
                            </td>
                            <td className="text-right p-2">
                              <span
                                className={
                                  analysisData.analysis_results.ice_volume >
                                  analysisData.analysis_results.comparison_data.regional_average
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {(
                                  ((analysisData.analysis_results.ice_volume -
                                    analysisData.analysis_results.comparison_data.regional_average) /
                                    analysisData.analysis_results.comparison_data.regional_average) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Surface Area (km²)</td>
                            <td className="text-right p-2">{analysisData.analysis_results.surface_area.toFixed(1)}</td>
                            <td className="text-right p-2">-</td>
                            <td className="text-right p-2">-</td>
                            <td className="text-right p-2">-</td>
                          </tr>
                          <tr>
                            <td className="p-2">Melt Rate (m/yr)</td>
                            <td className="text-right p-2">{analysisData.analysis_results.melt_rate.toFixed(2)}</td>
                            <td className="text-right p-2">-</td>
                            <td className="text-right p-2">-</td>
                            <td className="text-right p-2">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
