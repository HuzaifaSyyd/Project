"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface Category {
  _id: string
  name: string
  slug: string
}

interface Project {
  _id: string
  title: string
  description: string
  imageUrl: string
  imageData: string
  category: Category
  technologies: string[]
  url?: string
  status: string
}

interface ProjectModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen h-screen p-0 bg-gray-50 m-0 rounded-none">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div
            className={`flex-1 relative p-4 sm:p-8 lg:p-12 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-2 sm:p-4 shadow-xl sm:shadow-2xl border border-gray-100">
              <img
                src={project.imageData || project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
              <div className="absolute inset-2 sm:inset-4 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl"></div>
            </div>
          </div>

          {/* Details Section */}
          <div
            className={`flex-1 p-4 sm:p-8 lg:p-12 flex flex-col transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-full flex flex-col shadow-xl sm:shadow-2xl border border-gray-100">
              <div className="flex items-start justify-between mb-6 sm:mb-8">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                    {project.title}
                  </h2>
                  <Badge className="bg-gray-900 text-white px-4 sm:px-6 py-2 text-sm rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
                    {project.category.name}
                  </Badge>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 sm:p-4 hover:bg-gray-100 rounded-full transition-all duration-200 bg-gray-50 border border-gray-200 shadow-lg transform hover:scale-110 active:scale-95 flex-shrink-0"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 space-y-6 sm:space-y-8 overflow-y-auto">
                <div
                  className={`bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg transform transition-all duration-500 hover:scale-[1.02] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ animationDelay: "400ms" }}
                >
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-lg sm:text-xl">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{project.description}</p>
                </div>

                <div
                  className={`bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg transform transition-all duration-500 hover:scale-[1.02] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ animationDelay: "500ms" }}
                >
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-lg sm:text-xl">Technologies</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={tech}
                        className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
                        style={{
                          animationDelay: `${600 + index * 100}ms`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.url && (
                  <div
                    className={`bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg transform transition-all duration-500 hover:scale-[1.02] ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ animationDelay: "700ms" }}
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-lg sm:text-xl">Project URL</h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:underline break-all text-sm sm:text-base hover:text-gray-700 transition-colors duration-200"
                    >
                      {project.url}
                    </a>
                  </div>
                )}

                <div
                  className={`bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-lg transform transition-all duration-500 hover:scale-[1.02] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ animationDelay: "800ms" }}
                >
                  <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-lg sm:text-xl">Storage Info</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    💾 This image is stored directly in MongoDB database as base64 data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
