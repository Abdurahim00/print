"use client"

import { useEffect, useRef, useCallback } from "react"
import * as fabric from "fabric"
import { useDispatch, useSelector } from "react-redux"
import { setFabricCanvas, addObject, setSelectedObject, addToHistory, undo, redo } from "../lib/redux/designToolSlices/canvasSlice"
import { RootState } from "../lib/redux/store"

export const useFabricCanvas = (canvasId: string) => {
  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const { selectedObject, history, historyIndex } = useSelector((state: RootState) => state.canvas)
  const { selectedTool } = useSelector((state: RootState) => state.design)

  // saveState now accepts the canvas instance as an argument
  const saveState = useCallback(
    (canvasInstance: fabric.Canvas) => {
      if (canvasInstance) {
        const state = JSON.stringify(canvasInstance.toJSON())
        dispatch(addToHistory(state))
      }
    },
    [dispatch],
  )

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 400,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      imageSmoothingEnabled: true,
    })

    // --- Fabric.js v6 Global Control Configuration ---
    // Set global defaults for all interactive objects
    fabric.InteractiveFabricObject.ownDefaults = {
      ...fabric.InteractiveFabricObject.ownDefaults,
      transparentCorners: false,
      cornerSize: 32,
      padding: 10,
      borderColor: "#000000",
      hasBorders: false,
      cornerColor: "#ffffff",
      cornerStrokeColor: "#e5e7eb",
    }

    // Professional floating control icons
    const deleteIcon = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="white" stroke="#e5e7eb" stroke-width="1"/>
        <circle cx="16" cy="16" r="14" fill="#dc2626"/>
        <path d="M12 12l8 8M20 12l-8 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`

    const copyIcon = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="white" stroke="#e5e7eb" stroke-width="1"/>
        <circle cx="16" cy="16" r="14" fill="#2563eb"/>
        <path d="M13 10.5h-2a1.5 1.5 0 00-1.5 1.5v9a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-2M16.5 9.5h4a1.5 1.5 0 011.5 1.5v4M16.5 9.5v4h4" stroke="white" stroke-width="1.5" fill="none"/>
      </svg>
    `)}`

    const rotateIcon = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="white" stroke="#e5e7eb" stroke-width="1"/>
        <circle cx="16" cy="16" r="14" fill="#16a34a"/>
        <path d="M16 8v4l2-2 2 2V8M8 16h4l-2-2-2-2h4" stroke="white" stroke-width="1.5" fill="none"/>
        <path d="M20 12a6 6 0 11-8 8" stroke="white" stroke-width="1.5" fill="none"/>
      </svg>
    `)}`

    // Load control images
    const deleteImg = new Image()
    deleteImg.src = deleteIcon
    const copyImg = new Image()
    copyImg.src = copyIcon
    const rotateImg = new Image()
    rotateImg.src = rotateIcon

    // Define custom controls globally for all objects
    fabric.InteractiveFabricObject.ownDefaults.controls = {
      // Delete control - positioned top-right
      deleteControl: new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -20,
        offsetX: 20,
        cursorStyle: "pointer",
        mouseUpHandler: (eventData: any, transform: any) => {
          const target = transform.target
          const canvas = target.canvas
          if (canvas) {
            canvas.remove(target)
            canvas.requestRenderAll()
            dispatch(setSelectedObject(null))
            setTimeout(() => saveState(canvas), 50)
          }
          return true
        },
        render: (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) => {
          const size = 32
          ctx.save()
          ctx.translate(left, top)
          ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size)
          ctx.restore()
        },
      } as any),

      // Copy control - positioned top-left
      copyControl: new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetY: -20,
        offsetX: -20,
        cursorStyle: "pointer",
        mouseUpHandler: async (eventData: any, transform: any) => {
          const target = transform.target
          const canvas = target.canvas
          if (canvas) {
            const cloned = await target.clone()
            cloned.set({
              left: (target.left || 0) + 30,
              top: (target.top || 0) + 30,
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
          ctx.save()
          ctx.translate(left, top)
          ctx.drawImage(copyImg, -size / 2, -size / 2, size, size)
          ctx.restore()
        },
      } as any),

      // Rotate control - positioned bottom center
      mtr: new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 30,
        cursorStyle: "crosshair",
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: "rotate",
        render: (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) => {
          const size = 32
          ctx.save()
          ctx.translate(left, top)
          ctx.drawImage(rotateImg, -size / 2, -size / 2, size, size)
          ctx.restore()
        },
      } as any),

      // Hide all other default controls
      tl: new fabric.Control({ visible: false }),
      tr: new fabric.Control({ visible: false }),
      bl: new fabric.Control({ visible: false }),
      br: new fabric.Control({ visible: false }),
      ml: new fabric.Control({ visible: false }),
      mr: new fabric.Control({ visible: false }),
      mt: new fabric.Control({ visible: false }),
      mb: new fabric.Control({ visible: false }),
    }

    // Canvas event listeners
    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected[0]) {
        dispatch(setSelectedObject(e.selected[0]))
      }
    })

    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected[0]) {
        dispatch(setSelectedObject(e.selected[0]))
      }
    })

    canvas.on("selection:cleared", () => {
      dispatch(setSelectedObject(null))
    })

    canvas.on("object:modified", () => {
      setTimeout(() => saveState(canvas), 50)
    })

    canvas.on("object:modified" as any, () => {
      setTimeout(() => saveState(canvas), 50)
    })

    canvas.on("object:modified" as any, () => {
      setTimeout(() => saveState(canvas), 50)
    })

    canvas.on("object:modified" as any, () => {
      setTimeout(() => saveState(canvas), 50)
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
    dispatch(setFabricCanvas(canvas))

    // Save initial state
    setTimeout(() => saveState(canvas), 100)

    return canvas
  }, [dispatch, saveState])

  // addText now accepts the canvas instance as its first argument
  const addText = useCallback(
    (canvasInstance: fabric.Canvas, text = "Your text here", options: any = {}) => {
      const textObj = new fabric.IText(text, {
        left: 200,
        top: 200,
        fontFamily: "Arial",
        fontSize: 24,
        fill: "#000000",
        editable: true,
        selectable: true,
        evented: true,
        originX: "center",
        originY: "center",
        ...options,
      })

      canvasInstance.add(textObj)
      canvasInstance.setActiveObject(textObj)
      canvasInstance.requestRenderAll()

      dispatch(setSelectedObject(textObj))

      setTimeout(() => {
        if (textObj.enterEditing) {
          textObj.enterEditing()
          textObj.selectAll()
        }
      }, 100)

      dispatch(
        addObject({
          id: (textObj as any).id || Date.now().toString(),
          type: "text",
          object: textObj,
        }),
      )

      setTimeout(() => saveState(canvasInstance), 150)

      return textObj
    },
    [dispatch, saveState],
  )

  // addImage now accepts the canvas instance as its first argument
  const addImage = useCallback(
    (canvasInstance: fabric.Canvas, imageUrl: string, options: any = {}) => {
      (fabric.Image as any).fromURL(
        imageUrl,
        (img: fabric.Image) => {
          img.set({
            left: 200,
            top: 200,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
            evented: true,
            originX: "center",
            originY: "center",
            ...options,
          })

          canvasInstance.add(img)
          canvasInstance.setActiveObject(img)
          canvasInstance.requestRenderAll()

          dispatch(
            addObject({
              id: (img as any).id || Date.now().toString(),
              type: "image",
              object: img,
            }),
          )

          setTimeout(() => saveState(canvasInstance), 50)
        },
        { crossOrigin: "anonymous" } as any,
      )
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
        dispatch(setSelectedObject(null))
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
        cloned.set({
          left: (activeObject.left || 0) + 30,
          top: (activeObject.top || 0) + 30,
        })
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
        activeObject.set(properties)
        canvasInstance.requestRenderAll()
        setTimeout(() => saveState(canvasInstance), 50)
      }
    },
    [saveState],
  )

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
          dispatch(setSelectedObject(null))
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
          dispatch(setSelectedObject(null))
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
      dispatch(setSelectedObject(null))
      setTimeout(() => saveState(canvasInstance), 50)
    },
    [dispatch, saveState],
  )

  // exportCanvas now accepts the canvas instance as its first argument
  const exportCanvas = useCallback((canvasInstance: fabric.Canvas, format: any = "png") => {
    return canvasInstance.toDataURL({
      format,
      quality: 1,
      multiplier: 2,
    })
  }, [])

  useEffect(() => {
    const canvas = initCanvas()

    return () => {
      if (canvas) {
        canvas.dispose()
      }
    }
  }, [initCanvas])

  return {
    canvasRef,
    addText,
    addImage,
    deleteSelected,
    duplicateSelected,
    updateTextProperties,
    handleUndo,
    handleRedo,
    clearCanvas,
    exportCanvas,
  }
}
