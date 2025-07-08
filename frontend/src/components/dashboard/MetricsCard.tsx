import type React from "react"
interface MetricsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  icon?: React.ReactNode
}

export default function MetricsCard({ title, value, change, trend, icon }: MetricsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-red-600"
      case "down":
        return "text-green-600"
      case "stable":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      case "stable":
        return "→"
      default:
        return "→"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
            <span className="mr-1">{getTrendIcon()}</span>
            <span>{change}</span>
          </div>
        </div>
        {icon && <div className="text-gray-400 ml-4">{icon}</div>}
      </div>
    </div>
  )
}
