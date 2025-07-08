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

interface GlacierData {
  name: string
  measurements: Measurement[]
  color: string
}

interface ComparisonChartProps {
  glaciers: GlacierData[]
  metric: "ice_volume" | "surface_area" | "melt_rate"
  height?: number
}

export default function ComparisonChart({ glaciers, metric, height = 400 }: ComparisonChartProps) {
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

  // Create datasets for each glacier
  const datasets = glaciers.map((glacier, index) => {
    const sortedMeasurements = [...glacier.measurements].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return {
      label: glacier.name,
      data: sortedMeasurements.map((m) => ({
        x: new Date(m.date),
        y: m[metric],
      })),
      borderColor: glacier.color,
      backgroundColor: glacier.color + "20",
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: glacier.color,
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      fill: false,
      tension: 0.4,
    }
  })

  const data = {
    datasets,
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
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: `Glacier Comparison - ${getMetricLabel(metric)}`,
        font: {
          size: 18,
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
            return `${context.dataset.label}: ${value.toFixed(2)}${unit}`
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
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}
