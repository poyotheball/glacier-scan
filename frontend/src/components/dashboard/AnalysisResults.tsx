import Link from "next/link"
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"

interface AnalysisResult {
  id: string
  glacierName: string
  location: string
  status: "stable" | "retreating" | "advancing" | "critical"
  healthScore: number
  lastUpdated: string
  changePercent: number
}

const mockResults: AnalysisResult[] = [
  {
    id: "mock-1",
    glacierName: "Franz Josef Glacier",
    location: "New Zealand",
    status: "retreating",
    healthScore: 65,
    lastUpdated: "2024-01-15",
    changePercent: -12.3,
  },
  {
    id: "mock-2",
    glacierName: "Perito Moreno Glacier",
    location: "Argentina",
    status: "stable",
    healthScore: 82,
    lastUpdated: "2024-01-14",
    changePercent: 0.5,
  },
  {
    id: "mock-3",
    glacierName: "Athabasca Glacier",
    location: "Canada",
    status: "critical",
    healthScore: 34,
    lastUpdated: "2024-01-13",
    changePercent: -18.7,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "stable":
      return "text-green-600 bg-green-100"
    case "retreating":
      return "text-yellow-600 bg-yellow-100"
    case "advancing":
      return "text-blue-600 bg-blue-100"
    case "critical":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "stable":
      return <Minus className="h-4 w-4" />
    case "retreating":
      return <TrendingDown className="h-4 w-4" />
    case "advancing":
      return <TrendingUp className="h-4 w-4" />
    case "critical":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Minus className="h-4 w-4" />
  }
}

export default function AnalysisResults() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Analysis Results</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {mockResults.map((result) => (
          <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">{result.glacierName}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}
                  >
                    {getStatusIcon(result.status)}
                    <span className="ml-1 capitalize">{result.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{result.location}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">Health Score:</span>
                    <span
                      className={`text-sm font-medium ${
                        result.healthScore >= 70
                          ? "text-green-600"
                          : result.healthScore >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {result.healthScore}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">Change:</span>
                    <span
                      className={`text-sm font-medium ${result.changePercent > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {result.changePercent > 0 ? "+" : ""}
                      {result.changePercent}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">Updated:</span>
                    <span className="text-sm text-gray-900">{result.lastUpdated}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  href={`/analysis/${result.id}`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Analysis
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
