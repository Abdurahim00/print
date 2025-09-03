"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getProductImage, getAllProductImages } from "@/lib/utils/product-image"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { addToCart } from "@/lib/redux/slices/cartSlice"
import { translations } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  ShoppingCart, 
  Palette, 
  Plus, 
  Minus, 
  ChevronRight,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  Star,
  Share2,
  Check
} from "lucide-react"
import type { Product, Category, Subcategory } from "@/types"

interface ProductDetailViewProps {
  product: Product & {
    _id?: string
    basePrice?: number
    images?: string[]
    variants?: any[]
    sizes?: string[]
    sizePrices?: any
    brand?: string
    sku?: string
    specifications?: any
    source?: string
    originalData?: {
      articleNo?: string
      priceBeforeTax?: string
      priceAfterTax?: string
    }
  }
  category: Category | null
  subcategory: Subcategory | null
  isDesignable: boolean
  selectedVariantId?: string
}

export function ProductDetailView({ 
  product, 
  category, 
  subcategory, 
  isDesignable,
  selectedVariantId 
}: ProductDetailViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  
  // Get the 'from' parameter to preserve navigation state
  const fromParams = searchParams.get('from')
  
  // State
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  
  // Get the main display image for the current selection
  const getMainImage = () => {
    if (selectedVariant) {
      return selectedVariant.variant_image || selectedVariant.image || getProductImage(product)
    }
    return getProductImage(product)
  }
  
  // Get all angle images for the current product/variant (NOT color variants)
  const getAllAngleImages = () => {
    const imagesWithLabels = []
    const seenUrls = new Set()
    
    // Helper to add image if not duplicate
    const addImage = (url: string, label: string) => {
      if (url && typeof url === 'string' && url.trim() !== '' && url !== '/placeholder.jpg' && !seenUrls.has(url)) {
        seenUrls.add(url)
        imagesWithLabels.push({ url, label })
      }
    }
    
    // Get all images from the product using our utility
    const allImages = getAllProductImages(product)
    
    // First, add main image if exists
    const mainImage = getProductImage(product)
    if (mainImage && mainImage !== '/placeholder.jpg') {
      addImage(mainImage, 'Main')
    }
    
    // If selected variant has specific images, prioritize those
    if (selectedVariant) {
      if (selectedVariant.variant_image) {
        addImage(selectedVariant.variant_image, 'Variant')
      }
      if (selectedVariant.image) {
        addImage(selectedVariant.image, 'View')
      }
      if (selectedVariant.frontImage) {
        addImage(selectedVariant.frontImage, 'Front')
      }
      if (selectedVariant.backImage) {
        addImage(selectedVariant.backImage, 'Back')
      }
      if (selectedVariant.images && Array.isArray(selectedVariant.images)) {
        selectedVariant.images.forEach((img: any, idx: number) => {
          const url = typeof img === 'object' && img.url ? img.url : img
          addImage(url, `View ${idx + 1}`)
        })
      }
    }
    
    // Add product-level images
    if (product.frontImage) {
      addImage(product.frontImage, 'Front')
    }
    if (product.backImage) {
      addImage(product.backImage, 'Back')
    }
    if (product.leftImage) {
      addImage(product.leftImage, 'Left')
    }
    if (product.rightImage) {
      addImage(product.rightImage, 'Right')
    }
    if (product.materialImage) {
      addImage(product.materialImage, 'Material')
    }
    
    // Add from images array
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any, idx: number) => {
        const url = typeof img === 'object' && img.url ? img.url : img
        addImage(url, `Image ${idx + 1}`)
      })
    }
    
    // Always add variant images for multi-angle view
    if (product.variants && Array.isArray(product.variants)) {
      // If we already have angle images, only add unique variant angles
      // Otherwise add all variant images
      const needAllVariantImages = imagesWithLabels.length === 0
      
      product.variants.forEach((variant: any, vIdx: number) => {
        const variantName = variant.variant_name || variant.color?.name || `Style ${vIdx + 1}`
        
        if (variant.variant_image) {
          addImage(variant.variant_image, variantName)
        }
        if (variant.image && variant.image !== variant.variant_image) {
          addImage(variant.image, `${variantName} - Alt`)
        }
        
        // Add front/back/side images from variants if they exist
        if (variant.frontImage) {
          addImage(variant.frontImage, `${variantName} - Front`)
        }
        if (variant.backImage) {
          addImage(variant.backImage, `${variantName} - Back`)
        }
        if (variant.leftImage) {
          addImage(variant.leftImage, `${variantName} - Left`)
        }
        if (variant.rightImage) {
          addImage(variant.rightImage, `${variantName} - Right`)
        }
        
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach((img: any, idx: number) => {
            const url = typeof img === 'object' && img.url ? img.url : img
            addImage(url, `${variantName} - View ${idx + 1}`)
          })
        }
      })
    }
    
    // Add variation images if still no images
    if (imagesWithLabels.length === 0 && product.variations && Array.isArray(product.variations)) {
      product.variations.forEach((variation: any, vIdx: number) => {
        if (variation.images && Array.isArray(variation.images)) {
          variation.images.forEach((img: any, idx: number) => {
            let url: string
            if (typeof img === 'string') {
              url = img
            } else if (img && typeof img === 'object' && img.url) {
              url = img.url
            } else {
              return
            }
            addImage(url, `Style ${vIdx + 1} - View ${idx + 1}`)
          })
        }
      })
    }
    
    // If still no images, ensure we at least have the main product image
    if (imagesWithLabels.length === 0) {
      const fallbackImage = getProductImage(product)
      if (fallbackImage && fallbackImage !== '/placeholder.jpg') {
        imagesWithLabels.push({ url: fallbackImage, label: 'Main' })
      }
    }
    
    return imagesWithLabels
  }
  
  const angleImages = getAllAngleImages()
  const mainImage = getMainImage()
  
  // Get available sizes
  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes
    : (product.sizePrices && Object.keys(product.sizePrices).length > 0 
        ? Object.keys(product.sizePrices)
        : [])
  
  // Initialize selected variant
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const variant = selectedVariantId 
        ? product.variants.find((v: any) => v.id === selectedVariantId || v.variant_name === selectedVariantId)
        : product.variants[0]
      setSelectedVariant(variant)
      // Reset image when variant changes
      setSelectedImage(0)
    }
  }, [product.variants, selectedVariantId])
  
  // Update price based on selected variant and size
  useEffect(() => {
    let price = 0
    
    // First try to get base price from product
    const basePrice = product.basePrice || product.price || 0
    
    // If no base price, try originalData from Prendo import
    if (!basePrice && product.originalData?.priceBeforeTax) {
      const priceStr = product.originalData.priceBeforeTax
      price = typeof priceStr === 'string'
        ? parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.'))
        : priceStr
    } else {
      price = basePrice
    }
    
    // Check if variant has specific price (override base)
    if (selectedVariant && selectedVariant.price) {
      const variantPrice = typeof selectedVariant.price === 'string' 
        ? parseFloat(selectedVariant.price.replace(/[^\d.,]/g, '').replace(',', '.'))
        : selectedVariant.price
      if (variantPrice > 0) {
        price = variantPrice
      }
    }
    
    // Check size-specific pricing (additional cost)
    if (selectedSize && product.sizePrices && product.sizePrices[selectedSize]) {
      const sizeData = product.sizePrices[selectedSize]
      const sizePrice = typeof sizeData === 'object' ? sizeData.price : sizeData
      if (sizePrice && sizePrice > 0) {
        // If size has a specific price, use it; otherwise it might be an addition to base
        price = sizePrice
      }
    }
    
    // Ensure we have a valid price
    if (!price || price === 0) {
      // Last resort: check if there's any price info in specifications
      if (product.specifications?.['Pris/st']) {
        const specPrice = product.specifications['Pris/st']
        price = typeof specPrice === 'string'
          ? parseFloat(specPrice.replace(/[^\d.,]/g, '').replace(',', '.'))
          : specPrice
      }
    }
    
    setCurrentPrice(price || 0)
  }, [selectedVariant, selectedSize, product])
  
  // Update URL when variant changes
  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
    router.push(`/product/${product._id || product.id}?variant=${variant.id}`, { scroll: false })
    setSelectedImage(0) // Reset to first image of new variant
  }
  
  // Handle add to cart
  const handleAddToCart = () => {
    console.log('Add to Cart clicked')
    console.log('Product:', product)
    console.log('Available sizes:', availableSizes)
    console.log('Selected size:', selectedSize)
    console.log('Current price:', currentPrice)
    
    // Check if size selection is required
    if (availableSizes && availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose a size before adding to cart",
        variant: "destructive"
      })
      return
    }
    
    // Create cart item with proper structure
    const cartItem: any = {
      ...product,
      id: product._id || product.id,
      productId: product._id || product.id,
      quantity: 1, // Set quantity to 1 per item
      price: currentPrice > 0 ? currentPrice : (product.price || product.basePrice || 0),
      basePrice: product.basePrice || product.price || 0,
      image: selectedVariant?.image || selectedVariant?.variant_image || product.image,
      name: product.name
    }
    
    // Add selected size if applicable
    if (selectedSize) {
      cartItem.selectedSize = selectedSize
    }
    
    // Add variant information if selected
    if (selectedVariant) {
      cartItem.selectedVariant = {
        id: selectedVariant.id,
        name: selectedVariant.variant_name || selectedVariant.color?.name || 'Variant',
        color: selectedVariant.color,
        image: selectedVariant.variant_image || selectedVariant.image || selectedVariant.images?.[0]
      }
    }
    
    console.log('Cart item being added:', cartItem)
    
    try {
      // Dispatch to cart - add multiple times for quantity
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(cartItem))
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} has been added to your cart`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    }
  }
  
  // Handle design button
  const handleDesignProduct = () => {
    const productId = product._id || product.id
    const variantParam = selectedVariant ? `&variant=${selectedVariant.id}` : ''
    router.push(`/design-tool?productId=${productId}${variantParam}`)
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-black dark:hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link 
            href={`/products${fromParams ? `?${fromParams}` : ''}`}
            className="text-gray-500 hover:text-black dark:hover:text-white"
          >
            Products
          </Link>
          {category && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link 
                href={`/products/${category.slug}${fromParams ? `?${fromParams}` : ''}`}
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-black dark:text-white font-semibold">{product.name}</span>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <div className="flex gap-3">
            {/* Vertical Thumbnail Gallery - Show when there are multiple angle images */}
            {angleImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[600px] custom-scrollbar">
                {angleImages.map((imgData, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all group ${
                      selectedImage === idx 
                        ? 'border-black dark:border-white' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={imgData.url || "/placeholder.svg"}
                      alt={`${product.name} - ${imgData.label}`}
                      fill
                      className="object-contain p-2 bg-gray-50"
                      sizes="80px"
                    />
                    {/* Angle label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-semibold py-1 text-center">
                      {imgData.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-black dark:border-white">
                <Image
                  src={angleImages.length > 0 ? (angleImages[selectedImage]?.url || mainImage) : mainImage}
                  alt={`${product.name}${angleImages[selectedImage] ? ` - ${angleImages[selectedImage].label}` : ''}`}
                  fill
                  className="object-contain p-2 bg-gray-50"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Designable Badge */}
                {isDesignable && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black dark:bg-white px-3 py-2 rounded-md flex items-center gap-2">
                      <Palette className="h-4 w-4 text-white dark:text-black" />
                      <span className="text-xs font-semibold text-white dark:text-black">Customizable</span>
                    </div>
                  </div>
                )}
                
                {/* Mobile Image Counter with Angle Label - Show for products with multiple angle images */}
                {angleImages.length > 1 && (
                  <div className="md:hidden absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm">
                    <span className="font-bold">{angleImages[selectedImage]?.label}</span>
                    <span className="ml-2 opacity-80">{selectedImage + 1}/{angleImages.length}</span>
                  </div>
                )}
                
                {/* Mobile Navigation Arrows - Show for products with multiple angle images */}
                {angleImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                      className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 p-2 rounded-full"
                      disabled={selectedImage === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(Math.min(angleImages.length - 1, selectedImage + 1))}
                      className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 p-2 rounded-full"
                      disabled={selectedImage === angleImages.length - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                    <span className="text-white font-black uppercase text-2xl bg-red-500 px-6 py-3 rounded-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              {/* Mobile Thumbnail Dots - Show for products with multiple angle images */}
              {angleImages.length > 1 && (
                <div className="md:hidden flex justify-center gap-1 mt-3">
                  {angleImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === idx 
                          ? 'bg-black dark:bg-white w-6' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-black dark:text-white uppercase">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                {(product.sku || product.originalData?.articleNo) && (
                  <span>SKU: {product.sku || product.originalData?.articleNo}</span>
                )}
                {product.originalData?.articleNo && (
                  <span>Article No: {product.originalData.articleNo}</span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">(24 reviews)</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-black dark:text-white">
                  {currentPrice > 0 ? currentPrice.toFixed(2) : 'Price on request'}
                </span>
                {product.originalData?.priceAfterTax && (
                  <span className="text-sm text-gray-500">
                    (incl. tax: {product.originalData.priceAfterTax})
                  </span>
                )}
              </div>
              {selectedSize && product.sizePrices?.[selectedSize] && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Price for size {selectedSize}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>
            
            <Separator />
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <Label className="font-bold">
                  Color: {selectedVariant?.variant_name || selectedVariant?.color?.name || 'Select Color'}
                </Label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.variants.map((variant: any, idx: number) => {
                    const variantImage = variant.variant_image || variant.image || 
                                       variant.color?.swatch_image || 
                                       (variant.images && variant.images[0]?.url) || 
                                       product.image
                    const variantName = variant.variant_name || variant.color?.name || `Option ${idx + 1}`
                    const isSelected = selectedVariant?.id === variant.id || 
                                     (selectedVariant?.variant_name === variant.variant_name)
                    
                    return (
                      <button
                        key={variant.id || `variant-${idx}`}
                        onClick={() => handleVariantChange(variant)}
                        className={`group relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-500'
                        }`}
                        title={variantName}
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white">
                          {variantImage ? (
                            <Image
                              src={variantImage}
                              alt={variantName}
                              fill
                              className="object-contain p-2 bg-gray-50"
                              sizes="64px"
                            />
                          ) : (
                            <div 
                              className="w-full h-full bg-gray-200"
                            />
                          )}
                        </div>
                        <span className="text-xs text-center line-clamp-1 font-medium">
                          {variantName}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-black dark:bg-white rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white dark:text-black" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-bold">Size</Label>
                  <button className="text-sm text-blue-600 hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                      className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                        selectedSize === size
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-500'
                      } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="space-y-3">
              <Label className="font-bold">Quantity</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-black dark:border-white rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={!product.inStock}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 font-bold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={!product.inStock}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {isDesignable ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleDesignProduct}
                    disabled={!product.inStock}
                    className="h-12 border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold uppercase transition-colors"
                  >
                    <Palette className="h-5 w-5 mr-2" />
                    Customize
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              )}
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="border-2 border-black dark:border-white px-8"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Product
                </Button>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
              <div className="flex flex-col items-center text-center">
                <Package className="h-6 sm:h-8 w-6 sm:w-8 text-gray-600 dark:text-gray-400 mb-1 sm:mb-2" />
                <span className="text-[10px] sm:text-xs font-bold uppercase">Free Returns</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck className="h-6 sm:h-8 w-6 sm:w-8 text-gray-600 dark:text-gray-400 mb-1 sm:mb-2" />
                <span className="text-[10px] sm:text-xs font-bold uppercase">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-gray-600 dark:text-gray-400 mb-1 sm:mb-2" />
                <span className="text-[10px] sm:text-xs font-bold uppercase">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 border-2 border-black dark:border-white">
              <TabsTrigger value="description" className="font-bold uppercase">Description</TabsTrigger>
              <TabsTrigger value="specifications" className="font-bold uppercase">Specifications</TabsTrigger>
              <TabsTrigger value="shipping" className="font-bold uppercase">Shipping</TabsTrigger>
              <TabsTrigger value="reviews" className="font-bold uppercase">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6 space-y-4">
              <h3 className="text-xl font-black uppercase">Product Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
              {isDesignable && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-2 border-black dark:border-white">
                  <h4 className="font-black uppercase mb-2 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Customization Available
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This product can be customized with your own design. Click the "Customize" button to start designing!
                  </p>
                  {category?.designableAreas && category.designableAreas.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-bold">Available design areas: </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.designableAreas.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6 space-y-4">
              <h3 className="text-xl font-black uppercase">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product specifications from Prendo import */}
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-400 text-right max-w-[60%]">{String(value)}</span>
                    </div>
                  </div>
                ))}
                
                {/* Additional product info */}
                {product.originalData?.articleNo && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">Article Number:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.originalData.articleNo}</span>
                    </div>
                  </div>
                )}
                
                {product.brand && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">Brand:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.brand}</span>
                    </div>
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">Available Sizes:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.sizes.join(', ')}</span>
                    </div>
                  </div>
                )}
                
                {product.variants && product.variants.length > 0 && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">Available Colors:</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.variants.length} options</span>
                    </div>
                  </div>
                )}
                
                {product.source && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">Source:</span>
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{product.source.replace('_', ' ')}</span>
                    </div>
                  </div>
                )}
                
                {isDesignable && category?.designTechniques && (
                  <div className="py-2 border-b">
                    <div className="flex justify-between">
                      <span className="font-bold">Print Methods:</span>
                      <span className="text-gray-600 dark:text-gray-400">{category.designTechniques.join(', ')}</span>
                    </div>
                  </div>
                )}
                
                {(!product.specifications || Object.keys(product.specifications).length === 0) && 
                 !product.originalData?.articleNo && 
                 !product.brand && (
                  <p className="text-gray-600 dark:text-gray-400 col-span-2">No specifications available.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6 space-y-4">
              <h3 className="text-xl font-black uppercase">Shipping Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Standard Shipping</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      5-7 business days - Free on orders over $50
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Express Shipping</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      2-3 business days - $15
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6 space-y-4">
              <h3 className="text-xl font-black uppercase">Customer Reviews</h3>
              <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper component for labels
function Label({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <label className={`text-sm font-bold uppercase tracking-wider ${className}`}>{children}</label>
}