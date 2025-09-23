export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary border-r-transparent mx-auto"></div>
        <p className="mt-4 text-lg font-semibold">Loading design tool...</p>
      </div>
    </div>
  )
}