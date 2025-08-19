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
  // Only show if we have angles and variation images
  // No fallbacks - only show what admins actually uploaded
  if (!angles || angles.length <= 1) return null
  
  // Check if we have valid variation images to display
  const hasValidImages = variationImages.some(img => img.url && img.url.trim() !== '')
  
  if (!hasValidImages) return null

  // Helper to get image for a specific angle
  const getImageForAngle = (angle: string) => {
    // Only use variation images - no fallbacks
    if (variationImages.length > 0) {
      // Find the specific angle image from variation images
      const specificAngleImage = variationImages.find(img => img.angle === angle && img.url && img.url.trim() !== '')
      if (specificAngleImage) {
        console.log(`Found specific angle image for ${angle}:`, specificAngleImage.url)
        return specificAngleImage.url
      }
      
      // If no specific angle image found, don't show anything for this angle
      console.log(`No image found for angle ${angle} - skipping`)
      return null
    }
    
    // No fallback - return null if no variation images
    return null
  }

  // Debug logging
  console.log('ProductAnglesSelector Debug:', {
    angles,
    selectedAngle,
    variationImagesCount: variationImages.length,
    variationImages: variationImages.map(img => ({ angle: img.angle, url: img.url, isValid: img.url && img.url.trim() !== '' })),
    hasValidImages
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
    <div className={`${className}`}>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
          {angles.map((angle) => {
            const isSelected = selectedAngle === angle
            const imageUrl = getImageForAngle(angle)
            
            // Skip angles that don't have images
            if (!imageUrl) {
              return null
            }
            
            return (
              <div 
                key={angle}
                className={`relative w-12 h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-md scale-105' 
                    : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:scale-105'
                }`}
                onClick={() => onSelect(angle)}
                title={getAngleDisplayName(angle)}
              >
                <Image
                  src={imageUrl}
                  alt={`${getAngleDisplayName(angle)} view`}
                  fill
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                  </div>
                )}
                {/* Label overlay on hover or mobile */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-1 text-center opacity-0 hover:opacity-100 transition-opacity duration-200 lg:hidden">
                  {getAngleDisplayName(angle)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}