import type { ObjectId } from "mongodb"

export interface FavoriteDocument {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  categoryId: string
  appliedDesignId?: ObjectId | null
  createdAt: Date
}

