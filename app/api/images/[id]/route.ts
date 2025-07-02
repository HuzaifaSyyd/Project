import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Image from "@/models/Image"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const image = await Image.findById(params.id)
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Extract base64 data from data URL
    const base64Data = image.data.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": image.mimetype,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 })
  }
}
