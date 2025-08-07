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

export interface Variation {
  id: string;
  color: Color;
  price: number; // Base price
  sizePrices?: SizePrice[]; // Size-specific pricing
  inStock: boolean;
  stockQuantity: number;
  images: VariationImage[];
}

export interface ProductDocument {
  _id?: ObjectId;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasVariations?: boolean;
  variations?: Variation[];
  type?: string; // Product type (e.g., 'stickers', 't-shirt', etc.)
  baseColor?: string; // Default/base color for the product
  angles?: string[]; // Available viewing angles (e.g., ['front', 'back', 'left', 'right'])
  colors?: string[]; // Available colors for non-variation products
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description?: string;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  hasVariations?: boolean;
  variations?: Variation[];
  type?: string; // Product type (e.g., 'stickers', 't-shirt', etc.)
  baseColor?: string; // Default/base color for the product
  angles?: string[]; // Available viewing angles (e.g., ['front', 'back', 'left', 'right'])
  colors?: string[]; // Available colors for non-variation products
}
