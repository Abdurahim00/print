import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileImage, Package2, Layers, Settings, Eye } from "lucide-react"
import Image from "next/image"
import { exportDesignOnly, exportComposite, createPrintReadyPackage } from "@/lib/utils/designExport"
import { DesignCanvasRenderer } from "@/components/DesignCanvasRenderer"

interface MultiPositionExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any
  item: any
  itemIndex: number
}

export const MultiPositionExportDialog: React.FC<MultiPositionExportDialogProps> = ({
  open,
  onOpenChange,
  order,
  item,
  itemIndex
}) => {
  const [exporting, setExporting] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("all")
  
  // Extract design positions from the item
  const getDesignPositions = () => {
    const positions: any[] = []
    
    // Check if item has multi-position designs
    if (item.designPositions) {
      return item.designPositions
    }
    
    // Check for variant position mapping
    if (item.variantPositionMappings) {
      return item.variantPositionMappings.map((mapping: any) => ({
        position: mapping.position,
        designData: item.designCanvasJSON,
        preview: item.designPreview
      }))
    }
    
    // Default single position
    return [{
      position: item.designContext?.viewMode || "front",
      designData: item.designCanvasJSON || item.designData?.canvasJSON,
      preview: item.designPreview
    }]
  }
  
  const positions = getDesignPositions()
  const hasMultiplePositions = positions.length > 1
  
  const handleExportAll = async () => {
    setExporting(true)
    try {
      // Create a comprehensive export package with all positions
      const exportData = {
        orderId: order.id,
        itemIndex,
        productName: item.name,
        positions: positions.map((pos: any) => ({
          position: pos.position,
          designData: pos.designData,
          dimensions: item.designFrames?.find((f: any) => f.position === pos.position),
          preview: pos.preview
        })),
        productInfo: {
          id: item.productId,
          variation: item.designContext?.selectedVariation,
          sizes: item.selectedSizes
        }
      }
      
      await createPrintReadyPackage(exportData)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }
  
  const handleExportPosition = async (position: any) => {
    setExporting(true)
    try {
      await exportDesignOnly(
        position.designData,
        `${order.id}_${itemIndex}_${position.position}`,
        { format: 'png', width: 2000, height: 2000 }
      )
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            Export Production Files - {item.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Summary */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Order Details</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Order #{order.id} • Item {itemIndex + 1} of {order.items.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700 dark:text-blue-300">Design Positions</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{positions.length}</p>
              </div>
            </div>
          </Card>
          
          {/* Multi-Position Tabs */}
          {hasMultiplePositions ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-auto gap-2">
                <TabsTrigger value="all">All Positions</TabsTrigger>
                {positions.map((pos: any, idx: number) => (
                  <TabsTrigger key={idx} value={pos.position}>
                    {pos.position.charAt(0).toUpperCase() + pos.position.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {positions.map((pos: any, idx: number) => (
                    <Card key={idx} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {pos.position.charAt(0).toUpperCase() + pos.position.slice(1)}
                          </Badge>
                          <Eye className="h-4 w-4 text-slate-400" />
                        </div>
                        
                        <div className="aspect-square relative bg-slate-100 rounded-lg overflow-hidden">
                          {pos.preview ? (
                            <Image
                              src={pos.preview}
                              alt={`${pos.position} design`}
                              fill
                              className="object-contain"
                            />
                          ) : pos.designData ? (
                            <DesignCanvasRenderer
                              canvasJSON={pos.designData}
                              width={200}
                              height={200}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                              No Design
                            </div>
                          )}
                        </div>
                        
                        {item.designFrames?.find((f: any) => f.position === pos.position) && (
                          <div className="text-xs text-slate-600">
                            Frame: {item.designFrames.find((f: any) => f.position === pos.position).width} × {item.designFrames.find((f: any) => f.position === pos.position).height} cm
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleExportAll}
                    disabled={exporting}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Positions as Package
                  </Button>
                </div>
              </TabsContent>
              
              {positions.map((pos: any, idx: number) => (
                <TabsContent key={idx} value={pos.position} className="space-y-4">
                  <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Design Preview</h4>
                        <div className="aspect-square relative bg-slate-100 rounded-lg overflow-hidden">
                          {pos.preview ? (
                            <Image
                              src={pos.preview}
                              alt={`${pos.position} design`}
                              fill
                              className="object-contain"
                            />
                          ) : pos.designData ? (
                            <DesignCanvasRenderer
                              canvasJSON={pos.designData}
                              width={400}
                              height={400}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                              No Design Available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Position Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Position:</span>
                              <span className="font-medium">{pos.position}</span>
                            </div>
                            {item.designFrames?.find((f: any) => f.position === pos.position) && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Design Area:</span>
                                  <span className="font-medium">
                                    {item.designFrames.find((f: any) => f.position === pos.position).width} × {item.designFrames.find((f: any) => f.position === pos.position).height} cm
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Position (X, Y):</span>
                                  <span className="font-medium">
                                    ({item.designFrames.find((f: any) => f.position === pos.position).x}, {item.designFrames.find((f: any) => f.position === pos.position).y})
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">Export Options</h4>
                          <Button
                            onClick={() => handleExportPosition(pos)}
                            disabled={exporting}
                            variant="outline"
                            className="w-full"
                          >
                            <FileImage className="h-4 w-4 mr-2" />
                            Export as PNG (2000x2000)
                          </Button>
                          <Button
                            onClick={() => exportDesignOnly(pos.designData, `${order.id}_${itemIndex}_${pos.position}`, { format: 'svg' })}
                            disabled={exporting}
                            variant="outline"
                            className="w-full"
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            Export as SVG
                          </Button>
                          <Button
                            onClick={() => exportComposite(pos.designData, item.image, `${order.id}_${itemIndex}_${pos.position}_composite`)}
                            disabled={exporting}
                            variant="outline"
                            className="w-full"
                          >
                            <Package2 className="h-4 w-4 mr-2" />
                            Export Composite Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            // Single position export
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Design Preview</h4>
                  <div className="aspect-square relative bg-slate-100 rounded-lg overflow-hidden">
                    {item.designPreview ? (
                      <Image
                        src={item.designPreview}
                        alt="Design preview"
                        fill
                        className="object-contain"
                      />
                    ) : item.designCanvasJSON ? (
                      <DesignCanvasRenderer
                        canvasJSON={item.designCanvasJSON}
                        width={400}
                        height={400}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        No Design Available
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Product Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Product:</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Quantity:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      {item.size && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Size:</span>
                          <span className="font-medium">{item.size}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Export Options</h4>
                    <Button
                      onClick={() => handleExportPosition(positions[0])}
                      disabled={exporting}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Production Files
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}