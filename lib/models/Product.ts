import type { ObjectId } from "mongodb"

export interface ProductDocument {
  _id?: ObjectId
  name: string
  price: number
  image: string
  categoryId: string
  description?: string
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  description?: string
  inStock: boolean
  createdAt?: Date
  updatedAt?: Date
}
