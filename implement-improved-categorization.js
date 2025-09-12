#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const fs = require('fs');

// Load improved categorization data
const improvedProducts = JSON.parse(
  fs.readFileSync('products-improved-categorization.json', 'utf8')
);

async function implementCategorization() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/printwrap-pro?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('printwrap-pro');
    const productsCollection = db.collection('products');
    const subcategoriesCollection = db.collection('subcategories');

    // First, get all unique subcategories from improved data
    const subcategoriesSet = new Set();
    const subcategoryMap = {};
    
    improvedProducts.forEach(product => {
      const subcat = product.extractedSubcategory;
      if (subcat && !subcat.includes('general-') && !subcat.includes('other-')) {
        subcategoriesSet.add(subcat);
        
        // Map subcategory to its most common category
        const categoryId = product.category;
        if (!subcategoryMap[subcat]) {
          subcategoryMap[subcat] = { categoryId, count: 0 };
        }
        subcategoryMap[subcat].count++;
      }
    });

    console.log(`\n📁 Found ${subcategoriesSet.size} unique specific subcategories`);

    // Create subcategory documents
    const subcategoryDocs = Array.from(subcategoriesSet).map(slug => {
      // Convert slug to display name
      const name = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        slug,
        name,
        categoryId: subcategoryMap[slug].categoryId,
        productCount: subcategoryMap[slug].count,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Insert or update subcategories
    console.log('\n🔄 Updating subcategories collection...');
    for (const subcat of subcategoryDocs) {
      await subcategoriesCollection.updateOne(
        { slug: subcat.slug },
        { $set: subcat },
        { upsert: true }
      );
    }
    console.log(`✅ Updated ${subcategoryDocs.length} subcategories`);

    // Now update products with their subcategory references
    console.log('\n🔄 Updating products with subcategory references...');
    
    const bulkOps = [];
    let processedCount = 0;
    let skippedCount = 0;

    for (const product of improvedProducts) {
      const subcatSlug = product.extractedSubcategory;
      
      // Skip generic categories
      if (!subcatSlug || subcatSlug.includes('general-') || subcatSlug.includes('other-')) {
        skippedCount++;
        continue;
      }

      // Find the subcategory document
      const subcatDoc = await subcategoriesCollection.findOne({ slug: subcatSlug });
      
      if (subcatDoc) {
        bulkOps.push({
          updateOne: {
            filter: { 
              $or: [
                { _id: product._id },
                { sourceUrl: product.sourceUrl },
                { variant_url: product.variant_url }
              ]
            },
            update: {
              $set: {
                subcategoryId: subcatDoc._id,
                subcategorySlug: subcatSlug,
                categoryId: product.category,
                updatedAt: new Date()
              }
            }
          }
        });

        processedCount++;

        // Execute in batches of 1000
        if (bulkOps.length >= 1000) {
          console.log(`  Processing batch of ${bulkOps.length} products...`);
          const result = await productsCollection.bulkWrite(bulkOps);
          console.log(`  ✅ Updated ${result.modifiedCount} products`);
          bulkOps.length = 0;
        }
      }
    }

    // Execute remaining operations
    if (bulkOps.length > 0) {
      console.log(`  Processing final batch of ${bulkOps.length} products...`);
      const result = await productsCollection.bulkWrite(bulkOps);
      console.log(`  ✅ Updated ${result.modifiedCount} products`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`  - Products with specific subcategories: ${processedCount}`);
    console.log(`  - Products with generic/other categories: ${skippedCount}`);
    console.log(`  - Unique subcategories created: ${subcategoryDocs.length}`);

    // Clean up unused subcategories
    console.log('\n🧹 Cleaning up unused subcategories...');
    const activeSubcategories = await subcategoriesCollection
      .find({ slug: { $in: Array.from(subcategoriesSet) } })
      .toArray();
    
    const activeIds = activeSubcategories.map(s => s._id);
    
    // Find products with subcategoryIds not in our active list
    const orphanedProducts = await productsCollection.countDocuments({
      subcategoryId: { $exists: true, $nin: activeIds }
    });

    if (orphanedProducts > 0) {
      console.log(`  Found ${orphanedProducts} products with invalid subcategory references`);
      await productsCollection.updateMany(
        { subcategoryId: { $exists: true, $nin: activeIds } },
        { $unset: { subcategoryId: "", subcategorySlug: "" } }
      );
      console.log(`  ✅ Cleaned up invalid references`);
    }

    // Update product counts in subcategories
    console.log('\n📈 Updating product counts...');
    for (const subcat of activeSubcategories) {
      const count = await productsCollection.countDocuments({ subcategoryId: subcat._id });
      await subcategoriesCollection.updateOne(
        { _id: subcat._id },
        { $set: { productCount: count } }
      );
    }

    console.log('\n✨ Categorization implementation complete!');
    
    // Final statistics
    const totalProducts = await productsCollection.countDocuments();
    const categorizedProducts = await productsCollection.countDocuments({ 
      subcategoryId: { $exists: true } 
    });
    const percentage = ((categorizedProducts / totalProducts) * 100).toFixed(1);
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`  Total products: ${totalProducts}`);
    console.log(`  Categorized products: ${categorizedProducts} (${percentage}%)`);
    console.log(`  Uncategorized products: ${totalProducts - categorizedProducts}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the implementation
implementCategorization().catch(console.error);