import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Test connection and get counts
    const productsCount = await db.collection('products').countDocuments()
    const categoriesCount = await db.collection('categories').countDocuments()
    
    // Get first product as sample
    const sampleProduct = await db.collection('products').findOne()
    
    return NextResponse.json({
      status: 'connected',
      database: db.databaseName,
      counts: {
        products: productsCount,
        categories: categoriesCount
      },
      sampleProduct: sampleProduct ? {
        id: sampleProduct._id,
        name: sampleProduct.name,
        hasId: !!sampleProduct._id
      } : null,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    }, { status: 500 })
  }
}