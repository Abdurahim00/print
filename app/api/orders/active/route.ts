import { NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"

// Force dynamic rendering to prevent ISR caching issues
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Fetch only active orders (non-completed) for operations dashboard
    const orders = await OrderService.getActiveOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Get active orders error:", error)
    return NextResponse.json({ error: "Failed to fetch active orders" }, { status: 500 })
  }
}