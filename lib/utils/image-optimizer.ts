/**
 * Image optimization utilities for handling external and internal images
 */

interface ImageLoaderProps {
  src: string
  width: number
  quality?: number
}

/**
 * Custom image loader for Next.js Image component
 * Handles both external URLs and local images
 */
export const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // If it's an external URL (Unsplash, etc.), use their optimization params
  if (src.startsWith('https://images.unsplash.com')) {
    const url = new URL(src)
    url.searchParams.set('w', width.toString())
    url.searchParams.set('q', (quality || 75).toString())
    url.searchParams.set('fm', 'webp')
    url.searchParams.set('auto', 'format')
    return url.toString()
  }
  
  // For other external URLs, return as-is (Next.js will handle via proxy)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  
  // For local images, use Next.js optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}

/**
 * Generate responsive image sizes based on container
 */
export const generateImageSizes = (containerType: 'card' | 'detail' | 'thumbnail' | 'hero') => {
  switch (containerType) {
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    case 'detail':
      return '(max-width: 768px) 100vw, 50vw'
    case 'thumbnail':
      return '80px'
    case 'hero':
      return '100vw'
    default:
      return '100vw'
  }
}

/**
 * Preload critical images for performance
 */
export const preloadImage = (src: string, priority: boolean = false) => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = priority ? 'preload' : 'prefetch'
  link.as = 'image'
  link.href = src
  link.type = 'image/webp'
  document.head.appendChild(link)
}

/**
 * Generate blur data URL for placeholder
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`

/**
 * Check if image URL is valid and accessible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && response.headers.get('content-type')?.startsWith('image/')
  } catch {
    return false
  }
}

/**
 * Get optimized image URL with fallback
 */
export const getOptimizedImageUrl = (
  url: string | undefined,
  fallback: string = '/placeholder.jpg'
): string => {
  if (!url) return fallback
  
  // Handle relative URLs
  if (url.startsWith('/')) return url
  
  // Handle external URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Replace Unsplash URLs with optimized versions
    if (url.includes('unsplash.com') && !url.includes('fm=webp')) {
      const optimizedUrl = new URL(url)
      optimizedUrl.searchParams.set('fm', 'webp')
      optimizedUrl.searchParams.set('auto', 'format')
      optimizedUrl.searchParams.set('fit', 'crop')
      return optimizedUrl.toString()
    }
    return url
  }
  
  return fallback
}