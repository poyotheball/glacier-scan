"use client"

import { useState } from "react"
import type { GetStaticProps } from "next"
import { useQuery } from "@apollo/client"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import MapComponent from "@/components/map/MapComponent"
import { GET_GLACIERS } from "@/graphql/queries"
import type { Glacier } from "@/types"

export default function MapPage() {
  const { t } = useTranslation("common")
  const [selectedGlacier, setSelectedGlacier] = useState<Glacier | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { loading, error, data } = useQuery(GET_GLACIERS)

  const filteredGlaciers =
    data?.glaciers?.filter(
      (glacier: Glacier) =>
        glacier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        glacier.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        glacier.country.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading glaciers...</div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">Error loading glaciers: {error.message}</div>
        </div>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Glacier {t("navigation.map")}</h1>

      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search glaciers by name, region, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredGlaciers.length} glacier{filteredGlaciers.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapComponent glaciers={filteredGlaciers} onGlacierClick={setSelectedGlacier} />
          <div className="mt-4 text-sm text-gray-500">Map data © OpenStreetMap contributors</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Glacier Details</h2>
          {selectedGlacier ? (
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">{selectedGlacier.name}</h3>
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
              <div className="pt-3 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  View Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">Click on a glacier marker to view details</p>
            </div>
          )}
        </div>
      </div>

      {filteredGlaciers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">All Glaciers ({filteredGlaciers.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlaciers.map((glacier) => (
              <div
                key={glacier.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedGlacier?.id === glacier.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
})
