"use client"

import { useState, useEffect, Fragment } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { createOrder } from "@/lib/redux/slices/ordersSlice"
import { clearCart } from "@/lib/redux/slices/cartSlice"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import SwishPaymentModal from "@/components/payment/swish-payment-modal"
import KlarnaPaymentModal from "@/components/payment/klarna-payment-modal"
import Image from "next/image"
import { DesignCanvasRenderer } from "@/components/DesignCanvasRenderer"
import { useCurrency } from "@/contexts/CurrencyContext"

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { items: cart } = useAppSelector((state) => state.cart)
  const { data: session } = useSession()
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const tValidation = useTranslations('validation')
  const { toast } = useToast()
  const { formatPrice, currency } = useCurrency()
  const [isClient, setIsClient] = useState(false)

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

  // Coupon state
  const [couponCode, setCouponCode] = useState("")
  const globalActiveCoupon = useAppSelector((s: any) => s.coupons.activeCoupon)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")

  const subtotal = cart.reduce((total, item) => {
    let itemPrice = 0;
    
    // Handle different price formats
    if (typeof item.price === 'number') {
      itemPrice = item.price;
    } else if (typeof item.price === 'string') {
      // Remove any non-numeric characters except decimal point
      const cleanPrice = item.price.replace(/[^\d.-]/g, '');
      itemPrice = parseFloat(cleanPrice) || 0;
    }
    
    // If we have selectedSizes, calculate from those instead
    if (item.selectedSizes && item.selectedSizes.length > 0) {
      return total + item.selectedSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0);
    }
    
    return total + (itemPrice * item.quantity);
  }, 0)
  
  // Prefer globally active coupon if present; compute discount accordingly
  const percentageDiscount = globalActiveCoupon?.discountType === "percentage" ? globalActiveCoupon.discountValue : 0
  const eligibleSubtotal = cart.reduce((total, item) => {
    const eligible = (item as any).eligibleForCoupons === true
    let pricePerUnit = 0
    if (item.selectedSizes && item.selectedSizes.length > 0) {
      pricePerUnit = item.selectedSizes.reduce((s, sz) => s + (sz.price * sz.quantity), 0) / item.quantity
    } else if (typeof item.price === 'number') {
      pricePerUnit = item.price
    } else if (typeof item.price === 'string') {
      pricePerUnit = parseFloat(item.price.replace(/[^\d.-]/g, '')) || 0
    }
    return total + (eligible ? pricePerUnit * item.quantity : 0)
  }, 0)
  const globalDiscountAmount = (eligibleSubtotal * percentageDiscount) / 100
  const discountAmount = appliedCoupon?.discountAmount || globalDiscountAmount || 0
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const vatAmount = subtotalAfterDiscount * 0.25
  const shippingCost = shippingOption === "express" ? 149 : 79
  const grandTotal = subtotalAfterDiscount + vatAmount + shippingCost



// Add this effect:
useEffect(() => {
  setIsClient(true)
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

  const handleApplyCoupon = async () => {
    // If a global active coupon exists, prefer that and skip manual code
    if (globalActiveCoupon?.code) {
      setAppliedCoupon({ coupon: globalActiveCoupon, discountAmount: globalDiscountAmount })
      try {
        const { toast } = await import("@/hooks/use-toast")
        toast({ title: t('couponApplied'), description: t('couponActivated').replace('{code}', globalActiveCoupon.code) })
      } catch {}
      setCouponCode("")
      return
    }
    if (!couponCode.trim()) {
      setCouponError(tValidation('pleaseEnterCouponCode'))
      return
    }

    setCouponLoading(true)
    setCouponError("")

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderTotal: subtotal,
          cartItems: cart,
        }),
      })

      const result = await response.json()

      if (result.isValid) {
        setAppliedCoupon(result)
        try {
          const { toast } = await import("@/hooks/use-toast")
          toast({ title: t('couponApplied'), description: t('couponActivated').replace('{code}', result.coupon.code) })
        } catch {}
        toast({
          title: t('couponApplied'),
          description: t('couponSaved').replace('{amount}', formatPrice(result.discountAmount)).replace('{code}', couponCode.toUpperCase()),
          variant: "success",
        })
        setCouponCode("")
      } else {
        setCouponError(result.message || tValidation('invalidCouponCode'))
      }
    } catch (error) {
      setCouponError(t('failedToApplyCoupon'))
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
    toast({
      title: t('couponRemoved'),
      description: t('couponRemovedDescription'),
    })
  }

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: t('cartEmpty'),
        description: t('cartEmptyDescription'),
        variant: "destructive",
      })
      router.push("/products")
      return
    }

    // Validate required fields
    if (!fullName || !email || !phone || !address || !city || !postalCode || !country) {
      toast({
        title: t('missingInformation'),
        description: t('missingInformationDescription'),
        variant: "destructive",
      })
      return
    }

      const orderData = {
      customer: (session?.user as any)?.customerNumber || "Guest",
      total: grandTotal,
      items: cart.map((item) => {
        // Calculate correct price for the item
        let itemPrice;

        if (item.selectedSizes && item.selectedSizes.length > 0) {
          // For items with size variations, use the size-based price
          itemPrice = item.selectedSizes.reduce((total, size) => total + (size.price * size.quantity), 0) / item.quantity;
        } else if (typeof item.price === 'number') {
          itemPrice = item.price;
        } else if (typeof item.price === 'string') {
          const cleanPrice = item.price.replace(/[^\d.-]/g, '');
          itemPrice = parseFloat(cleanPrice) || 0;
        } else {
          itemPrice = 0;
        }

          return {
            name: item.name,
            quantity: item.quantity,
            price: itemPrice,
            designId: item.designId,
            designPreview: item.designPreview,
            selectedSize: (item as any).selectedSize,
            selectedSizes: item.selectedSizes,
            selectedVariant: (item as any).selectedVariant,
            designContext: (item as any).designContext,
            designCanvasJSON: (item as any).designCanvasJSON,
            stepDesignAreas: (item as any).stepDesignAreas,
            designCosts: (item as any).designCosts,
            hasCustomDesign: !!(item as any).designContext || !!(item as any).designCanvasJSON,
            productId: (item as any).productId || item.id,
            productName: (item as any).productName || item.name,
            productImage: (item as any).productImage || item.image,
            // Include design data if present
            designs: (item as any).designs,
            totalDesignArea: (item as any).totalDesignArea,
            hasDesign: (item as any).hasDesign,
            designAreaPercentage: (item as any).designAreaPercentage,
          };
      }),
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
      // Coupon information
      appliedCoupon: appliedCoupon ? {
        code: appliedCoupon.coupon.code,
        discountAmount: appliedCoupon.discountAmount,
        discountType: appliedCoupon.coupon.discountType,
      } : null,
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
        title: tCommon('paymentSuccessful'),
        description: tCommon('orderPlacedSuccessfully'),
        variant: "success",
      })

      router.push("/order-confirmation")
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: tCommon('orderCreationFailed'),
        description: tCommon('orderCreationFailedDescription'),
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-6 sm:py-8 md:py-12 px-4 mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider mb-1 sm:mb-2">
            {t('secureCheckout')}
          </h1>
          <p className="text-xs sm:text-sm md:text-base opacity-90">
            {t('completeOrderSecurely')}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="border sm:border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
            <CardHeader className="border-b sm:border-b-2 border-black dark:border-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-black uppercase text-black dark:text-white">
                {t('billingAndShippingInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-name">{tCommon('fullName')}</Label>
                  <Input
                    id="checkout-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={tCommon('fullName')}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-email">{tCommon('email')}</Label>
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
                <Label htmlFor="checkout-phone">{tCommon('phone')}</Label>
                <Input
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+46 70 123 45 67"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="checkout-address">{tCommon('address')}</Label>
                <Input
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Storgatan 1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-city">{tCommon('city')}</Label>
                  <Input
                    id="checkout-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Stockholm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-postal">{tCommon('postalCode')}</Label>
                  <Input
                    id="checkout-postal"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="111 22"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-country">{tCommon('country')}</Label>
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

          <Card className="border sm:border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
            <CardHeader className="border-b sm:border-b-2 border-black dark:border-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase text-black dark:text-white">
                {t('shippingMethod')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="std-shipping"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 border sm:border-2 border-gray-300 dark:border-gray-700 rounded-lg has-[:checked]:border-black has-[:checked]:bg-yellow-50 dark:has-[:checked]:border-white dark:has-[:checked]:bg-gray-800 cursor-pointer transition-all duration-200 hover:border-gray-400"
                >
                  <RadioGroupItem value="standard" id="std-shipping" className="border sm:border-2 border-black flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-black dark:text-white text-xs sm:text-sm md:text-base">{t('deliveryOptions.standardDelivery')}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm">{t('businessDays3to5')} • {formatPrice(79)}</span>
                  </div>
                </Label>
                <Label
                  htmlFor="exp-shipping"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 border sm:border-2 border-gray-300 dark:border-gray-700 rounded-lg has-[:checked]:border-black has-[:checked]:bg-yellow-50 dark:has-[:checked]:border-white dark:has-[:checked]:bg-gray-800 cursor-pointer transition-all duration-200 hover:border-gray-400"
                >
                  <RadioGroupItem value="express" id="exp-shipping" className="border sm:border-2 border-black flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-black dark:text-white text-xs sm:text-sm md:text-base">{t('deliveryOptions.expressDelivery')}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm">{t('businessDays1to2')} • {formatPrice(149)}</span>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6">
          <Card className="border sm:border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
            <CardHeader className="border-b sm:border-b-2 border-black dark:border-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase text-black dark:text-white">{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 md:p-6 text-xs sm:text-sm md:text-base">
              {cart.map((item) => (
                <div key={item.id} className="pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    {/* Product Image with Design */}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0">
                      <Image
                        src={(item as any).designPreview || item.image || (item as any).imageUrl || (item as any).images?.[0]?.url || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover border border-slate-200 dark:border-slate-700 w-full h-full"
                      />
                      {((item as any).designCanvasJSON || (item as any).designPreview || (item as any).hasDesign) && (
                        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                          ✨
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-xs sm:text-sm md:text-base">
                            {item.name}
                          </p>
                          {(item as any).designContext?.selectedVariation && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(item as any).designContext.selectedVariation.colorName}
                            </p>
                          )}
                          <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400">
                            {t('qty')}: {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {(() => {
                            let totalPrice;
                            if (item.selectedSizes && item.selectedSizes.length > 0) {
                              // Calculate from selected sizes
                              totalPrice = item.selectedSizes.reduce((sum, size) => sum + (size.price * size.quantity), 0);
                            } else if (typeof item.price === 'number') {
                              totalPrice = item.price * item.quantity;
                            } else if (typeof item.price === 'string') {
                              const cleanPrice = item.price.replace(/[^\d.-]/g, '');
                              totalPrice = (parseFloat(cleanPrice) || 0) * item.quantity;
                            } else {
                              totalPrice = 0;
                            }
                            return formatPrice(totalPrice);
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Separator className="bg-gray-300 dark:bg-gray-700" />
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t('subtotal')}</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>{t('discount')} ({appliedCoupon.coupon.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t('vatLabel')}</span>
                <span className="font-semibold">{formatPrice(vatAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{t('shippingLabel')}</span>
                <span className="font-semibold">{formatPrice(shippingCost)}</span>
              </div>
              <Separator className="bg-gray-300 dark:bg-gray-700" />
              <div className="flex justify-between font-black text-base sm:text-lg md:text-xl lg:text-2xl text-black dark:text-white">
                <span>{t('totalLabel')}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Coupon Code Section */}
          <Card className="border sm:border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
            <CardHeader className="border-b sm:border-b-2 border-black dark:border-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase text-black dark:text-white">{t('promoCode')}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              {appliedCoupon ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-green-800 dark:text-green-200">
                          {appliedCoupon.coupon.code}
                        </span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {tCommon('applied')}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {t('youAreSaving').replace('{amount}', formatPrice(discountAmount))}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      {t('remove')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder={t('enterCouponCode')}
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase())
                          setCouponError("")
                        }}
                        className={couponError ? "border-red-500 focus:border-red-500" : ""}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleApplyCoupon()
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold border-2 border-black dark:border-white"
                    >
                      {couponLoading ? t('applying') : t('apply')}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{couponError}</p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('haveCouponCode')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border sm:border-2 border-black dark:border-white bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
            <CardHeader className="border-b sm:border-b-2 border-black dark:border-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-black uppercase text-black dark:text-white">{t('paymentMethod')}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 p-0.5 sm:p-1">
                  <TabsTrigger
                    value="card"
                    className="font-bold uppercase text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=active]:shadow-sm py-1.5 sm:py-2"
                  >
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 md:mr-2" />
                    <span className="hidden xs:inline">{t('card')}</span>
                    <span className="xs:hidden">{t('card')}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="swish"
                    className="font-bold uppercase text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=active]:shadow-sm py-1.5 sm:py-2"
                  >
                    <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 md:mr-2" />
                    <span className="hidden xs:inline">{t('swish')}</span>
                    <span className="xs:hidden">{t('swish')}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="klarna"
                    className="font-bold uppercase text-[10px] sm:text-xs md:text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=active]:shadow-sm py-1.5 sm:py-2"
                  >
                    <KlarnaIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 md:mr-2" />
                    <span className="hidden xs:inline">{t('klarna')}</span>
                    <span className="xs:hidden">KLA</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="card"
                  className="mt-4 space-y-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('securePayment')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('yourPaymentInfoEncrypted')}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">{t('256bitSSL')}</Badge>
                      <Badge variant="outline" className="text-xs">{t('pciCompliant')}</Badge>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="swish"
                  className="mt-4 space-y-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('swishPayment')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('payInstantlySwish')}
                    </p>
                    <div className="mt-3">
                      <Label htmlFor="swish-phone" className="text-sm font-semibold">{t('mobileNumber')}</Label>
                      <Input
                        id="swish-phone"
                        type="tel"
                        placeholder="07X XXX XX XX"
                        className="mt-1 border-2"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="klarna"
                  className="mt-4 space-y-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <KlarnaIcon className="h-5 w-5 text-pink-600" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('klarnaCheckout')}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {t('shopNowPayLater')}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{t('payIn30Days')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{t('interestFreeInstallments')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{t('financingUp24Months')}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            {/* Payment Methods */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">
                  {t('acceptedPaymentMethods') || "Accepted Payment Methods"}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                  {/* Visa */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <svg className="h-6 w-auto" viewBox="0 0 50 16" fill="none">
                      <path d="M20 5L18 11H16.5L14.5 5H16L17.25 9L18.5 5H20Z" fill="#1A1F71"/>
                      <path d="M21 11V5H22.5V11H21Z" fill="#1A1F71"/>
                      <path d="M26 6.5C26 5.7 25.5 5.3 24.8 5.3C24.2 5.3 23.7 5.6 23.5 6L22.5 5.3C22.9 4.6 23.7 4.2 24.8 4.2C26.3 4.2 27.5 5.1 27.5 6.5V11H26V10.5C25.6 10.9 25 11.2 24.3 11.2C23 11.2 22 10.4 22 9.2C22 8 23 7.2 24.3 7.2C25 7.2 25.6 7.5 26 7.9V6.5Z" fill="#1A1F71"/>
                    </svg>
                  </div>

                  {/* Mastercard */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <svg className="h-6 w-auto" viewBox="0 0 50 16" fill="none">
                      <circle cx="16" cy="8" r="6" fill="#EB001B"/>
                      <circle cx="26" cy="8" r="6" fill="#F79E1B"/>
                      <path d="M21 4C22 5 22.5 6.5 22.5 8C22.5 9.5 22 11 21 12C20 11 19.5 9.5 19.5 8C19.5 6.5 20 5 21 4Z" fill="#FF5F00"/>
                    </svg>
                  </div>

                  {/* Swish */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold" style={{ color: '#00A9E0' }}>Swish</span>
                  </div>

                  {/* Klarna */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold" style={{ color: '#FFB3C7' }}>Klarna</span>
                  </div>

                  {/* PayPal */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold" style={{ color: '#003087' }}>PayPal</span>
                  </div>

                  {/* Apple Pay */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-black dark:text-white">Pay</span>
                  </div>

                  {/* Google Pay */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold">
                      <span style={{ color: '#4285F4' }}>G</span>
                      <span style={{ color: '#EA4335' }}>Pay</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <CardFooter className="p-3 sm:p-4 md:p-6 pt-0">
              <Button
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-black uppercase text-xs sm:text-sm md:text-base lg:text-lg py-4 sm:py-5 md:py-6 border sm:border-2 border-black dark:border-white transition-all duration-200 hover:scale-[1.02]"
                onClick={handlePayment}
                disabled={loading}
              >
                <ShieldCheck className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {loading ? t('processing') : `${t('completeOrder')} • ${formatPrice(grandTotal)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Security Badges */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 rounded-lg sm:rounded-xl border sm:border-2 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-1 sm:gap-2">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">{t('sslSecured')}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">{t('pciCompliant')}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className="bg-black text-white dark:bg-white dark:text-black text-[10px] sm:text-xs">{t('stripeVerified')}</Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className="bg-black text-white dark:bg-white dark:text-black text-[10px] sm:text-xs">{t('secureCheckoutBadge')}</Badge>
          </div>
        </div>
      </div>

      {/* Payment Modals */}
      {paymentMethod === "card" && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={grandTotal}
          currency="sek"
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          orderData={orderData}
        />
      )}
      
      {paymentMethod === "swish" && (
        <SwishPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={grandTotal}
          currency="sek"
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          orderData={orderData}
        />
      )}
      
      {paymentMethod === "klarna" && (
        <KlarnaPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={grandTotal}
          currency="sek"
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          orderData={orderData}
        />
      )}
      </div>
    </div>
  )
}
