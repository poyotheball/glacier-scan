"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ImageIcon, AlertCircle, CheckCircle } from "lucide-react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const imageFiles = droppedFiles.filter((file) => file.type.startsWith("image/"))
    setFiles((prev) => [...prev, ...imageFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadStatus("idle")

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setUploadStatus("success")
      setFiles([])
    } catch (error) {
      setUploadStatus("error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Glacier Images</h1>
          <p className="text-gray-600">
            Upload satellite or aerial images of glaciers for AI-powered analysis and monitoring
          </p>
        </div>

        {/* Upload Area */}
        <div className="glacier-card p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-glacier-400 bg-glacier-50" : "border-gray-300 hover:border-glacier-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Drop your images here, or click to browse</h3>
            <p className="text-gray-600 mb-4">Supports JPG, PNG, TIFF formats up to 50MB each</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Images
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="glacier-card p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload & Analyze
                </>
              )}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus === "success" && (
          <div className="glacier-card p-4 mb-8 bg-green-50 border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">
                Images uploaded successfully! Analysis results will be available in the dashboard.
              </p>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="glacier-card p-4 mb-8 bg-red-50 border-red-200">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">
                Upload failed. Please try again or contact support if the problem persists.
              </p>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="glacier-card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Image Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• High resolution (minimum 1024x1024 pixels)</li>
                <li>• Clear visibility of glacier features</li>
                <li>• Minimal cloud cover</li>
                <li>• Recent imagery preferred</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Include GPS coordinates if available</li>
                <li>• Upload multiple angles when possible</li>
                <li>• Provide date and time information</li>
                <li>• Include reference objects for scale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
