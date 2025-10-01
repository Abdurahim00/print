import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[API /products/[id]] GET request for product ID:", params.id)
    console.log("[API /products/[id]] ID length:", params.id.length)
    console.log("[API /products/[id]] ID type:", typeof params.id)
    
    const product = await ProductService.getProductById(params.id)
    if (!product) {
      // If ID is 23 chars, suggest the correct one might have one more character
      if (params.id.length === 23) {
        console.log("ID is 23 chars, might be missing last character. Try adding 0-9 or a-f at the end")
      }
      return NextResponse.json({ 
        error: "Product not found",
        receivedId: params.id,
        idLength: params.id.length,
        hint: params.id.length === 23 ? "ID appears to be missing 1 character" : null
      }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productData = await request.json()
    // Accept hasVariations and variations in the body
    const updatedProduct = await ProductService.updateProduct(params.id, productData)
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await ProductService.deleteProduct(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
