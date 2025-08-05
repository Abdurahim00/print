import React from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import Image from "next/image"

interface ProductAnglesSelectorProps {
  angles: string[]
  selectedAngle: string
  onSelect: (angle: string) => void
  className?: string
  variationImages?: Array<{
    id: string
    url: string
    alt_text: string
    angle: string
    is_primary: boolean
  }>
  productImage?: string // Fallback product image
}

export const ProductAnglesSelector: React.FC<ProductAnglesSelectorProps> = ({
  angles,
  selectedAngle,
  onSelect,
  className = "",
  variationImages = [],
  productImage,
}) => {
  if (!angles || angles.length <= 1) return null

  // Helper to get image for a specific angle
  const getImageForAngle = (angle: string) => {
    // If we have variation images, prioritize them
    if (variationImages.length > 0) {
      // First try to find the specific angle image from variation images
      const specificAngleImage = variationImages.find(img => img.angle === angle && img.url)
      if (specificAngleImage) {
        return specificAngleImage.url
      }
      
      // If no specific angle image, use the primary image from the variation
      const primaryImage = variationImages.find(img => img.is_primary && img.url)
      if (primaryImage) {
        return primaryImage.url
      }
      
      // If no primary image, use any available image from the variation
      const anyVariationImage = variationImages.find(img => img.url)
      if (anyVariationImage) {
        return anyVariationImage.url
      }
    }
    
    // Fallback to product image
    return productImage || "/placeholder.svg"
  }

  // Debug logging
  console.log('ProductAnglesSelector Debug:', {
    angles,
    selectedAngle,
    variationImagesCount: variationImages.length,
    variationImages: variationImages.map(img => ({ angle: img.angle, url: img.url })),
    productImage
  })

  // Helper to get display name for angle
  const getAngleDisplayName = (angle: string) => {
    const angleNames: { [key: string]: string } = {
      front: "Front",
      back: "Back", 
      side: "Side",
      left: "Left",
      right: "Right",
      material: "Material"
    }
    return angleNames[angle] || angle.charAt(0).toUpperCase() + angle.slice(1)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <RotateCcw className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">Product Angles</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {angles.map((angle) => {
          const isSelected = selectedAngle === angle
          const imageUrl = getImageForAngle(angle)
          
          return (
            <div key={angle} className="flex flex-col items-center space-y-2">
              <div 
                className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 `}
                onClick={() => onSelect(angle)}
              >
                <Image
                  src={imageUrl}
                  alt={`${getAngleDisplayName(angle)} view`}
                  fill
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-sky-500" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-700 capitalize">
                {getAngleDisplayName(angle)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}