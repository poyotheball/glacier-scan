"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Alert {
  id: string
  glacier_id: string
  alert_type: string
  alert_message: string
  created_at: string
  glacier?: {
    name: string
    region: string
    country: string
  }
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select(
          `
          *,
          glacier:glaciers(name, region, country)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error("Error loading alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "CRITICAL_RETREAT":
        return "🚨"
      case "RAPID_MELT":
        return "⚠️"
      case "VOLUME_LOSS":
        return "📉"
      case "SURFACE_CHANGE":
        return "📊"
      case "STABILITY":
        return "✅"
      default:
        return "ℹ️"
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "CRITICAL_RETREAT":
        return "bg-red-50 border-red-200 text-red-800"
      case "RAPID_MELT":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "VOLUME_LOSS":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "SURFACE_CHANGE":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "STABILITY":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <div className="text-center text-gray-500">Loading alerts...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
        <span className="text-sm text-gray-500">{alerts.length} active alerts</span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.alert_type)}`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getAlertIcon(alert.alert_type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">
                    {alert.glacier?.name || "Unknown Glacier"}{" "}
                    <span className="text-sm font-normal">
                      ({alert.glacier?.region}, {alert.glacier?.country})
                    </span>
                  </h3>
                  <span className="text-xs opacity-75">{new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm">{alert.alert_message}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-white bg-opacity-50 rounded">
                    {alert.alert_type.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <p>No alerts at this time</p>
          <p className="text-sm">All glaciers are within normal parameters</p>
        </div>
      )}
    </div>
  )
}
