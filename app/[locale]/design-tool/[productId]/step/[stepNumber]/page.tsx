"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setSelectedProduct, setViewMode } from "@/lib/redux/designToolSlices/designSlice"
import { StepBasedCanvas } from "@/components/design-tool-editor/step-based-canvas"
import { StepNavigation } from "@/components/design-tool-editor/step-navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DesignStepPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const productId = params.productId as string
  const stepNumber = parseInt(params.stepNumber as string)
  
  const selectedProduct = useAppSelector((state) => state.design.selectedProduct)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Map step numbers to angles
  const stepToAngle = {
    1: 'front',
    2: 'back',
    3: 'left',
    4: 'right'
  } as const
  
  const currentAngle = stepToAngle[stepNumber as keyof typeof stepToAngle]
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        
        // Load product if not already loaded
        if (!selectedProduct || selectedProduct.id !== productId) {
          const response = await fetch(`/api/products/${productId}`)
          if (!response.ok) throw new Error('Failed to load product')
          
          const product = await response.json()
          console.log('📦 Loaded product:', product)
          console.log('🖼️ Product images:', {
            image: product.image,
            frontImage: product.frontImage,
            backImage: product.backImage,
            leftImage: product.leftImage,
            rightImage: product.rightImage,
            variations: product.variations
          })
          dispatch(setSelectedProduct(product))
          
          // Check if this is a new design session (step 1 and no referrer from review)
          if (stepNumber === 1) {
            const isFromReview = document.referrer.includes('/review')
            const hasExistingDesigns = localStorage.getItem(`design_${productId}_step_1_area`)
            
            if (!isFromReview && hasExistingDesigns) {
              // Ask user if they want to continue or start fresh
              const continueDesign = confirm('You have existing designs for this product. Would you like to continue where you left off?\n\nClick OK to continue, Cancel to start fresh.')
              
              if (!continueDesign) {
                // Clear all saved designs for this product
                for (let step = 1; step <= 4; step++) {
                  localStorage.removeItem(`design_${productId}_step_${step}`)
                  localStorage.removeItem(`design_${productId}_step_${step}_area`)
                }
                console.log('🧹 Cleared existing designs for fresh start')
              }
            }
          }
        }
        
        // Set the view mode for this step
        if (currentAngle) {
          dispatch(setViewMode(currentAngle))
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Failed to load product')
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId, stepNumber, dispatch])
  
  // Calculate total steps based on available angles
  const getTotalSteps = () => {
    if (!selectedProduct) return 1
    
    let steps = 0
    
    // Check for individual angle images first
    if (selectedProduct.frontImage || selectedProduct.image) steps++
    if (selectedProduct.backImage) steps++
    if (selectedProduct.leftImage) steps++
    if (selectedProduct.rightImage) steps++
    
    console.log('📊 Product angles:', {
      front: selectedProduct.frontImage || selectedProduct.image,
      back: selectedProduct.backImage,
      left: selectedProduct.leftImage,
      right: selectedProduct.rightImage,
      hasVariations: selectedProduct.hasVariations,
      variations: selectedProduct.variations?.length || 0
    })
    
    // For products with variations, check the first variation
    if (selectedProduct.hasVariations && selectedProduct.variations?.[0]) {
      const variation = selectedProduct.variations[0]
      if (variation.images) {
        const variationSteps = variation.images.filter((img: any) => 
          img.angle && img.url && img.url.trim() !== ''
        ).length
        if (variationSteps > 0) {
          steps = variationSteps
          console.log('📊 Using variation steps:', steps)
        }
      }
    }
    
    // If no angles found but we have a main image, at least show front
    if (steps === 0 && (selectedProduct.image || selectedProduct.frontImage)) {
      steps = 1
    }
    
    console.log('📊 Total steps calculated:', steps)
    return Math.max(steps, 1)
  }
  
  const totalSteps = getTotalSteps()
  
  // Validate step number
  useEffect(() => {
    if (!loading && stepNumber > totalSteps) {
      const locale = window.location.pathname.split('/')[1] || 'en'
      router.push(`/${locale}/design-tool/${productId}/step/1`)
    }
  }, [stepNumber, totalSteps, loading, router, productId])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading design tool...</p>
        </div>
      </div>
    )
  }
  
  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  if (!currentAngle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Invalid step number</p>
          <Button onClick={() => {
            const locale = window.location.pathname.split('/')[1] || 'en'
            router.push(`/${locale}/design-tool/${productId}/step/1`)
          }}>
            Go to Step 1
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">
                  {selectedProduct.name} - {currentAngle.charAt(0).toUpperCase() + currentAngle.slice(1)} Side
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Canvas */}
      <div className="flex-1">
        <StepBasedCanvas 
          product={selectedProduct}
          stepNumber={stepNumber}
          angle={currentAngle}
        />
      </div>
      
      {/* Navigation */}
      <StepNavigation
        currentStep={stepNumber}
        totalSteps={totalSteps}
        productId={productId}
        onNext={() => {
          // Give time for the component to save before navigation
          setTimeout(() => {
            const locale = window.location.pathname.split('/')[1] || 'en'
            if (stepNumber < totalSteps) {
              router.push(`/${locale}/design-tool/${productId}/step/${stepNumber + 1}`)
            } else {
              router.push(`/${locale}/design-tool/${productId}/review`)
            }
          }, 100)
        }}
        onPrevious={() => {
          // Give time for the component to save before navigation
          setTimeout(() => {
            const locale = window.location.pathname.split('/')[1] || 'en'
            if (stepNumber > 1) {
              router.push(`/${locale}/design-tool/${productId}/step/${stepNumber - 1}`)
            }
          }, 100)
        }}
      />
    </div>
  )
}