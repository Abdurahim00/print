import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Dynamic import for fabric to avoid SSR issues
let fabric: any = null

const loadFabric = async () => {
  if (!fabric) {
    try {
      // Try to get fabric from window first (if already loaded)
      if (typeof window !== 'undefined' && (window as any).fabric) {
        fabric = (window as any).fabric
        console.log('Using fabric.js from window')
      } else {
        // Dynamic import as fallback
        const fabricModule = await import('fabric')
        fabric = fabricModule.fabric || fabricModule.default || fabricModule

        // Store it globally for reuse
        if (typeof window !== 'undefined') {
          (window as any).fabric = fabric
        }
      }

      if (!fabric || (!fabric.Canvas && !fabric.StaticCanvas)) {
        console.error('Fabric object structure:', fabric)
        throw new Error('Fabric.js not properly loaded - Canvas constructor not found')
      }
    } catch (error) {
      console.error('Failed to load fabric.js:', error)
      throw new Error('Failed to load fabric.js library. Please refresh the page and try again.')
    }
  }
  return fabric
}

interface DesignData {
  angle: string
  stepNumber: number
  canvasJSON: any
  designAreaCm2: number
  designAreaPercentage: number
}

interface ProductData {
  id: string
  name: string
  frontImage?: string
  backImage?: string
  leftImage?: string
  rightImage?: string
  image?: string
  price: number
}

interface PrintFileOptions {
  product: ProductData
  designs: DesignData[]
  orderId: string
  customerName?: string
  includeIndividualElements?: boolean
  includeMockups?: boolean
  format?: 'pdf' | 'zip'
}

export class PrintFileService {
  private static async loadFabricCanvas(canvasJSON: any): Promise<any> {
    const fabricLib = await loadFabric()
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary canvas element
        const canvasEl = document.createElement('canvas')
        canvasEl.width = canvasJSON.width || 800
        canvasEl.height = canvasJSON.height || 800

        // Try creating canvas with different methods based on fabric version
        let tempCanvas: any

        if (fabricLib.Canvas) {
          tempCanvas = new fabricLib.Canvas(canvasEl, {
            width: canvasJSON.width || 800,
            height: canvasJSON.height || 800,
          })
        } else if (fabricLib.StaticCanvas) {
          tempCanvas = new fabricLib.StaticCanvas(canvasEl, {
            width: canvasJSON.width || 800,
            height: canvasJSON.height || 800,
          })
        } else {
          throw new Error('Cannot create fabric canvas - no Canvas or StaticCanvas constructor found')
        }

        tempCanvas.loadFromJSON(canvasJSON, () => {
          resolve(tempCanvas)
        }, (o: any, object: any) => {
          // Progress callback for debugging
          console.log('Loading object:', object.type)
        })
      } catch (error) {
        console.error('Error creating fabric canvas:', error)
        reject(error)
      }
    })
  }

  private static async exportCanvasAsImage(
    canvas: any,
    format: 'png' | 'jpeg' = 'png',
    scale: number = 2
  ): Promise<string> {
    return canvas.toDataURL({
      format,
      multiplier: scale,
      quality: 1,
    })
  }

  private static async exportIndividualElements(
    canvasJSON: any,
    angleLabel: string
  ): Promise<{ name: string; data: string }[]> {
    const elements: { name: string; data: string }[] = []
    const canvas = await this.loadFabricCanvas(canvasJSON)

    if (!canvas || !canvasJSON.objects) return elements

    const fabricLib = await loadFabric()

    for (let i = 0; i < canvasJSON.objects.length; i++) {
      const obj = canvasJSON.objects[i]

      // Create a new canvas with just this element
      const elementCanvas = new fabricLib.Canvas(null, {
        width: obj.width * (obj.scaleX || 1) + 100,
        height: obj.height * (obj.scaleY || 1) + 100,
      })

      elementCanvas.backgroundColor = 'transparent'

      // Clone and add the single object
      fabricLib.util.enlivenObjects([obj], (objects: any[]) => {
        if (objects[0]) {
          // Center the object in the canvas
          objects[0].set({
            left: elementCanvas.width! / 2,
            top: elementCanvas.height! / 2,
            originX: 'center',
            originY: 'center',
          })
          elementCanvas.add(objects[0])
        }
      })

      const elementData = await this.exportCanvasAsImage(elementCanvas, 'png', 3)
      elements.push({
        name: `${angleLabel}_element_${i + 1}_${obj.type || 'object'}.png`,
        data: elementData,
      })

      elementCanvas.dispose()
    }

    canvas.dispose()
    return elements
  }

  private static async createProductMockup(
    product: ProductData,
    design: DesignData
  ): Promise<string> {
    const fabricLib = await loadFabric()
    
    const mockupCanvas = new fabricLib.Canvas(null, {
      width: 1200,
      height: 1200,
      backgroundColor: '#f5f5f5',
    })

    // Get the appropriate product image
    let productImageUrl = product.image
    if (design.angle === 'front') productImageUrl = product.frontImage || product.image
    else if (design.angle === 'back') productImageUrl = product.backImage
    else if (design.angle === 'left') productImageUrl = product.leftImage
    else if (design.angle === 'right') productImageUrl = product.rightImage

    // Load product image
    if (productImageUrl) {
      await new Promise<void>((resolve) => {
        fabricLib.Image.fromURL(productImageUrl, (img: any) => {
          const scale = Math.min(
            800 / (img.width || 1),
            800 / (img.height || 1)
          )
          img.set({
            left: mockupCanvas.width! / 2,
            top: mockupCanvas.height! / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            selectable: false,
          })
          mockupCanvas.add(img)
          resolve()
        })
      })
    }

    // Load and overlay the design
    const designCanvas = await this.loadFabricCanvas(design.canvasJSON)
    const designDataUrl = await this.exportCanvasAsImage(designCanvas, 'png', 2)

    await new Promise<void>((resolve) => {
      fabricLib.Image.fromURL(designDataUrl, (img: any) => {
        img.set({
          left: mockupCanvas.width! / 2,
          top: mockupCanvas.height! / 2,
          originX: 'center',
          originY: 'center',
          opacity: 0.95,
          selectable: false,
        })
        mockupCanvas.add(img)
        resolve()
      })
    })

    const mockupData = await this.exportCanvasAsImage(mockupCanvas, 'jpeg', 2)

    designCanvas.dispose()
    mockupCanvas.dispose()

    return mockupData
  }

  private static async generatePDF(options: PrintFileOptions): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10

    // Cover page
    pdf.setFontSize(24)
    pdf.text('Print Production File', pageWidth / 2, 30, { align: 'center' })

    pdf.setFontSize(14)
    pdf.text(`Order: ${options.orderId}`, pageWidth / 2, 45, { align: 'center' })
    pdf.text(`Product: ${options.product.name}`, pageWidth / 2, 55, { align: 'center' })
    if (options.customerName) {
      pdf.text(`Customer: ${options.customerName}`, pageWidth / 2, 65, { align: 'center' })
    }
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 75, { align: 'center' })

    // Summary table
    pdf.setFontSize(12)
    let yPos = 95
    pdf.text('Design Summary:', margin, yPos)
    yPos += 10

    for (const design of options.designs) {
      pdf.setFontSize(10)
      pdf.text(`${design.angle.toUpperCase()} - Area: ${design.designAreaCm2.toFixed(2)} cm² (${design.designAreaPercentage.toFixed(1)}%)`, margin + 5, yPos)
      yPos += 7
    }

    // Add designs with mockups
    for (const design of options.designs) {
      pdf.addPage()

      // Page title
      pdf.setFontSize(16)
      pdf.text(`${design.angle.toUpperCase()} Design`, pageWidth / 2, 20, { align: 'center' })

      // Design specifications
      pdf.setFontSize(10)
      pdf.text(`Design Area: ${design.designAreaCm2.toFixed(2)} cm²`, margin, 30)
      pdf.text(`Coverage: ${design.designAreaPercentage.toFixed(1)}%`, margin, 37)
      pdf.text(`Elements: ${design.canvasJSON.objects?.length || 0}`, margin, 44)

      // Add mockup image
      if (options.includeMockups) {
        try {
          const mockupData = await this.createProductMockup(options.product, design)
          pdf.addImage(mockupData, 'JPEG', margin, 55, pageWidth - 2 * margin, pageWidth - 2 * margin)
        } catch (error) {
          console.error('Error adding mockup to PDF:', error)
        }
      }

      // Add individual elements on next page if requested
      if (options.includeIndividualElements && design.canvasJSON.objects?.length > 0) {
        pdf.addPage()
        pdf.setFontSize(14)
        pdf.text(`${design.angle.toUpperCase()} - Individual Elements`, pageWidth / 2, 20, { align: 'center' })

        const elements = await this.exportIndividualElements(design.canvasJSON, design.angle)

        let elementY = 35
        let elementX = margin
        const elementSize = 60

        for (let i = 0; i < elements.length; i++) {
          if (elementY + elementSize > pageHeight - margin) {
            pdf.addPage()
            elementY = 35
          }

          try {
            pdf.addImage(elements[i].data, 'PNG', elementX, elementY, elementSize, elementSize)
            pdf.setFontSize(8)
            pdf.text(`Element ${i + 1}`, elementX + elementSize / 2, elementY + elementSize + 5, { align: 'center' })
          } catch (error) {
            console.error('Error adding element to PDF:', error)
          }

          elementX += elementSize + 10
          if (elementX + elementSize > pageWidth - margin) {
            elementX = margin
            elementY += elementSize + 15
          }
        }
      }
    }

    return pdf.output('blob')
  }

  private static async generateZIP(options: PrintFileOptions): Promise<Blob> {
    const zip = new JSZip()

    // Create order info file
    const orderInfo = {
      orderId: options.orderId,
      productId: options.product.id,
      productName: options.product.name,
      customerName: options.customerName,
      date: new Date().toISOString(),
      designs: options.designs.map(d => ({
        angle: d.angle,
        designAreaCm2: d.designAreaCm2,
        designAreaPercentage: d.designAreaPercentage,
        elementCount: d.canvasJSON.objects?.length || 0,
      })),
    }

    zip.file('order_info.json', JSON.stringify(orderInfo, null, 2))

    // Create folders for each design angle
    for (const design of options.designs) {
      const angleFolder = zip.folder(design.angle)

      if (!angleFolder) continue

      // Export full design
      const canvas = await this.loadFabricCanvas(design.canvasJSON)
      const fullDesignData = await this.exportCanvasAsImage(canvas, 'png', 3)
      angleFolder.file('full_design.png', fullDesignData.split(',')[1], { base64: true })

      // Export mockup if requested
      if (options.includeMockups) {
        try {
          const mockupData = await this.createProductMockup(options.product, design)
          angleFolder.file('mockup.jpg', mockupData.split(',')[1], { base64: true })
        } catch (error) {
          console.error('Error creating mockup:', error)
        }
      }

      // Export individual elements if requested
      if (options.includeIndividualElements) {
        const elementsFolder = angleFolder.folder('elements')
        if (elementsFolder) {
          const elements = await this.exportIndividualElements(design.canvasJSON, design.angle)
          for (const element of elements) {
            elementsFolder.file(element.name, element.data.split(',')[1], { base64: true })
          }
        }
      }

      // Save canvas JSON for potential re-editing
      angleFolder.file('design_data.json', JSON.stringify(design.canvasJSON, null, 2))

      canvas.dispose()
    }

    return await zip.generateAsync({ type: 'blob' })
  }

  public static async generatePrintFile(options: PrintFileOptions): Promise<void> {
    try {
      // Validate required options
      if (!options.product || !options.designs || options.designs.length === 0) {
        throw new Error('Missing required options: product and designs are required')
      }

      // Set defaults
      const finalOptions = {
        includeIndividualElements: true,
        includeMockups: true,
        format: 'zip' as const,
        ...options,
      }

      let blob: Blob
      let filename: string

      if (finalOptions.format === 'pdf') {
        blob = await this.generatePDF(finalOptions)
        filename = `print_file_${finalOptions.orderId}.pdf`
      } else {
        blob = await this.generateZIP(finalOptions)
        filename = `print_file_${finalOptions.orderId}.zip`
      }

      // Trigger download
      saveAs(blob, filename)

      console.log(`✅ Print file generated: ${filename}`)
    } catch (error) {
      console.error('Error generating print file:', error)
      throw new Error(`Failed to generate print file: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  public static async generatePrintFileBuffer(options: PrintFileOptions): Promise<{ buffer: ArrayBuffer; filename: string }> {
    try {
      // Validate required options
      if (!options.product || !options.designs || options.designs.length === 0) {
        throw new Error('Missing required options: product and designs are required')
      }

      const finalOptions = {
        includeIndividualElements: true,
        includeMockups: true,
        format: 'zip' as const,
        ...options,
      }

      let blob: Blob
      let filename: string

      if (finalOptions.format === 'pdf') {
        blob = await this.generatePDF(finalOptions)
        filename = `print_file_${finalOptions.orderId}.pdf`
      } else {
        blob = await this.generateZIP(finalOptions)
        filename = `print_file_${finalOptions.orderId}.zip`
      }

      const buffer = await blob.arrayBuffer()
      return { buffer, filename }
    } catch (error) {
      console.error('Error generating print file buffer:', error)
      throw new Error(`Failed to generate print file buffer: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}