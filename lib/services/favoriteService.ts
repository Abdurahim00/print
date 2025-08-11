import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Favorite } from "@/types"
import type { FavoriteDocument } from "@/lib/models/Favorite"

const COLLECTION = "favorites"

const toFavorite = (doc: FavoriteDocument): Favorite => ({
  id: doc._id!.toString(),
  userId: doc.userId.toString(),
  productId: doc.productId.toString(),
  categoryId: doc.categoryId,
  appliedDesignId: doc.appliedDesignId ? doc.appliedDesignId.toString() : null,
  createdAt: doc.createdAt,
})

export async function addFavorite(userId: string, productId: string, categoryId: string): Promise<Favorite> {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  const existing = await col.findOne({ userId: new ObjectId(userId), productId: new ObjectId(productId) })
  if (existing) return toFavorite(existing)
  const doc: FavoriteDocument = {
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
    categoryId,
    appliedDesignId: null,
    createdAt: new Date(),
  }
  const res = await col.insertOne(doc)
  const inserted = await col.findOne({ _id: res.insertedId })
  return toFavorite(inserted!)
}

export async function removeFavorite(userId: string, productId: string): Promise<boolean> {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  const res = await col.deleteOne({ userId: new ObjectId(userId), productId: new ObjectId(productId) })
  return res.deletedCount === 1
}

export async function listFavorites(userId: string): Promise<Favorite[]> {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  const docs = await col.find({ userId: new ObjectId(userId) }).toArray()
  return docs.map(toFavorite)
}

export async function applyDesignToCategoryFavorites(userId: string, categoryId: string, designId: string) {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  console.log("🔥 [favoriteService] applyDesignToCategoryFavorites", { userId, categoryId, designId })
  await col.updateMany(
    { userId: new ObjectId(userId), categoryId },
    { $set: { appliedDesignId: new ObjectId(designId) } }
  )
}

export async function clearDesignFromCategoryFavorites(userId: string, categoryId: string) {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  console.log("🔥 [favoriteService] clearDesignFromCategoryFavorites", { userId, categoryId })
  await col.updateMany(
    { userId: new ObjectId(userId), categoryId },
    { $set: { appliedDesignId: null } }
  )
}

export async function setDesignForFavorite(userId: string, productId: string, designId?: string | null) {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  console.log("🔥 [favoriteService] setDesignForFavorite", { userId, productId, designId })
  await col.updateOne(
    { userId: new ObjectId(userId), productId: new ObjectId(productId) },
    { $set: { appliedDesignId: designId ? new ObjectId(designId) : null } }
  )
}

