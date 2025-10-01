"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { useMemo, useState, useEffect } from "react"
import { updateQuantity, removeFromCart, setCart } from "@/lib/redux/slices/cartSlice"
import { translations } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCurrency } from "@/contexts/CurrencyContext"
import { DesignCanvasRenderer } from "@/components/DesignCanvasRenderer"
import { getProductImage } from "@/lib/utils/product-image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function CartPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { items: cart } = useAppSelector((state) => state.cart)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  const activeCoupon = useAppSelector((s: any) => s.coupons.activeCoupon)
  const [isClient, setIsClient] = useState(false)
  const [cartKey, setCartKey] = useState(0)
  const [renderKey, setRenderKey] = useState(Date.now())
  const { formatPrice, currency } = useCurrency()
  
  // Debug: Log currency information
  console.log('💰 Currency info:', { currency })
  
  // Force SEK currency for design products to avoid conversion issues
  const shouldUseSEK = cart.some(item => (item as any).designs || (item as any).designCosts)
  const effectiveCurrency = shouldUseSEK ? 'SEK' : currency
  const effectiveFormatPrice = (value: unknown) => {
    if (effectiveCurrency === 'SEK') {
      // Force SEK formatting with dot as decimal separator
      const numInSEK = typeof value === 'number' ? value : parseFloat(String(value)) || 0
      return `${numInSEK.toFixed(2)} kr`
    } else {
      // Use original formatPrice for USD
      return formatPrice(value)
    }
  }
  
  console.log('💰 Effective currency:', { 
    original: currency, 
    effective: effectiveCurrency, 
    shouldUseSEK, 
    hasDesigns: cart.some(item => (item as any).designs) 
  })
  
  useEffect(() => {
    setIsClient(true)
    // Force clear any potential cache
    if (typeof window !== 'undefined') {
      // Clear any cached cart data
      const cacheKey = `cart-cache-${Date.now()}`
      localStorage.setItem('cart-cache-buster', cacheKey)
      
      // Force clear browser cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('cart') || name.includes('page')) {
              caches.delete(name)
            }
          })
        })
      }
    }
  }, [])
  
  // Debug: Log cart changes
  useEffect(() => {
    console.log('🛒 Cart updated:', cart)
    cart.forEach((item, index) => {
      console.log(`🛒 Item ${index + 1}:`, {
        id: item.id,
        name: item.name,
        price: item.price,
        basePrice: (item as any).basePrice,
        totalPrice: (item as any).totalPrice,
        designCosts: (item as any).designCosts,
        quantity: item.quantity
      })
    })
    // Force re-render when cart changes
    setCartKey(prev => prev + 1)
    setRenderKey(Date.now())
  }, [cart])

  const rawSubtotal = cart.reduce((total, item) => {
    let itemPrice = 0;
    
    // Debug: Log each cart item
    console.log('🛒 😂😂😂😂😂😂😂😂😂😂Cart item:', {
      id: item.id,
      name: item.name,
      price: item.price,
      basePrice: (item as any).basePrice,
      totalPrice: (item as any).totalPrice,
      designCosts: (item as any).designCosts,
      quantity: item.quantity
    })
    
    // Handle different price formats
    if (typeof item.price === 'number') {
      itemPrice = item.price;
            } else if (typeof item.price === 'string') {
          // Remove any non-numeric characters except decimal point
          const cleanPrice = String(item.price).replace(/[^\d.-]/g, '');
          itemPrice = parseFloat(cleanPrice) || 0;
    } else if (item.selectedSizes && item.selectedSizes.length > 0) {
      // If we have selectedSizes, calculate from those
      itemPrice = item.selectedSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0) / item.quantity;
    }
    
    const itemTotal = itemPrice * item.quantity
    console.log(`💰 Item total: ${itemPrice} × ${item.quantity} = ${itemTotal}`)
    
    return total + itemTotal;
  }, 0)
  
  console.log('🛒 Cart subtotal calculation:', rawSubtotal)
  // Compute discount from active percentage coupon across eligible items
  const discountAmount = useMemo(() => {
    if (!activeCoupon || activeCoupon.discountType !== "percentage") return 0
    const eligibleTotal = cart.reduce((sum, item) => {
      const eligible = (item as any).eligibleForCoupons === true
      if (!eligible) return sum
      let price = 0
      if (typeof item.price === 'number') price = item.price
      else if (typeof item.price === 'string') price = parseFloat(String(item.price).replace(/[^\d.-]/g, '')) || 0
      else if (item.selectedSizes && item.selectedSizes.length > 0) {
        price = item.selectedSizes.reduce((s, sz) => s + (sz.price * sz.quantity), 0) / item.quantity
      }
      return sum + price * item.quantity
    }, 0)
    return (eligibleTotal * activeCoupon.discountValue) / 100
  }, [cart, activeCoupon])

  const subtotal = Math.max(0, rawSubtotal - discountAmount)
  const vatAmount = subtotal * 0.25
  const cartTotal = subtotal + vatAmount
  
  // Debug: Log all price calculations
  console.log('💰 Price calculations:', {
    rawSubtotal,
    discountAmount,
    subtotal,
    vatAmount,
    cartTotal,
    cartLength: cart.length
  })
  
  // Check if cart total is suspiciously low (indicating cache issue)
  if (cartTotal < 10 && cart.length > 0) {
    console.warn('⚠️ Cart total is suspiciously low:', cartTotal, 'for', cart.length, 'items')
    console.log('🔄 Forcing component refresh...')
    
    // Force refresh the Redux cart state
    dispatch(setCart([...cart]))
    
    // Force refresh the component
    setRenderKey(Date.now())
    setCartKey(prev => prev + 1)
    
    // If still incorrect after refresh, reload the page
    setTimeout(() => {
      if (cartTotal < 10 && cart.length > 0) {
        console.log('🔄 Still incorrect, forcing page reload...')
        window.location.reload()
      }
    }, 1000)
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    // Ensure quantity does not go below 1
    dispatch(updateQuantity({ id, quantity: Math.max(1, quantity) }))
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  // Don't render cart content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="text-center py-8 sm:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-250px)] px-4">
        <ShoppingCart className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-slate-400 dark:text-slate-500 mb-4 sm:mb-6 animate-pulse" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">{t.cart}</h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8">Loading...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-250px)] px-4">
        <ShoppingCart className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-slate-400 dark:text-slate-500 mb-4 sm:mb-6" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">{t.cart}</h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8">{t.yourCartIsEmpty}</p>
        <Button 
          size="lg" 
          className="bg-black hover:bg-gray-800 text-white shadow-lg min-h-[44px] touch-manipulation"
          onClick={() => router.push('/products')}
        >
          <span className="flex items-center">{t.browseProducts}</span>
        </Button>
      </div>
    )
  }

  return (
    <div key={`cart-${renderKey}-${cartKey}-${cart.length}-${cartTotal}`} className="space-y-3 sm:space-y-4 lg:space-y-6 xl:space-y-8 px-2 sm:px-4 lg:px-6 xl:px-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto">
        <Breadcrumb className="mb-3 sm:mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-black dark:hover:text-white transition-colors text-xs sm:text-sm">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-xs sm:text-sm">Shopping Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-center text-slate-900 dark:text-white">{t.cart}</h1>
      <Card className="shadow-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 max-w-7xl mx-auto">
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block lg:hidden">
            {cart.map((item, index) => {
              // Helper functions for mobile view
              const getProductDisplayImage = () => {
                // For items with designs, prefer the product image (not the composite)
                // so we can overlay the design with DesignCanvasRenderer
                if ((item as any).designContext?.selectedVariation) {
                  const variation = (item as any).designContext.selectedVariation
                  const viewMode = (item as any).designContext.viewMode || "front"
                  const imageForAngle = variation.variationImages?.find((img: any) => img.angle === viewMode && img.url)
                  if (imageForAngle) return imageForAngle.url
                  const frontImage = variation.variationImages?.find((img: any) => img.angle === "front" && img.url)
                  if (frontImage) return frontImage.url
                  if (variation.colorSwatchImage) return variation.colorSwatchImage
                }
                // Use designPreview ONLY if we don't have designCanvasJSON
                if ((item as any).designPreview && !(item as any).designCanvasJSON) {
                  return (item as any).designPreview
                }
                // Use getProductImage helper to handle all image property cases
                return getProductImage(item as any) || "/placeholder.svg"
              }
              
              const getProductDisplayName = () => {
                let displayName = item.name
                if ((item as any).designContext?.selectedVariation) {
                  const variation = (item as any).designContext.selectedVariation
                  displayName += ` (${variation.colorName})`
                }
                return displayName
              }
              
              const getItemPrice = () => {
                if (typeof item.price === 'number') return item.price
                if (typeof item.price === 'string') {
                  const cleanPrice = String(item.price).replace(/[^\d.-]/g, '')
                  return parseFloat(cleanPrice) || 0
                }
                if (item.selectedSizes && item.selectedSizes.length > 0) {
                  const totalPrice = item.selectedSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0)
                  return totalPrice / item.quantity
                }
                return 0
              }
              
              const itemPrice = getItemPrice()
              const itemTotal = itemPrice * item.quantity
              
              return (
                <div key={item.id} className={`p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 ${
                  index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-800/20"
                }`}>
                  <div className="flex gap-2 sm:gap-3 mb-3">
                    <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                      {/* Use design preview if available, otherwise use base product image */}
                      <Image
                        src={(item as any).designPreview || getProductDisplayImage()}
                        alt={getProductDisplayName()}
                        width={80}
                        height={80}
                        className="rounded-md object-cover border border-slate-200 dark:border-slate-700 w-full h-full"
                      />
                      {/* Show design indicator */}
                      {((item as any).hasDesign || (item as any).designCanvasJSON || (item as any).designPreview) && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          ✨
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 leading-tight">{getProductDisplayName()}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1">{effectiveFormatPrice(itemPrice)}</p>
                      {(item as any).selectedVariant && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Color: {(item as any).selectedVariant.name}
                        </p>
                      )}
                      {(item as any).selectedSize && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Size: {(item as any).selectedSize}
                        </p>
                      )}
                      {item.selectedSizes && item.selectedSizes.filter(s => s.quantity > 0).length > 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Sizes: {item.selectedSizes.filter(s => s.quantity > 0).map(s => `${s.size}: ${s.quantity}`).join(', ')}
                        </p>
                      )}
                      {(item as any).hasDesign && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                          <span>✨ Custom Design</span>
                          {(item as any).designAreaPercentage && (
                            <span className="text-slate-500">({(item as any).designAreaPercentage.toFixed(0)}% coverage)</span>
                          )}
                        </div>
                      )}
                      {(item as any).designContext && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {(item as any).designContext.viewMode && (
                            <span className="mr-2">View: {(item as any).designContext.viewMode}</span>
                          )}
                          {(item as any).designContext.selectedTemplate && (
                            <span>Template: {(item as any).designContext.selectedTemplate.name}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 flex-shrink-0"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 touch-manipulation"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-12 sm:w-14 h-7 sm:h-8 text-center appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-slate-300 dark:border-slate-600 text-xs sm:text-sm"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 touch-manipulation"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{effectiveFormatPrice(itemTotal)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-700/50">
                  <TableHead className="w-2/5 text-slate-700 dark:text-slate-300">{t.products}</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">{t.price}</TableHead>
                  <TableHead className="text-center w-1/5 text-slate-700 dark:text-slate-300">{t.quantity}</TableHead>
                  <TableHead className="text-right text-slate-700 dark:text-slate-300">{t.total}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item, index) => {
                  // Get the correct product image based on design context
                  const getProductDisplayImage = () => {
                    // For items with designs, prefer the product image (not the composite)
                    // so we can overlay the design with DesignCanvasRenderer
                    if ((item as any).designContext?.selectedVariation) {
                      const variation = (item as any).designContext.selectedVariation
                      const viewMode = (item as any).designContext.viewMode || "front"
                      
                      // Find image for the specific angle
                      const imageForAngle = variation.variationImages?.find((img: any) => 
                        img.angle === viewMode && img.url
                      )
                      if (imageForAngle) {
                        return imageForAngle.url
                      }
                      
                      // Fallback to front view
                      const frontImage = variation.variationImages?.find((img: any) => 
                        img.angle === "front" && img.url
                      )
                      if (frontImage) {
                        return frontImage.url
                      }
                      
                      // Fallback to swatch image
                      if (variation.colorSwatchImage) {
                        return variation.colorSwatchImage
                      }
                    }
                    
                    // Use designPreview ONLY if we don't have designCanvasJSON
                    if ((item as any).designPreview && !(item as any).designCanvasJSON) {
                      return (item as any).designPreview
                    }
                    
                    // Ultimate fallback to default product image using helper
                    return getProductImage(item as any) || "/placeholder.svg"
                  }

                  // Get product display name with variation info
                  const getProductDisplayName = () => {
                    let displayName = item.name
                    
                    // Add variation color info if available
                    if ((item as any).designContext?.selectedVariation) {
                      const variation = (item as any).designContext.selectedVariation
                      displayName += ` (${variation.colorName})`
                    }
                    
                    return displayName
                  }

                  // Get selected sizes description
                  const getSelectedSizesDescription = () => {
                    if (!item.selectedSizes || item.selectedSizes.length === 0) {
                      return null
                    }
                    
                    // Filter out sizes with 0 quantity
                    const activeSizes = item.selectedSizes.filter(size => size.quantity > 0)
                    
                    if (activeSizes.length === 0) {
                      return null
                    }
                    
                    // Create a readable description
                    const sizeDescriptions = activeSizes.map(size => 
                      `${size.size}: ${size.quantity}`
                    )
                    
                    return `Sizes: ${sizeDescriptions.join(', ')}`
                  }

                  // Get price breakdown for items with selected sizes
                  const getPriceBreakdown = () => {
                    if (!item.selectedSizes || item.selectedSizes.length === 0) {
                      return null
                    }
                    
                    const activeSizes = item.selectedSizes.filter(size => size.quantity > 0)
                    if (activeSizes.length === 0) {
                      return null
                    }
                    
                    const totalPrice = activeSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0)
                    const averagePrice = totalPrice / activeSizes.reduce((sum, size) => sum + size.quantity, 0)
                    
                    return `Avg: ${effectiveFormatPrice(averagePrice)} per item`
                  }

                  return (
                    <TableRow
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-800/20"
                      } border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors`}
                    >
                      <TableCell className="font-medium flex items-center gap-3 py-4">
                        <div className="relative w-20 h-20">
                          {/* Use design preview if available, otherwise use base product image */}
                          <Image
                            src={(item as any).designPreview || getProductDisplayImage()}
                            alt={getProductDisplayName()}
                            width={80}
                            height={80}
                            className="rounded-md object-cover border border-slate-200 dark:border-slate-700 w-full h-full"
                          />
                          {/* Show a design indicator if this is a custom design */}
                          {((item as any).hasDesign || (item as any).designCanvasJSON || (item as any).designPreview) && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              ✨
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-900 dark:text-white">{getProductDisplayName()}</span>
                          {/* Show selected variant (color) */}
                          {(item as any).selectedVariant && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Color: {(item as any).selectedVariant.name}
                            </div>
                          )}
                          {/* Show selected size */}
                          {(item as any).selectedSize && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Size: {(item as any).selectedSize}
                            </div>
                          )}
                          {/* Show design context info */}
                          {(item as any).designContext && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {(item as any).designContext.viewMode && (
                                <span className="mr-2">View: {(item as any).designContext.viewMode}</span>
                              )}
                              {(item as any).designContext.selectedTemplate && (
                                <span>Template: {(item as any).designContext.selectedTemplate.name}</span>
                              )}
                            </div>
                          )}
                          {/* Show custom design info */}
                          {(item as any).hasDesign && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                              <span>✨ Custom Design</span>
                              {(item as any).designAreaPercentage && (
                                <span className="text-slate-500">({(item as any).designAreaPercentage.toFixed(0)}% coverage)</span>
                              )}
                            </div>
                          )}
                          {/* Show designs array with individual angles */}
                          {(item as any).designs && Array.isArray((item as any).designs) && (item as any).designs.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Design Angles: {(item as any).designs.length}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(item as any).designs.map((design: any, idx: number) => (
                                  <div key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                    {design.angle.toUpperCase()}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Show selected sizes description */}
                          {getSelectedSizesDescription() && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {getSelectedSizesDescription()}
                            </div>
                          )}
                          {/* Show price breakdown for items with selected sizes */}
                          {getPriceBreakdown() && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {getPriceBreakdown()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {(() => {
                        let displayPrice;
                        if (typeof item.price === 'number') {
                          displayPrice = item.price.toFixed(2);
                        } else if (typeof item.price === 'string') {
                          const cleanPrice = String(item.price).replace(/[^\d.-]/g, '');
                          displayPrice = (parseFloat(cleanPrice) || 0).toFixed(2);
                        } else if (item.selectedSizes && item.selectedSizes.length > 0) {
                          // Calculate average price per item from selected sizes
                          const totalPrice = item.selectedSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0);
                          displayPrice = (totalPrice / item.quantity).toFixed(2);
                        } else {
                          displayPrice = "0.00";
                        }
                        return effectiveFormatPrice(parseFloat(displayPrice));
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                          className="w-16 h-9 text-center appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-slate-300 dark:border-slate-600"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                      {(() => {
                        let totalPrice;
                        if (typeof item.price === 'number') {
                          totalPrice = (item.price * item.quantity).toFixed(2);
                        } else if (typeof item.price === 'string') {
                          const cleanPrice = String(item.price).replace(/[^\d.-]/g, '');
                          totalPrice = ((parseFloat(cleanPrice) || 0) * item.quantity).toFixed(2);
                        } else if (item.selectedSizes && item.selectedSizes.length > 0) {
                          // Sum of all selected sizes
                          totalPrice = item.selectedSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0).toFixed(2);
                        } else {
                          totalPrice = "0.00";
                        }
                        return effectiveFormatPrice(parseFloat(totalPrice));
                      })()}
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 space-y-1.5 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm lg:text-base">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Subtotal:</span>
                  <span>{effectiveFormatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="text-xs sm:text-sm lg:text-base">Coupon{activeCoupon?.code ? ` (${activeCoupon.code})` : ''}:</span>
                <span>-{effectiveFormatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>{t.vat}:</span>
              <span>{effectiveFormatPrice(vatAmount)}</span>
            </div>
            <Separator className="bg-slate-300 dark:bg-slate-600" />
            <div className="flex justify-between font-bold text-base sm:text-lg lg:text-xl text-slate-900 dark:text-white">
              <span>{t.total}:</span>
              <span id={`cart-total-${renderKey}`}>
                {(() => {
                  console.log('🎯 Rendering cartTotal:', cartTotal, 'currency:', effectiveCurrency, 'formatted:', effectiveFormatPrice(cartTotal))
                  console.log('🎯 Currency conversion:', {
                    originalValue: cartTotal,
                    currency: effectiveCurrency,
                    conversionRate: effectiveCurrency === 'USD' ? '1 USD = 10.87 SEK' : 'No conversion needed',
                    expectedResult: effectiveCurrency === 'USD' ? `${(cartTotal / 10.87).toFixed(2)} USD` : `${cartTotal.toFixed(2)} SEK`
                  })
                  return effectiveFormatPrice(cartTotal)
                })()}
              </span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-black hover:bg-gray-800 hover:text-white text-white shadow-lg min-h-[44px] px-6 sm:px-8 touch-manipulation"
            onClick={() => router.push('/checkout')}
          >
            <span className="flex items-center justify-center text-sm sm:text-base">
              {t.checkout} <Truck className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
