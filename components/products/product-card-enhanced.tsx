"use client"

import type { Product, Variation, VariationImage } from "@/types"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"
import { getProductImage, getAllProductImages } from "@/lib/utils/product-image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/ui/product-image"
import { Palette, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, memo, useState, useEffect, useCallback } from "react"
import { useCurrency } from "@/contexts/CurrencyContext"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { useToast } from "@/hooks/use-toast"
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
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  
  // Variation and angle states
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null)
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0)
  const [currentImage, setCurrentImage] = useState<string>("")
  const [isHovering, setIsHovering] = useState(false)
  const [hoverImageIndex, setHoverImageIndex] = useState(0)
  
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

  // Get all product images for hover effect
  const allProductImages = useMemo(() => {
    const images = getAllProductImages(product)
    return images.length > 0 ? images : availableImages
  }, [product, availableImages])

  // Handle mouse hover to cycle through images
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    if (allProductImages.length > 1) {
      setHoverImageIndex(1) // Show second image on hover
    }
  }, [allProductImages.length])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setHoverImageIndex(0) // Back to first image
  }, [])

  // Cycle through images while hovering
  useEffect(() => {
    if (!isHovering || allProductImages.length <= 1) return
    
    const interval = setInterval(() => {
      setHoverImageIndex((prev) => (prev + 1) % allProductImages.length)
    }, 1500) // Change image every 1.5 seconds
    
    return () => clearInterval(interval)
  }, [isHovering, allProductImages.length])

  // Get color variations from product data
  const colorVariations = useMemo(() => {
    const colors: { name: string; hex: string; image?: string; variation?: Variation }[] = []
    
    // Debug to see what we're working with
    console.log('Product color data:', {
      name: product.name,
      hasVariations: product.hasVariations,
      variations: product.variations,
      allKeys: Object.keys(product)
    })
    
    // Get colors from variations (primary source)
    if (product.hasVariations && product.variations && Array.isArray(product.variations)) {
      product.variations.forEach((variation: Variation) => {
        if (variation.color) {
          // Check if this color is already in the list
          const existingColor = colors.find(c => c.name === variation.color.name)
          if (!existingColor) {
            colors.push({
              name: variation.color.name || 'Default',
              hex: variation.color.hex_code || '#808080',
              image: variation.images?.[0]?.url,
              variation: variation
            })
          }
        }
      })
    }
    
    // Check for color_variants field (different data structure)
    if (colors.length === 0 && (product as any).color_variants && Array.isArray((product as any).color_variants)) {
      (product as any).color_variants.forEach((colorVar: any) => {
        if (colorVar.color_name && colorVar.hex_code) {
          colors.push({
            name: colorVar.color_name,
            hex: colorVar.hex_code,
            image: colorVar.image_url || colorVar.images?.[0]
          })
        }
      })
    }
    
    // Check variants field as well (some products use variants instead of variations)
    if (colors.length === 0 && (product as any).variants && Array.isArray((product as any).variants)) {
      (product as any).variants.forEach((variant: any) => {
        if (variant.color) {
          const colorName = variant.color.name || variant.color_name || variant.color
          const hexCode = variant.color.hex_code || variant.hex_code || variant.color_hex
          if (colorName && !colors.find(c => c.name === colorName)) {
            colors.push({
              name: colorName,
              hex: hexCode || '#808080',
              image: variant.images?.[0]?.url || variant.image_url
            })
          }
        }
      })
    }
    
    // If no variations but product has a colors array (fallback for different data structures)
    if (colors.length === 0 && (product as any).colors && Array.isArray((product as any).colors)) {
      (product as any).colors.forEach((color: any) => {
        const colorName = color.name || color.color_name
        const hexCode = color.hex || color.hex_code || color.color_hex
        if (colorName && hexCode) {
          colors.push({
            name: colorName,
            hex: hexCode,
            image: color.images?.[0] || color.image || color.image_url
          })
        }
      })
    }
    
    return colors.slice(0, 4) // Limit to 4 colors max to prevent wrapping
  }, [product])

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
    // Get current locale from pathname
    const locale = window.location.pathname.split('/')[1] || 'en'
    // Navigate to step-based design tool starting at step 1
    router.push(`/${locale}/design-tool/${productId}/step/1`)
  }

  const handleAddToCart = () => {
    try {
      const cartItem = {
        ...product,
        selectedVariation: selectedVariation || undefined,
        // Include the current display image for cart
        cartImage: currentImage || getProductImage(product)
      }
      
      // Always add directly to cart without size selection
      dispatch(addToCart(cartItem))
      toast({
        title: t.addedToCart,
        description: `${product.name} ${t.hasBeenAddedToCart}`,
      })
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
    <Card className={`overflow-hidden group transition-all duration-300 flex flex-col h-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl ${
      product.inStock ? 'hover:scale-[1.02]' : 'opacity-60'
    }`}>
      <div 
        className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link 
          href={`/product/${(product as any)._id || product.id}${searchParams.toString() ? `?from=${encodeURIComponent(searchParams.toString())}` : ''}`} 
          className="relative w-full h-full block"
        >
          <ProductImage
            src={isHovering ? allProductImages[hoverImageIndex] : (currentImage || getProductImage(product))}
            alt={`${product.name} - ${selectedVariation?.color?.name || 'Default'}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-2 bg-gray-50 transition-all duration-500 group-hover:scale-105"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-black/95 rounded-full p-1.5 shadow-md z-20 hover:scale-110 transition-transform"
              aria-label="Previous angle"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextAngle}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-black/95 rounded-full p-1.5 shadow-md z-20 hover:scale-110 transition-transform"
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
          {/* Color Variations - Show inline without adding height */}
          {colorVariations.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap max-w-full">
              {colorVariations.map((color, index) => (
                <div
                  key={index}
                  className="relative group/color flex-shrink-0"
                  title={color.name}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all cursor-pointer hover:scale-110"
                    style={{ backgroundColor: color.hex || '#808080' }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // If color has a variation, select it
                      if (color.variation) {
                        handleVariationSelect(color.variation)
                      }
                      // If color has an image, find and set it
                      else if (color.image) {
                        const index = allProductImages.findIndex(img => img === color.image)
                        if (index !== -1) {
                          setHoverImageIndex(index)
                          setCurrentAngleIndex(index)
                        }
                      }
                    }}
                  />
                  {/* Selected indicator */}
                  {color.variation && selectedVariation?.id === color.variation.id && (
                    <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white" />
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {color.name}
                  </div>
                </div>
              ))}
            </div>
          )}
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
      
      <CardFooter className="p-2 sm:p-3 pt-0 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex gap-1.5 sm:gap-2 w-full items-stretch">
          <Button
            className={`${isCustomizable ? 'flex-1' : 'w-full'} h-[36px] sm:h-[40px] bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase text-[10px] sm:text-xs transition-all px-2 sm:px-3 flex items-center justify-center`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3 w-3 mr-0.5 sm:mr-1 flex-shrink-0" />
            <span className="hidden xs:inline">{t.addToCart}</span>
            <span className="xs:hidden">Add</span>
          </Button>
          {isCustomizable && (
            <Button
              className="w-[36px] sm:w-[40px] h-[36px] sm:h-[40px] border border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center p-0"
              onClick={handleDesignThisProduct}
              disabled={!product.inStock}
              title={t.designThisProduct}
            >
              <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export const ProductCardEnhanced = memo(ProductCardEnhancedComponent)