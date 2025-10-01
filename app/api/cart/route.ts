import { NextRequest, NextResponse } from "next/server"
import { CartService } from "@/lib/services/cartService"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
  const cart = await CartService.getCartByUserId(userId)
  return NextResponse.json(cart || { userId, items: [] })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, items } = body
  if (!userId || !Array.isArray(items)) {
    return NextResponse.json({ error: "userId and items required" }, { status: 400 })
  }
  
  // Debug: Log the cart data being saved
  console.log('🛒 CART API: Saving cart to database:', {
    userId,
    itemsCount: items.length,
    items: items.map((item: any) => ({
      name: item.name,
      hasDesignsArray: !!(item.designs),
      designsArrayLength: item.designs?.length || 0,
      designs: item.designs
    }))
  })
  
  const updated = await CartService.upsertCart(userId, items)
  return NextResponse.json(updated, { status: 200 })
}


