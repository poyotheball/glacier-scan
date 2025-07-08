"use client"

import { useState, useEffect } from "react"
import type { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AlertsPanel from "@/components/dashboard/AlertsPanel"
import AnalysisResults from "@/components/dashboard/AnalysisResults"
import MetricsCard from "@/components/dashboard/MetricsCard"
import { Activity, Database, ImageIcon, Mountain } from "lucide-react"

interface DashboardStats {
  totalGlaciers: number
  totalMeasurements: number
  totalImages: number
  activeAlerts: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGlaciers: 0,
    totalMeasurements: 0,
    totalImages: 0,
    activeAlerts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "testing">("testing")

  useEffect(() => {
    loadDashboardData()
    testDatabaseConnection()
  }, [])

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()

      if (data.success) {
        setConnectionStatus("connected")
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setConnectionStatus("disconnected")
      }
    } catch (error) {
      console.error("Database connection test failed:", error)
      setConnectionStatus("disconnected")
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load glaciers data
      const glaciersResponse = await fetch("/api/glaciers")
      const glaciersData = await glaciersResponse.json()

      if (glaciersResponse.ok && glaciersData.glaciers) {
        const glaciers = glaciersData.glaciers
        const totalMeasurements = glaciers.reduce(
          (sum: number, glacier: any) => sum + (glacier.measurements?.length || 0),
          0,
        )
        const totalImages = glaciers.reduce((sum: number, glacier: any) => sum + (glacier.images?.length || 0), 0)

        setStats((prev) => ({
          ...prev,
          totalGlaciers: glaciers.length,
          totalMeasurements,
          totalImages,
        }))
      }

      // Load alerts data
      const alertsResponse = await fetch("/api/alerts")
      const alertsData = await alertsResponse.json()

      if (alertsResponse.ok && alertsData.alerts) {
        setStats((prev) => ({
          ...prev,
          activeAlerts: alertsData.alerts.length,
        }))
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800">Disconnected</Badge>
      case "testing":
        return <Badge className="bg-yellow-100 text-yellow-800">Testing...</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Glacier Analysis Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor glacier changes and analysis results</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="text-sm text-gray-600">Database:</span>
                {getConnectionBadge()}
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Activity className="w-4 h-4 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Glaciers"
            value={stats.totalGlaciers}
            icon={<Mountain className="w-8 h-8 text-blue-500" />}
            loading={loading}
            description="Monitored glaciers"
          />
          <MetricsCard
            title="Measurements"
            value={stats.totalMeasurements}
            icon={<Activity className="w-8 h-8 text-green-500" />}
            loading={loading}
            description="Data points collected"
          />
          <MetricsCard
            title="Images Analyzed"
            value={stats.totalImages}
            icon={<ImageIcon className="w-8 h-8 text-purple-500" />}
            loading={loading}
            description="Satellite images processed"
          />
          <MetricsCard
            title="Active Alerts"
            value={stats.activeAlerts}
            icon={<Activity className="w-8 h-8 text-red-500" />}
            loading={loading}
            description="Requiring attention"
            trend={stats.activeAlerts > 0 ? "up" : "stable"}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Analysis Results */}
          <div className="lg:col-span-2">
            <AnalysisResults />
          </div>

          {/* Right Column - Alerts */}
          <div>
            <AlertsPanel />
          </div>
        </div>

        {/* System Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Database Connection</h4>
                <div className="flex items-center gap-2">
                  {getConnectionBadge()}
                  <span className="text-sm text-gray-600">
                    {connectionStatus === "connected"
                      ? "PostgreSQL connected successfully"
                      : connectionStatus === "disconnected"
                        ? "Unable to connect to database"
                        : "Testing database connection..."}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Last Updated</h4>
                <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
})
