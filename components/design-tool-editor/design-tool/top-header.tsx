import { Button } from "@/components/ui/button"
import { Phone, Share2 } from "lucide-react"

export function TopHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
    
      
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>Support</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  )
}
