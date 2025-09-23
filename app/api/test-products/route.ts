import { NextResponse } from "next/server"

// Mock products for testing
const mockProducts: any[] = []

export async function GET() {
  console.log("Test products endpoint called")

  // Return empty array - all products removed
  return NextResponse.json(mockProducts)
}