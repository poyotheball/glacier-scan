"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "next-i18next"
import { put } from "@vercel/blob"
import { useAuth } from "@/components/auth/AuthProvider"
import { supabase } from "@/lib/supabase"
import ProgressBar from "./ProgressBar"
import type { UploadProgress } from "@/types"

export default function UploadForm() {
  const { t } = useTranslation("common")
  const { user } = useAuth()
  const [files, setFiles] = useState<FileList | null>(null)
  const [progress, setProgress] = useState<UploadProgress>({ progress: 0, status: "uploading" })
  const [selectedGlacierId, setSelectedGlacierId] = useState<string>("")
  const [glaciers, setGlaciers] = useState<any[]>([])

  // Load glaciers on component mount
  useState(() => {
    loadGlaciers()
  })

  const loadGlaciers = async () => {
    const { data, error } = await supabase.from("glaciers").select("id, name, region, country").order("name")

    if (data && !error) {
      setGlaciers(data)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const handleUpload = async () => {
    if (!files || !user) return

    setProgress({ progress: 0, status: "uploading" })

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Upload to Vercel Blob
        const blob = await put(`glacier-images/${Date.now()}-${file.name}`, file, {
          access: "public",
        })

        // Save to Supabase
        const { error } = await supabase.from("glacier_images").insert({
          glacier_id: selectedGlacierId || null,
          image_url: blob.url,
          upload_date: new Date().toISOString(),
          analysis_status: "pending",
        })

        if (error) throw error

        // Update progress
        const progressPercent = ((index + 1) / files.length) * 80 // 80% for upload
        setProgress({ progress: progressPercent, status: "uploading" })

        return blob.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Trigger AI analysis
      setProgress({ progress: 90, status: "processing" })

      for (const url of uploadedUrls) {
        await fetch("/api/analyze-glacier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: url,
            glacierId: selectedGlacierId,
          }),
        })
      }

      setProgress({ progress: 100, status: "complete" })
    } catch (error) {
      console.error("Upload failed:", error)
      setProgress({ progress: 0, status: "error" })
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-4">Please sign in to upload glacier images.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{t("buttons.upload")} Glacier Images</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="glacier-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Glacier (Optional)
          </label>
          <select
            id="glacier-select"
            value={selectedGlacierId}
            onChange={(e) => setSelectedGlacierId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Unknown Glacier - Let AI Identify</option>
            {glaciers.map((glacier) => (
              <option key={glacier.id} value={glacier.id}>
                {glacier.name} ({glacier.region}, {glacier.country})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Select Images
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*,.tiff,.tif"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: JPG, PNG, TIFF, GeoTIFF. Max 10 files, 50MB each.
          </p>
        </div>

        {files && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Selected Files ({files.length})</h3>
            <div className="space-y-1">
              {Array.from(files).map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!files || progress.status === "uploading" || progress.status === "processing"}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {progress.status === "uploading"
            ? "Uploading..."
            : progress.status === "processing"
              ? "Analyzing..."
              : "Upload & Analyze"}
        </button>

        {progress.progress > 0 && (
          <div className="mt-4">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>
    </div>
  )
}
