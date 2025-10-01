import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    const products = await db.collection("products").find({}).limit(10).toArray()
    
    return NextResponse.json({
      products: products.map(p => ({
        _id: p._id?.toString(),
        id: p.id,
        name: p.name,
        url: `/product/${p._id?.toString()}`
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}