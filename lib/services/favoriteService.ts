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
  preview: (doc as any).preview || null,
  createdAt: doc.createdAt,
})

export async function addFavorite(userId: string, productId: string, categoryId: string, preview?: string | null): Promise<Favorite> {
  const db = await getDatabase()
  const col = db.collection<FavoriteDocument>(COLLECTION)
  const existing = await col.findOne({ userId: new ObjectId(userId), productId: new ObjectId(productId) })
  if (existing) return toFavorite(existing)
  // Determine if this category already has an applied design for this user
  // 1) Prefer any existing favorite in this category with an applied design
  const existingWithApplied = await col.findOne(
    { userId: new ObjectId(userId), categoryId, appliedDesignId: { $ne: null } },
    { sort: { createdAt: -1 } as any },
  )

  let appliedDesignObjectId: ObjectId | null = existingWithApplied?.appliedDesignId ?? null

  // 2) If none found, fallback to the user's most recent saved design in this category
  if (!appliedDesignObjectId) {
    try {
      const designsCol = db.collection("designs")
      const latestCategoryDesign = await designsCol.findOne(
        { userId, "designData.product.categoryId": categoryId },
        { sort: { updatedAt: -1 } },
      )
      if (latestCategoryDesign?._id) {
        appliedDesignObjectId = latestCategoryDesign._id as ObjectId
      }
    } catch (e) {
      // Non-fatal; leave appliedDesignObjectId as null
      console.warn("[favoriteService] Failed to resolve latest category design for auto-apply", e)
    }
  }

  const doc: FavoriteDocument = {
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
    categoryId,
    appliedDesignId: appliedDesignObjectId ?? null,
    preview: preview || null,
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

