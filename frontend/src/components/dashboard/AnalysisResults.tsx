"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Clock, AlertCircle, XCircle, Eye, Download } from "lucide-react"

interface AnalysisResult {
  id: string
  glacier_id: string
  glacier_name: string
  image_url: string
  analysis_status: "completed" | "processing" | "pending" | "failed"
  uploaded_at: string
  processed_at?: string | null
  analysis_results?: {
    ice_volume_km3: number
    surface_area_km2: number
    melt_rate_mm_year: number
    confidence_score: number
    health_score: number
    risk_level: "low" | "medium" | "high" | "critical"
  } | null
}

interface ApiResponse {
  images: AnalysisResult[]
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
  stats: {
    total: number
    completed: number
    processing: number
    pending: number
    failed: number
  }
}

export default function AnalysisResults() {
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    pending: 0,
    failed: 0,
  })

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/glacier-images")

      if (!response.ok) {
        throw new Error("Failed to fetch analysis results")
      }

      const data: ApiResponse = await response.json()
      setResults(data.images)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: AnalysisResult["analysis_status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: AnalysisResult["analysis_status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "processing":
        return "Processing"
      case "pending":
        return "Pending"
      case "failed":
        return "Failed"
      default:
        return "Unknown"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Analysis Results</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Analysis Results</h2>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Analysis Results</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              {stats.completed} Completed
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              {stats.processing} Processing
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-500 mr-1" />
              {stats.pending} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No analysis results found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={result.image_url || "/placeholder.svg"}
                      alt={result.glacier_name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{result.glacier_name}</h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.analysis_status)}
                        <span className="text-sm text-gray-600">{getStatusText(result.analysis_status)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">Uploaded: {formatDate(result.uploaded_at)}</p>

                    {result.analysis_results && (
                      <div className="flex items-center space-x-4 mb-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(result.analysis_results.risk_level)}`}
                        >
                          {result.analysis_results.risk_level.toUpperCase()} RISK
                        </span>
                        <span className="text-sm text-gray-600">
                          Health Score: {result.analysis_results.health_score}/10
                        </span>
                        <span className="text-sm text-gray-600">
                          Confidence: {Math.round(result.analysis_results.confidence_score * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      {result.analysis_status === "completed" && (
                        <>
                          <Link
                            href={`/analysis/${result.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Analysis
                          </Link>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </button>
                        </>
                      )}
                      {result.analysis_status === "failed" && (
                        <button className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
                          Retry Analysis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
