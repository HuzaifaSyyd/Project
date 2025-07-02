"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Video } from "lucide-react"

interface ImageUploadProps {
  onImageUploaded: (imageId: string, dataUrl: string, isVideo?: boolean) => void
  currentImageData?: string
  currentIsVideo?: boolean
  placeholder?: string
  acceptVideo?: boolean
}

export function ImageUpload({
  onImageUploaded,
  currentImageData,
  currentIsVideo = false,
  placeholder = "Upload image or video",
  acceptVideo = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(currentImageData || "")
  const [isVideo, setIsVideo] = useState<boolean>(currentIsVideo)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    const fileIsVideo = file.type.startsWith("video/")

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setIsVideo(fileIsVideo)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onImageUploaded(data.imageId, data.dataUrl, data.isVideo)
        setPreview(data.dataUrl)
        setIsVideo(data.isVideo || false)
      } else {
        alert(data.error || "Upload failed")
        setPreview(currentImageData || "")
        setIsVideo(currentIsVideo)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed")
      setPreview(currentImageData || "")
      setIsVideo(currentIsVideo)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const clearImage = () => {
    setPreview("")
    setIsVideo(false)
    onImageUploaded("", "", false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const acceptTypes = acceptVideo
    ? "image/*,video/mp4,video/webm,video/ogg,video/avi,video/mov,video/quicktime"
    : "image/*"

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {isVideo ? (
              <video src={preview} className="w-full h-full object-cover" controls muted playsInline />
            ) : (
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            )}
          </div>
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <div className="text-white font-medium">Uploading...</div>
            </div>
          )}
          {/* File type indicator */}
          <div className="absolute top-2 left-2 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
            {isVideo ? (
              <div className="flex items-center gap-1">
                <Video className="h-3 w-3" />
                Video
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Image
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? "border-gray-400 bg-gray-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            {acceptVideo && <Video className="h-8 w-8 text-gray-400" />}
          </div>
          <div className="text-gray-600 mb-4">
            <p className="font-medium">Drop your {acceptVideo ? "image or video" : "image"} here, or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">
              {acceptVideo
                ? "Images: PNG, JPG, GIF, WebP up to 5MB • Videos: MP4, WebM, MOV up to 50MB"
                : "PNG, JPG, GIF, WebP up to 5MB"}
            </p>
            {acceptVideo && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                📐 Recommended: 16:9 aspect ratio (1920x1080, 1280x720)
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-900 hover:bg-gray-800 rounded-xl"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Choose File"}
          </Button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" />
    </div>
  )
}
