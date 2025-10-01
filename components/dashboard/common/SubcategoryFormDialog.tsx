import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Palette, X, Info } from "lucide-react"
import type { Subcategory, Category } from "@/types"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  initialValues: Partial<Subcategory>
  categories: Category[]
  onSubmit: (values: Partial<Subcategory>) => void
  isEdit?: boolean
}

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  slug: Yup.string().required("Required"),
  categoryId: Yup.string().required("Required"),
})

export const SubcategoryFormDialog: React.FC<Props> = ({ open, onOpenChange, initialValues, categories, onSubmit, isEdit }) => {
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
      categoryId: initialValues.categoryId || (categories[0]?.id || ""),
      isActive: initialValues.isActive ?? true,
      inheritDesignSettings: initialValues.inheritDesignSettings ?? true,
      isDesignable: initialValues.isDesignable ?? false,
      designableAreas: initialValues.designableAreas || [],
      designTechniques: initialValues.designTechniques || [],
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => onSubmit(values),
  })

  // Get parent category settings
  const parentCategory = categories.find(c => c.id === formik.values.categoryId)
  const parentIsDesignable = parentCategory?.isDesignable || false
  const parentAreas = parentCategory?.designableAreas || []
  const parentTechniques = parentCategory?.designTechniques || []

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

  // When inherit settings change, update design fields
  useEffect(() => {
    if (formik.values.inheritDesignSettings && parentCategory) {
      formik.setFieldValue("isDesignable", parentIsDesignable)
      formik.setFieldValue("designableAreas", parentAreas)
      formik.setFieldValue("designTechniques", parentTechniques)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.inheritDesignSettings, formik.values.categoryId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Subcategory" : "Create Subcategory"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formik.values.categoryId} onValueChange={(v) => formik.setFieldValue("categoryId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                    {c.isDesignable && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        <Palette className="h-3 w-3 mr-1" />
                        Designable
                      </Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
            
            {parentCategory && parentIsDesignable ? (
              <>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formik.values.inheritDesignSettings} 
                    onCheckedChange={(v) => formik.setFieldValue("inheritDesignSettings", v)} 
                  />
                  <Label>Inherit design settings from parent category</Label>
                </div>
                
                {formik.values.inheritDesignSettings && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This subcategory will use the parent category's design settings:
                      <div className="mt-2 space-y-1 text-sm">
                        <div>• Designable: {parentIsDesignable ? 'Yes' : 'No'}</div>
                        {parentAreas.length > 0 && (
                          <div>• Areas: {parentAreas.join(', ')}</div>
                        )}
                        {parentTechniques.length > 0 && (
                          <div>• Techniques: {parentTechniques.join(', ')}</div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {!parentCategory 
                    ? "Select a category to configure design settings" 
                    : "Parent category is not designable, so this subcategory cannot be designable either"}
                </AlertDescription>
              </Alert>
            )}
            
            {!formik.values.inheritDesignSettings && parentIsDesignable && (
              <>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formik.values.isDesignable} 
                    onCheckedChange={(v) => formik.setFieldValue("isDesignable", v)} 
                  />
                  <Label>Products in this subcategory can be customized</Label>
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
                  </>
                )}
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