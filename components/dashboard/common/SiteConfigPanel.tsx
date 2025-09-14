"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Plus, X, ArrowUp, ArrowDown, Loader2, Eye, EyeOff, Package, Layers } from "lucide-react"
import { toast } from "sonner"
import { ProductBrowserModal } from "./ProductBrowserModal"
import { CollectionEditor } from "./CollectionEditor"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { getProductImage } from "@/lib/utils/product-image"
import { useCurrency } from "@/contexts/CurrencyContext"
import { useTranslations } from "next-intl"

interface SiteConfiguration {
  heroHeadline: {
    line1: string
    line2: string
    subtitle: string
  }
  stats: Array<{
    id: string
    value: number
    suffix: string
    label: string
    duration: number
  }>
  features: Array<{
    id: string
    iconType: string
    title: string
    description: string
  }>
  featuredProducts: Array<{
    type?: 'product' | 'collection'
    // For single products
    productId?: string
    badge?: string
    badgeColor?: string
    // For collections
    collectionId?: string
    collectionName?: string
    collectionDescription?: string
    collectionImage?: string
    collectionBadge?: string
    collectionBadgeColor?: string
    products?: Array<{ _id: string; id: string; name: string; price: number; image?: string }>
    order: number
  }>
  bestSellers: Array<{
    productId: string
    order: number
  }>
  customSections: Array<{
    id: string
    title: string
    subtitle: string
    products: Array<{
      productId: string
      order: number
    }>
    enabled: boolean
    order: number
  }>
  ctaSection: {
    headline: string
    subtitle: string
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonLink: string
  }
  bestSellersTitle: string
  bestSellersSubtitle: string
  featuresTitle: string
}

const getDefaultConfig = (): SiteConfiguration => ({
  heroHeadline: {
    line1: "Create Custom",
    line2: "Products",
    subtitle: "Design and print custom t-shirts, business cards, stickers, and more. Professional quality, delivered fast."
  },
  stats: [
    {
      id: "1",
      value: 10000,
      suffix: "+",
      label: "Designs",
      duration: 2
    },
    {
      id: "2",
      value: 500,
      suffix: "+",
      label: "Products",
      duration: 2.5
    },
    {
      id: "3",
      value: 24,
      suffix: "hr",
      label: "Delivery",
      duration: 1.5
    }
  ],
  features: [
    {
      id: "1",
      iconType: "Zap",
      title: "Lightning Fast Design",
      description: "Create stunning designs in minutes with our intuitive design tool"
    },
    {
      id: "2",
      iconType: "Shield",
      title: "Premium Quality",
      description: "High-quality printing on premium materials that last"
    },
    {
      id: "3",
      iconType: "Truck",
      title: "Fast Delivery",
      description: "Get your custom products delivered in 3-5 business days"
    },
    {
      id: "4",
      iconType: "Users",
      title: "24/7 Support",
      description: "Our team is here to help you create the perfect design"
    }
  ],
  featuredProducts: [],
  bestSellers: [],
  customSections: [],
  ctaSection: {
    headline: "Ready to Create Something Amazing?",
    subtitle: "Join thousands of customers who trust us with their custom printing needs",
    primaryButtonText: "Start Your Design",
    primaryButtonLink: "/design-tool",
    secondaryButtonText: "Get Started Free",
    secondaryButtonLink: "/signup"
  },
  bestSellersTitle: "Best Sellers",
  bestSellersSubtitle: "Our most popular products",
  featuresTitle: "Why Choose MR MERCH"
})

export function SiteConfigPanel() {
  const { formatPrice } = useCurrency()
  const t = useTranslations()
  const [config, setConfig] = useState<SiteConfiguration | null>(getDefaultConfig())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("hero")
  const [showProductBrowser, setShowProductBrowser] = useState(false)
  const [showCollectionEditor, setShowCollectionEditor] = useState(false)
  const [editingCollection, setEditingCollection] = useState<any>(null)
  const [browserContext, setBrowserContext] = useState<'featured' | 'bestsellers' | 'section'>('featured')
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)

  useEffect(() => {
    fetchConfiguration()
    fetchProducts()
  }, [])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch("/api/admin/site-configuration?configKey=homepage")
      
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Fetched configuration:", data)
      
      // Ensure we have a valid config structure with all required fields
      if (data && data.heroHeadline) {
        // Ensure arrays exist even if empty
        const validConfig = {
          ...data,
          stats: data.stats || [],
          features: data.features || [],
          featuredProducts: data.featuredProducts || [],
          bestSellers: data.bestSellers || [],
          customSections: data.customSections || [],
        }
        setConfig(validConfig)
        console.log("Configuration loaded successfully")
      } else {
        // Use default configuration if API returns invalid data
        const defaultConfig = getDefaultConfig()
        setConfig(defaultConfig)
        console.log("Using default configuration due to invalid data structure")
      }
    } catch (error) {
      console.error("Error fetching configuration:", error)
      toast.error("Failed to load configuration, using defaults")
      const defaultConfig = getDefaultConfig()
      setConfig(defaultConfig)
      console.log("Using default configuration due to error")
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const saveConfiguration = async () => {
    if (!config) {
      toast.error("No configuration to save")
      return
    }
    
    setSaving(true)
    console.log("Saving configuration:", config)
    
    // Remove fields that shouldn't be updated
    const { id, createdAt, updatedAt, lastModifiedBy, ...configToSave } = config
    
    try {
      const response = await fetch("/api/admin/site-configuration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...configToSave, configKey: "homepage" })
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error("Save failed:", response.status, errorData)
        throw new Error(`Failed to save: ${response.status} ${errorData}`)
      }
      
      const savedData = await response.json()
      console.log("Configuration saved successfully:", savedData)
      
      // Update local state with saved data
      if (savedData && savedData.heroHeadline) {
        const validConfig = {
          ...savedData,
          stats: savedData.stats || [],
          features: savedData.features || [],
          featuredProducts: savedData.featuredProducts || [],
          bestSellers: savedData.bestSellers || [],
          customSections: savedData.customSections || [],
        }
        setConfig(validConfig)
      }
      
      toast.success("Configuration saved successfully!")
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast.error(`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (path: string, value: any) => {
    if (!config) return
    
    const newConfig = { ...config }
    const keys = path.split(".")
    let current: any = newConfig
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setConfig(newConfig)
  }

  const addStat = () => {
    if (!config) return
    const newStat = {
      id: Date.now().toString(),
      value: 0,
      suffix: "",
      label: "",
      duration: 2
    }
    setConfig({ ...config, stats: [...config.stats, newStat] })
  }

  const removeStat = (id: string) => {
    if (!config) return
    setConfig({ 
      ...config, 
      stats: config.stats.filter(stat => stat.id !== id) 
    })
  }

  const addFeature = () => {
    if (!config) return
    const newFeature = {
      id: Date.now().toString(),
      iconType: "Zap",
      title: "",
      description: ""
    }
    setConfig({ ...config, features: [...config.features, newFeature] })
  }

  const removeFeature = (id: string) => {
    if (!config) return
    setConfig({ 
      ...config, 
      features: config.features.filter(feature => feature.id !== id) 
    })
  }

  const addFeaturedProduct = () => {
    if (!config) return
    const newProduct = {
      type: 'product' as const,
      productId: "",
      order: config.featuredProducts.length,
      badge: "",
      badgeColor: ""
    }
    setConfig({
      ...config,
      featuredProducts: [...config.featuredProducts, newProduct]
    })
  }

  const addFeaturedCollection = (collection: any) => {
    if (!config) return
    const newCollection = {
      type: 'collection' as const,
      collectionId: collection.id,
      collectionName: collection.name,
      collectionDescription: collection.description,
      collectionImage: collection.image,
      collectionBadge: collection.badge,
      collectionBadgeColor: collection.badgeColor,
      products: collection.products,
      order: config.featuredProducts.length
    }
    setConfig({
      ...config,
      featuredProducts: [...config.featuredProducts, newCollection]
    })
  }

  const handleProductsSelected = (selectedProducts: any[]) => {
    if (!config) return

    if (browserContext === 'featured') {
      // Add products as individual featured products
      const newFeaturedProducts = selectedProducts.map((product, index) => ({
        type: 'product' as const,
        productId: product._id || product.id,
        order: config.featuredProducts.length + index,
        badge: "",
        badgeColor: ""
      }))
      setConfig({
        ...config,
        featuredProducts: [...config.featuredProducts, ...newFeaturedProducts]
      })
    } else if (browserContext === 'bestsellers') {
      // Add products as best sellers
      const newBestSellers = selectedProducts.map((product, index) => ({
        productId: product._id || product.id,
        order: config.bestSellers.length + index
      }))
      setConfig({
        ...config,
        bestSellers: [...config.bestSellers, ...newBestSellers]
      })
    } else if (browserContext === 'section' && currentSectionId) {
      // Add products to custom section
      const newSections = config.customSections.map(section => {
        if (section.id === currentSectionId) {
          const newProducts = selectedProducts.map((product, index) => ({
            productId: product._id || product.id,
            order: section.products.length + index
          }))
          return {
            ...section,
            products: [...section.products, ...newProducts]
          }
        }
        return section
      })
      setConfig({ ...config, customSections: newSections })
    }
  }

  const removeFeaturedProduct = (index: number) => {
    if (!config) return
    setConfig({ 
      ...config, 
      featuredProducts: config.featuredProducts.filter((_, i) => i !== index) 
    })
  }

  const moveFeaturedProduct = (index: number, direction: "up" | "down") => {
    if (!config) return
    const newProducts = [...config.featuredProducts]
    const newIndex = direction === "up" ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newProducts.length) return
    
    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]]
    newProducts.forEach((p, i) => p.order = i)
    
    setConfig({ ...config, featuredProducts: newProducts })
  }

  const addBestSeller = () => {
    if (!config) return
    const newProduct = {
      productId: "",
      order: config.bestSellers.length
    }
    setConfig({ 
      ...config, 
      bestSellers: [...config.bestSellers, newProduct] 
    })
  }

  const removeBestSeller = (index: number) => {
    if (!config) return
    setConfig({ 
      ...config, 
      bestSellers: config.bestSellers.filter((_, i) => i !== index) 
    })
  }

  const moveBestSeller = (index: number, direction: "up" | "down") => {
    if (!config) return
    const newProducts = [...config.bestSellers]
    const newIndex = direction === "up" ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newProducts.length) return
    
    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]]
    newProducts.forEach((p, i) => p.order = i)
    
    setConfig({ ...config, bestSellers: newProducts })
  }

  // Custom Sections functions
  const addCustomSection = () => {
    if (!config) return
    const newSection = {
      id: Date.now().toString(),
      title: "New Section",
      subtitle: "Section subtitle",
      products: [],
      enabled: true,
      order: config.customSections.length
    }
    setConfig({ ...config, customSections: [...config.customSections, newSection] })
  }

  const removeCustomSection = (id: string) => {
    if (!config) return
    setConfig({ 
      ...config, 
      customSections: config.customSections.filter(section => section.id !== id) 
    })
  }

  const moveCustomSection = (index: number, direction: "up" | "down") => {
    if (!config) return
    const newSections = [...config.customSections]
    const newIndex = direction === "up" ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newSections.length) return
    
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]]
    newSections.forEach((s, i) => s.order = i)
    
    setConfig({ ...config, customSections: newSections })
  }

  const addProductToSection = (sectionId: string) => {
    if (!config) return
    const newSections = config.customSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          products: [...section.products, { productId: "", order: section.products.length }]
        }
      }
      return section
    })
    setConfig({ ...config, customSections: newSections })
  }

  const removeProductFromSection = (sectionId: string, productIndex: number) => {
    if (!config) return
    const newSections = config.customSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          products: section.products.filter((_, i) => i !== productIndex)
        }
      }
      return section
    })
    setConfig({ ...config, customSections: newSections })
  }

  const moveProductInSection = (sectionId: string, productIndex: number, direction: "up" | "down") => {
    if (!config) return
    const newSections = config.customSections.map(section => {
      if (section.id === sectionId) {
        const newProducts = [...section.products]
        const newIndex = direction === "up" ? productIndex - 1 : productIndex + 1
        
        if (newIndex < 0 || newIndex >= newProducts.length) return section
        
        [newProducts[productIndex], newProducts[newIndex]] = [newProducts[newIndex], newProducts[productIndex]]
        newProducts.forEach((p, i) => p.order = i)
        
        return { ...section, products: newProducts }
      }
      return section
    })
    setConfig({ ...config, customSections: newSections })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // This should never happen now, but just in case
  if (!config) {
    setConfig(getDefaultConfig())
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Site Configuration</h2>
          <p className="text-gray-600">Manage homepage content and settings</p>
        </div>
        <Button 
          onClick={saveConfiguration} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="bestsellers">Best Sellers</TabsTrigger>
          <TabsTrigger value="sections">Custom Sections</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Edit the main headline and subtitle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="headline1">Headline Line 1</Label>
                <Input
                  id="headline1"
                  value={config.heroHeadline.line1}
                  onChange={(e) => updateConfig("heroHeadline.line1", e.target.value)}
                  placeholder="Create Custom"
                />
              </div>
              <div>
                <Label htmlFor="headline2">Headline Line 2</Label>
                <Input
                  id="headline2"
                  value={config.heroHeadline.line2}
                  onChange={(e) => updateConfig("heroHeadline.line2", e.target.value)}
                  placeholder="Products"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={config.heroHeadline.subtitle}
                  onChange={(e) => updateConfig("heroHeadline.subtitle", e.target.value)}
                  placeholder="Design and print custom..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Manage homepage statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.stats.map((stat, index) => (
                <div key={stat.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">Stat {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStat(stat.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...config.stats]
                          newStats[index].value = parseInt(e.target.value) || 0
                          setConfig({ ...config, stats: newStats })
                        }}
                      />
                    </div>
                    <div>
                      <Label>Suffix</Label>
                      <Input
                        value={stat.suffix}
                        onChange={(e) => {
                          const newStats = [...config.stats]
                          newStats[index].suffix = e.target.value
                          setConfig({ ...config, stats: newStats })
                        }}
                        placeholder="+"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...config.stats]
                          newStats[index].label = e.target.value
                          setConfig({ ...config, stats: newStats })
                        }}
                        placeholder="Designs"
                      />
                    </div>
                    <div>
                      <Label>Animation Duration (s)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={stat.duration}
                        onChange={(e) => {
                          const newStats = [...config.stats]
                          newStats[index].duration = parseFloat(e.target.value) || 2
                          setConfig({ ...config, stats: newStats })
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addStat} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
              <CardDescription>Manage feature highlights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="featuresTitle">Section Title</Label>
                <Input
                  id="featuresTitle"
                  value={config.featuresTitle}
                  onChange={(e) => updateConfig("featuresTitle", e.target.value)}
                  placeholder="Why Choose MR MERCH"
                />
              </div>
              
              {config.features.map((feature, index) => (
                <div key={feature.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">Feature {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(feature.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Icon Type</Label>
                      <Select
                        value={feature.iconType}
                        onValueChange={(value) => {
                          const newFeatures = [...config.features]
                          newFeatures[index].iconType = value
                          setConfig({ ...config, features: newFeatures })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Zap">Lightning (Zap)</SelectItem>
                          <SelectItem value="Shield">Shield</SelectItem>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Users">Users</SelectItem>
                          <SelectItem value="Star">Star</SelectItem>
                          <SelectItem value="Package">Package</SelectItem>
                          <SelectItem value="Clock">Clock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => {
                          const newFeatures = [...config.features]
                          newFeatures[index].title = e.target.value
                          setConfig({ ...config, features: newFeatures })
                        }}
                        placeholder="Feature Title"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...config.features]
                        newFeatures[index].description = e.target.value
                        setConfig({ ...config, features: newFeatures })
                      }}
                      placeholder="Feature description..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addFeature} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Products & Collections</CardTitle>
              <CardDescription>
                Add individual products or product collections to showcase on the homepage.
                Currently featuring {config.featuredProducts.length} item{config.featuredProducts.length !== 1 ? 's' : ''}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.featuredProducts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">No featured items selected</p>
                  <p className="text-sm text-gray-400">Add products or collections to showcase them on your homepage</p>
                </div>
              ) : (
                config.featuredProducts.map((fp, index) => {
                  const isCollection = fp.type === 'collection'
                  const selectedProduct = !isCollection ? products.find(p => p._id === fp.productId) : null

                  return (
                    <div key={index} className="p-4 border-2 rounded-lg space-y-3 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1">
                          {isCollection ? (
                            <>
                              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md">
                                <Layers className="h-8 w-8 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">Collection</Badge>
                                  <h4 className="font-semibold text-lg">{fp.collectionName || 'Unnamed Collection'}</h4>
                                </div>
                                <p className="text-sm text-gray-500">Position {index + 1}</p>
                                {fp.collectionDescription && (
                                  <p className="text-sm text-gray-600 mt-1">{fp.collectionDescription}</p>
                                )}
                                <p className="text-sm font-medium text-black mt-1">
                                  {fp.products?.length || 0} products in collection
                                </p>
                                {fp.collectionBadge && (
                                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${fp.collectionBadgeColor || 'bg-black text-white'}`}>
                                    {fp.collectionBadge}
                                  </span>
                                )}
                                {/* Show preview of products in collection */}
                                {fp.products && fp.products.length > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {fp.products.slice(0, 4).map((p, idx) => (
                                      <div key={idx} className="w-8 h-8 bg-gray-100 rounded border">
                                        {p.image ? (
                                          <Image
                                            src={getProductImage(p)}
                                            alt=""
                                            width={32}
                                            height={32}
                                            className="object-contain p-0.5"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                            <Package className="h-4 w-4 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {fp.products.length > 4 && (
                                      <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center">
                                        <span className="text-xs font-medium">+{fp.products.length - 4}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : selectedProduct ? (
                            <>
                              {selectedProduct.image && (
                                <img
                                  src={selectedProduct.image}
                                  alt={selectedProduct.name}
                                  className="w-16 h-16 object-cover rounded-md border"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{selectedProduct.name}</h4>
                                <p className="text-sm text-gray-500">Position {index + 1}</p>
                                {selectedProduct.price && (
                                  <p className="text-sm font-medium text-black">{formatPrice(selectedProduct.price)}</p>
                                )}
                                {fp.badge && (
                                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${fp.badgeColor || 'bg-black text-white'}`}>
                                    {fp.badge}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-red-500">Product Not Found</h4>
                              <p className="text-sm text-gray-500">Position {index + 1} - Please select a valid product</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFeaturedProduct(index, "up")}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFeaturedProduct(index, "down")}
                            disabled={index === config.featuredProducts.length - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeaturedProduct(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Edit section - different for collections vs products */}
                      {isCollection ? (
                        <div className="border-t pt-3 space-y-3">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setEditingCollection({
                                id: fp.collectionId,
                                name: fp.collectionName,
                                description: fp.collectionDescription,
                                image: fp.collectionImage,
                                badge: fp.collectionBadge,
                                badgeColor: fp.collectionBadgeColor,
                                products: fp.products || []
                              })
                              setShowCollectionEditor(true)
                            }}
                          >
                            Edit Collection
                          </Button>
                        </div>
                      ) : (
                        <div className="border-t pt-3 space-y-3">
                          <div>
                            <Label>Change Product</Label>
                            <Select
                              value={fp.productId}
                              onValueChange={(value) => {
                                const newProducts = [...config.featuredProducts]
                                newProducts[index].productId = value
                                setConfig({ ...config, featuredProducts: newProducts })
                              }}
                            >
                              <SelectTrigger className="bg-gray-50">
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product._id} value={product._id}>
                                    {product.name} {product.price ? `(${formatPrice(product.price)})` : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Badge Text (Optional)</Label>
                              <Input
                                value={fp.badge || ""}
                                onChange={(e) => {
                                  const newProducts = [...config.featuredProducts]
                                  newProducts[index].badge = e.target.value
                                  setConfig({ ...config, featuredProducts: newProducts })
                                }}
                                placeholder="e.g., Best Seller, New, Sale"
                                className="bg-gray-50"
                              />
                            </div>
                            <div>
                              <Label>Badge Style (Optional)</Label>
                              <Select
                                value={fp.badgeColor || "default"}
                                onValueChange={(value) => {
                                  const newProducts = [...config.featuredProducts]
                                  newProducts[index].badgeColor = value === "default" ? "" : value
                                  setConfig({ ...config, featuredProducts: newProducts })
                                }}
                              >
                                <SelectTrigger className="bg-gray-50">
                                  <SelectValue placeholder="Select badge style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default (Black)</SelectItem>
                                  <SelectItem value="bg-red-500 text-white">Red (Sale)</SelectItem>
                                  <SelectItem value="bg-green-500 text-white">Green (New)</SelectItem>
                                  <SelectItem value="bg-blue-500 text-white">Blue (Popular)</SelectItem>
                                  <SelectItem value="bg-black text-white">Black (Premium)</SelectItem>
                                  <SelectItem value="bg-yellow-400 text-black">Yellow (Hot)</SelectItem>
                                  <SelectItem value="bg-gray-500 text-white">Gray (Limited)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setBrowserContext('featured')
                    setShowProductBrowser(true)
                  }}
                  variant="outline"
                  className="flex-1 border-dashed border-2 hover:border-black hover:bg-gray-50"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Products
                </Button>
                <Button
                  onClick={() => {
                    setEditingCollection(null)
                    setShowCollectionEditor(true)
                  }}
                  variant="outline"
                  className="flex-1 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              </div>
              
              {config.featuredProducts.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Tip:</strong> Featured products appear prominently on your homepage. Choose your best-selling or most visually appealing products to showcase.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bestsellers">
          <Card>
            <CardHeader>
              <CardTitle>Best Sellers</CardTitle>
              <CardDescription>Select and order best selling products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="bestSellersTitle">Section Title</Label>
                  <Input
                    id="bestSellersTitle"
                    value={config.bestSellersTitle}
                    onChange={(e) => updateConfig("bestSellersTitle", e.target.value)}
                    placeholder="Best Sellers"
                  />
                </div>
                <div>
                  <Label htmlFor="bestSellersSubtitle">Section Subtitle</Label>
                  <Input
                    id="bestSellersSubtitle"
                    value={config.bestSellersSubtitle}
                    onChange={(e) => updateConfig("bestSellersSubtitle", e.target.value)}
                    placeholder="Our most popular products"
                  />
                </div>
              </div>
              
              {config.bestSellers.map((bs, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Product {index + 1}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBestSeller(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBestSeller(index, "down")}
                        disabled={index === config.bestSellers.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBestSeller(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Product</Label>
                    <Select
                      value={bs.productId}
                      onValueChange={(value) => {
                        const newProducts = [...config.bestSellers]
                        newProducts[index].productId = value
                        setConfig({ ...config, bestSellers: newProducts })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button onClick={addBestSeller} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Best Seller
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Custom Product Sections</CardTitle>
              <CardDescription>Create additional product showcase sections like Best Sellers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.customSections.map((section, sectionIndex) => (
                <div key={section.id} className="p-4 border-2 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Section {sectionIndex + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newSections = [...config.customSections]
                            newSections[sectionIndex].enabled = !newSections[sectionIndex].enabled
                            setConfig({ ...config, customSections: newSections })
                          }}
                        >
                          {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => {
                              const newSections = [...config.customSections]
                              newSections[sectionIndex].title = e.target.value
                              setConfig({ ...config, customSections: newSections })
                            }}
                            placeholder="Section Title"
                          />
                        </div>
                        <div>
                          <Label>Section Subtitle</Label>
                          <Input
                            value={section.subtitle}
                            onChange={(e) => {
                              const newSections = [...config.customSections]
                              newSections[sectionIndex].subtitle = e.target.value
                              setConfig({ ...config, customSections: newSections })
                            }}
                            placeholder="Section subtitle"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveCustomSection(sectionIndex, "up")}
                        disabled={sectionIndex === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveCustomSection(sectionIndex, "down")}
                        disabled={sectionIndex === config.customSections.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomSection(section.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Products in this section</Label>
                    {section.products.map((product, productIndex) => (
                      <div key={productIndex} className="flex gap-2 items-center">
                        <Select
                          value={product.productId}
                          onValueChange={(value) => {
                            const newSections = [...config.customSections]
                            newSections[sectionIndex].products[productIndex].productId = value
                            setConfig({ ...config, customSections: newSections })
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p._id} value={p._id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProductInSection(section.id, productIndex, "up")}
                          disabled={productIndex === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProductInSection(section.id, productIndex, "down")}
                          disabled={productIndex === section.products.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProductFromSection(section.id, productIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={() => addProductToSection(section.id)} 
                      variant="outline" 
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button onClick={addCustomSection} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>Edit the CTA section content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ctaHeadline">Headline</Label>
                <Input
                  id="ctaHeadline"
                  value={config.ctaSection.headline}
                  onChange={(e) => updateConfig("ctaSection.headline", e.target.value)}
                  placeholder="Ready to Create Something Amazing?"
                />
              </div>
              <div>
                <Label htmlFor="ctaSubtitle">Subtitle</Label>
                <Textarea
                  id="ctaSubtitle"
                  value={config.ctaSection.subtitle}
                  onChange={(e) => updateConfig("ctaSection.subtitle", e.target.value)}
                  placeholder="Join thousands of customers..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                  <Input
                    id="primaryButtonText"
                    value={config.ctaSection.primaryButtonText}
                    onChange={(e) => updateConfig("ctaSection.primaryButtonText", e.target.value)}
                    placeholder="Start Your Design"
                  />
                </div>
                <div>
                  <Label htmlFor="primaryButtonLink">Primary Button Link</Label>
                  <Input
                    id="primaryButtonLink"
                    value={config.ctaSection.primaryButtonLink}
                    onChange={(e) => updateConfig("ctaSection.primaryButtonLink", e.target.value)}
                    placeholder="/design-tool"
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryButtonText">Secondary Button Text</Label>
                  <Input
                    id="secondaryButtonText"
                    value={config.ctaSection.secondaryButtonText}
                    onChange={(e) => updateConfig("ctaSection.secondaryButtonText", e.target.value)}
                    placeholder="Get Started Free"
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryButtonLink">Secondary Button Link</Label>
                  <Input
                    id="secondaryButtonLink"
                    value={config.ctaSection.secondaryButtonLink}
                    onChange={(e) => updateConfig("ctaSection.secondaryButtonLink", e.target.value)}
                    placeholder="/signup"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Browser Modal */}
      <ProductBrowserModal
        open={showProductBrowser}
        onOpenChange={setShowProductBrowser}
        onProductsSelected={handleProductsSelected}
        multiSelect={true}
        title="Select Products"
      />

      {/* Collection Editor Modal */}
      <CollectionEditor
        open={showCollectionEditor}
        onOpenChange={(open) => {
          setShowCollectionEditor(open)
          if (!open) setEditingCollection(null)
        }}
        onSave={(collection) => {
          if (editingCollection) {
            // Update existing collection in featured products
            const newFeaturedProducts = config.featuredProducts.map(fp => {
              if (fp.type === 'collection' && fp.collectionId === collection.id) {
                return {
                  ...fp,
                  collectionName: collection.name,
                  collectionDescription: collection.description,
                  collectionImage: collection.image,
                  collectionBadge: collection.badge,
                  collectionBadgeColor: collection.badgeColor,
                  products: collection.products
                }
              }
              return fp
            })
            setConfig({ ...config, featuredProducts: newFeaturedProducts })
          } else {
            // Add new collection
            addFeaturedCollection(collection)
          }
          setShowCollectionEditor(false)
          setEditingCollection(null)
        }}
        initialCollection={editingCollection}
        allProducts={products}
      />
    </div>
  )
}