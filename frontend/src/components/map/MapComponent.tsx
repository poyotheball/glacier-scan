"use client"

import { useEffect, useRef } from "react"
import maplibregl, { MAP_STYLE } from "@/lib/maplibre"
import type { Glacier } from "@/types"

interface MapComponentProps {
  glaciers: Glacier[]
  onGlacierClick?: (glacier: Glacier) => void
}

const MapComponent = ({ glaciers, onGlacierClick }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    if (map.current) return

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: [-103.5917, 40.6699],
        zoom: 3,
      })

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), "top-right")
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    // Add markers for glaciers
    glaciers.forEach((glacier) => {
      const markerElement = document.createElement("div")
      markerElement.className = "glacier-marker"
      markerElement.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `

      const marker = new maplibregl.Marker(markerElement)
        .setLngLat([glacier.location.longitude, glacier.location.latitude])
        .addTo(map.current!)

      // Create popup
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${glacier.name}</h3>
            <p class="text-sm text-gray-600">${glacier.region}, ${glacier.country}</p>
            <p class="text-xs text-gray-500 mt-1">
              ${glacier.location.latitude.toFixed(4)}, ${glacier.location.longitude.toFixed(4)}
            </p>
          </div>
        `)

      markerElement.addEventListener("click", () => {
        popup.setLngLat([glacier.location.longitude, glacier.location.latitude]).addTo(map.current!)
        onGlacierClick?.(glacier)
      })

      markers.current.push(marker)
    })
  }, [glaciers, onGlacierClick])

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full h-96 rounded-lg overflow-hidden" />
      <style jsx global>{`
        .maplibregl-popup-content {
          padding: 0;
          border-radius: 8px;
        }
        .maplibregl-popup-tip {
          border-top-color: white;
        }
      `}</style>
    </div>
  )
}

export default MapComponent
