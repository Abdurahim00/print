'use client'

import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { PrintFileService } from '@/lib/services/printFileService'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

interface PrintFileButtonProps {
  order: any
  className?: string
}

export function PrintFileButton({ order, className }: PrintFileButtonProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePrintFile = async () => {
    // Check if order has items with custom designs
    const designItems = order.items?.filter((item: any) =>
      item.hasCustomDesign || item.designData || item.designs
    )

    if (!designItems || designItems.length === 0) {
      toast({
        title: "No custom designs",
        description: "This order doesn't contain any custom designs to export.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsGenerating(true)

    try {
      // Process each item with designs
      for (const item of designItems) {
        const designs = item.designs || item.designData?.designs

        if (!designs || designs.length === 0) continue

        const product = {
          id: item.productId || item.designData?.productDetails?.id,
          name: item.productName || item.designData?.productDetails?.name || item.name,
          image: item.productImage || item.designData?.productDetails?.image || item.image,
          price: item.price || 0,
          frontImage: item.frontImage,
          backImage: item.backImage,
          leftImage: item.leftImage,
          rightImage: item.rightImage,
        }

        await PrintFileService.generatePrintFile({
          product,
          designs,
          orderId: order.orderId || order.id,
          customerName: order.customer || order.customerName,
          includeIndividualElements: true,
          includeMockups: true,
          format: 'zip',
        })
      }

      toast({
        title: "Print files generated!",
        description: "Print files have been downloaded successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error('Error generating print file:', error)
      toast({
        title: "Error",
        description: "Failed to generate print files. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGeneratePrintFile}
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2" />
          Generating...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-3 w-3" />
          Print File
        </>
      )}
    </Button>
  )
}