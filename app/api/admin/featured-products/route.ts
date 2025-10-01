import { NextRequest, NextResponse } from "next/server"
import { SiteConfigurationService } from "@/lib/services/siteConfigurationService"
import { SiteConfigurationFileService } from "@/lib/services/siteConfigurationFileService"
import { ProductService } from "@/lib/services/productService"

// Check if MongoDB is available
async function isMongoAvailable(): Promise<boolean> {
  try {
    const { MongoClient } = require('mongodb')
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 })
    await client.connect()
    await client.close()
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    // Try MongoDB first, fallback to file system
    const mongoAvailable = await isMongoAvailable()
    
    let configuration
    if (mongoAvailable) {
      configuration = await SiteConfigurationService.getConfiguration("homepage")
    } else {
      configuration = await SiteConfigurationFileService.getConfiguration("homepage")
    }
    
    if (!configuration || !configuration.featuredProducts || !configuration.featuredProducts.length) {
      return NextResponse.json({ products: [] })
    }
    
    // Fetch actual product data for featured products
    const productPromises = configuration.featuredProducts.map(async (fp) => {
      const product = await ProductService.getProductById(fp.productId)
      return product ? {
        ...product,
        order: fp.order,
        badge: fp.badge,
        badgeColor: fp.badgeColor
      } : null
    })
    
    const products = (await Promise.all(productPromises)).filter(Boolean)
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { featuredProducts } = body
    
    // TODO: Add authentication check here
    // const session = await getSession(request)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    
    // Validate that products exist
    const validProducts = []
    for (const fp of featuredProducts) {
      const product = await ProductService.getProductById(fp.productId)
      if (product) {
        validProducts.push(fp)
      }
    }
    
    const configuration = await SiteConfigurationService.updateConfiguration(
      "homepage",
      { featuredProducts: validProducts },
      "admin" // TODO: Use actual user ID from session
    )
    
    return NextResponse.json({ featuredProducts: configuration.featuredProducts })
  } catch (error) {
    console.error("Error updating featured products:", error)
    return NextResponse.json(
      { error: "Failed to update featured products" },
      { status: 500 }
    )
  }
}