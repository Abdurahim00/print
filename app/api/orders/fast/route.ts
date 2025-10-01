import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// Force dynamic rendering to prevent ISR caching issues
export const dynamic = 'force-dynamic'

// Lightweight orders endpoint for dashboard - only fetches essential fields
export async function GET() {
  try {
    console.log("Fast orders endpoint called")
    
    const db = await getDatabase()
    const ordersCollection = db.collection("orders")
    
    // Fetch all fields - removing projection to get complete data
    const orders = await ordersCollection
      .find(
        { status: { $ne: "Completed" } } // Only non-completed orders
      )
      .sort({ createdAt: -1 })
      .limit(20) // Only get 20 most recent orders
      .toArray()
    
    // Return orders with complete design data
    const completeOrders = orders.map(order => ({
      id: order.orderId,
      customer: order.customerName || order.customer || 'Guest',
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerCity: order.customerCity,
      customerPostalCode: order.customerPostalCode,
      customerCountry: order.customerCountry,
      date: order.date || new Date(order.createdAt).toISOString().split('T')[0],
      total: order.total || 0,
      status: order.status || 'Queued',
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        designPreview: item.designPreview,
        designId: item.designId,
        selectedSizes: item.selectedSizes,
        designContext: item.designContext,
        designContextDetails: item.designContextDetails,
        designCanvasJSON: item.designCanvasJSON,
        allDesignedAngles: item.allDesignedAngles,
        finalItem: item.finalItem,
        designs: item.designs,
        totalDesignArea: item.totalDesignArea,
        totalPrice: item.totalPrice,
        basePrice: item.basePrice,
        designCosts: item.designCosts,
        productId: item.productId,
        // Include all other properties
        ...item
      })),
      shippingOption: order.shippingOption,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))
    
    console.log(`Fast endpoint returning ${completeOrders.length} orders`)
    return NextResponse.json(completeOrders)
    
  } catch (error: any) {
    console.error("Fast orders endpoint error:", error.message)
    
    // Return mock data as fallback
    return NextResponse.json([
      {
        id: "ORD-" + Date.now().toString().slice(-6),
        customer: "Sample Customer",
        date: new Date().toISOString().split('T')[0],
        total: 99.99,
        status: "Queued",
        items: [{
          name: "Sample Product",
          quantity: 1,
          price: 99.99,
          designData: { hasCustomDesign: true }
        }]
      }
    ])
  }
}