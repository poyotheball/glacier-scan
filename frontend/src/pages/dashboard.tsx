"use client"

import type { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useAuth } from "@/components/auth/AuthProvider"
import MetricsCard from "@/components/dashboard/MetricsCard"
import AnalysisResults from "@/components/dashboard/AnalysisResults"
import AlertsPanel from "@/components/dashboard/AlertsPanel"

export default function DashboardPage() {
  const { t } = useTranslation("common")
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please sign in to view the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Glacier Analysis {t("navigation.dashboard")}</h1>
        <p className="text-gray-600">Monitor glacier changes and analysis results in real-time</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard title="Total Glaciers Monitored" value="8" change="+2 this month" trend="up" />
        <MetricsCard title="Analyses Completed" value="6" change="+6 this week" trend="up" />
        <MetricsCard title="Critical Alerts" value="2" change="Urgent attention needed" trend="up" />
        <MetricsCard title="Average Melt Rate" value="2.1 m/yr" change="+15% from last year" trend="up" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Analysis Results - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <AnalysisResults />
        </div>

        {/* Alerts Panel - Takes up 1 column */}
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Global Glacier Status Summary</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Critical Status</div>
            <div className="text-xs text-gray-500">Immediate action required</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-gray-600">Moderate Decline</div>
            <div className="text-xs text-gray-500">Regular monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">1</div>
            <div className="text-sm text-gray-600">Stable</div>
            <div className="text-xs text-gray-500">Minimal changes detected</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
})
