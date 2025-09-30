// Canvas and Design Types
export interface FabricCanvasJSON {
  version: string;
  objects: Array<{
    type: string;
    [key: string]: unknown;
  }>;
  background?: string;
  [key: string]: unknown;
}

export interface DesignData {
  canvasJSON: FabricCanvasJSON;
  metadata?: {
    width?: number;
    height?: number;
    zoom?: number;
    [key: string]: unknown;
  };
}

export type TranslationFunction = (key: string) => string;
export type TranslationObject = typeof import('@/lib/constants').translations.en;

export interface User {
  id: string
  email: string
  role: "user" | "admin" | "operations"
  customerNumber: string
  fullName?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface VariationImage {
  id: string;
  url: string;
  alt_text: string;
  angle: string;
  is_primary: boolean;
}

export interface Color {
  name: string;
  hex_code: string;
  swatch_image?: string;
}

export interface DesignFrame {
  id: string;
  position: string; // e.g., "front", "back", "left", "right"
  x: number; // X coordinate in pixels (for editor)
  y: number; // Y coordinate in pixels (for editor)
  width: number; // Width in cm
  height: number; // Height in cm
  widthPx: number; // Width in pixels for canvas
  heightPx: number; // Height in pixels for canvas
  xPercent?: number; // X position as percentage of container width
  yPercent?: number; // Y position as percentage of container height
  widthPercent?: number; // Width as percentage of container width
  heightPercent?: number; // Height as percentage of container height
  costPerCm2?: number; // Cost per square centimeter for this frame
  variationId?: string; // Optional: specific to a variation
  angle?: string; // Optional: specific to an angle within a variation
}

export interface VariationAngleFrames {
  variationId: string;
  angle: string;
  frames: DesignFrame[];
}

export interface VariantPositionMapping {
  variantId: string;
  position: string; // "front", "back", "left", "right", etc.
  designFrameId?: string; // Reference to specific design frame
}

export interface Variation {
  id: string;
  color: Color;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  images: VariationImage[];
  positionMapping?: string; // Which position this variant represents (front/back/side)
  designFrames?: DesignFrame[]; // Variation-specific design frames per angle
  designCostPerCm2?: number; // Variation-specific cost per square centimeter
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  subcategoryIds?: string[];
  description?: string;
  inStock: boolean;
  hasVariations?: boolean;
  variations?: Variation[];
  /** Available sizes for products without variations */
  availableSizes?: string[];
  /** If true, product participates in global coupon discounts */
  eligibleForCoupons?: boolean;
  /** If true, product can be customized in the design tool */
  isDesignable?: boolean;
  /** Design frames with positions and dimensions */
  designFrames?: DesignFrame[];
  /** Default cost per square centimeter for design */
  designCostPerCm2?: number;
  /** Maps variants to positions for multi-position products */
  variantPositionMappings?: VariantPositionMapping[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItemSize {
  size: string;
  quantity: number;
  price: number;
}

export interface SelectedVariationDetails {
  variationId: string;
  colorName: string;
  colorHexCode: string;
  colorSwatchImage?: string;
  variationPrice: number;
  variationImages: VariationImage[];
}

export interface DesignContext {
  viewMode: string; // "front" | "back" | "left" | "right"
  productColor: string; // Hex code of selected color
  selectedVariation?: SelectedVariationDetails; // Details of selected variation
  selectedTemplate?: {
    id: string;
    name: string;
    category: string;
    image: string;
    price: number | "free";
  };
}

export interface CartItem extends Product {
  quantity: number;
  selectedSizes?: CartItemSize[];
  designPreview?: string; // For custom designs (composite image)
  designId?: string; // Reference to saved design
  designContext?: DesignContext; // Complete design context from design tool
  /** Base product id preserved when cart item id is made unique per design */
  productId?: string;
  /** Full Fabric.js canvas JSON to reproduce design precisely */
  designCanvasJSON?: FabricCanvasJSON;
  /** Design cost information for pricing */
  designCosts?: {
    totalDesignAreaCm2: number;
    costPerCm2: number;
    totalDesignCost: number;
    breakdown: {
      objectCount: number;
      boundingBox: { width: number; height: number };
      frameUsagePercentage: number;
    };
  };
  /** Array of designs for each angle/step */
  designs?: CartDesign[];
  /** Total design area across all angles */
  totalDesignArea?: number;
  /** Total price including design costs */
  totalPrice?: number;
  /** Base product price without design costs */
  basePrice?: number;
}

export interface Order {
  id: string // This is the orderId from MongoDB
  customer: string // customerNumber
  date: string
  total: number
  status: "Queued" | "Printing" | "In Production" | "Shipped" | "Completed"
  items: Array<{
    name: string
    quantity: number
    price: number
    size?: string
    designPreview?: string
    designId?: string
    /** Optional granular size breakdown */
    selectedSizes?: CartItemSize[]
    /** Preserve full design context and canvas for production */
    designContext?: DesignContext
    designCanvasJSON?: FabricCanvasJSON
    /** Base product id for reference */
    productId?: string
  }>
  shippingOption: "standard" | "express"
  paymentMethod: "card" | "swish" | "klarna"
  paymentIntentId?: string
  // Customer information
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerPostalCode?: string
  customerCountry?: string
}

export interface Design {
  id: string // MongoDB _id as string
  name: string
  type: string
  preview: string
  userId: string // User's MongoDB _id as string
  designData: DesignData
  status: "Draft" | "Completed" | "In Review"
}

export interface CartDesign {
  angle: string; // front, back, left, right
  stepNumber: number;
  canvasJSON: FabricCanvasJSON;
  designAreaCm2: number;
  designAreaPercentage: number;
}

export interface ProductCategory {
  id: string
  name: (t: TranslationObject) => string
}

export interface Vehicle {
  make: string
  model: string
  svgPath: string
}

export type Language = "en" | "sv"

// This AppState is for Redux, not directly for NextAuth session
export interface AppState {
  user: User | null
  cart: CartItem[]
  language: Language
  products: Product[]
  orders: Order[]
  users: User[]
  designs: Design[]
  coupons: Coupon[]
}

// Removed Favorite feature

export interface Template {
  id: string
  name: string
  image: string
  price: number | "free"
  category: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateTemplateData {
  name: string
  image: string
  price: number | "free"
  category: string
}

export interface UpdateTemplateData {
  id: string
  name?: string
  image?: string
  price?: number | "free"
  category?: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrderAmount?: number
  maxUsageCount?: number
  currentUsageCount: number
  isActive: boolean
  validFrom: Date
  validUntil: Date
  applicableProducts?: string[]
  applicableCategories?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateCouponData {
  code: string
  description?: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrderAmount?: number
  maxUsageCount?: number
  isActive: boolean
  validFrom: Date
  validUntil: Date
  applicableProducts?: string[]
  applicableCategories?: string[]
}

export interface UpdateCouponData {
  id: string
  code?: string
  description?: string
  discountType?: "percentage" | "fixed"
  discountValue?: number
  minimumOrderAmount?: number
  maxUsageCount?: number
  isActive?: boolean
  validFrom?: Date
  validUntil?: Date
  applicableProducts?: string[]
  applicableCategories?: string[]
}

export interface CouponValidationResult {
  isValid: boolean
  message?: string
  discountAmount?: number
  coupon?: Coupon
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
  // Design capabilities
  isDesignable?: boolean
  designableAreas?: string[]
  designTechniques?: string[]
  // Design pricing
  designUpchargePercent?: number // Legacy: percentage-based upcharge
  designUpchargePerCm2?: number // New: price per square centimeter  
  useMetricPricing?: boolean // If true, use per cm² pricing
}

export interface Subcategory {
  id: string
  categoryId: string
  name: string
  swedishName?: string
  slug: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
  // Design capabilities
  isDesignable?: boolean
  designableAreas?: string[]
  designTechniques?: string[]
  inheritDesignSettings?: boolean
}
