import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")
    const db = await getDatabase()
    
    // Try to list collections
    const collections = await db.listCollections().toArray()
    console.log("Collections found:", collections.map(c => c.name))
    
    // Try to count orders
    const ordersCollection = db.collection("orders")
    const count = await ordersCollection.countDocuments({})
    
    return NextResponse.json({
      status: "connected",
      database: db.databaseName,
      collections: collections.map(c => c.name),
      ordersCount: count
    })
  } catch (error: any) {
    console.error("Database test failed:", error)
    return NextResponse.json({
      status: "error",
      message: error.message,
      code: error.code
    }, { status: 500 })
  }
}
