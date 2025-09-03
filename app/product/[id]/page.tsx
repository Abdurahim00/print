import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/products/product-detail-view"

interface ProductPageProps {
  params: {
    id: string
  }
  searchParams: {
    variant?: string
  }
}

// Fetch product data
async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Fetch category data
async function getCategory(categoryId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/categories/${categoryId}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

// Fetch subcategory data
async function getSubcategory(subcategoryId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/subcategories/${subcategoryId}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching subcategory:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }
  
  return {
    title: `${product.name} | MR MERCH`,
    description: product.description || `Shop ${product.name} at MR MERCH. Customize your design or buy as-is.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }
  
  // Fetch category and subcategory data to determine designability
  const category = product.categoryId ? await getCategory(product.categoryId) : null
  const subcategory = product.subcategoryId ? await getSubcategory(product.subcategoryId) : null
  
  // Debug logging
  console.log('🎨 [ProductPage] Design Check:', {
    productId: product.id,
    productName: product.name,
    categoryId: product.categoryId,
    categoryFetched: !!category,
    categoryName: category?.name,
    categoryIsDesignable: category?.isDesignable,
    subcategoryId: product.subcategoryId,
    subcategoryFetched: !!subcategory,
    subcategoryIsDesignable: subcategory?.isDesignable
  })
  
  // Determine if product is designable based on category/subcategory settings
  let isDesignable = false
  
  if (subcategory) {
    // Check subcategory first
    if (subcategory.inheritDesignSettings) {
      isDesignable = category?.isDesignable || false
    } else {
      isDesignable = subcategory.isDesignable || false
    }
  } else if (category) {
    // Fall back to category if no subcategory
    isDesignable = category.isDesignable || false
  }
  
  console.log('🎨 [ProductPage] Final isDesignable:', isDesignable)
  
  return (
    <ProductDetailView 
      product={product}
      category={category}
      subcategory={subcategory}
      isDesignable={isDesignable}
      selectedVariantId={searchParams.variant}
    />
  )
}