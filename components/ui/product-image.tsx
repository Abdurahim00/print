"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  className?: string
  loading?: 'lazy' | 'eager'
  quality?: number
  onLoad?: () => void
  onError?: () => void
  priority?: boolean
}

export function ProductImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className = '',
  loading = 'lazy',
  quality = 85,
  onLoad,
  onError,
  priority = false
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Check if src is a PDF
  const isPdf = src?.toLowerCase()?.endsWith('.pdf')
  
  // Reset states when src changes
  useEffect(() => {
    setImageError(false)
    setImageLoaded(false)
  }, [src])
  
  const handleLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }
  
  const handleError = () => {
    setImageError(true)
    setImageLoaded(true)
    onError?.()
  }
  
  // If it's a PDF, render an iframe or PDF preview
  if (isPdf && src) {
    // Option 1: Use Google Docs Viewer (works for public URLs)
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`
    
    return (
      <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
        {/* PDF Preview Container */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <svg
              className="w-16 h-16 mx-auto mb-2 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H13L15,19H13.5L13.1,18H11.9L11.5,19H10M11.3,16.5L10.9,17.5H13.1L12.7,16.5L12,14.9L11.3,16.5Z" />
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">PDF Document</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{alt}</p>
            {/* Open PDF button */}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View PDF
            </a>
          </div>
        </div>
        
        {/* Hidden iframe for preview (optional - can be shown on hover) */}
        <iframe
          src={googleViewerUrl}
          className="hidden"
          title={alt}
          width="100%"
          height="100%"
        />
      </div>
    )
  }
  
  // Regular image handling
  if (imageError || !src) {
    return (
      <div className={`relative ${fill ? 'w-full h-full' : ''} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-400"
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
            <p className="text-xs text-gray-500 dark:text-gray-400">{alt}</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Normal image rendering
  if (fill) {
    return (
      <>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={loading}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
        />
      </>
    )
  }
  
  return (
    <>
      {!imageLoaded && (
        <div 
          className="bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 400}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
      />
    </>
  )
}