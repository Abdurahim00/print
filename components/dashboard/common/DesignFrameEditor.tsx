import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Move, Square, Copy } from "lucide-react"
import { DesignFrame } from "@/types"

interface DesignFrameEditorProps {
  productImage: string
  frontImage?: string
  backImage?: string
  leftImage?: string
  rightImage?: string
  frames: DesignFrame[]
  onChange: (frames: DesignFrame[]) => void
  designCostPerCm2?: number
  onCostChange?: (cost: number) => void
  variationId?: string // Optional: specific to a variation
}

const POSITIONS = ["front", "back", "left", "right", "top", "bottom"]
const CM_TO_PX_RATIO = 37.795 // 1 cm = 37.795 pixels at 96 DPI
const FIXED_CANVAS_SIZE = 600 // Fixed canvas size for consistent calculations across all screen sizes

export const DesignFrameEditor: React.FC<DesignFrameEditorProps> = ({
  productImage,
  frontImage,
  backImage,
  leftImage,
  rightImage,
  frames,
  onChange,
  designCostPerCm2 = 0.5,
  onCostChange,
  variationId
}) => {
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string>('front')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  
  // Get the current image based on selected position
  const getCurrentImage = () => {
    switch (selectedPosition) {
      case 'front': return frontImage || productImage
      case 'back': return backImage || productImage
      case 'left': return leftImage || productImage
      case 'right': return rightImage || productImage
      default: return productImage
    }
  }

  // Add a new frame
  const addFrame = () => {
    // Get actual canvas dimensions if available
    const rect = canvasRef.current?.getBoundingClientRect()
    const containerWidth = rect?.width || FIXED_CANVAS_SIZE
    const containerHeight = rect?.height || FIXED_CANVAS_SIZE
    
    // Calculate frame size based on percentage of container
    const frameWidthPercent = 30 // 30% of container width
    const frameHeightPercent = 30 // 30% of container height
    const xPercent = 10 // 10% from left
    const yPercent = 10 // 10% from top
    
    const frameWidthPx = (containerWidth * frameWidthPercent) / 100
    const frameHeightPx = (containerHeight * frameHeightPercent) / 100
    const xPos = (containerWidth * xPercent) / 100
    const yPos = (containerHeight * yPercent) / 100
    
    // Calculate cm based on the actual canvas size
    const scaleFactor = containerWidth / FIXED_CANVAS_SIZE
    const widthCm = (frameWidthPx / scaleFactor) / CM_TO_PX_RATIO
    const heightCm = (frameHeightPx / scaleFactor) / CM_TO_PX_RATIO
    
    const newFrame: DesignFrame = {
      id: `frame_${Date.now()}`,
      position: selectedPosition,
      x: xPos,
      y: yPos,
      width: widthCm,
      height: heightCm,
      widthPx: frameWidthPx,
      heightPx: frameHeightPx,
      // Store percentage positions for responsive display
      xPercent: xPercent,
      yPercent: yPercent,
      widthPercent: frameWidthPercent,
      heightPercent: frameHeightPercent,
      costPerCm2: designCostPerCm2,
      variationId: variationId,
      angle: selectedPosition // Track angle for this frame
    }
    onChange([...frames, newFrame])
    setSelectedFrame(newFrame.id)
  }

  // Remove a frame
  const removeFrame = (id: string) => {
    onChange(frames.filter(f => f.id !== id))
    if (selectedFrame === id) {
      setSelectedFrame(null)
    }
  }

  // Update a frame
  const updateFrame = (id: string, updates: Partial<DesignFrame>) => {
    onChange(frames.map(f => {
      if (f.id === id) {
        const updated = { ...f, ...updates }
        
        // Get container dimensions for percentage calculations
        const containerWidth = FIXED_CANVAS_SIZE
        const containerHeight = FIXED_CANVAS_SIZE
        
        // Recalculate pixels if cm changed
        if (updates.width !== undefined) {
          updated.widthPx = updates.width * CM_TO_PX_RATIO
          updated.widthPercent = (updated.widthPx / containerWidth) * 100
        }
        if (updates.height !== undefined) {
          updated.heightPx = updates.height * CM_TO_PX_RATIO
          updated.heightPercent = (updated.heightPx / containerHeight) * 100
        }
        // Recalculate cm if pixels changed
        if (updates.widthPx !== undefined) {
          updated.width = updates.widthPx / CM_TO_PX_RATIO
          updated.widthPercent = (updates.widthPx / containerWidth) * 100
        }
        if (updates.heightPx !== undefined) {
          updated.height = updates.heightPx / CM_TO_PX_RATIO
          updated.heightPercent = (updates.heightPx / containerHeight) * 100
        }
        // Update position percentages if position changed
        if (updates.x !== undefined) {
          updated.xPercent = (updates.x / containerWidth) * 100
        }
        if (updates.y !== undefined) {
          updated.yPercent = (updates.y / containerHeight) * 100
        }
        
        return updated
      }
      return f
    }))
  }

  // Handle mouse events for drawing frames
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || !imageRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    setDrawStart({ x, y })
    setCurrentRect({ x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCurrentRect({
      x: Math.min(drawStart.x, x),
      y: Math.min(drawStart.y, y),
      width: Math.abs(x - drawStart.x),
      height: Math.abs(y - drawStart.y)
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect || !canvasRef.current) return
    
    if (currentRect.width > 10 && currentRect.height > 10) {
      // Get actual canvas dimensions
      const rect = canvasRef.current.getBoundingClientRect()
      const containerWidth = rect.width
      const containerHeight = rect.height
      
      // Calculate cm based on the actual canvas size
      const scaleFactor = containerWidth / FIXED_CANVAS_SIZE
      const widthCm = (currentRect.width / scaleFactor) / CM_TO_PX_RATIO
      const heightCm = (currentRect.height / scaleFactor) / CM_TO_PX_RATIO
      
      const newFrame: DesignFrame = {
        id: `frame_${Date.now()}`,
        position: selectedPosition,
        x: currentRect.x,
        y: currentRect.y,
        widthPx: currentRect.width,
        heightPx: currentRect.height,
        width: widthCm,
        height: heightCm,
        // Store percentage positions for responsive display
        xPercent: (currentRect.x / containerWidth) * 100,
        yPercent: (currentRect.y / containerHeight) * 100,
        widthPercent: (currentRect.width / containerWidth) * 100,
        heightPercent: (currentRect.height / containerHeight) * 100,
        costPerCm2: designCostPerCm2,
        variationId: variationId,
        angle: selectedPosition // Track angle for this frame
      }
      onChange([...frames, newFrame])
      setSelectedFrame(newFrame.id)
    }
    
    setIsDrawing(false)
    setDrawStart(null)
    setCurrentRect(null)
  }

  const selectedFrameData = frames.find(f => f.id === selectedFrame)

  // Copy frames from current angle to all other angles
  const copyFramesToAllAngles = () => {
    const currentAngleFrames = frames.filter(f => (f.angle === selectedPosition) || (!f.angle && f.position === selectedPosition))
    if (currentAngleFrames.length === 0) {
      alert('No frames to copy from the current angle')
      return
    }
    
    const availablePositions = POSITIONS.filter(pos => {
      switch (pos) {
        case 'front': return frontImage || productImage
        case 'back': return backImage
        case 'left': return leftImage
        case 'right': return rightImage
        default: return false
      }
    })
    
    // First, remove frames from other positions
    const framesFromOtherPositions = frames.filter(f => {
      const framePosition = f.angle || f.position
      return framePosition === selectedPosition
    })
    
    // Create new frames array with copied frames
    const newFrames: typeof frames = []
    
    availablePositions.forEach(position => {
      if (position === selectedPosition) {
        // Keep original frames for current position
        newFrames.push(...currentAngleFrames)
      } else {
        // Copy frames to other positions (preserve percentages)
        const copiedFrames = currentAngleFrames.map(frame => ({
          ...frame,
          id: `frame_${Date.now()}_${position}_${Math.random().toString(36).substr(2, 9)}`,
          position: position,
          angle: position,
          // Preserve percentage positions for consistent display
          xPercent: frame.xPercent,
          yPercent: frame.yPercent,
          widthPercent: frame.widthPercent,
          heightPercent: frame.heightPercent
        }))
        newFrames.push(...copiedFrames)
      }
    })
    
    onChange(newFrames)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h4 className="font-semibold text-sm sm:text-base w-full sm:w-auto">Design Frames Configuration</h4>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-24 sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.filter(pos => {
                // Only show positions that have images
                switch (pos) {
                  case 'front': return frontImage || productImage
                  case 'back': return backImage
                  case 'left': return leftImage
                  case 'right': return rightImage
                  default: return false
                }
              }).map(pos => (
                <SelectItem key={pos} value={pos}>
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addFrame} size="sm" variant="outline" className="text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Add Frame</span>
            <span className="sm:hidden">Add</span>
          </Button>
          <Button type="button" onClick={copyFramesToAllAngles} size="sm" variant="outline" title="Copy frames from current angle to all other angles" className="text-xs sm:text-sm">
            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Copy to All Angles</span>
            <span className="sm:hidden">Copy All</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="costPerCm2" className="text-xs sm:text-sm whitespace-nowrap">Cost/cm²:</Label>
          <Input
            id="costPerCm2"
            type="number"
            step="0.01"
            value={designCostPerCm2}
            onChange={(e) => onCostChange?.(parseFloat(e.target.value) || 0)}
            className="w-20 sm:w-24 text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Visual Editor */}
        <Card className="p-2 sm:p-4">
          <div className="mb-2 text-xs sm:text-sm text-slate-600">
            Viewing {selectedPosition} - Click and drag to create design frames
          </div>
          <div 
            ref={canvasRef}
            className="relative border-2 border-dashed border-slate-300 rounded-lg overflow-hidden mx-auto aspect-square"
            style={{ maxWidth: '600px', width: '100%' }}
          >
            <div
              ref={imageContainerRef}
              className="relative w-full h-full cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={getCurrentImage() || "/placeholder.svg?height=400&width=400"}
                alt={`Product ${selectedPosition}`}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            
            </div>
            
            {/* Render existing frames for the selected position */}
            {frames.filter(f => (f.angle === selectedPosition) || (!f.angle && f.position === selectedPosition)).map(frame => (
              <div
                key={frame.id}
                className={`absolute border-2 ${
                  selectedFrame === frame.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-green-500 bg-green-500/10'
                } cursor-move`}
                style={{
                  left: `${frame.xPercent || (frame.x / FIXED_CANVAS_SIZE * 100)}%`,
                  top: `${frame.yPercent || (frame.y / FIXED_CANVAS_SIZE * 100)}%`,
                  width: `${frame.widthPercent || (frame.widthPx / FIXED_CANVAS_SIZE * 100)}%`,
                  height: `${frame.heightPercent || (frame.heightPx / FIXED_CANVAS_SIZE * 100)}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFrame(frame.id)
                  // Also switch to this frame's position/angle
                  setSelectedPosition(frame.angle || frame.position)
                }}
              >
                <div className="absolute top-0 left-0 bg-black text-white text-xs px-1 rounded-br">
                  {frame.angle || frame.position}
                </div>
                <div className="absolute bottom-0 right-0 bg-black text-white text-xs px-1 rounded-tl">
                  {frame.width.toFixed(1)} × {frame.height.toFixed(1)} cm
                </div>
              </div>
            ))}
            
            {/* Drawing rectangle */}
            {currentRect && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/10"
                style={{
                  left: `${currentRect.x}px`,
                  top: `${currentRect.y}px`,
                  width: `${currentRect.width}px`,
                  height: `${currentRect.height}px`,
                }}
              />
            )}
          </div>
        </Card>

        {/* Frame List and Properties */}
        <Card className="p-2 sm:p-4">
          <h5 className="font-medium mb-3 text-sm sm:text-base">Frame Properties</h5>
          <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
            {frames.length === 0 ? (
              <p className="text-sm text-slate-500">No frames added yet. Click "Add Frame" or draw on the image.</p>
            ) : (
              // Group frames by position/angle
              POSITIONS.filter(pos => frames.some(f => (f.angle === pos) || (!f.angle && f.position === pos))).map(position => (
                <div key={position} className="space-y-2">
                  <h6 className="text-sm font-medium text-slate-700 capitalize">{position} Frames</h6>
                  {frames.filter(f => (f.angle === position) || (!f.angle && f.position === position)).map(frame => (
                <div
                  key={frame.id}
                  className={`p-2 sm:p-3 border rounded-lg cursor-pointer ${
                    selectedFrame === frame.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                  }`}
                  onClick={() => {
                    setSelectedFrame(frame.id)
                    setSelectedPosition(frame.angle || frame.position)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Select
                      value={frame.angle || frame.position}
                      onValueChange={(value) => {
                        // Update both position and angle
                        updateFrame(frame.id, { position: value, angle: value })
                        // Also change the view to show the new position
                        setSelectedPosition(value)
                      }}
                    >
                      <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.filter(pos => {
                          // Only show positions that have images
                          switch (pos) {
                            case 'front': return frontImage || productImage
                            case 'back': return backImage
                            case 'left': return leftImage
                            case 'right': return rightImage
                            default: return false
                          }
                        }).map(pos => (
                          <SelectItem key={pos} value={pos}>
                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFrame(frame.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 text-sm">
                    <div>
                      <Label className="text-[10px] sm:text-xs">Width (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={frame.width.toFixed(1)}
                        onChange={(e) => updateFrame(frame.id, { width: parseFloat(e.target.value) || 0 })}
                        className="h-7 sm:h-8 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] sm:text-xs">Height (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={frame.height.toFixed(1)}
                        onChange={(e) => updateFrame(frame.id, { height: parseFloat(e.target.value) || 0 })}
                        className="h-7 sm:h-8 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] sm:text-xs">X Pos (px)</Label>
                      <Input
                        type="number"
                        value={Math.round(frame.x)}
                        onChange={(e) => updateFrame(frame.id, { x: parseInt(e.target.value) || 0 })}
                        className="h-7 sm:h-8 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] sm:text-xs">Y Pos (px)</Label>
                      <Input
                        type="number"
                        value={Math.round(frame.y)}
                        onChange={(e) => updateFrame(frame.id, { y: parseInt(e.target.value) || 0 })}
                        className="h-7 sm:h-8 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t text-xs text-slate-600">
                    Area: {(frame.width * frame.height).toFixed(1)} cm²
                    {frame.costPerCm2 && (
                      <span className="ml-2">
                        Cost: ${(frame.width * frame.height * frame.costPerCm2).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}