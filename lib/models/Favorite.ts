import type { ObjectId } from "mongodb"

export interface FavoriteDocument {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  categoryId: string
  appliedDesignId?: ObjectId | null
  /** Optional composed preview (product + design) */
  preview?: string | null
  createdAt: Date
}

