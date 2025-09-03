import { getDatabase } from "../lib/mongodb"
import { getProductImage } from "../lib/utils/product-image"

async function debugProductImages() {
  const db = await getDatabase()
  const collection = db.collection("products")
  
  // Get all products
  const products = await collection.find({}).limit(50).toArray()
  
  console.log(`\nAnalyzing ${products.length} products...\n`)
  
  const noImageProducts: any[] = []
  const variantOnlyProducts: any[] = []
  const mainImageProducts: any[] = []
  
  for (const product of products) {
    const imageUrl = getProductImage(product)
    
    if (imageUrl === '/placeholder.jpg') {
      noImageProducts.push(product)
      
      // Debug why it has no image
      console.log(`\n❌ NO IMAGE: ${product.name}`)
      console.log(`  - ID: ${product._id}`)
      console.log(`  - Has image field: ${!!product.image} (value: ${product.image})`)
      console.log(`  - Has variants: ${!!product.variants} (count: ${product.variants?.length || 0})`)
      if (product.variants && product.variants.length > 0) {
        console.log(`  - First variant:`)
        const variant = product.variants[0]
        console.log(`    - variant_image: ${variant.variant_image}`)
        console.log(`    - image: ${variant.image}`)
        console.log(`    - images: ${variant.images?.length || 0} items`)
      }
      console.log(`  - Has variations: ${!!product.variations} (count: ${product.variations?.length || 0})`)
      if (product.variations && product.variations.length > 0) {
        console.log(`  - First variation:`)
        const variation = product.variations[0]
        console.log(`    - images: ${variation.images?.length || 0} items`)
        if (variation.images && variation.images.length > 0) {
          console.log(`    - First image: ${JSON.stringify(variation.images[0])}`)
        }
      }
      console.log(`  - Has images array: ${!!product.images} (count: ${product.images?.length || 0})`)
      console.log(`  - Has frontImage: ${!!product.frontImage}`)
      console.log(`  - Has backImage: ${!!product.backImage}`)
      
      // Log all keys to see what fields exist
      console.log(`  - All keys: ${Object.keys(product).join(', ')}`)
    } else if (!product.image || product.image === '/placeholder.jpg') {
      variantOnlyProducts.push(product)
    } else {
      mainImageProducts.push(product)
    }
  }
  
  console.log(`\n\n=== SUMMARY ===`)
  console.log(`Total products analyzed: ${products.length}`)
  console.log(`Products with main image: ${mainImageProducts.length}`)
  console.log(`Products using variant images: ${variantOnlyProducts.length}`)
  console.log(`Products with NO images: ${noImageProducts.length}`)
  
  if (noImageProducts.length > 0) {
    console.log(`\n=== Products with NO images ===`)
    noImageProducts.forEach(p => {
      console.log(`- ${p.name} (ID: ${p._id})`)
    })
  }
  
  process.exit(0)
}

debugProductImages().catch(console.error)