"use client"

import { useState, useEffect, useMemo } from "react"
import * as Yup from "yup"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { useTranslations } from "next-intl"
import { fetchProducts, createProduct, updateProduct, deleteProduct, clearProductCache } from "@/lib/redux/slices/productsSlice"
import { fetchUsers, updateUser, deleteUser } from "@/lib/redux/slices/usersSlice"
import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate } from "@/lib/redux/slices/templatesSlice"
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/redux/slices/couponsSlice"
import { translations, productCategories } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  Users, 
  Package, 
  Plus, 
  Search, 
  ImageIcon,
  Ticket,
  BarChart3,
  FolderTree,
  Shield,
  LogOut,
  User,
  Settings
} from "lucide-react"
import { toast } from "sonner"
import type { Product, User as UserType, Template, Coupon } from "@/types"
import type { FormikHelpers } from "formik"
import type { CreateTemplateData, CreateCouponData, UpdateCouponData, Category, Subcategory } from "@/types"
import { fetchCategories, fetchSubcategories, deleteCategory as deleteCategoryThunk, deleteSubcategory as deleteSubcategoryThunk, createCategory as createCategoryThunk, updateCategory as updateCategoryThunk, createSubcategory as createSubcategoryThunk, updateSubcategory as updateSubcategoryThunk } from "@/lib/redux/slices/categoriesSlice"

// Import table components
import { UserTable } from "./common/UserTable"
import { ProductTable } from "./common/ProductTable"
import { TemplateTable } from "./common/TemplateTable"
import { CouponTable } from "./common/CouponTable"
import { CategoryTable } from "./common/CategoryTable"
import { SubcategoryTable } from "./common/SubcategoryTable"
import { CategoryFormDialog } from "./common/CategoryFormDialog"
import { SubcategoryFormDialog } from "./common/SubcategoryFormDialog"
import { SiteConfigPanel } from "./common/SiteConfigPanel"

// Import form dialog components  
import dynamic from "next/dynamic"
import { UserFormDialog } from "./common/UserFormDialog"
import { TemplateFormDialog } from "./common/TemplateFormDialog"
import { CouponFormDialog } from "./common/CouponFormDialog"

// Dynamically import ProductFormDialog to avoid SSR issues
const ProductFormDialog = dynamic(
  () => import("./common/ProductFormDialog").then(mod => mod.ProductFormDialog),
  { ssr: false }
)

type AdminPage = "users" | "products" | "templates" | "coupons" | "categories" | "subcategories" | "analytics" | "site-config"

interface AdminDashboardNewProps {
  onLogout?: () => void
}

export function AdminDashboardNew({ onLogout }: AdminDashboardNewProps) {
  const dispatch = useAppDispatch()
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products)
  const { items: users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { items: templates, loading: templatesLoading } = useAppSelector((state) => state.templatesManagement)
  const { items: coupons, loading: couponsLoading } = useAppSelector((state) => state.coupons)
  const { categories, subcategories } = useAppSelector((state) => (state as any).categories)
  const t = useTranslations()

  const [activePage, setActivePage] = useState<AdminPage>("users")
  
  // State for all dialogs
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  
  const [isAddTemplateDialogOpen, setIsAddTemplateDialogOpen] = useState(false)
  const [isEditTemplateDialogOpen, setIsEditTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  
  const [isAddCouponDialogOpen, setIsAddCouponDialogOpen] = useState(false)
  const [isEditCouponDialogOpen, setIsEditCouponDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const newCouponInitial = useMemo(() => ({} as Partial<Coupon>), [])

  // Search and filter states
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [globalProductSearch, setGlobalProductSearch] = useState("")
  const [selectedProductCategory, setSelectedProductCategory] = useState("all")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [selectedUserRole, setSelectedUserRole] = useState("all")
  const [templateSearchTerm, setTemplateSearchTerm] = useState("")
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("all")
  const [couponSearchTerm, setCouponSearchTerm] = useState("")
  const [showDesignableOnly, setShowDesignableOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(100) // Start with 100 per page
  const [totalProducts, setTotalProducts] = useState(43149)

  useEffect(() => {
    // Fetch products with proper pagination to avoid memory issues
    dispatch(fetchProducts({ 
      page: currentPage, 
      limit: productsPerPage
    }))
    dispatch(fetchUsers())
    dispatch(fetchTemplates())
    dispatch(fetchCoupons())
    dispatch(fetchCategories())
    dispatch(fetchSubcategories())
  }, [dispatch, currentPage, productsPerPage])

  // Menu items for sidebar (Analytics on top as requested)
  const menuItems = [
    {
      id: "analytics" as AdminPage,
      label: t("dashboard.analytics"),
      icon: BarChart3,
      count: null,
    },
    {
      id: "site-config" as AdminPage,
      label: t("dashboard.siteConfiguration"),
      icon: Settings,
      count: null,
    },
    {
      id: "users" as AdminPage,
      label: t("dashboard.manageUsers"),
      icon: Users,
      count: users.length,
    },
    {
      id: "products" as AdminPage,
      label: t("dashboard.manageProducts"),
      icon: Package,
      count: products.length,
    },
    {
      id: "templates" as AdminPage,
      label: t("dashboard.manageTemplates"),
      icon: ImageIcon,
      count: templates.length,
    },
    {
      id: "coupons" as AdminPage,
      label: t("dashboard.manageCoupons"),
      icon: Ticket,
      count: coupons.length,
    },
    {
      id: "categories" as AdminPage,
      label: t("dashboard.manageCategories"),
      icon: FolderTree,
      count: categories.length,
    },
    {
      id: "subcategories" as AdminPage,
      label: t("dashboard.manageSubcategories"),
      icon: FolderTree,
      count: subcategories.length,
    },
  ]

  // Filter functions
  const filteredProducts = products.filter(
    (product) => {
      const matchesCategory = selectedProductCategory === "all" || product.categoryId === selectedProductCategory
      const matchesSearch = product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                           product.id.toLowerCase().includes(productSearchTerm.toLowerCase())
      const matchesDesignable = !showDesignableOnly || product.isDesignable
      return matchesCategory && matchesSearch && matchesDesignable
    }
  )
  
  // Global product search across all products with debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(globalProductSearch)
    }, 300) // 300ms debounce
    
    return () => clearTimeout(timer)
  }, [globalProductSearch])
  
  const globalSearchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return []
    const searchTerm = debouncedSearchTerm.toLowerCase()
    try {
      return products.filter(product => 
        product?.name?.toLowerCase().includes(searchTerm) ||
        product?.description?.toLowerCase().includes(searchTerm) ||
        product?.id?.toLowerCase().includes(searchTerm) ||
        categories.find((c: any) => c.id === product.categoryId)?.name?.toLowerCase().includes(searchTerm) ||
        subcategories.some((s: any) => 
          product.subcategoryIds?.includes(s.id) && 
          s.name?.toLowerCase().includes(searchTerm)
        )
      ).slice(0, 10) // Limit to 10 results for performance
    } catch (error) {
      console.error("Search error:", error)
      return []
    }
  }, [debouncedSearchTerm, products, categories, subcategories])

  const filteredUsers = users.filter(
    (user) =>
      (selectedUserRole === "all" || user.role === selectedUserRole) &&
      (user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.customerNumber.toLowerCase().includes(userSearchTerm.toLowerCase())),
  )

  const filteredTemplates = templates.filter(
    (template) =>
      (selectedTemplateCategory === "all" || template.category === selectedTemplateCategory) &&
      template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()),
  )

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(couponSearchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(couponSearchTerm.toLowerCase()),
  )

  // Event handlers
  const handleAddProduct = async (
    values: { name: string; price: string; categoryId: string; description: string; image: string },
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    try {
      const productData = {
        ...values,
        price: Number.parseFloat(values.price),
        image: values.image || "/placeholder.svg?height=300&width=400",
        inStock: true,
      }
      await dispatch(createProduct(productData))
      toast.success(t("dashboard.productCreated", { productName: values.name }))
      setIsAddProductDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(t("dashboard.failedToCreateProduct"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProduct = async (
    values: any, // Accept all product fields including variations, angle images, etc.
    { setSubmitting }: FormikHelpers<any>
  ) => {
    if (!editingProduct) return
    try {
      // Ensure price is a number
      const productData = {
        ...editingProduct,
        ...values,
        price: typeof values.price === 'string' ? Number.parseFloat(values.price) : values.price,
      }
      
      // Remove _id field to avoid MongoDB immutable field error
      delete productData._id
      
      console.log('Updating product with data:', productData)
      await dispatch(updateProduct(productData))

      // Clear the product cache to ensure fresh data everywhere
      dispatch(clearProductCache())

      // Refetch products to ensure filters are updated
      // This is especially important for designable status changes
      await dispatch(fetchProducts({ page: 1, limit: 100 }))

      toast.success(t("dashboard.productUpdated", { productName: values.name }))
      setIsEditProductDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Failed to update product:', error)
      toast.error(t("dashboard.failedToUpdateProduct"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = async (
    values: { id: string; email: string; fullName: string; role: "user" | "admin" | "operations"; customerNumber: string },
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      await dispatch(updateUser(values as UserType))
      toast.success(t("dashboard.userUpdated"))
      setIsEditUserDialogOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast.error(t("dashboard.failedToUpdateUser"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleProductStock = async (productId: string, inStock: boolean) => {
    try {
      await dispatch(updateProduct({ id: productId, inStock }))
      // Clear cache to ensure fresh data
      dispatch(clearProductCache())
      // Refetch to update filters
      await dispatch(fetchProducts({ page: 1, limit: 100 }))
      toast.success(inStock ? t("dashboard.productInStock") : t("dashboard.productOutOfStock"))
    } catch (error) {
      toast.error(t("dashboard.failedToUpdateStock"))
    }
  }

  const handleAddTemplate = async (
    values: CreateTemplateData,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    try {
      await dispatch(createTemplate(values))
      toast.success(t("dashboard.templateCreated", { name: values.name }))
      setIsAddTemplateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(t("dashboard.failedToCreateTemplate"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditTemplate = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      await dispatch(updateTemplate(values))
      toast.success(t("dashboard.templateUpdated", { name: values.name }))
      setIsEditTemplateDialogOpen(false)
      setEditingTemplate(null)
    } catch (error) {
      toast.error(t("dashboard.failedToUpdateTemplate"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddCoupon = async (
    values: CreateCouponData,
    { setSubmitting, resetForm }: FormikHelpers<any>
  ) => {
    try {
      await dispatch(createCoupon(values))
      await dispatch(fetchCoupons())
      toast.success(t("dashboard.couponCreated", { code: values.code }))
      setIsAddCouponDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(t("dashboard.failedToCreateCoupon"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCoupon = async (
    values: UpdateCouponData,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      await dispatch(updateCoupon(values))
      toast.success(t("dashboard.couponUpdated", { code: values.code }))
      setIsEditCouponDialogOpen(false)
      setEditingCoupon(null)
    } catch (error) {
      toast.error(t("dashboard.failedToUpdateCoupon"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(t("dashboard.confirmDeleteProduct", { productName: name }))) {
      try {
        await dispatch(deleteProduct(id))
        toast.success(t("dashboard.productDeleted", { productName: name }))
      } catch (error) {
        toast.error(t("dashboard.failedToDeleteProduct"))
      }
    }
  }

  const handleDeleteUser = async (id: string, email: string) => {
    if (confirm(t("dashboard.confirmDeleteUser"))) {
      try {
        await dispatch(deleteUser(id))
        toast.success(t("dashboard.userDeleted"))
      } catch (error) {
        toast.error(t("dashboard.failedToDeleteUser"))
      }
    }
  }

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (confirm(t("dashboard.confirmDeleteTemplate", { name }))) {
      try {
        await dispatch(deleteTemplate(id))
        toast.success(t("dashboard.templateDeleted", { name }))
      } catch (error) {
        toast.error(t("dashboard.failedToDeleteTemplate"))
      }
    }
  }

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (confirm(t("dashboard.confirmDeleteCoupon", { code }))) {
      try {
        await dispatch(deleteCoupon(id))
        toast.success(t("dashboard.couponDeleted", { code }))
      } catch (error) {
        toast.error(t("dashboard.failedToDeleteCoupon"))
      }
    }
  }

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product)
    setIsEditProductDialogOpen(true)
  }

  const openEditUserDialog = (user: UserType) => {
    setEditingUser(user)
    setIsEditUserDialogOpen(true)
  }

  const openEditTemplateDialog = (template: Template) => {
    setEditingTemplate(template)
    setIsEditTemplateDialogOpen(true)
  }

  const openEditCouponDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setIsEditCouponDialogOpen(true)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "operations":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "user":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const renderContent = () => {
    switch (activePage) {
      case "users":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Users className="h-5 w-5 text-black" />
                {t("dashboard.manageUsers")}
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder={t("dashboard.searchUsers")}
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-8 sm:pl-10 border-slate-300 focus:border-black focus:ring-gray-200 text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
                <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                  <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] border-slate-300 focus:border-black focus:ring-gray-200 h-9 sm:h-10 text-sm sm:text-base">
                    <SelectValue placeholder={t("dashboard.filterByRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("dashboard.allRoles")}</SelectItem>
                    <SelectItem value="user">{t("dashboard.userRole")}: {t("dashboard.user")}</SelectItem>
                    <SelectItem value="admin">{t("dashboard.userRole")}: {t("dashboard.admin")}</SelectItem>
                    <SelectItem value="operations">{t("dashboard.userRole")}: {t("dashboard.operations")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <UserTable
                users={filteredUsers.sort((a, b) => a.id.localeCompare(b.id))}
                loading={usersLoading}
                t={{}}
                getRoleColor={getRoleColor}
                onEdit={openEditUserDialog}
                onDelete={handleDeleteUser}
              />
            </CardContent>
          </Card>
        )

      case "products":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Package className="h-5 w-5 text-black" />
                  {t("dashboard.manageProducts")}
                </CardTitle>
                <Button
                  className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsAddProductDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("dashboard.addProduct")}
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {/* Global search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder={t("dashboard.globalProductSearch")}
                    value={globalProductSearch}
                    onChange={(e) => setGlobalProductSearch(e.target.value)}
                    onBlur={() => {
                      // Clear search results after a delay to allow click events
                      setTimeout(() => setGlobalProductSearch(""), 200)
                    }}
                    className="pl-10 pr-4 border-slate-300 focus:border-black focus:ring-gray-200 bg-slate-50"
                  />
                  {globalSearchResults.length > 0 && debouncedSearchTerm && (
                    <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      {globalSearchResults.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0"
                          onMouseDown={(e) => {
                            e.preventDefault() // Prevent blur from firing
                            setProductSearchTerm(product.name)
                            setGlobalProductSearch("")
                            setSelectedProductCategory("all")
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-slate-500">
                                {categories.find((c: any) => c.id === product.categoryId)?.name || "No category"}
                                {product.isDesignable && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">Designable</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Filters row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder={t("dashboard.searchProducts")}
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-black focus:ring-gray-200"
                    />
                  </div>
                  <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
                    <SelectTrigger className="w-full sm:w-[200px] border-slate-300 focus:border-black focus:ring-gray-200">
                      <SelectValue placeholder={t("dashboard.filterByCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("products.allCategories")}</SelectItem>
                      {categories
                        .filter((cat: any) => cat.id && cat.id !== '')
                        .map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="designableOnly"
                      checked={showDesignableOnly}
                      onChange={(e) => setShowDesignableOnly(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="designableOnly" className="text-sm cursor-pointer">
                      {t("dashboard.designableOnly")}
                    </Label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ProductTable
                products={filteredProducts}
                loading={productsLoading}
                t={{}}
                productCategories={productCategories}
                onEdit={openEditProductDialog}
                onDelete={handleDeleteProduct}
                onToggleStock={handleToggleProductStock}
              />
              {/* Pagination Controls */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("dashboard.showingProducts", { 
                        showing: filteredProducts.length, 
                        total: products.length 
                      })}
                      {products.length < 43149 && (
                        <span className="ml-2 text-amber-600">
                          {t("dashboard.totalInDB", { total: "43,149" })}
                        </span>
                      )}
                    </p>
                    <Select value={productsPerPage.toString()} onValueChange={(value) => setProductsPerPage(parseInt(value))}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">{t("dashboard.perPage", { count: 20 })}</SelectItem>
                        <SelectItem value="50">{t("dashboard.perPage", { count: 50 })}</SelectItem>
                        <SelectItem value="100">{t("dashboard.perPage", { count: 100 })}</SelectItem>
                        <SelectItem value="200">{t("dashboard.perPage", { count: 200 })}</SelectItem>
                        <SelectItem value="500">{t("dashboard.perPage", { count: 500 })}</SelectItem>
                        <SelectItem value="1000">{t("dashboard.perPage", { count: 1000 })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      {t("common.previous")}
                    </Button>
                    <span className="text-sm px-3">
                      {t("dashboard.pageOf", { 
                        current: currentPage, 
                        total: Math.ceil(43149 / productsPerPage) 
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(43149 / productsPerPage)}
                    >
                      {t("common.next")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "templates":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <ImageIcon className="h-5 w-5 text-black" />
                  {t("dashboard.manageTemplates")}
                </CardTitle>
                <Button
                  className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsAddTemplateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("dashboard.addTemplate")}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder={t("dashboard.searchTemplates")}
                    value={templateSearchTerm}
                    onChange={(e) => setTemplateSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-black focus:ring-gray-200"
                  />
                </div>
                <Select value={selectedTemplateCategory} onValueChange={setSelectedTemplateCategory}>
                  <SelectTrigger className="w-full sm:w-[200px] border-slate-300 focus:border-black focus:ring-gray-200">
                    <SelectValue placeholder={t("dashboard.filterByCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("products.allCategories")}</SelectItem>
                    <SelectItem value="Business">{t("templates.business")}</SelectItem>
                    <SelectItem value="Abstract">{t("templates.abstract")}</SelectItem>
                    <SelectItem value="Outdoor">{t("templates.outdoor")}</SelectItem>
                    <SelectItem value="Text">{t("templates.text")}</SelectItem>
                    <SelectItem value="Sports">{t("templates.sports")}</SelectItem>
                    <SelectItem value="Music">{t("templates.music")}</SelectItem>
                    <SelectItem value="Art">{t("templates.art")}</SelectItem>
                    <SelectItem value="Technology">{t("templates.technology")}</SelectItem>
                    <SelectItem value="Nature">{t("templates.nature")}</SelectItem>
                    <SelectItem value="Geometric">{t("templates.geometric")}</SelectItem>
                    <SelectItem value="Vintage">{t("templates.vintage")}</SelectItem>
                    <SelectItem value="Modern">{t("templates.modern")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TemplateTable
                templates={filteredTemplates}
                loading={templatesLoading}
                t={{}}
                onEdit={openEditTemplateDialog}
                onDelete={handleDeleteTemplate}
              />
            </CardContent>
          </Card>
        )

      case "coupons":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Ticket className="h-5 w-5 text-black" />
                  {t("dashboard.manageCoupons")}
                </CardTitle>
                <Button
                  className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsAddCouponDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("dashboard.createCoupon")}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder={t("dashboard.searchCoupons")}
                    value={couponSearchTerm}
                    onChange={(e) => setCouponSearchTerm(e.target.value)}
                    className="pl-10 border-slate-300 focus:border-black focus:ring-gray-200"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <CouponTable
                coupons={filteredCoupons}
                loading={couponsLoading}
                t={{}}
                onEdit={openEditCouponDialog}
                onDelete={handleDeleteCoupon}
              />
            </CardContent>
          </Card>
        )

      case "categories":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <FolderTree className="h-5 w-5 text-black" />
                  {t("dashboard.manageCategories")}
                </CardTitle>
                <Button onClick={() => { setIsAddCategoryOpen(true); setEditingCategory(null) }} className="bg-gradient-to-r from-black to-gray-800 text-white">
                  <Plus className="h-4 w-4 mr-2" /> {t("dashboard.addCategory")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CategoryTable
                items={categories}
                loading={false}
                onEdit={(c) => { setEditingCategory(c); setIsEditCategoryOpen(true) }}
                onDelete={async (id) => {
                  if (confirm(t("dashboard.confirmDeleteCategory"))) {
                    await dispatch(deleteCategoryThunk(id) as any)
                    dispatch(fetchCategories())
                    dispatch(fetchSubcategories())
                  }
                }}
              />
            </CardContent>
          </Card>
        )

      case "subcategories":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <FolderTree className="h-5 w-5 text-black" />
                  {t("dashboard.manageSubcategories")}
                </CardTitle>
                <Button onClick={() => { setIsAddSubcategoryOpen(true); setEditingSubcategory(null) }} className="bg-gradient-to-r from-black to-gray-800 text-white">
                  <Plus className="h-4 w-4 mr-2" /> {t("dashboard.addSubcategory")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <SubcategoryTable
                items={subcategories}
                categories={categories}
                loading={false}
                onEdit={(s) => { setEditingSubcategory(s); setIsEditSubcategoryOpen(true) }}
                onDelete={async (id) => {
                  if (confirm(t("dashboard.confirmDeleteSubcategory"))) {
                    await dispatch(deleteSubcategoryThunk(id) as any)
                    dispatch(fetchSubcategories())
                  }
                }}
              />
            </CardContent>
          </Card>
        )

      case "site-config":
        return <SiteConfigPanel />
      
      case "analytics":
        return (
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <BarChart3 className="h-5 w-5 text-black" />
                {t("dashboard.analyticsReports")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t("dashboard.totalUsers")}</p>
                      <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <Users className="h-10 w-10 text-black" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">{t("dashboard.totalProducts")}</p>
                      <p className="text-3xl font-bold text-green-900">{products.length}</p>
                    </div>
                    <Package className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t("dashboard.totalTemplates")}</p>
                      <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
                    </div>
                    <ImageIcon className="h-10 w-10 text-black" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">{t("dashboard.totalCoupons")}</p>
                      <p className="text-3xl font-bold text-orange-900">{coupons.length}</p>
                    </div>
                    <Ticket className="h-10 w-10 text-orange-600" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  {t("dashboard.moreAnalyticsSoon")}
                </p>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-900">
        <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
          <SidebarHeader className="border-b border-slate-200 dark:border-slate-800 p-4 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950/30">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-black" />
              <div className="flex flex-col">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{t("dashboard.adminPanel")}</h2>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t("dashboard.managementDashboard")}</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sm sm:text-base font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-3">
                {t("dashboard.management")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activePage === item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`w-full justify-between rounded-md transition-colors duration-150 ${
                          activePage === item.id
                            ? "bg-gray-900 text-white"
                            : "hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== null && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.count}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-black dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{t("dashboard.adminUser")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t("dashboard.administrator")}</p>
              </div>
              {onLogout && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1 overflow-x-hidden [--scrollbar-size:0px]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-slate-900">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              {(() => {
                const active = menuItems.find((item) => item.id === activePage)
                if (!active) return null
                const ActiveIcon = active.icon
                return (
                  <>
                    <ActiveIcon className="h-5 w-5 text-black" />
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{active.label}</h1>
                  </>
                )
              })()}
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>

      {/* All Dialog Components */}
      <ProductFormDialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
        initialValues={{ name: "", price: "", categoryId: "", description: "", image: "" }}
        onSubmit={handleAddProduct}
        t={{}}
        productCategories={categories}
        isSubmitting={false}
        isEdit={false}
      />

      <ProductFormDialog
        open={isEditProductDialogOpen}
        onOpenChange={setIsEditProductDialogOpen}
        initialValues={editingProduct || { name: "", price: "", categoryId: "", description: "", image: "" }}
        onSubmit={handleEditProduct}
        t={{}}
        productCategories={categories}
        isSubmitting={false}
        isEdit={true}
      />

      <UserFormDialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
        initialValues={editingUser || { id: "", email: "", fullName: "", role: "user", customerNumber: "" }}
        onSubmit={handleEditUser}
        t={{}}
        isSubmitting={false}
      />

      <TemplateFormDialog
        open={isAddTemplateDialogOpen}
        onOpenChange={setIsAddTemplateDialogOpen}
        initialValues={{ name: "", category: "", image: "", price: "free" }}
        onSubmit={handleAddTemplate}
        t={{}}
        isSubmitting={false}
        isEdit={false}
      />

      <TemplateFormDialog
        open={isEditTemplateDialogOpen}
        onOpenChange={setIsEditTemplateDialogOpen}
        initialValues={editingTemplate || { name: "", category: "", image: "", price: "free" }}
        onSubmit={handleEditTemplate}
        t={{}}
        isSubmitting={false}
        isEdit={true}
      />

      <CouponFormDialog
        key={isAddCouponDialogOpen ? 'create-coupon' : 'create-coupon-closed'}
        open={isAddCouponDialogOpen}
        onOpenChange={setIsAddCouponDialogOpen}
        initialValues={newCouponInitial}
        onSubmit={(v: any, helpers: any) => handleAddCoupon(v as CreateCouponData, helpers)}
        t={{}}
        isSubmitting={false}
        isEdit={false}
      />

      <CouponFormDialog
        key={editingCoupon?.id || 'edit-coupon'}
        open={isEditCouponDialogOpen}
        onOpenChange={setIsEditCouponDialogOpen}
        initialValues={editingCoupon || {}}
        onSubmit={(v: any, helpers: any) => handleEditCoupon(v as UpdateCouponData, helpers)}
        t={{}}
        isSubmitting={false}
        isEdit={true}
      />

      {/* Category Dialogs */}
      <CategoryFormDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        initialValues={{}}
        onSubmit={async (values) => {
          await dispatch(createCategoryThunk(values as any) as any)
          setIsAddCategoryOpen(false)
          dispatch(fetchCategories())
        }}
      />
      <CategoryFormDialog
        open={isEditCategoryOpen}
        onOpenChange={setIsEditCategoryOpen}
        initialValues={editingCategory || {}}
        onSubmit={async (values) => {
          await dispatch(updateCategoryThunk({ id: editingCategory!.id, ...values } as any) as any)
          setIsEditCategoryOpen(false)
          setEditingCategory(null)
          dispatch(fetchCategories())
        }}
        isEdit
      />

      {/* Subcategory Dialogs */}
      <SubcategoryFormDialog
        open={isAddSubcategoryOpen}
        onOpenChange={setIsAddSubcategoryOpen}
        initialValues={{}}
        categories={categories}
        onSubmit={async (values) => {
          await dispatch(createSubcategoryThunk(values as any) as any)
          setIsAddSubcategoryOpen(false)
          dispatch(fetchSubcategories())
        }}
      />
      <SubcategoryFormDialog
        open={isEditSubcategoryOpen}
        onOpenChange={setIsEditSubcategoryOpen}
        initialValues={editingSubcategory || {}}
        categories={categories}
        onSubmit={async (values) => {
          await dispatch(updateSubcategoryThunk({ id: editingSubcategory!.id, ...values } as any) as any)
          setIsEditSubcategoryOpen(false)
          setEditingSubcategory(null)
          dispatch(fetchSubcategories())
        }}
        isEdit
      />
    </SidebarProvider>
  )
}
