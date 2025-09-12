"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

const ProductDesignTool = dynamic(
  () => import("@/components/design-tool-editor/product-design-tool").then(mod => mod.ProductDesignTool),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-4xl p-8">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-[400px] w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
      </div>
    ),
    ssr: true
  }
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDesignTool />
    </div>
  )
}
