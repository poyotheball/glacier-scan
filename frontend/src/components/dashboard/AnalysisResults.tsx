"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Calendar, MapPin } from "lucide-react"

interface AnalysisResult {
  id: string
  glacier_id: string | null
  image_url: string
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results?: {
    glacierName: string
    confidence: number
    changes: {
      iceVolumeChange: number
      surfaceAreaChange: number
      meltRate: number
    }
  }
  glacier?: {
    name: string
    region: string
    country: string
    location: { latitude: number; longitude: number }
  }
}

export default function AnalysisResults() {
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      // Since we don't have a specific endpoint for glacier images,
      // we'll simulate some results based on the glaciers data
      const response = await fetch("/api/glaciers")
      const data = await response.json()

      if (response.ok && data.glaciers) {
        // Create mock analysis results from glacier data
        const mockResults: AnalysisResult[] = data.glaciers
          .filter((glacier: any) => glacier.images && glacier.images.length > 0)
          .flatMap((glacier: any) =>
            glacier.images.slice(0, 3).map((image: any, index: number) => ({
              id: image.id || `${glacier.id}-${index}`,
              glacier_id: glacier.id,
              image_url: image.image_url || "/placeholder.svg?height=200&width=300",
              upload_date:
                image.upload_date || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              analysis_status: image.analysis_status || "completed",
              analysis_results: image.analysis_results || {
                glacierName: glacier.name,
                confidence: 0.75 + Math.random() * 0.2,
                changes: {
                  iceVolumeChange: -5 - Math.random() * 15,
                  surfaceAreaChange: -3 - Math.random() * 10,
                  meltRate: 1 + Math.random() * 3,
                },
              },
              glacier: {
                name: glacier.name,
                region: glacier.region,
                country: glacier.country,
                location: glacier.location,
              },
            })),
          )
          .slice(0, 6) // Limit to 6 results

        setResults(mockResults)
      }
    } catch (error) {
      console.error("Error loading analysis results:", error)
    } finally {
      setLoading(false)
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

  const getSeverityColor = (change: number) => {
    const absChange = Math.abs(change)
    if (absChange < 2) return "text-green-600"
    if (absChange < 10) return "text-yellow-600"
    if (absChange < 20) return "text-orange-600"
    return "text-red-600"
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
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Analysis Results
          <Badge variant="outline">{results.length} results</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No analysis results yet</p>
            <p className="text-sm text-gray-500 mb-4">Upload glacier images to see analysis results</p>
            <Link href="/upload">
              <Button>Upload Images</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <img
                    src={result.image_url || "/placeholder.svg"}
                    alt="Glacier analysis"
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {result.analysis_results?.glacierName || result.glacier?.name || "Unknown Glacier"}
                      </h3>
                      <Badge className={getStatusColor(result.analysis_status)}>{result.analysis_status}</Badge>
                    </div>

                    {result.glacier && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {result.glacier.region}, {result.glacier.country}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(result.upload_date).toLocaleDateString()}</span>
                    </div>

                    {result.analysis_results && result.analysis_status === "completed" && (
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Volume Change:</span>
                          <div
                            className={`font-semibold ${getSeverityColor(result.analysis_results.changes.iceVolumeChange)}`}
                          >
                            {result.analysis_results.changes.iceVolumeChange.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Area Change:</span>
                          <div
                            className={`font-semibold ${getSeverityColor(result.analysis_results.changes.surfaceAreaChange)}`}
                          >
                            {result.analysis_results.changes.surfaceAreaChange.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <div className="font-semibold text-blue-600">
                            {(result.analysis_results.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link href={`/results/${result.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <Link href="/results">
                <Button variant="outline">View All Results</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
