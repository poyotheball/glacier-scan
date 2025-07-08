"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, XCircle, Eye, Download, MoreHorizontal } from "lucide-react"

interface AnalysisResult {
  id: string
  glacierName: string
  location: string
  uploadDate: string
  analysisId: string
  status: "completed" | "processing" | "pending" | "failed"
  confidence: number | null
  healthScore: number | null
  riskLevel: "low" | "medium" | "high" | "critical" | null
  imageUrl: string
  thumbnailUrl: string
  error?: string
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "processing":
      return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRiskLevelColor = (riskLevel: string | null) => {
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

export default function AnalysisResults() {
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/glacier-images")
      const data = await response.json()

      if (data.success) {
        setResults(data.data)
      } else {
        setError("Failed to fetch analysis results")
      }
    } catch (err) {
      setError("Error loading analysis results")
      console.error("Error fetching results:", err)
    } finally {
      setLoading(false)
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading results...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchResults} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Analysis Results</CardTitle>
        <Button onClick={fetchResults} variant="outline" size="sm">
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No analysis results found</p>
            <Link href="/upload">
              <Button>Start Your First Analysis</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={result.thumbnailUrl || "/placeholder.svg"}
                      alt={result.glacierName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{result.glacierName}</h3>
                        <Badge className={getStatusColor(result.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(result.status)}
                            <span className="capitalize">{result.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {result.location} • {formatDate(result.uploadDate)}
                      </p>

                      {result.status === "completed" && (
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Health Score:</span>
                            <span className="font-medium">{result.healthScore?.toFixed(1)}/10</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Risk:</span>
                            <Badge size="sm" className={getRiskLevelColor(result.riskLevel)}>
                              {result.riskLevel}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-medium">
                              {result.confidence ? `${(result.confidence * 100).toFixed(0)}%` : "N/A"}
                            </span>
                          </div>
                        </div>
                      )}

                      {result.status === "failed" && result.error && (
                        <p className="text-sm text-red-600 mt-1">Error: {result.error}</p>
                      )}

                      {result.status === "processing" && (
                        <p className="text-sm text-blue-600 mt-1">Analysis in progress...</p>
                      )}

                      {result.status === "pending" && (
                        <p className="text-sm text-yellow-600 mt-1">Waiting to be processed...</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {result.status === "completed" && (
                      <>
                        <Link href={`/analysis/${result.analysisId}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Analysis
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
