export interface TemplateDocument {
  _id?: string
  id: string
  name: string
  image: string
  price: number | "free"
  category: string
  canvasJSON?: any // Fabric.js canvas JSON data
  createdAt?: Date
  updatedAt?: Date
}

export interface Template {
  id: string
  name: string
  image: string
  price: number | "free"
  category: string
  canvasJSON?: any // Fabric.js canvas JSON data
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateTemplateData {
  name: string
  image: string
  price: number | "free"
  category: string
  canvasJSON?: any // Fabric.js canvas JSON data
}

export interface UpdateTemplateData {
  id: string
  name?: string
  image?: string
  price?: number | "free"
  category?: string
  canvasJSON?: any // Fabric.js canvas JSON data
} 