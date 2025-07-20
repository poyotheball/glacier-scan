"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Activity, TrendingUp, TrendingDown, Minus, Eye } from "lucide-react"
import { getGlaciers, type Glacier } from "../lib/database"

export default function Dashboard() {
  const [glaciers, setGlaciers] = useState<Glacier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGlaciers() {
      try {
        const data = await getGlaciers()
        setGlaciers(data)
      } catch (error) {
        console.error("Error fetching glaciers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGlaciers()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const healthyCount = glaciers.filter((g) => g.status === "healthy").length
  const warningCount = glaciers.filter((g) => g.status === "warning").length
  const criticalCount = glaciers.filter((g) => g.status === "critical").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-glacier-600 animate-spin mx-auto mb-4" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Glacier Dashboard</h1>
          <p className="text-gray-600">Monitor glacier health and track changes in real-time</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-glacier-100 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-glacier-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Glaciers</p>
                <p className="text-2xl font-semibold text-gray-900">{glaciers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Healthy</p>
                <p className="text-2xl font-semibold text-green-600">{healthyCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Activity className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Warning</p>
                <p className="text-2xl font-semibold text-yellow-600">{warningCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critical</p>
                <p className="text-2xl font-semibold text-red-600">{criticalCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Glacier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {glaciers.map((glacier) => (
            <div key={glacier.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{glacier.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(glacier.status)}`}
                  >
                    {glacier.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{glacier.location}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Health Score</span>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900">{glacier.healthScore}%</span>
                      {getTrendIcon(glacier.trend)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Area</span>
                    <span className="text-sm font-medium text-gray-900">{glacier.area} km²</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Thickness</span>
                    <span className="text-sm font-medium text-gray-900">{glacier.thickness}m</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Velocity</span>
                    <span className="text-sm font-medium text-gray-900">{glacier.velocity} m/day</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    href={`/analysis/${glacier.id}`}
                    className="flex-1 bg-glacier-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-glacier-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Analysis
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(glacier.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
