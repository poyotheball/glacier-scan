"use client"

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { getGlaciers, type GlacierData } from "@/lib/database"

export default function MapPage() {
  const [glaciers, setGlaciers] = useState<GlacierData[]>([])
  const [selectedGlacier, setSelectedGlacier] = useState<GlacierData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGlaciers() {
      try {
        const data = await getGlaciers()
        setGlaciers(data)
      } catch (error) {
        console.error("Error loading glaciers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadGlaciers()
  }, [])

  const filteredGlaciers = glaciers.filter(
    (glacier) =>
      glacier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      glacier.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      glacier.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 border-glacier-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading glacier map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Glacier Map</h1>
          <p className="text-gray-600">Explore glaciers worldwide and view their current status</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search glaciers by name, region, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-glacier-500 focus:border-glacier-500"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Found {filteredGlaciers.length} glacier{filteredGlaciers.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="glacier-card p-8 h-96 flex items-center justify-center bg-gradient-to-br from-glacier-50 to-glacier-100">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-glacier-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
                <p className="text-gray-600">
                  Map integration coming soon. Click on glaciers in the list to view details.
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">Map data © OpenStreetMap contributors</div>
          </div>

          {/* Glacier Details */}
          <div className="glacier-card p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Glacier Details</h2>
            {selectedGlacier ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-glacier-600">{selectedGlacier.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Region:</span>
                    <p className="text-gray-600">{selectedGlacier.region}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Country:</span>
                    <p className="text-gray-600">{selectedGlacier.country}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Coordinates:</span>
                  <p className="text-gray-600 font-mono">
                    {selectedGlacier.location.latitude.toFixed(4)}°N,{" "}
                    {Math.abs(selectedGlacier.location.longitude).toFixed(4)}°
                    {selectedGlacier.location.longitude >= 0 ? "E" : "W"}
                  </p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Health Score:</span>
                  <p className="text-gray-600">{selectedGlacier.healthScore}/100</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <button className="w-full btn-primary">View Analysis</button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Click on a glacier to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Glacier List */}
        {filteredGlaciers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">All Glaciers ({filteredGlaciers.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlaciers.map((glacier) => (
                <div
                  key={glacier.id}
                  className={`glacier-card p-4 cursor-pointer transition-colors ${
                    selectedGlacier?.id === glacier.id
                      ? "border-glacier-500 bg-glacier-50"
                      : "hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedGlacier(glacier)}
                >
                  <h3 className="font-semibold text-gray-900">{glacier.name}</h3>
                  <p className="text-sm text-gray-600">
                    {glacier.region}, {glacier.country}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    {glacier.location.latitude.toFixed(4)}°, {glacier.location.longitude.toFixed(4)}°
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        glacier.status === "healthy"
                          ? "bg-green-100 text-green-800"
                          : glacier.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {glacier.status.charAt(0).toUpperCase() + glacier.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
