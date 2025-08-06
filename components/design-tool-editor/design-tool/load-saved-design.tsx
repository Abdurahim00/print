"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { setSelectedProduct, setProductColor, setViewMode } from "@/lib/redux/designToolSlices/designSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface LoadSavedDesignProps {
  onDesignLoaded: (canvasJSON: any) => void
}

export function LoadSavedDesign({ onDesignLoaded }: LoadSavedDesignProps) {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const designId = searchParams.get("designId")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!designId) return
    
    const loadDesign = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log("Loading design with ID:", designId)
        const response = await fetch(`/api/designs/${designId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load design: ${response.statusText}`)
        }
        
        const design = await response.json()
        console.log("Design loaded:", design)
        
        // Set product info from saved design
        if (design.designData) {
          // Find product by ID
          const productId = design.designData.productId
          if (productId) {
            console.log("Fetching product:", productId)
            const productResponse = await fetch(`/api/products/${productId}`)
            if (productResponse.ok) {
              const product = await productResponse.json()
              console.log("Product loaded:", product)
              dispatch(setSelectedProduct(product))
              
              // Set product color if available
              if (design.designData.productColor) {
                console.log("Setting product color:", design.designData.productColor)
                dispatch(setProductColor(design.designData.productColor))
              }
              
              // Set view mode if available
              if (design.designData.viewMode) {
                console.log("Setting view mode:", design.designData.viewMode)
                dispatch(setViewMode(design.designData.viewMode))
              }
            }
          }
          
          // Load canvas data
          if (design.designData.canvasJSON) {
            console.log("Loading canvas JSON")
            // Pass the canvas JSON to parent for loading
            // Add a small delay to ensure product is loaded first
            setTimeout(() => {
              onDesignLoaded(design.designData.canvasJSON)
            }, 300)
          }
        }
      } catch (error) {
        console.error("Error loading design:", error)
        setError(error instanceof Error ? error.message : "Failed to load design")
      } finally {
        setLoading(false)
      }
    }
    
    loadDesign()
  }, [designId, dispatch, onDesignLoaded])
  
  if (!designId) return null
  
  if (loading) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="space-y-4 max-w-md w-full p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }
  
  return null
}