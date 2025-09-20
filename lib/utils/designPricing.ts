import * as fabric from 'fabric'

// Constants for conversion
const CM_TO_PX_RATIO = 37.795 // 1 cm = 37.795 pixels at 96 DPI
const CANVAS_REFERENCE_SIZE = 600 // Reference canvas size for calculations

interface DesignFrame {
  width: number // Width in cm
  height: number // Height in cm
  widthPx: number // Width in pixels
  heightPx: number // Height in pixels
  costPerCm2?: number // Cost per square centimeter
}

interface PriceCalculation {
  basePrice: number
  designAreaCm2: number
  designCost: number
  totalPrice: number
  breakdown: {
    objectCount: number
    boundingBox: {
      width: number
      height: number
    }
    frameUsagePercentage: number
  }
}

/**
 * Calculate the bounding box of all design objects on the canvas
 */
export function calculateDesignBoundingBox(canvas: fabric.Canvas): { width: number; height: number; area: number } {
  // Check if canvas is valid and not disposed
  if (!canvas || (canvas as any).disposed) {
    return { width: 0, height: 0, area: 0 }
  }

  let objects: fabric.Object[] = []
  try {
    objects = canvas.getObjects().filter(obj => 
      !obj.excludeFromExport && 
      obj.visible &&
      !(obj as any).isBoundaryIndicator
    )
  } catch (error) {
    console.warn('Error getting canvas objects:', error)
    return { width: 0, height: 0, area: 0 }
  }

  if (objects.length === 0) {
    return { width: 0, height: 0, area: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  objects.forEach(obj => {
    const bounds = obj.getBoundingRect()
    minX = Math.min(minX, bounds.left)
    minY = Math.min(minY, bounds.top)
    maxX = Math.max(maxX, bounds.left + bounds.width)
    maxY = Math.max(maxY, bounds.top + bounds.height)
  })

  const width = maxX - minX
  const height = maxY - minY
  const area = width * height

  return { width, height, area }
}

/**
 * Convert pixel dimensions to centimeters
 */
export function pixelsToCm(pixels: number, canvasScale: number = 1): number {
  const adjustedPixels = pixels / canvasScale
  return adjustedPixels / CM_TO_PX_RATIO
}

/**
 * Convert centimeters to pixels
 */
export function cmToPixels(cm: number, canvasScale: number = 1): number {
  return cm * CM_TO_PX_RATIO * canvasScale
}

/**
 * Calculate design area in square centimeters
 */
export function calculateDesignAreaCm2(
  canvas: fabric.Canvas,
  frame?: DesignFrame,
  canvasScale: number = 1
): number {
  const boundingBox = calculateDesignBoundingBox(canvas)
  
  if (boundingBox.area === 0) {
    return 0
  }

  // Convert pixel area to cm²
  const widthCm = pixelsToCm(boundingBox.width, canvasScale)
  const heightCm = pixelsToCm(boundingBox.height, canvasScale)
  let areaCm2 = widthCm * heightCm

  // If frame is provided, cap the area to frame size
  if (frame) {
    const maxAreaCm2 = frame.width * frame.height
    areaCm2 = Math.min(areaCm2, maxAreaCm2)
  }

  return Math.round(areaCm2 * 100) / 100 // Round to 2 decimal places
}

/**
 * Calculate the percentage of canvas/frame used by the design
 */
export function calculateDesignCoverage(
  canvas: fabric.Canvas,
  frame?: DesignFrame
): number {
  // Check if canvas is valid
  if (!canvas || (canvas as any).disposed) {
    return 0
  }

  const boundingBox = calculateDesignBoundingBox(canvas)
  
  if (boundingBox.area === 0) {
    return 0
  }

  let totalArea: number
  if (frame) {
    totalArea = frame.widthPx * frame.heightPx
  } else {
    try {
      totalArea = canvas.getWidth() * canvas.getHeight()
    } catch (error) {
      console.warn('Error getting canvas dimensions:', error)
      return 0
    }
  }

  const coverage = (boundingBox.area / totalArea) * 100
  return Math.round(coverage * 10) / 10 // Round to 1 decimal place
}

/**
 * Calculate total price including design costs
 */
export function calculateDesignPrice(
  basePrice: number,
  canvas: fabric.Canvas,
  costPerCm2: number = 0.5,
  frame?: DesignFrame,
  canvasScale: number = 1
): PriceCalculation {
  // Check if canvas is valid
  if (!canvas || (canvas as any).disposed) {
    return {
      basePrice,
      designAreaCm2: 0,
      designCost: 0,
      totalPrice: basePrice,
      breakdown: {
        objectCount: 0,
        boundingBox: { width: 0, height: 0 },
        frameUsagePercentage: 0
      }
    }
  }

  const boundingBox = calculateDesignBoundingBox(canvas)
  const designAreaCm2 = calculateDesignAreaCm2(canvas, frame, canvasScale)
  const frameUsagePercentage = calculateDesignCoverage(canvas, frame)
  
  // Use frame-specific cost if available
  const effectiveCostPerCm2 = frame?.costPerCm2 || costPerCm2
  const designCost = designAreaCm2 * effectiveCostPerCm2
  const totalPrice = basePrice + designCost

  // Get object count safely
  let objectCount = 0
  try {
    objectCount = canvas.getObjects().filter(obj => 
      !obj.excludeFromExport && 
      obj.visible &&
      !(obj as any).isBoundaryIndicator
    ).length
  } catch (error) {
    console.warn('Error counting canvas objects:', error)
  }

  return {
    basePrice,
    designAreaCm2,
    designCost: Math.round(designCost * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    breakdown: {
      objectCount,
      boundingBox: {
        width: Math.round(pixelsToCm(boundingBox.width, canvasScale) * 10) / 10,
        height: Math.round(pixelsToCm(boundingBox.height, canvasScale) * 10) / 10
      },
      frameUsagePercentage
    }
  }
}

/**
 * Monitor canvas changes and update pricing in real-time
 */
export function setupPriceMonitoring(
  canvas: fabric.Canvas,
  onPriceUpdate: (calculation: PriceCalculation) => void,
  basePrice: number,
  costPerCm2: number = 0.5,
  frame?: DesignFrame,
  canvasScale: number = 1
) {
  // Check if canvas is valid
  if (!canvas || (canvas as any).disposed) {
    console.warn('Cannot setup price monitoring on invalid canvas')
    return () => {} // Return empty cleanup function
  }

  const updatePrice = () => {
    // Check canvas validity before each update
    if (!canvas || (canvas as any).disposed) {
      return
    }

    const calculation = calculateDesignPrice(
      basePrice,
      canvas,
      costPerCm2,
      frame,
      canvasScale
    )
    onPriceUpdate(calculation)
  }

  // Initial calculation
  updatePrice()

  // Monitor canvas events
  const events = [
    'object:added',
    'object:removed',
    'object:modified',
    'object:scaling',
    'object:moving',
    'object:rotating',
    'path:created',
    'text:changed'
  ]

  try {
    events.forEach(event => {
      canvas.on(event, updatePrice)
    })
  } catch (error) {
    console.warn('Error setting up canvas event listeners:', error)
  }

  // Return cleanup function
  return () => {
    try {
      if (canvas && !(canvas as any).disposed) {
        events.forEach(event => {
          canvas.off(event, updatePrice)
        })
      }
    } catch (error) {
      console.warn('Error cleaning up canvas event listeners:', error)
    }
  }
}

/**
 * Validate price calculation against backend rules
 */
export async function validatePriceWithBackend(
  productId: string,
  variationId: string | null,
  designAreaCm2: number,
  canvasJSON: any
): Promise<{ valid: boolean; serverPrice: number; message?: string }> {
  try {
    const response = await fetch('/api/design/validate-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        variationId,
        designAreaCm2,
        objectCount: canvasJSON.objects?.length || 0
      })
    })

    if (!response.ok) {
      throw new Error('Price validation failed')
    }

    const data = await response.json()
    return {
      valid: data.valid,
      serverPrice: data.price,
      message: data.message
    }
  } catch (error) {
    console.error('Price validation error:', error)
    return {
      valid: false,
      serverPrice: 0,
      message: 'Unable to validate price'
    }
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'SEK'): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

/**
 * Calculate bulk discount if applicable
 */
export function calculateBulkDiscount(
  basePrice: number,
  quantity: number,
  discountTiers: Array<{ minQty: number; discount: number }> = []
): { discountedPrice: number; discountPercentage: number } {
  let discountPercentage = 0

  // Find applicable discount tier
  const sortedTiers = [...discountTiers].sort((a, b) => b.minQty - a.minQty)
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQty) {
      discountPercentage = tier.discount
      break
    }
  }

  const discountedPrice = basePrice * (1 - discountPercentage / 100)
  
  return {
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    discountPercentage
  }
}