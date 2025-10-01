"use client"

import { useSelector, useDispatch } from "react-redux"
import * as fabric from "fabric"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Type, 
  Image, 
  Palette, 
  Shirt, 
  FileText, 
  Upload,
  Settings,
  Undo2,
  Redo2
} from "lucide-react"
import { setSelectedTool, setShowProductModal, setShowTemplateModal } from "@/lib/redux/designToolSlices/designSlice"
import { RootState } from "@/lib/redux/store"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"

export function LeftToolbar() {
  const dispatch = useDispatch()
  const { selectedTool } = useSelector((state: RootState) => state.design)
  const { canUndo, canRedo, fabricCanvas } = useSelector((state: RootState) => state.canvas)
  const { handleUndo, handleRedo, addText } = useFabricCanvas("design-canvas")

  const tools = [
    { id: "text", icon: Type, label: "Text", description: "Add and edit text elements" },
    { id: "template", icon: FileText, label: "Templates", description: "Browse and apply design templates" },
    { id: "upload", icon: Upload, label: "Upload", description: "Upload custom images and graphics" },
  ]

  const handleToolSelect = (toolId: string) => {
    console.log('🛠️ [LeftToolbar] Tool selected:', toolId)
    console.log('🛠️ [LeftToolbar] Current Redux state:', { selectedTool, canUndo, canRedo, fabricCanvas: !!fabricCanvas })
    
    // First, set the selected tool (this visually highlights the tool)
    dispatch(setSelectedTool(toolId))
    
    // Then perform the tool-specific action
    if (toolId === "product") {
      console.log('🛠️ [LeftToolbar] Opening product modal')
      dispatch(setShowProductModal(true))
      console.log('🛠️ [LeftToolbar] Product modal action dispatched')
    } else if (toolId === "template") {
      console.log('🛠️ [LeftToolbar] Opening template modal')
      dispatch(setShowTemplateModal(true))
      console.log('🛠️ [LeftToolbar] Template modal action dispatched')
    } else if (toolId === "text") {
      console.log('🛠️ [LeftToolbar] Adding text to canvas')
      if (fabricCanvas) {
        addText(fabricCanvas) // Pass the fabricCanvas instance
        console.log('🛠️ [LeftToolbar] Text added to canvas')
      } else {
        console.warn("Fabric canvas not yet initialized. Please wait a moment or try again.")
      }
    } else if (toolId === "upload") {
      console.log('🛠️ [LeftToolbar] Opening file explorer for upload')
      // Immediately open file explorer
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = false
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file && fabricCanvas) {
          const reader = new FileReader()
          reader.onload = async (event) => {
            const imageUrl = event.target?.result as string
            
            try {
              // Use the new fabric.js v6 API with async/await
              // Pass empty object for filters and options for properties
              const img = await fabric.FabricImage.fromURL(imageUrl, {}, {
                crossOrigin: 'anonymous'
              })
              
              // Scale image to fit canvas if too large
              const canvasWidth = fabricCanvas.width || 500
              const canvasHeight = fabricCanvas.height || 500
              const scale = Math.min(
                canvasWidth / (img.width || 1) * 0.5,
                canvasHeight / (img.height || 1) * 0.5,
                1
              )
              
              img.scaleToWidth(img.width! * scale)
              img.set({
                left: canvasWidth / 2 - (img.width! * scale) / 2,
                top: canvasHeight / 2 - (img.height! * scale) / 2,
              })
              
              fabricCanvas.add(img)
              fabricCanvas.setActiveObject(img)
              fabricCanvas.renderAll()
              console.log('🛠️ [LeftToolbar] Image added to canvas')
            } catch (error) {
              console.error('Failed to load image:', error)
              // Try fallback approach with data URL directly
              try {
                const tempImg = new Image()
                tempImg.crossOrigin = 'anonymous'
                tempImg.onload = () => {
                  const fabricImg = new fabric.FabricImage(tempImg)
                  const canvasWidth = fabricCanvas.width || 500
                  const canvasHeight = fabricCanvas.height || 500
                  const scale = Math.min(
                    canvasWidth / fabricImg.width! * 0.5,
                    canvasHeight / fabricImg.height! * 0.5,
                    1
                  )
                  fabricImg.scaleToWidth(fabricImg.width! * scale)
                  fabricImg.set({
                    left: canvasWidth / 2 - (fabricImg.width! * scale) / 2,
                    top: canvasHeight / 2 - (fabricImg.height! * scale) / 2,
                  })
                  fabricCanvas.add(fabricImg)
                  fabricCanvas.setActiveObject(fabricImg)
                  fabricCanvas.renderAll()
                  console.log('🛠️ [LeftToolbar] Image added via fallback')
                }
                tempImg.src = imageUrl
              } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError)
                alert('Failed to load the image. Please try a different image.')
              }
            }
          }
          reader.readAsDataURL(file)
        } else if (!fabricCanvas) {
          console.warn("Fabric canvas not yet initialized. Please select a product first.")
        }
      }
      
      // Trigger the file input
      input.click()
    }
  }

  return (
    <div className="w-14 sm:w-16 md:w-20 lg:w-24 bg-white/95 backdrop-blur-sm border-r border-gray-200/80 flex flex-col items-center py-2 sm:py-3 md:py-4 lg:py-6 shadow-lg overflow-y-auto scrollbar-hide">
      <TooltipProvider>
        {/* Main Tools */}
        <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-3 w-full flex flex-col items-center">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isSelected = selectedTool === tool.id

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "default" : "ghost"}
                    size="icon"
                    className={`w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 lg:w-20 lg:h-24 flex flex-col items-center justify-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md p-1 sm:p-1.5 md:p-2 ${
                      isSelected
                        ? "bg-black hover:bg-gray-800 text-white shadow-lg scale-105 hover:scale-110"
                        : "hover:bg-gray-50 hover:scale-105 text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => handleToolSelect(tool.id)}
                  >
                    <Icon className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                    <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium truncate max-w-full px-0.5">{tool.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700 hidden sm:block">
                  <p className="font-medium">{tool.label}</p>
                  <p className="text-xs text-gray-300">{tool.description}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <Separator className="my-1.5 sm:my-2 md:my-4 lg:my-6 w-6 sm:w-6 md:w-8 lg:w-10 bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-shrink-0" />

        {/* History Controls */}
        <div className="space-y-1 sm:space-y-1.5 md:space-y-2 lg:space-y-3 w-full flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 lg:w-20 lg:h-24 flex flex-col items-center justify-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent text-gray-600 hover:text-gray-800 shadow-sm hover:shadow-md p-1 sm:p-1.5 md:p-2"
                onClick={() => handleUndo(fabricCanvas)}
                disabled={!canUndo || !fabricCanvas}
              >
                <Undo2 className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium truncate max-w-full px-0.5">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700 hidden sm:block">
              <p className="font-medium">Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 lg:w-20 lg:h-24 flex flex-col items-center justify-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent text-gray-600 hover:text-gray-800 shadow-sm hover:shadow-md p-1 sm:p-1.5 md:p-2"
                onClick={() => handleRedo(fabricCanvas)}
                disabled={!canRedo || !fabricCanvas}
              >
                <Redo2 className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs font-medium truncate max-w-full px-0.5">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700 hidden sm:block">
              <p className="font-medium">Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
