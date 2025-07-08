"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Thermometer } from "lucide-react"

interface Alert {
  id: string
  glacier_id: string
  glacier_name: string
  alert_type: string
  alert_message: string
  created_at: string
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/alerts")
      if (response.ok) {
        const data = await response.json()
        setAlerts(data)
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "RAPID_MELT":
        return <Thermometer className="h-4 w-4" />
      case "VOLUME_LOSS":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "RAPID_MELT":
        return "destructive"
      case "VOLUME_LOSS":
        return "secondary"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No alerts at this time</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.alert_type)}
                    <span className="font-medium">{alert.glacier_name}</span>
                  </div>
                  <Badge variant={getAlertColor(alert.alert_type) as any}>{alert.alert_type.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm text-gray-600">{alert.alert_message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(alert.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
