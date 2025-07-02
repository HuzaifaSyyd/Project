import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Image from "@/models/Image"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      // Videos
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/quicktime",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, OGG, AVI, MOV) are allowed.",
        },
        { status: 400 },
      )
    }

    // Validate file size
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 5 * 1024 * 1024 // 50MB for videos, 5MB for images
    if (file.size > maxSize) {
      const limit = file.type.startsWith("video/") ? "50MB" : "5MB"
      return NextResponse.json({ error: `File too large. Maximum size is ${limit}.` }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64Data}`

    // Save to MongoDB
    const imageDoc = await Image.create({
      filename: file.name,
      mimetype: file.type,
      size: file.size,
      data: dataUrl,
      isVideo: file.type.startsWith("video/"), // Add video flag
    })

    return NextResponse.json({
      message: "File uploaded successfully",
      imageId: imageDoc._id,
      dataUrl: dataUrl,
      isVideo: file.type.startsWith("video/"),
      fileType: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
