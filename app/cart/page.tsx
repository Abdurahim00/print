"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { updateQuantity, removeFromCart } from "@/lib/redux/slices/cartSlice"
import { translations } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { items: cart } = useAppSelector((state) => state.cart)
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const vatAmount = subtotal * 0.25
  const cartTotal = subtotal + vatAmount

  const handleUpdateQuantity = (id: string, quantity: number) => {
    // Ensure quantity does not go below 1
    dispatch(updateQuantity({ id, quantity: Math.max(1, quantity) }))
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center min-h-[calc(100vh-250px)]">
        <ShoppingCart className="mx-auto h-20 w-20 text-slate-400 dark:text-slate-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">{t.cart}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">{t.yourCartIsEmpty}</p>
        <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg">
          <Link href="/products">{t.browseProducts}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">{t.cart}</h1>
      <Card className="shadow-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-700/50">
                  <TableHead className="w-2/5 text-slate-700 dark:text-slate-300">{t.products}</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">{t.price}</TableHead>
                  <TableHead className="text-center w-1/5 text-slate-700 dark:text-slate-300">{t.quantity}</TableHead>
                  <TableHead className="text-right text-slate-700 dark:text-slate-300">{t.total}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-800/20"
                    } border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors`}
                  >
                    <TableCell className="font-medium flex items-center gap-3 py-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={60}
                        className="rounded-md object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="text-slate-900 dark:text-white">{item.name}</span>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{item.price.toFixed(2)} SEK</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                          className="w-16 h-9 text-center appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-slate-300 dark:border-slate-600"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-transparent border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                      {(item.price * item.quantity).toFixed(2)} SEK
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div className="w-full sm:w-1/2 md:w-1/3 space-y-3 text-base">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} SEK</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>{t.vat}:</span>
              <span>{vatAmount.toFixed(2)} SEK</span>
            </div>
            <Separator className="bg-slate-300 dark:bg-slate-600" />
            <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white">
              <span>{t.total}:</span>
              <span>{cartTotal.toFixed(2)} SEK</span>
            </div>
          </div>
          <Button size="lg" asChild className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white shadow-lg">
            <Link href="/checkout">
              {t.checkout} <Truck className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
