import { getDatabase } from "../mongodb"
import { ObjectId } from "mongodb"

// WORKAROUND: Use findOne with skip instead of cursors since cursors hang
export async function getProductsWorkaround(limit: number = 20) {
  const db = await getDatabase()
  const collection = db.collection('products')

  console.log('[Workaround] Fetching products using findOne with skip...')

  // Get total count (this works)
  const total = await collection.countDocuments({})
  console.log('[Workaround] Total products:', total)

  // Fetch products one by one using findOne with skip
  const products = []
  const actualLimit = Math.min(limit, total)

  for (let i = 0; i < actualLimit; i++) {
    const product = await collection.findOne({}, { skip: i })
    if (product) {
      products.push(product)
    }
  }

  console.log('[Workaround] Fetched', products.length, 'products')
  return { products, total }
}
