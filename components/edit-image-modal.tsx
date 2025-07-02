"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, X } from "lucide-react"
import { ImageSelector } from "@/components/image-selector"

interface HomeImage {
  _id: string
  title: string
  imageUrl: string
  imageData: string
  size: string
  order: number
}

interface EditImageModalProps {
  isOpen: boolean
  onClose: () => void
  image: HomeImage | null
  onImageUpdated: () => void
}

export function EditImageModal({ isOpen, onClose, image, onImageUpdated }: EditImageModalProps) {
  const [title, setTitle] = useState("")
  const [imageId, setImageId] = useState("")
  const [imageData, setImageData] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (image) {
      setTitle(image.title)
      setImageData(image.imageData)
      // Extract imageId from imageUrl
      const urlParts = image.imageUrl.split("/")
      const extractedImageId = urlParts[urlParts.length - 1]
      setImageId(extractedImageId)
    } else {
      setTitle("")
      setImageId("")
      setImageData("")
    }
  }, [image])

  const handleSave = async () => {
    if (!image || !title.trim() || !imageId.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/home-images/${image._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          imageId,
          size: image.size,
        }),
      })

      if (response.ok) {
        onImageUpdated()
        onClose()
        alert("Image updated successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update image")
      }
    } catch (error) {
      console.error("Error updating image:", error)
      alert("Failed to update image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-3xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Edit {image?.size === "hero" ? "Banner" : "Gallery"} Image
            </DialogTitle>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Image Title</label>
            <Input
              placeholder="Enter image title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Image</label>
            <ImageSelector
              onImageSelected={(newImageId, newDataUrl) => {
                setImageId(newImageId)
                setImageData(newDataUrl)
              }}
              currentImageData={imageData}
              currentImageId={imageId}
              placeholder="Select new image from gallery or upload"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl border-gray-300 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !title.trim() || !imageId.trim()}
              className="flex-1 bg-gray-900 hover:bg-gray-800 rounded-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
