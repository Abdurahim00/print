import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

const options = {
  // Connection timeouts
  serverSelectionTimeoutMS: 30000, // Increased to 30 seconds for Atlas cold starts
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,

  // Connection pooling - reuse connections efficiently
  maxPoolSize: 10, // Max 10 connections in pool
  minPoolSize: 2,  // Keep 2 connections always ready
  maxIdleTimeMS: 30000, // Keep connections alive for 30s

  // Retry logic
  retryWrites: true,
  retryReads: true,

  // Compression to reduce network payload
  compressors: ['zlib'],
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export async function getDatabase(): Promise<Db> {
  const start = Date.now()
  console.log('[MongoDB] ⏱️ Getting database connection...')
  const client = await clientPromise
  const db = client.db("printwrap-pro")
  const connectionTime = Date.now() - start
  console.log(`[MongoDB] ⏱️ Database connection took ${connectionTime}ms`)
  return db
}
