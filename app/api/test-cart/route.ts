import { NextResponse } from "next/server"

export async function GET() {
  // Return a test response to verify the cart system
  return NextResponse.json({
    message: "Cart system is working",
    testProduct: {
      id: "test-1",
      name: "Test Product",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      categoryId: "apparel",
      description: "Test product for cart",
      inStock: true,
    }
  })
}