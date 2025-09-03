import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Palette, X } from "lucide-react"
import type { Category } from "@/types"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  initialValues: Partial<Category>
  onSubmit: (values: Partial<Category>) => void
  isEdit?: boolean
}

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  slug: Yup.string().required("Required"),
})

export const CategoryFormDialog: React.FC<Props> = ({ open, onOpenChange, initialValues, onSubmit, isEdit }) => {
  const generateSlug = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  const slugEditedRef = useRef(false)
  
  // Available design areas and techniques
  const DESIGN_AREAS = ['front', 'back', 'sleeve', 'chest', 'wrap', 'body', 'strap', 'side', 'top']
  const DESIGN_TECHNIQUES = ['print', 'embroidery', 'sublimation', 'engraving']
  
  // State for design settings
  const [newArea, setNewArea] = useState('')
  const [newTechnique, setNewTechnique] = useState('')
  
  const formik = useFormik({
    initialValues: {
      name: initialValues.name || "",
      slug: initialValues.slug || "",
      description: initialValues.description || "",
      isActive: initialValues.isActive ?? true,
      isDesignable: initialValues.isDesignable ?? false,
      designableAreas: initialValues.designableAreas || [],
      designTechniques: initialValues.designTechniques || [],
      designUpchargePercent: initialValues.designUpchargePercent || 0,
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => onSubmit(values),
  })

  useEffect(() => {
    // Auto-generate slug when user types name unless slug manually changed
    const name = formik.values.name
    const currentSlug = formik.values.slug
    const auto = generateSlug(name)
    if (!slugEditedRef.current || currentSlug === "") {
      formik.setFieldValue("slug", auto)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.name])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Create Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" value={formik.values.name} onChange={formik.handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              name="slug"
              value={formik.values.slug}
              onChange={(e) => {
                slugEditedRef.current = true
                formik.setFieldValue("slug", generateSlug(e.target.value))
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input name="description" value={formik.values.description} onChange={formik.handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={formik.values.isActive} onCheckedChange={(v) => formik.setFieldValue("isActive", v)} />
            <Label>Active</Label>
          </div>
          
          <Separator className="my-4" />
          
          {/* Design Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label className="text-base font-semibold">Design Settings</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                checked={formik.values.isDesignable} 
                onCheckedChange={(v) => formik.setFieldValue("isDesignable", v)} 
              />
              <Label>Products in this category can be customized</Label>
            </div>
            
            {formik.values.isDesignable && (
              <>
                {/* Designable Areas */}
                <div className="space-y-2">
                  <Label>Designable Areas</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formik.values.designableAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="gap-1">
                        {area}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formik.values.designableAreas.filter(a => a !== area)
                            formik.setFieldValue('designableAreas', updated)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-3 py-2 border rounded-md"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                    >
                      <option value="">Select area...</option>
                      {DESIGN_AREAS.filter(a => !formik.values.designableAreas.includes(a)).map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newArea && !formik.values.designableAreas.includes(newArea)) {
                          formik.setFieldValue('designableAreas', [...formik.values.designableAreas, newArea])
                          setNewArea('')
                        }
                      }}
                      disabled={!newArea}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {/* Design Techniques */}
                <div className="space-y-2">
                  <Label>Design Techniques</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formik.values.designTechniques.map((technique) => (
                      <Badge key={technique} variant="secondary" className="gap-1">
                        {technique}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formik.values.designTechniques.filter(t => t !== technique)
                            formik.setFieldValue('designTechniques', updated)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-3 py-2 border rounded-md"
                      value={newTechnique}
                      onChange={(e) => setNewTechnique(e.target.value)}
                    >
                      <option value="">Select technique...</option>
                      {DESIGN_TECHNIQUES.filter(t => !formik.values.designTechniques.includes(t)).map(technique => (
                        <option key={technique} value={technique}>{technique}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newTechnique && !formik.values.designTechniques.includes(newTechnique)) {
                          formik.setFieldValue('designTechniques', [...formik.values.designTechniques, newTechnique])
                          setNewTechnique('')
                        }
                      }}
                      disabled={!newTechnique}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {/* Design Upcharge Pricing */}
                <div className="space-y-2">
                  <Label>Design Upcharge %</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="designUpchargePercent"
                      value={formik.values.designUpchargePercent}
                      onChange={formik.handleChange}
                      min="0"
                      max="100"
                      step="1"
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Price increase when a design is added (e.g., 15 = 15% increase)
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


