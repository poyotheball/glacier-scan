"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getGlaciers, getGlacierSummary, type GlacierData } from "@/lib/database"

export default function DashboardPage() {
  const [glaciers, setGlaciers] = useState<GlacierData[]>([])
  const [summary, setSummary] = useState({
    total: 0,
    healthy: 0,
    warning: 0,
    critical: 0,
    averageHealthScore: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [glacierData, summaryData] = await Promise.all([getGlaciers(), getGlacierSummary()])
        setGlaciers(glacierData)
        setSummary(summaryData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "healthy":
        return "status-healthy"
      case "warning":
        return "status-warning"
      case "critical":
        return "status-critical"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-glacier-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading glacier data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Glacier Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring and analysis of glacier health worldwide</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glacier-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Glaciers</p>
                <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <div className="p-3 bg-glacier-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-glacier-600" />
              </div>
            </div>
          </div>

          <div className="glacier-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Healthy</p>
                <p className="text-3xl font-bold text-green-600">{summary.healthy}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glacier-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warning</p>
                <p className="text-3xl font-bold text-yellow-600">{summary.warning}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="glacier-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-3xl font-bold text-red-600">{summary.critical}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Glacier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {glaciers.map((glacier) => (
            <div key={glacier.id} className="glacier-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{glacier.name}</h3>
                  <p className="text-sm text-gray-600">
                    {glacier.region}, {glacier.country}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(glacier.status)}
                  {getTrendIcon(glacier.trend)}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Health Score</span>
                  <span className="text-sm font-medium text-gray-900">{glacier.healthScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      glacier.healthScore >= 70
                        ? "bg-green-500"
                        : glacier.healthScore >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${glacier.healthScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Area:</span>
                  <span className="ml-1 font-medium">{glacier.area} km²</span>
                </div>
                <div>
                  <span className="text-gray-600">Thickness:</span>
                  <span className="ml-1 font-medium">{glacier.thickness}m</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(glacier.status)}`}
                >
                  {glacier.status.charAt(0).toUpperCase() + glacier.status.slice(1)}
                </span>
                <Link
                  href={`/analysis/${glacier.id}`}
                  className="text-glacier-600 hover:text-glacier-700 text-sm font-medium"
                >
                  View Analysis →
                </Link>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(glacier.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
