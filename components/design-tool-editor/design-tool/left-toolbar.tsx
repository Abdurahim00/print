"use client"

import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shirt, ImageIcon, Type, Upload, Undo2, Redo2 } from "lucide-react"
import { setSelectedTool, setShowProductModal, setShowTemplateModal } from "@/lib/redux/designToolSlices/designSlice"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { RootState } from "@/lib/redux/store"

export function LeftToolbar() {
  const dispatch = useDispatch()
  const { selectedTool } = useSelector((state: RootState) => state.design)
  const { canUndo, canRedo, fabricCanvas } = useSelector((state: RootState) => state.canvas)
  const { handleUndo, handleRedo, addText } = useFabricCanvas("design-canvas")

  const tools = [
    { id: "product", icon: Shirt, label: "Product" },
    { id: "template", icon: ImageIcon, label: "Templates" },
    { id: "text", icon: Type, label: "Text" },
    { id: "upload", icon: Upload, label: "Upload" },
  ]

  const handleToolSelect = (tool: string) => {
    // First, set the selected tool (this visually highlights the tool)
    dispatch(setSelectedTool(tool))
    
    // Then perform the tool-specific action
    if (tool === "product") {
      dispatch(setShowProductModal(true))
    } else if (tool === "template") {
      dispatch(setShowTemplateModal(true))
    } else if (tool === "text") {
      if (fabricCanvas) {
        addText(fabricCanvas) // Pass the fabricCanvas instance
      } else {
        console.warn("Fabric canvas not yet initialized. Please wait a moment or try again.")
      }
    }
  }

  return (
    <div className="w-16 lg:w-20 bg-white/95 backdrop-blur-sm border-r border-gray-200/80 flex flex-col items-center py-4 lg:py-6 shadow-lg">
      <TooltipProvider>
        {/* Main Tools */}
        <div className="space-y-2 lg:space-y-3">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === tool.id ? "default" : "ghost"}
                  size="icon"
                  className={`w-11 h-11 lg:w-14 lg:h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md ${
                    selectedTool === tool.id 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105 hover:scale-110" 
                      : "hover:bg-gray-50 hover:scale-105 text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <tool.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                <p className="font-medium">{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator className="my-4 lg:my-6 w-8 lg:w-10 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* History Controls */}
        <div className="space-y-2 lg:space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 lg:w-14 lg:h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent text-gray-600 hover:text-gray-800 shadow-sm hover:shadow-md"
                onClick={() => handleUndo(fabricCanvas)}
                disabled={!canUndo || !fabricCanvas}
              >
                <Undo2 className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
              <p className="font-medium">Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 lg:w-14 lg:h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 hover:bg-gray-50 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent text-gray-600 hover:text-gray-800 shadow-sm hover:shadow-md"
                onClick={() => handleRedo(fabricCanvas)}
                disabled={!canRedo || !fabricCanvas}
              >
                <Redo2 className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
              <p className="font-medium">Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
