"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Download,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  BarChart3,
  ImageIcon,
} from "lucide-react"

interface AnalysisResult {
  id: string
  glacier_id: string | null
  image_url: string
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results: any
  glacier?: {
    name: string
    region: string
    country: string
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
      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading results...</span>
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
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
        <div>
          <CardTitle>Recent Analysis Results</CardTitle>
          <CardDescription>Latest glacier analysis results and their status</CardDescription>
        </div>
        <Button onClick={fetchResults} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No analysis results yet</p>
            <Link href="/upload">
              <Button>Upload First Image</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.slice(0, 10).map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={result.image_url || "/placeholder.svg"}
                      alt="Glacier analysis"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="absolute -top-1 -right-1">{getStatusIcon(result.analysis_status)}</div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{result.glacier?.name || "Unknown Glacier"}</h3>
                      <Badge className={getStatusColor(result.analysis_status)}>{result.analysis_status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {result.glacier?.region && result.glacier?.country
                        ? `${result.glacier.region}, ${result.glacier.country}`
                        : "Location unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded {new Date(result.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {result.analysis_status === "completed" && (
                    <>
                      <Link href={`/analysis/${result.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Analysis
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Charts
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {result.analysis_status === "processing" && (
                    <div className="flex items-center text-sm text-blue-600">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  )}

                  {result.analysis_status === "failed" && (
                    <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {results.length > 10 && (
              <div className="text-center pt-4">
                <Link href="/results">
                  <Button variant="outline">View All Results ({results.length})</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
