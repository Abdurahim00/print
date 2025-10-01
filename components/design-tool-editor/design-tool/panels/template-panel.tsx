"use client"
import { useState, useEffect } from "react"
import { ImageIcon, Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import type { Template } from "@/lib/models/Template"
import * as fabric from "fabric"

export function TemplatePanel() {
  const { fabricCanvas } = useSelector((state: RootState) => state.canvas)
  const { loadFromJSON } = useFabricCanvas("design-canvas")
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = selectedCategory === "all"
          ? "/api/templates"
          : `/api/templates?category=${selectedCategory}`
        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch templates")
        const data = await response.json()
        setTemplates(data)
      } catch (err) {
        console.error("Error fetching templates:", err)
        setError("Failed to load templates")
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [selectedCategory])

  const handleApplyTemplate = async (template: Template) => {
    // Try to get canvas from Redux or global window object
    const canvas = fabricCanvas || (typeof window !== 'undefined' ? (window as any).fabricCanvas : null)

    if (!canvas) {
      console.warn("Canvas not ready yet. Please wait for canvas to initialize.")
      alert("Canvas is not ready yet. Please wait a moment and try again.")
      return
    }

    if (!template.image || typeof template.image !== 'string' || template.image.trim() === '') {
      console.warn("Template has no valid image:", template)
      alert("This template doesn't have a valid image URL.")
      return
    }

    // Validate URL format
    try {
      new URL(template.image)
    } catch (e) {
      console.error("Invalid template image URL:", template.image)
      alert("This template has an invalid image URL. Please update it in the admin dashboard.")
      return
    }

    // Load the template image and add it to canvas using fabric module
    // Try without crossOrigin first, then with anonymous if needed
    const loadImage = async () => {
      try {
        // First try without crossOrigin
        const img = await fabric.FabricImage.fromURL(template.image)
        return img
      } catch (e) {
        // If that fails, try with crossOrigin anonymous
        try {
          const img = await fabric.FabricImage.fromURL(template.image, {
            crossOrigin: 'anonymous'
          })
          return img
        } catch (e2) {
          throw e2
        }
      }
    }

    loadImage().then((img) => {
      if (!img) {
        alert("Failed to load template image. The image URL might be broken.")
        return
      }

      // Scale image to fit canvas if too large
      const canvasWidth = canvas.width || 600
      const canvasHeight = canvas.height || 600
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

      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      console.log("Template applied successfully:", template.name)
    }).catch((error) => {
      console.error("Failed to load template image:", error)
      const errorMsg = error?.message || String(error)
      if (errorMsg.includes('CORS') || errorMsg.includes('cross-origin')) {
        alert("Cannot load this image due to CORS restrictions. Please:\n1. Upload the image to your own server, or\n2. Use an image hosting service that allows CORS (like imgur, cloudinary, etc.)")
      } else if (errorMsg.includes('404')) {
        alert("Image not found (404). Please check the URL and update it in the admin dashboard.")
      } else {
        alert("Failed to load template image. The URL might be broken or inaccessible.")
      }
    })
  }

  // Get unique categories from templates
  const categories = ["all", ...new Set(templates.map(t => t.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6 flex flex-col items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded text-xs sm:text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center text-xs sm:text-sm">No templates available</p>
          <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2">
            Add templates from the admin dashboard
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleApplyTemplate(template)}
              className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-all duration-200"
              title={template.name}
            >
              {template.image ? (
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide broken image and show placeholder
                    (e.target as HTMLImageElement).style.display = 'none'
                    const placeholder = (e.target as HTMLImageElement).nextElementSibling
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-gray-100 flex items-center justify-center"
                style={{ display: template.image ? 'none' : 'flex' }}
              >
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs sm:text-sm font-medium transition-opacity duration-200">
                  Apply
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 sm:p-2">
                <p className="text-white text-[10px] sm:text-xs font-medium truncate">
                  {template.name}
                </p>
                {template.price !== "free" && (
                  <p className="text-white text-[9px] sm:text-[10px]">
                    {template.price} kr
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
