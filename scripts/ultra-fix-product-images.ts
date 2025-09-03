import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap'
const DATABASE_NAME = process.env.DATABASE_NAME || 'printwrap'

interface PrendoProduct {
  Title: string
  description: string
  image_urls: string[]
  Sizes: string[]
  Article_no: string
  price_before_tax: string
  price_after_tax: string
  brand_info: string
  product_info: Record<string, string>
  variants_dict: Array<{
    variant_url: string
    variant_name: string
    variant_image: string
  }>
}

async function ultraFixProductImages() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const productsCollection = db.collection('products')
    
    // Load both Prendo JSON files with proper encoding handling
    let prendoFile1: PrendoProduct[] = []
    let prendoFile2: PrendoProduct[] = []
    
    try {
      const content1 = fs.readFileSync('prendo_unique_combine_output.json', 'utf-8')
      // Clean up any encoding issues
      const cleanContent1 = content1.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      prendoFile1 = JSON.parse(cleanContent1) as PrendoProduct[]
      console.log(`Loaded ${prendoFile1.length} products from prendo_unique_combine_output.json`)
    } catch (error) {
      console.warn('Could not load prendo_unique_combine_output.json:', error)
    }
    
    try {
      const content2 = fs.readFileSync('prendo_output_22_08_2025 (1).json', 'utf-8')
      // Clean up any encoding issues
      const cleanContent2 = content2.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      prendoFile2 = JSON.parse(cleanContent2) as PrendoProduct[]
      console.log(`Loaded ${prendoFile2.length} products from prendo_output_22_08_2025 (1).json`)
    } catch (error) {
      console.warn('Could not load prendo_output_22_08_2025 (1).json:', error)
    }
    
    // Combine all Prendo products
    const allPrendoProducts = [...prendoFile1, ...prendoFile2]
    console.log(`Loaded ${allPrendoProducts.length} total Prendo products`)
    
    // Create lookup map by article number
    const prendoMap = new Map<string, PrendoProduct>()
    allPrendoProducts.forEach(product => {
      if (product.Article_no) {
        prendoMap.set(product.Article_no, product)
      }
    })
    
    // Get all products from database
    const dbProducts = await productsCollection.find({}).toArray()
    console.log(`Found ${dbProducts.length} products in database`)
    
    let fixedCount = 0
    let variantsAddedCount = 0
    let imagesFixedCount = 0
    
    for (const dbProduct of dbProducts) {
      let updates: any = {}
      let updated = false
      
      // Try to find matching Prendo product
      const prendoProduct = prendoMap.get(dbProduct.sku) || 
                           prendoMap.get(dbProduct.originalData?.articleNo)
      
      if (prendoProduct) {
        // FIX 1: Update variants with full structure for design tool
        if (prendoProduct.variants_dict && prendoProduct.variants_dict.length > 0) {
          const variants = prendoProduct.variants_dict.map((v, index) => ({
            id: `variant-${index}`,
            variant_name: v.variant_name,
            variant_image: v.variant_image,
            image: v.variant_image,
            variant_url: v.variant_url,
            // For designable products, we'll store front/back/side images
            // These would come from a more detailed scrape or API
            frontImage: v.variant_image, // For now, using main image as placeholder
            backImage: null, // Would be populated with actual back image
            leftImage: null,
            rightImage: null,
            // Store color info for design tool
            color: {
              name: v.variant_name,
              hex: null, // Would be populated with actual color hex
              swatch_image: v.variant_image
            }
          }))
          
          updates.variants = variants
          updates.hasVariants = true
          updates.variants_dict = prendoProduct.variants_dict // Keep original too
          variantsAddedCount += variants.length
          updated = true
        }
        
        // FIX 2: Update main image if missing or placeholder
        const needsMainImage = !dbProduct.image || 
                              dbProduct.image === '' || 
                              dbProduct.image === 'https://via.placeholder.com/500' ||
                              dbProduct.image === '/placeholder.jpg'
        
        if (needsMainImage) {
          // Priority: variant image > image_urls > placeholder
          const newMainImage = prendoProduct.variants_dict?.[0]?.variant_image ||
                              prendoProduct.image_urls?.[0] ||
                              dbProduct.image
          
          if (newMainImage && newMainImage !== dbProduct.image) {
            updates.image = newMainImage
            imagesFixedCount++
            updated = true
          }
        }
        
        // FIX 3: Update images array with all available images
        const allImages: string[] = []
        
        // Add from image_urls
        if (prendoProduct.image_urls && prendoProduct.image_urls.length > 0) {
          allImages.push(...prendoProduct.image_urls)
        }
        
        // Add from variants
        if (prendoProduct.variants_dict) {
          prendoProduct.variants_dict.forEach(v => {
            if (v.variant_image) {
              allImages.push(v.variant_image)
            }
          })
        }
        
        // Remove duplicates
        const uniqueImages = [...new Set(allImages)].filter(img => 
          img && img !== '' && img !== 'https://via.placeholder.com/500'
        )
        
        if (uniqueImages.length > 0) {
          updates.images = uniqueImages
          updates.image_urls = prendoProduct.image_urls // Keep original too
          updated = true
        }
        
        // FIX 4: Add variations if missing (for backward compatibility)
        if (!dbProduct.variations || dbProduct.variations.length === 0) {
          if (prendoProduct.variants_dict && prendoProduct.variants_dict.length > 0) {
            updates.variations = prendoProduct.variants_dict.map(v => ({
              name: v.variant_name,
              image: v.variant_image,
              images: [v.variant_image], // Array for multiple angles
              price: dbProduct.price || dbProduct.basePrice,
              inStock: true
            }))
            updates.hasVariations = true
            updated = true
          }
        }
        
        // FIX 5: Ensure proper data structure for designable products
        // Check if product is in a designable category
        const designableCategories = ['apparel', 't-shirts', 'hoodies', 'bags', 'caps']
        const isDesignable = designableCategories.some(cat => 
          dbProduct.categoryId?.toLowerCase().includes(cat) ||
          dbProduct.tags?.some((tag: string) => tag.toLowerCase().includes(cat))
        )
        
        if (isDesignable) {
          updates.designableAreas = ['front', 'back'] // Default designable areas
          updates.isDesignable = true
        }
      }
      
      // Apply updates if any changes were made
      if (updated && Object.keys(updates).length > 0) {
        await productsCollection.updateOne(
          { _id: dbProduct._id },
          { $set: updates }
        )
        fixedCount++
        
        console.log(`✅ Fixed: ${dbProduct.name}`)
        if (updates.image) console.log(`   - Fixed main image`)
        if (updates.variants) console.log(`   - Added ${updates.variants.length} variants`)
        if (updates.images) console.log(`   - Added ${updates.images.length} images`)
        if (updates.isDesignable) console.log(`   - Marked as designable`)
      }
    }
    
    console.log('\n=== ULTRA FIX COMPLETE ===')
    console.log(`Total products fixed: ${fixedCount}`)
    console.log(`Images fixed: ${imagesFixedCount}`)
    console.log(`Variants added: ${variantsAddedCount}`)
    
    // Additional check: Find products that still have no images
    const stillNoImages = await productsCollection.find({
      $or: [
        { image: { $in: ['', null, 'https://via.placeholder.com/500', '/placeholder.jpg'] } },
        { image: { $exists: false } }
      ]
    }).toArray()
    
    if (stillNoImages.length > 0) {
      console.log(`\n⚠️  WARNING: ${stillNoImages.length} products still have no images:`)
      stillNoImages.slice(0, 5).forEach(p => {
        console.log(`   - ${p.name} (SKU: ${p.sku})`)
      })
      if (stillNoImages.length > 5) {
        console.log(`   ... and ${stillNoImages.length - 5} more`)
      }
    }
    
  } catch (error) {
    console.error('Error fixing product images:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
ultraFixProductImages().catch(console.error)