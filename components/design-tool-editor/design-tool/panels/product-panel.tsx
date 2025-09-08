"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Leaf, Palette, ShoppingBag, Shirt, Eye, RotateCw } from "lucide-react"
import { setProductColor, setViewMode, setShowProductModal, setSelectedProduct } from "@/lib/redux/designToolSlices/designSlice"
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice"
import { addToCart, addToCartWithSizes, addToCartWithDesign } from "@/lib/redux/slices/cartSlice"
import { RootState } from "@/lib/redux/store"
import Image from "next/image"
import { SizeQuantityModal, SelectedSizeQuantity } from "../modals/size-quantity-modal"
import { toast } from "sonner"

// Type definition for product
interface Product {
  id: string;
  name: string;
  type: string;
  baseColor: string;
  angles?: string[];
  colors?: string[];
  price?: string;
  image?: string;
  hasVariations?: boolean;
  variations?: any[];
}

// Default product for testing - use the actual Apparel category ID
const DEFAULT_PRODUCT = {
  id: "default-tshirt",
  name: "Custom T-Shirt",
  type: "apparel",
  categoryId: "68b2f79d65a5cb13315a529a", // Actual Apparel category ID from MongoDB
  baseColor: "#000000",
  angles: ["front", "back"],
  colors: ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"],
  price: "$19.99",
  image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  description: "Premium cotton t-shirt perfect for custom designs",
  inStock: true,
  hasVariations: false,
  variations: []
}

export function ProductPanel() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { selectedTool, selectedProduct, productColor, viewMode, hasDesignElements, designAreaPercentage, designAreaCm2 } = useSelector((state: RootState) => state.design)
  const categories = useSelector((state: RootState) => (state as any).categories.categories)
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<SelectedSizeQuantity[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [totalQuantity, setTotalQuantity] = useState<number>(0)
  
  // Auto-select default product if none selected and load categories
  useEffect(() => {
    if (!selectedProduct) {
      console.log('No product selected, setting default product')
      dispatch(setSelectedProduct(DEFAULT_PRODUCT))
    }
    // Always fetch categories to get latest design upcharge data (force refresh)
    dispatch(fetchCategories(true) as any)
  }, [selectedProduct, dispatch])

  // If no product is selected, show a message to select a product first
  if (!selectedProduct) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <Shirt className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a Product</h3>
          <p className="text-sm text-gray-400 mb-6">Choose a product from our catalog to start designing</p>
          <Button 
            onClick={() => dispatch(setShowProductModal(true))}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const product = selectedProduct as Product;

  const handleColorChange = (color: string) => {
    dispatch(setProductColor(color))
  }

  const handleViewChange = (view: string) => {
    dispatch(setViewMode(view))
  }

  // Get variations from selected product
  const getVariations = () => {
    if (!product.hasVariations || !product.variations) {
      return []
    }
    return product.variations
  }

  // Get current variation based on selected color
  const getCurrentVariation = () => {
    const variations = getVariations()
    if (variations.length === 0) return null
    return variations.find((v: any) => v.color?.hex_code === productColor) || variations[0]
  }

  // Get image for current view mode from current variation
  const getCurrentVariationImage = () => {
    const currentVariation = getCurrentVariation()
    if (!currentVariation) return null
    const imageForAngle = currentVariation.images?.find((img: any) => img.angle === viewMode && img.url)
    return imageForAngle?.url || product.image
  }

  const variations = getVariations()

  // Get current variation price or fallback to product price
  const getCurrentPrice = () => {
    const currentVariation = getCurrentVariation()
    if (currentVariation && currentVariation.price !== undefined && currentVariation.price !== null) {
      return currentVariation.price
    }
    return product.price
  }

  const parsePriceToNumber = (value: unknown): number => {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const cleaned = value.replace(/[^\d.-]/g, "")
      const num = parseFloat(cleaned)
      return isNaN(num) ? 0 : num
    }
    return 0
  }

  // Format price without decimals, just "888 kr"
  const formatPrice = (amount: number) => {
    return `${Math.round(amount)} kr`
  }

  // Calculate price with design upcharge based on area coverage
  const calculatePriceWithDesign = () => {
    const basePrice = parsePriceToNumber(getCurrentPrice())
    
    console.log('💰 Price calculation:', {
      hasDesignElements,
      designAreaPercentage,
      designAreaCm2,
      categoryId: product.categoryId,
      basePrice,
      categories: categories,
      categoriesLength: categories?.length
    })
    
    if (hasDesignElements && product.categoryId) {
      // Find the category to get the design upcharge settings
      const category = categories?.find((c: any) => c.id === product.categoryId)
      
      if (!category) {
        return { 
          basePrice, 
          designUpcharge: 0, 
          totalPrice: basePrice, 
          upchargePercent: 0,
          areaPercent: 0,
          areaCm2: 0,
          pricePerCm2: 0
        }
      }
      
      const useMetricPricing = category.useMetricPricing || false
      const designUpchargePerCm2 = category.designUpchargePerCm2 || 0
      const maxUpchargePercent = category.designUpchargePercent || 0
      
      console.log('🏷️ Category pricing:', {
        categoryName: category.name,
        useMetricPricing,
        designUpchargePerCm2,
        maxUpchargePercent,
        designAreaCm2: designAreaCm2.toFixed(2)
      })
      
      let upchargeAmount = 0
      let upchargeDetails = {}
      
      if (useMetricPricing) {
        // Metric-based pricing: charge per square centimeter
        upchargeAmount = designAreaCm2 * designUpchargePerCm2
        upchargeDetails = {
          areaCm2: designAreaCm2,
          pricePerCm2: designUpchargePerCm2,
          method: 'metric'
        }
        
        console.log('📏 Metric pricing calculation:', {
          areaCm2: designAreaCm2.toFixed(2),
          pricePerCm2: designUpchargePerCm2,
          upcharge: upchargeAmount.toFixed(2)
        })
      } else if (maxUpchargePercent > 0) {
        // Percentage-based pricing (legacy)
        const effectiveAreaPercentage = Math.max(1, designAreaPercentage)
        const scaledUpchargePercent = (effectiveAreaPercentage / 100) * maxUpchargePercent
        upchargeAmount = basePrice * (scaledUpchargePercent / 100)
        upchargeDetails = {
          upchargePercent: scaledUpchargePercent,
          areaPercent: effectiveAreaPercentage,
          maxUpchargePercent,
          method: 'percentage'
        }
        
        console.log('% Percentage pricing calculation:', {
          areaPercent: effectiveAreaPercentage.toFixed(2),
          scaledUpchargePercent: scaledUpchargePercent.toFixed(2),
          upcharge: upchargeAmount.toFixed(2)
        })
      }
      
      return { 
        basePrice, 
        designUpcharge: upchargeAmount, 
        totalPrice: basePrice + upchargeAmount,
        ...upchargeDetails
      }
    }
    
    return { 
      basePrice, 
      designUpcharge: 0, 
      totalPrice: basePrice, 
      upchargePercent: 0,
      areaPercent: 0,
      areaCm2: 0,
      pricePerCm2: 0
    }
  }
  
  const priceData = calculatePriceWithDesign()
  const displayPrice = formatPrice(priceData.totalPrice)
  
  // Update totals when sizes change
  const updateTotals = (sizes: SelectedSizeQuantity[]) => {
    const quantity = sizes.reduce((total, item) => total + item.quantity, 0)
    const pricePerItem = priceData.totalPrice // This includes design upcharge
    const price = quantity * pricePerItem
    
    setTotalQuantity(quantity)
    setTotalPrice(price)
  }

  // Generate preview image of product with design
  const generateDesignPreview = async () => {
    if (!hasDesignElements || typeof window === 'undefined') {
      return null
    }
    
    try {
      // Get the fabric canvas instance
      const fabricCanvas = (window as any).fabricCanvas
      if (!fabricCanvas) {
        console.error('Fabric canvas not found')
        return null
      }
      
      // Export the design as data URL (transparent background)
      const designDataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // Higher quality for better preview
      })
      
      // Create a new canvas to composite product and design
      const compositeCanvas = document.createElement('canvas')
      const ctx = compositeCanvas.getContext('2d')
      if (!ctx) return null
      
      compositeCanvas.width = 400
      compositeCanvas.height = 400
      
      // Load and draw product image
      const productImg = document.createElement('img')
      productImg.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        productImg.onload = resolve
        productImg.onerror = reject
        productImg.src = product.image || '/placeholder.svg'
      })
      
      // Draw product centered
      const scale = Math.min(400 / productImg.width, 400 / productImg.height) * 0.9
      const x = (400 - productImg.width * scale) / 2
      const y = (400 - productImg.height * scale) / 2
      ctx.drawImage(productImg, x, y, productImg.width * scale, productImg.height * scale)
      
      // Load and draw design overlay
      const designImg = document.createElement('img')
      await new Promise((resolve, reject) => {
        designImg.onload = resolve
        designImg.onerror = reject
        designImg.src = designDataURL
      })
      
      // Draw design on top (centered on product)
      const designScale = scale * 0.4 // Make design 40% of product size
      const canvasWidth = fabricCanvas.width || 300
      const canvasHeight = fabricCanvas.height || 300
      const designX = (400 - canvasWidth * designScale) / 2
      const designY = (400 - canvasHeight * designScale) / 2
      ctx.drawImage(designImg, designX, designY, canvasWidth * designScale, canvasHeight * designScale)
      
      // Return composite image as data URL
      return compositeCanvas.toDataURL('image/png')
    } catch (error) {
      console.error('Failed to generate design preview:', error)
      return null
    }
  }
  
  // Handle adding to cart
  const handleAddToCart = async () => {
    if (totalQuantity === 0) return
    
    // Get the current design canvas data if there are design elements
    let designCanvasJSON = null
    let designPreview = null
    let designContext = null
    
    if (hasDesignElements && typeof window !== 'undefined') {
      const canvasJSON = localStorage.getItem('designCanvasJSON')
      if (canvasJSON) {
        try {
          designCanvasJSON = JSON.parse(canvasJSON)
        } catch (e) {
          console.error('Failed to parse canvas JSON:', e)
          designCanvasJSON = canvasJSON // Use as-is if parsing fails
        }
      }
      
      // Generate preview image
      designPreview = await generateDesignPreview()
      console.log('🖼️ Design preview generated:', designPreview ? 'Success' : 'Failed')
      
      // Build design context with all necessary information
      designContext = {
        viewMode: viewMode,
        productColor: productColor,
        selectedVariation: product.variations?.find((v: any) => v.colorName === productColor),
        hasDesign: true,
        designUpcharge: priceData.designUpcharge,
        designAreaPercentage: priceData.areaPercent,
        designAreaCm2: priceData.areaCm2 || 0,
        pricingMethod: priceData.method || 'percentage'
      }
    }
    
    // Prepare the product data with updated price
    const productWithDesign = {
      ...product,
      price: priceData.totalPrice, // Update price to include design upcharge
      image: designPreview || product.image || '/placeholder.svg'
    }
    
    // Prepare selected sizes with correct price
    const sizesWithPrice = selectedSizes.map(sizeItem => ({
      ...sizeItem,
      price: priceData.totalPrice // Each size gets the price with design upcharge
    }))
    
    // Use the proper cart method that handles design data
    dispatch(addToCartWithSizes({
      product: productWithDesign,
      selectedSizes: sizesWithPrice,
      designPreview: designPreview || undefined,
      designId: hasDesignElements ? `design-${Date.now()}` : undefined,
      designContext: designContext,
      designCanvasJSON: designCanvasJSON
    }) as any)
    
    // Show success message
    toast.success(`Added ${totalQuantity} items to cart with${hasDesignElements ? ' your custom design!' : 'out design'}`)
    
    // Reset selection
    setSelectedSizes([])
    setTotalQuantity(0)
    setTotalPrice(0)
  }
  
  // Handle immediate checkout
  const handleCheckout = () => {
    if (totalQuantity === 0) return
    
    // Add to cart first
    handleAddToCart()
    
    // Then redirect to checkout
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col h-full p-4 lg:p-6">
      <div className="space-y-4 lg:space-y-6">
        {/* Product Header */}
        <div className="space-y-3">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
          <div className="flex items-center space-x-2 mb-3">
            <Leaf className="w-4 h-4 text-green-600" />
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Eco-friendly
            </Badge>
          </div>
          {/* Price Display with Design Breakdown */}
          {hasDesignElements && priceData.designUpcharge > 0 ? (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium">{formatPrice(priceData.basePrice)}</span>
              </div>
              {priceData.method === 'metric' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Design Area:</span>
                    <span className="font-medium">{priceData.areaCm2?.toFixed(1)} cm²</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">✓ Design Charge ({priceData.pricePerCm2} kr/cm²):</span>
                    <span className="font-medium text-green-600">+{formatPrice(priceData.designUpcharge)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Design Area:</span>
                    <span className="font-medium">{priceData.areaPercent?.toFixed(1)}% of product</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">✓ Design Charge ({priceData.upchargePercent?.toFixed(1)}%):</span>
                    <span className="font-medium text-green-600">+{formatPrice(priceData.designUpcharge)}</span>
                  </div>
                </>
              )}
              {priceData.method === 'metric' ? (
                <div className="text-xs text-gray-500 italic">
                  Charged per square centimeter of design
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">
                  Max {priceData.maxUpchargePercent}% for full coverage
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-gray-900">{displayPrice}</span>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">{displayPrice}</div>
          )}
        </div>

        {/* Color Variations - show only if real variations exist */}
        {variations.length > 0 && (
          <div className="space-y-4">
            <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-black" />
                  <span className="font-bold uppercase">Select Variant</span>
                </div>
                {(() => {
                  const variation = getCurrentVariation()
                  if (!variation) return null
                  const colorName = typeof variation.color === 'object' && variation.color?.name 
                    ? variation.color.name 
                    : typeof variation.color === 'string' 
                    ? variation.color 
                    : "Selected"
                  return (
                    <Badge className="bg-black text-white">
                      {String(colorName)}
                    </Badge>
                  )
                })()}
              </div>
              
              <div className="grid grid-cols-5 gap-3">
                {variations.map((variation: any, index: number) => {
                  const isSelected = productColor === variation.color.hex_code
                  
                  return (
                    <div key={variation.id} className="flex flex-col items-center gap-1">
                      <button
                        className={`w-14 h-14 rounded-lg border-2 transition-all duration-200 relative ${
                          isSelected 
                            ? "border-black ring-2 ring-gray-400 scale-110 shadow-lg" 
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: variation.color.hex_code }}
                        onClick={() => handleColorChange(variation.color.hex_code)}
                        title={variation.color.name || `Color ${index + 1}`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {variation.inStock === false && (
                          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">OUT</span>
                          </div>
                        )}
                      </button>
                      <span className="text-xs text-center text-gray-600 max-w-[56px] truncate">
                        {variation.color.name || `Var ${index + 1}`}
                      </span>
                    </div>
                  )
                })}
              </div>
              
              {getCurrentVariation() && (
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Variant Price:</span>
                    <span className="font-bold">{formatPrice(parsePriceToNumber(getCurrentVariation().price))}</span>
                  </div>
                  {getCurrentVariation().inStock === false && (
                    <div className="mt-2 text-red-600 text-sm font-medium">
                      ⚠️ This variant is out of stock
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Angle Selector - Show available views for current variant/product */}
        {(getCurrentVariation() || product) && (
          <div className="space-y-3">
            <div className="border-2 border-black rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-black" />
                  <span className="font-bold uppercase">View Angle</span>
                </div>
                <Badge className="bg-black text-white">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {/* Get available angles from current variant or product */}
                {(() => {
                  const currentVar = getCurrentVariation()
                  const availableAngles = new Set<string>()
                  
                  // For products with variations, check what angles have images
                  if (currentVar && currentVar.images) {
                    currentVar.images.forEach((img: any) => {
                      if (img.angle && img.url) {
                        availableAngles.add(img.angle)
                      }
                    })
                  }
                  
                  // Also check product level angles
                  if (product.angles) {
                    product.angles.forEach((angle: string) => availableAngles.add(angle))
                  }
                  
                  // Default angles if none specified
                  if (availableAngles.size === 0) {
                    availableAngles.add('front')
                    availableAngles.add('back')
                  }
                  
                  const angleButtons = [
                    { id: 'front', label: 'Front', icon: '👕' },
                    { id: 'back', label: 'Back', icon: '🔄' },
                    { id: 'left', label: 'Left', icon: '⬅️' },
                    { id: 'right', label: 'Right', icon: '➡️' }
                  ]
                  
                  return angleButtons.map(angle => {
                    const isAvailable = availableAngles.has(angle.id)
                    const isSelected = viewMode === angle.id
                    
                    return (
                      <button
                        key={angle.id}
                        onClick={() => isAvailable && handleViewChange(angle.id)}
                        disabled={!isAvailable}
                        className={`
                          p-3 rounded-lg border-2 transition-all duration-200
                          ${isSelected 
                            ? 'border-black bg-black text-white shadow-lg scale-105' 
                            : isAvailable
                              ? 'border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg">{angle.icon}</span>
                          <span className="text-xs font-bold uppercase">{angle.label}</span>
                        </div>
                      </button>
                    )
                  })
                })()}
              </div>
              
              <div className="mt-3 text-xs text-gray-600 text-center">
                Click to switch between different product views
              </div>
            </div>
          </div>
        )}

        {/* No fake/dummy color swatches for non-variation products */}

        {/* Size Selection (if product has sizes) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Select Sizes & Quantities</span>
            </div>
            <div className="space-y-2">
              {product.sizes.map((size: string) => {
                const sizeItem = selectedSizes.find(s => s.size === size)
                const quantity = sizeItem?.quantity || 0
                
                return (
                  <div key={size} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 min-w-[60px]">{size}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newSizes = [...selectedSizes]
                          const existing = newSizes.find(s => s.size === size)
                          if (existing) {
                            if (existing.quantity > 0) {
                              existing.quantity--
                              if (existing.quantity === 0) {
                                const index = newSizes.indexOf(existing)
                                newSizes.splice(index, 1)
                              }
                            }
                          }
                          setSelectedSizes(newSizes)
                          updateTotals(newSizes)
                        }}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                        disabled={quantity === 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => {
                          const newSizes = [...selectedSizes]
                          const existing = newSizes.find(s => s.size === size)
                          if (existing) {
                            existing.quantity++
                          } else {
                            newSizes.push({ size, quantity: 1 })
                          }
                          setSelectedSizes(newSizes)
                          updateTotals(newSizes)
                        }}
                        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quantity Selection (if product doesn't have sizes) */}
        {(!product.sizes || product.sizes.length === 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quantity</span>
            </div>
            <div className="flex items-center justify-center gap-4 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => {
                  const newQty = Math.max(0, (selectedSizes[0]?.quantity || 0) - 1)
                  const newSizes = newQty > 0 ? [{ size: 'One Size', quantity: newQty }] : []
                  setSelectedSizes(newSizes)
                  updateTotals(newSizes)
                }}
                className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-bold min-w-[40px] text-center">
                {selectedSizes[0]?.quantity || 0}
              </span>
              <button
                onClick={() => {
                  const currentQty = selectedSizes[0]?.quantity || 0
                  const newSizes = [{ size: 'One Size', quantity: currentQty + 1 }]
                  setSelectedSizes(newSizes)
                  updateTotals(newSizes)
                }}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Total Summary */}
        {totalQuantity > 0 && (
          <div className="bg-blue-50 rounded-xl p-3 space-y-2 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Items:</span>
              <span className="text-sm font-bold text-gray-900">{totalQuantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Price:</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
          <Truck className="w-4 h-4 text-gray-600" />
          <span>Free delivery: 5-7 business days</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            onClick={handleAddToCart}
            disabled={totalQuantity === 0}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart {totalQuantity > 0 && `(${totalQuantity})`}
          </Button>
          
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={handleCheckout}
            disabled={totalQuantity === 0}
          >
            Checkout Now {totalQuantity > 0 && `- ${formatPrice(totalPrice)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}