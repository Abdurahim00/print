/**
 * Utility functions for handling product images
 */

export function getProductImage(product: any): string {
  if (!product) return '/placeholder.jpg'
  
  // Helper function to check if image URL is valid
  const isValidImage = (url: any): boolean => {
    return url && typeof url === 'string' && url.trim() !== '' && url !== '/placeholder.jpg'
  }
  
  // Debug logging to understand product structure
  if (product.name && product.name.includes('Example')) {
    console.log('Product image debug:', {
      name: product.name,
      hasImage: !!product.image,
      hasVariants: !!product.variants,
      variantsCount: product.variants?.length,
      hasVariations: !!product.variations,
      variationsCount: product.variations?.length
    })
  }
  
  // Check imageUrl field first (this is what the API returns)
  if (isValidImage(product.imageUrl)) {
    return product.imageUrl
  }
  
  // Then check images array (from database)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    for (const url of product.images) {
      if (isValidImage(url)) {
        return url
      }
    }
  }
  
  // Check the single image field
  if (isValidImage(product.image)) {
    return product.image
  }
  
  // PRENDO DATA: Check image_urls array (from Prendo JSON)
  if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    for (const url of product.image_urls) {
      if (isValidImage(url)) {
        return url
      }
    }
  }
  
  // Check colors array for images (products often have color variants with images)
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
    for (const color of product.colors) {
      if (color.images && Array.isArray(color.images) && color.images.length > 0) {
        const img = color.images[0]
        if (isValidImage(img)) {
          return img
        }
      }
    }
  }
  
  // PRENDO DATA: Check variants_dict (Prendo uses variants_dict, not variants)
  const variantsArray = product.variants_dict || product.variants
  if (variantsArray && Array.isArray(variantsArray) && variantsArray.length > 0) {
    for (const variant of variantsArray) {
      // Try variant_image first
      if (isValidImage(variant.variant_image)) {
        return variant.variant_image
      }
      // Then try image
      if (isValidImage(variant.image)) {
        return variant.image
      }
      // Then try images array
      if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
        const img = variant.images[0]
        if (isValidImage(img)) {
          return img
        }
        if (img && typeof img === 'object' && isValidImage(img.url)) {
          return img.url
        }
      }
    }
  }
  
  if (product.variations && Array.isArray(product.variations) && product.variations.length > 0) {
    for (const variation of product.variations) {
      if (variation.images && Array.isArray(variation.images) && variation.images.length > 0) {
        // Look for primary image first
        const primaryImage = variation.images.find((img: any) => img.is_primary)
        if (primaryImage) {
          const url = primaryImage.url || primaryImage
          if (isValidImage(url)) {
            return url
          }
        }
        // Otherwise use first image
        const firstImg = variation.images[0]
        if (isValidImage(firstImg)) {
          return firstImg
        }
        if (firstImg && typeof firstImg === 'object' && isValidImage(firstImg.url)) {
          return firstImg.url
        }
      }
    }
  }
  
  // Then try the main image
  if (isValidImage(product.image)) {
    return product.image
  }
  
  // Then try individual angle images
  if (isValidImage(product.frontImage)) {
    return product.frontImage
  }
  
  if (isValidImage(product.backImage)) {
    return product.backImage
  }
  
  if (isValidImage(product.leftImage)) {
    return product.leftImage
  }
  
  if (isValidImage(product.rightImage)) {
    return product.rightImage
  }
  
  if (isValidImage(product.materialImage)) {
    return product.materialImage
  }
  
  // Then try images array
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    for (const img of product.images) {
      if (isValidImage(img)) {
        return img
      }
      if (img && typeof img === 'object' && isValidImage(img.url)) {
        return img.url
      }
    }
  }
  
  // Default placeholder
  return '/placeholder.jpg'
}

export function getAllProductImages(product: any): string[] {
  const images: string[] = []
  if (!product) return images
  
  // Helper function to check if image URL is valid
  const isValidImage = (url: any): boolean => {
    return url && typeof url === 'string' && url.trim() !== '' && url !== '/placeholder.jpg'
  }
  
  // PRENDO DATA: Add image_urls array first (from Prendo JSON)
  if (product.image_urls && Array.isArray(product.image_urls)) {
    product.image_urls.forEach((url: string) => {
      if (isValidImage(url)) {
        images.push(url)
      }
    })
  }
  
  // Add main image if it exists
  if (isValidImage(product.image)) {
    images.push(product.image)
  }
  
  // Add individual angle images
  if (isValidImage(product.frontImage)) {
    images.push(product.frontImage)
  }
  if (isValidImage(product.backImage)) {
    images.push(product.backImage)
  }
  if (isValidImage(product.leftImage)) {
    images.push(product.leftImage)
  }
  if (isValidImage(product.rightImage)) {
    images.push(product.rightImage)
  }
  if (isValidImage(product.materialImage)) {
    images.push(product.materialImage)
  }
  
  // Add images array
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      if (isValidImage(img)) {
        images.push(img)
      } else if (img && typeof img === 'object' && isValidImage(img.url)) {
        images.push(img.url)
      }
    })
  }
  
  // PRENDO DATA: Check both variants_dict and variants (Prendo uses variants_dict)
  const variantsArray = product.variants_dict || product.variants
  if (variantsArray && Array.isArray(variantsArray)) {
    variantsArray.forEach((variant: any) => {
      if (isValidImage(variant.variant_image)) {
        images.push(variant.variant_image)
      }
      if (isValidImage(variant.image)) {
        images.push(variant.image)
      }
      if (variant.images && Array.isArray(variant.images)) {
        variant.images.forEach((img: any) => {
          if (isValidImage(img)) {
            images.push(img)
          } else if (img && typeof img === 'object' && isValidImage(img.url)) {
            images.push(img.url)
          }
        })
      }
    })
  }
  
  // Add variation images
  if (product.variations && Array.isArray(product.variations)) {
    product.variations.forEach((variation: any) => {
      if (variation.images && Array.isArray(variation.images)) {
        variation.images.forEach((img: any) => {
          if (isValidImage(img)) {
            images.push(img)
          } else if (img && typeof img === 'object' && isValidImage(img.url)) {
            images.push(img.url)
          }
        })
      }
    })
  }
  
  // Remove duplicates and filter out empty/invalid values
  return [...new Set(images)].filter(isValidImage)
}