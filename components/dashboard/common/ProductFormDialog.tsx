import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Product, Variation, Color, VariationImage } from "@/types"
import { ProductAnglesSelector } from "./ProductAnglesSelector"
import { useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: any
  onSubmit: (values: any, helpers: any) => Promise<void>
  t: any
  productCategories: any[]
  isSubmitting: boolean
  isEdit?: boolean
}

const defaultAngles = ["front", "back", "left", "right", "material"]

const productSchema = Yup.object().shape({
  name: Yup.string().required("productNameRequired").min(2, "nameMinLength"),
  price: Yup.number().required("priceRequired").min(0.01, "priceGreaterThanZero"),
  categoryId: Yup.string().required("categoryRequired"),
  description: Yup.string(),
  image: Yup.string(),
  hasVariations: Yup.boolean(),
  variations: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      color: Yup.object().shape({
        name: Yup.string(),
        hex_code: Yup.string(),
        swatch_image: Yup.string().nullable(),
      }),
      price: Yup.number(),
      inStock: Yup.boolean(),
      stockQuantity: Yup.number(),
      images: Yup.array().of(
        Yup.object().shape({
          id: Yup.string(),
          url: Yup.string().nullable(), // Make url optional to allow adding images without blocking
          alt_text: Yup.string().nullable(), // Make alt_text optional
          angle: Yup.string(),
          is_primary: Yup.boolean(),
        })
      ),
    })
  ),
})

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  t,
  productCategories,
  isSubmitting,
  isEdit = false,
}) => {
  const [showVariations, setShowVariations] = useState(initialValues.hasVariations || false)
  const { categories, subcategories } = useAppSelector((s: any) => s.categories)
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      hasVariations: initialValues.hasVariations || false,
      variations: initialValues.variations || [],
    },
    enableReinitialize: true,
    validationSchema: productSchema,
    onSubmit: async (values, helpers) => {
      console.log("Form submission with values:", values)
      try {
        // Clean up variations before submission - remove images without URLs
        const cleanedValues = {
          ...values,
          variations: values.variations?.map((variation: any) => ({
            ...variation,
            images: variation.images?.filter((img: any) => img.url && img.url.trim() !== '') || []
          })) || []
        }
        console.log("Cleaned form values:", cleanedValues)
        await onSubmit(cleanedValues, helpers)
      } catch (error) {
        console.error("Form submission error:", error)
      }
    },
  })

  // Helper to add a new variation
  const addVariation = () => {
    const newVariation: Variation = {
      id: `var_${Date.now()}`,
      color: { name: "", hex_code: "#000000", swatch_image: "" },
      price: formik.values.price,
      inStock: true,
      stockQuantity: 0,
      images: [],
    }
    formik.setFieldValue("variations", [...formik.values.variations, newVariation])
  }

  // Helper to remove a variation
  const removeVariation = (id: string) => {
    formik.setFieldValue(
      "variations",
      formik.values.variations.filter((v: Variation) => v.id !== id)
    )
  }

  // Helper to update a variation
  const updateVariation = (index: number, updated: Partial<Variation>) => {
    const variations = [...formik.values.variations]
    variations[index] = { ...variations[index], ...updated }
    formik.setFieldValue("variations", variations)
  }

  // Helper to update a variation image
  const updateVariationImage = (varIdx: number, imgIdx: number, updated: Partial<VariationImage>) => {
    const variations = [...formik.values.variations]
    const images = [...variations[varIdx].images]
    images[imgIdx] = { ...images[imgIdx], ...updated }
    variations[varIdx].images = images
    formik.setFieldValue("variations", variations)
  }

  // Helper to add an image to a variation
  const addVariationImage = (varIdx: number, angle: string) => {
    const variations = [...formik.values.variations]
    const newImage: VariationImage = {
      id: `img_${Date.now()}`,
      url: "",
      alt_text: "",
      angle,
      is_primary: variations[varIdx].images.length === 0,
    }
    variations[varIdx].images.push(newImage)
    formik.setFieldValue("variations", variations)
  }

  // Helper to remove an image from a variation
  const removeVariationImage = (varIdx: number, imgId: string) => {
    const variations = [...formik.values.variations]
    variations[varIdx].images = variations[varIdx].images.filter((img: VariationImage) => img.id !== imgId)
    formik.setFieldValue("variations", variations)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {isEdit ? t.editProduct : t.addProduct}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
          {/* Basic product fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.productName} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t.enterProductName}
                className={
                  formik.touched.name && formik.errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-600">{t[formik.errors.name as keyof typeof t] || formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t.priceSEK} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0.00"
                className={
                  formik.touched.price && formik.errors.price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                }
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-sm text-red-600">{t[formik.errors.price as keyof typeof t] || formik.errors.price}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.category} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formik.values.categoryId}
              onValueChange={(value) => formik.setFieldValue("categoryId", value)}
            >
              <SelectTrigger
                className={
                  formik.touched.categoryId && formik.errors.categoryId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                }
              >
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-sm text-red-600">{t[formik.errors.categoryId as keyof typeof t] || formik.errors.categoryId}</p>
            )}
          </div>

          {/* Subcategories checkboxes */}
          {formik.values.categoryId && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Subcategories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subcategories
                  .filter((s: any) => s.categoryId === formik.values.categoryId)
                  .map((s: any) => {
                    const checked = (formik.values.subcategoryIds || []).includes(s.id)
                    return (
                      <label key={s.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const list = new Set<string>(formik.values.subcategoryIds || [])
                            if (e.target.checked) list.add(s.id)
                            else list.delete(s.id)
                            formik.setFieldValue("subcategoryIds", Array.from(list))
                          }}
                        />
                        {s.name}
                      </label>
                    )
                  })}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.description}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t.enterProductDescription}
              rows={3}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-200"
            />
          </div>
          <FileUpload
            label={t.productImage}
            value={formik.values.image}
            onChange={(value) => formik.setFieldValue("image", value)}
            error={formik.touched.image && formik.errors.image ? String(formik.errors.image) : undefined}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasVariations"
              checked={showVariations}
              onChange={() => {
                setShowVariations(!showVariations)
                formik.setFieldValue("hasVariations", !showVariations)
              }}
            />
            <Label htmlFor="hasVariations">{t.hasVariations || "Has Variations (e.g. color, size)"}</Label>
          </div>
          {showVariations && (
            <div className="space-y-4 border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/30">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{t.variations || "Product Variations"}</h4>
                <Button type="button" onClick={addVariation} size="sm">{t.addVariation || "Add Variation"}</Button>
              </div>
              {formik.values.variations.map((variation: Variation, varIdx: number) => (
                <div key={variation.id} className="border rounded-md p-3 bg-white dark:bg-slate-900/50 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{t.variation} #{varIdx + 1}</span>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeVariation(variation.id)}>{t.remove || "Remove"}</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t.colorName || "Color Name"}</Label>
                      <Input
                        value={variation.color.name}
                        onChange={e => updateVariation(varIdx, { color: { ...variation.color, name: e.target.value } })}
                        placeholder={t.colorName || "Color Name"}
                      />
                    </div>
                    <div>
                      <Label>{t.colorHex || "Color Hex"}</Label>
                      <Input
                        value={variation.color.hex_code || "#000000"}
                        onChange={e => updateVariation(varIdx, { color: { ...variation.color, hex_code: e.target.value } })}
                        placeholder="#000000"
                        type="color"
                        className="h-10 w-full"
                      />
                    </div>
                    <div>
                      <Label>{t.swatchImage || "Swatch Image"}</Label>
                      <FileUpload
                        value={variation.color.swatch_image || ""}
                        onChange={(img: string) => updateVariation(varIdx, { color: { ...variation.color, swatch_image: img } })}
                        label={t.swatchImage || "Swatch Image"}
                      />
                    </div>
                    <div>
                      <Label>{t.variationPrice || "Variation Price"}</Label>
                      <Input
                        type="number"
                        value={variation.price}
                        onChange={e => updateVariation(varIdx, { price: Number(e.target.value) })}
                        placeholder={t.variationPrice || "Variation Price"}
                      />
                    </div>
                    <div>
                      <Label>{t.stockQuantity || "Stock Quantity"}</Label>
                      <Input
                        type="number"
                        value={variation.stockQuantity}
                        onChange={e => updateVariation(varIdx, { stockQuantity: Number(e.target.value) })}
                        placeholder={t.stockQuantity || "Stock Quantity"}
                      />
                    </div>
                    <div>
                      <Label>{t.inStock || "In Stock"}</Label>
                      <input
                        type="checkbox"
                        checked={variation.inStock}
                        onChange={e => updateVariation(varIdx, { inStock: e.target.checked })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">{t.variationImages || "Variation Images"}</h5>
                    <ProductAnglesSelector
                      angles={defaultAngles}
                      selectedAngle={variation.images[0]?.angle || defaultAngles[0]}
                      onSelect={angle => addVariationImage(varIdx, angle)}
                      variationImages={variation.images}
                      productImage={formik.values.image}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {variation.images.map((img, imgIdx) => (
                        <div key={img.id} className="border rounded-md p-2 bg-slate-50 dark:bg-slate-800/30 relative">
                          <FileUpload
                            value={img.url}
                            onChange={url => updateVariationImage(varIdx, imgIdx, { url })}
                            label={t.variationImage || "Image"}
                          />
                          <Input
                            value={img.alt_text}
                            onChange={e => updateVariationImage(varIdx, imgIdx, { alt_text: e.target.value })}
                            placeholder={t.altText || "Alt text"}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs">{img.angle}</span>
                            <input
                              type="radio"
                              checked={img.is_primary}
                              onChange={() => {
                                // Set this image as primary
                                const images = variation.images.map((image, i) => ({ ...image, is_primary: i === imgIdx }))
                                updateVariation(varIdx, { images })
                              }}
                            />
                            <span className="text-xs">{t.primary || "Primary"}</span>
                          </div>
                          <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1" onClick={() => removeVariationImage(varIdx, img.id)}>{t.remove || "Remove"}</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              {t.cancel}
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-[#634c9f] to-[#7a5ec7] hover:from-[#584289] hover:to-[#6b52b3] text-white shadow-lg" disabled={isSubmitting}>
              {isSubmitting ? t.creating : isEdit ? t.updateProduct : t.createProduct}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}