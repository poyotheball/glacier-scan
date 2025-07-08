"use client"

import { useRef } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import "chartjs-adapter-date-fns"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale)

interface Measurement {
  date: string
  ice_volume: number
  surface_area: number
  melt_rate: number
}

interface GlacierTrendChartProps {
  measurements: Measurement[]
  glacierName: string
  metric: "ice_volume" | "surface_area" | "melt_rate"
  height?: number
}

export default function GlacierTrendChart({ measurements, glacierName, metric, height = 300 }: GlacierTrendChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null)

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "ice_volume":
        return "Ice Volume (km³)"
      case "surface_area":
        return "Surface Area (km²)"
      case "melt_rate":
        return "Melt Rate (m/year)"
      default:
        return metric
    }
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "ice_volume":
        return {
          border: "rgb(59, 130, 246)", // blue-500
          background: "rgba(59, 130, 246, 0.1)",
        }
      case "surface_area":
        return {
          border: "rgb(16, 185, 129)", // emerald-500
          background: "rgba(16, 185, 129, 0.1)",
        }
      case "melt_rate":
        return {
          border: "rgb(239, 68, 68)", // red-500
          background: "rgba(239, 68, 68, 0.1)",
        }
      default:
        return {
          border: "rgb(107, 114, 128)", // gray-500
          background: "rgba(107, 114, 128, 0.1)",
        }
    }
  }

  // Sort measurements by date
  const sortedMeasurements = [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const data = {
    labels: sortedMeasurements.map((m) => new Date(m.date)),
    datasets: [
      {
        label: getMetricLabel(metric),
        data: sortedMeasurements.map((m) => m[metric]),
        borderColor: getMetricColor(metric).border,
        backgroundColor: getMetricColor(metric).background,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: getMetricColor(metric).border,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            weight: "500",
          },
          color: "#374151",
        },
      },
      title: {
        display: true,
        text: `${glacierName} - ${getMetricLabel(metric)} Trend`,
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
        borderColor: getMetricColor(metric).border,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x)
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          },
          label: (context) => {
            const value = context.parsed.y
            const unit = metric === "melt_rate" ? " m/year" : metric === "ice_volume" ? " km³" : " km²"
            return `${getMetricLabel(metric)}: ${value.toFixed(2)}${unit}`
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "year",
          displayFormats: {
            year: "yyyy",
          },
        },
        title: {
          display: true,
          text: "Year",
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
        },
      },
      y: {
        title: {
          display: true,
          text: getMetricLabel(metric),
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
          callback: (value) => {
            const unit = metric === "melt_rate" ? " m/yr" : metric === "ice_volume" ? " km³" : " km²"
            return `${value}${unit}`
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      point: {
        hoverBackgroundColor: "#ffffff",
      },
    },
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}
