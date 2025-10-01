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

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { language } = useAppSelector((state) => state.app)
  const { toast } = useToast()
  const t = translations[language]

  const [email, setEmail] = useState("user@example.com")
  const [password, setPassword] = useState("password")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    setIsSubmitting(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: t.loginFailed,
          description: t.invalidCredentials,
          variant: "destructive",
        })
      } else {
        toast({
          title: t.welcomeBack,
          description: t.loggedInSuccessfully,
          variant: "success",
        })
        router.push("/dashboard")
      }
    } catch (err) {
      toast({
        title: t.loginFailed,
        description: t.invalidCredentials,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const demoAccounts = [
    { email: "user@example.com", role: "User", description: "Regular user with order history and design management" },
    { email: "admin@example.com", role: "Admin", description: "Full admin access with user and product management" },
    { email: "ops@example.com", role: "Operations", description: "Operations dashboard with order queue management" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red mx-auto mb-4" />
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Sign in to your account</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white dark:bg-gray-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green via-brand-yellow via-brand-orange to-brand-red" />
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl font-bold text-center">{t.login}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
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
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.loggingIn : t.login}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-200 dark:border-gray-800 pt-6">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              {t.dontHaveAccount}{" "}
              <Link href="/signup" className="font-semibold text-black dark:text-white hover:opacity-80 transition-opacity">
                {t.signup}
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Accounts - Testing Section */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-red" />
          <CardHeader className="pt-8">
            <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
              <span className="text-2xl">🧪</span>
              <span className="text-black dark:text-white font-bold">
                Demo Accounts
              </span>
            </CardTitle>
            <p className="text-xs text-center text-slate-600 dark:text-slate-400 mt-1">
              Click any account to auto-fill credentials
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-900 hover:border-black dark:hover:border-white hover:shadow-lg cursor-pointer transition-all group relative overflow-hidden"
                onClick={() => {
                  setEmail(account.email)
                  setPassword("password")
                }}
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {account.email}
                    </span>
                    <span className="text-xs px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold">
                      {account.role}
                    </span>
                  </div>
                  <p className="text-xs text-left text-slate-600 dark:text-slate-400">
                    {account.description}
                  </p>
                </div>
              </button>
            ))}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-center text-slate-500 dark:text-slate-500">
                🔑 All demo accounts use password: <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono font-semibold">"password"</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
