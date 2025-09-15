"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, CreditCard, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  currency: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  orderData: any
}

function PaymentForm({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  onClose,
  orderData,
}: {
  amount: number
  currency: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  onClose: () => void
  orderData: any
}) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage("")

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      })

      if (error) {
        setMessage(error.message || "An error occurred during payment.")
        onPaymentError(error.message || "Payment failed")
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during payment.",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment successful!")
        onPaymentSuccess(paymentIntent.id)
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          variant: "success",
        })
        onClose()
      }
    } catch (error) {
      console.error("Payment error:", error)
      setMessage("An unexpected error occurred.")
      onPaymentError("An unexpected error occurred")
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-black text-white rounded-none border-2 border-black">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-white" />
            <div>
              <p className="font-black uppercase tracking-wider">
                SECURE PAYMENT
              </p>
              <p className="text-sm opacity-80">
                256-bit SSL encryption by Stripe
              </p>
            </div>
          </div>
          <ShieldCheck className="h-5 w-5 text-green-500" />
        </div>

        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: orderData?.customerName || "",
                email: orderData?.customerEmail || "",
              },
            },
          }}
        />
      </div>

      {message && (
        <div className="p-4 bg-red-500 text-white border-2 border-red-600 rounded-none">
          <p className="font-bold">{message}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="border-t-2 border-black"></div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black uppercase tracking-wider">
            TOTAL AMOUNT:
          </span>
          <span className="text-xl font-black">
            {currency.toUpperCase()} {amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 bg-white text-black border-2 border-black hover:bg-gray-100 font-black uppercase tracking-wider rounded-none"
          disabled={isProcessing}
        >
          CANCEL
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-black text-white hover:bg-gray-900 font-black uppercase tracking-wider rounded-none border-2 border-black"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              PROCESSING...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              PAY {currency.toUpperCase()} {amount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default function StripePaymentModal({
  isOpen,
  onClose,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  orderData,
}: StripePaymentModalProps) {
  const [clientSecret, setClientSecret] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && amount > 0) {
      createPaymentIntent()
    }
  }, [isOpen, amount])

  const createPaymentIntent = async () => {
    setIsLoading(true)
    try {
      // Make sure amount is a valid number
      if (isNaN(amount) || amount <= 0) {
        throw new Error(`Invalid payment amount: ${amount}. Please check your cart for correct pricing.`);
      }
      
      console.log("Creating payment intent with amount:", amount);
      
      const response = await fetch("/api/payment/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency,
          metadata: {
            orderId: orderData?.orderId || "no-order-id",
            customerEmail: orderData?.customerEmail || "no-email",
            customerName: orderData?.customerName || "no-name",
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Payment intent creation failed:", data);
        throw new Error(data.error || "Failed to create payment intent")
      }

      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      onPaymentError(error instanceof Error ? error.message : "Payment setup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto border-2 border-black rounded-none">
        <DialogHeader className="border-b-2 border-black pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black uppercase tracking-wider">
              COMPLETE PAYMENT
            </DialogTitle>
          </div>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-6 w-6 animate-spin text-black" />
                  <span className="font-bold uppercase">
                    SETTING UP SECURE PAYMENT...
                  </span>
                </div>
              </div>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "flat",
                    variables: {
                      colorPrimary: "#000000",
                      colorBackground: "#ffffff",
                      colorText: "#000000",
                      colorDanger: "#dc2626",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeightNormal: "500",
                      fontWeightBold: "900",
                      spacingUnit: "4px",
                      borderRadius: "0px",
                      colorTextPlaceholder: "#666666",
                      colorIcon: "#000000",
                      colorIconHover: "#333333",
                      colorTextSecondary: "#333333",
                      colorIconCardError: "#dc2626",
                    },
                    rules: {
                      ".Input": {
                        border: "2px solid #000000",
                        boxShadow: "none",
                      },
                      ".Input:focus": {
                        border: "2px solid #000000",
                        boxShadow: "0 0 0 1px #000000",
                      },
                      ".Label": {
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      },
                      ".Tab": {
                        border: "2px solid #000000",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      },
                      ".Tab--selected": {
                        backgroundColor: "#000000",
                        color: "#ffffff",
                      },
                    },
                  },
                }}
              >
                <PaymentForm
                  amount={amount}
                  currency={currency}
                  onPaymentSuccess={onPaymentSuccess}
                  onPaymentError={onPaymentError}
                  onClose={onClose}
                  orderData={orderData}
                />
              </Elements>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    Failed to initialize payment
                  </p>
                  <Button
                    onClick={createPaymentIntent}
                    className="mt-2"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
} 