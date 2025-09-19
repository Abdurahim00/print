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
    
    if (!configuration || !configuration.bestSellers || !configuration.bestSellers.length) {
      // If no best sellers configured, return most recent products
      const { products } = await ProductService.getPaginatedProducts({
        limit: 10,
        sortBy: "featured"
      })
      return NextResponse.json({ products })
    }
    
    // Fetch actual product data for best sellers
    const productPromises = configuration.bestSellers.map(async (bs) => {
      const product = await ProductService.getProductById(bs.productId)
      return product ? {
        ...product,
        order: bs.order
      } : null
    })
    
    const products = (await Promise.all(productPromises))
      .filter(Boolean)
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching best sellers:", error)
    return NextResponse.json(
      { error: "Failed to fetch best sellers" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { bestSellers } = body
    
    // TODO: Add authentication check here
    // const session = await getSession(request)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    
    // Validate that products exist
    const validProducts = []
    for (const bs of bestSellers) {
      const product = await ProductService.getProductById(bs.productId)
      if (product) {
        validProducts.push(bs)
      }
    }
    
    const configuration = await SiteConfigurationService.updateConfiguration(
      "homepage",
      { bestSellers: validProducts },
      "admin" // TODO: Use actual user ID from session
    )
    
    return NextResponse.json({ bestSellers: configuration.bestSellers })
  } catch (error) {
    console.error("Error updating best sellers:", error)
    return NextResponse.json(
      { error: "Failed to update best sellers" },
      { status: 500 }
    )
  }
}