"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { clearError } from "@/lib/redux/slices/authSlice"
import { translations } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Sparkles, Zap, Shield } from "lucide-react"

export default function SignupPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { language } = useAppSelector((state) => state.app)
  const { toast } = useToast()
  const t = translations[language]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationError, setValidationError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")
    dispatch(clearError())
    setIsSubmitting(true)

    if (password !== confirmPassword) {
      setValidationError(t.passwordsDoNotMatch)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.error === "User already exists") {
          setValidationError(t.userAlreadyExists)
        } else {
          throw new Error(data.error || t.failedToCreateAccount)
        }
        return
      }

      // If signup is successful, automatically sign in the user
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        toast({
          title: t.loginFailed,
          description: t.invalidCredentials,
          variant: "destructive",
        })
      } else {
        toast({
          title: t.accountCreated,
          description: t.welcomeToPlatform,
          variant: "success",
        })
        router.push("/dashboard")
      }
    } catch (err: any) {
      toast({
        title: t.signupFailed,
        description: err.message || t.failedToCreateAccount,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto mb-4" />
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Join us today and start designing</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white dark:bg-gray-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red" />
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl font-bold text-center">{t.signup}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="h-11 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="h-11 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-11 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-11 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
              {(error || validationError) && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error || validationError}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.creatingAccount : t.signup}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              {t.alreadyHaveAccount}{" "}
              <Link href="/login" className="font-semibold text-black dark:text-white hover:opacity-80 transition-opacity">
                {t.login}
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Features Card */}
        <Card className="shadow-xl border-0 bg-white dark:bg-gray-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-lime via-brand-yellow to-brand-orange" />
          <CardContent className="pt-8">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Design Custom Products</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Create unique designs with our intuitive design tool
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Fast & Secure</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Quick ordering process with secure payment options
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-black dark:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Premium Quality</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    High-quality materials and professional printing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
