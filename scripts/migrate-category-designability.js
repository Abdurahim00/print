const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

// Define which categories/subcategories are designable by default
const DESIGNABLE_RULES = {
  // Main categories
  'profilklader': {
    isDesignable: true,
    designableAreas: ['front', 'back'],
    designTechniques: ['print', 'embroidery'],
    subcategories: {
      't-shirt': {
        isDesignable: true,
        designableAreas: ['front', 'back', 'sleeve'],
        designTechniques: ['print', 'sublimation']
      },
      'piketrojor': {
        isDesignable: true,
        designableAreas: ['front', 'back', 'chest'],
        designTechniques: ['print', 'embroidery']
      },
      'trojor': {
        isDesignable: true,
        designableAreas: ['front', 'back'],
        designTechniques: ['print', 'embroidery']
      },
      'kepsar': {
        isDesignable: true,
        designableAreas: ['front'],
        designTechniques: ['embroidery', 'print']
      },
      'jackor': {
        isDesignable: true,
        designableAreas: ['back', 'chest'],
        designTechniques: ['embroidery', 'print']
      },
      'strumpor-sockar': {
        isDesignable: false
      },
      'skor': {
        isDesignable: false
      }
    }
  },
  'giveaways': {
    isDesignable: true,
    designableAreas: ['front'],
    designTechniques: ['print'],
    subcategories: {
      'pennor': {
        isDesignable: true,
        designableAreas: ['body'],
        designTechniques: ['print', 'engraving']
      },
      'muggar': {
        isDesignable: true,
        designableAreas: ['wrap', 'front'],
        designTechniques: ['sublimation', 'print']
      },
      'vattenflaskor': {
        isDesignable: true,
        designableAreas: ['front', 'wrap'],
        designTechniques: ['print']
      },
      'nyckelband': {
        isDesignable: true,
        designableAreas: ['strap'],
        designTechniques: ['print']
      },
      'godis': {
        isDesignable: false
      },
      'handsprit': {
        isDesignable: false
      }
    }
  },
  'trycksaker': {
    isDesignable: true,
    designableAreas: ['front', 'back'],
    designTechniques: ['print'],
    subcategories: {}
  },
  'massmaterial': {
    isDesignable: true,
    designableAreas: ['front'],
    designTechniques: ['print'],
    subcategories: {
      'reklamflaggor': {
        isDesignable: true,
        designableAreas: ['front'],
        designTechniques: ['print', 'sublimation']
      },
      'rollup-popup': {
        isDesignable: true,
        designableAreas: ['front'],
        designTechniques: ['print']
      },
      'mattor': {
        isDesignable: true,
        designableAreas: ['top'],
        designTechniques: ['print']
      }
    }
  },
  'presentreklam': {
    isDesignable: true,
    designableAreas: ['front'],
    designTechniques: ['print', 'engraving'],
    subcategories: {
      'vaskor': {
        isDesignable: true,
        designableAreas: ['front', 'side'],
        designTechniques: ['print', 'embroidery']
      },
      'usb-minnen': {
        isDesignable: true,
        designableAreas: ['body'],
        designTechniques: ['print', 'engraving']
      },
      'powerbank': {
        isDesignable: true,
        designableAreas: ['front'],
        designTechniques: ['print', 'engraving']
      }
    }
  },
  // Non-designable categories
  'foretagsgavor': {
    isDesignable: false
  },
  'kontor-forbrukning': {
    isDesignable: false
  },
  'arbetsklader': {
    isDesignable: false
  },
  'personligt-skydd': {
    isDesignable: false
  },
  'miljovanliga-profilprodukter': {
    isDesignable: true,
    designableAreas: ['front'],
    designTechniques: ['print', 'embroidery']
  },
  'varumarken': {
    isDesignable: false
  }
}

async function migrateCategories() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap-pro')
    const categoriesCollection = database.collection('categories')
    const subcategoriesCollection = database.collection('subcategories')

    // Get all categories
    const categories = await categoriesCollection.find({}).toArray()
    const subcategories = await subcategoriesCollection.find({}).toArray()

    console.log(`Found ${categories.length} categories and ${subcategories.length} subcategories`)

    // Update categories
    let categoryUpdateCount = 0
    for (const category of categories) {
      const rule = DESIGNABLE_RULES[category.slug]
      
      if (rule) {
        const update = {
          isDesignable: rule.isDesignable || false,
          designableAreas: rule.designableAreas || [],
          designTechniques: rule.designTechniques || []
        }

        await categoriesCollection.updateOne(
          { _id: category._id },
          { $set: update }
        )

        categoryUpdateCount++
        console.log(`Updated category "${category.name}" - Designable: ${update.isDesignable}`)
      } else {
        // Default to non-designable if no rule defined
        await categoriesCollection.updateOne(
          { _id: category._id },
          { $set: { isDesignable: false, designableAreas: [], designTechniques: [] } }
        )
        categoryUpdateCount++
        console.log(`Updated category "${category.name}" - Designable: false (no rule defined)`)
      }
    }

    // Update subcategories
    let subcategoryUpdateCount = 0
    for (const subcategory of subcategories) {
      // Find parent category
      const parentCategory = categories.find(c => c._id.toString() === subcategory.categoryId.toString())
      
      if (parentCategory) {
        const parentRule = DESIGNABLE_RULES[parentCategory.slug]
        const subcatRule = parentRule?.subcategories?.[subcategory.slug.split('/').pop()]
        
        let update = {}
        
        if (subcatRule) {
          // Subcategory has specific rule
          update = {
            isDesignable: subcatRule.isDesignable,
            designableAreas: subcatRule.designableAreas || parentRule?.designableAreas || [],
            designTechniques: subcatRule.designTechniques || parentRule?.designTechniques || [],
            inheritDesignSettings: false
          }
        } else if (parentRule) {
          // Inherit from parent
          update = {
            inheritDesignSettings: true,
            isDesignable: parentRule.isDesignable,
            designableAreas: parentRule.designableAreas || [],
            designTechniques: parentRule.designTechniques || []
          }
        } else {
          // No rule, default to non-designable
          update = {
            isDesignable: false,
            designableAreas: [],
            designTechniques: [],
            inheritDesignSettings: false
          }
        }

        await subcategoriesCollection.updateOne(
          { _id: subcategory._id },
          { $set: update }
        )

        subcategoryUpdateCount++
        console.log(`Updated subcategory "${subcategory.name}" - Designable: ${update.isDesignable}, Inherit: ${update.inheritDesignSettings}`)
      }
    }

    console.log(`\n✅ Migration completed successfully!`)
    console.log(`   - Updated ${categoryUpdateCount} categories`)
    console.log(`   - Updated ${subcategoryUpdateCount} subcategories`)

    // Show summary
    const designableCategories = await categoriesCollection.find({ isDesignable: true }).toArray()
    const designableSubcategories = await subcategoriesCollection.find({ isDesignable: true }).toArray()
    
    console.log(`\n📊 Summary:`)
    console.log(`   - ${designableCategories.length} designable categories`)
    console.log(`   - ${designableSubcategories.length} designable subcategories`)
    
    console.log(`\nDesignable categories:`)
    for (const cat of designableCategories) {
      console.log(`   - ${cat.name}: Areas: [${cat.designableAreas.join(', ')}], Techniques: [${cat.designTechniques.join(', ')}]`)
    }

  } catch (error) {
    console.error('Error during migration:', error)
  } finally {
    await client.close()
    console.log('\nDatabase connection closed')
  }
}

// Run the migration
migrateCategories()