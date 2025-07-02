"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FolderOpen, X, ImageIcon, Video } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { ImageGalleryModal } from "@/components/image-gallery-modal"

interface ImageSelectorProps {
  onImageSelected: (imageId: string, dataUrl: string, isVideo?: boolean) => void
  currentImageData?: string
  currentImageId?: string
  currentIsVideo?: boolean
  placeholder?: string
  acceptVideo?: boolean
}

export function ImageSelector({
  onImageSelected,
  currentImageData,
  currentImageId,
  currentIsVideo = false,
  placeholder = "Select or upload image",
  acceptVideo = false,
}: ImageSelectorProps) {
  const [showGallery, setShowGallery] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [preview, setPreview] = useState<string>(currentImageData || "")
  const [isVideo, setIsVideo] = useState<boolean>(currentIsVideo)

  const handleImageFromGallery = (imageId: string, dataUrl: string, isVideoFile?: boolean) => {
    setPreview(dataUrl)
    setIsVideo(isVideoFile || false)
    onImageSelected(imageId, dataUrl, isVideoFile)
    setShowGallery(false)
  }

  const handleImageFromUpload = (imageId: string, dataUrl: string, isVideoFile?: boolean) => {
    setPreview(dataUrl)
    setIsVideo(isVideoFile || false)
    onImageSelected(imageId, dataUrl, isVideoFile)
    setShowUpload(false)
  }

  const clearImage = () => {
    setPreview("")
    setIsVideo(false)
    onImageSelected("", "", false)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            {isVideo ? (
              <video src={preview} className="w-full h-full object-cover" controls muted playsInline />
            ) : (
              <img src={preview || "/placeholder.svg"} alt="Selected media" className="w-full h-full object-cover" />
            )}
          </div>
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
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
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            {acceptVideo && <Video className="h-8 w-8 text-gray-400" />}
          </div>
          <div className="text-gray-600 mb-6">
            <p className="font-medium">{placeholder}</p>
            <p className="text-sm text-gray-500 mt-1">
              Choose from gallery or upload new {acceptVideo ? "image/video" : "image"}
            </p>
            {acceptVideo && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                📐 Recommended: 16:9 aspect ratio (1920x1080, 1280x720)
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              type="button"
              onClick={() => setShowGallery(true)}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              From Gallery
            </Button>
            <Button
              type="button"
              onClick={() => setShowUpload(true)}
              className="bg-gray-900 hover:bg-gray-800 rounded-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload New {acceptVideo ? "Image/Video" : "Image"}</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <ImageUpload
              onImageUploaded={handleImageFromUpload}
              placeholder={`Upload new ${acceptVideo ? "image or video" : "image"}`}
              acceptVideo={acceptVideo}
            />
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      <ImageGalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onSelectImage={handleImageFromGallery}
        currentImageId={currentImageId}
        acceptVideo={acceptVideo}
      />
    </div>
  )
}
