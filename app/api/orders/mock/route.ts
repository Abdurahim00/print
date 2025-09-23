import { NextResponse } from "next/server"

// Mock orders for testing when database is slow
export async function GET() {
  const mockOrders: any[] = []

  // Return empty array - all mock data removed
  return NextResponse.json(mockOrders)
}