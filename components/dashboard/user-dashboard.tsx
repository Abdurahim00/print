"use client"

import { useState, useEffect, useMemo } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchOrders } from "@/lib/redux/slices/ordersSlice"
import { fetchDesigns, deleteDesign } from "@/lib/redux/slices/designsSlice"
import { toast } from "sonner"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { translations } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Palette, MapPin, Package, Edit3, Copy, Trash2, ArrowUpRight, TrendingUp, ShoppingBag, User } from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

export function UserDashboard({ defaultTab = "orders" }: { defaultTab?: string }) {
  const dispatch = useAppDispatch()
  const { data: session } = useSession() // Get session data
  const { items: orders, loading: ordersLoading } = useAppSelector((state) => state.orders)
  const { items: designs, loading: designsLoading } = useAppSelector((state) => state.designs) // New designs state
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [designToDelete, setDesignToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Handle delete design
  const handleDeleteDesign = async () => {
    if (!designToDelete) return
    
    try {
      setIsDeleting(true)
      const resultAction = await dispatch(deleteDesign(designToDelete) as any)
      
      if (deleteDesign.fulfilled.match(resultAction)) {
        toast.success("Design deleted successfully")
      } else {
        toast.error("Failed to delete design")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setDesignToDelete(null)
    }
  }

  const user = session?.user as any

  // Filter orders for current user
  const userOrders = orders.filter((order) => order.customer === user?.customerNumber)
  // Filter designs by user ID and exclude a specific unwanted id
  const userDesigns = designs
    .filter((design) => design.userId === (user as any)?.id)
    .filter((design) => design.id !== "689784db262033d62185e0bc")

  // Use document visibility API to prevent unnecessary API calls
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [lastFetch, setLastFetch] = useState(0);
  const REFRESH_THRESHOLD = 300000; // 5 minutes in milliseconds

  // Only fetch on mount, visibility change, and user change - with time threshold
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isNowVisible = !document.hidden;
      setIsVisible(isNowVisible);
      
      // Only refetch if becoming visible AND the threshold time has passed
      if (isNowVisible && Date.now() - lastFetch > REFRESH_THRESHOLD) {
        if (user?.customerNumber) {
          dispatch(fetchOrders());
        }
        if ((user as any)?.id) {
          dispatch(fetchDesigns((user as any).id));
        }
        setLastFetch(Date.now());
      }
    };

    // Initial fetch when component mounts
    if (lastFetch === 0) {
      if (user?.customerNumber) {
        dispatch(fetchOrders());
      }
      if ((user as any)?.id) {
        dispatch(fetchDesigns((user as any).id));
      }
      setLastFetch(Date.now());
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, user, lastFetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white"
      case "Shipped":
        return "bg-gradient-to-r from-green-500 to-yellow-500 text-white"
      case "In Production":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Printing":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getDesignStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white"
      case "Draft":
        return "bg-yellow-500 text-white"
      case "In Review":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const OrderHistorySkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700 ml-auto" />
              <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const DesignsSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
          <Skeleton className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
              <Skeleton className="h-9 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Calculate stats
  const totalSpent = useMemo(() => 
    userOrders.reduce((sum, order) => sum + order.total, 0),
    [userOrders]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-12 px-4 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-wider mb-2">
                {t.clientDashboard || "Client Dashboard"}
              </h1>
              <p className="text-lg opacity-90">
                {t.customerNumber || "Customer Number"}: 
                <span className="font-mono font-bold ml-2 text-xl text-black dark:text-white">
                  {user?.customerNumber}
                </span>
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-sm opacity-80">{t.totalOrders || "Total Orders"}</span>
                </div>
                <div className="text-3xl font-black">{userOrders.length}</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm opacity-80">{t.savedDesigns || "Saved Designs"}</span>
                </div>
                <div className="text-3xl font-black">{userDesigns.length}</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm opacity-80">Total Spent</span>
                </div>
                <div className="text-2xl font-black">
                  {totalSpent.toLocaleString()} SEK
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pb-8">

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-xl p-1">
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 py-3 font-bold uppercase data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-lg transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>{t.orderHistory || "Order History"}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="designs" 
              className="flex items-center gap-2 py-3 font-bold uppercase data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-lg transition-all"
            >
              <Palette className="h-4 w-4" />
              <span>{t.savedDesigns || "Saved Designs"}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 py-3 font-bold uppercase data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black rounded-lg transition-all"
            >
              <User className="h-4 w-4" />
              <span>{t.profile || "Profile"}</span>
            </TabsTrigger>
          </TabsList>
        

          {/* Order History Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b-2 border-black dark:border-white bg-black dark:bg-white p-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white text-2xl font-black uppercase">
                    <FileText className="h-6 w-6" />
                    {t.orderHistory || "Order History"}
                  </div>
                  <Badge className="bg-white/20 text-white border-2 border-white px-3 py-1 font-bold">
                    {userOrders.length} Orders
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {ordersLoading ? (
                  <OrderHistorySkeleton />
                ) : userOrders.length > 0 ? (
                  <div className="space-y-3">
                    {userOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-lg">{order.id}</span>
                              <Badge className={`${getStatusColor(order.status)} font-bold px-3 py-1 rounded-full text-xs`}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-black dark:text-white">
                              {order.total.toLocaleString()}
                            </p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View Details <ArrowUpRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-black uppercase mb-2">{t.noOrdersYet || "No Orders Yet"}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{t.startShopping || "Start shopping to see your orders here"}</p>
                    <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase px-6 py-3">
                      <a href="/products">{t.browseProducts || "Browse Products"}</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Designs Tab */}
          <TabsContent value="designs" className="mt-6">
            <Card className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b-2 border-black dark:border-white bg-black dark:bg-white p-6">
                <CardTitle className="flex items-center gap-2 text-white text-2xl font-black uppercase">
                  <Palette className="h-6 w-6" />
                  {t.savedDesigns || "Saved Designs"}
                </CardTitle>
                <Button 
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-black font-bold uppercase transition-all"
                  onClick={() => window.location.href = '/design-tool'}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  {t.createNewDesign || "Create New"}
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {designsLoading ? (
                  <DesignsSkeleton />
                ) : userDesigns.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userDesigns.map((design, index) => (
                      <motion.div
                        key={design.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <Card className="overflow-hidden border-2 border-black dark:border-white rounded-xl hover:scale-105 transition-all bg-white dark:bg-gray-900">
                          <div className="relative">
                            <Image
                              src={design.preview || "/placeholder.svg"}
                              alt={design.name}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover"
                              priority
                            />
                            <Badge className={`absolute top-3 right-3 ${getDesignStatusColor(design.status)} font-bold px-3 py-1 rounded-full text-xs z-20`}>
                              {design.status}
                            </Badge>
                          </div>
                          <CardContent className="p-4 border-t-2 border-black dark:border-white">
                            <h3 className="font-black text-lg uppercase mb-1">{design.name}</h3>
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">{design.type}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                              {t.modified || "Modified"}: {new Date((design as any).updatedAt || (design as any).createdAt || Date.now()).toLocaleDateString()}
                            </p>
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase text-xs"
                                  onClick={() => window.location.href = `/design-tool?designId=${design.id}`}
                                >
                                  <Edit3 className="h-3 w-3 mr-1" /> {t.edit || "Edit"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold uppercase text-xs"
                                  onClick={() => {
                                    setDesignToDelete(design.id)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" /> {t.delete || "Delete"}
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-black dark:bg-white text-white hover:opacity-90 font-bold uppercase text-xs"
                                onClick={async () => {
                                  try {
                                    const { store } = await import("@/lib/redux/store")
                                    const state: any = store.getState()
                                    const userId = (state.auth?.user as any)?.id
                                    const categoryId = design?.designData?.product?.categoryId || design?.designData?.categoryId
                                    if (!userId || !categoryId) {
                                      toast.error("Cannot preview design")
                                      return
                                    }
                                    const { setAppliedCategoryDesign } = await import("@/lib/redux/slices/appSlice")
                                    await store.dispatch(setAppliedCategoryDesign({ categoryId, designId: design.id }))
                                    toast.success("Design applied to products")
                                    window.location.href = '/products'
                                  } catch (e) {
                                    toast.error("Failed to apply design")
                                  }
                                }}
                              >
                                Preview on Products
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Palette className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-black uppercase mb-2">{t.noDesignsFound || "No Designs Yet"}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{t.startDesigningNow || "Start creating your custom designs"}</p>
                    <Button 
                      className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase px-6 py-3"
                      onClick={() => window.location.href = '/design-tool'}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      {t.createNewDesign || "Create Design"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile & Billing Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b-2 border-black dark:border-white bg-black dark:bg-white p-6">
                <CardTitle className="flex items-center gap-2 text-white text-2xl font-black uppercase">
                  <User className="h-6 w-6" />
                  {t.billingShippingInfo || "Profile & Billing"}
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t.fullName}</Label>
                  <Input id="fullName" defaultValue={user?.fullName || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input id="phone" defaultValue={user?.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t.address}</Label>
                <Input id="address" defaultValue={user?.address || ""} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t.city}</Label>
                  <Input id="city" defaultValue={user?.city || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">{t.postalCode}</Label>
                  <Input id="postalCode" defaultValue={user?.postalCode || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t.country}</Label>
                  <Input id="country" defaultValue={user?.country || ""} />
                </div>
              </div>
              <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase px-6 py-3">
                {t.saveChanges || "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your design.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteDesign()
              }}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
