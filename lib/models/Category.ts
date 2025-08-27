import type { ObjectId } from "mongodb"

export interface CategoryDocument {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Design capabilities
  isDesignable?: boolean
  designableAreas?: string[] // ['front', 'back', 'sleeve', 'chest', 'wrap']
  designTechniques?: string[] // ['print', 'embroidery', 'sublimation', 'engraving']
}

export interface SubcategoryDocument {
  _id?: ObjectId
  categoryId: ObjectId
  name: string
  slug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Design capabilities (can override parent category)
  isDesignable?: boolean
  designableAreas?: string[]
  designTechniques?: string[]
  inheritDesignSettings?: boolean // If true, use parent category's design settings
}

