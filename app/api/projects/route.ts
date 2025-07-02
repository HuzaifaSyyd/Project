import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"
import Category from "@/models/Category"
import Image from "@/models/Image" // Import Image model for population

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const query: any = { status: "published" }

    if (category && category !== "all") {
      const categoryDoc = await Category.findOne({ slug: category })
      if (categoryDoc) {
        query.category = categoryDoc._id
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { technologies: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const projects = await Project.find(query)
      .populate("category", "name slug")
      .populate("imageId")
      .sort({ createdAt: -1 })

    // Transform the data to include image URLs
    const transformedProjects = projects.map((project) => {
      // Check if imageId is populated and has data
      if (!project.imageId || !project.imageId.data) {
        console.warn(`Project ${project._id} has missing or invalid imageId`)
        return {
          _id: project._id,
          title: project.title,
          description: project.description,
          category: project.category,
          technologies: project.technologies,
          url: project.url,
          status: project.status,
          imageUrl: "/placeholder.svg?height=400&width=600",
          imageData: "/placeholder.svg?height=400&width=600",
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        }
      }

      return {
        _id: project._id,
        title: project.title,
        description: project.description,
        category: project.category,
        technologies: project.technologies,
        url: project.url,
        status: project.status,
        imageUrl: `/api/images/${project.imageId._id}`,
        imageData: project.imageId.data, // For immediate display
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }
    })

    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.imageId || !data.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the image exists
    const imageExists = await Image.findById(data.imageId)
    if (!imageExists) {
      return NextResponse.json({ error: "Referenced image not found" }, { status: 400 })
    }

    // Verify the category exists
    const categoryExists = await Category.findById(data.category)
    if (!categoryExists) {
      return NextResponse.json({ error: "Referenced category not found" }, { status: 400 })
    }

    const project = await Project.create(data)

    const populatedProject = await Project.findById(project._id).populate("category", "name slug").populate("imageId")

    if (!populatedProject || !populatedProject.imageId) {
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json({
      _id: populatedProject._id,
      title: populatedProject.title,
      description: populatedProject.description,
      category: populatedProject.category,
      technologies: populatedProject.technologies,
      url: populatedProject.url,
      status: populatedProject.status,
      imageUrl: `/api/images/${populatedProject.imageId._id}`,
      imageData: populatedProject.imageId.data,
    })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
