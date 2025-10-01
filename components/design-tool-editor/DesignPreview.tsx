"use client"

import { useEffect, useRef, useState } from "react"
import * as fabric from "fabric"

interface DesignPreviewProps {
  productImage: string
  designData: {
    stepNumber: number
    angle: string
    canvasJSON: any
    designAreaCm2: number
    designAreaPercentage: number
    timestamp: number
    imageUrl?: string
  }
  angle: string
  className?: string
}

export function DesignPreview({ productImage, designData, angle, className = "" }: DesignPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !designData) {
      setIsLoading(false)
      return
    }

    // Check if we have valid canvas data
    if (!designData.canvasJSON?.objects || designData.canvasJSON.objects.length === 0) {
      console.log('No canvas objects to render')
      setIsLoading(false)
      return
    }

    let canvas: fabric.Canvas | null = null

    try {
      canvas = new fabric.Canvas(canvasRef.current!, {
        width: 300,
        height: 300,
        backgroundColor: 'transparent',
        selection: false,
        interactive: false
      })

      console.log('🎨🎨🎨🎨🎨 LOADING DESIGN DATA 🎨🎨🎨🎨🎨')
      console.log('📦 Complete design data:', designData)
      console.log('🔍 Objects array length:', designData.canvasJSON?.objects?.length || 0)
      console.log('📋 Objects details:', designData.canvasJSON?.objects)
      
       // Debug each object in detail
       if (designData.canvasJSON?.objects && designData.canvasJSON.objects.length > 0) {
         designData.canvasJSON.objects.forEach((obj: any, index: number) => {
           console.log(`🔍EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH Object ${index} details:`, {
             type: obj.type,
             visible: obj.visible,
             left: obj.left,
             top: obj.top,
             width: obj.width,
             height: obj.height,
             scaleX: obj.scaleX,
             scaleY: obj.scaleY,
             isBackground: obj.isBackground,
             isBoundaryIndicator: obj.isBoundaryIndicator,
             excludeFromExport: obj.excludeFromExport,
             fontSize: obj.fontSize,
             text: obj.text,
             fontFamily: obj.fontFamily,
             fill: obj.fill,
             stroke: obj.stroke,
             opacity: obj.opacity
           })
           
           // Highlight the actual text content
           if (obj.text) {
             console.log(`📝📝📝 ACTUAL USER TEXT FOR OBJECT ${index}: "${obj.text}" 📝📝📝`)
           }
         })
       }
      
      console.log('🎯 Canvas version:', designData.canvasJSON?.version)
      console.log('🌈 Background:', designData.canvasJSON?.background)
      console.log('✂️ ClipPath:', designData.canvasJSON?.clipPath)
      console.log('😊😊😊😊😊 END DESIGN DATA DEBUG 😊😊😊😊😊')

      // Load the canvas data - try loadFromJSON first, then fallback to manual creation
      console.log('🔄 Attempting loadFromJSON...')
      canvas.loadFromJSON(designData.canvasJSON, () => {
        console.log('🎉🎉🎉 CANVAS LOADED SUCCESSFULLY 🎉🎉🎉')
        console.log('📊 Objects after load:', canvas!.getObjects().length)
        console.log('🔍 All objects details:', canvas!.getObjects())
        console.log('📐 Canvas dimensions:', canvas!.getWidth(), 'x', canvas!.getHeight())
        
        // Debug: Check if objects are being filtered out
        const allObjects = canvas!.getObjects()
        console.log('🔍🔍🔍 DETAILED OBJECT ANALYSIS 🔍🔍🔍')
        allObjects.forEach((obj, index) => {
          console.log(`🎯 Object ${index} after load:`, {
            type: obj.type,
            visible: obj.visible,
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            isBackground: (obj as any).isBackground,
            isBoundaryIndicator: (obj as any).isBoundaryIndicator,
            excludeFromExport: (obj as any).excludeFromExport,
            text: (obj as any).text,
            fontSize: (obj as any).fontSize
          })
        })
        
        if (allObjects.length === 0) {
          console.log('❌❌❌ NO OBJECTS FOUND AFTER LOAD! ❌❌❌')
          console.log('🔍 This means loadFromJSON is not working properly')
          console.log('📦 Original JSON had objects:', designData.canvasJSON?.objects?.length || 0)
          console.log('📋 Original objects:', designData.canvasJSON?.objects)
          
          // Fallback: Manually create objects
          console.log('🔄 FALLBACK: Manually creating objects...')
          designData.canvasJSON.objects.forEach((objData: any, index: number) => {
            console.log(`🔧 Creating object ${index} manually:`, objData)
            
            try {
              let fabricObject: any = null
              
               if (objData.type === 'IText' || objData.type === 'text') {
                 // Use the actual text from the saved design, not dummy text
                 const actualText = objData.text || 'Design Element'
                 console.log(`📝 Using actual text: "${actualText}"`)
                 
                 fabricObject = new fabric.IText(actualText, {
                   left: objData.left,
                   top: objData.top,
                   fontSize: objData.fontSize,
                   fontFamily: objData.fontFamily,
                   fill: objData.fill,
                   scaleX: objData.scaleX,
                   scaleY: objData.scaleY,
                   angle: objData.angle,
                   opacity: objData.opacity,
                   visible: objData.visible,
                   originX: objData.originX,
                   originY: objData.originY,
                   textAlign: objData.textAlign,
                   fontWeight: objData.fontWeight,
                   fontStyle: objData.fontStyle,
                   underline: objData.underline,
                   overline: objData.overline,
                   linethrough: objData.linethrough
                 })
              } else if (objData.type === 'Rect') {
                fabricObject = new fabric.Rect({
                  left: objData.left,
                  top: objData.top,
                  width: objData.width,
                  height: objData.height,
                  fill: objData.fill,
                  scaleX: objData.scaleX,
                  scaleY: objData.scaleY,
                  angle: objData.angle,
                  opacity: objData.opacity,
                  visible: objData.visible,
                  originX: objData.originX,
                  originY: objData.originY,
                  rx: objData.rx,
                  ry: objData.ry
                })
              } else if (objData.type === 'Circle') {
                fabricObject = new fabric.Circle({
                  left: objData.left,
                  top: objData.top,
                  radius: objData.radius,
                  fill: objData.fill,
                  scaleX: objData.scaleX,
                  scaleY: objData.scaleY,
                  angle: objData.angle,
                  opacity: objData.opacity,
                  visible: objData.visible,
                  originX: objData.originX,
                  originY: objData.originY
                })
              } else if (objData.type === 'Image') {
                // For images, we'd need to load the image first
                console.log('🖼️ Image object detected - would need to load image first')
              } else {
                console.log(`❌ Unsupported object type: ${objData.type}`)
              }
              
              if (fabricObject) {
                canvas!.add(fabricObject)
                console.log(`✅ Successfully created object ${index}:`, fabricObject)
              } else {
                console.log(`❌ Failed to create object ${index} - unsupported type:`, objData.type)
              }
            } catch (error) {
              console.error(`❌ Error creating object ${index}:`, error)
            }
          })
          
          console.log('📊 Objects after manual creation:', canvas!.getObjects().length)
        }
        
        // Check each object individually
        canvas!.getObjects().forEach((obj, index) => {
          console.log(`🎯 Object ${index}:`, {
            type: obj.type,
            visible: obj.visible,
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            isBackground: (obj as any).isBackground,
            isBoundaryIndicator: (obj as any).isBoundaryIndicator,
            excludeFromExport: (obj as any).excludeFromExport
          })
        })
        
        // Scale the canvas to fit the preview size
        const canvasWidth = 300
        const canvasHeight = 300
        
        // Get the original canvas dimensions
        const originalWidth = canvas!.getWidth()
        const originalHeight = canvas!.getHeight()
        
        console.log('📏📏📏 SCALING PROCESS 📏📏📏')
        console.log('📐 Original dimensions:', originalWidth, 'x', originalHeight)
        console.log('🎯 Target dimensions:', canvasWidth, 'x', canvasHeight)
        console.log('📊 Objects before scaling:', canvas!.getObjects().length)
        
        // Check if we have objects to scale
        if (canvas!.getObjects().length === 0) {
          console.log('❌❌❌ NO OBJECTS TO SCALE! ❌❌❌')
          console.log('🔍 This means objects were lost during loadFromJSON')
          setIsLoading(false)
          return
        }
        
         // Calculate scale factor - but first check if objects are outside bounds
         const objects = canvas!.getObjects()
         let maxX = 0, maxY = 0, minX = Infinity, minY = Infinity
         
         objects.forEach(obj => {
           const bounds = obj.getBoundingRect()
           maxX = Math.max(maxX, bounds.left + bounds.width)
           maxY = Math.max(maxY, bounds.top + bounds.height)
           minX = Math.min(minX, bounds.left)
           minY = Math.min(minY, bounds.top)
         })
         
         console.log('📐 Object bounds analysis:', { minX, minY, maxX, maxY, canvasWidth, canvasHeight })
         
         // If objects are outside canvas bounds, scale them down
         const objectWidth = maxX - minX
         const objectHeight = maxY - minY
         
         // Only scale if objects are actually outside the canvas bounds
         const needsScaling = maxX > canvasWidth || maxY > canvasHeight || minX < 0 || minY < 0
         
         let scale = 1
         let scaleX = 1
         let scaleY = 1
         
         if (needsScaling) {
           scaleX = canvasWidth / objectWidth
           scaleY = canvasHeight / objectHeight
           scale = Math.min(scaleX, scaleY) // Scale down to fit
           
           // Add some padding to ensure objects fit comfortably
           scale = scale * 0.8
           
           console.log('📐 Objects outside bounds - scaling needed')
           console.log('📏 Applied padding - final scale:', scale)
         } else {
           console.log('📐 Objects within bounds - no scaling needed')
         }
         
         console.log('📐 Object dimensions:', { objectWidth, objectHeight, canvasWidth, canvasHeight })
         console.log('⚖️ Scale factors - X:', scaleX, 'Y:', scaleY, 'Final:', scale)
        
        // Check if objects are within canvas bounds
        const objectsForBounds = canvas!.getObjects()
        objectsForBounds.forEach((obj, index) => {
          const bounds = obj.getBoundingRect()
          console.log(`🎯 Object ${index} bounds check:`, {
            objectBounds: bounds,
            canvasSize: { width: originalWidth, height: originalHeight },
            isWithinBounds: bounds.left >= 0 && bounds.top >= 0 && 
                           bounds.left + bounds.width <= originalWidth && 
                           bounds.top + bounds.height <= originalHeight
          })
        })
        
        // Scale all objects
        console.log('🔄 Scaling objects...')
        const objectsToScale = canvas!.getObjects()
        console.log('📊 Objects to scale:', objectsToScale.length)
        
        objectsToScale.forEach((obj: any, index: number) => {
          console.log(`🎯 Scaling object ${index} (${obj.type}):`, {
            before: { 
              scaleX: obj.scaleX, 
              scaleY: obj.scaleY, 
              left: obj.left, 
              top: obj.top,
              visible: obj.visible,
              width: obj.width,
              height: obj.height
            }
          })
          
          // Check if object has valid dimensions
          if (obj.width && obj.height && obj.width > 0 && obj.height > 0) {
            obj.scale(scale)
            obj.setCoords()
            console.log(`✅ After scaling:`, {
              scaleX: obj.scaleX, 
              scaleY: obj.scaleY, 
              left: obj.left, 
              top: obj.top,
              visible: obj.visible,
              width: obj.width,
              height: obj.height
            })
          } else {
            console.log(`⚠️ Object ${index} has invalid dimensions, skipping scale`)
          }
        })
        
        console.log('📊 Objects after scaling:', canvas!.getObjects().length)
        
        // Center the canvas content by adjusting object positions
        const objectsForCentering = canvas!.getObjects()
        console.log('🎯🎯🎯 CENTERING PROCESS 🎯🎯🎯')
        console.log('📊 Objects to center:', objectsForCentering.length)
        
        if (objectsForCentering.length > 0) {
          // Calculate the center of all objects
          const bounds = canvas!.getObjects().reduce((acc, obj) => {
            const objBounds = obj.getBoundingRect()
            console.log('📐 Object bounds:', objBounds)
            return {
              left: Math.min(acc.left, objBounds.left),
              top: Math.min(acc.top, objBounds.top),
              right: Math.max(acc.right, objBounds.left + objBounds.width),
              bottom: Math.max(acc.bottom, objBounds.top + objBounds.height)
            }
          }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity })
          
          console.log('📦 Combined bounds:', bounds)
          
          const centerX = (bounds.left + bounds.right) / 2
          const centerY = (bounds.top + bounds.bottom) / 2
          const canvasCenterX = canvas!.getWidth() / 2
          const canvasCenterY = canvas!.getHeight() / 2
          
          const offsetX = canvasCenterX - centerX
          const offsetY = canvasCenterY - centerY
          
          console.log('🎯 Centers - Objects:', centerX, centerY, 'Canvas:', canvasCenterX, canvasCenterY)
          console.log('📏 Offsets:', offsetX, offsetY)
          
          // Move all objects to center
          objectsForCentering.forEach((obj, index) => {
            console.log(`🔄 Moving object ${index}:`, {
              before: { left: obj.left, top: obj.top }
            })
            obj.set({
              left: obj.left! + offsetX,
              top: obj.top! + offsetY
            })
            obj.setCoords()
            console.log(`✅ After moving:`, {
              left: obj.left, top: obj.top
            })
          })
        } else {
          console.log('⚠️ No objects to center!')
        }
        
         // Render the canvas
         console.log('🎨🎨🎨 FINAL RENDER 🎨🎨🎨')
         canvas!.renderAll()
         
         // Force a re-render after a short delay to ensure everything is visible
         setTimeout(() => {
           canvas!.renderAll()
           console.log('🔄 Forced re-render completed')
         }, 100)
         
         console.log('✅✅✅ CANVAS RENDERED SUCCESSFULLY ✅✅✅')
         console.log('🎊 Final object count:', canvas!.getObjects().length)
         console.log('🎯 Final object positions:', canvas!.getObjects().map(obj => ({
           type: obj.type,
           left: obj.left,
           top: obj.top,
           width: obj.width,
           height: obj.height,
           visible: obj.visible
         })))
         console.log('🤣🤣🤣🤣🤣 END DEBUG SESSION 🤣🤣🤣🤣🤣')
         setIsLoading(false)
      })

    } catch (error) {
      console.error('Error creating canvas:', error)
      setError('Failed to create canvas')
      setIsLoading(false)
    }

    return () => {
      if (canvas) {
        canvas.dispose()
      }
    }
  }, [designData, angle])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Design Preview Error</p>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Product Image Background */}
      <img
        src={productImage}
        alt={`Product ${angle} view`}
        className="w-full h-full object-contain"
      />
      
       {/* Fabric Canvas Overlay */}
       <canvas
         ref={canvasRef}
         className="absolute inset-0 w-full h-full"
         style={{ 
           zIndex: 10
         }}
       />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading design...</p>
          </div>
        </div>
      )}
    </div>
  )
}