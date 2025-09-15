import { NextRequest, NextResponse } from "next/server"
import { SiteConfigurationService } from "@/lib/services/siteConfigurationService"
import { ProductService } from "@/lib/services/productService"

export async function GET(request: NextRequest) {
  try {
    const configuration = await SiteConfigurationService.getConfiguration("homepage")
    
    if (!configuration || !configuration.customSections) {
      return NextResponse.json({ sections: [] })
    }
    
    // Fetch actual product data for each custom section
    const sectionsWithProducts = await Promise.all(
      configuration.customSections
        .filter(section => section.enabled)
        .map(async (section) => {
          const productPromises = section.products.map(async (p) => {
            const product = await ProductService.getProductById(p.productId)
            return product ? {
              ...product,
              order: p.order
            } : null
          })
          
          const products = (await Promise.all(productPromises))
            .filter(Boolean)
            .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
          
          return {
            ...section,
            products
          }
        })
    )
    
    return NextResponse.json({ sections: sectionsWithProducts })
  } catch (error) {
    console.error("Error fetching custom sections:", error)
    return NextResponse.json(
      { error: "Failed to fetch custom sections" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { customSections } = body
    
    // TODO: Add authentication check here
    // const session = await getSession(request)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    
    // Validate that products exist in each section
    const validatedSections = await Promise.all(
      customSections.map(async (section: any) => {
        const validProducts = []
        for (const p of section.products) {
          const product = await ProductService.getProductById(p.productId)
          if (product) {
            validProducts.push(p)
          }
        }
        return {
          ...section,
          products: validProducts
        }
      })
    )
    
    const configuration = await SiteConfigurationService.updateConfiguration(
      "homepage",
      { customSections: validatedSections },
      "admin" // TODO: Use actual user ID from session
    )
    
    return NextResponse.json({ customSections: configuration.customSections })
  } catch (error) {
    console.error("Error updating custom sections:", error)
    return NextResponse.json(
      { error: "Failed to update custom sections" },
      { status: 500 }
    )
  }
}