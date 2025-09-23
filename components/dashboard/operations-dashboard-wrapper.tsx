"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"

// Create a lightweight wrapper that loads the heavy component dynamically
const OperationsDashboardContent = dynamic(
  () => import("./operations-dashboard").then(mod => ({ default: mod.OperationsDashboard })),
  {
    loading: () => (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    ),
    ssr: false
  }
)

export function OperationsDashboard() {
  try {
    return <OperationsDashboardContent />
  } catch (error) {
    console.error('Error loading OperationsDashboard:', error)
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Error Loading Operations Dashboard</h2>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            There was an error loading the operations dashboard. Please refresh the page or contact support if the issue persists.
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-600 dark:text-red-400">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}