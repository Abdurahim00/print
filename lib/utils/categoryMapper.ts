/**
 * Client-side category mapping utility
 * Maps products to categories based on product names
 * This is a temporary solution until database can be updated
 */

// Category IDs from the database
export const CATEGORY_IDS = {
  'Apparel': '68b2f79d65a5cb13315a529a',
  'Bags': '68b2f7a465a5cb13315a52bb',
  'Drinkware': '68b2f7a165a5cb13315a52ae',
  'Accessories': '68b2f7a065a5cb13315a52a7',
  'Tech Accessories': '68b2f7a365a5cb13315a52b6',
  'Office & Supplies': '68a9c487edaa349aacbf3151',
  'Promotional Items': '68b2f7a165a5cb13315a52ab',
  'Textiles': '68b2f7a265a5cb13315a52b3',
  'Toys & Games': '68b2f7a465a5cb13315a52b9',
  'Safety': '68b2f79f65a5cb13315a52a3',
  'Other': '68b2f79f65a5cb13315a52a5'
};

// Category mapping rules
const CATEGORY_RULES: Record<string, string[]> = {
  [CATEGORY_IDS.Apparel]: [
    't-shirt', 'tshirt', 'shirt', 'hoodie', 'tröja', 'jacka', 'jacket',
    'byxa', 'pants', 'shorts', 'kjol', 'skirt', 'klänning', 'dress',
    'kläder', 'clothes', 'overall', 'rock', 'blazer', 'kostym', 'suit',
    'polo', 'piké', 'pike', 'sweatshirt', 'fleece', 'softshell', 'vest',
    'cardigan', 'pullover', 'sweater', 'jumper', 'top', 'blouse', 'tunic',
    'jeans', 'trouser', 'leggings', 'tights', 'underwear', 'sock', 'strumpa'
  ],
  [CATEGORY_IDS.Bags]: [
    'väska', 'bag', 'ryggsäck', 'backpack', 'portfölj', 'portfolio',
    'resväska', 'luggage', 'suitcase', 'duffel', 'tote', 'shopper',
    'axelväska', 'messenger', 'kasse', 'pouch', 'briefcase', 'satchel',
    'handbag', 'purse', 'clutch', 'wallet', 'plånbok', 'necessär',
    'toiletry', 'gym bag', 'sports bag', 'laptop bag', 'trolley'
  ],
  [CATEGORY_IDS.Drinkware]: [
    'mugg', 'mug', 'kopp', 'cup', 'glas', 'glass', 'flaska', 'bottle',
    'termos', 'thermos', 'tumbler', 'vattenflaska', 'water bottle',
    'travel mug', 'coffee', 'kaffe', 'tea', 'te', 'drink', 'dryck',
    'can', 'flask', 'shaker', 'wine', 'beer', 'öl', 'vin'
  ],
  [CATEGORY_IDS.Accessories]: [
    'keps', 'cap', 'hatt', 'hat', 'mössa', 'beanie', 'halsduk', 'scarf',
    'vantar', 'gloves', 'bälte', 'belt', 'solglasögon', 'sunglasses',
    'klocka', 'watch', 'armband', 'bracelet', 'smycke', 'jewelry',
    'slips', 'tie', 'fluga', 'bowtie', 'suspenders', 'hängslen',
    'badge', 'pin', 'brosch', 'ring', 'necklace', 'halsband', 'örhänge',
    'earring', 'bandana', 'visor', 'headband', 'pannband'
  ],
  [CATEGORY_IDS['Tech Accessories']]: [
    'case', 'fodral', 'skal', 'cover', 'hörlurar', 'headphone', 'powerbank',
    'laddare', 'charger', 'kabel', 'cable', 'usb', 'adapter', 'mus', 'mouse',
    'tangentbord', 'keyboard', 'musmatta', 'mousepad', 'speaker', 'högtalare',
    'earbuds', 'airpods', 'phone', 'telefon', 'tablet', 'laptop', 'computer',
    'dator', 'webcam', 'microphone', 'mikrofon', 'hub', 'dock', 'stand',
    'ställ', 'holder', 'hållare', 'stylus', 'penna', 'screen', 'skärm'
  ],
  [CATEGORY_IDS['Office & Supplies']]: [
    'penna', 'pen', 'blyerts', 'pencil', 'anteckningsbok', 'notebook',
    'block', 'notepad', 'kalendar', 'calendar', 'dagbok', 'diary',
    'mapp', 'folder', 'häftapparat', 'stapler', 'gem', 'paperclip',
    'kontor', 'office', 'skrivbord', 'desk', 'paper', 'papper',
    'envelope', 'kuvert', 'marker', 'highlighter', 'överstrykningspenna',
    'ruler', 'linjal', 'eraser', 'suddgummi', 'tape', 'tejp', 'glue', 'lim',
    'scissors', 'sax', 'calculator', 'räknare', 'binder', 'pärm'
  ],
  [CATEGORY_IDS['Promotional Items']]: [
    'nyckelring', 'keyring', 'keychain', 'lanyard', 'badge', 'pin',
    'klistermärke', 'sticker', 'magnet', 'reflex', 'reflector',
    'parasoll', 'umbrella', 'paraply', 'fläkt', 'fan', 'lighter',
    'tändare', 'opener', 'öppnare', 'coaster', 'underlägg', 'flag',
    'flagga', 'banner', 'vimpel', 'pennant', 'balloon', 'ballong',
    'wristband', 'armband', 'lanyard', 'nyckelband', 'carabiner'
  ],
  [CATEGORY_IDS.Textiles]: [
    'handduk', 'towel', 'filt', 'blanket', 'kudde', 'pillow',
    'lakan', 'sheet', 'pläd', 'throw', 'textil', 'textile',
    'duk', 'cloth', 'tablecloth', 'bordsduk', 'napkin', 'servett',
    'apron', 'förkläde', 'oven mitt', 'grillvante', 'potholder',
    'grytlapp', 'curtain', 'gardin', 'cushion', 'dyna', 'quilt'
  ],
  [CATEGORY_IDS['Toys & Games']]: [
    'leksak', 'toy', 'spel', 'game', 'pussel', 'puzzle', 'boll', 'ball',
    'nallebjörn', 'teddy', 'docka', 'doll', 'plush', 'mjukis', 'stuffed',
    'gosedjur', 'action figure', 'actionfigur', 'board game', 'brädspel',
    'card', 'kort', 'dice', 'tärning', 'frisbee', 'kite', 'drake',
    'yo-yo', 'jojo', 'rubik', 'fidget', 'spinner', 'lego', 'block'
  ],
  [CATEGORY_IDS.Safety]: [
    'hjälm', 'helmet', 'skydd', 'protection', 'varsel', 'hi-vis',
    'safety', 'säkerhet', 'mask', 'gloves', 'goggles', 'skyddsglasögon',
    'ear protection', 'hörselskydd', 'knee pad', 'knäskydd', 'elbow pad',
    'armbågsskydd', 'vest', 'väst', 'harness', 'sele', 'respirator',
    'andningsskydd', 'hard hat', 'skyddshjälm', 'steel toe', 'stålhätta'
  ]
};

/**
 * Get category ID for a product based on its name
 */
export function getCategoryForProduct(productName: string): string {
  const nameLower = productName.toLowerCase();
  
  // Check each category's keywords
  for (const [categoryId, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(keyword => nameLower.includes(keyword))) {
      return categoryId;
    }
  }
  
  // Default to "Other" category
  return CATEGORY_IDS.Other;
}

/**
 * Map a product object to include the correct category
 */
export function mapProductCategory(product: any): any {
  // If product already has a valid categoryId, return as-is
  if (product.categoryId && product.categoryId !== 'null') {
    return product;
  }
  
  // Otherwise, assign category based on name
  return {
    ...product,
    categoryId: getCategoryForProduct(product.name)
  };
}

/**
 * Map an array of products to include categories
 */
export function mapProductsCategories(products: any[]): any[] {
  return products.map(mapProductCategory);
}

/**
 * Count products by category from a list of products
 */
export function countProductsByCategory(products: any[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  // Initialize all categories with 0
  Object.values(CATEGORY_IDS).forEach(id => {
    counts[id] = 0;
  });
  
  // Count products
  products.forEach(product => {
    const categoryId = product.categoryId || getCategoryForProduct(product.name);
    counts[categoryId] = (counts[categoryId] || 0) + 1;
  });
  
  return counts;
}