"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  Share2,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"

interface AnalysisData {
  id: string
  glacier_id: string
  glacier_name: string
  location: string
  analysis_date: string
  status: string
  confidence_score: number
  current_metrics: {
    ice_volume_km3: number
    surface_area_km2: number
    melt_rate_mm_year: number
    health_score: number
    risk_level: string
  }
  historical_data: Array<{
    date: string
    ice_volume: number
    surface_area: number
    melt_rate: number
  }>
  predictions: {
    one_year: { ice_volume: number; surface_area: number; confidence: number }
    five_year: { ice_volume: number; surface_area: number; confidence: number }
    ten_year: { ice_volume: number; surface_area: number; confidence: number }
  }
  environmental_factors: {
    avg_temperature_c: number
    temperature_change: string
    precipitation_mm: number
    precipitation_change: string
    seasonal_variation: string
  }
  regional_comparison: Array<{
    name: string
    value: number
    status: string
  }>
  key_insights: string[]
}

export default function AnalysisPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // View options state
  const [viewMode, setViewMode] = useState<"overview" | "detailed" | "comparison">("overview")
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")
  const [timeRange, setTimeRange] = useState<"1yr" | "5yr" | "10yr" | "all">("all")
  const [selectedMetrics, setSelectedMetrics] = useState({
    ice_volume: true,
    surface_area: true,
    melt_rate: true,
  })
  const [showPredictions, setShowPredictions] = useState(true)
  const [showConfidence, setShowConfidence] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(100)

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

      const analysisData = await response.json()
      setData(analysisData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const handleExport = (format: "pdf" | "png" | "csv" | "json") => {
    // Mock export functionality
    alert(`Exporting analysis as ${format.toUpperCase()}...`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Analysis URL copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || "Analysis not found"}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
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
              <Link
                href="/dashboard"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <select
                  value="export"
                  onChange={(e) => {
                    if (e.target.value !== "export") {
                      handleExport(e.target.value as "pdf" | "png" | "csv" | "json")
                      e.target.value = "export"
                    }
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="export">Export</option>
                  <option value="pdf">Export as PDF</option>
                  <option value="png">Export as PNG</option>
                  <option value="csv">Export as CSV</option>
                  <option value="json">Export as JSON</option>
                </select>
                <Download className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.glacier_name}</h1>
              <p className="text-gray-600 mt-1">
                {data.location} • Analysis from {new Date(data.analysis_date).toLocaleDateString()}
              </p>
            </div>

            <div
              className={`inline-flex items-center px-4 py-2 rounded-full border ${getRiskLevelColor(data.current_metrics.risk_level)}`}
            >
              <span className="text-sm font-medium">{data.current_metrics.risk_level.toUpperCase()} RISK</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - View Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">View Options</h3>
              </div>

              <div className="space-y-6">
                {/* View Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                  <div className="space-y-2">
                    {[
                      { value: "overview", label: "Overview" },
                      { value: "detailed", label: "Detailed Analysis" },
                      { value: "comparison", label: "Comparison" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="viewMode"
                          value={option.value}
                          checked={viewMode === option.value}
                          onChange={(e) => setViewMode(e.target.value as any)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chart Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </div>

                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1yr">Last 1 Year</option>
                    <option value="5yr">Last 5 Years</option>
                    <option value="10yr">Last 10 Years</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                {/* Metrics Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Metrics</label>
                  <div className="space-y-2">
                    {[
                      { key: "ice_volume", label: "Ice Volume" },
                      { key: "surface_area", label: "Surface Area" },
                      { key: "melt_rate", label: "Melt Rate" },
                    ].map((metric) => (
                      <label key={metric.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMetrics[metric.key as keyof typeof selectedMetrics]}
                          onChange={(e) =>
                            setSelectedMetrics((prev) => ({
                              ...prev,
                              [metric.key]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{metric.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Display Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Options</label>
                  <div className="space-y-2">
                    {[
                      {
                        key: "showPredictions",
                        label: "Show Predictions",
                        value: showPredictions,
                        setter: setShowPredictions,
                      },
                      {
                        key: "showConfidence",
                        label: "Confidence Intervals",
                        value: showConfidence,
                        setter: setShowConfidence,
                      },
                      { key: "showGrid", label: "Show Grid", value: showGrid, setter: setShowGrid },
                      {
                        key: "enableAnimations",
                        label: "Enable Animations",
                        value: enableAnimations,
                        setter: setEnableAnimations,
                      },
                    ].map((option) => (
                      <label key={option.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={option.value}
                          onChange={(e) => option.setter(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Zoom Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Level: {zoomLevel}%</label>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number.parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: "overview", name: "Overview", icon: Info },
                    { id: "detailed", name: "Detailed Analysis", icon: TrendingUp },
                    { id: "comparison", name: "Comparison", icon: CheckCircle },
                  ].map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as any)}
                        className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                          viewMode === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.name}
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Overview Tab */}
              {viewMode === "overview" && (
                <div className="space-y-6">
                  {/* Key Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Health Score</p>
                          <p className="text-2xl font-bold text-gray-900">{data.current_metrics.health_score}/10</p>
                        </div>
                        <div className={`p-3 rounded-full ${getRiskLevelColor(data.current_metrics.risk_level)}`}>
                          <AlertTriangle className="h-6 w-6" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Ice Volume</p>
                          <p className="text-2xl font-bold text-gray-900">{data.current_metrics.ice_volume_km3} km³</p>
                        </div>
                        {getTrendIcon(data.current_metrics.ice_volume_km3, data.historical_data[0]?.ice_volume || 0)}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Melt Rate</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {data.current_metrics.melt_rate_mm_year} mm/yr
                          </p>
                        </div>
                        {getTrendIcon(data.current_metrics.melt_rate_mm_year, data.historical_data[0]?.melt_rate || 0)}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Confidence</p>
                          <p className="text-2xl font-bold text-gray-900">{Math.round(data.confidence_score * 100)}%</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </div>

                  {/* Trend Chart Placeholder */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Trends</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart visualization would appear here</p>
                      <p className="text-xs text-gray-400 ml-2">
                        ({chartType} chart, {timeRange} range)
                      </p>
                    </div>
                  </div>

                  {/* Environmental Factors */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Environmental Factors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Temperature</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {data.environmental_factors.avg_temperature_c}°C
                        </p>
                        <p className="text-sm text-gray-500">{data.environmental_factors.temperature_change}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Precipitation</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {data.environmental_factors.precipitation_mm}mm
                        </p>
                        <p className="text-sm text-gray-500">{data.environmental_factors.precipitation_change}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-600">Seasonal Variation</p>
                        <p className="text-sm text-gray-900">{data.environmental_factors.seasonal_variation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Analysis Tab */}
              {viewMode === "detailed" && (
                <div className="space-y-6">
                  {/* Multi-Metric Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Multi-Metric Analysis</h3>
                    <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-500">Detailed multi-metric chart would appear here</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Showing:{" "}
                          {Object.entries(selectedMetrics)
                            .filter(([_, selected]) => selected)
                            .map(([key, _]) => key)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Future Predictions */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Future Predictions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">1 Year</p>
                        <p className="text-xl font-bold text-blue-600">{data.predictions.one_year.ice_volume} km³</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(data.predictions.one_year.confidence * 100)}% confidence
                        </p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">5 Years</p>
                        <p className="text-xl font-bold text-yellow-600">{data.predictions.five_year.ice_volume} km³</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(data.predictions.five_year.confidence * 100)}% confidence
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">10 Years</p>
                        <p className="text-xl font-bold text-red-600">{data.predictions.ten_year.ice_volume} km³</p>
                        <p className="text-xs text-gray-500">
                          {Math.round(data.predictions.ten_year.confidence * 100)}% confidence
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Tab */}
              {viewMode === "comparison" && (
                <div className="space-y-6">
                  {/* Regional Comparison Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Comparison</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <p className="text-gray-500">Regional comparison chart would appear here</p>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Health Score Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Glacier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Health Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              vs Regional Avg
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data.regional_comparison.map((glacier, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {glacier.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{glacier.value}/10</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    glacier.status === "stable"
                                      ? "bg-green-100 text-green-800"
                                      : glacier.status === "warning"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {glacier.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {glacier.name === "Regional Average"
                                  ? "-"
                                  : glacier.value > 4.4
                                    ? `+${(glacier.value - 4.4).toFixed(1)}`
                                    : `${(glacier.value - 4.4).toFixed(1)}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Insights */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  {data.key_insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
