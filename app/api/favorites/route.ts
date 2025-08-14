import { NextRequest, NextResponse } from "next/server"
import { addFavorite, listFavorites } from "@/lib/services/favoriteService"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
  const favs = await listFavorites(userId)
  return NextResponse.json(favs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, productId, categoryId, preview } = body
  if (!userId || !productId || !categoryId) return NextResponse.json({ error: "missing fields" }, { status: 400 })
  const fav = await addFavorite(userId, productId, categoryId, preview)
  return NextResponse.json(fav, { status: 201 })
}

