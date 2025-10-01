/**
 * Comprehensive pricing utilities for consistent calculations across the application
 * Handles base product pricing, design costs, size variations, and total calculations
 */

import { CartItem, CartItemSize } from "@/types"

export interface PricingBreakdown {
  basePrice: number
  designCost: number
  totalPrice: number
  designAreaCm2: number
  costPerCm2: number
  objectCount: number
  breakdown: {
    objectCount: number
    boundingBox: { width: number; height: number }
    frameUsagePercentage: number
  }
}

export interface CartItemPricing {
  itemId: string
  basePrice: number
  designCost: number
  totalPrice: number
  quantity: number
  subtotal: number
  hasDesign: boolean
  designAreaCm2: number
}

/**
 * Calculate design cost based on area and cost per cm²
 */
export function calculateDesignCost(
  designAreaCm2: number,
  costPerCm2: number = 0.5
): number {
  return Math.round(designAreaCm2 * costPerCm2 * 100) / 100
}

/**
 * Calculate total price for a single cart item
 */
export function calculateCartItemPrice(item: CartItem): CartItemPricing {
  let basePrice = 0
  
  // Handle different price formats
  if (typeof item.price === 'number') {
    basePrice = item.price
  } else if (typeof item.price === 'string') {
    const cleanPrice = item.price.replace(/[^\d.-]/g, '')
    basePrice = parseFloat(cleanPrice) || 0
  }
  
  // Calculate design cost
  const designCost = item.designCosts?.totalDesignCost || 0
  const designAreaCm2 = item.designCosts?.totalDesignAreaCm2 || 0
  const hasDesign = designAreaCm2 > 0
  
  // Calculate total price per unit
  const totalPrice = basePrice + designCost
  
  // Calculate subtotal for this item
  const subtotal = totalPrice * item.quantity
  
  return {
    itemId: item.id,
    basePrice,
    designCost,
    totalPrice,
    quantity: item.quantity,
    subtotal,
    hasDesign,
    designAreaCm2
  }
}

/**
 * Calculate total cart pricing with breakdown
 */
export function calculateCartTotal(cartItems: CartItem[]): {
  subtotal: number
  totalDesignCost: number
  totalBasePrice: number
  totalQuantity: number
  itemBreakdown: CartItemPricing[]
  hasAnyDesigns: boolean
} {
  const itemBreakdown = cartItems.map(calculateCartItemPrice)
  
  const subtotal = itemBreakdown.reduce((sum, item) => sum + item.subtotal, 0)
  const totalDesignCost = itemBreakdown.reduce((sum, item) => sum + (item.designCost * item.quantity), 0)
  const totalBasePrice = itemBreakdown.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0)
  const totalQuantity = itemBreakdown.reduce((sum, item) => sum + item.quantity, 0)
  const hasAnyDesigns = itemBreakdown.some(item => item.hasDesign)
  
  return {
    subtotal,
    totalDesignCost,
    totalBasePrice,
    totalQuantity,
    itemBreakdown,
    hasAnyDesigns
  }
}

/**
 * Calculate pricing for size-based cart items
 */
export function calculateSizeBasedPricing(
  selectedSizes: CartItemSize[],
  designCost: number = 0
): {
  totalQuantity: number
  totalBasePrice: number
  totalDesignCost: number
  totalPrice: number
  sizeBreakdown: Array<{
    size: string
    quantity: number
    price: number
    designCost: number
    totalPrice: number
    subtotal: number
  }>
} {
  const sizeBreakdown = selectedSizes.map(size => {
    const totalPrice = size.price + designCost
    const subtotal = totalPrice * size.quantity
    
    return {
      size: size.size,
      quantity: size.quantity,
      price: size.price,
      designCost,
      totalPrice,
      subtotal
    }
  })
  
  const totalQuantity = sizeBreakdown.reduce((sum, item) => sum + item.quantity, 0)
  const totalBasePrice = sizeBreakdown.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalDesignCost = sizeBreakdown.reduce((sum, item) => sum + (item.designCost * item.quantity), 0)
  const totalPrice = sizeBreakdown.reduce((sum, item) => sum + item.subtotal, 0)
  
  return {
    totalQuantity,
    totalBasePrice,
    totalDesignCost,
    totalPrice,
    sizeBreakdown
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'SEK'): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

/**
 * Calculate design area from canvas objects
 */
export function calculateDesignAreaFromCanvas(
  canvas: any,
  canvasScale: number = 1
): {
  areaCm2: number
  areaPercentage: number
  objectCount: number
  boundingBox: { width: number; height: number }
} {
  if (!canvas || canvas.disposed) {
    return {
      areaCm2: 0,
      areaPercentage: 0,
      objectCount: 0,
      boundingBox: { width: 0, height: 0 }
    }
  }
  
  const objects = canvas.getObjects().filter((obj: any) => 
    !obj.excludeFromExport && 
    obj.visible &&
    !obj.isBoundaryIndicator
  )
  
  if (objects.length === 0) {
    return {
      areaCm2: 0,
      areaPercentage: 0,
      objectCount: 0,
      boundingBox: { width: 0, height: 0 }
    }
  }
  
  const canvasWidth = canvas.getWidth()
  const canvasHeight = canvas.getHeight()
  const canvasArea = canvasWidth * canvasHeight
  
  // Canvas is 600x600 pixels. Standard print area is typically 30x30 cm for a t-shirt
  // So 1 pixel = 0.05 cm (30cm / 600px)
  // Area of 1 pixel² = 0.0025 cm² (0.05 * 0.05)
  const PIXELS_TO_CM2 = 0.0025
  
  let totalDesignArea = 0
  let totalDesignAreaCm2 = 0
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  
  objects.forEach((obj: any) => {
    const boundingRect = obj.getBoundingRect(true, true)
    const objectArea = boundingRect.width * boundingRect.height
    const objectAreaCm2 = objectArea * PIXELS_TO_CM2
    
    totalDesignArea += objectArea
    totalDesignAreaCm2 += objectAreaCm2
    
    // Calculate bounding box
    minX = Math.min(minX, boundingRect.left)
    minY = Math.min(minY, boundingRect.top)
    maxX = Math.max(maxX, boundingRect.left + boundingRect.width)
    maxY = Math.max(maxY, boundingRect.top + boundingRect.height)
  })
  
  const areaPercentage = Math.min(100, (totalDesignArea / canvasArea) * 100)
  const boundingBox = {
    width: Math.round((maxX - minX) * 0.05 * 10) / 10, // Convert to cm
    height: Math.round((maxY - minY) * 0.05 * 10) / 10 // Convert to cm
  }
  
  return {
    areaCm2: Math.round(totalDesignAreaCm2 * 100) / 100,
    areaPercentage: Math.round(areaPercentage * 10) / 10,
    objectCount: objects.length,
    boundingBox
  }
}

/**
 * Create design costs object for cart items
 */
export function createDesignCosts(
  areaCm2: number,
  costPerCm2: number,
  breakdown: {
    objectCount: number
    boundingBox: { width: number; height: number }
    frameUsagePercentage: number
  }
) {
  return {
    totalDesignAreaCm2: areaCm2,
    costPerCm2,
    totalDesignCost: calculateDesignCost(areaCm2, costPerCm2),
    breakdown
  }
}

/**
 * Validate pricing data
 */
export function validatePricingData(data: any): boolean {
  if (!data || typeof data !== 'object') return false
  
  const requiredFields = ['basePrice', 'designCost', 'totalPrice']
  return requiredFields.every(field => 
    typeof data[field] === 'number' && 
    data[field] >= 0 && 
    !isNaN(data[field])
  )
}
