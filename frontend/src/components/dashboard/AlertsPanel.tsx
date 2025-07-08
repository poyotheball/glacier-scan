"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"

interface Alert {
  id: string
  glacier_id: string
  alert_type: "critical" | "warning" | "info"
  message: string
  severity: number
  is_active: boolean
  created_at: string
  glacier_name?: string
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const response = await fetch("/api/alerts")
      const data = await response.json()

      if (response.ok) {
        setAlerts(data.alerts || [])
      } else {
        console.error("Failed to load alerts:", data.error)
      }
    } catch (error) {
      console.error("Error loading alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      const response = await fetch("/api/alerts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: alertId,
          is_active: false,
        }),
      })

      if (response.ok) {
        setAlerts(alerts.filter((alert) => alert.id !== alertId))
      } else {
        console.error("Failed to dismiss alert")
      }
    } catch (error) {
      console.error("Error dismissing alert:", error)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "default"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts
          </div>
          <Badge variant="outline">{alerts.length} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No active alerts</p>
            <p className="text-sm text-gray-500">All glaciers are within normal parameters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.alert_type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.alert_type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getBadgeVariant(alert.alert_type)} className="text-xs">
                          {alert.alert_type.toUpperCase()}
                        </Badge>
                        {alert.glacier_name && <span className="text-sm font-medium">{alert.glacier_name}</span>}
                      </div>
                      <p className="text-sm leading-relaxed mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Severity: {alert.severity}/10</span>
                        <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
