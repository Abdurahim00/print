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
    dispatch(setSelectedTool(tool))
  }

  return (
    <div className="w-16 lg:w-20 bg-white border-r border-gray-200 flex flex-col items-center py-3 lg:py-4 shadow-sm">
      <TooltipProvider>
        <div className="space-y-1 lg:space-y-2">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === tool.id ? "default" : "ghost"}
                  size="icon"
                  className="w-10 h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center p-1 lg:p-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                  onClick={() => handleToolSelect(tool.id)}
                >
                  <tool.icon className="w-4 h-4 lg:w-6 lg:h-6 mb-0.5 lg:mb-0" />
                  {/* <span className="text-[10px] hidden lg:block">{tool.label}</span> */}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator className="my-3 lg:my-4 w-6 lg:w-8" />

        <div className="space-y-1 lg:space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center p-1 lg:p-2 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
                onClick={() => handleUndo(fabricCanvas)} // Pass fabricCanvas
                disabled={!canUndo || !fabricCanvas} // Also disable if canvas not ready
              >
                <Undo2 className="w-4 h-4 lg:w-5 lg:h-5 mb-0.5 lg:mb-1" />
                <span className="text-xs hidden lg:block">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:hidden">
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 lg:w-12 lg:h-12 flex flex-col items-center justify-center p-1 lg:p-2 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
                onClick={() => handleRedo(fabricCanvas)} // Pass fabricCanvas
                disabled={!canRedo || !fabricCanvas} // Also disable if canvas not ready
              >
                <Redo2 className="w-4 h-4 lg:w-5 lg:h-5 mb-0.5 lg:mb-1" />
                <span className="text-xs hidden lg:block">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:hidden">
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
