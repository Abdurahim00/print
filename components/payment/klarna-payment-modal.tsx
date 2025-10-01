"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ShoppingBag, CheckCircle, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface KlarnaPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  currency: string
  onPaymentSuccess: (paymentId: string) => void
  onPaymentError: (error: string) => void
  orderData: any
}

export default function KlarnaPaymentModal({
  isOpen,
  onClose,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  orderData,
}: KlarnaPaymentModalProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState(orderData?.customerEmail || "")
  const [personalNumber, setPersonalNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !personalNumber) {
      toast({
        title: "Information Required",
        description: "Please enter your email and personal number",
        variant: "destructive",
      })
      return
    }

    // Validate Swedish personal number format (YYYYMMDD-XXXX)
    const personalNumberRegex = /^(19|20)\d{6}[-]?\d{4}$/
    if (!personalNumberRegex.test(personalNumber.replace(/\s/g, ""))) {
      toast({
        title: "Invalid Personal Number",
        description: "Please enter a valid Swedish personal number (YYYYMMDD-XXXX)",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      // Simulate Klarna payment authorization
      // In production, this would integrate with Klarna API
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      // Generate a mock payment ID
      const paymentId = `klarna_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      setPaymentStatus("success")
      
      setTimeout(() => {
        onPaymentSuccess(paymentId)
        toast({
          title: "Payment Authorized",
          description: "Your Klarna payment has been approved",
          variant: "success",
        })
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error("Klarna payment error:", error)
      onPaymentError("Klarna payment failed")
      toast({
        title: "Payment Failed",
        description: "Unable to process Klarna payment. Please try again.",
        variant: "destructive",
      })
      setPaymentStatus("idle")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-black rounded-none">
        <DialogHeader className="border-b-2 border-black pb-4">
          <DialogTitle className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
            <div className="bg-pink-500 text-white p-2 rounded-none">
              <ShoppingBag className="h-6 w-6" />
            </div>
            KLARNA PAYMENT
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {paymentStatus === "idle" && (
            <>
              <div className="bg-pink-50 border-2 border-pink-500 p-4 rounded-none">
                <p className="font-bold text-pink-900 uppercase">BUY NOW, PAY LATER</p>
                <p className="text-sm text-pink-700 mt-1">
                  Split your payment or pay within 30 days with Klarna
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-black uppercase tracking-wider">
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-black rounded-none font-bold h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personal-number" className="font-black uppercase tracking-wider">
                    PERSONAL NUMBER
                  </Label>
                  <Input
                    id="personal-number"
                    type="text"
                    placeholder="YYYYMMDD-XXXX"
                    value={personalNumber}
                    onChange={(e) => setPersonalNumber(e.target.value)}
                    className="border-2 border-black rounded-none font-bold h-12"
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Your Swedish personal number for credit check
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black uppercase tracking-wider">AMOUNT:</span>
                  <span className="text-2xl font-black">
                    {amount.toFixed(2)} {currency.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-bold">Payment Options Available:</span>
                  </div>
                  <ul className="ml-6 space-y-1 text-gray-600">
                    <li>• Pay in 30 days</li>
                    <li>• Split into 3 interest-free payments</li>
                    <li>• Finance over 6-36 months</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {paymentStatus === "processing" && (
            <div className="py-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-500 text-white rounded-full animate-pulse">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <div>
                <p className="font-black text-xl uppercase tracking-wider mb-2">
                  AUTHORIZING PAYMENT
                </p>
                <p className="text-gray-600">
                  Klarna is reviewing your payment request...
                </p>
              </div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-pink-500" />
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="py-12 text-center space-y-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
              <div>
                <p className="font-black text-xl uppercase tracking-wider mb-2">
                  PAYMENT APPROVED!
                </p>
                <p className="text-gray-600">
                  Your Klarna payment has been authorized
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Invoice will be sent to {email}
                </p>
              </div>
            </div>
          )}

          {paymentStatus === "idle" && (
            <div className="flex gap-3">
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
                disabled={isProcessing}
                className="flex-1 bg-pink-500 text-white hover:bg-pink-600 font-black uppercase tracking-wider rounded-none border-2 border-pink-500"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    PAY WITH KLARNA
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}