"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  FileText,
  ImageIcon,
  BarChart3,
} from "lucide-react"
import { Line, Bar } from "react-chartjs-2"
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
  ArcElement,
  TimeScale,
} from "chart.js"
import "chartjs-adapter-date-fns"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
)

interface AnalysisData {
  id: string
  glacierName: string
  location: string
  analysisDate: string
  status: string
  confidence: number
  healthScore: number
  riskLevel: string
  keyMetrics: {
    [key: string]: {
      current: number
      change: number
      unit: string
      trend: string
    }
  }
  historicalData: Array<{
    date: string
    iceVolume: number
    surfaceArea: number
    meltRate: number
    thickness: number
  }>
  predictions: {
    oneYear: { iceVolume: number; surfaceArea: number; confidence: number }
    fiveYear: { iceVolume: number; surfaceArea: number; confidence: number }
    tenYear: { iceVolume: number; surfaceArea: number; confidence: number }
  }
  environmentalFactors: {
    avgTemperature: number
    temperatureChange: number
    precipitation: number
    precipitationChange: number
    seasonalVariation: string
  }
  comparisonData: {
    regional: {
      avgHealthScore: number
      avgVolumeChange: number
      totalGlaciers: number
    }
    global: {
      avgHealthScore: number
      avgVolumeChange: number
      totalGlaciers: number
    }
  }
  alerts: Array<{
    type: string
    message: string
    date: string
  }>
}

export default function AnalysisPage() {
  const router = useRouter()
  const { id } = router.query

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // View options state
  const [viewMode, setViewMode] = useState("overview")
  const [chartType, setChartType] = useState("line")
  const [timeRange, setTimeRange] = useState("all")
  const [selectedMetrics, setSelectedMetrics] = useState(["iceVolume", "surfaceArea"])
  const [showPredictions, setShowPredictions] = useState(true)
  const [showConfidence, setShowConfidence] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showAnimations, setShowAnimations] = useState(true)
  const [zoomLevel, setZoomLevel] = useState([100])

  useEffect(() => {
    if (id) {
      fetchAnalysis()
    }
  }, [id])

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analysis/${id}`)
      if (!response.ok) {
        throw new Error("Analysis not found")
      }
      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analysis")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting analysis as ${format}`)
    // In real implementation, this would trigger actual export
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // Show toast notification in real implementation
    console.log("URL copied to clipboard")
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
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
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

  const getHealthScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600"
    if (score >= 5) return "text-yellow-600"
    if (score >= 3) return "text-orange-600"
    return "text-red-600"
  }

  const createChartData = () => {
    if (!analysis) return null

    const labels = analysis.historicalData.map((d) => new Date(d.date).getFullYear())

    const datasets = selectedMetrics.map((metric, index) => {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
      const data = analysis.historicalData.map((d) => d[metric as keyof typeof d] as number)

      return {
        label: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, " $1"),
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + "20",
        tension: 0.4,
        fill: chartType === "area",
      }
    })

    return { labels, datasets }
  }

  const createComparisonChart = () => {
    if (!analysis) return null

    return {
      labels: ["This Glacier", "Regional Average", "Global Average"],
      datasets: [
        {
          label: "Health Score",
          data: [
            analysis.healthScore,
            analysis.comparisonData.regional.avgHealthScore,
            analysis.comparisonData.global.avgHealthScore,
          ],
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
          borderWidth: 1,
        },
      ],
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The requested analysis could not be found."}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const chartData = createChartData()
  const comparisonData = createComparisonChart()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{analysis.glacierName}</h1>
            <p className="text-gray-600">{analysis.location}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value="pdf" onValueChange={handleExport}>
            <SelectTrigger className="w-32">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <FileText className="h-4 w-4 mr-2 inline" />
                PDF
              </SelectItem>
              <SelectItem value="png">
                <ImageIcon className="h-4 w-4 mr-2 inline" />
                PNG
              </SelectItem>
              <SelectItem value="csv">
                <BarChart3 className="h-4 w-4 mr-2 inline" />
                CSV
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - View Options */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">View Options</CardTitle>
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
                    <SelectItem value="1y">Last Year</SelectItem>
                    <SelectItem value="5y">Last 5 Years</SelectItem>
                    <SelectItem value="10y">Last 10 Years</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
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
                  <Switch checked={showAnimations} onCheckedChange={setShowAnimations} />
                </div>
              </div>

              {/* Zoom Level */}
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
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Health Score</p>
                        <p className={`text-2xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
                          {analysis.healthScore.toFixed(1)}/10
                        </p>
                      </div>
                      <CheckCircle className={`h-8 w-8 ${getHealthScoreColor(analysis.healthScore)}`} />
                    </div>
                  </CardContent>
                </Card>

                {Object.entries(analysis.keyMetrics)
                  .slice(0, 3)
                  .map(([key, metric]) => (
                    <Card key={key}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                            </p>
                            <p className="text-2xl font-bold">
                              {metric.current} {metric.unit}
                            </p>
                            <p className={`text-sm ${metric.change > 0 ? "text-red-600" : "text-green-600"}`}>
                              {metric.change > 0 ? "+" : ""}
                              {metric.change.toFixed(1)}%
                            </p>
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Risk Level and Status */}
              <div className="flex items-center space-x-4">
                <Badge className={getRiskColor(analysis.riskLevel)}>
                  {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                </Badge>
                <Badge variant="outline">Confidence: {(analysis.confidence * 100).toFixed(0)}%</Badge>
                <span className="text-sm text-gray-600">
                  Analyzed on {new Date(analysis.analysisDate).toLocaleDateString()}
                </span>
              </div>

              {/* Historical Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Historical Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData && (
                    <div style={{ transform: `scale(${zoomLevel[0] / 100})`, transformOrigin: "top left" }}>
                      {chartType === "bar" ? (
                        <Bar
                          data={chartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { position: "top" },
                              title: { display: false },
                            },
                            scales: {
                              y: { grid: { display: showGrid } },
                            },
                            animation: { duration: showAnimations ? 1000 : 0 },
                          }}
                        />
                      ) : (
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { position: "top" },
                              title: { display: false },
                            },
                            scales: {
                              y: { grid: { display: showGrid } },
                            },
                            animation: { duration: showAnimations ? 1000 : 0 },
                          }}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Environmental Factors */}
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Average Temperature</p>
                      <p className="text-lg font-semibold">
                        {analysis.environmentalFactors.avgTemperature}°C
                        <span className="text-sm text-red-600 ml-2">
                          (+{analysis.environmentalFactors.temperatureChange}°C)
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Annual Precipitation</p>
                      <p className="text-lg font-semibold">
                        {analysis.environmentalFactors.precipitation}mm
                        <span
                          className={`text-sm ml-2 ${
                            analysis.environmentalFactors.precipitationChange > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ({analysis.environmentalFactors.precipitationChange > 0 ? "+" : ""}
                          {analysis.environmentalFactors.precipitationChange}%)
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detailed Analysis Tab */}
            <TabsContent value="detailed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Metric Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData && (
                    <div style={{ transform: `scale(${zoomLevel[0] / 100})`, transformOrigin: "top left" }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { position: "top" },
                            title: { display: false },
                          },
                          scales: {
                            y: { grid: { display: showGrid } },
                          },
                          animation: { duration: showAnimations ? 1000 : 0 },
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Future Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle>Future Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">1 Year</p>
                      <p className="text-lg font-semibold">{analysis.predictions.oneYear.iceVolume} km³</p>
                      <p className="text-sm text-gray-500">
                        {(analysis.predictions.oneYear.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">5 Years</p>
                      <p className="text-lg font-semibold">{analysis.predictions.fiveYear.iceVolume} km³</p>
                      <p className="text-sm text-gray-500">
                        {(analysis.predictions.fiveYear.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-gray-600">10 Years</p>
                      <p className="text-lg font-semibold">{analysis.predictions.tenYear.iceVolume} km³</p>
                      <p className="text-sm text-gray-500">
                        {(analysis.predictions.tenYear.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  {comparisonData && (
                    <div style={{ transform: `scale(${zoomLevel[0] / 100})`, transformOrigin: "top left" }}>
                      <Bar
                        data={comparisonData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            title: { display: false },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 10,
                              grid: { display: showGrid },
                            },
                          },
                          animation: { duration: showAnimations ? 1000 : 0 },
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparison Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-right py-2">This Glacier</th>
                          <th className="text-right py-2">Regional Avg</th>
                          <th className="text-right py-2">Global Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Health Score</td>
                          <td className="text-right py-2 font-semibold">{analysis.healthScore.toFixed(1)}</td>
                          <td className="text-right py-2">
                            {analysis.comparisonData.regional.avgHealthScore.toFixed(1)}
                          </td>
                          <td className="text-right py-2">
                            {analysis.comparisonData.global.avgHealthScore.toFixed(1)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Volume Change (%)</td>
                          <td className="text-right py-2 font-semibold text-red-600">
                            {analysis.keyMetrics.iceVolume.change.toFixed(1)}%
                          </td>
                          <td className="text-right py-2">
                            {analysis.comparisonData.regional.avgVolumeChange.toFixed(1)}%
                          </td>
                          <td className="text-right py-2">
                            {analysis.comparisonData.global.avgVolumeChange.toFixed(1)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Alerts */}
          {analysis.alerts.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-800">{alert.message}</p>
                        <p className="text-xs text-orange-600 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
