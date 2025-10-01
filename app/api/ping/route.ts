import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// Ping endpoint to keep MongoDB Atlas awake
// Hit this endpoint every 5 minutes to prevent cold starts
export async function GET() {
  try {
    const db = await getDatabase()
    // Simple ping to keep connection alive
    await db.command({ ping: 1 })
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Ping failed:', error)
    return NextResponse.json(
      { status: 'error', error: String(error) },
      { status: 500 }
    )
  }
}