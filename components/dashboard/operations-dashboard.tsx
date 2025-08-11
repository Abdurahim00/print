"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchOrders, updateOrderStatus } from "@/lib/redux/slices/ordersSlice"
import { translations } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { FileArchive, Package, Clock, Printer, Truck, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import type { Order } from "@/types"

export function OperationsDashboard() {
  const dispatch = useAppDispatch()
  const { items: orders, loading } = useAppSelector((state) => state.orders)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  // Use document visibility API to prevent unnecessary API calls
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [lastFetch, setLastFetch] = useState(0);
  const REFRESH_THRESHOLD = 300000; // 5 minutes in milliseconds

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isNowVisible = !document.hidden;
      setIsVisible(isNowVisible);
      
      // Only refetch if becoming visible AND the threshold time has passed
      if (isNowVisible && Date.now() - lastFetch > REFRESH_THRESHOLD) {
        dispatch(fetchOrders());
        setLastFetch(Date.now());
      }
    };

    // Initial fetch when component mounts
    if (lastFetch === 0) {
      dispatch(fetchOrders());
      setLastFetch(Date.now());
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, lastFetch])

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap()
      toast.success(t.orderStatusChanged.replace("{orderId}", orderId).replace("{newStatus}", newStatus))
    } catch (error) {
      toast.error(t.failedToUpdateOrder)
    }
  }

  const handleExportPrintFile = (orderId: string) => {
    toast.success(t.printFilePrepared.replace("{orderId}", orderId))
    // Simulate file download
    setTimeout(() => {
      const link = document.createElement("a")
      link.href = "#"
      link.download = `print-file-${orderId}.pdf`
      link.click()
    }, 1000)
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Queued":
        return <Clock className="h-4 w-4" />
      case "Printing":
        return <Printer className="h-4 w-4" />
      case "In Production":
        return <Package className="h-4 w-4" />
      case "Shipped":
        return <Truck className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Queued":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "Printing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "In Production":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const statusOptions: Order["status"][] = ["Queued", "Printing", "In Production", "Shipped", "Completed"]

  // Calculate stats
  const totalOrders = orders.length
  const queuedOrders = orders.filter((o) => o.status === "Queued").length
  const inProductionOrders = orders.filter((o) => o.status === "In Production" || o.status === "Printing").length
  const completedOrders = orders.filter((o) => o.status === "Completed").length

  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const OrdersSkeleton = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Order ID</TableHead>
            <TableHead className="min-w-[120px]">Customer</TableHead>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[120px]">Status</TableHead>
            <TableHead className="min-w-[150px]">Update Status</TableHead>
            <TableHead className="min-w-[150px]">Export Print File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-32" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Operations Stats */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t.totalOrders}</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{t.inQueue}</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{queuedOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t.inProduction}</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{inProductionOrders}</p>
                </div>
                <Printer className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">{t.completed}</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Orders Queue */}
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Package className="h-5 w-5 text-sky-600" />
            {t.activeOrdersQueue}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <OrdersSkeleton />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.orderId}
                    </TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.customer}
                    </TableHead>
                    <TableHead className="min-w-[100px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.date}
                    </TableHead>
                    <TableHead className="min-w-[120px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.status}
                    </TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.updateStatus}
                    </TableHead>
                    <TableHead className="min-w-[150px] font-semibold text-slate-700 dark:text-slate-300">
                      {t.exportPrintFile}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className={`border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/20"
                      }`}
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">{order.id}</TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">{order.customer}</TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">{order.date}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit font-medium`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value as Order["status"])}
                        >
                          <SelectTrigger className="w-full min-w-[140px] border-slate-300 focus:border-[#634c9e] focus:ring-[#634c9e20]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(status)}
                                  {status}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportPrintFile(order.id)}
                          className="w-full min-w-[140px] bg-transparent hover:bg-[#634c9e15] hover:text-[#634c9e] hover:border-[#634c9e40] dark:hover:bg-[#634c9e30]"
                        >
                          <FileArchive className="mr-2 h-4 w-4" />
                          {t.exportPrintFile}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.noOrdersInQueue}</h3>
              <p className="text-slate-500 dark:text-slate-400">{t.allOrdersProcessed}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
