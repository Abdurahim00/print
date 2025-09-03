"use client"

import type { Product } from "@/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { translations, productCategories } from "@/lib/constants"
import { getProductImage } from "@/lib/utils/product-image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, memo, useState, useEffect } from "react"
// import { ProductImage } from "@/components/ui/optimized-image"
import { composeProductAndDesign } from "@/lib/utils/imageCompose"
import { formatSEK } from "@/lib/utils"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { useToast } from "@/hooks/use-toast"
import { SizeSelectionModal } from "./size-selection-modal"
import { QuantityModal } from "./quantity-modal"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"

interface ProductCardProps {
  product: Product
}

function ProductCardComponent({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  const appliedCategoryDesigns = useAppSelector((s: any) => s.app.appliedCategoryDesigns || {})
  const designs = useAppSelector((s: any) => s.designs.items)
  const activeCoupon = useAppSelector((s: any) => s.coupons.activeCoupon)
  const allCategories = useAppSelector((s: any) => s.categories.categories)

  // Ensure categories are loaded
  useEffect(() => {
    if (allCategories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, allCategories.length])

  const handleDesignThisProduct = () => {
    router.push(`/design-tool?productId=${product.id}`)
  }

  const handleAddToCart = () => {
    console.log('Add to cart clicked for product:', product)
    console.log('Category:', product.categoryId, 'Has variations:', product.hasVariations)
    
    try {
      // For now, just add directly to cart to test if button works
      dispatch(addToCart(product))
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      })
      
      // Uncomment below to use modals when they're working
      /*
      // Check if product needs size selection (apparel or has variations)
      if (product.categoryId === 'apparel' || product.hasVariations) {
        console.log('Opening size modal')
        setSizeModalOpen(true)
      } else {
        console.log('Opening quantity modal')
        setQuantityModalOpen(true)
      }
      */
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    }
  }

  const categoryName = useMemo(() => {
    const fromStore = (allCategories || []).find((c: any) => c.id === product.categoryId)
    if (fromStore?.name) return fromStore.name
    const fromConstants = productCategories.find((c) => c.id === product.categoryId)?.name(t)
    return fromConstants || product.categoryId
  }, [allCategories, product.categoryId, t])

  // Check if product is customizable based on category
  const isCustomizable = useMemo(() => {
    const category = allCategories.find((c: any) => c.id === product.categoryId)
    // Debug logging
    if (product.name.toLowerCase().includes('giveaway') || category?.name?.toLowerCase().includes('giveaway')) {
      console.log('Giveaway product check:', {
        productName: product.name,
        categoryId: product.categoryId,
        category: category,
        designableAreas: category?.designableAreas,
        hasDesignableAreas: category?.designableAreas && category.designableAreas.length > 0
      })
    }
    return category?.designableAreas && category.designableAreas.length > 0
  }, [allCategories, product.categoryId])

  // Resolve category-level applied design (set by "Preview on other products" from designs tab)
  const appliedDesignForCategory = useMemo(() => {
    const mappedId = appliedCategoryDesigns[product.categoryId]
    if (!mappedId) return null
    return designs.find((d: any) => d.id === mappedId) || null
  }, [appliedCategoryDesigns, product.categoryId, designs])

  return (
    <Card className={`overflow-hidden group transition-all duration-300 flex flex-col h-full border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl ${
      product.inStock ? 'hover:scale-102 sm:hover:scale-105' : 'opacity-60'
    }`}>
      <Link 
        href={`/product/${product.id}${searchParams.toString() ? `?from=${encodeURIComponent(searchParams.toString())}` : ''}`} 
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 cursor-pointer"
      >
        {/* Loading skeleton while image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        
        <img
          src={imageError ? "/placeholder.jpg" : getProductImage(product)}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-contain p-2 bg-gray-50 group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Try to fallback to placeholder if image fails
            const target = e.target as HTMLImageElement
            if (target.src !== '/placeholder.jpg') {
              target.src = '/placeholder.jpg'
            }
            setImageError(true)
            setImageLoaded(true)
          }}
        />
        {appliedDesignForCategory && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-10" />
            {(() => {
              const overlaySrc = appliedDesignForCategory?.designData?.canvasData || appliedDesignForCategory?.preview
              const overlayScale = appliedDesignForCategory?.designData?.overlay?.scale ?? 0.6
              return (
                <img
                  src={overlaySrc || "/placeholder.svg"}
                  alt="Applied design overlay"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 object-contain"
                  style={{
                    width: `${overlayScale * 100}%`,
                    height: "auto",
                    filter: "saturate(1.05)",
                    mixBlendMode: "normal",
                  }}
                />
              )
            })()}
          </>
        )}
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <span className="text-white font-black uppercase text-lg bg-red-500 px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between border-t-2 border-black dark:border-white">
        <div>
          <h3 className="font-black text-xs sm:text-sm lg:text-base uppercase text-black dark:text-white line-clamp-2">{product.name}</h3>
          <p className="text-[10px] sm:text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mt-1">{categoryName}</p>
        </div>
        <div className="mt-3">
          {activeCoupon && activeCoupon.discountType === "percentage" && product.eligibleForCoupons ? (
            <div>
              <span className="text-base sm:text-xl lg:text-2xl font-black text-black dark:text-white">
                {formatSEK(product.price * (1 - activeCoupon.discountValue / 100))}
              </span>
              <span className="text-gray-400 line-through text-[10px] sm:text-xs lg:text-sm ml-1 sm:ml-2">{formatSEK(product.price)}</span>
            </div>
          ) : (
            <p className="text-base sm:text-xl lg:text-2xl font-black text-black dark:text-white">
              {formatSEK(product.price)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 sm:p-3 lg:p-4 pt-0 border-t-2 border-black dark:border-white">
        <div className="flex gap-1.5 sm:gap-2 w-full">
          <Button
            className={`${isCustomizable ? 'flex-1' : 'w-full'} min-h-[44px] sm:min-h-[40px] lg:min-h-[44px] bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase text-[11px] sm:text-xs lg:text-sm transition-all flex items-center justify-center px-2 sm:px-3 touch-manipulation`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 mr-1 sm:mr-0 lg:mr-1 flex-shrink-0" />
            <span className="truncate">Add to Cart</span>
          </Button>
          {isCustomizable && (
            <Button
              className="w-[44px] sm:w-[40px] lg:w-[44px] min-h-[44px] sm:min-h-[40px] lg:min-h-[44px] border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center p-0 touch-manipulation"
              onClick={handleDesignThisProduct}
              disabled={!product.inStock}
              title="Design this product"
            >
              <Palette className="h-5 w-5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </Button>
          )}
        </div>
      </CardFooter>
      
      {/* Size Selection Modal */}
      <SizeSelectionModal
        open={sizeModalOpen}
        onOpenChange={setSizeModalOpen}
        product={product}
      />
      
      {/* Quantity Modal */}
      <QuantityModal
        open={quantityModalOpen}
        onOpenChange={setQuantityModalOpen}
        product={product}
      />
    </Card>
  )
}

export const ProductCard = memo(ProductCardComponent)
