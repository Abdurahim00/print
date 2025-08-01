export interface User {
  id: string
  email: string
  role: "user" | "admin" | "operations"
  customerNumber: string
  fullName?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  description?: string
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string // This is the orderId from MongoDB
  customer: string // customerNumber
  date: string
  total: number
  status: "Queued" | "Printing" | "In Production" | "Shipped" | "Completed"
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingOption: "standard" | "express"
  paymentMethod: "card" | "swish" | "klarna"
  paymentIntentId?: string
  // Customer information
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerPostalCode?: string
  customerCountry?: string
}

export interface Design {
  id: string // MongoDB _id as string
  name: string
  type: string
  preview: string
  userId: string // User's MongoDB _id as string
  designData: any
  status: "Draft" | "Completed" | "In Review"
}

export interface ProductCategory {
  id: string
  name: (t: any) => string
}

export interface Vehicle {
  make: string
  model: string
  svgPath: string
}

export type Language = "en" | "sv"

// This AppState is for Redux, not directly for NextAuth session
export interface AppState {
  user: User | null
  cart: CartItem[]
  language: Language
  products: Product[]
  orders: Order[]
  users: User[]
  designs: Design[]
}
