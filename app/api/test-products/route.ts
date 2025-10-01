import { NextResponse } from "next/server"

// Mock products for testing
const mockProducts = [
  {
    id: "1",
    name: "Premium Business Flyers",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    categoryId: "flyers",
    description: "High-quality full-color flyers perfect for marketing campaigns",
    inStock: true,
  },
  {
    id: "2",
    name: "Custom T-Shirt",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    categoryId: "apparel",
    description: "Premium cotton t-shirt with custom print",
    inStock: true,
  },
  {
    id: "3",
    name: "Premium Business Cards",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    categoryId: "business-cards",
    description: "Professional business cards with premium finish",
    inStock: true,
  },
  {
    id: "4",
    name: "Custom Die-Cut Stickers",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80",
    categoryId: "stickers",
    description: "Durable vinyl stickers in custom shapes",
    inStock: true,
  },
  {
    id: "5",
    name: "Window Decals",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80",
    categoryId: "decals",
    description: "Weather-resistant window decals",
    inStock: true,
  },
  {
    id: "6",
    name: "Custom Mugs",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?w=600&q=80",
    categoryId: "promotional-items",
    description: "Ceramic mugs with custom print",
    inStock: true,
  }
]

export async function GET() {
  console.log("Test products endpoint called")
  
  // Return mock products immediately without database
  return NextResponse.json(mockProducts)
}