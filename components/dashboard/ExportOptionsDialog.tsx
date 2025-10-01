"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  exportDesignOnly, 
  exportComposite, 
  exportIndividualElements,
  generateTechnicalSpecs,
  createPrintReadyPackage,
  type ExportOptions 
} from "@/lib/utils/designExport"
import { FileImage, Package2, FileText, Layers, Download, Settings, Palette } from "lucide-react"

interface ExportOptionsDialogProps {
  isOpen: boolean
  onClose: () => void
  order: any
  itemIndex?: number | null
}

export function ExportOptionsDialog({ isOpen, onClose, order, itemIndex }: ExportOptionsDialogProps) {
  // Export settings
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'svg'>('png')
  const [exportDPI, setExportDPI] = useState(300)
  const [includeBleed, setIncludeBleed] = useState(true)
  const [backgroundColor, setBackgroundColor] = useState('transparent')
  const [jpegQuality, setJpegQuality] = useState(95)
  
  // Export type selection
  const [exportType, setExportType] = useState<'design' | 'composite' | 'elements' | 'package'>('design')
  
  // Processing state
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const options: ExportOptions = {
        format: exportFormat as any,
        dpi: exportDPI,
        includeBleed,
        backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor,
        quality: exportFormat === 'jpeg' ? jpegQuality / 100 : undefined
      }

      if (exportType === 'package') {
        // Export complete package
        toast.info('Generating complete print package...')
        await createPrintReadyPackage(order, exportDPI >= 300, true)
        toast.success('Print package downloaded successfully!')
      } else if (itemIndex !== null && itemIndex !== undefined) {
        // Export specific item
        const item = order.items[itemIndex]
        if (!item.designCanvasJSON) {
          toast.error('No design data available for this item')
          return
        }

        switch (exportType) {
          case 'design':
            const designData = await exportDesignOnly(item.designCanvasJSON, options)
            downloadFile(designData as string, `design-${order.id}-item-${itemIndex + 1}.${exportFormat}`)
            toast.success('Design exported successfully!')
            break
            
          case 'composite':
            if (item.designContext?.selectedVariation?.variationImages) {
              const productImage = item.designContext.selectedVariation.variationImages.find(
                (img: any) => img.angle === item.designContext.viewMode
              )?.url
              
              if (productImage) {
                const compositeData = await exportComposite(item.designCanvasJSON, productImage, options)
                downloadFile(compositeData, `composite-${order.id}-item-${itemIndex + 1}.${exportFormat}`)
                toast.success('Composite image exported successfully!')
              } else {
                toast.error('Product image not found')
              }
            } else {
              toast.error('Product variation data not available')
            }
            break
            
          case 'elements':
            const elements = await exportIndividualElements(item.designCanvasJSON)
            toast.info(`Exporting ${elements.length} individual elements...`)
            
            for (const [elemIndex, element] of elements.entries()) {
              const elemData = await exportDesignOnly(element.canvasJSON, options)
              downloadFile(
                elemData as string, 
                `element-${order.id}-item-${itemIndex + 1}-${elemIndex + 1}-${element.type}.${exportFormat}`
              )
            }
            toast.success(`${elements.length} elements exported successfully!`)
            break
        }
      } else {
        // Export all items
        toast.info('Exporting all items...')
        let exportCount = 0
        
        for (const [index, item] of order.items.entries()) {
          if (!item.designCanvasJSON) continue
          
          switch (exportType) {
            case 'design':
              const designData = await exportDesignOnly(item.designCanvasJSON, options)
              downloadFile(designData as string, `design-${order.id}-item-${index + 1}.${exportFormat}`)
              exportCount++
              break
              
            case 'composite':
              if (item.designContext?.selectedVariation?.variationImages) {
                const productImage = item.designContext.selectedVariation.variationImages.find(
                  (img: any) => img.angle === item.designContext.viewMode
                )?.url
                
                if (productImage) {
                  const compositeData = await exportComposite(item.designCanvasJSON, productImage, options)
                  downloadFile(compositeData, `composite-${order.id}-item-${index + 1}.${exportFormat}`)
                  exportCount++
                }
              }
              break
          }
        }
        
        if (exportCount > 0) {
          toast.success(`${exportCount} items exported successfully!`)
        } else {
          toast.warning('No items with design data found')
        }
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Export Options</DialogTitle>
        </DialogHeader>

        <Tabs value={exportType} onValueChange={(v) => setExportType(v as any)} className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="design" className="flex items-center gap-1">
              <FileImage className="h-4 w-4" />
              Design Only
            </TabsTrigger>
            <TabsTrigger value="composite" className="flex items-center gap-1">
              <Package2 className="h-4 w-4" />
              Composite
            </TabsTrigger>
            <TabsTrigger value="elements" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="package" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Full Package
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-4 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Design Only Export</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Export the design with a transparent background, perfect for printing directly onto products.
                Includes optional bleed area for professional printing.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="composite" className="mt-4 space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Composite Export</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Export the design overlaid on the product image. Great for customer previews and approval.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="elements" className="mt-4 space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Individual Elements</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Export each design element (text, images, shapes) as separate files. 
                Useful for multi-layer printing or editing individual components.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="package" className="mt-4 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Complete Package</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Generate a complete ZIP package with all export formats, technical specifications, 
                and printing instructions. Includes everything needed for production.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Settings */}
        {exportType !== 'package' && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Format Selection */}
              <div className="space-y-2">
                <Label htmlFor="format">Export Format</Label>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Recommended)</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="svg">SVG (Vector)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DPI Setting */}
              <div className="space-y-2">
                <Label htmlFor="dpi">Resolution (DPI): {exportDPI}</Label>
                <Slider
                  id="dpi"
                  min={72}
                  max={600}
                  step={1}
                  value={[exportDPI]}
                  onValueChange={(v) => setExportDPI(v[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>72 (Web)</span>
                  <span>300 (Print)</span>
                  <span>600 (High)</span>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              {/* Include Bleed */}
              {exportType === 'design' && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bleed">Include Bleed Area (3mm)</Label>
                    <p className="text-xs text-slate-500">Add extra space around design for cutting</p>
                  </div>
                  <Switch
                    id="bleed"
                    checked={includeBleed}
                    onCheckedChange={setIncludeBleed}
                  />
                </div>
              )}

              {/* Background Color */}
              {exportType === 'design' && (
                <div className="space-y-2">
                  <Label htmlFor="background">Background</Label>
                  <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                    <SelectTrigger id="background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transparent">Transparent</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* JPEG Quality */}
              {exportFormat === 'jpeg' && (
                <div className="space-y-2">
                  <Label htmlFor="quality">JPEG Quality: {jpegQuality}%</Label>
                  <Slider
                    id="quality"
                    min={60}
                    max={100}
                    step={1}
                    value={[jpegQuality]}
                    onValueChange={(v) => setJpegQuality(v[0])}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Item Selection Info */}
        {itemIndex !== null && itemIndex !== undefined && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Selected Item:</strong> {order.items[itemIndex].name} (Item #{itemIndex + 1})
            </p>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="bg-black hover:bg-gray-800"
          >
            {isExporting ? (
              <>Processing...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}