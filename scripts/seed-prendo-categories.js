const { MongoClient, ObjectId } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://meerdanish029:q5BqGN5Wx10gihvb@printwrap.8wftxga.mongodb.net/'

// Parse Prendo sitemap URLs to extract category structure
const prendoUrls = [
  "https://www.prendo.se/med-tryck/profilklader",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/billiga-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/herr-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/dam-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/barn-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/funktions-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/v-ringade-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/fairtrade-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/ekologiska-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/t-shirt/langarmade-t-shirt",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/billiga-piketrojor",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/piketrojor-herr",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/piketrojor-dam",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/piketrojor-barn",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/piketrojor-funktion",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/fairtrade-piketrojor",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/ekologiska-piketrojor",
  "https://www.prendo.se/med-tryck/profilklader/piketrojor/langarmade-piketrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/polotrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/sweatshirts-collegetrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/huvtrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/damtrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/barntrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/understallstrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/v-ringade-trojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/cardigans",
  "https://www.prendo.se/med-tryck/profilklader/trojor/rundhalsade-trojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/stickade-trojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/fleecetrojor",
  "https://www.prendo.se/med-tryck/profilklader/trojor/ekologiska-trojor",
  "https://www.prendo.se/med-tryck/profilklader/skjortor",
  "https://www.prendo.se/med-tryck/profilklader/skjortor/billiga-skjortor",
  "https://www.prendo.se/med-tryck/profilklader/skjortor/herrskjortor",
  "https://www.prendo.se/med-tryck/profilklader/skjortor/damskjortor",
  "https://www.prendo.se/med-tryck/profilklader/skjortor/skjortor-kort-arm",
  "https://www.prendo.se/med-tryck/profilklader/skjortor/ekologiska-skjortor",
  "https://www.prendo.se/med-tryck/profilklader/jackor",
  "https://www.prendo.se/med-tryck/profilklader/kepsar",
  "https://www.prendo.se/med-tryck/profilklader/mossor",
  "https://www.prendo.se/med-tryck/profilklader/kavajer",
  "https://www.prendo.se/med-tryck/profilklader/byxor",
  "https://www.prendo.se/med-tryck/profilklader/shorts",
  "https://www.prendo.se/med-tryck/profilklader/kjolar",
  "https://www.prendo.se/med-tryck/profilklader/klanningar",
  "https://www.prendo.se/med-tryck/profilklader/vastar",
  "https://www.prendo.se/med-tryck/profilklader/linnen",
  "https://www.prendo.se/med-tryck/profilklader/traningsklader",
  "https://www.prendo.se/med-tryck/profilklader/underklader",
  "https://www.prendo.se/med-tryck/profilklader/accessoarer",
  "https://www.prendo.se/med-tryck/profilklader/morgonrockar",
  "https://www.prendo.se/med-tryck/profilklader/poncho",
  "https://www.prendo.se/med-tryck/profilklader/profilklader-barn",
  "https://www.prendo.se/med-tryck/profilklader/ekologiska-profilklader",
  "https://www.prendo.se/med-tryck/profilklader/handskar-vantar",
  "https://www.prendo.se/med-tryck/profilklader/skor",
  "https://www.prendo.se/med-tryck/profilklader/strumpor-sockar",
  "https://www.prendo.se/med-tryck/giveaways",
  "https://www.prendo.se/med-tryck/giveaways/nyckelband",
  "https://www.prendo.se/med-tryck/giveaways/nyckelringar",
  "https://www.prendo.se/med-tryck/giveaways/godis",
  "https://www.prendo.se/med-tryck/giveaways/isskrapor",
  "https://www.prendo.se/med-tryck/giveaways/ballonger",
  "https://www.prendo.se/med-tryck/giveaways/vatten",
  "https://www.prendo.se/med-tryck/giveaways/cerat",
  "https://www.prendo.se/med-tryck/giveaways/sadelskydd",
  "https://www.prendo.se/med-tryck/giveaways/gem",
  "https://www.prendo.se/med-tryck/giveaways/smorknivar",
  "https://www.prendo.se/med-tryck/giveaways/festivalband",
  "https://www.prendo.se/med-tryck/giveaways/skohorn",
  "https://www.prendo.se/med-tryck/giveaways/pasklammor",
  "https://www.prendo.se/med-tryck/giveaways/plaster",
  "https://www.prendo.se/med-tryck/giveaways/reklamknappar",
  "https://www.prendo.se/med-tryck/giveaways/supporter",
  "https://www.prendo.se/med-tryck/giveaways/forstoringsglas",
  "https://www.prendo.se/med-tryck/giveaways/tandare",
  "https://www.prendo.se/med-tryck/giveaways/sminkspeglar",
  "https://www.prendo.se/med-tryck/giveaways/disktrasor",
  "https://www.prendo.se/med-tryck/giveaways/frisbee",
  "https://www.prendo.se/med-tryck/giveaways/stressbollar",
  "https://www.prendo.se/med-tryck/giveaways/badbollar",
  "https://www.prendo.se/med-tryck/giveaways/microfiberdukar",
  "https://www.prendo.se/med-tryck/giveaways/grillskrapor",
  "https://www.prendo.se/med-tryck/giveaways/handsprit",
  "https://www.prendo.se/med-tryck/giveaways/pins",
  "https://www.prendo.se/med-tryck/giveaways/flaskoppnare",
  "https://www.prendo.se/med-tryck/giveaways/regnponcho",
  "https://www.prendo.se/med-tryck/giveaways/kundvagnsmynt",
  "https://www.prendo.se/med-tryck/giveaways/kylskapsmagneter",
  "https://www.prendo.se/med-tryck/giveaways/skoputs",
  "https://www.prendo.se/med-tryck/giveaways/oronproppar",
  "https://www.prendo.se/med-tryck/giveaways/bagagebrickor",
  "https://www.prendo.se/med-tryck/profilprodukter",
  "https://www.prendo.se/med-tryck/profilprodukter/pennor",
  "https://www.prendo.se/med-tryck/profilprodukter/pennor/miljovanliga-pennor",
  "https://www.prendo.se/med-tryck/profilprodukter/muggar",
  "https://www.prendo.se/med-tryck/profilprodukter/paraplyer",
  "https://www.prendo.se/med-tryck/profilprodukter/glas",
  "https://www.prendo.se/med-tryck/profilprodukter/vattenflaskor",
  "https://www.prendo.se/med-tryck/presentreklam",
  "https://www.prendo.se/med-tryck/presentreklam/vaskor",
  "https://www.prendo.se/med-tryck/presentreklam/usb-minnen",
  "https://www.prendo.se/med-tryck/presentreklam/powerbank",
  "https://www.prendo.se/med-tryck/presentreklam/mobiltillbehor",
  "https://www.prendo.se/med-tryck/foretagsgavor",
  "https://www.prendo.se/med-tryck/foretagsgavor/gavokort",
  "https://www.prendo.se/med-tryck/foretagsgavor/sommarpresenter",
  "https://www.prendo.se/med-tryck/foretagsgavor/julklappar",
  "https://www.prendo.se/med-tryck/foretagsgavor/matgavor",
  "https://www.prendo.se/med-tryck/kontor-forbrukning",
  "https://www.prendo.se/med-tryck/kontor-forbrukning/almanackor-och-kalendrar",
  "https://www.prendo.se/med-tryck/kontor-forbrukning/datorutrustning-mobiltillbehor",
  "https://www.prendo.se/med-tryck/kontor-forbrukning/emballage-och-lagerutrustning",
  "https://www.prendo.se/med-tryck/kontor-forbrukning/kontorsmaskiner",
  "https://www.prendo.se/med-tryck/arbetsklader",
  "https://www.prendo.se/med-tryck/arbetsklader/arbetsjackor",
  "https://www.prendo.se/med-tryck/arbetsklader/arbetsbyxor-shorts",
  "https://www.prendo.se/med-tryck/arbetsklader/varselklader",
  "https://www.prendo.se/med-tryck/arbetsklader/arbetsoveraller",
  "https://www.prendo.se/med-tryck/personligt-skydd",
  "https://www.prendo.se/med-tryck/personligt-skydd/huvudskydd",
  "https://www.prendo.se/med-tryck/personligt-skydd/horselskydd",
  "https://www.prendo.se/med-tryck/personligt-skydd/ogonskydd",
  "https://www.prendo.se/med-tryck/personligt-skydd/andningsskydd",
  "https://www.prendo.se/med-tryck/massmaterial",
  "https://www.prendo.se/med-tryck/massmaterial/reklamflaggor",
  "https://www.prendo.se/med-tryck/massmaterial/rollup-popup",
  "https://www.prendo.se/med-tryck/massmaterial/gatupratare",
  "https://www.prendo.se/med-tryck/massmaterial/mattor",
  "https://www.prendo.se/med-tryck/trycksaker",
  "https://www.prendo.se/med-tryck/trycksaker/affischer",
  "https://www.prendo.se/med-tryck/trycksaker/brevpapper",
  "https://www.prendo.se/med-tryck/trycksaker/flyers",
  "https://www.prendo.se/med-tryck/trycksaker/foldrar",
  "https://www.prendo.se/med-tryck/miljovanliga-profilprodukter",
  "https://www.prendo.se/med-tryck/miljovanliga-profilprodukter/miljovanliga-klader-textil",
  "https://www.prendo.se/med-tryck/miljovanliga-profilprodukter/miljovanliga-paraplyer",
  "https://www.prendo.se/med-tryck/varumarken",
  "https://www.prendo.se/med-tryck/varumarken/abacus",
  "https://www.prendo.se/med-tryck/varumarken/ad-company",
  "https://www.prendo.se/med-tryck/varumarken/adapt",
  "https://www.prendo.se/med-tryck/varumarken/adidas",
  "https://www.prendo.se/med-tryck/varumarken/clique",
  "https://www.prendo.se/med-tryck/varumarken/craft",
  "https://www.prendo.se/med-tryck/varumarken/geyser",
  "https://www.prendo.se/med-tryck/varumarken/j-harvest-frost",
  "https://www.prendo.se/med-tryck/varumarken/tee-jays",
]

// Translation mappings for Swedish to English
const translations = {
  // Main categories
  'profilklader': 'Profile Clothing',
  'giveaways': 'Giveaways',
  'profilprodukter': 'Profile Products',
  'presentreklam': 'Gift Advertising',
  'foretagsgavor': 'Corporate Gifts',
  'kontor-forbrukning': 'Office & Supplies',
  'arbetsklader': 'Work Clothes',
  'personligt-skydd': 'Personal Protection',
  'massmaterial': 'Exhibition Materials',
  'trycksaker': 'Printed Materials',
  'miljovanliga-profilprodukter': 'Eco-friendly Products',
  'varumarken': 'Brands',
  
  // Subcategories - Clothing
  't-shirt': 'T-Shirts',
  'piketrojor': 'Polo Shirts',
  'trojor': 'Sweaters',
  'skjortor': 'Shirts',
  'jackor': 'Jackets',
  'kepsar': 'Caps',
  'mossor': 'Beanies',
  'kavajer': 'Blazers',
  'byxor': 'Pants',
  'shorts': 'Shorts',
  'kjolar': 'Skirts',
  'klanningar': 'Dresses',
  'vastar': 'Vests',
  'linnen': 'Tank Tops',
  'traningsklader': 'Sportswear',
  'underklader': 'Underwear',
  'accessoarer': 'Accessories',
  'morgonrockar': 'Bathrobes',
  'poncho': 'Ponchos',
  'profilklader-barn': 'Kids Clothing',
  'ekologiska-profilklader': 'Organic Clothing',
  'handskar-vantar': 'Gloves & Mittens',
  'skor': 'Shoes',
  'strumpor-sockar': 'Socks',
  
  // Sub-subcategories - T-Shirts
  'billiga-t-shirt': 'Budget T-Shirts',
  'herr-t-shirt': 'Men\'s T-Shirts',
  'dam-t-shirt': 'Women\'s T-Shirts',
  'barn-t-shirt': 'Kids T-Shirts',
  'funktions-t-shirt': 'Performance T-Shirts',
  'v-ringade-t-shirt': 'V-Neck T-Shirts',
  'fairtrade-t-shirt': 'Fair Trade T-Shirts',
  'ekologiska-t-shirt': 'Organic T-Shirts',
  'langarmade-t-shirt': 'Long Sleeve T-Shirts',
  
  // Sub-subcategories - Polo Shirts
  'billiga-piketrojor': 'Budget Polo Shirts',
  'piketrojor-herr': 'Men\'s Polo Shirts',
  'piketrojor-dam': 'Women\'s Polo Shirts',
  'piketrojor-barn': 'Kids Polo Shirts',
  'piketrojor-funktion': 'Performance Polo Shirts',
  'fairtrade-piketrojor': 'Fair Trade Polo Shirts',
  'ekologiska-piketrojor': 'Organic Polo Shirts',
  'langarmade-piketrojor': 'Long Sleeve Polo Shirts',
  
  // Sub-subcategories - Sweaters
  'polotrojor': 'Polo Sweaters',
  'sweatshirts-collegetrojor': 'Sweatshirts',
  'huvtrojor': 'Hoodies',
  'damtrojor': 'Women\'s Sweaters',
  'barntrojor': 'Kids Sweaters',
  'understallstrojor': 'Base Layer Tops',
  'v-ringade-trojor': 'V-Neck Sweaters',
  'cardigans': 'Cardigans',
  'rundhalsade-trojor': 'Crew Neck Sweaters',
  'stickade-trojor': 'Knit Sweaters',
  'fleecetrojor': 'Fleece Sweaters',
  'ekologiska-trojor': 'Organic Sweaters',
  
  // Sub-subcategories - Shirts
  'billiga-skjortor': 'Budget Shirts',
  'herrskjortor': 'Men\'s Shirts',
  'damskjortor': 'Women\'s Shirts',
  'skjortor-kort-arm': 'Short Sleeve Shirts',
  'ekologiska-skjortor': 'Organic Shirts',
  
  // Giveaways
  'nyckelband': 'Lanyards',
  'nyckelringar': 'Keychains',
  'godis': 'Candy',
  'isskrapor': 'Ice Scrapers',
  'ballonger': 'Balloons',
  'vatten': 'Water Bottles',
  'cerat': 'Lip Balm',
  'sadelskydd': 'Bike Seat Covers',
  'gem': 'Paper Clips',
  'smorknivar': 'Butter Knives',
  'festivalband': 'Festival Wristbands',
  'skohorn': 'Shoe Horns',
  'pasklammor': 'Bag Clips',
  'plaster': 'Band-Aids',
  'reklamknappar': 'Promotional Buttons',
  'supporter': 'Fan Items',
  'forstoringsglas': 'Magnifying Glasses',
  'tandare': 'Lighters',
  'sminkspeglar': 'Makeup Mirrors',
  'disktrasor': 'Dish Cloths',
  'frisbee': 'Frisbees',
  'stressbollar': 'Stress Balls',
  'badbollar': 'Beach Balls',
  'microfiberdukar': 'Microfiber Cloths',
  'grillskrapor': 'Grill Scrapers',
  'handsprit': 'Hand Sanitizer',
  'pins': 'Pins',
  'flaskoppnare': 'Bottle Openers',
  'regnponcho': 'Rain Ponchos',
  'kundvagnsmynt': 'Shopping Cart Coins',
  'kylskapsmagneter': 'Fridge Magnets',
  'skoputs': 'Shoe Polish',
  'oronproppar': 'Earplugs',
  'bagagebrickor': 'Luggage Tags',
  
  // Profile Products
  'pennor': 'Pens',
  'miljovanliga-pennor': 'Eco-friendly Pens',
  'muggar': 'Mugs',
  'paraplyer': 'Umbrellas',
  'glas': 'Glasses',
  'vattenflaskor': 'Water Bottles',
  
  // Gift Advertising
  'vaskor': 'Bags',
  'usb-minnen': 'USB Drives',
  'powerbank': 'Power Banks',
  'mobiltillbehor': 'Mobile Accessories',
  
  // Corporate Gifts
  'gavokort': 'Gift Cards',
  'sommarpresenter': 'Summer Gifts',
  'julklappar': 'Christmas Gifts',
  'matgavor': 'Food Gifts',
  
  // Office & Supplies
  'almanackor-och-kalendrar': 'Calendars & Planners',
  'datorutrustning-mobiltillbehor': 'Computer & Mobile Equipment',
  'emballage-och-lagerutrustning': 'Packaging & Storage',
  'kontorsmaskiner': 'Office Machines',
  
  // Work Clothes
  'arbetsjackor': 'Work Jackets',
  'arbetsbyxor-shorts': 'Work Pants & Shorts',
  'varselklader': 'High-Visibility Clothing',
  'arbetsoveraller': 'Work Overalls',
  
  // Personal Protection
  'huvudskydd': 'Head Protection',
  'horselskydd': 'Hearing Protection',
  'ogonskydd': 'Eye Protection',
  'andningsskydd': 'Respiratory Protection',
  
  // Exhibition Materials
  'reklamflaggor': 'Advertising Flags',
  'rollup-popup': 'Roll-ups & Pop-ups',
  'gatupratare': 'Sidewalk Signs',
  'mattor': 'Mats',
  
  // Printed Materials
  'affischer': 'Posters',
  'brevpapper': 'Letterheads',
  'flyers': 'Flyers',
  'foldrar': 'Brochures',
  
  // Eco-friendly
  'miljovanliga-klader-textil': 'Eco-friendly Clothing & Textiles',
  'miljovanliga-paraplyer': 'Eco-friendly Umbrellas',
  
  // Brands (keep as is)
  'abacus': 'Abacus',
  'ad-company': 'AD Company',
  'adapt': 'Adapt',
  'adidas': 'Adidas',
  'clique': 'Clique',
  'craft': 'Craft',
  'geyser': 'Geyser',
  'j-harvest-frost': 'J. Harvest & Frost',
  'tee-jays': 'Tee Jays',
}

function parseUrlToCategory(url) {
  // Remove domain and 'med-tryck' prefix
  const path = url.replace('https://www.prendo.se/med-tryck/', '')
  const parts = path.split('/')
  
  return {
    path: path,
    parts: parts,
    level: parts.length,
  }
}

function getNameFromSlug(slug) {
  // Get English translation or format the slug
  const translated = translations[slug]
  if (translated) return translated
  
  // Fallback: Convert slug to title case
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getSwedishName(slug) {
  // Convert slug to Swedish name (capitalize words)
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function seedPrendoCategories() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const database = client.db('printwrap-pro')
    const categoriesCollection = database.collection('categories')
    const subcategoriesCollection = database.collection('subcategories')

    // Clear existing categories (you can change this to false if you want to keep existing)
    const clearExisting = true

    if (clearExisting) {
      await categoriesCollection.deleteMany({})
      await subcategoriesCollection.deleteMany({})
      console.log('Cleared existing categories and subcategories')
    }

    // Parse all URLs and build hierarchy
    const categoryMap = new Map()
    const subcategoryMap = new Map()
    
    // Process URLs to build category structure
    prendoUrls.forEach(url => {
      const parsed = parseUrlToCategory(url)
      
      if (parsed.level === 1) {
        // Main category
        const slug = parsed.parts[0]
        if (!categoryMap.has(slug)) {
          categoryMap.set(slug, {
            name: getNameFromSlug(slug),
            slug: slug,
            swedishName: getSwedishName(slug),
            description: `${getNameFromSlug(slug)} category from Prendo`,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      } else if (parsed.level >= 2) {
        // Subcategory or sub-subcategory
        const parentSlug = parsed.parts.slice(0, -1).join('/')
        const slug = parsed.path
        const name = getNameFromSlug(parsed.parts[parsed.parts.length - 1])
        
        if (!subcategoryMap.has(slug)) {
          subcategoryMap.set(slug, {
            name: name,
            slug: slug,
            swedishName: getSwedishName(parsed.parts[parsed.parts.length - 1]),
            parentPath: parentSlug,
            categorySlug: parsed.parts[0], // Main category
            level: parsed.level,
            description: `${name} subcategory`,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
    })

    // Insert main categories
    const categoriesToInsert = Array.from(categoryMap.values())
    if (categoriesToInsert.length > 0) {
      const result = await categoriesCollection.insertMany(categoriesToInsert)
      console.log(`Inserted ${result.insertedCount} main categories`)
    }

    // Get inserted categories with their IDs
    const insertedCategories = await categoriesCollection.find({}).toArray()
    const categoryIdMap = new Map()
    insertedCategories.forEach(cat => {
      categoryIdMap.set(cat.slug, cat._id.toString())
    })

    // Process subcategories with proper parent references
    const subcategoriesToInsert = []
    const subcategoryIdMap = new Map()
    
    // First, insert level 2 subcategories (direct children of main categories)
    for (const [slug, subcat] of subcategoryMap.entries()) {
      if (subcat.level === 2) {
        const categoryId = categoryIdMap.get(subcat.categorySlug)
        if (categoryId) {
          subcategoriesToInsert.push({
            ...subcat,
            categoryId: categoryId,
            parentId: null, // Direct child of category
          })
        }
      }
    }

    if (subcategoriesToInsert.length > 0) {
      const result = await subcategoriesCollection.insertMany(subcategoriesToInsert)
      console.log(`Inserted ${result.insertedCount} level 2 subcategories`)
      
      // Get inserted subcategories with their IDs
      const insertedSubcats = await subcategoriesCollection.find({}).toArray()
      insertedSubcats.forEach(subcat => {
        subcategoryIdMap.set(subcat.slug, subcat._id.toString())
      })
    }

    // Now insert level 3+ subcategories (children of subcategories)
    const deepSubcategoriesToInsert = []
    for (const [slug, subcat] of subcategoryMap.entries()) {
      if (subcat.level > 2) {
        const categoryId = categoryIdMap.get(subcat.categorySlug)
        const parentId = subcategoryIdMap.get(subcat.parentPath)
        
        if (categoryId) {
          deepSubcategoriesToInsert.push({
            ...subcat,
            categoryId: categoryId,
            parentId: parentId || null,
          })
        }
      }
    }

    if (deepSubcategoriesToInsert.length > 0) {
      const result = await subcategoriesCollection.insertMany(deepSubcategoriesToInsert)
      console.log(`Inserted ${result.insertedCount} level 3+ subcategories`)
    }

    // Display summary
    console.log('\n=== Import Summary ===')
    console.log(`Total categories: ${categoryMap.size}`)
    console.log(`Total subcategories: ${subcategoryMap.size}`)
    
    console.log('\nMain Categories:')
    for (const [slug, cat] of categoryMap.entries()) {
      console.log(`  - ${cat.name} (${cat.swedishName})`)
      
      // Show subcategories
      const subcats = Array.from(subcategoryMap.values())
        .filter(s => s.categorySlug === slug && s.level === 2)
      
      if (subcats.length > 0) {
        subcats.forEach(subcat => {
          console.log(`    • ${subcat.name}`)
          
          // Show sub-subcategories
          const subsubcats = Array.from(subcategoryMap.values())
            .filter(s => s.parentPath === subcat.slug)
          
          if (subsubcats.length > 0) {
            subsubcats.forEach(ssc => {
              console.log(`      - ${ssc.name}`)
            })
          }
        })
      }
    }

    console.log('\n✅ Prendo categories imported successfully!')

  } catch (error) {
    console.error('Error seeding categories:', error)
  } finally {
    await client.close()
  }
}

// Run the seed script
seedPrendoCategories()