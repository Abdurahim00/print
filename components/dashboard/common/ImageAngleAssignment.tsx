"use client"

import React, { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import Image from "next/image"
import { Eye, Upload, X, Check, Image as ImageIcon } from "lucide-react"
import type { Variation, VariationImage, Product } from "@/types"

interface ImageAngleAssignmentProps {
  product: Partial<Product>
  formik: any
  t: any
}

const angles = [
  { id: "front", label: "Front View", field: "frontImage" },
  { id: "back", label: "Back View", field: "backImage" },
  { id: "left", label: "Left Side", field: "leftImage" },
  { id: "right", label: "Right Side", field: "rightImage" },
  { id: "material", label: "Material/Detail", field: "materialImage" },
]

export function ImageAngleAssignment({ product, formik, t }: ImageAngleAssignmentProps) {
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>(() => {
    // Initialize on client side only
    const initial: Record<string, string> = {}
    if (typeof window !== 'undefined') {
      angles.forEach(angle => {
        if (formik.values[angle.field]) {
          initial[angle.field] = formik.values[angle.field]
        }
      })
    }
    return initial
  })
  const [previewAngle, setPreviewAngle] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Ensure component is mounted before rendering interactive elements
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Initialize with existing angle images
  useEffect(() => {
    if (mounted) {
      const initial: Record<string, string> = {}
      angles.forEach(angle => {
        const value = formik.values[angle.field]
        if (value && value !== "") {
          initial[angle.field] = value
        }
      })
      // Only update if there's a difference to avoid infinite loops
      setSelectedImages(prev => {
        const isDifferent = JSON.stringify(prev) !== JSON.stringify(initial)
        return isDifferent ? initial : prev
      })
    }
  }, [mounted]) // Remove formik.values from dependencies to avoid infinite loops

  // Get all available images from variations
  const availableImages = React.useMemo(() => {
    const images: { url: string; label: string; variationId?: string }[] = []
    
    // Add main product image if exists
    if (product.image) {
      images.push({ url: product.image, label: "Main Product Image" })
    }
    
    // Add all variation images
    if (product.variations && product.variations.length > 0) {
      product.variations.forEach((variation: Variation) => {
        const colorName = variation.color?.name || `Variation ${variation.id}`
        
        if (variation.images && variation.images.length > 0) {
          variation.images.forEach((img: VariationImage, index: number) => {
            if (img.url) {
              images.push({
                url: img.url,
                label: `${colorName} - ${img.angle || `View ${index + 1}`}`,
                variationId: variation.id
              })
            }
          })
        }
      })
    }
    
    // Add any existing angle images that might not be in variations
    angles.forEach(angle => {
      const existingUrl = formik.values[angle.field]
      if (existingUrl && !images.find(img => img.url === existingUrl)) {
        images.push({
          url: existingUrl,
          label: `Current ${angle.label}`
        })
      }
    })
    
    return images
  }, [product, formik.values])

  const handleImageSelect = (angleField: string, imageUrl: string) => {
    // Handle "none" selection - clear the current assignment for this image
    if (angleField === "none") {
      // Find which angle this image is currently assigned to and clear it
      const currentAngle = Object.keys(selectedImages).find(key => selectedImages[key] === imageUrl)
      if (currentAngle) {
        setSelectedImages(prev => {
          const updated = { ...prev }
          delete updated[currentAngle]
          return updated
        })
        formik.setFieldValue(currentAngle, "")
      }
      return
    }
    
    // Clear any previous assignment of this image to another angle
    const previousAngle = Object.keys(selectedImages).find(key => selectedImages[key] === imageUrl)
    if (previousAngle && previousAngle !== angleField) {
      formik.setFieldValue(previousAngle, "")
    }
    
    // Set the new assignment
    setSelectedImages(prev => ({
      ...prev,
      [angleField]: imageUrl
    }))
    formik.setFieldValue(angleField, imageUrl)
  }

  const handleImageUpload = async (angleField: string, file: File) => {
    try {
      // Convert file to base64 or upload to storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        handleImageSelect(angleField, base64String)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  const handleRemoveImage = (angleField: string) => {
    setSelectedImages(prev => {
      const updated = { ...prev }
      delete updated[angleField]
      return updated
    })
    formik.setFieldValue(angleField, "")
    // Also clear the alt text field if it exists
    const altTextField = angleField.replace('Image', 'AltText')
    if (formik.values[altTextField]) {
      formik.setFieldValue(altTextField, "")
    }
  }

  // Don't render interactive elements until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Product Angle Images</Label>
          <span className="text-sm text-muted-foreground">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Product Angle Images</Label>
        <span className="text-sm text-muted-foreground">
          Assign images to different product angles
        </span>
      </div>

      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assign">Assign from Variations</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="assign" className="space-y-4">
          {availableImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableImages.map((img, index) => {
                const assignedAngle = Object.keys(selectedImages).find(key => selectedImages[key] === img.url)
                const isAssigned = !!assignedAngle
                const assignedAngleLabel = angles.find(a => a.field === assignedAngle)?.label
                
                return (
                  <Card key={index} className={`overflow-hidden ${isAssigned ? 'ring-2 ring-green-500' : ''}`}>
                    <div className="relative aspect-square">
                      <Image
                        src={img.url}
                        alt={img.label}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-xs text-white truncate">{img.label}</p>
                      </div>
                      {isAssigned && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          {assignedAngleLabel}
                        </div>
                      )}
                    </div>
                  <CardContent className="p-2">
                    <Select
                      onValueChange={(value) => handleImageSelect(value, img.url)}
                      value={Object.keys(selectedImages).find(key => selectedImages[key] === img.url) || "none"}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {angles.map(angle => (
                          <SelectItem 
                            key={angle.field} 
                            value={angle.field}
                            disabled={selectedImages[angle.field] && selectedImages[angle.field] !== img.url}
                          >
                            {angle.label}
                            {selectedImages[angle.field] && selectedImages[angle.field] !== img.url && " (in use)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No variation images available</p>
              <p className="text-sm mt-1">Upload images in the Upload tab</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-4">
            {angles.map(angle => (
              <div key={angle.field} className="flex items-center gap-4">
                <div className="w-32">
                  <Label>{angle.label}</Label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  {selectedImages[angle.field] ? (
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative h-16 w-16 border rounded overflow-hidden">
                        <Image
                          src={selectedImages[angle.field]}
                          alt={angle.label}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground flex-1 truncate">
                        {selectedImages[angle.field].startsWith('data:') 
                          ? 'Uploaded image' 
                          : selectedImages[angle.field].split('/').pop()}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewAngle(angle.field)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(angle.field)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(angle.field, file)
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Current Angle Assignments Summary */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <Label className="text-sm font-semibold mb-3 block">Current Assignments</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {angles.map(angle => (
            <div key={angle.field} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${selectedImages[angle.field] ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm">
                {angle.label}: {selectedImages[angle.field] ? <Check className="inline h-3 w-3 text-green-500" /> : <X className="inline h-3 w-3 text-gray-400" />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewAngle && selectedImages[previewAngle] && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewAngle(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh]">
            <Image
              src={selectedImages[previewAngle]}
              alt="Preview"
              width={800}
              height={600}
              className="object-contain"
            />
            <Button
              className="absolute top-2 right-2"
              variant="ghost"
              size="icon"
              onClick={() => setPreviewAngle(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}