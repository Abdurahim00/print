import type { ObjectId } from "mongodb"

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

export interface SizePrice {
  size: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  useBasePrice?: boolean; // If true, use product's base price
}

export interface DesignFrame {
  id: string;
  position: string; // e.g., "front", "back", "left", "right"
  x: number; // X coordinate in pixels
  y: number; // Y coordinate in pixels
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

export interface VariantPositionMapping {
  variantId: string;
  position: string; // "front", "back", "left", "right", etc.
  designFrameId?: string; // Reference to specific design frame
}

export interface Variation {
  id: string;
  color: Color;
  price: number; // Base price
  sizePrices?: SizePrice[]; // Size-specific pricing
  inStock: boolean;
  stockQuantity: number;
  images: VariationImage[];
  positionMapping?: string; // Which position this variant represents (front/back/side)
  designFrames?: DesignFrame[]; // Variation-specific design frames
  designCostPerCm2?: number; // Variation-specific cost per square centimeter
}

export interface ProductDocument {
  _id?: ObjectId;
  name: string;
  nameTranslations?: {
    en?: string;
    sv?: string;
  };
  price: number;
  image: string;
  categoryId: string;
  subcategoryIds?: string[];
  description?: string;
  descriptionTranslations?: {
    en?: string;
    sv?: string;
  };
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasVariations?: boolean;
  variations?: Variation[];
  // Available sizes for products without variations
  availableSizes?: string[]; // e.g., ["XS", "S", "M", "L", "XL", "XXL"]
  // If true, product is eligible for global/app coupons and will have discounts applied
  eligibleForCoupons?: boolean;
  type?: string; // Product type (e.g., 'stickers', 't-shirt', etc.)
  baseColor?: string; // Default/base color for the product
  angles?: string[]; // Available viewing angles (e.g., ['front', 'back', 'left', 'right'])
  colors?: string[]; // Available colors for non-variation products
  // Individual angle images for single products without variations
  frontImage?: string;
  backImage?: string;
  leftImage?: string;
  rightImage?: string;
  materialImage?: string;
  frontAltText?: string;
  backAltText?: string;
  leftAltText?: string;
  rightAltText?: string;
  materialAltText?: string;
  // Purchase limit settings
  purchaseLimit?: {
    enabled: boolean; // Whether purchase limits are enabled for this product
    maxQuantityPerOrder: number; // Maximum quantity per order
    message?: string; // Custom message to show when limit is exceeded
  };
  // Design capabilities
  isDesignable?: boolean; // Whether this product can be customized in the design tool
  designFrames?: DesignFrame[]; // Design frames with positions and dimensions
  designCostPerCm2?: number; // Default cost per square centimeter for design
  variantPositionMappings?: VariantPositionMapping[]; // Maps variants to positions
}

export interface Product {
  id: string;
  name: string;
  nameTranslations?: {
    en?: string;
    sv?: string;
  };
  price: number;
  image: string;
  categoryId: string;
  subcategoryIds?: string[];
  description?: string;
  descriptionTranslations?: {
    en?: string;
    sv?: string;
  };
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  hasVariations?: boolean;
  variations?: Variation[];
  // Available sizes for products without variations
  availableSizes?: string[]; // e.g., ["XS", "S", "M", "L", "XL", "XXL"]
  // Mirrors ProductDocument. If true, this product participates in coupon discounts
  eligibleForCoupons?: boolean;
  type?: string; // Product type (e.g., 'stickers', 't-shirt', etc.)
  baseColor?: string; // Default/base color for the product
  angles?: string[]; // Available viewing angles (e.g., ['front', 'back', 'left', 'right'])
  colors?: string[]; // Available colors for non-variation products
  // Individual angle images for single products without variations
  frontImage?: string;
  backImage?: string;
  leftImage?: string;
  rightImage?: string;
  materialImage?: string;
  frontAltText?: string;
  backAltText?: string;
  leftAltText?: string;
  rightAltText?: string;
  materialAltText?: string;
  // Purchase limit settings
  purchaseLimit?: {
    enabled: boolean; // Whether purchase limits are enabled for this product
    maxQuantityPerOrder: number; // Maximum quantity per order
    message?: string; // Custom message to show when limit is exceeded
  };
  // Design capabilities
  isDesignable?: boolean; // Whether this product can be customized in the design tool
  designFrames?: DesignFrame[]; // Design frames with positions and dimensions
  designCostPerCm2?: number; // Default cost per square centimeter for design
  variantPositionMappings?: VariantPositionMapping[]; // Maps variants to positions
}
