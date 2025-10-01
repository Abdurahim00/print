"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Smartphone, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface SwishPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  currency: string
  onPaymentSuccess: (paymentId: string) => void
  onPaymentError: (error: string) => void
  orderData: any
}

export default function SwishPaymentModal({
  isOpen,
  onClose,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  orderData,
}: SwishPaymentModalProps) {
  const { toast } = useToast()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "waiting" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your Swish phone number",
        variant: "destructive",
      })
      return
    }

    // Validate Swedish phone number format
    const phoneRegex = /^(07[0-9]{8}|467[0-9]{8}|\+467[0-9]{8})$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Swedish phone number",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setPaymentStatus("waiting")

    try {
      // Simulate Swish payment request
      // In production, this would integrate with Swish API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Generate a mock payment ID
      const paymentId = `swish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      setPaymentStatus("success")
      
      setTimeout(() => {
        onPaymentSuccess(paymentId)
        toast({
          title: "Payment Successful",
          description: "Your Swish payment has been processed",
          variant: "success",
        })
        onClose()
      }, 1500)
      
    } catch (error) {
      console.error("Swish payment error:", error)
      onPaymentError("Swish payment failed")
      toast({
        title: "Payment Failed",
        description: "Unable to process Swish payment. Please try again.",
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
            <div className="bg-green-500 text-white p-2 rounded-none">
              <Smartphone className="h-6 w-6" />
            </div>
            SWISH PAYMENT
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {paymentStatus === "idle" && (
            <>
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded-none">
                <p className="font-bold text-green-900 uppercase">INSTANT PAYMENT</p>
                <p className="text-sm text-green-700 mt-1">
                  Pay directly from your mobile bank using Swish
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-black uppercase tracking-wider">
                  MOBILE NUMBER
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07X XXX XX XX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-2 border-black rounded-none font-bold text-lg h-12"
                  required
                />
                <p className="text-sm text-gray-600">
                  Enter the phone number connected to your Swish account
                </p>
              </div>

              <div className="border-t-2 border-black pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black uppercase tracking-wider">AMOUNT TO PAY:</span>
                  <span className="text-2xl font-black">
                    {amount.toFixed(2)} {currency.toUpperCase()}
                  </span>
                </div>
              </div>
            </>
          )}

          {paymentStatus === "waiting" && (
            <div className="py-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full animate-pulse">
                <Smartphone className="h-10 w-10" />
              </div>
              <div>
                <p className="font-black text-xl uppercase tracking-wider mb-2">
                  OPEN YOUR SWISH APP
                </p>
                <p className="text-gray-600">
                  Complete the payment in your Swish mobile application
                </p>
              </div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-500" />
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="py-12 text-center space-y-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
              <div>
                <p className="font-black text-xl uppercase tracking-wider mb-2">
                  PAYMENT CONFIRMED!
                </p>
                <p className="text-gray-600">
                  Your Swish payment has been successfully processed
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
                className="flex-1 bg-green-500 text-white hover:bg-green-600 font-black uppercase tracking-wider rounded-none border-2 border-green-500"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    PAY WITH SWISH
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