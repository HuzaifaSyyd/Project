"use client"

import { useEffect, useState } from "react"

interface HomeImage {
  _id: string
  title: string
  imageUrl: string
  imageData: string
  size: "small" | "medium" | "large" | "hero" | "gallery"
  order: number
  isVideo?: boolean
}

export default function HomePage() {
  const [images, setImages] = useState<HomeImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchImages()
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const fetchImages = async () => {
    try {
      setError(null)
      const response = await fetch("/api/home-images")

      if (!response.ok) {
        throw new Error("Failed to fetch images")
      }

      const data = await response.json()

      // Ensure data is an array
      if (Array.isArray(data)) {
        setImages(data)
      } else {
        console.error("API returned non-array data:", data)
        setImages([])
        setError("Invalid data format received")
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      setImages([]) // Ensure images is always an array
      setError("Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={() => {
              setLoading(true)
              fetchImages()
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Ensure images is always an array before using array methods
  const safeImages = Array.isArray(images) ? images : []
  const bannerImage = safeImages.find((img) => img.size === "hero")
  const galleryImages = safeImages.filter((img) => img.size !== "hero")

  // Check if banner is a video
  const bannerIsVideo = bannerImage?.imageData?.startsWith("data:video/") || false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Image/Video */}
      {bannerImage ? (
        <div
          className={`relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden mx-3 sm:mx-6 pt-20 sm:pt-24 mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative h-full w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl transform hover:scale-[1.02] transition-all duration-700 bg-white p-2 sm:p-3 border border-gray-100 group">
            {bannerIsVideo ? (
              <video
                src={bannerImage.imageData || bannerImage.imageUrl}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-700"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={bannerImage.imageData || bannerImage.imageUrl}
                alt={bannerImage.title}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl sm:rounded-2xl"></div>

            {/* Media type indicator */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-xs rounded-full">
              {bannerIsVideo ? "🎥 Video" : "🖼️ Image"}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden mx-3 sm:mx-6 pt-20 sm:pt-24 mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative h-full w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-white p-2 sm:p-3 border border-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400 animate-pulse">
              <div className="text-4xl sm:text-6xl mb-4">🎬</div>
              <div className="text-lg sm:text-xl font-medium">No banner image or video added yet</div>
              <div className="text-sm mt-2">Add a banner image or video from the dashboard</div>
              <div className="text-xs mt-2 text-blue-600 font-medium">
                📐 Recommended: 16:9 aspect ratio (1920x1080, 1280x720)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Images - Responsive Grid */}
      <div className="container mx-auto px-3 sm:px-6 py-8 sm:py-16">
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {galleryImages.map((image, index) => {
              const isVideoItem = image.imageData?.startsWith("data:video/") || false

              return (
                <div
                  key={image._id}
                  className={`relative group transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="relative h-[250px] sm:h-[280px] overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-lg sm:shadow-xl border border-gray-100 transform group-hover:scale-[1.05] group-hover:-translate-y-3 group-hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    {isVideoItem ? (
                      <video
                        src={image.imageData || image.imageUrl}
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-700"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={image.imageData || image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-3 sm:inset-4 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Media type indicator */}
                    <div className="absolute top-6 left-6 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                      {isVideoItem ? "🎥" : "🖼️"}
                    </div>

                    {/* Hover overlay with title */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                        <p className="text-sm font-medium truncate">{image.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className={`text-center py-12 sm:py-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto shadow-lg sm:shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl sm:text-6xl mb-4 animate-bounce">📸</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No gallery images yet</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Add some gallery images from the dashboard to see them here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
