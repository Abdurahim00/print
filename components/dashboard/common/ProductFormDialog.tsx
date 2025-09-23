import React from "react"
import { useTranslations } from "next-intl"
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
import { DesignFrameEditor } from "./DesignFrameEditor"
import { ImageAngleAssignment } from "./ImageAngleAssignment"
import { useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

// Extend Window interface for color picker
declare global {
  interface Window {
    updateVariationFromColorPicker?: (variationIndex: number, hexValue: string, colorName: string | null) => void
  }
}

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

// Color name mapping for common hex values
const colorNameMap: Record<string, string> = {
  "#000000": "Black",
  "#FFFFFF": "White",
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FF00FF": "Magenta",
  "#00FFFF": "Cyan",
  "#FFA500": "Orange",
  "#800080": "Purple",
  "#A52A2A": "Brown",
  "#808080": "Gray",
  "#FFC0CB": "Pink",
  "#FFD700": "Gold",
  "#C0C0C0": "Silver",
  "#8B4513": "Saddle Brown",
  "#32CD32": "Lime Green",
  "#FF4500": "Orange Red",
  "#4169E1": "Royal Blue",
  "#DC143C": "Crimson",
  "#2b4e58": "Dark Teal",
}

// Function to get color name from hex value
const getColorNameFromHex = (hex: string): string | null => {
  const normalizedHex = hex.toUpperCase()
  return colorNameMap[normalizedHex] || null
}

// Function to start web page color picker
const startWebPageColorPicker = (variationIndex: number) => {
  // Create a temporary color picker that can be used to pick colors from the page
  const colorPicker = document.createElement('input')
  colorPicker.type = 'color'
  colorPicker.style.position = 'fixed'
  colorPicker.style.top = '50%'
  colorPicker.style.left = '50%'
  colorPicker.style.transform = 'translate(-50%, -50%)'
  colorPicker.style.zIndex = '10000'
  colorPicker.style.opacity = '0'
  colorPicker.style.pointerEvents = 'none'
  
  document.body.appendChild(colorPicker)
  
  // Trigger color picker
  colorPicker.click()
  
  // Handle color selection
  colorPicker.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement
    const hexValue = target.value
    const colorName = getColorNameFromHex(hexValue)
    
    // Update the variation with the picked color
    if (window.updateVariationFromColorPicker) {
      window.updateVariationFromColorPicker(variationIndex, hexValue, colorName)
    }
    
    // Clean up
    document.body.removeChild(colorPicker)
  })
  
  // Clean up if user cancels
  setTimeout(() => {
    if (document.body.contains(colorPicker)) {
      document.body.removeChild(colorPicker)
    }
  }, 1000)
}

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
  t: _t,
  productCategories,
  isSubmitting,
  isEdit = false,
}) => {
  const t = useTranslations()
  const [showVariations, setShowVariations] = useState(initialValues.hasVariations || false)
  const [selectedVariationAngles, setSelectedVariationAngles] = useState<{ [key: string]: string }>({})
  const { categories, subcategories } = useAppSelector((s: any) => s.categories)
  
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      hasVariations: initialValues.hasVariations || false,
      variations: initialValues.variations || [],
      eligibleForCoupons: initialValues.eligibleForCoupons ?? false,
      purchaseLimit: initialValues.purchaseLimit || {
        enabled: false,
        maxQuantityPerOrder: 5,
        message: ""
      },
      // Design capabilities
      isDesignable: initialValues.isDesignable || false,
      designFrames: initialValues.designFrames || [],
      designCostPerCm2: initialValues.designCostPerCm2 || 0.5,
      variantPositionMappings: initialValues.variantPositionMappings || [],
      // Add angle image fields for products without variations
      frontImage: initialValues.frontImage || "",
      backImage: initialValues.backImage || "",
      leftImage: initialValues.leftImage || "",
      rightImage: initialValues.rightImage || "",
      materialImage: initialValues.materialImage || "",
      frontAltText: initialValues.frontAltText || "",
      backAltText: initialValues.backAltText || "",
      leftAltText: initialValues.leftAltText || "",
      rightAltText: initialValues.rightAltText || "",
      materialAltText: initialValues.materialAltText || "",
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
        
        // For products without variations, create angles array from individual angle images
        if (!cleanedValues.hasVariations) {
          const angles: string[] = []
          if (cleanedValues.frontImage) angles.push('front')
          if (cleanedValues.backImage) angles.push('back')
          if (cleanedValues.leftImage) angles.push('left')
          if (cleanedValues.rightImage) angles.push('right')
          if (cleanedValues.materialImage) angles.push('material')
          cleanedValues.angles = angles
          
          // Ensure all individual angle image fields are properly included
          // This is crucial for single products to work correctly
          const requiredFields = [
            'frontImage', 'backImage', 'leftImage', 'rightImage', 'materialImage',
            'frontAltText', 'backAltText', 'leftAltText', 'rightAltText', 'materialAltText'
          ]
          
          requiredFields.forEach(field => {
            if (cleanedValues[field] === undefined) {
              cleanedValues[field] = ''
            }
          })
          
          console.log('🔧 [ProductFormDialog] Single product angles created:', {
            angles,
            frontImage: cleanedValues.frontImage,
            backImage: cleanedValues.backImage,
            leftImage: cleanedValues.leftImage,
            rightImage: cleanedValues.rightImage,
            materialImage: cleanedValues.materialImage
          })
          
          // Debug: Log the complete cleaned values before submission
          console.log('🔧 [ProductFormDialog] Complete cleaned values before submission:', {
            hasVariations: cleanedValues.hasVariations,
            angles: cleanedValues.angles,
            individualImages: {
              frontImage: cleanedValues.frontImage,
              backImage: cleanedValues.backImage,
              leftImage: cleanedValues.leftImage,
              rightImage: cleanedValues.rightImage,
              materialImage: cleanedValues.materialImage
            },
            allKeys: Object.keys(cleanedValues)
          })
        }
        
        console.log("Cleaned form values:", cleanedValues)
        await onSubmit(cleanedValues, helpers)
      } catch (error) {
        console.error("Form submission error:", error)
        helpers.setSubmitting(false)
      }
    },
  })
  
  // Add global color picker function to window
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateVariationFromColorPicker = (variationIndex: number, hexValue: string, colorName: string | null) => {
        // This will be called from the color picker
        const currentVariations = formik.values.variations
        if (currentVariations[variationIndex]) {
          const updatedVariation = {
            ...currentVariations[variationIndex],
            color: {
              ...currentVariations[variationIndex].color,
              hex_code: hexValue,
              name: colorName || currentVariations[variationIndex].color.name
            }
          }
          
          const newVariations = [...currentVariations]
          newVariations[variationIndex] = updatedVariation
          formik.setFieldValue('variations', newVariations)
        }
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.updateVariationFromColorPicker
      }
    }
  }, [formik])

  // Helper to add a new variation
  const addVariation = () => {
    const newVariation: Variation = {
      id: `var_${Date.now()}`,
      color: { name: "", hex_code: "#000000", swatch_image: "" },
      price: formik.values.price,
      inStock: true,
      stockQuantity: 0,
      images: [],
      designFrames: [],
      designCostPerCm2: formik.values.designCostPerCm2 || 0.5,
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
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0 shadow-2xl p-3 sm:p-6">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {isEdit ? t("dashboard.editProduct") : t("dashboard.addProduct")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
          {/* Basic product fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("dashboard.productName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("dashboard.enterProductName")}
                className={
                  formik.touched.name && formik.errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("dashboard.priceSEK")} <span className="text-red-500">*</span>
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
                <p className="text-sm text-red-600">{formik.errors.price}</p>
              )}
            </div>
          </div>
          {/* Coupon eligibility */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="eligibleForCoupons"
              checked={!!formik.values.eligibleForCoupons}
              onChange={(e) => formik.setFieldValue("eligibleForCoupons", e.target.checked)}
            />
            <Label htmlFor="eligibleForCoupons">{t("dashboard.eligibleForCoupons")}</Label>
          </div>
          
          {/* Purchase Limits Section */}
          <div className="space-y-4 border rounded-lg p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="purchaseLimitEnabled"
                checked={!!formik.values.purchaseLimit?.enabled}
                onChange={(e) => {
                  const currentLimit = formik.values.purchaseLimit || {}
                  formik.setFieldValue("purchaseLimit", {
                    ...currentLimit,
                    enabled: e.target.checked
                  })
                }}
              />
              <Label htmlFor="purchaseLimitEnabled" className="font-medium">{t("dashboard.enablePurchaseLimits")}</Label>
            </div>
            
            {formik.values.purchaseLimit?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxQuantityPerOrder" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("dashboard.maxQuantityPerOrder")}
                  </Label>
                  <Input
                    id="maxQuantityPerOrder"
                    type="number"
                    min="1"
                    value={formik.values.purchaseLimit?.maxQuantityPerOrder || 5}
                    onChange={(e) => {
                      const currentLimit = formik.values.purchaseLimit || {}
                      formik.setFieldValue("purchaseLimit", {
                        ...currentLimit,
                        maxQuantityPerOrder: Number(e.target.value)
                      })
                    }}
                    placeholder="5"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="purchaseLimitMessage" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("dashboard.customLimitMessage")}
                  </Label>
                  <Input
                    id="purchaseLimitMessage"
                    value={formik.values.purchaseLimit?.message || ""}
                    onChange={(e) => {
                      const currentLimit = formik.values.purchaseLimit || {}
                      formik.setFieldValue("purchaseLimit", {
                        ...currentLimit,
                        message: e.target.value
                      })
                    }}
                    placeholder={t("dashboard.maxQuantityLimitMessage")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Size Options Section */}
          <div className="space-y-4 border rounded-lg p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresSize"
                checked={!!formik.values.requiresSize}
                onChange={(e) => {
                  formik.setFieldValue("requiresSize", e.target.checked)
                  if (e.target.checked && (!formik.values.availableSizes || formik.values.availableSizes.length === 0)) {
                    // Set default sizes for apparel
                    formik.setFieldValue("availableSizes", ["XS", "S", "M", "L", "XL", "XXL"])
                  }
                }}
              />
              <Label htmlFor="requiresSize" className="font-medium">Size Options (for apparel)</Label>
            </div>

            {formik.values.requiresSize && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Available Sizes
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"].map((size) => {
                      const isSelected = formik.values.availableSizes?.includes(size)
                      return (
                        <Button
                          key={size}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const currentSizes = formik.values.availableSizes || []
                            if (isSelected) {
                              formik.setFieldValue(
                                "availableSizes",
                                currentSizes.filter((s: string) => s !== size)
                              )
                            } else {
                              formik.setFieldValue("availableSizes", [...currentSizes, size])
                            }
                          }}
                          className={isSelected ? "bg-black hover:bg-gray-800" : ""}
                        >
                          {size}
                        </Button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-slate-500">Click to toggle sizes. Selected sizes will be available for customers.</p>
                </div>

                {/* Custom size input */}
                <div className="space-y-2">
                  <Label htmlFor="customSize" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Add Custom Size
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="customSize"
                      placeholder="Enter custom size (e.g., '2XS', 'One Size')"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          const value = input.value.trim().toUpperCase()
                          if (value && !formik.values.availableSizes?.includes(value)) {
                            formik.setFieldValue("availableSizes", [
                              ...(formik.values.availableSizes || []),
                              value
                            ])
                            input.value = ''
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('customSize') as HTMLInputElement
                        const value = input.value.trim().toUpperCase()
                        if (value && !formik.values.availableSizes?.includes(value)) {
                          formik.setFieldValue("availableSizes", [
                            ...(formik.values.availableSizes || []),
                            value
                          ])
                          input.value = ''
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Display selected sizes */}
                {formik.values.availableSizes && formik.values.availableSizes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Selected Sizes: {formik.values.availableSizes.length}
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {formik.values.availableSizes.sort().map((size: string) => (
                        <Badge key={size} variant="secondary">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("dashboard.category")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formik.values.categoryId || undefined}
              onValueChange={(value) => formik.setFieldValue("categoryId", value)}
            >
              <SelectTrigger
                className={
                  formik.touched.categoryId && formik.errors.categoryId
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                }
              >
                <SelectValue placeholder={t("dashboard.selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat: any) => cat.id && cat.id !== '') // Filter out categories with empty or no ID
                  .map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-sm text-red-600">{formik.errors.categoryId}</p>
            )}
          </div>

          {/* Subcategories checkboxes */}
          {formik.values.categoryId && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("dashboard.subcategories")}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
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
              {t("dashboard.description")}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t("dashboard.enterProductDescription")}
              rows={3}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-200"
            />
          </div>
          <FileUpload
            label={t("dashboard.productImage")}
            value={formik.values.image}
            onChange={(value) => formik.setFieldValue("image", value)}
            error={formik.touched.image && formik.errors.image ? String(formik.errors.image) : undefined}
          />
          
          {/* Design Capabilities Section */}
          <div className="space-y-4 border rounded-lg p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="isDesignable"
                  checked={formik.values.isDesignable}
                  onCheckedChange={(checked) => {
                    formik.setFieldValue("isDesignable", checked)
                    // Clear designCostPerCm2 when disabling design capability
                    if (!checked) {
                      formik.setFieldValue("designCostPerCm2", 0)
                      // Also clear design frames
                      formik.setFieldValue("designFrames", [])
                    } else {
                      // Set default cost when enabling
                      if (!formik.values.designCostPerCm2 || formik.values.designCostPerCm2 === 0) {
                        formik.setFieldValue("designCostPerCm2", 0.5)
                      }
                    }
                  }}
                />
                <Label htmlFor="isDesignable" className="font-medium cursor-pointer">
                  {t("dashboard.enableDesignCustomization")}
                </Label>
              </div>
              {formik.values.isDesignable && (
                <Badge variant="secondary" className="text-xs">
                  {t("dashboard.designableProduct")}
                </Badge>
              )}
            </div>
            
            {formik.values.isDesignable && (
              <DesignFrameEditor
                productImage={formik.values.image}
                frontImage={formik.values.frontImage || formik.values.image}
                backImage={formik.values.backImage}
                leftImage={formik.values.leftImage}
                rightImage={formik.values.rightImage}
                frames={formik.values.designFrames}
                onChange={(frames) => formik.setFieldValue("designFrames", frames)}
                designCostPerCm2={formik.values.designCostPerCm2}
                onCostChange={(cost) => formik.setFieldValue("designCostPerCm2", cost)}
              />
            )}
          </div>
          
          {/* Image Angle Assignment Section */}
          <div className="space-y-4 border rounded-lg p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/30">
            <ImageAngleAssignment 
              product={{
                ...initialValues,
                ...formik.values
              }}
              formik={formik}
              t={t}
            />
          </div>
          
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
            <Label htmlFor="hasVariations">{t("dashboard.hasVariations")}</Label>
          </div>
          {showVariations && (
            <div className="space-y-4 border rounded-lg p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/30">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{t("dashboard.productVariations")}</h4>
                <Button type="button" onClick={addVariation} size="sm">{t("dashboard.addVariation")}</Button>
              </div>
              {formik.values.variations.map((variation: Variation, varIdx: number) => (
                <div key={variation.id} className="border rounded-md p-2 sm:p-3 bg-white dark:bg-slate-900/50 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm sm:text-base">{t("dashboard.variation")} #{varIdx + 1}</span>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeVariation(variation.id)}>{t("common.remove")}</Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>{t("dashboard.colorName")}</Label>
                      <Input
                        value={variation.color.name}
                        onChange={e => updateVariation(varIdx, { color: { ...variation.color, name: e.target.value } })}
                        placeholder={t("dashboard.colorName")}
                      />
                    </div>
                    {formik.values.isDesignable && (
                      <div>
                        <Label>{t("dashboard.positionMapping")}</Label>
                        <Select
                          value={variation.positionMapping || undefined}
                          onValueChange={(value) => updateVariation(varIdx, { positionMapping: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("dashboard.selectPosition")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="front">{t("dashboard.front")}</SelectItem>
                            <SelectItem value="back">{t("dashboard.back")}</SelectItem>
                            <SelectItem value="left">{t("dashboard.leftSide")}</SelectItem>
                            <SelectItem value="right">{t("dashboard.rightSide")}</SelectItem>
                            <SelectItem value="top">{t("dashboard.top")}</SelectItem>
                            <SelectItem value="bottom">{t("dashboard.bottom")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label>{t("dashboard.colorHex")}</Label>
                      <div className="flex gap-2">
                        <Input
                          value={variation.color.hex_code || "#000000"}
                          onChange={e => {
                            const hexValue = e.target.value
                            updateVariation(varIdx, { color: { ...variation.color, hex_code: hexValue } })
                            
                            // Auto-fill color name based on hex value
                            if (hexValue && hexValue.length === 7) {
                              const colorName = getColorNameFromHex(hexValue)
                              if (colorName) {
                                updateVariation(varIdx, { color: { ...variation.color, hex_code: hexValue, name: colorName } })
                              }
                            }
                          }}
                          placeholder="#000000"
                          className="flex-1"
                        />
                        <input
                          type="color"
                          value={variation.color.hex_code || "#000000"}
                          onChange={e => {
                            const hexValue = e.target.value
                            updateVariation(varIdx, { color: { ...variation.color, hex_code: hexValue } })
                            
                            // Auto-fill color name based on hex value
                            const colorName = getColorNameFromHex(hexValue)
                            if (colorName) {
                              updateVariation(varIdx, { color: { ...variation.color, hex_code: hexValue, name: colorName } })
                            }
                          }}
                          className="h-10 w-12 rounded border border-slate-300 cursor-pointer"
                          title={t("dashboard.pickColor")}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startWebPageColorPicker(varIdx)}
                          className="px-3"
                          title={t("dashboard.pickColorFromWebPage")}
                        >
                          🎨
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>{t("dashboard.swatchImage")}</Label>
                      <FileUpload
                        value={variation.color.swatch_image || ""}
                        onChange={(img: string) => updateVariation(varIdx, { color: { ...variation.color, swatch_image: img } })}
                        label={t("dashboard.swatchImage")}
                      />
                    </div>
                    <div>
                      <Label>{t("dashboard.variationPrice")}</Label>
                      <Input
                        type="number"
                        value={variation.price}
                        onChange={e => updateVariation(varIdx, { price: Number(e.target.value) })}
                        placeholder={t("dashboard.variationPrice")}
                      />
                    </div>
                    <div>
                      <Label>{t("dashboard.stockQuantity")}</Label>
                      <Input
                        type="number"
                        value={variation.stockQuantity}
                        onChange={e => updateVariation(varIdx, { stockQuantity: Number(e.target.value) })}
                        placeholder={t("dashboard.stockQuantity")}
                      />
                    </div>
                    <div>
                      <Label>{t("dashboard.inStock")}</Label>
                      <input
                        type="checkbox"
                        checked={variation.inStock}
                        onChange={e => updateVariation(varIdx, { inStock: e.target.checked })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">{t("dashboard.variationImages")}</h5>
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>{t("dashboard.selectAngleToEdit")}</Label>
                        {variation.images && variation.images.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {t("dashboard.imagesConfigured", { count: variation.images.length })}
                          </span>
                        )}
                      </div>
                      <Select
                        value={selectedVariationAngles[variation.id] || "none"}
                        onValueChange={(value) => {
                          if (value === "none") {
                            // Remove the angle selection
                            setSelectedVariationAngles(prev => {
                              const newAngles = { ...prev }
                              delete newAngles[variation.id]
                              return newAngles
                            })
                          } else {
                            // Update the selected angle for this variation
                            setSelectedVariationAngles(prev => ({
                              ...prev,
                              [variation.id]: value
                            }))
                            // Only add image if it doesn't exist for this angle
                            const hasImageForAngle = variation.images.some((img: any) => img.angle === value)
                            if (!hasImageForAngle) {
                              addVariationImage(varIdx, value)
                            }
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("dashboard.selectAngle")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("dashboard.noImages")}</SelectItem>
                          <SelectItem value="front">{t("dashboard.front")}</SelectItem>
                          <SelectItem value="back">{t("dashboard.back")}</SelectItem>
                          <SelectItem value="left">{t("dashboard.left")}</SelectItem>
                          <SelectItem value="right">{t("dashboard.right")}</SelectItem>
                          <SelectItem value="material">{t("dashboard.material")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Show available angles for this variation */}
                      {variation.images && variation.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {defaultAngles.map(angle => {
                            const hasImage = variation.images.some((img: any) => img.angle === angle)
                            return hasImage ? (
                              <Badge key={angle} variant="secondary" className="text-xs">
                                {angle}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {selectedVariationAngles[variation.id] && selectedVariationAngles[variation.id] !== "none" ? (
                        variation.images
                          .filter((img: any) => img.angle === selectedVariationAngles[variation.id])
                          .map((img, imgIdx) => {
                          // Get the actual index in the full images array
                          const actualIdx = variation.images.findIndex((i: any) => i.id === img.id)
                          return (
                        <div key={img.id} className="border rounded-md p-2 bg-slate-50 dark:bg-slate-800/30 relative">
                          <FileUpload
                            value={img.url}
                            onChange={url => updateVariationImage(varIdx, actualIdx, { url })}
                            label={t("dashboard.variationImage")}
                          />
                          <Input
                            value={img.alt_text}
                            onChange={e => updateVariationImage(varIdx, actualIdx, { alt_text: e.target.value })}
                            placeholder={t("dashboard.altText")}
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
                            <span className="text-xs">{t("dashboard.primary")}</span>
                          </div>
                          <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1" onClick={() => removeVariationImage(varIdx, img.id)}>{t("common.remove")}</Button>
                        </div>
                      )
                      })
                      ) : (
                        <div className="col-span-3 text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                          <p className="text-sm">{t("dashboard.selectAngleToAddImages")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Variation-specific Design Frames */}
                  {formik.values.isDesignable && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{t("dashboard.designFramesForVariation")}</h5>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Copy frames from product level to this variation
                              const productFrames = formik.values.designFrames || []
                              if (productFrames.length > 0) {
                                const variationFrames = productFrames.map((frame: any) => ({
                                  ...frame,
                                  id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                  variationId: variation.id
                                }))
                                updateVariation(varIdx, { designFrames: variationFrames })
                              }
                            }}
                          >
                            {t("dashboard.copyFromProduct")}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Copy this variation's frames to all other variations
                              const currentFrames = variation.designFrames || []
                              if (currentFrames.length > 0) {
                                const newVariations = formik.values.variations.map((v: any, idx: number) => {
                                  if (idx === varIdx) return v // Skip current variation
                                  const copiedFrames = currentFrames.map((frame: any) => ({
                                    ...frame,
                                    id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                    variationId: v.id
                                  }))
                                  return { ...v, designFrames: copiedFrames }
                                })
                                formik.setFieldValue("variations", newVariations)
                              }
                            }}
                          >
                            {t("dashboard.copyToAllVariations")}
                          </Button>
                        </div>
                      </div>
                      <DesignFrameEditor
                        productImage={formik.values.image}
                        frontImage={variation.images?.find((img: any) => img.angle === 'front')?.url || formik.values.frontImage || formik.values.image}
                        backImage={variation.images?.find((img: any) => img.angle === 'back')?.url || formik.values.backImage}
                        leftImage={variation.images?.find((img: any) => img.angle === 'left')?.url || formik.values.leftImage}
                        rightImage={variation.images?.find((img: any) => img.angle === 'right')?.url || formik.values.rightImage}
                        frames={variation.designFrames || []}
                        onChange={(frames) => updateVariation(varIdx, { designFrames: frames })}
                        designCostPerCm2={variation.designCostPerCm2 || formik.values.designCostPerCm2}
                        onCostChange={(cost) => updateVariation(varIdx, { designCostPerCm2: cost })}
                        variationId={variation.id}
                        showCostConfig={true}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white shadow-lg" disabled={isSubmitting}>
              {isSubmitting ? t("dashboard.creating") : isEdit ? t("dashboard.updateProduct") : t("dashboard.createProduct")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}