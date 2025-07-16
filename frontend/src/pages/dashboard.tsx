"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle, Clock, TrendingDown, TrendingUp, Activity } from "lucide-react"

interface Glacier {
  id: string
  name: string
  location: string
  status: "healthy" | "warning" | "critical"
  lastAnalyzed: string
  healthScore: number
  trend: "stable" | "declining" | "improving"
  area: number
  volume: number
}

export default function Dashboard() {
  const [glaciers, setGlaciers] = useState<Glacier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for development
    const mockData: Glacier[] = [
      {
        id: "mock-1",
        name: "Franz Josef Glacier",
        location: "New Zealand",
        status: "healthy",
        lastAnalyzed: "2024-01-15T10:30:00Z",
        healthScore: 85,
        trend: "stable",
        area: 32.5,
        volume: 4.2,
      },
      {
        id: "mock-2",
        name: "Perito Moreno Glacier",
        location: "Argentina",
        status: "warning",
        lastAnalyzed: "2024-01-14T14:20:00Z",
        healthScore: 72,
        trend: "declining",
        area: 250.0,
        volume: 28.5,
      },
      {
        id: "mock-3",
        name: "Athabasca Glacier",
        location: "Canada",
        status: "critical",
        lastAnalyzed: "2024-01-13T09:15:00Z",
        healthScore: 45,
        trend: "declining",
        area: 6.0,
        volume: 0.8,
      },
    ]

    setTimeout(() => {
      setGlaciers(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Glacier Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glacier-card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Glacier Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-glacier-600">Total Glaciers</p>
              <p className="text-2xl font-bold text-gray-900">{glaciers.length}</p>
            </div>
            <Activity className="h-8 w-8 text-glacier-500" />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Healthy</p>
              <p className="text-2xl font-bold text-gray-900">
                {glaciers.filter((g) => g.status === "healthy").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Warning</p>
              <p className="text-2xl font-bold text-gray-900">
                {glaciers.filter((g) => g.status === "warning").length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {glaciers.filter((g) => g.status === "critical").length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Glacier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {glaciers.map((glacier) => (
          <div key={glacier.id} className="glacier-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{glacier.name}</h3>
                <p className="text-sm text-gray-600">{glacier.location}</p>
              </div>
              {getStatusIcon(glacier.status)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Score</span>
                <span className="text-sm font-medium">{glacier.healthScore}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    glacier.healthScore >= 80
                      ? "bg-green-500"
                      : glacier.healthScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${glacier.healthScore}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trend</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(glacier.trend)}
                  <span className="text-sm font-medium capitalize">{glacier.trend}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Area</span>
                <span className="text-sm font-medium">{glacier.area} km²</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Volume</span>
                <span className="text-sm font-medium">{glacier.volume} km³</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(glacier.status)}`}
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
              <p className="text-xs text-gray-500 mt-2">
                Last analyzed: {new Date(glacier.lastAnalyzed).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
