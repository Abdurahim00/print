"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          An error occurred while loading this page. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button
          onClick={() => reset()}
          className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}