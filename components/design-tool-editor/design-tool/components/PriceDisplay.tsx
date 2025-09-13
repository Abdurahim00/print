import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info, TrendingUp, Package, Palette } from 'lucide-react'
import { formatPrice, setupPriceMonitoring } from '@/lib/utils/designPricing'
import type { DesignFrame } from '@/types'

interface PriceDisplayProps {
  basePrice: number
  costPerCm2?: number
  frame?: DesignFrame
  canvasScale?: number
  currency?: string
  className?: string
  showBreakdown?: boolean
  onPriceChange?: (totalPrice: number) => void
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

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  basePrice,
  costPerCm2 = 0.5,
  frame,
  canvasScale = 1,
  currency = 'SEK',
  className = '',
  showBreakdown = true,
  onPriceChange
}) => {
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousPrice, setPreviousPrice] = useState(basePrice)

  useEffect(() => {
    // Get the fabric canvas
    const fabricCanvas = (window as any).fabricCanvas
    if (!fabricCanvas || fabricCanvas.disposed) return

    // Setup price monitoring
    const cleanup = setupPriceMonitoring(
      fabricCanvas,
      (calculation) => {
        setPriceCalculation(calculation)
        
        // Trigger animation on price change
        if (calculation.totalPrice !== previousPrice) {
          setIsAnimating(true)
          setPreviousPrice(calculation.totalPrice)
          setTimeout(() => setIsAnimating(false), 500)
        }

        // Notify parent
        onPriceChange?.(calculation.totalPrice)
      },
      basePrice,
      costPerCm2,
      frame,
      canvasScale
    )

    return cleanup
  }, [basePrice, costPerCm2, frame, canvasScale, onPriceChange])

  const totalPrice = priceCalculation?.totalPrice || basePrice
  const designCost = priceCalculation?.designCost || 0
  const hasDesign = (priceCalculation?.breakdown.objectCount || 0) > 0

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-3">
        {/* Main Price Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Total Price</span>
          </div>
          <div className={`text-2xl font-bold transition-all duration-300 ${
            isAnimating ? 'scale-110 text-blue-600' : 'text-gray-900'
          }`}>
            {formatPrice(totalPrice, currency)}
          </div>
        </div>

        {/* Price Breakdown */}
        {showBreakdown && (
          <>
            <Separator />
            <div className="space-y-2">
              {/* Base Price */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Base Product</span>
                <span className="font-medium">{formatPrice(basePrice, currency)}</span>
              </div>

              {/* Design Cost */}
              {hasDesign && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Palette className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Design Cost</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p>Area: {priceCalculation?.designAreaCm2 || 0} cm²</p>
                            <p>Rate: {formatPrice(costPerCm2, currency)}/cm²</p>
                            <p>Objects: {priceCalculation?.breakdown.objectCount || 0}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="font-medium text-green-600">
                    +{formatPrice(designCost, currency)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Design Stats */}
        {hasDesign && priceCalculation && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-500">Design Area</span>
                <span className="font-medium">
                  {priceCalculation.designAreaCm2} cm²
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Coverage</span>
                <span className="font-medium">
                  {priceCalculation.breakdown.frameUsagePercentage}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Dimensions</span>
                <span className="font-medium">
                  {priceCalculation.breakdown.boundingBox.width} × {priceCalculation.breakdown.boundingBox.height} cm
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Elements</span>
                <span className="font-medium">
                  {priceCalculation.breakdown.objectCount}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Price Indicator Badge */}
        {designCost > 0 && (
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Design adds {((designCost / basePrice) * 100).toFixed(0)}% to base price
            </Badge>
          </div>
        )}

        {/* No Design Message */}
        {!hasDesign && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">
              Add design elements to see pricing
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

// Compact version for smaller spaces
export const CompactPriceDisplay: React.FC<PriceDisplayProps> = ({
  basePrice,
  costPerCm2 = 0.5,
  frame,
  canvasScale = 1,
  currency = 'SEK',
  className = '',
  onPriceChange
}) => {
  const [totalPrice, setTotalPrice] = useState(basePrice)
  const [designCost, setDesignCost] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fabricCanvas = (window as any).fabricCanvas
    if (!fabricCanvas || fabricCanvas.disposed) return

    const cleanup = setupPriceMonitoring(
      fabricCanvas,
      (calculation) => {
        setTotalPrice(calculation.totalPrice)
        setDesignCost(calculation.designCost)
        
        // Trigger animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)

        onPriceChange?.(calculation.totalPrice)
      },
      basePrice,
      costPerCm2,
      frame,
      canvasScale
    )

    return cleanup
  }, [basePrice, costPerCm2, frame, canvasScale, onPriceChange])

  return (
    <div className={`flex items-center gap-3 px-3 py-2 bg-white rounded-lg border ${className}`}>
      <Package className="h-4 w-4 text-gray-500" />
      <div className="flex-1">
        <p className="text-xs text-gray-500">Total Price</p>
        <p className={`text-lg font-bold transition-all duration-300 ${
          isAnimating ? 'text-blue-600' : 'text-gray-900'
        }`}>
          {formatPrice(totalPrice, currency)}
        </p>
      </div>
      {designCost > 0 && (
        <Badge variant="outline" className="text-xs">
          +{formatPrice(designCost, currency)}
        </Badge>
      )}
    </div>
  )
}