"use client"
import { useEffect, useState } from "react"
import { ImageIcon, Loader2, FileText } from "lucide-react"
import { ImagePropertiesPanel } from "./image-properties"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import * as fabric from "fabric"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"

interface Template {
  _id: string
  id?: string
  name: string
  description?: string
  canvasJSON?: string
  image?: string  // Legacy field
  previewImage?: string  // New field
  category?: string
  price?: number | "free"
  isActive?: boolean
  createdAt?: string
}

export function TemplatePanel() {
  const selected = useSelector((s: RootState) => (s.canvas as any).selectedObject)
  const isImage = selected && selected.type === "image"
  const { fabricCanvas } = useSelector((state: RootState) => state.canvas)

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null)

  // Fetch templates from API
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/templates')

      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      // Only show active templates
      const activeTemplates = (data.templates || data || []).filter((t: Template) => t.isActive !== false)
      setTemplates(activeTemplates)
    } catch (err) {
      console.error('Error fetching templates:', err)
      setError('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = async (template: Template) => {
    if (!fabricCanvas) {
      console.warn('Canvas not initialized')
      alert('Please wait for canvas to load')
      return
    }

    // Check if template has canvas data
    if (!template.canvasJSON) {
      // If no canvas JSON, but has an image, just add the image as a template
      if (template.image || template.previewImage) {
        try {
          setApplyingTemplate(template._id || template.id || '')
          const imageUrl = template.previewImage || template.image

          const img = await fabric.FabricImage.fromURL(imageUrl!, {}, {
            crossOrigin: 'anonymous',
            left: 100,
            top: 100
          })

          // Scale image to fit canvas
          const canvasWidth = fabricCanvas.width || 500
          const canvasHeight = fabricCanvas.height || 500
          const scale = Math.min(
            canvasWidth / (img.width || 1) * 0.5,
            canvasHeight / (img.height || 1) * 0.5,
            1
          )

          img.scaleToWidth(img.width! * scale)
          img.set({
            left: canvasWidth / 2 - (img.width! * scale) / 2,
            top: canvasHeight / 2 - (img.height! * scale) / 2,
          })

          fabricCanvas.add(img)
          fabricCanvas.setActiveObject(img)
          fabricCanvas.renderAll()
          console.log('Template image added successfully')
        } catch (err) {
          console.error('Error adding template image:', err)
          alert('Failed to add template image')
        } finally {
          setApplyingTemplate(null)
        }
        return
      }

      console.warn('Template has no canvas data or image')
      alert('This template has no design data')
      return
    }

    try {
      setApplyingTemplate(template._id || template.id || '')

      // Parse the template JSON
      let templateData
      try {
        templateData = typeof template.canvasJSON === 'string'
          ? JSON.parse(template.canvasJSON)
          : template.canvasJSON
      } catch (parseErr) {
        console.error('Failed to parse template JSON:', parseErr)
        alert('Template data is corrupted')
        setApplyingTemplate(null)
        return
      }

      // Clear existing canvas content (optional - you might want to ask user first)
      const confirmApply = window.confirm('This will replace your current design. Continue?')
      if (!confirmApply) {
        setApplyingTemplate(null)
        return
      }

      // Clear canvas
      fabricCanvas.clear()

      // If template has full canvas state, load it directly
      if (templateData.version && templateData.objects) {
        fabricCanvas.loadFromJSON(templateData, () => {
          fabricCanvas.renderAll()
          console.log('Template loaded from full canvas state')
        })
      } else if (templateData.objects && Array.isArray(templateData.objects)) {
        // Load individual objects
        for (const objData of templateData.objects) {
          try {
            // Handle different object types
            if (objData.type === 'text' || objData.type === 'i-text' || objData.type === 'textbox') {
              const text = new fabric.Textbox(objData.text || 'Text', {
                ...objData,
                left: objData.left || 100,
                top: objData.top || 100,
                fontSize: objData.fontSize || 20,
                fontFamily: objData.fontFamily || 'Arial',
                fill: objData.fill || '#000000'
              })
              fabricCanvas.add(text)
            } else if (objData.type === 'image') {
              // Load image
              if (objData.src) {
                const img = await fabric.FabricImage.fromURL(objData.src, {}, {
                  ...objData,
                  crossOrigin: 'anonymous'
                })
                fabricCanvas.add(img)
              }
            } else if (objData.type === 'rect') {
              const rect = new fabric.Rect(objData)
              fabricCanvas.add(rect)
            } else if (objData.type === 'circle') {
              const circle = new fabric.Circle(objData)
              fabricCanvas.add(circle)
            } else if (objData.type === 'path') {
              const path = new fabric.Path(objData.path, objData)
              fabricCanvas.add(path)
            } else if (objData.type === 'group') {
              // Handle grouped objects
              console.log('Group objects not yet implemented')
            }
            // Add more object types as needed
          } catch (objErr) {
            console.error('Error adding object to canvas:', objErr, objData)
          }
        }
        fabricCanvas.renderAll()
      }

      console.log('Template applied successfully')
    } catch (err) {
      console.error('Error applying template:', err)
      alert('Failed to apply template. Check console for details.')
    } finally {
      setApplyingTemplate(null)
    }
  }

  if (isImage) {
    return <ImagePropertiesPanel />
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Templates</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchTemplates}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-8 text-red-500">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchTemplates}
          >
            Try Again
          </Button>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">No templates available</p>
          <p className="text-sm text-gray-400 mt-2">Create templates in the admin dashboard</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <Card
                key={template._id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="space-y-2">
                  {(template.previewImage || template.image) ? (
                    <img
                      src={template.previewImage || template.image || ''}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.onerror = null
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          const placeholder = document.createElement('div')
                          placeholder.className = 'w-full h-32 bg-gray-100 dark:bg-gray-800 rounded mb-2 flex items-center justify-center'
                          placeholder.innerHTML = '<svg class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
                          parent.appendChild(placeholder)
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <h4 className="font-medium">{template.name}</h4>

                  {template.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  )}

                  {template.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                      {template.category}
                    </span>
                  )}

                  {template.price !== undefined && (
                    <p className="text-sm font-semibold">
                      {template.price === "free" ? "Free" : `$${template.price}`}
                    </p>
                  )}

                  <Button
                    className="w-full mt-2"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    disabled={applyingTemplate === (template._id || template.id) || !fabricCanvas}
                  >
                    {applyingTemplate === (template._id || template.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      'Apply Template'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}