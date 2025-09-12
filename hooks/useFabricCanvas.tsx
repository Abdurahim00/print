"use client"

import { useEffect, useRef, useCallback } from "react"
import * as fabric from "fabric"
import { useDispatch, useSelector } from "react-redux"
import { addToHistory, undo, redo } from "../lib/redux/designToolSlices/canvasSlice"
import { setSelectedTool, setHasDesignElements, setDesignAreaPercentage, setDesignAreaCm2 } from "../lib/redux/designToolSlices/designSlice"
import { RootState } from "../lib/redux/store"

export const useFabricCanvas = (canvasId: string, scaleOptions?: { isMobile?: boolean; canvasScale?: number }) => {
  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const designBoundariesRef = useRef<{ x: number; y: number; width: number; height: number }[]>([])
  const { selectedObject, history, historyIndex } = useSelector((state: RootState) => state.canvas)
  const userId = useSelector((state: RootState) => (state as any).auth.user?.id) as string | undefined
  const { selectedTool } = useSelector((state: RootState) => state.design)

  // saveState accepts the canvas instance as an argument
  const saveState = useCallback(
    (canvasInstance: fabric.Canvas) => {
      if (canvasInstance) {
        const state = JSON.stringify(canvasInstance.toJSON())
        dispatch(addToHistory(state))
        // Persist latest canvas JSON for refresh recovery and also per product+angle for multi-angle autosave
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('designCanvasJSON', state)
            // Also persist per current product and view (angle)
            try {
              const sessionRaw = localStorage.getItem('designSessionState')
              if (sessionRaw) {
                const session = JSON.parse(sessionRaw)
                const pid = session?.selectedProduct?.id
                const angle = session?.viewMode
                if (pid && angle) {
                  const uid = userId || 'guest'
                  const key = `designCanvasJSON:${uid}:${pid}:${angle}`
                  localStorage.setItem(key, state)
                }
              }
            } catch {}
          }
        } catch {}
      }
    },
    [dispatch, userId],
  )

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return

    // Check if canvas element exists and has proper context
    const canvasElement = canvasRef.current
    if (!canvasElement) {
      console.error('Canvas element not found')
      return
    }

    // Get the 2D rendering context to ensure canvas is ready
    const ctx = canvasElement.getContext('2d')
    if (!ctx) {
      console.error('Canvas 2D context not available')
      return
    }

    // Initialize Fabric.js canvas with error handling
    let canvas: fabric.Canvas
    try {
      canvas = new fabric.Canvas(canvasElement, {
        width: 600,
        height: 600,
        backgroundColor: "transparent",
        selection: true,
        preserveObjectStacking: true,
        enableRetinaScaling: false, // Disable retina scaling to maintain consistent coordinates
        imageSmoothingEnabled: true,
        renderOnAddRemove: true,
        stopContextMenu: true,
        fireRightClick: false,
        controlsAboveOverlay: true,
        viewportTransform: [1, 0, 0, 1, 0, 0], // Ensure no viewport transformation
      })

      // Ensure canvas has proper internal contexts
      if (!(canvas as any).contextTop || !(canvas as any).contextContainer) {
        console.warn('Canvas contexts not properly initialized, reinitializing...')
        // Force reinitialize canvas contexts
        canvas.dispose()
        canvas = new fabric.Canvas(canvasElement, {
          width: 600,
          height: 600,
          backgroundColor: "transparent",
          selection: true,
          preserveObjectStacking: true,
          enableRetinaScaling: false, // Disable retina scaling to maintain consistent coordinates
          imageSmoothingEnabled: true,
          renderOnAddRemove: true,
          stopContextMenu: true,
          fireRightClick: false,
          controlsAboveOverlay: true,
          viewportTransform: [1, 0, 0, 1, 0, 0], // Ensure no viewport transformation
        })
      }
    } catch (error) {
      console.error('Error initializing Fabric canvas:', error)
      return
    }

    // --- Fabric.js v6 Global Control Configuration ---
    // Set global defaults for all interactive objects with modern styling
    fabric.InteractiveFabricObject.ownDefaults = {
      ...fabric.InteractiveFabricObject.ownDefaults,
      transparentCorners: false,
      cornerSize: 10, // Optimized corner size
      touchCornerSize: 16, // Better touch experience
      padding: 8, // Improved padding for better visual spacing
      borderColor: "#3b82f6", // Modern blue color
      hasBorders: true,
      cornerColor: "#ffffff",
      cornerStrokeColor: "#3b82f6",
      cornerStyle: 'rect', // Simple rectangle corners like in image
      borderScaleFactor: 1.5, // Slightly thicker borders
      borderDashArray: [0], // Solid borders for cleaner look
    }

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    // Function to render delete icon (X) using Canvas API
    const renderDeleteIcon = (ctx: CanvasRenderingContext2D, left: number, top: number, size: number) => {
      ctx.save()
      ctx.translate(left, top)
      
      // White background with border
      ctx.fillStyle = 'white'
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      drawRoundedRect(ctx, -size/2, -size/2, size, size, 6)
      ctx.fill()
      ctx.stroke()
      
      // X icon
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(-6, -6)
      ctx.lineTo(6, 6)
      ctx.moveTo(6, -6)
      ctx.lineTo(-6, 6)
      ctx.stroke()
      
      ctx.restore()
    }

    // Function to render copy icon using Canvas API
    const renderCopyIcon = (ctx: CanvasRenderingContext2D, left: number, top: number, size: number) => {
      ctx.save()
      ctx.translate(left, top)
      
      // White background with border
      ctx.fillStyle = 'white'
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      drawRoundedRect(ctx, -size/2, -size/2, size, size, 6)
      ctx.fill()
      ctx.stroke()
      
      // Copy icon - two overlapping rectangles
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Back rectangle
      ctx.strokeRect(-2, -2, 8, 8)
      // Front rectangle
      ctx.strokeRect(-6, -6, 8, 8)
      
      ctx.restore()
    }

    // Function to render rotate icon using Canvas API
    const renderRotateIcon = (ctx: CanvasRenderingContext2D, left: number, top: number, size: number) => {
      ctx.save()
      ctx.translate(left, top)
      
      // White background with border
      ctx.fillStyle = 'white'
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      drawRoundedRect(ctx, -size/2, -size/2, size, size, 6)
      ctx.fill()
      ctx.stroke()
      
      // Rotate icon - circular arrow
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Draw circular arrow
      ctx.beginPath()
      ctx.arc(0, 0, 6, -Math.PI/2, Math.PI, false)
      ctx.stroke()
      
      // Arrow head
      ctx.beginPath()
      ctx.moveTo(-4, 4)
      ctx.lineTo(-6, 6)
      ctx.lineTo(-2, 6)
      ctx.stroke()
      
      ctx.restore()
    }

    // Define custom controls globally for all objects - positioned exactly like the image
    fabric.InteractiveFabricObject.ownDefaults.controls = {
      // Copy control - positioned top-left close to delete (like in image)
      copyControl: new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetY: -12,
        offsetX: -12,
        cursorStyle: "pointer",
        mouseUpHandler: async (eventData: any, transform: any) => {
          const target = transform.target
          const canvas = target.canvas
          if (canvas) {
            const cloned = await target.clone()
            cloned.set({
              left: (target.left || 0) + 20,
              top: (target.top || 0) + 20,
            })
            canvas.add(cloned)
            canvas.setActiveObject(cloned)
            canvas.requestRenderAll()
            setTimeout(() => saveState(canvas), 50)
          }
          return true
        },
        render: (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) => {
          const size = 32
          // Add shadow for depth
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 2
          renderCopyIcon(ctx, left, top, size)
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
        },
      } as any),

      // Delete control - positioned top-right close to copy (like in image)
      deleteControl: new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -12,
        offsetX: 12,
        cursorStyle: "pointer",
        mouseUpHandler: (eventData: any, transform: any) => {
          const target = transform.target
          const canvas = target.canvas
          if (canvas) {
            canvas.remove(target)
            canvas.requestRenderAll()
            // Set selected object to null via Redux
            dispatch({ type: 'canvas/setSelectedObject', payload: null })
            setTimeout(() => saveState(canvas), 50)
          }
          return true
        },
        render: (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) => {
          const size = 32
          // Add shadow for depth
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 2
          renderDeleteIcon(ctx, left, top, size)
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
        },
      } as any),

      // Rotate control - positioned bottom center opposite to top controls (like in image)
      mtr: new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 20,
        cursorStyle: "crosshair",
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: "rotate",
        render: (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) => {
          const size = 32
          // Add shadow for depth
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 2
          renderRotateIcon(ctx, left, top, size)
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
        },
      } as any),

      // Simple corner controls for resizing (like in your image)
      tl: new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyle: "nw-resize",
        actionHandler: fabric.controlsUtils.scalingEqually,
        actionName: "scaling",
      }),
      tr: new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyle: "ne-resize",
        actionHandler: fabric.controlsUtils.scalingEqually,
        actionName: "scaling",
      }),
      bl: new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyle: "sw-resize",
        actionHandler: fabric.controlsUtils.scalingEqually,
        actionName: "scaling",
      }),
      br: new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyle: "se-resize",
        actionHandler: fabric.controlsUtils.scalingEqually,
        actionName: "scaling",
      }),

      // Hide middle controls for cleaner interface
      ml: new fabric.Control({ visible: false }),
      mr: new fabric.Control({ visible: false }),
      mt: new fabric.Control({ visible: false }),
      mb: new fabric.Control({ visible: false }),
    }

    // Function to apply text scaling behavior
    const applyTextScalingBehavior = (textObj: fabric.IText) => {
      // Remove any existing scaling listeners to prevent duplicates
      textObj.off('scaling')
      textObj.off('modified')
      
      // Add scaling event listener
      textObj.on('scaling', function(e: any) {
        const obj = e.target as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }
        if (!obj) return

        // Store original font size if not already stored
        if (!obj._originalFontSize) {
          obj._originalFontSize = obj.fontSize || 24
        }

        // Calculate the scale factor (use the average of scaleX and scaleY for uniform scaling)
        const scaleX = obj.scaleX || 1
        const scaleY = obj.scaleY || 1
        const scale = Math.min(scaleX, scaleY) // Use minimum to maintain readability
        
        // Calculate new font size based on scale
        const newFontSize = Math.round(obj._originalFontSize * scale)
        
        // Apply constraints
        const minSize = obj.minFontSize || 8
        const maxSize = obj.maxFontSize || 200
        const constrainedFontSize = Math.max(minSize, Math.min(newFontSize, maxSize))
        
        // Update font size
        obj.set('fontSize', constrainedFontSize)
        
        // Reset scale to 1 to prevent compound scaling issues
        obj.set({
          scaleX: 1,
          scaleY: 1,
        })
        
        // Force canvas re-render
        canvas.requestRenderAll()
      })

      // Handle when scaling is finished
      textObj.on('modified', function(e: any) {
        const obj = e.target as fabric.IText & { _originalFontSize?: number }
        if (!obj) return
        
        // Update the original font size to the new font size
        obj._originalFontSize = obj.fontSize || 24
        
        // Save state after scaling is complete
        setTimeout(() => saveState(canvas), 100)
      })
    }

    // Helper function to update tool based on object type
    const updateToolBasedOnObjectType = (obj: any) => {
      // Set the selected tool based on object type
      if (obj.type === "i-text" || obj.type === "text") {
        dispatch(setSelectedTool("text"));
      } else if (obj.type === "image") {
        // Check if it's a template or uploaded image
        if (obj.isTemplate) {
          dispatch(setSelectedTool("template"));
        } else {
          dispatch(setSelectedTool("upload"));
        }
      } else {
        // For other object types, keep current tool
      }
    };

    // Canvas event listeners
    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected[0]) {
        const selectedObj = e.selected[0];
        // Store only serializable properties
        const serializedObj = {
          type: selectedObj.type,
          text: (selectedObj as any).text,
          fontSize: (selectedObj as any).fontSize,
          fontFamily: (selectedObj as any).fontFamily,
          fill: (selectedObj as any).fill,
          fontWeight: (selectedObj as any).fontWeight,
          fontStyle: (selectedObj as any).fontStyle,
          underline: (selectedObj as any).underline,
          textAlign: (selectedObj as any).textAlign,
        };
        dispatch({ type: 'canvas/setSelectedObject', payload: serializedObj });
        updateToolBasedOnObjectType(selectedObj);
        
        // Apply text resizing behavior to selected text objects
        if (selectedObj.type === "i-text" || selectedObj.type === "text") {
          const textObj = selectedObj as fabric.IText;
          applyTextScalingBehavior(textObj);
        }
      }
    });

    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected[0]) {
        const selectedObj = e.selected[0];
        // Store only serializable properties
        const serializedObj = {
          type: selectedObj.type,
          text: (selectedObj as any).text,
          fontSize: (selectedObj as any).fontSize,
          fontFamily: (selectedObj as any).fontFamily,
          fill: (selectedObj as any).fill,
          fontWeight: (selectedObj as any).fontWeight,
          fontStyle: (selectedObj as any).fontStyle,
          underline: (selectedObj as any).underline,
          textAlign: (selectedObj as any).textAlign,
        };
        dispatch({ type: 'canvas/setSelectedObject', payload: serializedObj });
        updateToolBasedOnObjectType(selectedObj);
        
        // Apply text resizing behavior to selected text objects
        if (selectedObj.type === "i-text" || selectedObj.type === "text") {
          const textObj = selectedObj as fabric.IText;
          applyTextScalingBehavior(textObj);
        }
      }
    });

    canvas.on("selection:cleared", () => {
      dispatch({ type: 'canvas/setSelectedObject', payload: null });
      // Default to product tool when nothing is selected
      dispatch(setSelectedTool("product"));
    });

    // Check if canvas has any design elements and calculate area coverage
    const checkDesignElements = () => {
      const objects = canvas.getObjects()
      const hasDesign = objects.length > 0
      dispatch(setHasDesignElements(hasDesign))
      
      // Calculate total area covered by design elements
      if (hasDesign) {
        const canvasWidth = canvas.getWidth()
        const canvasHeight = canvas.getHeight()
        const canvasArea = canvasWidth * canvasHeight
        
        // Canvas is 600x600 pixels. Standard print area is typically 30x30 cm for a t-shirt
        // So 1 pixel = 0.05 cm (30cm / 600px)
        // Area of 1 pixel² = 0.0025 cm² (0.05 * 0.05)
        const PIXELS_TO_CM2 = 0.0025
        
        let totalDesignArea = 0
        let totalDesignAreaCm2 = 0
        
        objects.forEach((obj) => {
          // Get the bounding rect of the object (includes transformations)
          const boundingRect = obj.getBoundingRect(true, true)
          const objectArea = boundingRect.width * boundingRect.height
          const objectAreaCm2 = objectArea * PIXELS_TO_CM2
          
          totalDesignArea += objectArea
          totalDesignAreaCm2 += objectAreaCm2
          
          console.log('📦 Object area:', {
            type: obj.type,
            widthPx: boundingRect.width,
            heightPx: boundingRect.height,
            areaPx: objectArea,
            areaCm2: objectAreaCm2.toFixed(2),
            widthCm: (boundingRect.width * 0.05).toFixed(2),
            heightCm: (boundingRect.height * 0.05).toFixed(2)
          })
        })
        
        // Calculate percentage (capped at 100% for overlapping objects)
        const areaPercentage = Math.min(100, (totalDesignArea / canvasArea) * 100)
        dispatch(setDesignAreaPercentage(areaPercentage))
        dispatch(setDesignAreaCm2(totalDesignAreaCm2))
        
        console.log('📐 Design area calculation:', {
          canvasWidthPx: canvasWidth,
          canvasHeightPx: canvasHeight,
          canvasAreaPx: canvasArea,
          canvasAreaCm2: (canvasArea * PIXELS_TO_CM2).toFixed(2),
          totalDesignAreaPx: totalDesignArea,
          totalDesignAreaCm2: totalDesignAreaCm2.toFixed(2),
          percentage: areaPercentage.toFixed(2) + '%',
          objectCount: objects.length
        })
      } else {
        dispatch(setDesignAreaPercentage(0))
        dispatch(setDesignAreaCm2(0))
        console.log('📐 No design elements, area = 0%')
      }
    }

    canvas.on("object:added", (e) => {
      console.log('🎨 Object added event')
      
      // Check if the added object is within boundaries
      if (designBoundariesRef.current.length > 0 && e.target && !(e.target as any).isBoundaryIndicator) {
        const obj = e.target
        const objBoundingRect = obj.getBoundingRect()
        const boundary = designBoundariesRef.current[0]
        
        if (boundary) {
          let needsRepositioning = false
          let newLeft = obj.left || 0
          let newTop = obj.top || 0
          
          // Check if object is outside boundary
          const minX = boundary.x
          const minY = boundary.y
          const maxX = boundary.x + boundary.width - objBoundingRect.width
          const maxY = boundary.y + boundary.height - objBoundingRect.height
          
          // Constrain position
          if (objBoundingRect.left < minX) {
            newLeft = minX + (newLeft - objBoundingRect.left)
            needsRepositioning = true
          } else if (objBoundingRect.left > maxX && maxX > minX) {
            newLeft = maxX + (newLeft - objBoundingRect.left)
            needsRepositioning = true
          }
          
          if (objBoundingRect.top < minY) {
            newTop = minY + (newTop - objBoundingRect.top)
            needsRepositioning = true
          } else if (objBoundingRect.top > maxY && maxY > minY) {
            newTop = maxY + (newTop - objBoundingRect.top)
            needsRepositioning = true
          }
          
          // If object is too large for boundary, scale it down
          if (objBoundingRect.width > boundary.width || objBoundingRect.height > boundary.height) {
            const scaleX = (boundary.width * 0.9) / objBoundingRect.width // 90% to leave margin
            const scaleY = (boundary.height * 0.9) / objBoundingRect.height
            const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down
            
            if (scale < 1) {
              obj.scale(obj.scaleX * scale)
              
              // Recenter after scaling
              newLeft = boundary.x + (boundary.width - objBoundingRect.width * scale) / 2
              newTop = boundary.y + (boundary.height - objBoundingRect.height * scale) / 2
              needsRepositioning = true
            }
          }
          
          // Apply repositioning if needed
          if (needsRepositioning) {
            setTimeout(() => {
              obj.set({
                left: newLeft,
                top: newTop
              })
              obj.setCoords()
              canvas.requestRenderAll()
            }, 10)
          }
        }
      }
      
      checkDesignElements()
    })

    canvas.on("object:removed", () => {
      console.log('🗑️ Object removed event')
      checkDesignElements()
    })

    canvas.on("object:modified", (e) => {
      console.log('✏️ Object modified event')
      
      // Final check to ensure object is within boundaries after modification
      if (designBoundariesRef.current.length > 0 && e.target) {
        const obj = e.target
        const objBoundingRect = obj.getBoundingRect()
        const boundary = designBoundariesRef.current[0]
        
        if (boundary) {
          let needsUpdate = false
          let newLeft = obj.left || 0
          let newTop = obj.top || 0
          
          // Check and constrain position
          const minX = boundary.x
          const minY = boundary.y
          const maxX = boundary.x + boundary.width - objBoundingRect.width
          const maxY = boundary.y + boundary.height - objBoundingRect.height
          
          if (objBoundingRect.left < minX) {
            newLeft = minX + (newLeft - objBoundingRect.left)
            needsUpdate = true
          } else if (objBoundingRect.left > maxX) {
            newLeft = maxX + (newLeft - objBoundingRect.left)
            needsUpdate = true
          }
          
          if (objBoundingRect.top < minY) {
            newTop = minY + (newTop - objBoundingRect.top)
            needsUpdate = true
          } else if (objBoundingRect.top > maxY) {
            newTop = maxY + (newTop - objBoundingRect.top)
            needsUpdate = true
          }
          
          if (needsUpdate) {
            obj.set({
              left: newLeft,
              top: newTop
            })
            obj.setCoords()
            canvas.requestRenderAll()
          }
        }
      }
      
      setTimeout(() => saveState(canvas), 50)
      checkDesignElements()
    })
    
    canvas.on("object:scaling", (e) => {
      console.log('📏 Object scaling event')
      
      // Restrict object scaling to design boundaries if they exist
      if (designBoundariesRef.current.length > 0 && e.target) {
        const obj = e.target
        const boundary = designBoundariesRef.current[0]
        
        if (boundary) {
          // Get current bounding rect
          const objBoundingRect = obj.getBoundingRect()
          
          // Calculate the maximum allowed dimensions
          const maxWidth = boundary.width
          const maxHeight = boundary.height
          
          // Check if object exceeds boundary width
          if (objBoundingRect.width > maxWidth) {
            const newScaleX = (maxWidth / obj.width!) * 0.95 // 95% to ensure it fits
            obj.scaleX = newScaleX
          }
          
          // Check if object exceeds boundary height
          if (objBoundingRect.height > maxHeight) {
            const newScaleY = (maxHeight / obj.height!) * 0.95
            obj.scaleY = newScaleY
          }
          
          // Get updated bounding rect after scale adjustment
          const updatedRect = obj.getBoundingRect()
          
          // Ensure object position is within boundaries
          let newLeft = obj.left || 0
          let newTop = obj.top || 0
          
          if (updatedRect.left < boundary.x) {
            newLeft = boundary.x + (newLeft - updatedRect.left)
          } else if (updatedRect.left + updatedRect.width > boundary.x + boundary.width) {
            newLeft = (boundary.x + boundary.width - updatedRect.width) + (newLeft - updatedRect.left)
          }
          
          if (updatedRect.top < boundary.y) {
            newTop = boundary.y + (newTop - updatedRect.top)
          } else if (updatedRect.top + updatedRect.height > boundary.y + boundary.height) {
            newTop = (boundary.y + boundary.height - updatedRect.height) + (newTop - updatedRect.top)
          }
          
          obj.set({
            left: newLeft,
            top: newTop
          })
        }
      }
      
      checkDesignElements()
    })
    
    canvas.on("object:moving", (e) => {
      // Restrict object movement to design boundaries if they exist
      if (designBoundariesRef.current.length > 0 && e.target) {
        const obj = e.target
        const objBoundingRect = obj.getBoundingRect()
        const boundary = designBoundariesRef.current[0] // Use first boundary
        
        if (boundary) {
          // Calculate boundaries
          const minX = boundary.x
          const minY = boundary.y
          const maxX = boundary.x + boundary.width - objBoundingRect.width
          const maxY = boundary.y + boundary.height - objBoundingRect.height
          
          // Get the object's current position
          let newLeft = obj.left || 0
          let newTop = obj.top || 0
          
          // Apply constraints smoothly
          if (objBoundingRect.left < minX) {
            newLeft = minX + (newLeft - objBoundingRect.left)
          } else if (objBoundingRect.left > maxX) {
            newLeft = maxX + (newLeft - objBoundingRect.left)
          }
          
          if (objBoundingRect.top < minY) {
            newTop = minY + (newTop - objBoundingRect.top)
          } else if (objBoundingRect.top > maxY) {
            newTop = maxY + (newTop - objBoundingRect.top)
          }
          
          // Set the constrained position
          obj.set({
            left: newLeft,
            top: newTop
          })
          
          // Don't call setCoords during moving to prevent shaking
          // obj.setCoords() will be called automatically after movement ends
        }
      }
      
      checkDesignElements()
    })

    canvas.on("text:changed", () => {
      canvas.requestRenderAll()
      setTimeout(() => saveState(canvas), 50)
    })

    // Double click to edit text
    canvas.on("mouse:dblclick", (e) => {
      if (e.target && e.target.type === "i-text") {
        const textObj = e.target as fabric.IText
        textObj.enterEditing()
        textObj.selectAll()
      }
    })

    fabricCanvasRef.current = canvas
    
    // Lock the viewport to prevent any zoom or pan transformations
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    canvas.setZoom(1)
    
    // Disable mouse wheel zoom to maintain consistent coordinates
    canvas.on('mouse:wheel', (e) => {
      e.e.preventDefault()
      e.e.stopPropagation()
      return false
    })
    
    // Set the fabric canvas in Redux
    dispatch({ type: 'canvas/setFabricCanvas', payload: canvas });
    
    // Make the canvas instance globally available for other functions
    (window as any).fabricCanvas = canvas
    console.log('Canvas initialized with locked viewport (zoom=1, pan=0,0)')
    
    // Dispatch custom event to notify canvas is ready
    window.dispatchEvent(new CustomEvent('fabricCanvasReady', { detail: { canvas } }))

    // Save initial state
    setTimeout(() => saveState(canvas), 100)
    
    // Trigger a re-render to ensure boundaries are applied
    canvas.requestRenderAll()

    return canvas
  }, [dispatch, saveState])

  // addText now accepts the canvas instance as its first argument
  const addText = useCallback(
    (canvasInstance: fabric.Canvas, text = "Your text here", options: any = {}) => {
      // Calculate initial position within boundaries if they exist
      let initialLeft = 150
      let initialTop = 150
      
      if (designBoundariesRef.current.length > 0) {
        const boundary = designBoundariesRef.current[0]
        // Place text in the center of the first boundary
        initialLeft = boundary.x + boundary.width / 2
        initialTop = boundary.y + boundary.height / 2
      }
      
      const textObj = new fabric.IText(text, {
        left: initialLeft,
        top: initialTop,
        fontFamily: "Arial",
        fontSize: 24,
        fill: "#000000",
        editable: true,
        selectable: true,
        evented: true,
        originX: "center",
        originY: "center",
        // Enable scaling for text
        lockUniScaling: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        // Minimum and maximum font size constraints
        minFontSize: 8,
        maxFontSize: 200,
        // Store original font size for scaling calculations
        _originalFontSize: 24,
        ...options,
      }) as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }

      // Apply scaling behavior
      textObj.on('scaling', function(e: any) {
        const obj = e.target as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }
        if (!obj) return

        // Store original font size if not already stored
        if (!obj._originalFontSize) {
          obj._originalFontSize = obj.fontSize || 24
        }

        // Calculate the scale factor
        const scaleX = obj.scaleX || 1
        const scaleY = obj.scaleY || 1
        const scale = Math.min(scaleX, scaleY)
        
        // Calculate new font size based on scale
        const newFontSize = Math.round(obj._originalFontSize * scale)
        
        // Apply constraints
        const minSize = obj.minFontSize || 8
        const maxSize = obj.maxFontSize || 200
        const constrainedFontSize = Math.max(minSize, Math.min(newFontSize, maxSize))
        
        // Update font size and reset scale
        obj.set({
          fontSize: constrainedFontSize,
          scaleX: 1,
          scaleY: 1,
        })
        
        canvasInstance.requestRenderAll()
      })

      textObj.on('modified', function(e: any) {
        const obj = e.target as fabric.IText & { _originalFontSize?: number }
        if (!obj) return
        
        // Update the original font size to the new font size
        obj._originalFontSize = obj.fontSize || 24
        
        setTimeout(() => saveState(canvasInstance), 100)
      })

      canvasInstance.add(textObj)
      canvasInstance.setActiveObject(textObj)
      canvasInstance.requestRenderAll()

      // Update Redux state with serializable properties
      const serializedTextObj = {
        type: textObj.type,
        text: textObj.text,
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill,
        fontWeight: textObj.fontWeight,
        fontStyle: textObj.fontStyle,
        underline: textObj.underline,
        textAlign: textObj.textAlign,
      };
      dispatch({ type: 'canvas/setSelectedObject', payload: serializedTextObj });
      dispatch(setSelectedTool("text"))

      setTimeout(() => {
        if (textObj.enterEditing) {
          textObj.enterEditing()
          textObj.selectAll()
        }
      }, 100)

      // Add object to Redux store
      dispatch({ 
        type: 'canvas/addObject', 
        payload: {
          id: Date.now().toString(),
          type: "text",
          object: textObj,
        }
      });

      setTimeout(() => saveState(canvasInstance), 150)

      return textObj
    },
    [dispatch, saveState],
  )
 

  // deleteSelected now accepts the canvas instance as its first argument
  const deleteSelected = useCallback(
    (canvasInstance: fabric.Canvas) => {
      const activeObject = canvasInstance.getActiveObject()
      if (activeObject) {
        canvasInstance.remove(activeObject)
        canvasInstance.requestRenderAll()
        dispatch({ type: 'canvas/setSelectedObject', payload: null })
        setTimeout(() => saveState(canvasInstance), 50)
      }
    },
    [dispatch, saveState],
  )

  // duplicateSelected now accepts the canvas instance as its first argument
  const duplicateSelected = useCallback(
    async (canvasInstance: fabric.Canvas) => {
      const activeObject = canvasInstance.getActiveObject()
      if (activeObject) {
        const cloned = await activeObject.clone()
        
        // Preserve the isTemplate flag if it exists
        if ((activeObject as any).isTemplate !== undefined) {
          (cloned as any).isTemplate = (activeObject as any).isTemplate;
        }
        
        cloned.set({
          left: (activeObject.left || 0) + 30,
          top: (activeObject.top || 0) + 30,
        })
        
        // If it's a text object, apply scaling behavior to the clone
        if (cloned.type === "i-text" || cloned.type === "text") {
          const textClone = cloned as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }
          textClone._originalFontSize = textClone.fontSize || 24
          
          textClone.on('scaling', function(e: any) {
            const obj = e.target as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }
            if (!obj) return

            if (!obj._originalFontSize) {
              obj._originalFontSize = obj.fontSize || 24
            }

            const scaleX = obj.scaleX || 1
            const scaleY = obj.scaleY || 1
            const scale = Math.min(scaleX, scaleY)
            
            const newFontSize = Math.round(obj._originalFontSize * scale)
            const minSize = obj.minFontSize || 8
            const maxSize = obj.maxFontSize || 200
            const constrainedFontSize = Math.max(minSize, Math.min(newFontSize, maxSize))
            
            obj.set({
              fontSize: constrainedFontSize,
              scaleX: 1,
              scaleY: 1,
            })
            
            canvasInstance.requestRenderAll()
          })

          textClone.on('modified', function(e: any) {
            const obj = e.target as fabric.IText & { _originalFontSize?: number }
            if (!obj) return
            obj._originalFontSize = obj.fontSize || 24
            setTimeout(() => saveState(canvasInstance), 100)
          })
        }
        
        canvasInstance.add(cloned)
        canvasInstance.setActiveObject(cloned)
        canvasInstance.requestRenderAll()
        setTimeout(() => saveState(canvasInstance), 50)
      }
    },
    [saveState],
  )

  // updateTextProperties now accepts the canvas instance as its first argument
  const updateTextProperties = useCallback(
    (canvasInstance: fabric.Canvas, properties: any) => {
      const activeObject = canvasInstance.getActiveObject()
      if (activeObject && (activeObject.type === "text" || activeObject.type === "i-text")) {
        const textObj = activeObject as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }
        
        // Apply font size constraints if fontSize is being updated
        if (properties.fontSize !== undefined) {
          const constrainedFontSize = Math.max(
            textObj.minFontSize || 8,
            Math.min(properties.fontSize, textObj.maxFontSize || 200)
          )
          properties.fontSize = constrainedFontSize
          // Update the original font size for scaling calculations
          textObj._originalFontSize = constrainedFontSize
        }
        
        activeObject.set(properties)
        canvasInstance.requestRenderAll()
        setTimeout(() => saveState(canvasInstance), 50)
      }
    },
    [saveState],
  )

  // getTextScalingInfo - Get information about text scaling constraints
  const getTextScalingInfo = useCallback(
    (canvasInstance: fabric.Canvas) => {
      const activeObject = canvasInstance.getActiveObject()
      if (activeObject && (activeObject.type === "text" || activeObject.type === "i-text")) {
        const textObj = activeObject as fabric.IText & { minFontSize?: number; maxFontSize?: number }
        return {
          currentFontSize: textObj.fontSize || 24,
          minFontSize: textObj.minFontSize || 8,
          maxFontSize: textObj.maxFontSize || 200,
          scaleX: textObj.scaleX || 1,
          scaleY: textObj.scaleY || 1,
        }
      }
      return null
    },
    [],
  )

  // Set design boundaries based on frames
  const setDesignBoundaries = useCallback((frames: any[], options?: { isMobile?: boolean; canvasScale?: number }) => {
    // Check both the ref and the global window object
    const canvas = fabricCanvasRef.current || (window as any).fabricCanvas
    if (!canvas) {
      console.warn('⚠️ [setDesignBoundaries] Canvas not available yet')
      return
    }
    
    // Update the ref if we got it from window
    if (!fabricCanvasRef.current && canvas) {
      fabricCanvasRef.current = canvas
    }
    // Fixed canvas dimensions - but account for mobile scaling
    const baseCanvasSize = 600
    const scale = (options?.isMobile && options?.canvasScale) ? options.canvasScale : 1
    const canvasWidth = baseCanvasSize
    const canvasHeight = baseCanvasSize
    
    // Clear existing boundaries
    designBoundariesRef.current = []
    
    // Remove any existing clip path
    canvas.clipPath = undefined
    
    // Convert frame percentages to fixed canvas coordinates
    frames.forEach(frame => {
      if (frame.xPercent !== undefined && frame.yPercent !== undefined) {
        // Use percentage-based positioning relative to fixed 600x600 canvas
        const boundary = {
          x: (frame.xPercent / 100) * canvasWidth,
          y: (frame.yPercent / 100) * canvasHeight,
          width: (frame.widthPercent / 100) * canvasWidth,
          height: (frame.heightPercent / 100) * canvasHeight
        }
        designBoundariesRef.current.push(boundary)
      } else if (frame.widthPx !== undefined && frame.heightPx !== undefined) {
        // Use pixel values directly if provided
        const boundary = {
          x: frame.x || 0,
          y: frame.y || 0,
          width: frame.widthPx,
          height: frame.heightPx
        }
        designBoundariesRef.current.push(boundary)
      } else {
        // Fallback: convert cm to pixels (1cm ≈ 37.795 pixels at 96 DPI)
        const pixelsPerCm = 37.795
        const boundary = {
          x: frame.x || 0,
          y: frame.y || 0,
          width: frame.width * pixelsPerCm,
          height: frame.height * pixelsPerCm
        }
        designBoundariesRef.current.push(boundary)
      }
    })
    
    console.log('🎯 Design boundaries set:', designBoundariesRef.current)
    
    // Add visual indicators and clipping for boundaries
    if (designBoundariesRef.current.length > 0) {
      // Remove existing boundary indicators
      const existingBoundaries = canvas.getObjects().filter((obj: any) => obj.isBoundaryIndicator)
      existingBoundaries.forEach(obj => canvas.remove(obj))
      
      // Create a clipping path for the first boundary (main design area)
      const mainBoundary = designBoundariesRef.current[0]
      const clipRect = new fabric.Rect({
        left: mainBoundary.x,
        top: mainBoundary.y,
        width: mainBoundary.width,
        height: mainBoundary.height,
        absolutePositioned: true
      })
      
      // Apply clipping to the canvas to prevent anything outside the boundary
      canvas.clipPath = clipRect
      
      // Add visual boundary indicators
      designBoundariesRef.current.forEach(boundary => {
        try {
          const rect = new fabric.Rect({
            left: boundary.x,
            top: boundary.y,
            width: boundary.width,
            height: boundary.height,
            fill: 'transparent',
            stroke: 'rgba(59, 130, 246, 0.5)', // Blue with opacity
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
            excludeFromExport: true,
            isBoundaryIndicator: true // Custom property to identify boundary indicators
          } as any)
          
          canvas.add(rect)
          
          // Try different methods to move to back
          try {
            if (canvas.moveTo) {
              canvas.moveTo(rect, 0) // Move to index 0 (back)
            } else if ((canvas as any).sendToBack) {
              (canvas as any).sendToBack(rect)
            }
          } catch (moveError) {
            console.log('Could not move boundary to back, continuing...')
          }
        } catch (error) {
          console.error('Error adding boundary indicator:', error)
        }
      })
      
      canvas.requestRenderAll()
    } else {
      // Clear clip path if no boundaries
      canvas.clipPath = undefined
      canvas.requestRenderAll()
    }
  }, [])

  // handleUndo now accepts the canvas instance as its first argument
  const handleUndo = useCallback(
    (canvasInstance: fabric.Canvas) => {
      if (!history.length || historyIndex <= 0) return
      const prevIndex = historyIndex - 1
      const prevState = history[prevIndex]

      if (prevState) {
        dispatch(undo())
        canvasInstance.loadFromJSON(JSON.parse(prevState), () => {
          canvasInstance.requestRenderAll()
          dispatch({ type: 'canvas/setSelectedObject', payload: null })
        })
      }
    },
    [dispatch, history, historyIndex],
  )

  // handleRedo now accepts the canvas instance as its first argument
  const handleRedo = useCallback(
    (canvasInstance: fabric.Canvas) => {
      if (!history.length || historyIndex >= history.length - 1) return
      const nextIndex = historyIndex + 1
      const nextState = history[nextIndex]

      if (nextState) {
        dispatch(redo())
        canvasInstance.loadFromJSON(JSON.parse(nextState), () => {
          canvasInstance.requestRenderAll()
          dispatch({ type: 'canvas/setSelectedObject', payload: null })
        })
      }
    },
    [dispatch, history, historyIndex],
  )

  // clearCanvas now accepts the canvas instance as its first argument
  const clearCanvas = useCallback(
    (canvasInstance: fabric.Canvas) => {
      canvasInstance.clear()
      canvasInstance.requestRenderAll()
      dispatch({ type: 'canvas/setSelectedObject', payload: null })
      setTimeout(() => saveState(canvasInstance), 50)
    },
    [dispatch, saveState],
  )

  // exportCanvas now accepts the canvas instance as its first argument
  const exportCanvas = useCallback((canvasInstance: fabric.Canvas, format: any = "png") => {
    // If we have boundaries, export only the boundary area
    if (designBoundariesRef.current.length > 0) {
      const boundary = designBoundariesRef.current[0]
      
      // Export only the area within the boundary
      return canvasInstance.toDataURL({
        format,
        quality: 1,
        multiplier: 2,
        left: boundary.x,
        top: boundary.y,
        width: boundary.width,
        height: boundary.height
      })
    }
    
    // Default export if no boundaries
    return canvasInstance.toDataURL({
      format,
      quality: 1,
      multiplier: 2,
    })
  }, [])

  // Text bending/curving functionality - simplified approach
  const bendText = useCallback((canvasInstance: fabric.Canvas, bendAmount: number = 0) => {
    if (!canvasInstance) return

    const activeObject = canvasInstance.getActiveObject()
    if (!activeObject || (activeObject.type !== "text" && activeObject.type !== "i-text")) return

    const textObj = activeObject as fabric.IText

    // Simple text transformation using skew for bend effect
    if (bendAmount !== 0) {
      // Apply skew transformation for bending effect
      const skewValue = bendAmount * 0.5 // Scale down the bend amount
      textObj.set({
        skewX: skewValue,
        // Store bend amount for tracking
        _bendAmount: bendAmount,
      } as any)
    } else {
      // Reset to normal text
      textObj.set({
        skewX: 0,
        _bendAmount: 0,
      } as any)
    }
    
    canvasInstance.requestRenderAll()
    setTimeout(() => saveState(canvasInstance), 50)
  }, [saveState])

  // Get current bend amount for selected text
  const getTextBendAmount = useCallback((canvasInstance: fabric.Canvas) => {
    if (!canvasInstance) return 0

    const activeObject = canvasInstance.getActiveObject()
    if (!activeObject || (activeObject.type !== "text" && activeObject.type !== "i-text")) return 0

    return (activeObject as any)._bendAmount || 0
  }, [])

  useEffect(() => {
    // Delay canvas initialization to ensure DOM is ready
    const timer = setTimeout(() => {
      const canvas = initCanvas()
      fabricCanvasRef.current = canvas
      
      // If we have boundaries already set, apply them immediately
      if (designBoundariesRef.current.length > 0) {
        console.log('🎯 Applying design boundaries after canvas init:', designBoundariesRef.current)
        // Force a re-render to show boundaries
        if (canvas) {
          canvas.requestRenderAll()
        }
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose()
        } catch (error) {
          console.error('Error disposing canvas:', error)
        }
        fabricCanvasRef.current = null
      }
      if ((window as any).fabricCanvas) {
        (window as any).fabricCanvas = null
      }
    }
  }, [initCanvas])

  // Load canvas from JSON
  const loadFromJSON = useCallback((json: any) => {
    // Access the fabric canvas instance from the global window object
    const fabricCanvas = (window as any).fabricCanvas
    if (!fabricCanvas) {
      console.warn('Fabric canvas not available for loading')
      return
    }
    
    try {
      console.log('Loading canvas from JSON:', json)
      
      fabricCanvas.clear()
      
      // Load from JSON with custom property preservation
      fabricCanvas.loadFromJSON(json, () => {
        console.log('Canvas loaded from JSON, processing objects...')
        
        // After loading the canvas, make sure all objects have proper event handlers and custom properties
        fabricCanvas.getObjects().forEach((obj: fabric.Object, index: number) => {
          console.log(`Processing object ${index}:`, obj.type, obj)
          
          // Restore custom properties that might have been lost
          const objData = json.objects?.[index]
          if (objData) {
            // Restore custom properties
            if (objData.isTemplate !== undefined) {
              (obj as any).isTemplate = objData.isTemplate
            }
            if (objData._originalFontSize !== undefined) {
              (obj as any)._originalFontSize = objData._originalFontSize
            }
            if (objData._bendAmount !== undefined) {
              (obj as any)._bendAmount = objData._bendAmount
            }
            if (objData.minFontSize !== undefined) {
              (obj as any).minFontSize = objData.minFontSize
            }
            if (objData.maxFontSize !== undefined) {
              (obj as any).maxFontSize = objData.maxFontSize
            }
          }
          
          // Check if it's a text object and apply special text scaling behavior
          if (obj.type === "i-text" || obj.type === "text") {
            const textObj = obj as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number; _bendAmount?: number }
            
            // Ensure original font size is set
            if (textObj._originalFontSize === undefined) {
              textObj._originalFontSize = textObj.fontSize || 24
            }
            
            // Set default constraints if not present
            if (textObj.minFontSize === undefined) {
              textObj.minFontSize = 8
            }
            if (textObj.maxFontSize === undefined) {
              textObj.maxFontSize = 200
            }
            
            // Remove any existing event listeners to prevent duplicates
            textObj.off('scaling')
            textObj.off('modified')
            
            // Apply the text scaling behavior
            textObj.on('scaling', function(e: any) {
              const target = e.target as fabric.IText & { minFontSize?: number; maxFontSize?: number; _originalFontSize?: number }
              if (!target) return
      
              if (!target._originalFontSize) {
                target._originalFontSize = target.fontSize || 24
              }
      
              const scaleX = target.scaleX || 1
              const scaleY = target.scaleY || 1
              const scale = Math.min(scaleX, scaleY)
              
              const newFontSize = Math.round(target._originalFontSize * scale)
              const minSize = target.minFontSize || 8
              const maxSize = target.maxFontSize || 200
              const constrainedFontSize = Math.max(minSize, Math.min(newFontSize, maxSize))
              
              target.set({
                fontSize: constrainedFontSize,
                scaleX: 1,
                scaleY: 1,
              })
              
              fabricCanvas.requestRenderAll()
            })
            
            // Handle when scaling is finished
            textObj.on('modified', function(e: any) {
              const target = e.target as fabric.IText & { _originalFontSize?: number }
              if (!target) return
              
              // Update the original font size to the new font size
              target._originalFontSize = target.fontSize || 24
              
              // Save state after scaling is complete
              setTimeout(() => saveState(fabricCanvas), 100)
            })
            
            console.log('Applied text scaling behavior to text object:', textObj.text)
          }
          
          // For image objects, ensure they have proper properties
          if (obj.type === "image") {
            const imageObj = obj as fabric.Image & { isTemplate?: boolean }
            console.log('Loaded image object:', { isTemplate: imageObj.isTemplate, src: (imageObj as any).src })
          }
        })
        
        console.log('All objects processed, rendering canvas')
        fabricCanvas.renderAll()
        
        // Set the active object to null initially
        fabricCanvas.discardActiveObject()
        fabricCanvas.requestRenderAll()
        
        // Save the initial state after loading
        setTimeout(() => {
          saveState(fabricCanvas)
          console.log('Canvas state saved after loading')
        }, 100)
      })
    } catch (error) {
      console.error('Error loading canvas from JSON:', error)
      // Try to display a user-friendly error
      if (fabricCanvas) {
        fabricCanvas.clear()
        fabricCanvas.requestRenderAll()
      }
    }
  }, [saveState])

    // Add image to canvas
  const addImage = useCallback(
    (canvasInstance: fabric.Canvas, imageUrl: string, options: any = {}) => {
      // Validate canvas instance
      if (!canvasInstance) {
        console.error('Canvas instance is not available')
        return
      }
      
      // Check if canvas has proper contexts
      if (!(canvasInstance as any).contextTop || !(canvasInstance as any).contextContainer) {
        console.error('Canvas contexts are not properly initialized')
        // Try to get fresh canvas instance
        const freshCanvas = (window as any).fabricCanvas
        if (freshCanvas && (freshCanvas as any).contextTop && (freshCanvas as any).contextContainer) {
          canvasInstance = freshCanvas
          console.log('Using fresh canvas instance from window')
        } else {
          console.error('Cannot add image - canvas not properly initialized')
          return
        }
      }
      
      // Use regular JS Image to load first to avoid TypeScript issues with fabric.Image.fromURL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = function() {
        try {
          // Calculate initial position within boundaries if they exist
          let initialLeft = 150
          let initialTop = 150
          
          if (designBoundariesRef.current.length > 0) {
            const boundary = designBoundariesRef.current[0]
            // Place image in the center of the first boundary
            initialLeft = boundary.x + boundary.width / 2
            initialTop = boundary.y + boundary.height / 2
          }
          
          // Create fabric image from the loaded JS image
          const fabricImage = new fabric.Image(img, {
            left: initialLeft,
            top: initialTop,
            originX: "center",
            originY: "center",
            ...options
          });
          
          // Scale the image to fit within a reasonable size while maintaining aspect ratio
          const maxDimension = 250; // Maximum width or height
          if (fabricImage.width && fabricImage.height) {
            if (fabricImage.width > fabricImage.height) {
              if (fabricImage.width > maxDimension) {
                fabricImage.scaleToWidth(maxDimension);
              }
            } else {
              if (fabricImage.height > maxDimension) {
                fabricImage.scaleToHeight(maxDimension);
              }
            }
          }
          
          // Add the image to the canvas
          canvasInstance.add(fabricImage);
          canvasInstance.setActiveObject(fabricImage);
          canvasInstance.requestRenderAll();
          
          // Dispatch to Redux store
          dispatch({
            type: 'canvas/setSelectedObject',
            payload: fabricImage
          });
          
          // Save canvas state
          setTimeout(() => saveState(canvasInstance), 50);
        } catch (error) {
          console.error('Error adding image to canvas:', error)
        }
      };
      
      img.onerror = function() {
        console.error('Failed to load image:', imageUrl)
      };
      
      img.src = imageUrl;
    },
    [dispatch, saveState],
  );

  return {
    canvasRef,
    addText,
    addImage,
    deleteSelected,
    duplicateSelected,
    updateTextProperties,
    getTextScalingInfo,
    handleUndo,
    handleRedo,
    clearCanvas,
    exportCanvas,
    bendText,
    getTextBendAmount,
    loadFromJSON,
    setDesignBoundaries
  }
}