import { getDatabase } from './mongodb'

let warmupInterval: NodeJS.Timeout | null = null

/**
 * Keep MongoDB connection warm by pinging it every 25 seconds
 * This prevents cold starts on MongoDB Atlas free tier
 */
export function startKeepWarm() {
  if (warmupInterval) return // Already running

  console.log('[KeepWarm] Starting MongoDB connection warmup...')

  // Ping immediately
  pingDatabase()

  // Then ping every 25 seconds
  warmupInterval = setInterval(() => {
    pingDatabase()
  }, 25000)
}

async function pingDatabase() {
  try {
    const db = await getDatabase()
    await db.admin().ping()
    console.log('[KeepWarm] ✅ MongoDB connection alive')
  } catch (error) {
    console.error('[KeepWarm] ❌ Failed to ping MongoDB:', error)
  }
}

export function stopKeepWarm() {
  if (warmupInterval) {
    clearInterval(warmupInterval)
    warmupInterval = null
    console.log('[KeepWarm] Stopped MongoDB connection warmup')
  }
}
