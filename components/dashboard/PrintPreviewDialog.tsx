"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Maximize2, 
  Minimize2, 
  Grid3X3, 
  Ruler, 
  Eye, 
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCw
} from "lucide-react"
import * as fabric from "fabric"

interface PrintPreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  canvasJSON: any
  productImage?: string
  productName: string
  viewMode?: string
}

export function PrintPreviewDialog({ 
  isOpen, 
  onClose, 
  canvasJSON, 
  productImage,
  productName,
  viewMode = 'front'
}: PrintPreviewDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(false)
  const [showRulers, setShowRulers] = useState(true)
  const [showBleed, setShowBleed] = useState(true)
  const [viewType, setViewType] = useState<'design' | 'composite' | 'technical'>('design')
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  
  // Physical dimensions (assuming 300 DPI for print)
  const DPI = 300
  const physicalWidth = (canvasSize.width / DPI * 2.54).toFixed(2) // cm
  const physicalHeight = (canvasSize.height / DPI * 2.54).toFixed(2) // cm

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !canvasJSON) return

    // Initialize fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: viewType === 'design' ? 'transparent' : 'white'
    })
    
    fabricCanvasRef.current = canvas

    // Load the design
    canvas.loadFromJSON(canvasJSON, () => {
      // Add product image for composite view
      if (viewType === 'composite' && productImage) {
        fabric.Image.fromURL(productImage, (img) => {
          img.scaleToWidth(canvas.getWidth()!)
          img.scaleToHeight(canvas.getHeight()!)
          img.set({
            left: 0,
            top: 0,
            selectable: false,
            evented: false
          })
          canvas.add(img)
          canvas.sendToBack(img)
          canvas.renderAll()
        }, { crossOrigin: 'anonymous' })
      }

      // Add grid overlay if enabled
      if (showGrid) {
        addGridOverlay(canvas)
      }

      // Add bleed area visualization
      if (showBleed) {
        addBleedArea(canvas)
      }

      // Add rulers if enabled
      if (showRulers) {
        addRulers(canvas)
      }

      canvas.renderAll()
    })

    return () => {
      canvas.dispose()
    }
  }, [isOpen, canvasJSON, productImage, viewType, showGrid, showBleed, showRulers, canvasSize])

  const addGridOverlay = (canvas: fabric.Canvas) => {
    const gridSize = 50
    const width = canvas.getWidth()!
    const height = canvas.getHeight()!

    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false
      })
      canvas.add(line)
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false
      })
      canvas.add(line)
    }
  }

  const addBleedArea = (canvas: fabric.Canvas) => {
    const bleedSize = (DPI / 25.4) * 3 // 3mm bleed in pixels at current DPI
    const width = canvas.getWidth()!
    const height = canvas.getHeight()!

    // Bleed area border
    const bleedRect = new fabric.Rect({
      left: bleedSize,
      top: bleedSize,
      width: width - (bleedSize * 2),
      height: height - (bleedSize * 2),
      fill: 'transparent',
      stroke: '#ff0000',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    })
    
    canvas.add(bleedRect)

    // Bleed area labels
    const labelStyle = {
      fontSize: 12,
      fill: '#ff0000',
      fontFamily: 'Arial',
      selectable: false,
      evented: false
    }

    const topLabel = new fabric.Text('3mm Bleed', {
      ...labelStyle,
      left: width / 2 - 30,
      top: 5
    })
    
    canvas.add(topLabel)
  }

  const addRulers = (canvas: fabric.Canvas) => {
    const width = canvas.getWidth()!
    const height = canvas.getHeight()!
    const rulerSize = 30
    
    // Top ruler
    const topRuler = new fabric.Rect({
      left: 0,
      top: 0,
      width: width,
      height: rulerSize,
      fill: '#f0f0f0',
      selectable: false,
      evented: false
    })
    canvas.add(topRuler)

    // Left ruler
    const leftRuler = new fabric.Rect({
      left: 0,
      top: 0,
      width: rulerSize,
      height: height,
      fill: '#f0f0f0',
      selectable: false,
      evented: false
    })
    canvas.add(leftRuler)

    // Add measurement marks
    const interval = 50 // pixels
    const cmInterval = (interval / DPI) * 2.54

    // Top ruler marks
    for (let i = rulerSize; i <= width; i += interval) {
      const mark = new fabric.Line([i, 20, i, rulerSize], {
        stroke: '#666',
        strokeWidth: 1,
        selectable: false,
        evented: false
      })
      canvas.add(mark)

      const label = new fabric.Text(`${((i - rulerSize) / DPI * 2.54).toFixed(1)}`, {
        fontSize: 8,
        fill: '#666',
        left: i - 10,
        top: 5,
        selectable: false,
        evented: false
      })
      canvas.add(label)
    }

    // Left ruler marks
    for (let i = rulerSize; i <= height; i += interval) {
      const mark = new fabric.Line([20, i, rulerSize, i], {
        stroke: '#666',
        strokeWidth: 1,
        selectable: false,
        evented: false
      })
      canvas.add(mark)

      const label = new fabric.Text(`${((i - rulerSize) / DPI * 2.54).toFixed(1)}`, {
        fontSize: 8,
        fill: '#666',
        left: 5,
        top: i - 5,
        angle: -90,
        selectable: false,
        evented: false
      })
      canvas.add(label)
    }
  }

  const handleZoom = (newZoom: number) => {
    setZoom(newZoom)
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(newZoom / 100)
      fabricCanvasRef.current.renderAll()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Print Preview - {productName}</span>
            <Badge variant="outline">{viewMode} view</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* View Type Tabs */}
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="design">Design Only</TabsTrigger>
              <TabsTrigger value="composite">With Product</TabsTrigger>
              <TabsTrigger value="technical">Technical View</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleZoom(Math.max(25, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 min-w-[150px]">
                <Slider
                  value={[zoom]}
                  onValueChange={(v) => handleZoom(v[0])}
                  min={25}
                  max={200}
                  step={25}
                  className="w-24"
                />
                <span className="text-sm font-medium w-12">{zoom}%</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* View Options */}
              <Button
                size="sm"
                variant={showGrid ? "default" : "ghost"}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={showRulers ? "default" : "ghost"}
                onClick={() => setShowRulers(!showRulers)}
              >
                <Ruler className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={showBleed ? "default" : "ghost"}
                onClick={() => setShowBleed(!showBleed)}
              >
                {showBleed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* Size Info */}
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Size:</span> {physicalWidth} × {physicalHeight} cm
              <span className="ml-2 text-xs">({canvasSize.width} × {canvasSize.height}px @ {DPI} DPI)</span>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="relative bg-checkered rounded-lg overflow-auto" style={{ maxHeight: '500px' }}>
            <div className="p-8 flex items-center justify-center min-h-[400px]">
              <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}>
                <canvas 
                  ref={canvasRef}
                  className="border-2 border-slate-300 shadow-lg"
                  style={{ 
                    backgroundColor: viewType === 'design' ? 'transparent' : 'white',
                    backgroundImage: viewType === 'design' ? 
                      'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px' : 
                      'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Technical Information */}
          {viewType === 'technical' && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Print Size:</span>
                  <p className="font-medium">{physicalWidth} × {physicalHeight} cm</p>
                </div>
                <div>
                  <span className="text-slate-500">Resolution:</span>
                  <p className="font-medium">{DPI} DPI</p>
                </div>
                <div>
                  <span className="text-slate-500">Color Mode:</span>
                  <p className="font-medium">RGB (Convert to CMYK)</p>
                </div>
                <div>
                  <span className="text-slate-500">Bleed:</span>
                  <p className="font-medium">3mm on all sides</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// CSS for checkered background
const style = document.createElement('style')
style.textContent = `
  .bg-checkered {
    background-image: 
      repeating-conic-gradient(#f8f8f8 0% 25%, white 0% 50%) 
      50% / 20px 20px;
  }
`
document.head.appendChild(style)