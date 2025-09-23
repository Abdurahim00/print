import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg max-w-full">
      <div className="relative w-full aspect-[4/3]">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-3 sm:p-4 space-y-2">
        <Skeleton className="h-4 sm:h-5 w-3/4" />
        <Skeleton className="h-3 sm:h-4 w-full" />
        <Skeleton className="h-3 sm:h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col space-y-2">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-5 sm:h-6 w-20" />
          <Skeleton className="h-5 sm:h-6 w-16" />
        </div>
        <Skeleton className="h-9 sm:h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}