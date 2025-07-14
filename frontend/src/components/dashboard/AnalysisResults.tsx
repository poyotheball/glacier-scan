"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, XCircle, Eye, Download, RefreshCw } from "lucide-react"

interface GlacierImage {
  id: string
  glacierName: string
  location: string
  uploadDate: string
  status: "completed" | "processing" | "pending" | "failed"
  confidence: number | null
  healthScore: number | null
  riskLevel: "low" | "medium" | "high" | "critical" | null
  imageUrl: string
  thumbnailUrl: string
  error?: string
}

interface AnalysisResultsResponse {
  images: GlacierImage[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function AnalysisResults() {
  const [results, setResults] = useState<GlacierImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      const data: AnalysisResultsResponse = await response.json()
      setResults(data.images)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      processing: "secondary",
      pending: "outline",
      failed: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRiskBadge = (riskLevel: string | null) => {
    if (!riskLevel) return null

    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }

    return (
      <Badge className={colors[riskLevel as keyof typeof colors]}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Loading analysis results...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchResults} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
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
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No analysis results found</p>
              <Link href="/upload">
                <Button className="mt-4">Upload First Image</Button>
              </Link>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{getStatusIcon(result.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{result.glacierName}</h3>
                      {getStatusBadge(result.status)}
                      {getRiskBadge(result.riskLevel)}
                    </div>

                    <p className="text-sm text-gray-500">
                      {result.location} • {new Date(result.uploadDate).toLocaleDateString()}
                    </p>

                    {result.status === "completed" && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                        <span>Health Score: {result.healthScore?.toFixed(1)}/10</span>
                        <span>Confidence: {((result.confidence || 0) * 100).toFixed(0)}%</span>
                      </div>
                    )}

                    {result.status === "failed" && result.error && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {result.status === "completed" && (
                    <>
                      <Link href={`/analysis/${result.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Analysis
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </>
                  )}

                  {result.status === "processing" && (
                    <Badge variant="secondary">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </Badge>
                  )}

                  {result.status === "pending" && (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      In Queue
                    </Badge>
                  )}

                  {result.status === "failed" && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
