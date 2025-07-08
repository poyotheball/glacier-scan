"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import type { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { supabase } from "@/lib/supabase"
import GlacierTrendChart from "@/components/charts/GlacierTrendChart"
import MultiMetricChart from "@/components/charts/MultiMetricChart"
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, TrendingDown, BarChart3 } from "lucide-react"

interface Measurement {
  date: string
  ice_volume: number
  surface_area: number
  melt_rate: number
}

interface AnalysisResult {
  id: string
  glacier_id: string | null
  image_url: string
  upload_date: string
  analysis_status: string
  analysis_results: {
    glacierName: string
    confidence: number
    changes: {
      iceVolumeChange: number
      surfaceAreaChange: number
      meltRate: number
      elevationChange: number
    }
    confidenceIntervals: {
      iceVolumeChange: { lower: number; upper: number }
      surfaceAreaChange: { lower: number; upper: number }
      meltRate: { lower: number; upper: number }
    }
    recommendations: string[]
  }
  glacier?: {
    name: string
    region: string
    country: string
    location: { latitude: number; longitude: number }
    measurements: Measurement[]
  }
}

interface ResultsPageProps {
  analysisId: string
}

export default function ResultsPage({ analysisId }: ResultsPageProps) {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<"ice_volume" | "surface_area" | "melt_rate">("ice_volume")

  useEffect(() => {
    if (analysisId) {
      loadAnalysisResult()
    }
  }, [analysisId])

  const loadAnalysisResult = async () => {
    try {
      const { data, error } = await supabase
        .from("glacier_images")
        .select(
          `
          *,
          glacier:glaciers(
            name, 
            region, 
            country, 
            location,
            measurements (
              date,
              ice_volume,
              surface_area,
              melt_rate
            )
          )
        `,
        )
        .eq("id", analysisId)
        .single()

      if (error) throw error
      setResult(data)
    } catch (error) {
      console.error("Error loading analysis result:", error)
      setError("Failed to load analysis result")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (change: number) => {
    if (Math.abs(change) < 2) return "text-green-600 bg-green-50 border-green-200"
    if (Math.abs(change) < 10) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (Math.abs(change) < 20) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getSeverityLabel = (change: number) => {
    if (Math.abs(change) < 2) return "Stable"
    if (Math.abs(change) < 10) return "Moderate"
    if (Math.abs(change) < 20) return "Significant"
    return "Critical"
  }

  const getSeverityIcon = (change: number) => {
    if (Math.abs(change) < 2) return <CheckCircle className="w-5 h-5" />
    if (Math.abs(change) < 10) return <TrendingDown className="w-5 h-5" />
    return <AlertTriangle className="w-5 h-5" />
  }

  const downloadReport = () => {
    if (!result) return

    const reportData = {
      glacier: result.analysis_results.glacierName,
      analysisDate: new Date(result.upload_date).toLocaleDateString(),
      confidence: (result.analysis_results.confidence * 100).toFixed(1) + "%",
      changes: result.analysis_results.changes,
      recommendations: result.analysis_results.recommendations,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `glacier-analysis-${result.analysis_results.glacierName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: `Glacier Analysis: ${result.analysis_results.glacierName}`,
          text: `Analysis results for ${result.analysis_results.glacierName} - ${getSeverityLabel(result.analysis_results.changes.iceVolumeChange)} changes detected`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The requested analysis result could not be found."}</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/trends"
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Trends
              </Link>
              <button
                onClick={shareResults}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={downloadReport}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Glacier Info Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{result.analysis_results.glacierName}</h2>
              {result.glacier && (
                <p className="text-lg text-gray-600 mb-2">
                  {result.glacier.region}, {result.glacier.country}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Analyzed on {new Date(result.upload_date).toLocaleDateString()}</span>
                <span>•</span>
                <span>Analysis ID: {result.id.slice(0, 8)}...</span>
                {result.glacier && (
                  <>
                    <span>•</span>
                    <span>
                      {result.glacier.location.latitude.toFixed(4)}°N,{" "}
                      {Math.abs(result.glacier.location.longitude).toFixed(4)}°
                      {result.glacier.location.longitude >= 0 ? "E" : "W"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">AI Confidence</div>
              <div className="text-3xl font-bold text-blue-600">
                {(result.analysis_results.confidence * 100).toFixed(0)}%
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getSeverityColor(result.analysis_results.changes.iceVolumeChange)}`}
              >
                {getSeverityIcon(result.analysis_results.changes.iceVolumeChange)}
                <span className="ml-2">{getSeverityLabel(result.analysis_results.changes.iceVolumeChange)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Historical Trends Chart */}
            {result.glacier && result.glacier.measurements && result.glacier.measurements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Historical Trends</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMetric("ice_volume")}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedMetric === "ice_volume"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Volume
                    </button>
                    <button
                      onClick={() => setSelectedMetric("surface_area")}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedMetric === "surface_area"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setSelectedMetric("melt_rate")}
                      className={`px-3 py-1 rounded text-sm ${
                        selectedMetric === "melt_rate"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Melt Rate
                    </button>
                  </div>
                </div>
                <GlacierTrendChart
                  measurements={result.glacier.measurements}
                  glacierName={result.analysis_results.glacierName}
                  metric={selectedMetric}
                  height={350}
                />
              </div>
            )}

            {/* Multi-Metric Overview */}
            {result.glacier && result.glacier.measurements && result.glacier.measurements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Multi-Metric Overview</h3>
                <MultiMetricChart
                  measurements={result.glacier.measurements}
                  glacierName={result.analysis_results.glacierName}
                  height={350}
                />
              </div>
            )}

            {/* Key Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Measurements</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Ice Volume Change</span>
                      <span
                        className={`text-lg font-bold ${result.analysis_results.changes.iceVolumeChange < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {result.analysis_results.changes.iceVolumeChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      95% CI: {result.analysis_results.confidenceIntervals.iceVolumeChange.lower.toFixed(1)}% to{" "}
                      {result.analysis_results.confidenceIntervals.iceVolumeChange.upper.toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Surface Area Change</span>
                      <span
                        className={`text-lg font-bold ${result.analysis_results.changes.surfaceAreaChange < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {result.analysis_results.changes.surfaceAreaChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      95% CI: {result.analysis_results.confidenceIntervals.surfaceAreaChange.lower.toFixed(1)}% to{" "}
                      {result.analysis_results.confidenceIntervals.surfaceAreaChange.upper.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Melt Rate</span>
                      <span className="text-lg font-bold text-orange-600">
                        {result.analysis_results.changes.meltRate.toFixed(1)} m/yr
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      95% CI: {result.analysis_results.confidenceIntervals.meltRate.lower.toFixed(1)} to{" "}
                      {result.analysis_results.confidenceIntervals.meltRate.upper.toFixed(1)} m/yr
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Elevation Change</span>
                      <span
                        className={`text-lg font-bold ${result.analysis_results.changes.elevationChange < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {result.analysis_results.changes.elevationChange.toFixed(1)} m/yr
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Annual average change</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Analysis & Recommendations</h3>
              <div className="space-y-4">
                {result.analysis_results.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      recommendation.includes("CRITICAL") || recommendation.includes("URGENT")
                        ? "bg-red-50 border-red-500 text-red-800"
                        : recommendation.includes("WARNING")
                          ? "bg-yellow-50 border-yellow-500 text-yellow-800"
                          : recommendation.includes("POSITIVE")
                            ? "bg-green-50 border-green-500 text-green-800"
                            : "bg-blue-50 border-blue-500 text-blue-800"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {recommendation.includes("CRITICAL") || recommendation.includes("URGENT") ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : recommendation.includes("POSITIVE") ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Satellite Image */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyzed Image</h3>
              <img
                src={result.image_url || "/placeholder.svg?height=300&width=400"}
                alt="Glacier satellite image"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="text-sm text-gray-600 space-y-1">
                <div>Upload Date: {new Date(result.upload_date).toLocaleDateString()}</div>
                <div>Status: {result.analysis_status}</div>
                <div>Image ID: {result.id.slice(0, 8)}...</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.analysis_results.changes.iceVolumeChange)}`}
                  >
                    {getSeverityLabel(result.analysis_results.changes.iceVolumeChange)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Confidence</span>
                  <span className="text-sm font-medium">{(result.analysis_results.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analysis Date</span>
                  <span className="text-sm font-medium">{new Date(result.upload_date).toLocaleDateString()}</span>
                </div>
                {result.glacier && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-medium">
                      {result.glacier.location.latitude.toFixed(2)}°, {result.glacier.location.longitude.toFixed(2)}°
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={downloadReport}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </button>
                <button
                  onClick={shareResults}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </button>
                <Link
                  href="/upload"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload New Image
                </Link>
                <Link
                  href="/trends"
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View All Trends
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const analysisId = params?.id as string

  return {
    props: {
      analysisId,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  }
}
