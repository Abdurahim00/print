"use client"
import { ImageIcon } from "lucide-react"

export function TemplatePanel() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <ImageIcon className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-center">Click Templates in toolbar to browse designs</p>
      </div>
    </div>
  )
}
