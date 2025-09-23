export interface TemplateDocument {
  _id?: string
  id: string
  name: string
  description?: string
  image: string  // Legacy field for backward compatibility
  previewImage?: string  // New field for template preview
  canvasJSON?: string  // Fabric.js canvas JSON data
  price: number | "free"
  category: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Template {
  id: string
  name: string
  description?: string
  image: string  // Legacy field for backward compatibility
  previewImage?: string  // New field for template preview
  canvasJSON?: string  // Fabric.js canvas JSON data
  price: number | "free"
  category: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateTemplateData {
  name: string
  description?: string
  image: string
  previewImage?: string
  canvasJSON?: string
  price: number | "free"
  category: string
  isActive?: boolean
}

export interface UpdateTemplateData {
  id: string
  name?: string
  description?: string
  image?: string
  previewImage?: string
  canvasJSON?: string
  price?: number | "free"
  category?: string
  isActive?: boolean
} 