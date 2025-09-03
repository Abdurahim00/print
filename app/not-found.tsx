import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-black dark:text-white">404</h1>
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold uppercase">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}