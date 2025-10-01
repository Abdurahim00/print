import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-4xl font-bold">404</h2>
        <h3 className="text-2xl font-semibold">Page Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  )
}