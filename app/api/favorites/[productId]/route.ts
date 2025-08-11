import { NextRequest, NextResponse } from "next/server"
import { removeFavorite } from "@/lib/services/favoriteService"

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
  const ok = await removeFavorite(userId, params.productId)
  return NextResponse.json({ success: ok })
}


