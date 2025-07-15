"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "../../components/layout/Layout"
import {
  TrendingUp,
  TrendingDown,
  Thermometer,
  Droplets,
  Mountain,
  Download,
  Share2,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react"

interface AnalysisData {
  id: string
  glacierName: string
  location: string
  analysisDate: string
  status: "stable" | "retreating" | "advancing" | "critical"
  healthScore: number
  metrics: {
    iceCoverage: number
    volume: number
    retreatRate: number
    temperature: number
    precipitation: number
  }
  historicalData: Array<{
    date: string
    iceCoverage: number
    volume: number
    temperature: number
  }>
  recommendations: string[]
  images: Array<{
    id: string
    url: string
    caption: string
    date: string
  }>
}

export default function AnalysisPage() {
  const router = useRouter()
  const { id } = router.query
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "detailed" | "comparison">("overview")
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line")
  const [timeRange, setTimeRange] = useState<"1y" | "5y" | "10y" | "all">("5y")

  useEffect(() => {
    if (id) {
      fetchAnalysisData(id as string)
    }
  }, [id])

  const fetchAnalysisData = async (analysisId: string) => {
    try {
      const response = await fetch(`/api/analysis/${analysisId}`)
      if (response.ok) {
        const data = await response.json()
        setAnalysisData(data)
      } else {
        console.error("Failed to fetch analysis data")
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "text-green-600 bg-green-100"
      case "retreating":
        return "text-yellow-600 bg-yellow-100"
      case "advancing":
        return "text-blue-600 bg-blue-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!analysisData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Found</h1>
            <p className="text-gray-600">The requested analysis could not be found.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white shadow-lg analysis-sidebar">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">{analysisData.glacierName}</h1>
              <p className="text-gray-600">{analysisData.location}</p>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analysisData.status)}`}
                >
                  {analysisData.status.charAt(0).toUpperCase() + analysisData.status.slice(1)}
                </span>
              </div>
            </div>

            {/* View Options */}
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-gray-900 mb-3">View Options</h3>
              <div className="space-y-2">
                {[
                  { key: "overview", label: "Overview", icon: BarChart3 },
                  { key: "detailed", label: "Detailed Analysis", icon: LineChart },
                  { key: "comparison", label: "Comparison", icon: PieChart },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeView === key ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Controls */}
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Chart Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Chart Type</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Time Range</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value="1y">Last Year</option>
                    <option value="5y">Last 5 Years</option>
                    <option value="10y">Last 10 Years</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share Analysis</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeView === "overview" && "Analysis Overview"}
                    {activeView === "detailed" && "Detailed Analysis"}
                    {activeView === "comparison" && "Historical Comparison"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Last updated: {new Date(analysisData.analysisDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Health Score:</span>
                  <span
                    className={`text-lg font-bold ${
                      analysisData.healthScore >= 70
                        ? "text-green-600"
                        : analysisData.healthScore >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {analysisData.healthScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Content based on active view */}
            {activeView === "overview" && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow metric-card">
                    <div className="flex items-center">
                      <Mountain className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Ice Coverage</p>
                        <p className="text-2xl font-bold text-gray-900">{analysisData.metrics.iceCoverage}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow metric-card">
                    <div className="flex items-center">
                      <TrendingDown className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Volume</p>
                        <p className="text-2xl font-bold text-gray-900">{analysisData.metrics.volume} km³</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow metric-card">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Retreat Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{analysisData.metrics.retreatRate} m/yr</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow metric-card">
                    <div className="flex items-center">
                      <Thermometer className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Temperature</p>
                        <p className="text-2xl font-bold text-gray-900">{analysisData.metrics.temperature}°C</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow metric-card">
                    <div className="flex items-center">
                      <Droplets className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Precipitation</p>
                        <p className="text-2xl font-bold text-gray-900">{analysisData.metrics.precipitation} mm</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Historical Trends ({chartType} chart, {timeRange})
                  </h3>
                  <div className="chart-container bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Chart visualization would appear here</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Showing {timeRange} data in {chartType} format
                      </p>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysisData.images.map((image) => (
                      <div key={image.id} className="space-y-2">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.caption}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600">{image.caption}</p>
                        <p className="text-xs text-gray-500">{image.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === "detailed" && (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      This detailed analysis provides comprehensive insights into the glacier's current state and
                      trends.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Significant retreat observed in terminus region</li>
                          <li>• Ice thickness decreased by 15% over past 5 years</li>
                          <li>• Temperature increase of 0.8°C since 2020</li>
                          <li>• Reduced snowfall affecting accumulation zone</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {analysisData.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === "comparison" && (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Comparison</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Compare current measurements with historical data to understand long-term trends.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ice Coverage (%)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Volume (km³)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Temperature (°C)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analysisData.historicalData.map((data, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.iceCoverage}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.volume}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.temperature}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
