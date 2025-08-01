import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

export async function GET() {
  try {
    const products = await ProductService.getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    const newProduct = await ProductService.createProduct({
      ...productData,
      inStock: true,
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
