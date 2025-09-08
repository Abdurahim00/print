import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"

export async function GET() {
  try {
    console.log("Fetching orders...")
    
    // Simply fetch orders without timeout for now
    // MongoDB connection might take time on first request
    const orders = await OrderService.getAllOrders(50) // Limit to 50 orders
    
    console.log(`Found ${orders.length} orders`)
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Get orders error:", error.message)
    // Return empty array on any error
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Calculate total from items if not provided
    let total = orderData.total
    if (!total && orderData.items && Array.isArray(orderData.items)) {
      total = orderData.items.reduce((sum: number, item: any) => {
        const itemPrice = typeof item.price === 'number' ? item.price : 0
        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1
        return sum + (itemPrice * itemQuantity)
      }, 0)
    }

    const orderId = `ORD-${String(Date.now()).slice(-6)}` // Simple unique ID
    const newOrder = await OrderService.createOrder({
      orderId,
      date: new Date().toISOString().split("T")[0],
      status: "Queued",
      customer: orderData.customer || orderData.customerName || 'Guest',
      total: total || 0,
      ...orderData,
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
