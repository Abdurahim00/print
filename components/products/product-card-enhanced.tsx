"use client"

import type { Product, Variation, VariationImage } from "@/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"
import { getProductImage } from "@/lib/utils/product-image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/ui/product-image"
import { Palette, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, memo, useState, useEffect } from "react"
import { useCurrency } from "@/contexts/CurrencyContext"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { useToast } from "@/hooks/use-toast"
import { SizeSelectionModal } from "./size-selection-modal"
import { QuantityModal } from "./quantity-modal"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"

interface ProductCardEnhancedProps {
  product: Product
}

function ProductCardEnhancedComponent({ product }: ProductCardEnhancedProps) {
  const { formatPrice } = useCurrency()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [sizeModalOpen, setSizeModalOpen] = useState(false)
  const [quantityModalOpen, setQuantityModalOpen] = useState(false)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  
  // Variation and angle states
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null)
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0)
  const [currentImage, setCurrentImage] = useState<string>("")
  const [isHovering, setIsHovering] = useState(false)
  
  const appliedCategoryDesigns = useAppSelector((s: any) => s.app.appliedCategoryDesigns || {})
  const designs = useAppSelector((s: any) => s.designs.items)
  const activeCoupon = useAppSelector((s: any) => s.coupons.activeCoupon)
  const allCategories = useAppSelector((s: any) => s.categories.categories)

  // Initialize variation and images
  useEffect(() => {
    if (product.hasVariations && product.variations && product.variations.length > 0) {
      // Select first variation by default
      setSelectedVariation(product.variations[0])
    }
  }, [product])

  // Get available images for current state
  const availableImages = useMemo(() => {
    const images: string[] = []
    
    if (selectedVariation && selectedVariation.images && selectedVariation.images.length > 0) {
      // Use variation images if available
      selectedVariation.images.forEach((img: VariationImage) => {
        if (img.url) images.push(img.url)
      })
    } else if (product.hasVariations && product.variations && product.variations.length > 0) {
      // Use first variation's images as fallback
      const firstVar = product.variations[0]
      if (firstVar.images && firstVar.images.length > 0) {
        firstVar.images.forEach((img: VariationImage) => {
          if (img.url) images.push(img.url)
        })
      }
    } else {
      // Use product angle images
      if (product.frontImage) images.push(product.frontImage)
      if (product.backImage) images.push(product.backImage)
      if (product.leftImage) images.push(product.leftImage)
      if (product.rightImage) images.push(product.rightImage)
      if (product.materialImage) images.push(product.materialImage)
    }
    
    // Fallback to main image or placeholder
    if (images.length === 0) {
      const mainImage = getProductImage(product)
      if (mainImage) images.push(mainImage)
    }
    
    return images
  }, [product, selectedVariation])

  // Update current image when angle changes
  useEffect(() => {
    if (availableImages.length > 0) {
      setCurrentImage(availableImages[Math.min(currentAngleIndex, availableImages.length - 1)])
    }
  }, [availableImages, currentAngleIndex])

  // Ensure categories are loaded
  useEffect(() => {
    if (allCategories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, allCategories.length])

  const handleDesignThisProduct = () => {
    const productId = (product as any)._id || product.id
    const params = new URLSearchParams()
    params.set('productId', productId)
    
    // Pass selected variation if any
    if (selectedVariation) {
      params.set('variationId', selectedVariation.id)
      if (selectedVariation.color) {
        params.set('color', selectedVariation.color.hex_code)
      }
    }
    
    router.push(`/design-tool?${params.toString()}`)
  }

  const handleAddToCart = () => {
    try {
      const cartItem = {
        ...product,
        selectedVariation: selectedVariation || undefined,
        // Include the current display image for cart
        cartImage: currentImage || getProductImage(product)
      }
      
      // Check if product needs size selection
      if (product.categoryId === 'apparel' || product.hasVariations) {
        setSizeModalOpen(true)
      } else {
        dispatch(addToCart(cartItem))
        toast({
          title: t.addedToCart,
          description: `${product.name} ${t.hasBeenAddedToCart}`,
        })
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: t.error,
        description: t.failedToAddItem,
        variant: "destructive"
      })
    }
  }

  const handleNextAngle = () => {
    if (availableImages.length > 1) {
      setCurrentAngleIndex((prev) => (prev + 1) % availableImages.length)
    }
  }

  const handlePrevAngle = () => {
    if (availableImages.length > 1) {
      setCurrentAngleIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length)
    }
  }

  const handleVariationSelect = (variation: Variation) => {
    setSelectedVariation(variation)
    setCurrentAngleIndex(0) // Reset angle when variation changes
  }

  const categoryName = useMemo(() => {
    const fromStore = (allCategories || []).find((c: any) => c.id === product.categoryId)
    if (fromStore?.name) return fromStore.name
    return product.categoryId
  }, [allCategories, product.categoryId])

  // Check if product is customizable
  const isCustomizable = useMemo(() => {
    const category = allCategories.find((c: any) => c.id === product.categoryId)
    if (product.isDesignable === true) return true
    if (category?.isDesignable === true) return true
    return category?.designableAreas && category.designableAreas.length > 0
  }, [allCategories, product.categoryId, product.isDesignable])

  // Get current price (may vary by variation)
  const currentPrice = selectedVariation?.price || product.price

  return (
    <Card className={`overflow-hidden group transition-all duration-300 flex flex-col h-full border border-black sm:border-2 dark:border-white bg-white dark:bg-gray-900 rounded-lg ${
      product.inStock ? 'hover:scale-102' : 'opacity-60'
    }`}>
      <div 
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Link 
          href={`/product/${(product as any)._id || product.id}${searchParams.toString() ? `?from=${encodeURIComponent(searchParams.toString())}` : ''}`} 
          className="relative w-full h-full block"
        >
          <ProductImage
            src={currentImage || getProductImage(product)}
            alt={`${product.name} - ${selectedVariation?.color?.name || 'Default'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-2 bg-gray-50 transition-transform duration-500"
            loading="lazy"
            quality={85}
          />
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
              <span className="text-white font-black uppercase text-lg bg-red-500 px-4 py-2 rounded-lg">
                {t.outOfStock}
              </span>
            </div>
          )}
        </Link>
        
        {/* Angle Navigation - Show on hover if multiple images */}
        {availableImages.length > 1 && isHovering && (
          <>
            <button
              onClick={handlePrevAngle}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 rounded-full p-1 z-20 hover:scale-110 transition-transform"
              aria-label="Previous angle"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextAngle}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 rounded-full p-1 z-20 hover:scale-110 transition-transform"
              aria-label="Next angle"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Angle indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {availableImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentAngleIndex 
                      ? 'bg-black dark:bg-white w-3' 
                      : 'bg-black/30 dark:bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Variation Color Swatches */}
      {product.hasVariations && product.variations && product.variations.length > 1 && (
        <div className="px-2 sm:px-3 pt-1.5 sm:pt-2 flex gap-1 flex-wrap">
          {product.variations.map((variation: Variation) => (
            <button
              key={variation.id}
              onClick={() => handleVariationSelect(variation)}
              className={`relative w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black sm:border-2 transition-all ${
                selectedVariation?.id === variation.id 
                  ? 'border-black dark:border-white scale-110' 
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              }`}
              title={variation.color?.name || 'Select variant'}
            >
              {variation.color?.swatch_image ? (
                <Image
                  src={variation.color.swatch_image}
                  alt={variation.color.name || ''}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: variation.color?.hex_code || '#ccc' }}
                />
              )}
              {selectedVariation?.id === variation.id && (
                <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white" />
              )}
            </button>
          ))}
        </div>
      )}
      
      <CardContent className="p-2 sm:p-3 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-black text-xs sm:text-sm uppercase text-black dark:text-white line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {selectedVariation?.color?.name && (
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {selectedVariation.color.name}
            </p>
          )}
          <p className="text-[10px] sm:text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mt-1">
            {categoryName}
          </p>
        </div>
        <div className="mt-2 sm:mt-3">
          {activeCoupon && activeCoupon.discountType === "percentage" && product.eligibleForCoupons ? (
            <div>
              <span className="text-base sm:text-lg lg:text-xl font-black text-black dark:text-white">
                {formatPrice(currentPrice * (1 - activeCoupon.discountValue / 100))}
              </span>
              <span className="text-gray-400 line-through text-[10px] sm:text-xs ml-1 sm:ml-2">
                {formatPrice(currentPrice)}
              </span>
            </div>
          ) : (
            <p className="text-base sm:text-lg lg:text-xl font-black text-black dark:text-white">
              {formatPrice(currentPrice)}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 sm:p-3 pt-0 border-t border-black sm:border-t-2 dark:border-white">
        <div className="flex gap-1.5 sm:gap-2 w-full">
          <Button
            className={`${isCustomizable ? 'flex-1' : 'w-full'} min-h-[36px] sm:min-h-[40px] bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase text-[10px] sm:text-xs transition-all px-2 sm:px-3`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3 w-3 mr-0.5 sm:mr-1" />
            <span className="hidden xs:inline">{t.addToCart}</span>
            <span className="xs:hidden">Add</span>
          </Button>
          {isCustomizable && (
            <Button
              className="w-[36px] sm:w-[40px] min-h-[36px] sm:min-h-[40px] border border-black sm:border-2 dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              onClick={handleDesignThisProduct}
              disabled={!product.inStock}
              title={t.designThisProduct}
            >
              <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
      
      {/* Size Selection Modal */}
      <SizeSelectionModal
        open={sizeModalOpen}
        onOpenChange={setSizeModalOpen}
        product={{...product, selectedVariation}}
      />
      
      {/* Quantity Modal */}
      <QuantityModal
        open={quantityModalOpen}
        onOpenChange={setQuantityModalOpen}
        product={{...product, selectedVariation}}
      />
    </Card>
  )
}

export const ProductCardEnhanced = memo(ProductCardEnhancedComponent)