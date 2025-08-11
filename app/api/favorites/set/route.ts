import { NextRequest, NextResponse } from "next/server"
import { setDesignForFavorite } from "@/lib/services/favoriteService"

export async function POST(req: NextRequest) {
  const { userId, productId, designId } = await req.json()
  console.log("🔥🔥 [API] /api/favorites/set POST", { userId, productId, designId })
  if (!userId || !productId) return NextResponse.json({ error: "missing fields" }, { status: 400 })
  console.log("🔥 [API] Setting design for favorite", { userId, productId, designId })
  await setDesignForFavorite(userId, productId, designId || null)
  console.log("🔥 [API] /api/favorites/set success")
  return NextResponse.json({ success: true })
}


