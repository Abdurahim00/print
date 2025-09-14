import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orderService"

// Force dynamic rendering to prevent ISR caching issues
export const dynamic = 'force-dynamic'

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

    // Debug logging to check design data
    console.log('📦 Order API - Received order with items:', orderData.items?.length)
    orderData.items?.forEach((item: any, index: number) => {
      console.log(`Item ${index + 1}:`, {
        name: item.name,
        hasDesignContext: !!item.designContext,
        hasDesignCanvas: !!item.designCanvasJSON,
        hasCustomDesign: item.hasCustomDesign,
        designContextKeys: item.designContext ? Object.keys(item.designContext) : [],
      })
    })

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

    // Process items to extract design data
    const processedItems = orderData.items?.map((item: any) => {
      const processedItem = { ...item }

      // Check for design data in multiple formats
      // New format: designContext and designCanvasJSON
      if (item.designContext || item.designCanvasJSON) {
        processedItem.hasCustomDesign = true
        processedItem.designContext = item.designContext
        processedItem.designCanvasJSON = item.designCanvasJSON
        processedItem.designPreview = item.designPreview
        processedItem.stepDesignAreas = item.stepDesignAreas
        processedItem.designCosts = item.designCosts
      }
      // Old format: designs array
      else if (item.designs && Array.isArray(item.designs)) {
        processedItem.hasCustomDesign = true
        processedItem.designData = {
          designs: item.designs,
          totalDesignArea: item.totalDesignArea,
          productDetails: {
            id: item.productId,
            name: item.productName,
            image: item.productImage,
          },
        }
      }

      return processedItem
    })

    const newOrder = await OrderService.createOrder({
      orderId,
      date: new Date().toISOString().split("T")[0],
      status: "Queued",
      customer: orderData.customer || orderData.customerName || 'Guest',
      total: total || 0,
      ...orderData,
      items: processedItems || orderData.items,
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
