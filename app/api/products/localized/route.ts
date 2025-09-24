import { NextRequest, NextResponse } from "next/server"
import { ProductService } from "@/lib/services/productService"
import { getLocalizedProduct } from "@/lib/utils/translations"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get("categoryId")
    const search = searchParams.get("search")
    const subcategoryId = searchParams.get("subcategoryId")
    const locale = searchParams.get("locale") || "en"
    
    const options = {
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
      search: search || undefined,
    }
    
    const products = await ProductService.getProducts(options)
    
    // Localize all products
    const localizedProducts = products.map(product => 
      getLocalizedProduct(product, locale)
    )
    
    return NextResponse.json(localizedProducts)
  } catch (error) {
    console.error("Error fetching localized products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}