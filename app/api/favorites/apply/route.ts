import { NextRequest, NextResponse } from "next/server"
import { applyDesignToCategoryFavorites, clearDesignFromCategoryFavorites } from "@/lib/services/favoriteService"

export async function POST(req: NextRequest) {
  const { userId, categoryId, designId } = await req.json()
  console.log("🔥🔥 [API] /api/favorites/apply POST", { userId, categoryId, designId })
  if (!userId || !categoryId) return NextResponse.json({ error: "missing fields" }, { status: 400 })
  if (designId) {
    console.log("🔥 [API] Applying design to category favorites", { userId, categoryId, designId })
    await applyDesignToCategoryFavorites(userId, categoryId, designId)
  } else {
    console.log("🔥 [API] Clearing design from category favorites", { userId, categoryId })
    await clearDesignFromCategoryFavorites(userId, categoryId)
  }
  console.log("🔥 [API] /api/favorites/apply success")
  return NextResponse.json({ success: true })
}

