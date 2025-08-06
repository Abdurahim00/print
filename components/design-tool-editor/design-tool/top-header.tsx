import { Button } from "@/components/ui/button"
import { Phone, Share2, Palette, Sparkles } from "lucide-react"

export function TopHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Right - Actions only */}
      <div className="flex items-center space-x-2 ml-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2 hover:bg-gray-100 transition-all duration-200 rounded-lg"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Support</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2 hover:bg-gray-100 transition-all duration-200 rounded-lg"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Share</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 rounded-lg text-blue-600 hover:text-blue-700"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Pro</span>
        </Button>
      </div>
    </div>
  )
}
