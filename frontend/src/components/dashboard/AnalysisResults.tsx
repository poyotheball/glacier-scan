"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

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
  }
}

export default function AnalysisResults() {
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    loadAnalysisResults()
  }, [])

  const loadAnalysisResults = async () => {
    try {
      const { data, error } = await supabase
        .from("glacier_images")
        .select(
          `
          *,
          glacier:glaciers(name, region, country)
        `,
        )
        .eq("analysis_status", "completed")
        .order("upload_date", { ascending: false })

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error("Error loading analysis results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (change: number) => {
    if (Math.abs(change) < 2) return "text-green-600 bg-green-50"
    if (Math.abs(change) < 10) return "text-yellow-600 bg-yellow-50"
    if (Math.abs(change) < 20) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const getSeverityLabel = (change: number) => {
    if (Math.abs(change) < 2) return "Stable"
    if (Math.abs(change) < 10) return "Moderate"
    if (Math.abs(change) < 20) return "Significant"
    return "Critical"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading analysis results...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Recent Analysis Results</h2>
        <div className="text-sm text-gray-500">{results.length} analyses completed</div>
      </div>

      <div className="grid gap-6">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{result.analysis_results.glacierName}</h3>
                  {result.glacier && (
                    <p className="text-gray-600">
                      {result.glacier.region}, {result.glacier.country}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Analyzed on {new Date(result.upload_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Confidence</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(result.analysis_results.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Ice Volume Change</div>
                  <div
                    className={`text-lg font-semibold ${getSeverityColor(result.analysis_results.changes.iceVolumeChange)}`}
                  >
                    {result.analysis_results.changes.iceVolumeChange.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    CI: {result.analysis_results.confidenceIntervals.iceVolumeChange.lower.toFixed(1)}% to{" "}
                    {result.analysis_results.confidenceIntervals.iceVolumeChange.upper.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Surface Area Change</div>
                  <div
                    className={`text-lg font-semibold ${getSeverityColor(result.analysis_results.changes.surfaceAreaChange)}`}
                  >
                    {result.analysis_results.changes.surfaceAreaChange.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    CI: {result.analysis_results.confidenceIntervals.surfaceAreaChange.lower.toFixed(1)}% to{" "}
                    {result.analysis_results.confidenceIntervals.surfaceAreaChange.upper.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Melt Rate</div>
                  <div
                    className={`text-lg font-semibold ${getSeverityColor(result.analysis_results.changes.meltRate)}`}
                  >
                    {result.analysis_results.changes.meltRate.toFixed(1)} m/yr
                  </div>
                  <div className="text-xs text-gray-500">
                    CI: {result.analysis_results.confidenceIntervals.meltRate.lower.toFixed(1)} to{" "}
                    {result.analysis_results.confidenceIntervals.meltRate.upper.toFixed(1)} m/yr
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Status</div>
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.analysis_results.changes.iceVolumeChange)}`}
                  >
                    {getSeverityLabel(result.analysis_results.changes.iceVolumeChange)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={result.image_url || "/placeholder.svg"}
                    alt="Glacier analysis"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <div className="text-sm text-gray-600">Elevation Change</div>
                    <div className="font-semibold">
                      {result.analysis_results.changes.elevationChange.toFixed(1)} m/yr
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedResult(result)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Quick View
                  </button>
                  <Link
                    href={`/results/${result.id}`}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Full Results
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedResult.analysis_results.glacierName}</h2>
                  <p className="text-gray-600">Detailed Analysis Report</p>
                </div>
                <button onClick={() => setSelectedResult(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedResult.image_url || "/placeholder.svg"}
                    alt="Glacier analysis"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Analysis Metadata</h3>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-600">Confidence:</span>{" "}
                        {(selectedResult.analysis_results.confidence * 100).toFixed(1)}%
                      </div>
                      <div>
                        <span className="text-gray-600">Upload Date:</span>{" "}
                        {new Date(selectedResult.upload_date).toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-600">Analysis ID:</span> {selectedResult.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">AI Recommendations</h3>
                  <div className="space-y-3">
                    {selectedResult.analysis_results.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          rec.includes("CRITICAL") || rec.includes("URGENT")
                            ? "bg-red-50 border-l-4 border-red-500"
                            : rec.includes("WARNING")
                              ? "bg-yellow-50 border-l-4 border-yellow-500"
                              : rec.includes("POSITIVE")
                                ? "bg-green-50 border-l-4 border-green-500"
                                : "bg-blue-50 border-l-4 border-blue-500"
                        }`}
                      >
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Detailed Measurements</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>Ice Volume Change</span>
                        <span className="font-mono">
                          {selectedResult.analysis_results.changes.iceVolumeChange.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>Surface Area Change</span>
                        <span className="font-mono">
                          {selectedResult.analysis_results.changes.surfaceAreaChange.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>Melt Rate</span>
                        <span className="font-mono">
                          {selectedResult.analysis_results.changes.meltRate.toFixed(2)} m/year
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span>Elevation Change</span>
                        <span className="font-mono">
                          {selectedResult.analysis_results.changes.elevationChange.toFixed(2)} m/year
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
