"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: string
  _id?: string
  name: string
  description?: string
  image?: string
  frontImage?: string
  price: number
  designCostPerCm2?: number
}

export default function DesignToolPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if a productId was passed in query params
  const productId = searchParams.get('productId')
  
  useEffect(() => {
    // If productId is provided, redirect to step-based design tool
    if (productId) {
      const locale = window.location.pathname.split('/')[1] || 'en'
      router.push(`/${locale}/design-tool/${productId}/step/1`)
      return
    }
    
    // Otherwise, load products for selection
    const loadProducts = async () => {
      try {
        // Fetch only designable products with higher limit
        const response = await fetch('/api/products?designableOnly=true&limit=500')
        if (!response.ok) throw new Error('Failed to load products')
        
        const data = await response.json()
        // Check if data is an array, if not try data.products
        const productsArray = Array.isArray(data) ? data : (data.products || [])

        // Trust the API to return only designable products
        setProducts(productsArray)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [productId, router])
  
  const handleSelectProduct = (product: Product) => {
    const productId = product._id || product.id
    const locale = window.location.pathname.split('/')[1] || 'en'
    router.push(`/${locale}/design-tool/${productId}/step/1`)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-[300px] mb-4" />
            <Skeleton className="h-6 w-[500px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Palette className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('designTool.noProducts')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('designTool.noProductsDescription')}
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{t('designTool.selectProduct')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('designTool.selectProductDescription')}
          </p>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const productImage = product.frontImage || product.image
            
            return (
              <Card 
                key={product._id || product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectProduct(product)}
              >
                <div className="aspect-square relative bg-gray-100">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Palette className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {product.price} {t('common.currency')}
                    </span>
                    <Button size="sm">
                      <Palette className="mr-2 h-4 w-4" />
                      {t('common.design')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}