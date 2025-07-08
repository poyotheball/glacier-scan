"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mountain, TrendingDown, AlertTriangle, Database } from "lucide-react"
import Link from "next/link"
import AlertsPanel from "@/components/dashboard/AlertsPanel"
import AnalysisResults from "@/components/dashboard/AnalysisResults"
import MetricsCard from "@/components/dashboard/MetricsCard"

interface DashboardStats {
  totalGlaciers: number
  activeAlerts: number
  completedAnalyses: number
  avgMeltRate: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGlaciers: 0,
    activeAlerts: 0,
    completedAnalyses: 0,
    avgMeltRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [glaciersResponse, alertsResponse] = await Promise.all([fetch("/api/glaciers"), fetch("/api/alerts")])

      if (glaciersResponse.ok && alertsResponse.ok) {
        const glaciers = await glaciersResponse.json()
        const alerts = await alertsResponse.json()

        const completedAnalyses = glaciers.reduce(
          (total: number, glacier: any) =>
            total + glacier.glacier_images.filter((img: any) => img.analysis_status === "completed").length,
          0,
        )

        const allMeasurements = glaciers.flatMap((glacier: any) => glacier.measurements)
        const avgMeltRate =
          allMeasurements.length > 0
            ? allMeasurements.reduce((sum: number, m: any) => sum + Number.parseFloat(m.melt_rate), 0) /
              allMeasurements.length
            : 0

        setStats({
          totalGlaciers: glaciers.length,
          activeAlerts: alerts.length,
          completedAnalyses,
          avgMeltRate: Math.round(avgMeltRate * 100) / 100,
        })
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Glacier Analysis Dashboard</h1>
          <p className="text-gray-600">Monitor glacier health and track environmental changes</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Glaciers"
            value={stats.totalGlaciers.toString()}
            icon={<Mountain className="h-6 w-6" />}
            loading={loading}
          />
          <MetricsCard
            title="Active Alerts"
            value={stats.activeAlerts.toString()}
            icon={<AlertTriangle className="h-6 w-6" />}
            loading={loading}
            trend={stats.activeAlerts > 0 ? "up" : "stable"}
          />
          <MetricsCard
            title="Completed Analyses"
            value={stats.completedAnalyses.toString()}
            icon={<Database className="h-6 w-6" />}
            loading={loading}
          />
          <MetricsCard
            title="Avg Melt Rate"
            value={`${stats.avgMeltRate} m/yr`}
            icon={<TrendingDown className="h-6 w-6" />}
            loading={loading}
            trend="up"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/upload">
                <Button>Upload New Images</Button>
              </Link>
              <Link href="/map">
                <Button variant="outline">View Glacier Map</Button>
              </Link>
              <Link href="/trends">
                <Button variant="outline">View Trends</Button>
              </Link>
              <Button variant="outline" onClick={fetchDashboardData}>
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <AlertsPanel />
          </div>
          <div className="space-y-8">
            <AnalysisResults />
          </div>
        </div>
      </div>
    </div>
  )
}
