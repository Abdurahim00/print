"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "@/lib/redux/slices/productsSlice"
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

  const addProductFormik = useFormik({
    initialValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      image: "",
    },
    validationSchema: productSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const productData = {
          ...values,
          price: Number.parseFloat(values.price),
          image: values.image || "/placeholder.svg?height=300&width=400",
          inStock: true,
        }

        await dispatch(addProduct(productData)).unwrap()
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
    },
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
    onSubmit: async (values, { setSubmitting }) => {
      if (!editingProduct) return

      try {
        const productData = {
          ...editingProduct,
          ...values,
          price: Number.parseFloat(values.price),
        }

        await dispatch(updateProduct(productData)).unwrap()
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
    },
  })

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(t.confirmDeleteProduct.replace("{productName}", name))) {
      try {
        await dispatch(deleteProduct(id)).unwrap()
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
    },
    validationSchema: userSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(updateUser(values as User)).unwrap()
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
    },
  })

  const openEditUserDialog = (user: User) => {
    setEditingUser(user)
    editUserFormik.setValues({
      id: user.id,
      email: user.email,
      fullName: user.fullName || "",
      role: user.role,
    })
    setIsEditUserDialogOpen(true)
  }

  const handleDeleteUser = async (id: string, email: string) => {
    if (confirm(t.confirmDeleteUser)) {
      try {
        await dispatch(deleteUser(id)).unwrap()
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

  const ProductsSkeleton = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead className="min-w-[200px]">Product Name</TableHead>
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="min-w-[100px]">Price</TableHead>
            <TableHead className="min-w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-12 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const UsersSkeleton = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Customer Number</TableHead>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[100px]">Role</TableHead>
            <TableHead className="min-w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

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
                  <SelectItem value="user">
                    {t.userRole}: {t.user}
                  </SelectItem>
                  <SelectItem value="admin">
                    {t.userRole}: {t.admin}
                  </SelectItem>
                  <SelectItem value="operations">
                    {t.userRole}: {t.operations}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="p-6">
                <UsersSkeleton />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableHead className="min-w-[120px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.customerNumber}
                      </TableHead>
                      <TableHead className="min-w-[200px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.email}
                      </TableHead>
                      <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.role}
                      </TableHead>
                      <TableHead className="min-w-[150px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.actions}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={`border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/20"
                        }`}
                      >
                        <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100">
                          {user.customerNumber}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={`${getRoleColor(user.role)} font-medium`}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                              className="bg-transparent hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 dark:hover:bg-sky-900/20"
                            >
                              <Edit3 className="mr-1 h-3 w-3" />
                              {t.edit}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="bg-transparent hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600 border-red-200"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              {t.delete}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No users found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {userSearchTerm || selectedUserRole !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No users in the database."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-sky-600" />
                {t.editUser}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={editUserFormik.handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-user-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.email} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-user-email"
                  name="email"
                  type="email"
                  value={editUserFormik.values.email}
                  onChange={editUserFormik.handleChange}
                  onBlur={editUserFormik.handleBlur}
                  placeholder="user@example.com"
                  className={`${
                    editUserFormik.touched.email && editUserFormik.errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                  }`}
                  disabled // Email should not be editable
                />
                {editUserFormik.touched.email && editUserFormik.errors.email && (
                  <p className="text-sm text-red-600">{editUserFormik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-user-fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.fullName} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-user-fullName"
                  name="fullName"
                  value={editUserFormik.values.fullName}
                  onChange={editUserFormik.handleChange}
                  onBlur={editUserFormik.handleBlur}
                  placeholder="Enter full name"
                  className={`${
                    editUserFormik.touched.fullName && editUserFormik.errors.fullName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                  }`}
                />
                {editUserFormik.touched.fullName && editUserFormik.errors.fullName && (
                  <p className="text-sm text-red-600">{editUserFormik.errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-user-role" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.role} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={editUserFormik.values.role}
                  onValueChange={(value) => editUserFormik.setFieldValue("role", value)}
                >
                  <SelectTrigger
                    className={`${
                      editUserFormik.touched.role && editUserFormik.errors.role
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                    }`}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{t.user}</SelectItem>
                    <SelectItem value="admin">{t.admin}</SelectItem>
                    <SelectItem value="operations">{t.operations}</SelectItem>
                  </SelectContent>
                </Select>
                {editUserFormik.touched.role && editUserFormik.errors.role && (
                  <p className="text-sm text-red-600">{editUserFormik.errors.role}</p>
                )}
              </div>

              <Separator />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditUserDialogOpen(false)
                    setEditingUser(null)
                  }}
                  className="flex-1 border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg"
                  disabled={editUserFormik.isSubmitting}
                >
                  {editUserFormik.isSubmitting ? t.updating : t.updateUser}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0 shadow-2xl">
                  <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Package className="h-5 w-5 text-sky-600" />
                        {t.addProduct}
                      </DialogTitle>
                    </div>
                  </DialogHeader>

                  <form onSubmit={addProductFormik.handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="add-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t.productName} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="add-name"
                          name="name"
                          value={addProductFormik.values.name}
                          onChange={addProductFormik.handleChange}
                          onBlur={addProductFormik.handleBlur}
                          placeholder={t.enterProductName}
                          className={`${
                            addProductFormik.touched.name && addProductFormik.errors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                          }`}
                        />
                        {addProductFormik.touched.name && addProductFormik.errors.name && (
                          <p className="text-sm text-red-600">
                            {t[addProductFormik.errors.name as keyof typeof t] || addProductFormik.errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="add-price" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t.priceSEK} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="add-price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={addProductFormik.values.price}
                          onChange={addProductFormik.handleChange}
                          onBlur={addProductFormik.handleBlur}
                          placeholder="0.00"
                          className={`${
                            addProductFormik.touched.price && addProductFormik.errors.price
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                          }`}
                        />
                        {addProductFormik.touched.price && addProductFormik.errors.price && (
                          <p className="text-sm text-red-600">
                            {t[addProductFormik.errors.price as keyof typeof t] || addProductFormik.errors.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t.category} <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={addProductFormik.values.categoryId}
                        onValueChange={(value) => addProductFormik.setFieldValue("categoryId", value)}
                      >
                        <SelectTrigger
                          className={`${
                            addProductFormik.touched.categoryId && addProductFormik.errors.categoryId
                              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                              : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                          }`}
                        >
                          <SelectValue placeholder={t.selectCategory} />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories
                            .filter((cat) => cat.id !== "all")
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name(t)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {addProductFormik.touched.categoryId && addProductFormik.errors.categoryId && (
                        <p className="text-sm text-red-600">
                          {t[addProductFormik.errors.categoryId as keyof typeof t] ||
                            addProductFormik.errors.categoryId}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="add-description"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        {t.description}
                      </Label>
                      <Textarea
                        id="add-description"
                        name="description"
                        value={addProductFormik.values.description}
                        onChange={addProductFormik.handleChange}
                        onBlur={addProductFormik.handleBlur}
                        placeholder={t.enterProductDescription}
                        rows={3}
                        className="border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                      />
                    </div>

                    <FileUpload
                      label={t.productImage}
                      value={addProductFormik.values.image}
                      onChange={(value) => addProductFormik.setFieldValue("image", value)}
                      error={
                        addProductFormik.touched.image && addProductFormik.errors.image
                          ? addProductFormik.errors.image
                          : undefined
                      }
                    />

                    <Separator />

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddProductDialogOpen(false)
                          addProductFormik.resetForm()
                        }}
                        className="flex-1 border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {t.cancel}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg"
                        disabled={addProductFormik.isSubmitting}
                      >
                        {addProductFormik.isSubmitting ? t.creating : t.createProduct}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
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
            {productsLoading ? (
              <div className="p-6">
                <ProductsSkeleton />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableHead className="w-[80px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.productImage}
                      </TableHead>
                      <TableHead className="min-w-[200px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.productName}
                      </TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.category}
                      </TableHead>
                      <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.price}
                      </TableHead>
                      <TableHead className="min-w-[150px] font-semibold text-slate-700 dark:text-slate-300">
                        {t.actions}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className={`border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/20"
                        }`}
                      >
                        <TableCell>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">{product.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800"
                          >
                            {productCategories.find((c) => c.id === product.categoryId)?.name(t) || product.categoryId}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                          {product.price.toFixed(2)} SEK
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditProductDialog(product)}
                              className="bg-transparent hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 dark:hover:bg-sky-900/20"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="bg-transparent hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600 border-red-200"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.noProductsYet}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {productSearchTerm || selectedProductCategory !== "all"
                    ? t.adjustSearchFilter
                    : t.getStartedAddProduct}
                </p>
                {!productSearchTerm && selectedProductCategory === "all" && (
                  <Button
                    onClick={() => setIsAddProductDialogOpen(true)}
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.addYourFirstProduct}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-0 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-sky-600" />
                {t.editProduct}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={editProductFormik.handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.productName} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editProductFormik.values.name}
                    onChange={editProductFormik.handleChange}
                    onBlur={editProductFormik.handleBlur}
                    placeholder={t.enterProductName}
                    className={`${
                      editProductFormik.touched.name && editProductFormik.errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                    }`}
                  />
                  {editProductFormik.touched.name && editProductFormik.errors.name && (
                    <p className="text-sm text-red-600">
                      {t[editProductFormik.errors.name as keyof typeof t] || editProductFormik.errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.priceSEK} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProductFormik.values.price}
                    onChange={editProductFormik.handleChange}
                    onBlur={editProductFormik.handleBlur}
                    placeholder="0.00"
                    className={`${
                      editProductFormik.touched.price && editProductFormik.errors.price
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                    }`}
                  />
                  {editProductFormik.touched.price && editProductFormik.errors.price && (
                    <p className="text-sm text-red-600">
                      {t[editProductFormik.errors.price as keyof typeof t] || editProductFormik.errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.category} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={editProductFormik.values.categoryId}
                  onValueChange={(value) => editProductFormik.setFieldValue("categoryId", value)}
                >
                  <SelectTrigger
                    className={`${
                      editProductFormik.touched.categoryId && editProductFormik.errors.categoryId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                    }`}
                  >
                    <SelectValue placeholder={t.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories
                      .filter((cat) => cat.id !== "all")
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name(t)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {editProductFormik.touched.categoryId && editProductFormik.errors.categoryId && (
                  <p className="text-sm text-red-600">
                    {t[editProductFormik.errors.categoryId as keyof typeof t] || editProductFormik.errors.categoryId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.description}
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editProductFormik.values.description}
                  onChange={editProductFormik.handleChange}
                  onBlur={editProductFormik.handleBlur}
                  placeholder={t.enterProductDescription}
                  rows={3}
                  className="border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                />
              </div>

              <FileUpload
                label={t.productImage}
                value={editProductFormik.values.image}
                onChange={(value) => editProductFormik.setFieldValue("image", value)}
                error={
                  editProductFormik.touched.image && editProductFormik.errors.image
                    ? editProductFormik.errors.image
                    : undefined
                }
              />

              <Separator />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditProductDialogOpen(false)
                    setEditingProduct(null)
                  }}
                  className="flex-1 border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg"
                  disabled={editProductFormik.isSubmitting}
                >
                  {editProductFormik.isSubmitting ? t.updating : t.updateProduct}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  )
}
