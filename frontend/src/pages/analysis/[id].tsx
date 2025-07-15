"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"

interface AnalysisData {
  id: string
  glacierName: string
  location: string
  analysisDate: string
  status: string
  healthScore: number
  riskLevel: string
  metrics: {
    iceVolume: number
    surfaceArea: number
    meltRate: number
    confidence: number
  }
  historicalData: Array<{
    date: string
    iceVolume: number
    surfaceArea: number
    meltRate: number
  }>
  predictions: {
    oneYear: { volumeChange: number; confidence: number }
    fiveYear: { volumeChange: number; confidence: number }
    tenYear: { volumeChange: number; confidence: number }
  }
  environmentalFactors: {
    avgTemperature: number
    precipitation: number
    seasonalVariation: number
  }
  comparison: {
    regional: { name: string; healthScore: number }[]
    global: { avgHealthScore: number; percentile: number }
  }
}

export default function AnalysisPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "detailed" | "comparison">("overview")
  const [viewOptions, setViewOptions] = useState({
    chartType: "line" as "line" | "bar" | "area",
    timeRange: "all" as "1yr" | "5yr" | "10yr" | "all",
    showPredictions: true,
    showConfidence: true,
    showGrid: true,
    enableAnimations: true,
    zoom: 100,
  })

  useEffect(() => {
    if (id) {
      fetchAnalysisData(id as string)
    }
  }, [id])

  const fetchAnalysisData = async (analysisId: string) => {
    try {
      const response = await fetch(`/api/analysis/${analysisId}`)
      if (!response.ok) throw new Error("Analysis not found")
      const analysisData = await response.json()
      setData(analysisData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analysis")
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The requested analysis could not be found."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{data.glacierName} Analysis - Glacier Scan</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{data.glacierName}</h1>
                <p className="text-gray-600">
                  {data.location} • Analyzed on {new Date(data.analysisDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Export
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Status and Health Score */}
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(data.riskLevel)}`}
              >
                {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)} Risk
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Health Score:</span>
                <span className="text-lg font-semibold text-gray-900">{data.healthScore}/10</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    {[
                      { id: "overview", name: "Overview" },
                      { id: "detailed", name: "Detailed Analysis" },
                      { id: "comparison", name: "Comparison" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{data.healthScore}/10</div>
                          <div className="text-sm text-blue-800">Health Score</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {(data.metrics.iceVolume / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-green-800">Ice Volume (m³)</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{data.metrics.meltRate}</div>
                          <div className="text-sm text-orange-800">Melt Rate (m/yr)</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{data.metrics.confidence}%</div>
                          <div className="text-sm text-purple-800">Confidence</div>
                        </div>
                      </div>

                      {/* Trend Chart Placeholder */}
                      <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Historical Trend Chart</h3>
                        <p className="text-gray-600">Interactive chart showing glacier changes over time</p>
                      </div>

                      {/* Environmental Factors */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Environmental Factors</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Avg Temperature:</span>
                            <span className="ml-2 font-medium">{data.environmentalFactors.avgTemperature}°C</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Precipitation:</span>
                            <span className="ml-2 font-medium">{data.environmentalFactors.precipitation}mm</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Seasonal Variation:</span>
                            <span className="ml-2 font-medium">{data.environmentalFactors.seasonalVariation}°C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "detailed" && (
                    <div className="space-y-6">
                      {/* Multi-metric Chart Placeholder */}
                      <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Multi-Metric Analysis</h3>
                        <p className="text-gray-600">Detailed view of all glacier metrics over time</p>
                      </div>

                      {/* Predictions */}
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Future Predictions</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">1 Year Volume Change:</span>
                            <span
                              className={`font-medium ${data.predictions.oneYear.volumeChange < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {data.predictions.oneYear.volumeChange > 0 ? "+" : ""}
                              {data.predictions.oneYear.volumeChange}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">5 Year Volume Change:</span>
                            <span
                              className={`font-medium ${data.predictions.fiveYear.volumeChange < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {data.predictions.fiveYear.volumeChange > 0 ? "+" : ""}
                              {data.predictions.fiveYear.volumeChange}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">10 Year Volume Change:</span>
                            <span
                              className={`font-medium ${data.predictions.tenYear.volumeChange < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {data.predictions.tenYear.volumeChange > 0 ? "+" : ""}
                              {data.predictions.tenYear.volumeChange}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "comparison" && (
                    <div className="space-y-6">
                      {/* Regional Comparison */}
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Regional Comparison</h4>
                        <div className="space-y-2">
                          {data.comparison.regional.map((glacier, index) => (
                            <div key={index} className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-600">{glacier.name}</span>
                              <span className="font-medium">{glacier.healthScore}/10</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Global Comparison */}
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Global Comparison</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Global Average:</span>
                            <span className="font-medium">{data.comparison.global.avgHealthScore}/10</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Percentile Rank:</span>
                            <span className="font-medium">{data.comparison.global.percentile}th</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* View Options */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-900 mb-4">View Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                    <select
                      value={viewOptions.chartType}
                      onChange={(e) => setViewOptions({ ...viewOptions, chartType: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="line">Line Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="area">Area Chart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                    <select
                      value={viewOptions.timeRange}
                      onChange={(e) => setViewOptions({ ...viewOptions, timeRange: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="1yr">Last 1 Year</option>
                      <option value="5yr">Last 5 Years</option>
                      <option value="10yr">Last 10 Years</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={viewOptions.showPredictions}
                        onChange={(e) => setViewOptions({ ...viewOptions, showPredictions: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Predictions</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={viewOptions.showConfidence}
                        onChange={(e) => setViewOptions({ ...viewOptions, showConfidence: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Confidence Intervals</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={viewOptions.showGrid}
                        onChange={(e) => setViewOptions({ ...viewOptions, showGrid: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Grid</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={viewOptions.enableAnimations}
                        onChange={(e) => setViewOptions({ ...viewOptions, enableAnimations: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Animations</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zoom: {viewOptions.zoom}%</label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={viewOptions.zoom}
                      onChange={(e) => setViewOptions({ ...viewOptions, zoom: Number.parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport("png")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export as PNG
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export Data (CSV)
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Export Data (JSON)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
