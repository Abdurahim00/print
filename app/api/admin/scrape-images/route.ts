import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

async function scrapeImagesFromUrl(url: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    })

    const html = await response.text()
    const images: string[] = []

    // Simple regex-based image extraction
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const dataRegex = /data-src=["']([^"']+)["']/gi
    const lazyRegex = /data-lazy=["']([^"']+)["']/gi

    let match
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1]
      if (src && !src.includes('placeholder') && !src.includes('logo')) {
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, url).href
        if (!images.includes(absoluteUrl)) {
          images.push(absoluteUrl)
        }
      }
    }

    while ((match = dataRegex.exec(html)) !== null) {
      const src = match[1]
      if (src && !src.includes('placeholder') && !src.includes('logo')) {
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, url).href
        if (!images.includes(absoluteUrl)) {
          images.push(absoluteUrl)
        }
      }
    }

    while ((match = lazyRegex.exec(html)) !== null) {
      const src = match[1]
      if (src && !src.includes('placeholder') && !src.includes('logo')) {
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, url).href
        if (!images.includes(absoluteUrl)) {
          images.push(absoluteUrl)
        }
      }
    }

    return images.slice(0, 10) // Return max 10 images
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return []
  }
}

export async function POST(request: Request) {
  try {
    const { limit = 10 } = await request.json()

    const { db } = await connectToDatabase()
    const collection = db.collection('products')

    // Get products without images
    const productsWithoutImages = await collection.find({
      $and: [
        { sourceUrl: { $exists: true, $ne: null, $ne: '' } },
        { $or: [
          { images: { $exists: false } },
          { images: { $size: 0 } },
          { images: null }
        ]}
      ]
    }).limit(limit).toArray()

    const results = []
    let updatedCount = 0
    let failedCount = 0

    for (const product of productsWithoutImages) {
      try {
        const images = await scrapeImagesFromUrl(product.sourceUrl)

        if (images.length > 0) {
          await collection.updateOne(
            { _id: product._id },
            {
              $set: {
                images: images,
                imageUrl: images[0],
                updatedAt: new Date()
              }
            }
          )
          updatedCount++
          results.push({
            productId: product._id,
            name: product.name,
            imagesFound: images.length,
            status: 'success'
          })
        } else {
          failedCount++
          results.push({
            productId: product._id,
            name: product.name,
            imagesFound: 0,
            status: 'no_images'
          })
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error: any) {
        failedCount++
        results.push({
          productId: product._id,
          name: product.name,
          error: error.message,
          status: 'error'
        })
      }
    }

    const stillMissingImages = await collection.countDocuments({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null }
      ]
    })

    return NextResponse.json({
      success: true,
      processed: productsWithoutImages.length,
      updated: updatedCount,
      failed: failedCount,
      stillMissing: stillMissingImages,
      results
    })
  } catch (error: any) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape images', details: error.message },
      { status: 500 }
    )
  }
}