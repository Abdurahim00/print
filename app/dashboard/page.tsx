"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { OperationsDashboard } from "@/components/dashboard/operations-dashboard"
import { useSession } from "next-auth/react" // Import useSession
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession() // Get session data
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-12">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  if (status === "unauthenticated" || !session?.user) {
    return null // Redirect handled by useEffect
  }

  const user = session.user // Use user from session

  const getDashboardTitle = () => {
    switch (user.role) {
      case "user":
        return t.clientDashboard
      case "admin":
        return t.adminDashboard
      case "operations":
        return t.operationsDashboard
      default:
        return t.dashboard
    }
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case "user":
        return <UserDashboard />
      case "admin":
        return <AdminDashboard />
      case "operations":
        return <OperationsDashboard />
      default:
        return (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">{t.noDashboardAvailable}</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{getDashboardTitle()}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t.welcomeBackUser.replace("{name}", user.fullName || user.email)}
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full text-xs font-medium uppercase">
              {user.role}
            </span>
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 mt-1">
            {t.customerNumber}: {user.customerNumber}
          </p>
        </div>
      </div>
      {renderDashboardContent()}
    </div>
  )
}
