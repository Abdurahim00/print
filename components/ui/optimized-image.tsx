import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate sizes for responsive images if not provided
  const defaultSizes = fill
    ? sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined

  // Fallback for error state
  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          className,
          fill ? 'absolute inset-0' : ''
        )}
        style={!fill ? { width, height } : undefined}
      >
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  const imageProps = fill
    ? { fill: true }
    : { width: width || 500, height: height || 500 }

  return (
    <div className={cn('relative overflow-hidden', className, fill ? '' : 'inline-block')}>
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse',
            fill ? '' : 'rounded'
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        {...imageProps}
        quality={quality}
        priority={priority}
        sizes={defaultSizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
          fill ? 'object-cover' : ''
        )}
        style={fill ? { objectFit } : undefined}
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}

// Prefetch an image URL
export function prefetchImage(src: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  }
}

// Wrapper component for product images with specific optimizations
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  prefetch = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  prefetch?: boolean
}) {
  useEffect(() => {
    if (prefetch && !priority) {
      prefetchImage(src)
    }
  }, [src, prefetch, priority])
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      className={className}
      priority={priority}
      quality={85}
      objectFit="contain"
    />
  )
}

// Wrapper component for thumbnail images
export function ThumbnailImage({
  src,
  alt,
  width = 100,
  height = 100,
  className,
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={60}
    />
  )
}