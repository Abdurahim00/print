"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchOrders } from "@/lib/redux/slices/ordersSlice"
import { fetchDesigns } from "@/lib/redux/slices/designsSlice" // New import
import { translations } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Palette, MapPin, Package, Edit3, Copy, Trash2 } from "lucide-react" // Added Edit3, Copy, Trash2
import Image from "next/image"
import { useSession } from "next-auth/react" // Import useSession

export function UserDashboard() {
  const dispatch = useAppDispatch()
  const { data: session } = useSession() // Get session data
  const { items: orders, loading: ordersLoading } = useAppSelector((state) => state.orders)
  const { items: designs, loading: designsLoading } = useAppSelector((state) => state.designs) // New designs state
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  const user = session?.user

  // Filter orders for current user
  const userOrders = orders.filter((order) => order.customer === user?.customerNumber)
  const userDesigns = designs.filter((design) => design.userId === user?.id) // Filter designs by user ID

  useEffect(() => {
    if (user?.customerNumber) {
      dispatch(fetchOrders())
    }
    if (user?.id) {
      dispatch(fetchDesigns(user.id)) // Fetch designs for the current user
    }
  }, [dispatch, user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "In Production":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Printing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDesignStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "In Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const OrderHistorySkeleton = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Order ID</TableHead>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const DesignsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="w-full h-32" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-100">
                {t.welcomeBackUser.replace("{name}", user?.fullName || user?.email || "")}
              </h2>
              <p className="text-sky-700 dark:text-sky-300 mt-1">
                {t.customerNumber}: <span className="font-mono font-semibold">{user?.customerNumber}</span>
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-sky-600 dark:text-sky-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-900 dark:text-sky-100">{userOrders.length}</div>
                <div>{t.totalOrders}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sky-900 dark:text-sky-100">{userDesigns.length}</div>
                <div>{t.savedDesigns}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
          <TabsTrigger value="orders" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t.orderHistory}</span>
            <span className="sm:hidden">{t.orders}</span>
          </TabsTrigger>
          <TabsTrigger value="designs" className="flex items-center gap-2 py-3">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">{t.savedDesigns}</span>
            <span className="sm:hidden">{t.designs}</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{t.billingShippingInfo}</span>
            <span className="sm:hidden">{t.profile}</span>
          </TabsTrigger>
        </TabsList>

        {/* Order History Tab */}
        <TabsContent value="orders" className="mt-6">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <FileText className="h-5 w-5 text-sky-600" />
                {t.orderHistory}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="p-6">
                  <OrderHistorySkeleton />
                </div>
              ) : userOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                          {t.orderId}
                        </TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                          {t.date}
                        </TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                          {t.status}
                        </TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                          {t.total}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order, index) => (
                        <TableRow
                          key={order.id}
                          className={`border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                            index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/20"
                          }`}
                        >
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100">{order.id}</TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{order.date}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} font-medium`}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                            {order.total.toLocaleString()} SEK
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.noOrdersYet}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">{t.startShopping}</p>
                  <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                    <a href="/products">{t.browseProducts}</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Designs Tab */}
        <TabsContent value="designs" className="mt-6">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Palette className="h-5 w-5 text-sky-600" />
                {t.savedDesigns}
              </CardTitle>
              <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                <Palette className="h-4 w-4 mr-2" />
                {t.createNewDesign}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {designsLoading ? (
                <DesignsSkeleton />
              ) : userDesigns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userDesigns.map((design) => (
                    <Card
                      key={design.id}
                      className="overflow-hidden hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700"
                    >
                      <div className="relative">
                        <Image
                          src={design.preview || "/placeholder.svg"}
                          alt={design.name}
                          width={300}
                          height={180}
                          className="w-full h-32 object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getDesignStatusColor(design.status)}`}>
                          {t[design.status.toLowerCase() as keyof typeof t] || design.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1 text-slate-900 dark:text-white">{design.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{design.type}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                          {t.modified}: {new Date(design.updatedAt || design.createdAt!).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Edit3 className="h-3 w-3 mr-1" /> {t.edit}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Copy className="h-3 w-3 mr-1" /> {t.duplicate}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600 border-red-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> {t.delete}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Palette className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.noDesignsFound}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">{t.startDesigningNow}</p>
                  <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                    <a href="/design-tool">{t.createNewDesign}</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile & Billing Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <MapPin className="h-5 w-5 text-sky-600" />
                {t.billingShippingInfo}
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
              <Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-md">{t.saveChanges}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
