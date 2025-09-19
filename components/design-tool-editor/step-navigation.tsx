"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save, Eye } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  productId: string
  onNext?: () => void
  onPrevious?: () => void
}

export function StepNavigation({ 
  currentStep, 
  totalSteps, 
  productId,
  onNext,
  onPrevious 
}: StepNavigationProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  
  const handleSaveAndContinue = async () => {
    setIsSaving(true)
    
    // Trigger save (auto-save should handle this)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsSaving(false)
    
    if (onNext) {
      onNext()
    }
  }
  
  const handleSaveAndExit = async () => {
    setIsSaving(true)
    
    // Save current work
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsSaving(false)
    
    // Return to products page
    router.push('/products')
  }
  
  const handleReview = () => {
    // Trigger immediate save before going to review
    if (typeof window !== 'undefined' && (window as any).saveCurrentDesign) {
      (window as any).saveCurrentDesign()
    }
    
    // Give time for the immediate save to complete
    setTimeout(() => {
      const locale = window.location.pathname.split('/')[1] || 'en'
      router.push(`/${locale}/design-tool/${productId}/review`)
    }, 100)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 border-t px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Step indicator */}
        <div className="flex items-center gap-4">
          {!isFirstStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              disabled={isSaving}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i + 1 === currentStep
                    ? 'bg-primary w-8'
                    : i + 1 < currentStep
                    ? 'bg-primary/60'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveAndExit}
            disabled={isSaving}
          >
            Save & Exit
          </Button>
          
          {isLastStep ? (
            <Button
              size="sm"
              onClick={() => {
                const locale = window.location.pathname.split('/')[1] || 'en'
                router.push(`/${locale}/design-tool/${productId}/review`)
              }}
              disabled={isSaving}
            >
              <Eye className="mr-2 h-4 w-4" />
              Review Order
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSaveAndContinue}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}