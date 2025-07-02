"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, X, AlertTriangle } from "lucide-react"

interface HomeImage {
  _id: string
  title: string
  imageUrl: string
  imageData: string
  size: string
  order: number
}

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  image: HomeImage | null
  onImageDeleted: () => void
}

export function DeleteConfirmationModal({ isOpen, onClose, image, onImageDeleted }: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!image) return

    setLoading(true)
    try {
      const response = await fetch(`/api/home-images/${image._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onImageDeleted()
        onClose()
        alert("Image deleted successfully!")
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete image")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">Delete Image</DialogTitle>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Are you sure?</h3>
              <p className="text-sm text-red-700 mt-1">
                This will permanently delete "{image?.title}". This action cannot be undone.
              </p>
            </div>
          </div>

          {image && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={image.imageData || image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{image.title}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {image.size === "hero" ? "Banner Image" : "Gallery Image"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl border-gray-300 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={loading} variant="destructive" className="flex-1 rounded-xl">
              <Trash2 className="h-4 w-4 mr-2" />
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
