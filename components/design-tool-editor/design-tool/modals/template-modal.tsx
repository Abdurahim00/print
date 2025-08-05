"use client"
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { setSelectedCategory, setSearchTerm } from "@/lib/redux/designToolSlices/templatesSlice"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { RootState } from "@/lib/redux/store"

interface Template {
  id: string
  name: string
  category: string
  image: string
}

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  templates: Template[]
}

export function TemplateModal({ isOpen, onClose, templates }: TemplateModalProps) {
  const dispatch = useDispatch()
  const { selectedCategory, searchTerm, categories } = useSelector((state: RootState) => state.templates)
  const { addImage } = useFabricCanvas("design-canvas")

  const handleSelectTemplate = (template: Template) => {
    // Get fabricCanvas from Redux state
    const { fabricCanvas } = useSelector((state: RootState) => state.canvas)
    if (fabricCanvas) {
      addImage(fabricCanvas, template.image, {
        scaleX: 0.4,
        scaleY: 0.4,
      })
    }
    onClose()
  }

  const filteredTemplates = templates.filter((template: Template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Template</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category: string) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => dispatch(setSelectedCategory(category))}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template: Template) => (
              <div
                key={template.id}
                className="border rounded-xl p-3 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:bg-gray-200 transition-colors overflow-hidden">
                  <img
                    src={template.image || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-medium text-sm text-gray-900 mb-1 truncate">{template.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{template.category}</p>

                <Button size="sm" className="w-full rounded-lg text-xs" onClick={() => handleSelectTemplate(template)}>
                  Use Template
                </Button>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No templates found matching your criteria</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
