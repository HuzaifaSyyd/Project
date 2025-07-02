import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import HomeImage from "@/models/HomeImage"
import Image from "@/models/Image" // Import Image model for population

export async function GET() {
  try {
    await dbConnect()

    // Ensure both models are registered
    const images = await HomeImage.find().populate("imageId").sort({ order: 1 })

    // Transform the data to include image URLs
    const transformedImages = images.map((img) => {
      // Check if imageId is populated and has data
      if (!img.imageId || !img.imageId.data) {
        console.warn(`HomeImage ${img._id} has missing or invalid imageId`)
        return {
          _id: img._id,
          title: img.title,
          size: img.size,
          order: img.order,
          imageUrl: "/placeholder.svg?height=400&width=600",
          imageData: "/placeholder.svg?height=400&width=600",
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        }
      }

      return {
        _id: img._id,
        title: img.title,
        size: img.size,
        order: img.order,
        imageUrl: `/api/images/${img.imageId._id}`,
        imageData: img.imageId.data, // For immediate display
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
      }
    })

    return NextResponse.json(transformedImages)
  } catch (error) {
    console.error("Error fetching home images:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { title, imageId, size } = await request.json()

    // Validate required fields
    if (!title || !imageId || !size) {
      return NextResponse.json({ error: "Missing required fields: title, imageId, size" }, { status: 400 })
    }

    // Verify the image exists
    const imageExists = await Image.findById(imageId)
    if (!imageExists) {
      return NextResponse.json({ error: "Referenced image not found" }, { status: 400 })
    }

    // Set order based on size
    let order = 0
    if (size === "hero") {
      order = 0
    } else {
      order = Math.floor(Math.random() * 1000)
    }

    const homeImage = await HomeImage.create({
      title,
      imageId,
      size,
      order,
    })

    const populatedImage = await HomeImage.findById(homeImage._id).populate("imageId")

    if (!populatedImage || !populatedImage.imageId) {
      return NextResponse.json({ error: "Failed to create home image" }, { status: 500 })
    }

    return NextResponse.json({
      _id: populatedImage._id,
      title: populatedImage.title,
      size: populatedImage.size,
      order: populatedImage.order,
      imageUrl: `/api/images/${populatedImage.imageId._id}`,
      imageData: populatedImage.imageId.data,
    })
  } catch (error) {
    console.error("Error creating home image:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
