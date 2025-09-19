const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

async function findEmptySubcategories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printwrap';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('printwrap-pro');
    const products = db.collection('products');
    const subcategories = db.collection('subcategories');
    const categories = db.collection('categories');
    
    // Read the backup JSON to search for potential matches
    const jsonContent = fs.readFileSync('products-backup-1757320722828.json', 'utf8');
    const backupProducts = JSON.parse(jsonContent);
    
    // Get all subcategories and categories
    const allSubcategories = await subcategories.find({}).toArray();
    const allCategories = await categories.find({}).toArray();
    
    const catMap = {};
    allCategories.forEach(cat => {
      catMap[cat._id.toString()] = cat.name;
    });
    
    console.log('=== ANALYZING EMPTY SUBCATEGORIES ===\n');
    
    const emptySubcategories = [];
    const populatedSubcategories = [];
    
    // Check each subcategory
    for (const subcat of allSubcategories) {
      const count = await products.countDocuments({ 
        subcategoryId: subcat._id 
      });
      
      if (count === 0) {
        emptySubcategories.push({
          name: subcat.name,
          swedish: subcat.swedishName,
          slug: subcat.slug,
          category: catMap[subcat.categoryId] || 'Unknown',
          categoryId: subcat.categoryId,
          id: subcat._id
        });
      } else {
        populatedSubcategories.push({
          name: subcat.name,
          count: count
        });
      }
    }
    
    console.log(`Total subcategories: ${allSubcategories.length}`);
    console.log(`Empty subcategories: ${emptySubcategories.length}`);
    console.log(`Populated subcategories: ${populatedSubcategories.length}\n`);
    
    // Group empty subcategories by category
    const emptyByCategory = {};
    emptySubcategories.forEach(sub => {
      if (!emptyByCategory[sub.category]) {
        emptyByCategory[sub.category] = [];
      }
      emptyByCategory[sub.category].push(sub);
    });
    
    console.log('=== EMPTY SUBCATEGORIES BY CATEGORY ===\n');
    
    // For each empty subcategory, search for potential products in the JSON
    for (const [category, subs] of Object.entries(emptyByCategory)) {
      console.log(`${category} (${subs.length} empty subcategories):`);
      
      for (const sub of subs) {
        const swedish = sub.swedish ? ` (${sub.swedish})` : '';
        console.log(`\n  • ${sub.name}${swedish} [slug: ${sub.slug}]`);
        
        // Search for products that might match this subcategory
        const potentialMatches = [];
        const searchTerms = [
          sub.name.toLowerCase(),
          sub.slug.toLowerCase(),
          sub.swedish?.toLowerCase()
        ].filter(Boolean);
        
        for (const product of backupProducts) {
          const productName = (product.name || '').toLowerCase();
          const productDesc = (product.description || '').toLowerCase();
          const combinedText = productName + ' ' + productDesc;
          
          for (const term of searchTerms) {
            if (combinedText.includes(term)) {
              potentialMatches.push(product.name);
              break;
            }
          }
          
          if (potentialMatches.length >= 3) break; // Just show a few examples
        }
        
        if (potentialMatches.length > 0) {
          console.log(`    Potential matches found:`);
          potentialMatches.forEach(name => {
            console.log(`      - ${name.substring(0, 50)}`);
          });
        } else {
          console.log(`    No products match this subcategory name`);
        }
      }
      console.log();
    }
    
    // Check for patterns in empty subcategories
    console.log('=== PATTERN ANALYSIS ===\n');
    
    // Check which categories have the most empty subcategories
    const emptyCounts = {};
    Object.entries(emptyByCategory).forEach(([cat, subs]) => {
      emptyCounts[cat] = subs.length;
    });
    
    console.log('Categories with most empty subcategories:');
    Object.entries(emptyCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} empty subcategories`);
      });
    
    // Check if these are Swedish-specific subcategories
    console.log('\n=== SWEDISH VS ENGLISH SUBCATEGORIES ===\n');
    let swedishOnly = 0;
    let englishOnly = 0;
    let both = 0;
    
    emptySubcategories.forEach(sub => {
      if (sub.swedish && !sub.name.match(/^[a-z\s\-]+$/i)) {
        swedishOnly++;
      } else if (!sub.swedish) {
        englishOnly++;
      } else {
        both++;
      }
    });
    
    console.log(`Swedish names only: ${swedishOnly}`);
    console.log(`English names only: ${englishOnly}`);
    console.log(`Both languages: ${both}`);
    
    // Look for specific patterns in names
    console.log('\n=== COMMON PATTERNS IN EMPTY SUBCATEGORY NAMES ===\n');
    
    const patterns = {
      'Budget/Cheap items': emptySubcategories.filter(s => 
        s.name.toLowerCase().includes('budget') || 
        s.name.toLowerCase().includes('billiga') ||
        s.name.toLowerCase().includes('cheap')
      ),
      'Organic/Eco items': emptySubcategories.filter(s => 
        s.name.toLowerCase().includes('organic') || 
        s.name.toLowerCase().includes('ekologisk') ||
        s.name.toLowerCase().includes('eco')
      ),
      'Fair Trade items': emptySubcategories.filter(s => 
        s.name.toLowerCase().includes('fair') || 
        s.name.toLowerCase().includes('fairtrade')
      ),
      'Gender-specific items': emptySubcategories.filter(s => 
        s.name.toLowerCase().includes('men') || 
        s.name.toLowerCase().includes('women') ||
        s.name.toLowerCase().includes('dam') ||
        s.name.toLowerCase().includes('herr')
      ),
      'Kids items': emptySubcategories.filter(s => 
        s.name.toLowerCase().includes('kid') || 
        s.name.toLowerCase().includes('barn') ||
        s.name.toLowerCase().includes('junior')
      ),
      'Specific types': emptySubcategories.filter(s => 
        s.name.toLowerCase().includes('long sleeve') || 
        s.name.toLowerCase().includes('short sleeve') ||
        s.name.toLowerCase().includes('v-neck') ||
        s.name.toLowerCase().includes('crew neck')
      )
    };
    
    Object.entries(patterns).forEach(([pattern, subs]) => {
      if (subs.length > 0) {
        console.log(`${pattern}: ${subs.length} subcategories`);
        subs.slice(0, 5).forEach(sub => {
          console.log(`  - ${sub.name} (${sub.category})`);
        });
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findEmptySubcategories();