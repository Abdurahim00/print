"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { createDesign } from "@/lib/redux/slices/designsSlice"
import { setShowProductModal } from "@/lib/redux/designToolSlices/designSlice"
import { TopHeader } from "./top-header"
import { ProductPanel } from "./panels/product-panel"
import { TextPanel } from "./panels/text-panel"
import { TemplatePanel } from "./panels/template-panel"
import { UploadPanel } from "./panels/upload-panel"
import { Button } from "@/components/ui/button"
import { Save, Loader2, Shirt } from "lucide-react"
import { RootState } from "@/lib/redux/store"
import { useToast } from "@/components/ui/use-toast"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"

export function RightPanel({ isMobile = false }: { isMobile?: boolean }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { selectedTool, selectedProduct } = useSelector((state: RootState) => state.design)
  
  // State for saving
  const [isSaving, setIsSaving] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const renderPanel = () => {
    // If no product is selected, show a guidance message
    if (!selectedProduct) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="text-center text-gray-500">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
              <Shirt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start Your Design</h3>
            <p className="text-sm text-gray-400 mb-6">Select a product from the left toolbar to begin designing</p>
            <Button 
              onClick={() => dispatch(setShowProductModal(true))}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Browse Products
            </Button>
          </div>
        </div>
      );
    }

    // Otherwise render the appropriate panel based on selected tool
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
    // Check if user is authenticated
    if (status === "unauthenticated") {
      setShowAuthDialog(true)
      return
    }
    
    try {
      setIsSaving(true)
      
      // Get canvas data
      const canvas = document.getElementById('design-canvas') as HTMLCanvasElement
      if (!canvas) {
        toast({
          title: "Error",
          description: "Canvas not found. Please try again.",
          variant: "destructive"
        })
        setIsSaving(false)
        return
      }

      // Get fabric.js canvas instance and export JSON
      const fabricCanvas = (window as any).fabricCanvas
      const canvasJSON = fabricCanvas ? fabricCanvas.toJSON() : null

      // Convert canvas to data URL for preview
      const preview = canvas.toDataURL('image/png')

      // Create design data
      const designData = {
        name: `${selectedProduct.name} Design`,
        type: selectedProduct.type,
        preview: preview,
        userId: (session?.user as any)?.id || "",
        designData: {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productType: selectedProduct.type,
          canvasData: canvas.toDataURL(),
          canvasJSON: canvasJSON, // Store the full fabric.js canvas state
          elements: fabricCanvas ? fabricCanvas.getObjects().map((obj: any) => ({
            type: obj.type,
            id: obj.id,
            properties: {
              left: obj.left,
              top: obj.top,
              width: obj.width,
              height: obj.height,
              scaleX: obj.scaleX,
              scaleY: obj.scaleY,
              angle: obj.angle,
              text: obj.text,
              fontFamily: obj.fontFamily,
              fontSize: obj.fontSize,
              fontWeight: obj.fontWeight,
              fontStyle: obj.fontStyle,
              textAlign: obj.textAlign,
              fill: obj.fill,
              stroke: obj.stroke,
            }
          })) : [],
          viewMode: "front",
          productColor: selectedProduct.baseColor,
        },
        status: "Draft" as const,
      }

      // Save design using Redux action
      const resultAction = await dispatch(createDesign(designData) as any)
      
      if (createDesign.fulfilled.match(resultAction)) {
        toast({
          title: "Design Saved Successfully!",
          description: "Your design has been saved to your dashboard.",
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-800 shadow-lg",
          duration: 5000
        })
        
        // Navigate to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard?tab=designs')
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: "Failed to save design. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving design:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isMobile) {
    return (
      <div className="bg-white border-t border-gray-200 max-h-72 flex flex-col">
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
          <Button 
            onClick={handleSaveDesign}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
            size="sm"
            disabled={isSaving || !selectedProduct}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
          {renderPanel()}
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 lg:w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <TopHeader />
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <Button 
          onClick={handleSaveDesign}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
          size="sm"
          disabled={isSaving || !selectedProduct}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
        <div className="h-full">
          {renderPanel()}
        </div>
      </div>
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Authentication Required</DialogTitle>
            <DialogDescription className="text-center">
              You need to sign in or create an account to save your design.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Button 
              onClick={() => {
                setShowAuthDialog(false)
                router.push('/login?returnUrl=/design-tool')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => {
                setShowAuthDialog(false)
                router.push('/signup?returnUrl=/design-tool')
              }}
              variant="outline"
            >
              Create Account
            </Button>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="ghost"
              onClick={() => setShowAuthDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
