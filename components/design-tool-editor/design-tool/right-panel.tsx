"use client"

import { useSelector, useDispatch } from "react-redux"
import { TopHeader } from "./top-header"
import { ProductPanel } from "./panels/product-panel"
import { TextPanel } from "./panels/text-panel"
import { TemplatePanel } from "./panels/template-panel"
import { UploadPanel } from "./panels/upload-panel"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { RootState } from "@/lib/redux/store"

export function RightPanel({ isMobile = false }: { isMobile?: boolean }) {
  const dispatch = useDispatch()
  const { selectedTool, selectedProduct } = useSelector((state: RootState) => state.design)

  const renderPanel = () => {
    switch (selectedTool) {
      case "product":
        return <ProductPanel />
      case "text":
        return <TextPanel />
      case "template":
        return <TemplatePanel />
      case "upload":
        return <UploadPanel />
      default:
        return <ProductPanel />
    }
  }

  const handleSaveDesign = async () => {
    try {
      // Get canvas data
      const canvas = document.getElementById('design-canvas') as HTMLCanvasElement
      if (!canvas) {
        console.error('Canvas not found')
        return
      }

      // Convert canvas to data URL for preview
      const preview = canvas.toDataURL('image/png')

      // Create design data
      const designData = {
        name: `${selectedProduct.name} Design`,
        type: selectedProduct.type,
        preview: preview,
        userId: "user-123", // TODO: Get actual user ID from auth
        designData: {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productType: selectedProduct.type,
          canvasData: canvas.toDataURL(),
          elements: [], // TODO: Get actual canvas elements
          viewMode: "front",
          productColor: selectedProduct.baseColor,
        },
        status: "Draft" as const,
      }

      // Save to database
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
      })

      if (response.ok) {
        const savedDesign = await response.json()
        console.log('Design saved successfully:', savedDesign)
        // TODO: Show success toast
      } else {
        console.error('Failed to save design')
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Error saving design:', error)
      // TODO: Show error toast
    }
  }

  if (isMobile) {
    return (
      <div className="bg-white border-t border-gray-200 max-h-64 overflow-y-scroll">
        <div className="p-4 border-b border-gray-200">
          <Button 
            onClick={handleSaveDesign}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Design
          </Button>
        </div>
        {renderPanel()}
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <TopHeader />
      <div className="p-4 border-b border-gray-200">
        <Button 
          onClick={handleSaveDesign}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Design
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderPanel()}
      </div>
    </div>
  )
}
