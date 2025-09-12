"use client"

import { ProductsView } from "@/components/products/ProductsView"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category") || undefined
  const subcategorySlug = searchParams.get("subcategory") || undefined
  
  return <ProductsView categorySlug={categorySlug} subcategorySlug={subcategorySlug} />
}
