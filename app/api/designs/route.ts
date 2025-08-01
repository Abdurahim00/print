import { type NextRequest, NextResponse } from "next/server"
import { DesignService } from "@/lib/services/designService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const designs = await DesignService.getDesignsByUserId(userId)
    return NextResponse.json(designs)
  } catch (error) {
    console.error("Get designs error:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const designData = await request.json()

    const newDesign = await DesignService.createDesign({
      ...designData,
      status: "Draft",
    })

    return NextResponse.json(newDesign, { status: 201 })
  } catch (error) {
    console.error("Create design error:", error)
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
  }
}
