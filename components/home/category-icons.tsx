import {
  Shirt,
  Coffee,
  ShoppingBag,
  Watch,
  Sticker,
  Printer,
  Briefcase,
  Smartphone,
  Home,
  Gift,
  Package,
  Calendar,
  Dumbbell,
  Utensils,
  Baby,
  Gamepad,
  Heart,
  Sparkles,
  Car,
  Music,
  Palette,
  Camera,
  TrendingUp,
  Leaf,
  Crown,
  Users,
  Scissors,
  Hammer,
  Wrench,
  Box,
  Tag,
  ShoppingCart,
  Star,
  Zap,
  Rocket,
  Diamond,
  Flame,
  Award,
  Globe,
  Layers,
  LucideIcon
} from "lucide-react"

// Comprehensive icon mapping using Lucide React icons for instant loading
export const iconMap: { [key: string]: LucideIcon } = {
  // Apparel & Clothing
  't-shirt': Shirt,
  'tshirt': Shirt,
  'shirt': Shirt,
  'apparel': Shirt,
  'clothing': Shirt,
  'hoodie': Shirt,
  'jacket': Shirt,
  'pants': Shirt,
  'dress': Shirt,
  'uniform': Shirt,

  // Drinkware
  'mug': Coffee,
  'cup': Coffee,
  'drinkware': Coffee,
  'bottle': Coffee,
  'tumbler': Coffee,
  'flask': Coffee,
  'glass': Coffee,

  // Bags
  'bag': ShoppingBag,
  'bags': ShoppingBag,
  'tote': ShoppingBag,
  'backpack': ShoppingBag,
  'wallet': ShoppingBag,
  'purse': ShoppingBag,
  'luggage': ShoppingBag,
  'briefcase': Briefcase,

  // Accessories
  'watch': Watch,
  'jewelry': Diamond,
  'accessories': Tag,
  'sunglasses': Watch,
  'belt': Tag,
  'tie': Tag,

  // Print Products
  'sticker': Sticker,
  'print': Printer,
  'poster': Printer,
  'business': Briefcase,
  'card': Tag,
  'flyer': Printer,
  'banner': Tag,
  'calendar': Calendar,
  'label': Tag,
  'invitation': Gift,

  // Office & Stationery
  'office': Briefcase,
  'stationery': Briefcase,
  'notebook': Briefcase,
  'pen': Briefcase,
  'document': Briefcase,
  'folder': Briefcase,

  // Tech & Electronics
  'phone': Smartphone,
  'tech': Smartphone,
  'electronic': Smartphone,
  'headphone': Smartphone,
  'speaker': Smartphone,
  'keyboard': Smartphone,
  'laptop': Smartphone,
  'tablet': Smartphone,

  // Home & Living
  'home': Home,
  'decor': Home,
  'kitchen': Home,
  'pillow': Home,
  'towel': Home,
  'candle': Flame,
  'lamp': Home,
  'plant': Leaf,

  // Promotional & Gifts
  'gift': Gift,
  'promotional': Gift,
  'award': Award,
  'trophy': Award,
  'medal': Award,

  // Packaging & Shipping
  'package': Package,
  'packaging': Package,
  'box': Box,
  'shipping': Package,

  // Events & Occasions
  'party': Calendar,
  'event': Calendar,
  'wedding': Heart,
  'birthday': Gift,
  'graduation': Award,
  'baby': Baby,
  'christmas': Gift,

  // Sports & Outdoor
  'sport': Dumbbell,
  'gym': Dumbbell,
  'fitness': Dumbbell,
  'outdoor': Globe,
  'camping': Globe,
  'travel': Globe,

  // Food & Beverage
  'food': Utensils,
  'beverage': Coffee,
  'restaurant': Utensils,
  'coffee': Coffee,

  // Other Categories
  'kid': Baby,
  'children': Baby,
  'toy': Gamepad,
  'game': Gamepad,
  'health': Heart,
  'beauty': Sparkles,
  'spa': Sparkles,
  'car': Car,
  'music': Music,
  'art': Palette,
  'photo': Camera,
  'marketing': TrendingUp,
  'business': Briefcase,
  'custom': Palette,
  'eco': Leaf,
  'luxury': Crown,
  'premium': Star,
  'team': Users,
  'pet': Heart,
  'nature': Leaf,
  'craft': Scissors,
  'diy': Hammer,
  'tool': Wrench,
  'education': Award,
  'science': Zap,
  'retail': ShoppingCart,
  'shop': ShoppingCart,
}

// Fallback icons using Lucide components
export const fallbackIcons: LucideIcon[] = [
  Box,
  Tag,
  Star,
  Zap,
  Rocket,
  Diamond,
  Flame,
  Award,
  Globe,
  Layers,
]

// Get unique icon for each category
export const getCategoryIcon = (
  categoryName: string,
  index: number,
  usedIcons: Set<string>
): LucideIcon => {
  const name = categoryName.toLowerCase().trim()

  // First try exact match
  if (iconMap[name] && !usedIcons.has(name)) {
    usedIcons.add(name)
    return iconMap[name]
  }

  // Then try partial matches
  for (const [key, IconComponent] of Object.entries(iconMap)) {
    if (name.includes(key) && !usedIcons.has(key)) {
      usedIcons.add(key)
      return IconComponent
    }
  }

  // Try matching individual words
  const words = name.split(/[\s&-]+/)
  for (const word of words) {
    if (iconMap[word] && !usedIcons.has(word)) {
      usedIcons.add(word)
      return iconMap[word]
    }
  }

  // Use a unique fallback icon
  const fallbackIcon = fallbackIcons[index % fallbackIcons.length]
  return fallbackIcon
}