"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, FileImage, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const resetUpload = () => {
    setFiles([])
    setUploadProgress(0)
    setUploadComplete(false)
    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-xl font-bold text-gray-900">Glacier Scan</div>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            Help
          </Link>
          <Button variant="outline" size="sm">
            Demo
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Upload</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Upload Your Satellite Images</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your glacier satellite images and let our advanced AI technology analyze changes over time. Supported
            formats: JPG, PNG, TIFF, GeoTIFF
          </p>
        </div>

        {!uploadComplete ? (
          <div className="space-y-8">
            {/* Upload Area */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="p-8">
                <div
                  className={`text-center ${dragActive ? "bg-blue-50" : ""} rounded-lg p-8 transition-colors`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag and drop your images here</h3>
                  <p className="text-gray-600 mb-4">or</p>

                  <Button
                    variant="outline"
                    className="cursor-pointer bg-transparent"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />

                  <p className="text-sm text-gray-500 mt-4">
                    Maximum file size: 50MB per image. Multiple images supported.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    Selected Images ({files.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileImage className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Progress */}
            {uploading && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Uploading and analyzing images...</span>
                  </div>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? "Processing..." : "Start Analysis"}
              </Button>
              <Button size="lg" variant="outline" onClick={resetUpload} disabled={uploading}>
                Clear All
              </Button>
            </div>
          </div>
        ) : (
          /* Success State */
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your glacier images have been successfully analyzed. View your results below.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={resetUpload}>
                  Upload More Images
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <AlertCircle className="w-5 h-5" />
              Tips for Best Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-blue-800">
              <li>• Use high-resolution satellite images for more accurate analysis</li>
              <li>• Include images from different time periods to track changes</li>
              <li>• Ensure images cover the same geographical area</li>
              <li>• GeoTIFF format provides the most detailed analysis</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
