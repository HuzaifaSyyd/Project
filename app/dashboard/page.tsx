"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, FolderOpen } from "lucide-react"
import { ImageSelector } from "@/components/image-selector"
import { EditImageModal } from "@/components/edit-image-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

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

interface HomeImage {
  _id: string
  title: string
  imageUrl: string
  imageData: string
  size: string
  order: number
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("home")
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [homeImages, setHomeImages] = useState<HomeImage[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HomeImage | null>(null)

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    imageId: "",
    imageData: "",
    category: "",
    technologies: "",
    url: "",
    status: "published",
  })

  const [bannerForm, setBannerForm] = useState({
    title: "",
    imageId: "",
    imageData: "",
    isVideo: false,
  })

  const [imageForm, setImageForm] = useState({
    title: "",
    imageId: "",
    imageData: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchProjects()
    fetchHomeImages()
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const fetchHomeImages = async () => {
    try {
      const response = await fetch("/api/home-images")
      const data = await response.json()
      setHomeImages(data)
    } catch (error) {
      console.error("Error fetching home images:", error)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })

      if (response.ok) {
        setNewCategory("")
        fetchCategories()
      }
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleAddProject = async () => {
    if (!projectForm.title || !projectForm.description || !projectForm.imageId || !projectForm.category) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectForm.title,
          description: projectForm.description,
          imageId: projectForm.imageId,
          category: projectForm.category,
          technologies: projectForm.technologies.split(",").map((t) => t.trim()),
          url: projectForm.url,
          status: projectForm.status,
        }),
      })

      if (response.ok) {
        setProjectForm({
          title: "",
          description: "",
          imageId: "",
          imageData: "",
          category: "",
          technologies: "",
          url: "",
          status: "published",
        })
        fetchProjects()
        alert("Project added successfully!")
      }
    } catch (error) {
      console.error("Error adding project:", error)
    }
  }

  const handleAddBanner = async () => {
    if (!bannerForm.title.trim() || !bannerForm.imageId.trim()) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/home-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: bannerForm.title,
          imageId: bannerForm.imageId,
          size: "hero",
        }),
      })

      if (response.ok) {
        setBannerForm({ title: "", imageId: "", imageData: "", isVideo: false })
        fetchHomeImages()
        alert("Banner added successfully!")
      }
    } catch (error) {
      console.error("Error adding banner:", error)
    }
  }

  const handleAddImage = async () => {
    if (!imageForm.title.trim() || !imageForm.imageId.trim()) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/home-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: imageForm.title,
          imageId: imageForm.imageId,
          size: "gallery",
        }),
      })

      if (response.ok) {
        setImageForm({ title: "", imageId: "", imageData: "" })
        fetchHomeImages()
        alert("Image added successfully!")
      }
    } catch (error) {
      console.error("Error adding image:", error)
    }
  }

  const handleEditImage = (image: HomeImage) => {
    setSelectedImage(image)
    setEditModalOpen(true)
  }

  const handleDeleteImage = (image: HomeImage) => {
    setSelectedImage(image)
    setDeleteModalOpen(true)
  }

  const handleImageUpdated = () => {
    fetchHomeImages()
    setEditModalOpen(false)
    setSelectedImage(null)
  }

  const handleImageDeleted = () => {
    fetchHomeImages()
    setDeleteModalOpen(false)
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-6 py-20 sm:py-24">
        <div
          className={`mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Dashboard</h1>
          <p className="text-gray-600 text-base sm:text-lg flex items-center gap-2 flex-wrap">
            <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span>Manage your portfolio content - Select from gallery or upload new images</span>
          </p>
        </div>

        {/* Replace the TabsList section with separate buttons */}
        <div
          className={`flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base border-2 ${
              activeTab === "home"
                ? "bg-gray-900 text-white border-gray-900 shadow-xl"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-lg"
            }`}
          >
            Home Page
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base border-2 ${
              activeTab === "projects"
                ? "bg-gray-900 text-white border-gray-900 shadow-xl"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-lg"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base border-2 ${
              activeTab === "categories"
                ? "bg-gray-900 text-white border-gray-900 shadow-xl"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-lg"
            }`}
          >
            Categories
          </button>
        </div>

        {activeTab === "home" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Banner Image Section */}
            <Card
              className={`bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl transition-all duration-1000 transform hover:scale-[1.01] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "300ms" }}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">🎯</span>
                  <span>Banner Image (Hero Section)</span>
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">
                  Add a large banner image that appears at the top of your home page
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {homeImages
                    .filter((img) => img.size === "hero")
                    .map((image, index) => (
                      <div
                        key={image._id}
                        className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg sm:shadow-xl border border-gray-100 transform hover:scale-[1.02] transition-all duration-300"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl mb-3 sm:mb-4 overflow-hidden">
                          {image.imageData?.startsWith("data:video/") ? (
                            <video
                              src={image.imageData || image.imageUrl}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              controls
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={image.imageData || image.imageUrl}
                              alt={image.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-700">{image.title}</span>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FolderOpen className="h-3 w-3" />
                              Banner Image (Gallery)
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditImage(image)}
                              className="bg-gray-900 hover:bg-gray-800 rounded-lg sm:rounded-xl transform hover:scale-110 transition-all duration-200"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteImage(image)}
                              className="rounded-lg sm:rounded-xl transform hover:scale-110 transition-all duration-200"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {homeImages.filter((img) => img.size === "hero").length === 0 && (
                    <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-dashed border-gray-300">
                      <div className="text-gray-500 mb-4 sm:mb-6 text-center text-sm sm:text-base">
                        No banner image added yet
                      </div>
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                            Banner Title
                          </label>
                          <Input
                            placeholder="Enter banner title"
                            value={bannerForm.title}
                            onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                            className="bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                            Banner Image
                          </label>
                          <ImageSelector
                            onImageSelected={(imageId, dataUrl, isVideo) =>
                              setBannerForm({ ...bannerForm, imageId, imageData: dataUrl, isVideo })
                            }
                            currentImageData={bannerForm.imageData}
                            currentImageId={bannerForm.imageId}
                            currentIsVideo={bannerForm.isVideo}
                            placeholder="Select banner image or video from gallery or upload new"
                            acceptVideo={true}
                          />
                        </div>
                        <Button
                          onClick={handleAddBanner}
                          className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg sm:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base"
                          disabled={!bannerForm.title || !bannerForm.imageId}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Banner Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Small Images Section */}
            <Card
              className={`bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl transition-all duration-1000 transform hover:scale-[1.01] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "400ms" }}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">🖼️</span>
                  <span>Gallery Images (4-Card Grid)</span>
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">
                  Add small images that will appear in a 4-card grid below the banner
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {homeImages
                    .filter((img) => img.size !== "hero")
                    .map((image, index) => (
                      <div
                        key={image._id}
                        className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg sm:shadow-xl border border-gray-100 hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-[1.02]"
                        style={{ animationDelay: `${500 + index * 100}ms` }}
                      >
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl mb-2 sm:mb-4 overflow-hidden">
                          <img
                            src={image.imageData || image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-medium text-gray-700 truncate block">{image.title}</span>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FolderOpen className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                              <span className="truncate">Gallery</span>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditImage(image)}
                              className="bg-gray-900 hover:bg-gray-800 rounded-lg p-1 sm:p-2 transform hover:scale-110 transition-all duration-200"
                            >
                              <Edit className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteImage(image)}
                              className="rounded-lg p-1 sm:p-2 transform hover:scale-110 transition-all duration-200"
                            >
                              <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Add New Gallery Image Form */}
                <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-300">
                  <h4 className="font-medium text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                    Add New Gallery Image
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Image Title</label>
                      <Input
                        placeholder="Enter image title"
                        value={imageForm.title}
                        onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })}
                        className="bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Gallery Image</label>
                      <ImageSelector
                        onImageSelected={(imageId, dataUrl) =>
                          setImageForm({ ...imageForm, imageId, imageData: dataUrl })
                        }
                        currentImageData={imageForm.imageData}
                        currentImageId={imageForm.imageId}
                        placeholder="Select gallery image from library or upload new"
                      />
                    </div>
                    <Button
                      onClick={handleAddImage}
                      className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                      disabled={!imageForm.title || !imageForm.imageId}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Gallery Image
                    </Button>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-xs sm:text-sm">
                  📁 Select from image gallery or upload new • 💡 Gallery images appear in random order
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6 sm:space-y-8">
            <Card
              className={`bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl transition-all duration-1000 transform hover:scale-[1.01] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "300ms" }}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
                  <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Project Title *</label>
                    <Input
                      placeholder="Enter project title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Category *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Description *</label>
                  <Textarea
                    placeholder="Enter project description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Project Image *</label>
                  <ImageSelector
                    onImageSelected={(imageId, dataUrl) =>
                      setProjectForm({ ...projectForm, imageId, imageData: dataUrl })
                    }
                    currentImageData={projectForm.imageData}
                    currentImageId={projectForm.imageId}
                    placeholder="Select project image from gallery or upload new"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Technologies</label>
                  <Input
                    placeholder="React, Next.js, TypeScript (comma separated)"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    Project URL (optional)
                  </label>
                  <Input
                    placeholder="https://example.com"
                    value={projectForm.url}
                    onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                    className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>

                <Button
                  onClick={handleAddProject}
                  className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-2 sm:py-3 shadow-lg sm:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base"
                  disabled={
                    !projectForm.title || !projectForm.description || !projectForm.imageId || !projectForm.category
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {projects.map((project, index) => (
                <Card
                  key={project._id}
                  className={`bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl transform hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg sm:rounded-xl mb-3 sm:mb-4 overflow-hidden">
                      <img
                        src={project.imageData || project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{project.title}</h3>
                    <Badge className="bg-gray-900 text-white rounded-full mb-2 text-xs">{project.category.name}</Badge>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      From Gallery
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800 rounded-lg sm:rounded-xl transform hover:scale-110 transition-all duration-200"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-lg sm:rounded-xl transform hover:scale-110 transition-all duration-200"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6 sm:space-y-8">
            <Card
              className={`bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl transition-all duration-1000 transform hover:scale-[1.01] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "300ms" }}
            >
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl sm:text-2xl">Manage Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Input
                    placeholder="Category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base flex-1"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="bg-gray-900 hover:bg-gray-800 rounded-lg sm:rounded-xl px-4 sm:px-6 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Scrollable Categories Box */}
                <div className="border border-gray-200 rounded-xl sm:rounded-2xl bg-gray-50 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">All Categories</h3>
                  <div className="max-h-96 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {categories.map((category, index) => (
                        <div
                          key={category._id}
                          className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm transform hover:scale-105 hover:shadow-md transition-all duration-300 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                          }`}
                          style={{ animationDelay: `${400 + index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900 text-sm sm:text-base truncate flex-1 mr-2">
                              {category.name}
                            </span>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-lg sm:rounded-xl transform hover:scale-110 transition-all duration-200 flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {categories.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📂</div>
                        <p className="text-sm">No categories added yet</p>
                        <p className="text-xs mt-1">Add your first category above</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      <EditImageModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedImage(null)
        }}
        image={selectedImage}
        onImageUpdated={handleImageUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedImage(null)
        }}
        image={selectedImage}
        onImageDeleted={handleImageDeleted}
      />
    </div>
  )
}
