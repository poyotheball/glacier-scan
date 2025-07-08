"use client"

import { useRef } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface GlacierHealth {
  name: string
  healthScore: number
  status: "critical" | "warning" | "moderate" | "stable"
}

interface HealthScoreChartProps {
  glaciers: GlacierHealth[]
  height?: number
}

export default function HealthScoreChart({ glaciers, height = 300 }: HealthScoreChartProps) {
  const chartRef = useRef<ChartJS<"bar">>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "rgba(239, 68, 68, 0.8)" // red-500
      case "warning":
        return "rgba(245, 158, 11, 0.8)" // amber-500
      case "moderate":
        return "rgba(59, 130, 246, 0.8)" // blue-500
      case "stable":
        return "rgba(16, 185, 129, 0.8)" // emerald-500
      default:
        return "rgba(107, 114, 128, 0.8)" // gray-500
    }
  }

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "critical":
        return "rgb(239, 68, 68)" // red-500
      case "warning":
        return "rgb(245, 158, 11)" // amber-500
      case "moderate":
        return "rgb(59, 130, 246)" // blue-500
      case "stable":
        return "rgb(16, 185, 129)" // emerald-500
      default:
        return "rgb(107, 114, 128)" // gray-500
    }
  }

  // Sort glaciers by health score (lowest first to show most critical)
  const sortedGlaciers = [...glaciers].sort((a, b) => a.healthScore - b.healthScore)

  const data = {
    labels: sortedGlaciers.map((g) => g.name),
    datasets: [
      {
        label: "Health Score",
        data: sortedGlaciers.map((g) => g.healthScore),
        backgroundColor: sortedGlaciers.map((g) => getStatusColor(g.status)),
        borderColor: sortedGlaciers.map((g) => getStatusBorderColor(g.status)),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Glacier Health Score Comparison",
        font: {
          size: 16,
          weight: "600",
        },
        color: "#111827",
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const glacier = sortedGlaciers[context.dataIndex]
            return [
              `Health Score: ${glacier.healthScore.toFixed(1)}/10`,
              `Status: ${glacier.status.charAt(0).toUpperCase() + glacier.status.slice(1)}`,
            ]
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Glaciers",
          font: {
            size: 14,
            weight: "500",
          },
          color: "#374151",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: "Health Score (0-10)",
          font: {
            size: 14,
            weight: "500",
          },
          color: "#374151",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.3)",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  )
}
