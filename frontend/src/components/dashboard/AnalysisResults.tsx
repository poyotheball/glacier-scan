"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface GlacierImage {
  id: string
  glacier_id: string
  glacier_name: string
  region: string
  country: string
  image_url: string
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results?: {
    health_score?: number
    risk_level?: "low" | "medium" | "high" | "critical"
  }
}

export default function AnalysisResults() {
  const [images, setImages] = useState<GlacierImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalysisResults()
  }, [])

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/glacier-images")

      if (!response.ok) {
        throw new Error("Failed to fetch analysis results")
      }

      const data = await response.json()
      setImages(data.images || [])
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

  const getRiskColor = (risk?: string) => {
    switch (risk) {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Recent glacier analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading analysis results...</span>
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
          <CardDescription>Recent glacier analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={fetchAnalysisResults}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Recent glacier analysis results ({images.length} total)</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAnalysisResults}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No analysis results found</p>
            <Link href="/upload">
              <Button>Upload Images to Get Started</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {images.slice(0, 6).map((image) => (
              <div
                key={image.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">{getStatusIcon(image.analysis_status)}</div>

                  {/* Image Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.glacier_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{image.glacier_name}</h4>
                      <Badge className={getStatusColor(image.analysis_status)}>{image.analysis_status}</Badge>
                      {image.analysis_results?.risk_level && (
                        <Badge className={getRiskColor(image.analysis_results.risk_level)}>
                          {image.analysis_results.risk_level} risk
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {image.region}, {image.country}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(image.upload_date).toLocaleDateString()}
                      </div>
                      {image.analysis_results?.health_score && (
                        <div className="flex items-center">
                          <span>Health: {image.analysis_results.health_score}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {image.analysis_status === "completed" && (
                    <Link href={`/analysis/${image.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Analysis
                      </Button>
                    </Link>
                  )}

                  {image.analysis_status === "failed" && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}

                  {image.analysis_status === "processing" && (
                    <Button variant="outline" size="sm" disabled>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Processing...
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {images.length > 6 && (
              <div className="text-center pt-4">
                <Button variant="outline">View All Results ({images.length})</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
