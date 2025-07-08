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

interface MultiMetricChartProps {
  measurements: Measurement[]
  glacierName: string
  height?: number
}

export default function MultiMetricChart({ measurements, glacierName, height = 400 }: MultiMetricChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null)

  // Sort measurements by date
  const sortedMeasurements = [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Normalize data to percentages (relative to first measurement)
  const normalizeData = (values: number[]) => {
    const baseline = values[0]
    return values.map((value) => ((value - baseline) / baseline) * 100)
  }

  const iceVolumeData = sortedMeasurements.map((m) => m.ice_volume)
  const surfaceAreaData = sortedMeasurements.map((m) => m.surface_area)
  const meltRateData = sortedMeasurements.map((m) => m.melt_rate)

  const data = {
    labels: sortedMeasurements.map((m) => new Date(m.date)),
    datasets: [
      {
        label: "Ice Volume Change (%)",
        data: normalizeData(iceVolumeData),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Surface Area Change (%)",
        data: normalizeData(surfaceAreaData),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: "Melt Rate Change (%)",
        data: normalizeData(meltRateData),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        fill: false,
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
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: `${glacierName} - Multi-Metric Trend Analysis`,
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
            return `${context.dataset.label}: ${value.toFixed(2)}%`
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
          text: "Percentage Change from Baseline (%)",
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
          callback: (value) => `${value}%`,
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
