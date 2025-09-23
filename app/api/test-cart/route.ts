import { NextResponse } from "next/server"

export async function GET() {
  // Return a test response to verify the cart system
  return NextResponse.json({
    message: "Cart system is working",
    testProduct: null
  })
}