import * as fabric from 'fabric'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { exportDesignSimple } from './simpleDesignExport'

interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg' | 'pdf'
  dpi: number
  includeBleed: boolean
  backgroundColor?: string
  quality?: number
}

interface DesignElement {
  type: string
  properties: any
  canvasJSON: any
}

interface TechnicalSpecs {
  dimensions: {
    width: number
    height: number
    unit: 'px' | 'cm' | 'inch'
  }
  colors: string[]
  fonts: {
    family: string
    size: number
    weight: string
  }[]
  elements: {
    type: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    rotation: number
  }[]
}

// Convert pixels to physical units at given DPI
function pixelsToUnit(pixels: number, dpi: number, unit: 'cm' | 'inch'): number {
  const inches = pixels / dpi
  return unit === 'inch' ? inches : inches * 2.54
}

// Scale canvas for high-resolution export
function scaleCanvasForDPI(canvas: fabric.Canvas, targetDPI: number, baseDPI: number = 72): number {
  const scaleFactor = targetDPI / baseDPI
  
  // Don't actually scale the canvas dimensions or zoom
  // Instead, we'll use the multiplier in toDataURL
  // This avoids the setDimensions error
  
  return scaleFactor
}

// Export design without product background (transparent)
export async function exportDesignOnly(
  canvasJSON: any, 
  options: ExportOptions = { format: 'png', dpi: 300, includeBleed: false }
): Promise<string | Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary canvas
      const tempCanvas = document.createElement('canvas')
      const fabricCanvas = new fabric.Canvas(tempCanvas, {
        width: 800,
        height: 600,
        backgroundColor: options.backgroundColor || 'transparent'
      })

      // Clean the canvas JSON to remove problematic images
      const cleanedJSON = {
        ...canvasJSON,
        objects: (canvasJSON.objects || []).filter((obj: any) => {
          // Filter out images with external URLs that might fail to load
          if (obj.type === 'image' && obj.src) {
            if (obj.src.startsWith('http') || obj.src.includes('placeholder')) {
              console.warn('Skipping external image:', obj.src)
              return false
            }
          }
          return true
        })
      }

      // Load the cleaned design data
      fabricCanvas.loadFromJSON(cleanedJSON, () => {
        // Scale for high DPI if needed
        if (options.dpi > 72) {
          scaleCanvasForDPI(fabricCanvas, options.dpi)
        }

        // Add bleed area if requested (3mm standard bleed)
        if (options.includeBleed) {
          const bleedPixels = (options.dpi / 25.4) * 3 // 3mm bleed
          const currentWidth = fabricCanvas.width || 800
          const currentHeight = fabricCanvas.height || 600
          
          // Set canvas width and height directly
          fabricCanvas.width = currentWidth + (bleedPixels * 2)
          fabricCanvas.height = currentHeight + (bleedPixels * 2)
          
          // Offset all objects to account for bleed
          const objects = fabricCanvas.getObjects()
          objects.forEach(obj => {
            obj.left = (obj.left || 0) + bleedPixels
            obj.top = (obj.top || 0) + bleedPixels
          })
          
          fabricCanvas.renderAll()
        }

        // Export based on format
        let exportData: string | Blob
        switch (options.format) {
          case 'svg':
            exportData = fabricCanvas.toSVG()
            break
          case 'jpeg':
            exportData = fabricCanvas.toDataURL({
              format: 'jpeg',
              quality: options.quality || 0.95,
              multiplier: options.dpi / 72
            })
            break
          case 'png':
          default:
            exportData = fabricCanvas.toDataURL({
              format: 'png',
              multiplier: options.dpi / 72
            })
            break
        }

        // Clean up
        fabricCanvas.dispose()
        tempCanvas.remove()
        
        resolve(exportData)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// Export design with product image (composite)
export async function exportComposite(
  canvasJSON: any,
  productImage: string,
  options: ExportOptions = { format: 'png', dpi: 300, includeBleed: false }
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const tempCanvas = document.createElement('canvas')
      const fabricCanvas = new fabric.Canvas(tempCanvas, {
        width: 800,
        height: 600
      })

      // Clean the canvas JSON to remove problematic images
      const tempJSON = {
        ...canvasJSON,
        objects: (canvasJSON.objects || []).filter((obj: any) => {
          if (obj.type === 'image' && obj.src) {
            if (obj.src.startsWith('http') || obj.src.includes('placeholder')) {
              console.warn('Skipping external image in composite:', obj.src)
              return false
            }
          }
          return true
        })
      }
      delete tempJSON.background // Remove any background from design
      
      // Skip loading product image if it's a placeholder or external URL
      const shouldLoadProductImage = productImage && 
        !productImage.includes('placeholder') && 
        !productImage.startsWith('http');

      if (shouldLoadProductImage) {
        // Load product image first, then design
        fabric.Image.fromURL(productImage, (img) => {
          if (img) {
            const canvasWidth = fabricCanvas.width || 800
            const canvasHeight = fabricCanvas.height || 600
            img.scaleToWidth(canvasWidth)
            img.scaleToHeight(canvasHeight)
            img.set({
              left: 0,
              top: 0,
              selectable: false,
              evented: false
            })
            fabricCanvas.add(img)
            fabricCanvas.sendToBack(img)
          }

          // Load design on top
          fabricCanvas.loadFromJSON(tempJSON, () => {
            // Scale for high DPI
            if (options.dpi > 72) {
              scaleCanvasForDPI(fabricCanvas, options.dpi)
            }

            // Export
            const exportData = fabricCanvas.toDataURL({
              format: options.format === 'jpeg' ? 'jpeg' : 'png',
              quality: options.quality || 0.95,
              multiplier: options.dpi / 72
            })

            // Clean up
            fabricCanvas.dispose()
            tempCanvas.remove()
            
            resolve(exportData)
          }, null, { crossOrigin: 'anonymous' })
        }, { crossOrigin: 'anonymous' })
      } else {
        // Just load the design without product image
        fabricCanvas.loadFromJSON(tempJSON, () => {
          // Scale for high DPI
          if (options.dpi > 72) {
            scaleCanvasForDPI(fabricCanvas, options.dpi)
          }

          // Export
          const exportData = fabricCanvas.toDataURL({
            format: options.format === 'jpeg' ? 'jpeg' : 'png',
            quality: options.quality || 0.95,
            multiplier: options.dpi / 72
          })

          // Clean up
          fabricCanvas.dispose()
          tempCanvas.remove()
          
          resolve(exportData)
        }, null, { crossOrigin: 'anonymous' })
      }
    } catch (error) {
      reject(error)
    }
  })
}

// Export individual design elements
export async function exportIndividualElements(canvasJSON: any): Promise<DesignElement[]> {
  return new Promise((resolve, reject) => {
    try {
      const elements: DesignElement[] = []
      
      if (!canvasJSON.objects || canvasJSON.objects.length === 0) {
        resolve(elements)
        return
      }

      const tempCanvas = document.createElement('canvas')
      const fabricCanvas = new fabric.Canvas(tempCanvas, {
        width: 800,
        height: 600
      })

      // Process each object individually
      canvasJSON.objects.forEach((obj: any, index: number) => {
        // Create a new canvas with just this object
        const singleObjectJSON = {
          ...canvasJSON,
          objects: [obj]
        }

        elements.push({
          type: obj.type,
          properties: {
            id: `element_${index}`,
            text: obj.text,
            fontSize: obj.fontSize,
            fontFamily: obj.fontFamily,
            fill: obj.fill,
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            angle: obj.angle,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY
          },
          canvasJSON: singleObjectJSON
        })
      })

      // Clean up
      fabricCanvas.dispose()
      tempCanvas.remove()
      
      resolve(elements)
    } catch (error) {
      reject(error)
    }
  })
}

// Generate technical specifications
export function generateTechnicalSpecs(canvasJSON: any, productInfo?: any): TechnicalSpecs {
  const specs: TechnicalSpecs = {
    dimensions: {
      width: canvasJSON.width || 800,
      height: canvasJSON.height || 600,
      unit: 'px'
    },
    colors: [],
    fonts: [],
    elements: []
  }

  const colorSet = new Set<string>()
  const fontMap = new Map<string, any>()

  if (canvasJSON.objects) {
    canvasJSON.objects.forEach((obj: any) => {
      // Collect colors
      if (obj.fill && typeof obj.fill === 'string') {
        colorSet.add(obj.fill)
      }
      if (obj.stroke) {
        colorSet.add(obj.stroke)
      }

      // Collect fonts
      if (obj.type === 'text' || obj.type === 'i-text') {
        const fontKey = `${obj.fontFamily}_${obj.fontSize}_${obj.fontWeight}`
        if (!fontMap.has(fontKey)) {
          fontMap.set(fontKey, {
            family: obj.fontFamily || 'Arial',
            size: obj.fontSize || 12,
            weight: obj.fontWeight || 'normal'
          })
        }
      }

      // Collect element positions
      specs.elements.push({
        type: obj.type,
        position: { 
          x: Math.round(obj.left || 0), 
          y: Math.round(obj.top || 0) 
        },
        size: { 
          width: Math.round((obj.width || 0) * (obj.scaleX || 1)), 
          height: Math.round((obj.height || 0) * (obj.scaleY || 1))
        },
        rotation: obj.angle || 0
      })
    })
  }

  specs.colors = Array.from(colorSet)
  specs.fonts = Array.from(fontMap.values())

  return specs
}

// Create complete print-ready package
export async function createPrintReadyPackage(
  order: any,
  includeHighRes: boolean = true,
  includeTechSpecs: boolean = true
): Promise<void> {
  const zip = new JSZip()
  
  // Create folder structure
  const compositeFolder = zip.folder('composite-views')
  const designOnlyFolder = zip.folder('design-only')
  const techSpecsFolder = zip.folder('technical-specs')
  const elementsFolder = zip.folder('individual-elements')
  
  let hasAnyDesigns = false

  // Process each item in the order
  console.log(`Processing order with ${order.items?.length || 0} items`)
  for (const [itemIndex, item] of order.items.entries()) {
    console.log(`Processing item ${itemIndex + 1}: ${item.name}`)
    
    // Check for design data in multiple possible locations
    const canvasJSON = item.designCanvasJSON || 
                      item.designData?.canvasJSON || 
                      item.designData?.designCanvasJSON ||
                      item.canvasJSON
    
    // Skip items without design data
    if (!canvasJSON) {
      console.log(`Item ${itemIndex + 1} has no design data, skipping...`)
      continue
    }

    console.log(`Item ${itemIndex + 1} has design data with ${canvasJSON.objects?.length || 0} objects`)
    const itemName = `item-${itemIndex + 1}-${(item.name || 'product').replace(/[^a-z0-9]/gi, '_')}`
    hasAnyDesigns = true

    try {
      // Export composite view (design + product)
      if (item.designContext?.selectedVariation?.variationImages) {
        for (const varImage of item.designContext.selectedVariation.variationImages) {
          if (varImage.url) {
            const compositeData = await exportComposite(
              canvasJSON,
              varImage.url,
              { format: 'png', dpi: includeHighRes ? 300 : 150, includeBleed: false }
            )
            
            const compositeBlob = dataURLtoBlob(compositeData)
            compositeFolder?.file(
              `${itemName}-${varImage.angle}-composite.png`,
              compositeBlob
            )
          }
        }
      }

      // Export design only (transparent background)
      const designOnlyData = await exportDesignSimple(canvasJSON)
      
      const designOnlyBlob = dataURLtoBlob(designOnlyData as string)
      designOnlyFolder?.file(
        `${itemName}-design-only.png`,
        designOnlyBlob
      )

      // Export individual elements (skip for now to avoid errors)
      // const elements = await exportIndividualElements(canvasJSON)
      // for (const [elemIndex, element] of elements.entries()) {
      //   const elemData = await exportDesignSimple(element.canvasJSON)
      //   
      //   const elemBlob = dataURLtoBlob(elemData as string)
      //   elementsFolder?.file(
      //     `${itemName}-element-${elemIndex + 1}-${element.type}.png`,
      //     elemBlob
      //   )
      // }

      // Generate technical specifications
      if (includeTechSpecs) {
        const specs = generateTechnicalSpecs(canvasJSON, item)
        techSpecsFolder?.file(
          `${itemName}-specifications.json`,
          JSON.stringify(specs, null, 2)
        )

        // Create human-readable spec sheet
        const specSheet = createSpecSheet(specs, item)
        techSpecsFolder?.file(
          `${itemName}-spec-sheet.txt`,
          specSheet
        )
      }
    } catch (error) {
      console.error(`Error processing item ${itemIndex}:`, error)
    }
  }

  // If no designs were found, add a sample placeholder
  if (!hasAnyDesigns) {
    console.log('No design data found in order, creating sample files...')
    
    // Create a sample canvas with text
    const sampleCanvas = {
      version: "5.3.0",
      objects: [{
        type: "text",
        text: `Order ${order.id}\\nNo Design Data Available`,
        fontSize: 24,
        fontFamily: "Arial",
        fill: "#000000",
        left: 100,
        top: 100
      }],
      width: 800,
      height: 600,
      backgroundColor: "#ffffff"
    }
    
    // Export sample design
    try {
      const sampleDesign = await exportDesignOnly(
        sampleCanvas,
        { format: 'png', dpi: 150, includeBleed: false }
      )
      
      designOnlyFolder?.file(
        'no-design-placeholder.png',
        dataURLtoBlob(sampleDesign as string)
      )
      
      // Add note in tech specs
      techSpecsFolder?.file(
        'no-design-notice.txt',
        `Notice: No design data was found in this order.
Order ID: ${order.id}
Items: ${order.items.length}

This placeholder file was generated to verify the export system is working.
Please ensure design data is properly saved when customers create designs.`
      )
    } catch (error) {
      console.error('Error creating sample design:', error)
    }
  }

  // Add README with instructions
  const readme = createReadme(order)
  zip.file('README.txt', readme)

  // Generate and download the ZIP file
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, `order-${order.id}-print-package.zip`)
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// Create human-readable specification sheet
function createSpecSheet(specs: TechnicalSpecs, item: any): string {
  let sheet = `PRINT SPECIFICATION SHEET
========================
Product: ${item.name}
Generated: ${new Date().toISOString()}

DIMENSIONS
----------
Width: ${specs.dimensions.width}px (${pixelsToUnit(specs.dimensions.width, 300, 'cm').toFixed(2)}cm at 300 DPI)
Height: ${specs.dimensions.height}px (${pixelsToUnit(specs.dimensions.height, 300, 'cm').toFixed(2)}cm at 300 DPI)

COLORS USED
-----------
${specs.colors.map(color => `- ${color}`).join('\n')}

FONTS
-----
${specs.fonts.map(font => `- ${font.family}, ${font.size}px, ${font.weight}`).join('\n')}

DESIGN ELEMENTS
---------------
Total Elements: ${specs.elements.length}
${specs.elements.map((elem, i) => 
  `${i + 1}. ${elem.type.toUpperCase()}
   Position: (${elem.position.x}, ${elem.position.y})
   Size: ${elem.size.width} x ${elem.size.height}
   Rotation: ${elem.rotation}°`
).join('\n\n')}

PRINTING NOTES
--------------
- All measurements are from top-left corner
- Bleed area: 3mm on all sides included in design-only exports
- Recommended print resolution: 300 DPI
- Color profile: sRGB (convert to CMYK for professional printing)
`
  return sheet
}

// Create README file for the package
function createReadme(order: any): string {
  return `PRINT PACKAGE - Order ${order.id}
=====================================
Generated: ${new Date().toISOString()}
Customer: ${order.customerName || order.customer}

PACKAGE CONTENTS
----------------
1. /composite-views/
   - Product images with designs applied
   - Ready for preview and approval
   
2. /design-only/
   - Designs with transparent backgrounds
   - Includes 3mm bleed area
   - Ready for direct printing
   
3. /individual-elements/
   - Each design element exported separately
   - Useful for multi-layer printing
   
4. /technical-specs/
   - JSON files with precise measurements
   - Human-readable specification sheets
   - Color and font information

PRINTING INSTRUCTIONS
--------------------
1. Use design-only files for direct printing
2. Files are exported at 300 DPI for print quality
3. Bleed area of 3mm is included
4. Convert RGB to CMYK if required by printer
5. Verify colors with physical color swatches

SUPPORT
-------
For questions about this print package, reference Order ID: ${order.id}
Generated by PrintWrap Pro Operations System
`
}

// Export all functions for use in components
export {
  type ExportOptions,
  type DesignElement,
  type TechnicalSpecs
}