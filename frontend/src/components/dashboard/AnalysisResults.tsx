"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

interface GlacierImage {
  id: string
  image_url: string
  upload_date: string
  analysis_status: "pending" | "processing" | "completed" | "failed"
  analysis_results: any
}

interface Glacier {
  id: string
  name: string
  location: { latitude: number; longitude: number }
  region: string
  country: string
  glacier_images: GlacierImage[]
}

export default function AnalysisResults() {
  const [glaciers, setGlaciers] = useState<Glacier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGlaciers()
  }, [])

  const fetchGlaciers = async () => {
    try {
      const response = await fetch("/api/glaciers")
      if (response.ok) {
        const data = await response.json()
        setGlaciers(data)
      }
    } catch (error) {
      console.error("Failed to fetch glaciers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const recentAnalyses = glaciers
    .flatMap((glacier) =>
      glacier.glacier_images.map((image) => ({
        ...image,
        glacier_name: glacier.name,
        glacier_id: glacier.id,
      })),
    )
    .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Analysis Results
          <Link href="/trends">
            <Button variant="outline" size="sm">
              View All Trends
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAnalyses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No analysis results yet</p>
          ) : (
            recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(analysis.analysis_status)}
                    <span className="font-medium">{analysis.glacier_name}</span>
                    <Badge variant={getStatusColor(analysis.analysis_status) as any}>{analysis.analysis_status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Uploaded: {new Date(analysis.upload_date).toLocaleDateString()}
                  </p>
                  {analysis.analysis_results && (
                    <p className="text-sm text-gray-500 mt-1">
                      Confidence: {Math.round(analysis.analysis_results.confidence * 100)}%
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/results/${analysis.glacier_id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  {analysis.analysis_status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
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
