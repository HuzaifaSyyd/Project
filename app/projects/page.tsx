"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Eye, Search } from "lucide-react"
import { ProjectModal } from "@/components/project-modal"

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchProjects()
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [selectedCategory, searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/projects?${params}`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (project: Project) => {
    if (project.category.slug === "website" && project.url) {
      window.open(project.url, "_blank")
    } else {
      setSelectedProject(project)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 animate-pulse">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-6 py-20 sm:py-24">
        {/* Search Bar */}
        <div
          className={`max-w-2xl mx-auto mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:shadow-lg transition-all duration-300 text-base sm:text-lg shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transform hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap gap-2 sm:gap-4 mb-12 sm:mb-16 justify-center px-2 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <Button
            onClick={() => setSelectedCategory("all")}
            className={`capitalize px-4 sm:px-8 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 shadow-lg sm:shadow-xl transform hover:scale-105 hover:-translate-y-1 text-sm sm:text-base ${
              selectedCategory === "all"
                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-xl sm:shadow-2xl"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All
          </Button>
          {categories.map((category, index) => (
            <Button
              key={category._id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`capitalize px-4 sm:px-8 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 shadow-lg sm:shadow-xl transform hover:scale-105 hover:-translate-y-1 text-sm sm:text-base ${
                selectedCategory === category.slug
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-xl sm:shadow-2xl"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
              style={{
                animationDelay: `${(index + 1) * 100}ms`,
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Projects Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              onClick={() => handleProjectClick(project)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02] group-hover:-translate-y-3 shadow-lg sm:shadow-xl border border-gray-100">
                <div className="relative h-36 sm:h-48 mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl bg-gray-50 p-1 sm:p-2 border border-gray-100">
                  <img
                    src={project.imageData || project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-lg sm:rounded-xl"
                  />
                  <div className="absolute inset-1 sm:inset-2 bg-gradient-to-t from-black/20 to-transparent rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{project.title}</h3>
                    <Badge className="bg-gray-900 text-white px-2 sm:px-3 py-1 rounded-full shadow-lg text-xs flex-shrink-0">
                      {project.category.name}
                    </Badge>
                  </div>

                  <p className="text-gray-600 line-clamp-2 leading-relaxed text-sm">{project.description}</p>

                  <div className="flex items-center justify-between pt-2 sm:pt-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium border border-gray-200">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-white bg-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors transform group-hover:scale-110">
                      {project.category.slug === "website" ? (
                        <ExternalLink className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div
            className={`text-center py-12 sm:py-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto shadow-lg sm:shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
              <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  )
}
