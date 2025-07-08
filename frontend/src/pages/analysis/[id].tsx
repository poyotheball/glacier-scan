"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Download,
  Share2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Thermometer,
  Droplets,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

interface AnalysisData {
  id: string
  glacierName: string
  location: string
  analysisDate: string
  status: string
  confidence: number
  healthScore: number
  riskLevel: string
  metrics: {
    [key: string]: {
      current: number
      change: number
      unit: string
      trend: string
    }
  }
  historicalData: {
    [key: string]: Array<{ date: string; value: number }>
  }
  predictions: {
    oneYear: { iceVolume: number; confidence: number }
    fiveYear: { iceVolume: number; confidence: number }
    tenYear: { iceVolume: number; confidence: number }
  }
  environmentalFactors: {
    avgTemperature: number
    temperatureChange: number
    precipitation: number
    precipitationChange: number
    seasonalVariation: string
  }
  comparisonData: {
    regional: Array<{ name: string; value: number; change: number }>
    global: { averageChange: number; percentile: number }
  }
}

export default function AnalysisPage() {
  const router = useRouter()
  const { id } = router.query

  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // View options state
  const [viewMode, setViewMode] = useState("overview")
  const [chartType, setChartType] = useState("line")
  const [timeRange, setTimeRange] = useState("all")
  const [selectedMetrics, setSelectedMetrics] = useState(["iceVolume", "surfaceArea", "meltRate"])
  const [showPredictions, setShowPredictions] = useState(true)
  const [showConfidence, setShowConfidence] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [zoomLevel, setZoomLevel] = useState([100])

  useEffect(() => {
    if (id) {
      fetchAnalysisData(id as string)
    }
  }, [id])

  const fetchAnalysisData = async (analysisId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analysis/${analysisId}`)
      const data = await response.json()

      if (data.success) {
        setAnalysisData(data.data)
      } else {
        setError("Analysis not found")
      }
    } catch (err) {
      setError("Error loading analysis data")
      console.error("Error fetching analysis:", err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const createChartData = (metric: string) => {
    if (!analysisData?.historicalData[metric]) return null

    const data = analysisData.historicalData[metric]

    return {
      labels: data.map((d) => new Date(d.date).getFullYear()),
      datasets: [
        {
          label: `${metric.charAt(0).toUpperCase() + metric.slice(1)}`,
          data: data.map((d) => d.value),
          borderColor: metric === "iceVolume" ? "#3B82F6" : metric === "surfaceArea" ? "#10B981" : "#EF4444",
          backgroundColor: metric === "iceVolume" ? "#3B82F620" : metric === "surfaceArea" ? "#10B98120" : "#EF444420",
          fill: chartType === "area",
          tension: 0.4,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: enableAnimations,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
        },
      },
      y: {
        grid: {
          display: showGrid,
        },
      },
    },
  }

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting analysis as ${format}`)
    alert(`Export as ${format} - Feature coming soon!`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Analysis URL copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading analysis...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested analysis could not be found."}</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{analysisData.glacierName}</h1>
                <p className="text-gray-600">
                  {analysisData.location} • Analyzed on {new Date(analysisData.analysisDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value="pdf" onValueChange={handleExport}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">Export PDF</SelectItem>
                  <SelectItem value="png">Export PNG</SelectItem>
                  <SelectItem value="csv">Export CSV</SelectItem>
                  <SelectItem value="json">Export JSON</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Status and Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Health Score</p>
                    <p className="text-2xl font-bold">{analysisData.healthScore.toFixed(1)}/10</p>
                  </div>
                  <Badge className={getRiskLevelColor(analysisData.riskLevel)}>{analysisData.riskLevel}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ice Volume</p>
                    <p className="text-2xl font-bold">{analysisData.metrics.iceVolume.current} km³</p>
                  </div>
                  <div className="flex items-center">
                    {getTrendIcon(analysisData.metrics.iceVolume.trend)}
                    <span
                      className={`text-sm ml-1 ${analysisData.metrics.iceVolume.change < 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {analysisData.metrics.iceVolume.change > 0 ? "+" : ""}
                      {analysisData.metrics.iceVolume.change}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Melt Rate</p>
                    <p className="text-2xl font-bold">{analysisData.metrics.meltRate.current} m/yr</p>
                  </div>
                  <div className="flex items-center">
                    {getTrendIcon(analysisData.metrics.meltRate.trend)}
                    <span
                      className={`text-sm ml-1 ${analysisData.metrics.meltRate.change > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {analysisData.metrics.meltRate.change > 0 ? "+" : ""}
                      {analysisData.metrics.meltRate.change}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-2xl font-bold">{(analysisData.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - View Options */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>View Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* View Mode */}
                <div>
                  <label className="text-sm font-medium mb-2 block">View Mode</label>
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Chart Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Chart Type</label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger>
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
                  <label className="text-sm font-medium mb-2 block">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1y">Last 1 Year</SelectItem>
                      <SelectItem value="5y">Last 5 Years</SelectItem>
                      <SelectItem value="10y">Last 10 Years</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Display Options */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Display Options</label>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Predictions</span>
                    <Switch checked={showPredictions} onCheckedChange={setShowPredictions} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confidence Intervals</span>
                    <Switch checked={showConfidence} onCheckedChange={setShowConfidence} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Grid Lines</span>
                    <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Animations</span>
                    <Switch checked={enableAnimations} onCheckedChange={setEnableAnimations} />
                  </div>
                </div>

                {/* Zoom Control */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Zoom Level: {zoomLevel[0]}%</label>
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    min={50}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Trend Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {createChartData("iceVolume") && (
                        <Line data={createChartData("iceVolume")!} options={chartOptions} />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Factors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Thermometer className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Avg Temperature</p>
                          <p className="font-semibold">{analysisData.environmentalFactors.avgTemperature}°C</p>
                          <p className="text-xs text-red-600">
                            +{analysisData.environmentalFactors.temperatureChange}°C change
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Droplets className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Precipitation</p>
                          <p className="font-semibold">{analysisData.environmentalFactors.precipitation}mm</p>
                          <p className="text-xs text-blue-600">
                            {analysisData.environmentalFactors.precipitationChange > 0 ? "+" : ""}
                            {analysisData.environmentalFactors.precipitationChange}% change
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Seasonal Variation</p>
                          <p className="font-semibold capitalize">
                            {analysisData.environmentalFactors.seasonalVariation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Detailed Analysis Tab */}
              <TabsContent value="detailed" className="space-y-6">
                {/* Multi-Metric Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Metric Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {createChartData("iceVolume") && (
                        <Line data={createChartData("iceVolume")!} options={chartOptions} />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Future Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Future Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">1 Year</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {analysisData.predictions.oneYear.iceVolume} km³
                        </p>
                        <p className="text-xs text-gray-500">
                          {(analysisData.predictions.oneYear.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">5 Years</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {analysisData.predictions.fiveYear.iceVolume} km³
                        </p>
                        <p className="text-xs text-gray-500">
                          {(analysisData.predictions.fiveYear.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">10 Years</p>
                        <p className="text-2xl font-bold text-red-600">
                          {analysisData.predictions.tenYear.iceVolume} km³
                        </p>
                        <p className="text-xs text-gray-500">
                          {(analysisData.predictions.tenYear.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comparison Tab */}
              <TabsContent value="comparison" className="space-y-6">
                {/* Regional Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Regional Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisData.comparisonData.regional.map((glacier, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{glacier.name}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{glacier.value} km³</span>
                            <span
                              className={`text-sm font-medium ${glacier.change < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {glacier.change > 0 ? "+" : ""}
                              {glacier.change}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Global Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Global Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Global Average Change</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {analysisData.comparisonData.global.averageChange}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Global Percentile</p>
                        <p className="text-2xl font-bold text-green-600">
                          {analysisData.comparisonData.global.percentile}th
                        </p>
                      </div>
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
