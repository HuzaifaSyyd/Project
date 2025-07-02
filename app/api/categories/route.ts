import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Category from "@/models/Category"

export async function GET() {
  try {
    await dbConnect()
    const categories = await Category.find().sort({ name: 1 })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { name } = await request.json()
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    const category = await Category.create({ name, slug })
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
