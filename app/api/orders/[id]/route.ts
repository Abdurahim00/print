import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body
    
    console.log('PATCH /api/orders/[id] - Received request:', {
      orderId: params.id,
      newStatus: status,
      body
    })

    const updatedOrder = await OrderService.updateOrderStatus(params.id, status)

    if (!updatedOrder) {
      console.error('Order not found:', params.id)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log('Order updated successfully:', updatedOrder)
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
