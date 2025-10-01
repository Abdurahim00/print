"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Plus, X, ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
    productId: string
    order: number
    badge?: string
    badgeColor?: string
  }>
  bestSellers: Array<{
    productId: string
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

export default function AdminPage() {
  const [config, setConfig] = useState<SiteConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("hero")

  useEffect(() => {
    fetchConfiguration()
    fetchProducts()
    fetchUsers()
  }, [])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch("/api/admin/site-configuration?configKey=homepage")
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error("Error fetching configuration:", error)
      toast.error("Failed to load configuration")
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      })

      if (response.ok) {
        toast.success("User role updated successfully")
        fetchUsers()
      } else {
        toast.error("Failed to update user role")
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  const saveConfiguration = async () => {
    if (!config) return
    
    setSaving(true)
    try {
      const response = await fetch("/api/admin/site-configuration", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, configKey: "homepage" })
      })
      
      if (response.ok) {
        toast.success("Configuration saved successfully")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast.error("Failed to save configuration")
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="container mx-auto p-8">
        <p>Failed to load configuration</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
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
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>Select and order featured products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.featuredProducts.map((fp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Product {index + 1}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFeaturedProduct(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFeaturedProduct(index, "down")}
                        disabled={index === config.featuredProducts.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeaturedProduct(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Product</Label>
                      <Select
                        value={fp.productId}
                        onValueChange={(value) => {
                          const newProducts = [...config.featuredProducts]
                          newProducts[index].productId = value
                          setConfig({ ...config, featuredProducts: newProducts })
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
                    <div>
                      <Label>Badge Text (Optional)</Label>
                      <Input
                        value={fp.badge || ""}
                        onChange={(e) => {
                          const newProducts = [...config.featuredProducts]
                          newProducts[index].badge = e.target.value
                          setConfig({ ...config, featuredProducts: newProducts })
                        }}
                        placeholder="Best Seller"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Badge Color (Optional)</Label>
                      <Input
                        value={fp.badgeColor || ""}
                        onChange={(e) => {
                          const newProducts = [...config.featuredProducts]
                          newProducts[index].badgeColor = e.target.value
                          setConfig({ ...config, featuredProducts: newProducts })
                        }}
                        placeholder="bg-black text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addFeaturedProduct} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Featured Product
              </Button>
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

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-sm text-slate-500">No users found</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((user: any) => (
                      <div key={user._id || user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{user.name || 'Unnamed User'}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                          <p className="text-xs text-slate-400">ID: {user._id || user.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            value={user.role || 'customer'}
                            onValueChange={(value) => updateUserRole(user._id || user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(user._id || user.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}