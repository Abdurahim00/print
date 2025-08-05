"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/lib/redux/slices/productsSlice"
import { fetchUsers, updateUser, deleteUser } from "@/lib/redux/slices/usersSlice" // New imports for users
import { translations, productCategories } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FileUpload } from "@/components/ui/file-upload"
import { Users, Package, Plus, Edit3, Trash2, Search, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product, User } from "@/types"
import Image from "next/image"
import { ProductAnglesSelector } from "@/components/dashboard/common/ProductAnglesSelector"
import { UserTable } from "./common/UserTable"
import { ProductTable } from "./common/ProductTable"
import { ProductFormDialog } from "./common/ProductFormDialog"
import { UserFormDialog } from "./common/UserFormDialog"
import type { FormikHelpers } from "formik"

const productSchema = Yup.object().shape({
  name: Yup.string().required("productNameRequired").min(2, "nameMinLength"),
  price: Yup.number().required("priceRequired").min(0.01, "priceGreaterThanZero"),
  categoryId: Yup.string().required("categoryRequired"),
  description: Yup.string(),
  image: Yup.string(),
})

const userSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  fullName: Yup.string().required("Full name is required"),
  role: Yup.string().oneOf(["user", "admin", "operations"]).required("Role is required"),
})

export function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products)
  const { items: users, loading: usersLoading } = useAppSelector((state) => state.users) // Get users from Redux
  const { language } = useAppSelector((state) => state.app)
  const { toast } = useToast()
  const t = translations[language]

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [selectedProductCategory, setSelectedProductCategory] = useState("all")

  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false) // New state for user edit dialog
  const [editingUser, setEditingUser] = useState<User | null>(null) // New state for editing user
  const [userSearchTerm, setUserSearchTerm] = useState("") // New state for user search
  const [selectedUserRole, setSelectedUserRole] = useState("all") // New state for user role filter

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchUsers()) // Fetch users on component mount
  }, [dispatch])

  // Filter products based on search and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedProductCategory === "all" || product.categoryId === selectedProductCategory) &&
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  // Filter users based on search and role
  const filteredUsers = users.filter(
    (user) =>
      (selectedUserRole === "all" || user.role === selectedUserRole) &&
      (user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.customerNumber.toLowerCase().includes(userSearchTerm.toLowerCase())),
  )

  // Add these handlers before the formiks
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
      toast({
        title: "Success!",
        description: t.productCreated.replace("{productName}", values.name),
        variant: "success",
      })
      setIsAddProductDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: t.failedToCreateProduct,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditProduct = async (
    values: { name: string; price: string; categoryId: string; description: string; image: string },
    { setSubmitting }: FormikHelpers<any>
  ) => {
    if (!editingProduct) return
    try {
      const productData = {
        ...editingProduct,
        ...values,
        price: Number.parseFloat(values.price),
      }
      await dispatch(updateProduct(productData))
      toast({
        title: "Success!",
        description: t.productUpdated.replace("{productName}", values.name),
        variant: "success",
      })
      setIsEditProductDialogOpen(false)
      setEditingProduct(null)
    } catch (error) {
      toast({
        title: "Error",
        description: t.failedToUpdateProduct,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = async (
    values: { id: string; email: string; fullName: string; role: "user" | "admin" | "operations"; customerNumber: string },
    { setSubmitting }: FormikHelpers<{ id: string; email: string; fullName: string; role: "user" | "admin" | "operations"; customerNumber: string }>
  ) => {
    try {
      await dispatch(updateUser(values as User))
      toast({
        title: "Success!",
        description: t.userUpdated,
        variant: "success",
      })
      setIsEditUserDialogOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: t.failedToUpdateUser,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const addProductFormik = useFormik({
    initialValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      image: "",
    },
    validationSchema: productSchema,
    onSubmit: handleAddProduct,
  })

  const editProductFormik = useFormik({
    initialValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      image: "",
    },
    validationSchema: productSchema,
    onSubmit: handleEditProduct,
  })

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(t.confirmDeleteProduct.replace("{productName}", name))) {
      try {
        await dispatch(deleteProduct(id))
        toast({
          title: "Deleted!",
          description: t.productDeleted.replace("{productName}", name),
          variant: "success",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: t.failedToDeleteProduct,
          variant: "destructive",
        })
      }
    }
  }

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product)
    editProductFormik.setValues({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId,
      description: product.description || "",
      image: product.image,
    })
    setIsEditProductDialogOpen(true)
  }

  const editUserFormik = useFormik({
    initialValues: {
      id: "",
      email: "",
      fullName: "",
      role: "user" as "user" | "admin" | "operations",
      customerNumber: "",
    },
    validationSchema: userSchema,
    onSubmit: handleEditUser,
  })

  const openEditUserDialog = (user: User) => {
    setEditingUser(user)
    editUserFormik.setValues({
      id: user.id,
      email: user.email,
      fullName: user.fullName || "",
      role: user.role,
      customerNumber: user.customerNumber,
    })
    setIsEditUserDialogOpen(true)
  }

  const handleDeleteUser = async (id: string, email: string) => {
    if (confirm(t.confirmDeleteUser)) {
      try {
        await dispatch(deleteUser(id))
        toast({
          title: "Deleted!",
          description: t.userDeleted,
          variant: "success",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: t.failedToDeleteUser,
          variant: "destructive",
        })
      }
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "operations":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-auto">
        <TabsTrigger value="users" className="flex items-center gap-2 py-3">
          <Users className="h-4 w-4" />
          {t.manageUsers}
        </TabsTrigger>
        <TabsTrigger value="products" className="flex items-center gap-2 py-3">
          <Settings className="h-4 w-4" />
          {t.manageProductsPrices}
        </TabsTrigger>
      </TabsList>

      {/* Manage Users Tab */}
      <TabsContent value="users" className="mt-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Users className="h-5 w-5 text-sky-600" />
              {t.manageUsers}
            </CardTitle>
            {/* Search and Filter for Users */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder={t.searchUsers}
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                />
              </div>
              <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                <SelectTrigger className="w-full sm:w-[200px] border-slate-300 focus:border-sky-500 focus:ring-sky-200">
                  <SelectValue placeholder={t.filterByRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allRoles}</SelectItem>
                  <SelectItem value="user">{t.userRole}: {t.user}</SelectItem>
                  <SelectItem value="admin">{t.userRole}: {t.admin}</SelectItem>
                  <SelectItem value="operations">{t.userRole}: {t.operations}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <UserTable
              users={filteredUsers}
              loading={usersLoading}
              t={t}
              getRoleColor={getRoleColor}
              onEdit={openEditUserDialog}
              onDelete={handleDeleteUser}
            />
          </CardContent>
        </Card>
        {/* Edit User Dialog */}
        <UserFormDialog
          open={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          initialValues={editingUser || { id: "", email: "", fullName: "", role: "user", customerNumber: "" }}
          onSubmit={handleEditUser}
          t={t}
          isSubmitting={editUserFormik.isSubmitting}
        />
      </TabsContent>

      {/* Manage Products & Prices Tab */}
      <TabsContent value="products" className="mt-6">
        <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Package className="h-5 w-5 text-sky-600" />
                {t.manageProductsPrices}
              </CardTitle>
              <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => addProductFormik.resetForm()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t.addProduct}
                  </Button>
                </DialogTrigger>
                <ProductFormDialog
                  open={isAddProductDialogOpen}
                  onOpenChange={setIsAddProductDialogOpen}
                  initialValues={addProductFormik.initialValues}
                  onSubmit={handleAddProduct}
                  t={t}
                  productCategories={productCategories}
                  isSubmitting={addProductFormik.isSubmitting}
                  isEdit={false}
                />
              </Dialog>
            </div>
            {/* Search and Filter for Products */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder={t.searchProducts}
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                />
              </div>
              <Select value={selectedProductCategory} onValueChange={setSelectedProductCategory}>
                <SelectTrigger className="w-full sm:w-[200px] border-slate-300 focus:border-sky-500 focus:ring-sky-200">
                  <SelectValue placeholder={t.filterByCategory} />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ProductTable
              products={filteredProducts}
              loading={productsLoading}
              t={t}
              productCategories={productCategories}
              onEdit={openEditProductDialog}
              onDelete={handleDeleteProduct}
            />
          </CardContent>
        </Card>
        {/* Edit Product Dialog */}
        <ProductFormDialog
          open={isEditProductDialogOpen}
          onOpenChange={setIsEditProductDialogOpen}
          initialValues={editingProduct || { name: "", price: "", categoryId: "", description: "", image: "" }}
          onSubmit={handleEditProduct}
          t={t}
          productCategories={productCategories}
          isSubmitting={editProductFormik.isSubmitting}
          isEdit={true}
        />
      </TabsContent>
    </Tabs>
  )
}
