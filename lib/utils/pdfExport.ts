import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface OrderItem {
  name: string
  quantity: number
  price: number
  size?: string
  designPreview?: string
  designId?: string
  selectedSizes?: any[]
  designContext?: any
  designContextDetails?: any
  designCanvasJSON?: any
  productId?: string
  allDesignedAngles?: any[]
  finalItem?: any
  [key: string]: any // Allow additional properties
}

interface Order {
  id: string
  customer: string
  date: string
  total: number
  status: string
  items: OrderItem[]
  shippingOption: string
  paymentMethod: string
  paymentIntentId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerPostalCode?: string
  customerCountry?: string
}

interface DesignElement {
  type: string
  content: string
  properties: any
  productName: string
  productAngle: string
  orderItemIndex: number
  elementIndex: number
}

// Helper function to load fabric.js for server-side rendering - DEPRECATED, not needed for current implementation

// Extract all design elements from canvas JSON - DEPRECATED, now handled inline

// Get readable content from design element
function getElementContent(obj: any): string {
  switch (obj.type) {
    case 'text':
    case 'i-text':
    case 'textbox':
    case 'IText':
      return obj.text || 'Text Element'
    case 'image':
    case 'Image':
      return obj.src ? 'Image Element' : 'Image (No Source)'
    case 'rect':
      return 'Rectangle Shape'
    case 'circle':
      return 'Circle Shape'
    case 'triangle':
      return 'Triangle Shape'
    case 'line':
      return 'Line Element'
    case 'path':
      return 'Path/Vector Element'
    case 'group':
      return 'Group Element'
    default:
      return `${obj.type || 'Unknown'} Element`
  }
}

// Function to add image to PDF
async function addImageToPDF(doc: any, imageSrc: string, x: number, y: number, width: number, height: number): Promise<boolean> {
  try {
    if (imageSrc.startsWith('data:image/')) {
      // Handle base64 data URLs
      const base64Data = imageSrc.split(',')[1]
      if (base64Data) {
        // For jsPDF, we need to convert base64 to Uint8Array
        const binaryString = atob(base64Data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        
        // Add image to PDF
        doc.addImage(bytes, 'PNG', x, y, width, height)
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Error adding image to PDF:', error)
    return false
  }
}

// Render a single design element to canvas and capture as image - DEPRECATED, now handled inline in PDF

// Generate enhanced PDF with individual design elements
export async function generateEnhancedOrderPDF(order: Order): Promise<jsPDF> {
  const doc = new jsPDF()
  
  // Set light gray background for all pages
  const lightGray = 248
  doc.setFillColor(lightGray, lightGray, lightGray)
  doc.rect(0, 0, 210, 297, 'F') // A4 size background
  
  // Set document properties
  doc.setProperties({
    title: `Order ${order.id} - Design Elements - PrintWrap Pro`,
    subject: `Design Elements for Order ${order.id}`,
    author: 'PrintWrap Pro Admin',
    creator: 'PrintWrap Pro Production System'
  })

  // PAGE 1: Order Overview and Information
  // Company Header
  doc.setFillColor(99, 76, 158) // Purple brand color
  doc.rect(0, 0, 210, 25, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('PrintWrap Pro - Production PDF', 20, 16)
  
  // Reset background for content
  doc.setFillColor(lightGray, lightGray, lightGray)
  doc.rect(0, 25, 210, 272, 'F')
  
  // Order Header
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`Order ${order.id} - Design Elements`, 20, 40)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50)
  doc.text(`Order Date: ${order.date} | Status: ${order.status}`, 20, 58)
  
  // Customer Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Customer Information', 20, 75)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  let yPos = 83
  
  if (order.customerName) {
    doc.text(`Name: ${order.customerName}`, 20, yPos)
    yPos += 6
  }
  doc.text(`Customer ID: ${order.customer}`, 20, yPos)
  yPos += 6
  
  if (order.customerEmail) {
    doc.text(`Email: ${order.customerEmail}`, 20, yPos)
    yPos += 6
  }
  
  // Order Summary
  yPos += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Order Summary', 20, yPos)
  yPos += 8
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Items: ${order.items.length}`, 20, yPos)
  yPos += 6
  doc.text(`Total Amount: ${order.total.toFixed(2)} SEK`, 20, yPos)
  yPos += 6
  doc.text(`Payment Method: ${order.paymentMethod}`, 20, yPos)
  yPos += 6
  doc.text(`Shipping: ${order.shippingOption}`, 20, yPos)
  
  // Extract all design elements from allDesignedAngles
  const designElements: DesignElement[] = []
  
  order.items.forEach((item, itemIndex) => {
    // Process designs array - this is the main data structure
    if (item.designs && Array.isArray(item.designs)) {
      console.log(`📦 Processing ${item.designs.length} designs for item: ${item.name}`)
      
      item.designs.forEach((design: any, designIndex: number) => {
        console.log(`  🎨 Design ${designIndex + 1} (${design.angle}):`, {
          angle: design.angle,
          stepNumber: design.stepNumber,
          designAreaCm2: design.designAreaCm2,
          hasCanvasJSON: !!design.canvasJSON,
          objectsCount: design.canvasJSON?.objects?.length || 0
        })
        
        if (design.canvasJSON?.objects && Array.isArray(design.canvasJSON.objects)) {
          design.canvasJSON.objects.forEach((obj: any, objIndex: number) => {
            const element: DesignElement = {
              type: obj.type || 'unknown',
              content: getElementContent(obj),
              properties: {
                ...obj,
                left: obj.left || 0,
                top: obj.top || 0,
                width: obj.width || 100,
                height: obj.height || 100,
                scaleX: obj.scaleX || 1,
                scaleY: obj.scaleY || 1,
                angle: obj.angle || 0,
                fontSize: obj.fontSize,
                fontFamily: obj.fontFamily,
                fontWeight: obj.fontWeight,
                fill: obj.fill,
                text: obj.text
              },
              productName: item.name,
              productAngle: design.angle,
              orderItemIndex: itemIndex,
              elementIndex: objIndex
            }
            designElements.push(element)
            console.log(`    🎯 Added element: ${element.type} - "${element.content}"`)
          })
        }
      })
    }
    
    // Fallback: Check other possible data structures
    else {
      console.log(`⚠️ No designs array found for item: ${item.name}`)
      
      // Try other possible paths for backward compatibility
      let allDesignedAngles = null
      
      if (item.designContext?.allDesignedAngles) {
        allDesignedAngles = item.designContext.allDesignedAngles
      } else if (item.designContextDetails?.allDesignedAngles) {
        allDesignedAngles = item.designContextDetails.allDesignedAngles
      } else if (item.allDesignedAngles) {
        allDesignedAngles = item.allDesignedAngles
      } else if (item.finalItem?.designContextDetails?.allDesignedAngles) {
        allDesignedAngles = item.finalItem.designContextDetails.allDesignedAngles
      }
      
      if (allDesignedAngles) {
        console.log(`📦 Fallback: Processing ${allDesignedAngles.length} allDesignedAngles`)
        allDesignedAngles.forEach((designedAngle: any) => {
          let objects = null
          
          if (designedAngle.hasCanvasJSON?.objects) {
            objects = designedAngle.hasCanvasJSON.objects
          } else if (designedAngle.hasCanvasData?.objects) {
            objects = designedAngle.hasCanvasData.objects
          } else if (designedAngle.canvasJSON?.objects) {
            objects = designedAngle.canvasJSON.objects
          } else if (designedAngle.objects) {
            objects = designedAngle.objects
          }
          
          if (objects && Array.isArray(objects)) {
            objects.forEach((obj: any, objIndex: number) => {
              const element: DesignElement = {
                type: obj.type || 'unknown',
                content: getElementContent(obj),
                properties: {
                  ...obj,
                  left: obj.left || 0,
                  top: obj.top || 0,
                  width: obj.width || 100,
                  height: obj.height || 100,
                  scaleX: obj.scaleX || 1,
                  scaleY: obj.scaleY || 1,
                  angle: obj.angle || 0
                },
                productName: item.name,
                productAngle: designedAngle.angle,
                orderItemIndex: itemIndex,
                elementIndex: objIndex
              }
              designElements.push(element)
            })
          }
        })
      }
    }
  })
  
  yPos += 15
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`Design Elements Overview (${designElements.length} total)`, 20, yPos)
  yPos += 8
  
  // Group elements by product and angle
  const elementsByProductAngle: { [key: string]: DesignElement[] } = {}
  designElements.forEach(element => {
    const key = `${element.productName} (${element.productAngle})`
    if (!elementsByProductAngle[key]) {
      elementsByProductAngle[key] = []
    }
    elementsByProductAngle[key].push(element)
  })
  
  // List products and their element counts
  Object.entries(elementsByProductAngle).forEach(([productKey, elements]) => {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${productKey}:`, 25, yPos)
    yPos += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    elements.forEach((element, index) => {
      doc.text(`  ${index + 1}. ${element.content} (${element.type})`, 30, yPos)
      yPos += 5
    })
    yPos += 3
  })
  
  // Design Statistics Summary
  yPos += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Design Statistics Summary', 20, yPos)
  yPos += 8
  
  // Calculate total design area and other stats
  let totalDesignArea = 0
  let totalElements = designElements.length
  const angleStats: { [key: string]: { count: number, area: number } } = {}
  
  // Group by product and angle for stats
  Object.entries(elementsByProductAngle).forEach(([productKey, elements]) => {
    const angle = productKey.split('(')[1]?.replace(')', '') || 'unknown'
    const area = elements.reduce((sum, el) => {
      // Calculate element area in cm² (approximate)
      const width = (el.properties.width || 100) * (el.properties.scaleX || 1)
      const height = (el.properties.height || 100) * (el.properties.scaleY || 1)
      // Convert pixels to cm (assuming 37.795 pixels per cm)
      const widthCm = width / 37.795
      const heightCm = height / 37.795
      return sum + (widthCm * heightCm)
    }, 0)
    
    if (!angleStats[angle]) {
      angleStats[angle] = { count: 0, area: 0 }
    }
    angleStats[angle].count += elements.length
    angleStats[angle].area += area
    totalDesignArea += area
  })
  
  // Display stats with beautiful formatting
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Design Area: ${totalDesignArea.toFixed(2)} cm²`, 20, yPos)
  yPos += 6
  doc.text(`Total Elements: ${totalElements}`, 20, yPos)
  yPos += 6
  
  // Show stats per angle
  Object.entries(angleStats).forEach(([angle, stats]) => {
    doc.text(`${angle.toUpperCase()}: ${stats.count} elements, ${stats.area.toFixed(2)} cm²`, 25, yPos)
    yPos += 5
  })
  
  // Add footer to first page
  doc.setFontSize(8)
  doc.setTextColor(99, 76, 158)
  doc.text('PrintWrap Pro - Production System', 105, 285, { align: 'center' })
  doc.text(`Page 1 of ${Object.keys(elementsByProductAngle).length + 1}`, 105, 290, { align: 'center' })
  
  // PAGES 2+: Individual Design Angles (one per page)
  let pageNumber = 2
  for (const [productKey, elements] of Object.entries(elementsByProductAngle)) {
    doc.addPage()
    
    // Light gray background for visibility
    doc.setFillColor(lightGray, lightGray, lightGray)
    doc.rect(0, 0, 210, 297, 'F')
    
    // Page Header
    doc.setFillColor(99, 76, 158)
    doc.rect(0, 0, 210, 20, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Design Elements for ${productKey}`, 20, 13)
    
    // Beautiful Badges Header with multiple background colors
    doc.setFillColor(lightGray + 10, lightGray + 10, lightGray + 10) // Slightly darker gray
    doc.rect(0, 20, 210, 35, 'F')
    
    // Calculate design area for this angle
    const angleDesignArea = elements.reduce((sum, el) => {
      const width = (el.properties.width || 100) * (el.properties.scaleX || 1)
      const height = (el.properties.height || 100) * (el.properties.scaleY || 1)
      const widthCm = width / 37.795
      const heightCm = height / 37.795
      return sum + (widthCm * heightCm)
    }, 0)
    
    // Badge 1: Total Elements (Blue)
    doc.setFillColor(59, 130, 246) // Blue
    doc.rect(20, 25, 35, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('ELEMENTS', 22, 30)
    doc.setFontSize(10)
    doc.text(`${elements.length}`, 22, 35)
    
    // Badge 2: Design Area (Green)
    doc.setFillColor(34, 197, 94) // Green
    doc.rect(60, 25, 40, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('AREA', 62, 30)
    doc.setFontSize(10)
    doc.text(`${angleDesignArea.toFixed(1)} cm²`, 62, 35)
    
    // Badge 3: Product Angle (Purple)
    const angle = productKey.split('(')[1]?.replace(')', '') || 'unknown'
    doc.setFillColor(147, 51, 234) // Purple
    doc.rect(105, 25, 30, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('ANGLE', 107, 30)
    doc.setFontSize(10)
    doc.text(angle.toUpperCase(), 107, 35)
    
    // Badge 4: Coverage Percentage (Orange)
    const coveragePercent = (angleDesignArea / 900) * 100 // Assuming 30x30cm printable area
    doc.setFillColor(249, 115, 22) // Orange
    doc.rect(140, 25, 35, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('COVERAGE', 142, 30)
    doc.setFontSize(10)
    doc.text(`${coveragePercent.toFixed(1)}%`, 142, 35)
    
    // Product name
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${productKey}`, 20, 50)
    
        // Render all elements for this angle on the same page
    let elementY = 60
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index]
      
      // Element container
      // doc.setFillColor(255, 255, 255) // White background for element area
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      // doc.rect(20, elementY, 170, 80, 'FD') // Fill and Draw (white with gray border)
      
      // Calculate element dimensions
      const elementWidth = (element.properties.width || 100) * (element.properties.scaleX || 1)
      const elementHeight = (element.properties.height || 100) * (element.properties.scaleY || 1)
      const elementWidthCm = elementWidth / 37.795
      const elementHeightCm = elementHeight / 37.795
      const elementAreaCm2 = elementWidthCm * elementHeightCm
      
      // Element header with beautiful gradient-like background
      doc.setFillColor(lightGray + 15, lightGray + 15, lightGray + 15)
      doc.rect(20, elementY, 170, 25, 'F')
      
      // Element type badge (left side)
      const typeColors: { [key: string]: [number, number, number] } = {
        'text': [59, 130, 246],      // Blue
        'i-text': [59, 130, 246],    // Blue
        'IText': [59, 130, 246],     // Blue
        'image': [34, 197, 94],      // Green
        'Image': [34, 197, 94],      // Green
        'rect': [249, 115, 22],      // Orange
        'circle': [168, 85, 247],    // Purple
        'triangle': [236, 72, 153],  // Pink
        'line': [16, 185, 129],      // Teal
        'path': [245, 158, 11]       // Yellow
      }
      
      const elementColor = typeColors[element.type] || [100, 100, 100] // Default gray
      doc.setFillColor(elementColor[0], elementColor[1], elementColor[2])
      doc.rect(22, elementY + 2, 40, 8, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(element.type.toUpperCase(), 24, elementY + 7)
      
      // Element number and content
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(`Element ${index + 1}`, 25, elementY + 12)
      
      // Dimensions badge (right side)
      doc.setFillColor(99, 76, 158) // Purple
      doc.rect(130, elementY + 2, 55, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(`${elementWidthCm.toFixed(1)}×${elementHeightCm.toFixed(1)} cm`, 132, elementY + 7)
      
      // Area badge (bottom right)
      doc.setFillColor(34, 197, 94) // Green
      doc.rect(130, elementY + 12, 55, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(`${elementAreaCm2.toFixed(2)} cm²`, 132, elementY + 17)
      
      // Element content area
      const contentY = elementY + 25
      
      try {
        if (element.type === 'text' || element.type === 'i-text' || element.type === 'textbox' || element.type === 'IText') {
          // Render text elements directly in PDF with actual content
          const text = element.properties.text || element.content
          const fontSize = Math.min(Math.max((element.properties.fontSize || 16) * 0.4, 8), 20)
          const fontFamily = element.properties.fontFamily || 'helvetica'
          const fontWeight = element.properties.fontWeight === 'bold' ? 'bold' : 'normal'
          const fontStyle = element.properties.fontStyle === 'italic' ? 'italic' : 'normal'
          
          doc.setFontSize(fontSize)
          doc.setFont(fontFamily.toLowerCase(), fontWeight)
          
          // Set text color
          if (element.properties.fill) {
            const color = element.properties.fill
            if (color.startsWith('#')) {
              const r = parseInt(color.slice(1, 3), 16)
              const g = parseInt(color.slice(3, 5), 16)
              const b = parseInt(color.slice(5, 7), 16)
              doc.setTextColor(r, g, b)
            } else if (color.startsWith('rgb(')) {
              // Handle rgb format like "rgb(0,0,0)"
              const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
              if (rgbMatch) {
                const r = parseInt(rgbMatch[1])
                const g = parseInt(rgbMatch[2])
                const b = parseInt(rgbMatch[3])
                doc.setTextColor(r, g, b)
              } else {
                doc.setTextColor(0, 0, 0)
              }
            } else {
              doc.setTextColor(0, 0, 0) // Default to black
            }
          } else {
            doc.setTextColor(0, 0, 0)
          }
          
          // Center the text in the display area
          const textAlign = element.properties.textAlign || 'center'
          doc.text(text, 105, contentY + 20, { align: textAlign as any })
          
          // Show text properties
          // doc.setFontSize(8)
          // doc.setTextColor(100, 100, 100)
          // let fontInfo = `Font: ${fontFamily}`
          // if (fontWeight === 'bold') fontInfo += ' Bold'
          // if (fontStyle === 'italic') fontInfo += ' Italic'
          // doc.text(`${fontInfo} | Size: ${element.properties.fontSize || 16}px`, 25, contentY + 35)
          
        } else if (element.type === 'image' || element.type === 'Image') {
          // For image elements, try to render the actual image
          if (element.properties.src && element.properties.src.startsWith('data:image/')) {
            try {
              // Calculate image dimensions to fit in the display area
              const maxWidth = 150
              const maxHeight = 60
              let imgWidth = element.properties.width || 100
              let imgHeight = element.properties.height || 100
              
              // Scale down if too large
              if (imgWidth > maxWidth || imgHeight > maxHeight) {
                const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
                imgWidth *= scale
                imgHeight *= scale
              }
              
              // Center the image in the display area
              const imgX = 105 - (imgWidth / 2)
              const imgY = contentY + 10
              
              // Try to add the actual image to PDF
              let imageAdded = false
              try {
                imageAdded = await addImageToPDF(doc, element.properties.src, imgX, imgY, imgWidth, imgHeight)
              } catch (imgAddError) {
                console.error('Error adding image to PDF:', imgAddError)
                imageAdded = false
              }
              
              if (!imageAdded) {
                // Fallback to text if image couldn't be added
                doc.setFontSize(10)
                doc.setTextColor(100, 100, 100)
                doc.text('Image Element', 105, contentY + 20, { align: 'center' })
                doc.setFontSize(8)
                doc.text('(Image render failed)', 105, contentY + 35, { align: 'center' })
              }
            } catch (imgError) {
              // Fallback to text if image rendering fails
              doc.setFontSize(10)
              doc.setTextColor(100, 100, 100)
              doc.text('Image Element', 105, contentY + 20, { align: 'center' })
              doc.setFontSize(8)
              doc.text('(Image render error)', 105, contentY + 35, { align: 'center' })
            }
          } else {
            // No image source, show placeholder
            // doc.setFontSize(10)
            // doc.setTextColor(100, 100, 100)
            // doc.text('Image Element', 105, contentY + 20, { align: 'center' })
            // doc.setFontSize(8)
            // doc.text('(No image source)', 105, contentY + 35, { align: 'center' })
          }
          
          // Show image properties
          // if (element.properties.fill) {
          //   doc.setFontSize(8)
          //   doc.text(`Fill Color: ${element.properties.fill}`, 105, contentY + 65, { align: 'center' })
          // }
          
        } else {
          // For other elements, show element information
          // doc.setFontSize(10)
          // doc.setTextColor(100, 100, 100)
          // doc.text(element.content, 105, contentY + 20, { align: 'center' })
          
          // Show basic properties
          // if (element.properties.fill) {
          //   doc.setFontSize(8)
          //   doc.text(`Fill Color: ${element.properties.fill}`, 105, contentY + 35, { align: 'center' })
          // }
        }
      } catch (renderError) {
        console.error('Error rendering element in PDF:', renderError)
        doc.setFontSize(8)
        doc.setTextColor(200, 0, 0)
        doc.text('Error rendering element', 105, contentY + 20, { align: 'center' })
      }
      
      // Element details
      // doc.setFontSize(7)
      // doc.setTextColor(80, 80, 80)
      // doc.text(`Position: (${Math.round(element.properties.left)}, ${Math.round(element.properties.top)}) | Scale: ${element.properties.scaleX || 1}×${element.properties.scaleY || 1}`, 25, contentY + 50)
      
      elementY += 110 // Space for next element (increased for new header)
      
      // Check if we need a new page for more elements
      if (elementY > 250 && index < elements.length - 1) {
        doc.addPage()
        pageNumber++
        
        // Light gray background for new page
        doc.setFillColor(lightGray, lightGray, lightGray)
        doc.rect(0, 0, 210, 297, 'F')
        
        // Page Header for continuation with badges
        doc.setFillColor(99, 76, 158)
        doc.rect(0, 0, 210, 20, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`Design Elements for ${productKey} (Continued)`, 20, 13)
        
        // Re-add badges for continuation page
        doc.setFillColor(lightGray + 10, lightGray + 10, lightGray + 10)
        doc.rect(0, 20, 210, 35, 'F')
        
        // Badge 1: Total Elements (Blue)
        doc.setFillColor(59, 130, 246)
        doc.rect(20, 25, 35, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text('ELEMENTS', 22, 30)
        doc.setFontSize(10)
        doc.text(`${elements.length}`, 22, 35)
        
        // Badge 2: Design Area (Green)
        doc.setFillColor(34, 197, 94)
        doc.rect(60, 25, 40, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text('AREA', 62, 30)
        doc.setFontSize(10)
        doc.text(`${angleDesignArea.toFixed(1)} cm²`, 62, 35)
        
        // Badge 3: Product Angle (Purple)
        doc.setFillColor(147, 51, 234)
        doc.rect(105, 25, 30, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text('ANGLE', 107, 30)
        doc.setFontSize(10)
        doc.text(angle.toUpperCase(), 107, 35)
        
        // Badge 4: Coverage Percentage (Orange)
        doc.setFillColor(249, 115, 22)
        doc.rect(140, 25, 35, 12, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text('COVERAGE', 142, 30)
        doc.setFontSize(10)
        doc.text(`${coveragePercent.toFixed(1)}%`, 142, 35)
        
        elementY = 60 // Reset Y position for new page
      }
    }
    
    // Page Footer
    doc.setFontSize(8)
    doc.setTextColor(99, 76, 158)
    doc.text(`Order ${order.id} - ${productKey}`, 20, 290)
    doc.text(`PrintWrap Pro Production System`, 105, 290, { align: 'center' })
    doc.text(`Page ${pageNumber}`, 190, 290, { align: 'right' })
    
    pageNumber++
  }
  
  return doc
}

// Enhanced download function
export async function downloadEnhancedOrderPDF(order: Order, filename?: string): Promise<void> {
  try {
    const doc = await generateEnhancedOrderPDF(order)
    const defaultFilename = `order-${order.id}-design-elements-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename || defaultFilename)
  } catch (error) {
    console.error('Error generating enhanced PDF:', error)
    throw new Error('Failed to generate enhanced PDF with design elements')
  }
}

// Fallback function for basic PDF (original functionality)
export function generateBasicOrderPDF(order: Order): jsPDF {
  const doc = new jsPDF()
  
  // Set light gray background
  const lightGray = 248
  doc.setFillColor(lightGray, lightGray, lightGray)
  doc.rect(0, 0, 210, 297, 'F')
  
  // Set document properties
  doc.setProperties({
    title: `Order ${order.id} - PrintWrap Pro`,
    subject: `Order Details for ${order.id}`,
    author: 'PrintWrap Pro Admin',
    creator: 'PrintWrap Pro System'
  })

  // Company Header
  doc.setFillColor(99, 76, 158)
  doc.rect(0, 0, 210, 30, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('PrintWrap Pro', 20, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Professional Print Solutions', 20, 30)
  
  // Reset background
  doc.setFillColor(lightGray, lightGray, lightGray)
  doc.rect(0, 30, 210, 267, 'F')
  
  // Order information (rest of original implementation)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`Order ${order.id}`, 20, 50)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${order.date} | Status: ${order.status}`, 20, 65)
  doc.text(`Total: ${order.total.toFixed(2)} SEK | Payment: ${order.paymentMethod}`, 20, 75)
  
  // Add basic order details
  let yPos = 90
  order.items.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage()
      doc.setFillColor(lightGray, lightGray, lightGray)
      doc.rect(0, 0, 210, 297, 'F')
      yPos = 20
    }
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}. ${item.name}`, 20, yPos)
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Quantity: ${item.quantity} | Price: ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price} SEK`, 20, yPos)
    yPos += 15
  })
  
  return doc
}

// Main export function that tries enhanced first, falls back to basic
export async function downloadOrderPDF(order: Order, filename?: string): Promise<void> {
  try {
    // Try enhanced PDF first
    await downloadEnhancedOrderPDF(order, filename)
  } catch (enhancedError) {
    console.warn('Enhanced PDF generation failed, falling back to basic PDF:', enhancedError)
    try {
      // Fallback to basic PDF
      const doc = generateBasicOrderPDF(order)
      const defaultFilename = `order-${order.id}-basic-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename || defaultFilename)
    } catch (basicError) {
      console.error('Both enhanced and basic PDF generation failed:', basicError)
    throw new Error('Failed to generate PDF')
  }
  }
}