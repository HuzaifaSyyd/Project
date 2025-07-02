"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Check } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface ImageItem {
  _id: string
  filename: string
  mimetype: string
  size: number
  data: string
  createdAt: string
}

interface ImageGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imageId: string, dataUrl: string) => void
  currentImageId?: string
}

export function ImageGalleryModal({ isOpen, onClose, onSelectImage, currentImageId }: ImageGalleryModalProps) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImageId, setSelectedImageId] = useState<string>(currentImageId || "")
  const [loading, setLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = images.filter((image) => image.filename.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredImages(filtered)
    } else {
      setFilteredImages(images)
    }
  }, [searchQuery, images])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setImages(data)
      setFilteredImages(data)
    } catch (error) {
      console.error("Error fetching images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectImage = () => {
    const selectedImage = images.find((img) => img._id === selectedImageId)
    if (selectedImage) {
      onSelectImage(selectedImage._id, selectedImage.data)
      onClose()
    }
  }

  const handleNewImageUploaded = (imageId: string, dataUrl: string) => {
    setShowUpload(false)
    fetchImages() // Refresh the gallery
    setSelectedImageId(imageId)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-white rounded-3xl">
        <DialogHeader className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">Image Gallery</DialogTitle>
            <div className="flex gap-3">
              <Button onClick={() => setShowUpload(!showUpload)} className="bg-gray-900 hover:bg-gray-800 rounded-xl">
                <Upload className="h-4 w-4 mr-2" />
                Upload New
              </Button>
              <Button
                onClick={handleSelectImage}
                disabled={!selectedImageId}
                className="bg-green-600 hover:bg-green-700 rounded-xl"
              >
                <Check className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-6">
          {/* Upload Section */}
          {showUpload && (
            <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image</h3>
              <ImageUpload onImageUploaded={handleNewImageUploaded} placeholder="Upload new image to gallery" />
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search images by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading images...</div>
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image._id}
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageId === image._id
                        ? "border-green-500 shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedImageId(image._id)}
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={image.data || "/placeholder.svg"}
                        alt={image.filename}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Selection Indicator */}
                    {selectedImageId === image._id && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}

                    {/* Image Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="text-white text-xs">
                        <div className="font-medium truncate">{image.filename}</div>
                        <div className="text-gray-300 mt-1">
                          {formatFileSize(image.size)} • {formatDate(image.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="text-6xl mb-4">📁</div>
                <div className="text-xl font-medium mb-2">
                  {searchQuery ? "No images found" : "No images in gallery"}
                </div>
                <div className="text-sm">
                  {searchQuery ? "Try a different search term" : "Upload your first image to get started"}
                </div>
              </div>
            )}
          </div>

          {/* Selected Image Info */}
          {selectedImageId && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg overflow-hidden">
                  <img
                    src={images.find((img) => img._id === selectedImageId)?.data || "/placeholder.svg"}
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-900">
                    {images.find((img) => img._id === selectedImageId)?.filename}
                  </div>
                  <div className="text-sm text-green-700">
                    {formatFileSize(images.find((img) => img._id === selectedImageId)?.size || 0)} •{" "}
                    {formatDate(images.find((img) => img._id === selectedImageId)?.createdAt || "")}
                  </div>
                </div>
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
