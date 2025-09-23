"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { useAppSelector } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load dashboard components with SSR disabled to prevent hydration issues
const UserDashboard = dynamic(
  () => import("@/components/dashboard/user-dashboard").then(mod => mod.UserDashboard),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }
)

const AdminDashboard = dynamic(
  () => import("@/components/dashboard/admin-dashboard").then(mod => mod.AdminDashboard),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }
)

const OperationsDashboard = dynamic(
  () => import("@/components/dashboard/operations-dashboard-wrapper").then(mod => ({ default: mod.OperationsDashboard })),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false
  }
)

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-[200px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession() // Get session data
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]
  
  // Get tab from URL query parameter - moved inside useEffect to avoid SSR issues
  const [defaultTab, setDefaultTab] = useState('orders')
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab') || 'orders'
    setDefaultTab(tab)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Always call hooks at top-level; guard inside the effect
  useEffect(() => {
    const role = (session?.user as any)?.role
    const footer = document.querySelector("footer") as HTMLElement | null
    if (role === "admin" && footer) {
      footer.style.display = "none"
      return () => {
        if (footer) footer.style.display = ""
      }
    }
    return
  }, [session?.user])

  if (status === "loading") {
    return <DashboardSkeleton />
  }

  if (status === "unauthenticated" || !session?.user) {
    return <DashboardSkeleton /> // Show skeleton while redirecting
  }

  const user = session.user as any // extended session with role

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
        return <UserDashboard defaultTab={defaultTab} />
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
      {renderDashboardContent()}
    </div>
  )
}
