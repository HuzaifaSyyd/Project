import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Image from "@/models/Image"

export async function GET() {
  try {
    await dbConnect()

    const images = await Image.find().sort({ createdAt: -1 }).select("filename mimetype size data createdAt")

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
