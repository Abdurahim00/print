"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { createOrder } from "@/lib/redux/slices/ordersSlice"
import { clearCart } from "@/lib/redux/slices/cartSlice"
import { translations } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, CreditCard, Smartphone, ClubIcon as KlarnaIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import StripePaymentModal from "@/components/payment/stripe-payment-modal"

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { items: cart } = useAppSelector((state) => state.cart)
  const { data: session } = useSession()
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingOption, setShippingOption] = useState("standard")
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)

  // Billing/Shipping form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const vatAmount = subtotal * 0.25
  const shippingCost = shippingOption === "express" ? 149 : 79
  const grandTotal = subtotal + vatAmount + shippingCost



// Add this effect:
useEffect(() => {
  if (session?.user) {
    const user = session.user as any;
    if (!fullName && user.fullName) setFullName(user.fullName);
    if (!email && user.email) setEmail(user.email);
    if (!phone && user.phone) setPhone(user.phone);
    if (!address && user.address) setAddress(user.address);
    if (!city && user.city) setCity(user.city);
    if (!postalCode && user.postalCode) setPostalCode(user.postalCode);
    if (!country && user.country) setCountry(user.country);
  }
}, [session, fullName, email, phone, address, city, postalCode, country]);

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add products before checking out.",
        variant: "destructive",
      })
      router.push("/products")
      return
    }

    // Validate required fields
    if (!fullName || !email || !phone || !address || !city || !postalCode || !country) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required billing and shipping information.",
        variant: "destructive",
      })
      return
    }

    const orderData = {
      customer: (session?.user as any)?.customerNumber || "Guest",
      total: grandTotal,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingOption: shippingOption as "standard" | "express",
      paymentMethod: paymentMethod as "card" | "swish" | "klarna",
      status: "Queued" as const, // Default status for new orders
      // Customer information from form
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      customerCity: city,
      customerPostalCode: postalCode,
      customerCountry: country,
    }

    setOrderData(orderData)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setLoading(true)
      
      // Create order with payment information
      const orderWithPayment = {
        ...orderData,
        paymentIntentId,
        status: "Queued" as const,
      }

      await dispatch(createOrder(orderWithPayment)).unwrap()
      dispatch(clearCart())
      
      toast({
        title: "Payment Successful",
        description: "Your order has been placed successfully!",
        variant: "success",
      })

      router.push("/order-confirmation")
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Order Creation Failed",
        description: "Payment was successful but order creation failed. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowPaymentModal(false)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    setShowPaymentModal(false)
  }

  // if (cart.length === 0) {
  //   // Redirect to cart if empty, but only if not already on order-confirmation
  //   if (typeof window !== "undefined" && !window.location.pathname.includes("/order-confirmation")) {
  //     router.push("/cart")
  //   }
  //   return null
  // }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">{t.checkout}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                {t.billingShippingInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-name">{t.fullName}</Label>
                  <Input
                    id="checkout-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullName}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-email">{t.email}</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="checkout-phone">{t.phone}</Label>
                <Input
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+46 70 123 45 67"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="checkout-address">{t.address}</Label>
                <Input
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Storgatan 1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-city">{t.city}</Label>
                  <Input
                    id="checkout-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Stockholm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-postal">{t.postalCode}</Label>
                  <Input
                    id="checkout-postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="111 22"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-country">{t.country}</Label>
                  <Input
                    id="checkout-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Sweden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                {t.shippingOptions}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                <Label
                  htmlFor="std-shipping"
                  className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 dark:has-[:checked]:bg-sky-900/30 cursor-pointer transition-all duration-200"
                >
                  <RadioGroupItem value="standard" id="std-shipping" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">{t.standardShipping}</span>
                    <span className="text-slate-600 dark:text-slate-400 text-sm">79 SEK</span>
                  </div>
                </Label>
                <Label
                  htmlFor="exp-shipping"
                  className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 dark:has-[:checked]:bg-sky-900/30 cursor-pointer transition-all duration-200"
                >
                  <RadioGroupItem value="express" id="exp-shipping" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">{t.expressShipping}</span>
                    <span className="text-slate-600 dark:text-slate-400 text-sm">149 SEK</span>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">{t.orderSummary}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 text-base">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} SEK</span>
                </div>
              ))}
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{t.vat}:</span>
                <span>{vatAmount.toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{t.shipping}:</span>
                <span>{shippingCost.toFixed(2)} SEK</span>
              </div>
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white">
                <span>{t.total}:</span>
                <span>{grandTotal.toFixed(2)} SEK</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">{t.paymentMethod}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-700">
                  <TabsTrigger
                    value="card"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
                  >
                    <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
                    {t.payWithCard}
                  </TabsTrigger>
                  <TabsTrigger
                    value="swish"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
                  >
                    <Smartphone className="h-4 w-4 mr-1 sm:mr-2" />
                    {t.payWithSwish}
                  </TabsTrigger>
                  <TabsTrigger
                    value="klarna"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
                  >
                    <KlarnaIcon className="h-4 w-4 mr-1 sm:mr-2" />
                    {t.payWithKlarna}
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="card"
                  className="mt-4 text-sm text-slate-700 dark:text-slate-300 p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/50"
                >
                  {t.mockCardPayment}
                </TabsContent>
                <TabsContent
                  value="swish"
                  className="mt-4 text-sm text-slate-700 dark:text-slate-300 p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/50"
                >
                  {t.mockSwishInstructions}
                </TabsContent>
                <TabsContent
                  value="klarna"
                  className="mt-4 text-sm text-slate-700 dark:text-slate-300 p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/50"
                >
                  {t.mockKlarnaOptions}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                size="lg"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg"
                onClick={handlePayment}
                disabled={loading}
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                {loading ? t.processing : `${t.payNow} (${grandTotal.toFixed(2)} SEK)`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={grandTotal}
        currency="sek"
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        orderData={orderData}
      />
    </div>
  )
}
