import { getDatabase } from "@/lib/mongodb"
import type { OrderDocument, Order } from "@/lib/models/Order"

// Simple in-memory cache for active orders
let activeOrdersCache: { data: Order[] | null; timestamp: number } = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 10000 // 10 seconds cache

export class OrderService {
  private static async getCollection() {
    try {
      const db = await getDatabase()
      return db.collection<OrderDocument>("orders")
    } catch (error) {
      console.error("Failed to get database connection:", error)
      throw error
    }
  }

  static async createOrder(orderData: Omit<OrderDocument, "_id" | "createdAt" | "updatedAt">): Promise<Order> {
    const collection = await this.getCollection()

    // Debug: Log the order data being saved
    console.log('🛒 ORDER SERVICE: Saving order to database:', {
      itemsCount: orderData.items?.length || 0,
      items: orderData.items?.map((item: any) => ({
        name: item.name,
        hasDesignsArray: !!(item.designs),
        designsArrayLength: item.designs?.length || 0,
        designs: item.designs
      }))
    })

    const newOrder: OrderDocument = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newOrder)
    
    // Invalidate cache when new order is created
    activeOrdersCache.data = null

      return {
        id: newOrder.orderId, // Use the generated orderId as the public ID
        customer: newOrder.customer,
        date: newOrder.date,
        total: newOrder.total,
        status: newOrder.status,
        items: newOrder.items,
        shippingOption: newOrder.shippingOption,
        paymentMethod: newOrder.paymentMethod,
        paymentIntentId: newOrder.paymentIntentId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        customerAddress: newOrder.customerAddress,
        customerCity: newOrder.customerCity,
        customerPostalCode: newOrder.customerPostalCode,
        customerCountry: newOrder.customerCountry,
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      }
  }

  static async getAllOrders(limit: number = 100, skip: number = 0): Promise<Order[]> {
    try {
      const collection = await this.getCollection()
      // Only fetch recent orders and limit the number
      const orders = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()

      return orders.map((order) => ({
        id: order.orderId,
        customer: order.customer,
        date: order.date,
        total: order.total,
        status: order.status,
        items: order.items,
        shippingOption: order.shippingOption,
        paymentMethod: order.paymentMethod,
        paymentIntentId: order.paymentIntentId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        customerCity: order.customerCity,
        customerPostalCode: order.customerPostalCode,
        customerCountry: order.customerCountry,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Return empty array on error to prevent dashboard from breaking
      return []
    }
  }
  
  static async getActiveOrders(): Promise<Order[]> {
    // Check cache first
    const now = Date.now()
    if (activeOrdersCache.data && (now - activeOrdersCache.timestamp) < CACHE_DURATION) {
      console.log('Returning cached active orders')
      return activeOrdersCache.data
    }
    
    const collection = await this.getCollection()
    // Only fetch non-completed orders for operations dashboard
    const orders = await collection
      .find({ 
        status: { 
          $in: ["Queued", "Printing", "In Production", "Shipped"] 
        } 
      })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 active orders
      .toArray()

    const result = orders.map((order) => ({
      id: order.orderId,
      customer: order.customer,
      date: order.date,
      total: order.total,
      status: order.status,
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        hasCustomDesign: !!item.designData?.hasCustomDesign || !!item.designData?.canvasData,
        // Exclude large design data to reduce payload size
      })),
      shippingOption: order.shippingOption,
      paymentMethod: order.paymentMethod,
      paymentIntentId: order.paymentIntentId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerCity: order.customerCity,
      customerPostalCode: order.customerPostalCode,
      customerCountry: order.customerCountry,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))
    
    // Update cache
    activeOrdersCache = {
      data: result,
      timestamp: now
    }
    
    return result
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const collection = await this.getCollection()
    const order = await collection.findOne({ orderId })

    if (!order) return null

    return {
      id: order.orderId,
      customer: order.customer,
      date: order.date,
      total: order.total,
      status: order.status,
      items: order.items,
      shippingOption: order.shippingOption,
      paymentMethod: order.paymentMethod,
      paymentIntentId: order.paymentIntentId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerCity: order.customerCity,
      customerPostalCode: order.customerPostalCode,
      customerCountry: order.customerCountry,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderDocument["status"]): Promise<Order | null> {
    console.log('OrderService.updateOrderStatus called:', { orderId, status })
    
    // Invalidate cache when order status is updated
    activeOrdersCache.data = null
    
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { orderId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    console.log('MongoDB update result:', result)
    if (!result) return null

    return {
      id: result.orderId,
      customer: result.customer,
      date: result.date,
      total: result.total,
      status: result.status,
      items: result.items,
      shippingOption: result.shippingOption,
      paymentMethod: result.paymentMethod,
      paymentIntentId: result.paymentIntentId,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      customerPhone: result.customerPhone,
      customerAddress: result.customerAddress,
      customerCity: result.customerCity,
      customerPostalCode: result.customerPostalCode,
      customerCountry: result.customerCountry,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  }

  static async deleteOrder(orderId: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ orderId })
    return result.deletedCount > 0
  }
}
