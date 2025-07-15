"use client"

import React from "react"

interface AnalysisResultsProps {
  glacierId: string
}

export default function AnalysisResults({ glacierId }: AnalysisResultsProps) {
  const [analysisData, setAnalysisData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/analysis/${glacierId}`)
        const data = await response.json()
        setAnalysisData(data)
      } catch (error) {
        console.error("Failed to fetch analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [glacierId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Failed to load analysis data</p>
      </div>
    )
  }

  const { glacier, analysis } = analysisData

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Analysis Results: {glacier.name}</h2>
        <p className="text-gray-600 mt-1">{glacier.location}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Risk Assessment */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Assessment</h3>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.riskLevel === "healthy"
                  ? "bg-green-100 text-green-800"
                  : analysis.riskLevel === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)}
            </span>
            <span className="text-gray-600">Change Rate: {analysis.changeRate.toFixed(2)}% annually</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Current Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Area</p>
              <p className="text-xl font-semibold">{glacier.area} km²</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-xl font-semibold">{glacier.volume} km³</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Elevation</p>
              <p className="text-xl font-semibold">{glacier.elevation} m</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-xl font-semibold">{glacier.temperature}°C</p>
            </div>
          </div>
        </div>

        {/* Predictions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Predictions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Next Year Area</span>
              <span className="font-medium">
                {analysis.predictions.nextYear.area.toFixed(1)} km²
                <span className="text-sm text-gray-500 ml-2">
                  ({analysis.predictions.nextYear.confidence}% confidence)
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">5-Year Area</span>
              <span className="font-medium">
                {analysis.predictions.fiveYear.area.toFixed(1)} km²
                <span className="text-sm text-gray-500 ml-2">
                  ({analysis.predictions.fiveYear.confidence}% confidence)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
