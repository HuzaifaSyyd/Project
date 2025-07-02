import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import HomeImage from "@/models/HomeImage"
import Image from "@/models/Image" // Import Image model for population

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const updatedImage = await HomeImage.findByIdAndUpdate(params.id, { title, imageId, size }, { new: true }).populate(
      "imageId",
    )

    if (!updatedImage) {
      return NextResponse.json({ error: "Home image not found" }, { status: 404 })
    }

    if (!updatedImage.imageId) {
      return NextResponse.json({ error: "Failed to populate image data" }, { status: 500 })
    }

    return NextResponse.json({
      _id: updatedImage._id,
      title: updatedImage.title,
      size: updatedImage.size,
      order: updatedImage.order,
      imageUrl: `/api/images/${updatedImage.imageId._id}`,
      imageData: updatedImage.imageId.data,
    })
  } catch (error) {
    console.error("Error updating home image:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const deletedImage = await HomeImage.findByIdAndDelete(params.id)

    if (!deletedImage) {
      return NextResponse.json({ error: "Home image not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Home image deleted successfully" })
  } catch (error) {
    console.error("Error deleting home image:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
