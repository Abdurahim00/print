import { NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Mock products for testing - same as in parent route
const mockProducts = [
  {
    id: "1",
    name: "Premium Business Flyers",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    categoryId: "flyers",
    description: "High-quality full-color flyers perfect for marketing campaigns",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "2",
    name: "Custom T-Shirt",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    categoryId: "apparel",
    description: "Premium cotton t-shirt with custom print",
    inStock: true,
    hasVariations: true,
    variations: [
      {
        id: "v1",
        color: { name: "Black", hex_code: "#000000" },
        images: [
          { angle: "front", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
          { angle: "back", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" }
        ],
        price: 19.99
      },
      {
        id: "v2",
        color: { name: "White", hex_code: "#FFFFFF" },
        images: [
          { angle: "front", url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80" },
          { angle: "back", url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80" }
        ],
        price: 19.99
      }
    ],
  },
  {
    id: "3",
    name: "Premium Business Cards",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    categoryId: "business-cards",
    description: "Professional business cards with premium finish",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "4",
    name: "Custom Die-Cut Stickers",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80",
    categoryId: "stickers",
    description: "Durable vinyl stickers in custom shapes",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "5",
    name: "Window Decals",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80",
    categoryId: "decals",
    description: "Weather-resistant window decals",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "6",
    name: "Custom Hoodies",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    categoryId: "apparel",
    description: "Comfortable hoodies with custom designs",
    inStock: true,
    hasVariations: true,
    variations: [
      {
        id: "v3",
        color: { name: "Navy", hex_code: "#000080" },
        images: [
          { angle: "front", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80" },
          { angle: "back", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80" }
        ],
        price: 39.99
      }
    ],
  },
  {
    id: "7",
    name: "Yard Signs",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    categoryId: "signs",
    description: "Durable yard signs for outdoor advertising",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "8",
    name: "Rollup Banners",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1550684848-86a5d8727436?w=600&q=80",
    categoryId: "banners",
    description: "Professional retractable banners for events",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "9",
    name: "Custom Mugs",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    categoryId: "promotional",
    description: "Ceramic mugs with custom prints",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
  {
    id: "10",
    name: "Event Posters",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1527004889751-c2ff39dc8b20?w=600&q=80",
    categoryId: "posters",
    description: "Large format posters for events and promotions",
    inStock: true,
    hasVariations: false,
    variations: [],
  },
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Test product by ID endpoint called, ID:', params.id)
  
  // Find the product by ID
  const product = mockProducts.find(p => p.id === params.id)
  
  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }
  
  // Return the product with additional fields that might be needed
  return NextResponse.json({
    ...product,
    type: product.categoryId,
    baseColor: product.hasVariations && product.variations.length > 0 
      ? product.variations[0].color.hex_code 
      : "#000000",
    colors: product.hasVariations 
      ? product.variations.map(v => v.color.hex_code)
      : [],
    angles: product.hasVariations && product.variations.length > 0
      ? Array.from(new Set(product.variations[0].images.map(img => img.angle)))
      : ["front"],
  })
}