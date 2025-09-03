#!/usr/bin/env python3
import json
import re
import os
from pymongo import MongoClient, errors
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
DATABASE_NAME = 'printwrap-pro'

# Category mappings
CATEGORY_PATTERNS = [
    # Apparel
    (['sweatshirt', 'tröja', 'troja'], 'Apparel', 'Sweatshirts'),
    (['hoodie', 'hoodjacka', 'huvtröja', 'hood'], 'Apparel', 'Hoodies'),
    (['t-shirt', 'tshirt', 't shirt'], 'Apparel', 'T-Shirts'),
    (['piké', 'pike', 'polo'], 'Apparel', 'Polos'),
    (['skjorta', 'shirt'], 'Apparel', 'Shirts'),
    (['jacka', 'jacket'], 'Apparel', 'Jackets'),
    (['byxor', 'byxa', 'pants', 'trouser'], 'Apparel', 'Pants'),
    (['shorts'], 'Apparel', 'Shorts'),
    (['väst', 'vest'], 'Apparel', 'Vests'),
    (['overall'], 'Apparel', 'Overalls'),
    (['fleece'], 'Apparel', 'Fleece'),
    (['softshell'], 'Apparel', 'Softshell'),
    
    # Accessories
    (['keps', 'cap'], 'Accessories', 'Caps'),
    (['mössa', 'beanie', 'mossa'], 'Accessories', 'Beanies'),
    (['hatt', 'hat'], 'Accessories', 'Hats'),
    (['halsduk', 'scarf'], 'Accessories', 'Scarves'),
    (['handskar', 'gloves'], 'Accessories', 'Gloves'),
    (['bälte', 'belt'], 'Accessories', 'Belts'),
    (['paraply', 'umbrella'], 'Accessories', 'Umbrellas'),
    
    # Promotional
    (['nyckelring', 'keychain', 'keyring'], 'Promotional Items', 'Keychains'),
    (['penna', 'pen', 'kulspets'], 'Promotional Items', 'Pens'),
    (['anteckningsbok', 'notebook'], 'Promotional Items', 'Notebooks'),
    (['lanyard', 'nyckelband'], 'Promotional Items', 'Lanyards'),
    
    # Drinkware
    (['mugg', 'mug', 'kopp', 'cup'], 'Drinkware', 'Mugs'),
    (['flaska', 'bottle', 'vattenflaska'], 'Drinkware', 'Bottles'),
    (['termos', 'thermos'], 'Drinkware', 'Thermos'),
    
    # Bags
    (['väska', 'bag', 'vaska'], 'Bags', 'Bags'),
    (['kasse', 'tote'], 'Bags', 'Tote Bags'),
    (['ryggsäck', 'backpack', 'ryggsack'], 'Bags', 'Backpacks'),
    (['sportväska', 'sports bag', 'gymväska', 'duffel'], 'Bags', 'Sports Bags'),
    
    # Tech
    (['usb', 'minnessticka', 'flash'], 'Tech Accessories', 'USB Drives'),
    (['powerbank', 'power bank', 'laddare'], 'Tech Accessories', 'Power Banks'),
    (['högtalare', 'speaker', 'bluetooth'], 'Tech Accessories', 'Speakers'),
    (['hörlurar', 'headphones', 'earphones'], 'Tech Accessories', 'Headphones'),
    
    # Textiles
    (['handduk', 'towel'], 'Textiles', 'Towels'),
    (['filt', 'blanket', 'pläd'], 'Textiles', 'Blankets'),
    
    # Safety
    (['reflex', 'reflector'], 'Safety', 'Reflectors'),
    (['varsel', 'hi-vis', 'high visibility'], 'Safety', 'Hi-Vis Clothing'),
]

def clean_text(text):
    """Clean text encoding issues"""
    if not text:
        return ''
    
    replacements = {
        'Ã¤': 'ä', 'Ã¶': 'ö', 'Ã¥': 'å',
        'Ã„': 'Ä', 'Ã–': 'Ö', 'Ã…': 'Å',
        'Ã©': 'é', 'Â°': '°',
        '\\n': ' ', '\\r': '', '\\t': ' ',
        '\\': ''
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text.strip()

def detect_category(product):
    """Detect category and subcategory from product data"""
    search_text = f"{product.get('Title', '')} {product.get('Url', '')} {product.get('description', '')}".lower()
    
    for patterns, category, subcategory in CATEGORY_PATTERNS:
        for pattern in patterns:
            if pattern.lower() in search_text:
                return category, subcategory
    
    return 'Other', 'Miscellaneous'

def parse_price(price_str):
    """Parse price from string"""
    if not price_str:
        return 0
    
    # Remove everything except numbers and decimal points
    clean_price = re.sub(r'[^0-9.,]', '', price_str)
    clean_price = clean_price.replace(',', '.')
    
    try:
        price = float(clean_price)
        return price if price > 0 else 0
    except:
        return 0

def extract_products_from_file(filepath):
    """Extract products from malformed JSON file"""
    print("Reading file...")
    
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Try to decode with latin-1
    text = content.decode('latin-1', errors='ignore')
    text = clean_text(text)
    
    products = []
    
    # Use regex to find product objects
    # Look for patterns that start with "Url" field
    product_pattern = r'\{[^{}]*"Url"\s*:\s*"[^"]+",.*?"variants_dict"\s*:\s*\[[^\]]*\][^}]*\}'
    
    # Find all matches
    matches = re.finditer(product_pattern, text, re.DOTALL)
    
    for match in matches:
        product_str = match.group()
        
        # Clean up the JSON string
        product_str = re.sub(r',\s*}', '}', product_str)  # Remove trailing commas
        product_str = re.sub(r',\s*]', ']', product_str)
        product_str = re.sub(r':\s*,', ': null,', product_str)  # Fix empty values
        
        try:
            # Try to parse as JSON
            product = json.loads(product_str)
            
            # Validate required fields
            if product.get('Url') and product.get('Title'):
                products.append(product)
        except json.JSONDecodeError:
            # Try alternative parsing
            try:
                # Extract fields manually
                product = {}
                
                # Extract URL
                url_match = re.search(r'"Url"\s*:\s*"([^"]+)"', product_str)
                if url_match:
                    product['Url'] = url_match.group(1)
                
                # Extract Title
                title_match = re.search(r'"Title"\s*:\s*"([^"]+)"', product_str)
                if title_match:
                    product['Title'] = title_match.group(1)
                
                # Extract description
                desc_match = re.search(r'"description"\s*:\s*"([^"]+)"', product_str)
                if desc_match:
                    product['description'] = desc_match.group(1)
                
                # Extract Article_no
                article_match = re.search(r'"Article_no"\s*:\s*"([^"]+)"', product_str)
                if article_match:
                    product['Article_no'] = article_match.group(1)
                
                # Extract prices
                price_before_match = re.search(r'"price_before_tax"\s*:\s*"([^"]+)"', product_str)
                if price_before_match:
                    product['price_before_tax'] = price_before_match.group(1)
                
                price_after_match = re.search(r'"price_after_tax"\s*:\s*"([^"]+)"', product_str)
                if price_after_match:
                    product['price_after_tax'] = price_after_match.group(1)
                
                # Extract sizes
                sizes_match = re.search(r'"Sizes"\s*:\s*\[([^\]]+)\]', product_str)
                if sizes_match:
                    sizes_str = sizes_match.group(1)
                    product['Sizes'] = [s.strip(' "') for s in sizes_str.split(',')]
                
                # Extract brand info
                brand_match = re.search(r'"brand_info"\s*:\s*"([^"]+)"', product_str)
                if brand_match:
                    product['brand_info'] = brand_match.group(1)
                
                # Extract variants
                variants_match = re.search(r'"variants_dict"\s*:\s*\[([^\]]*)\]', product_str)
                if variants_match:
                    variants_str = variants_match.group(1)
                    variants = []
                    
                    # Parse each variant
                    variant_pattern = r'\{[^}]+\}'
                    for v_match in re.finditer(variant_pattern, variants_str):
                        v_str = v_match.group()
                        variant = {}
                        
                        v_name = re.search(r'"variant_name"\s*:\s*"([^"]+)"', v_str)
                        if v_name:
                            variant['variant_name'] = v_name.group(1)
                        
                        v_image = re.search(r'"variant_image"\s*:\s*"([^"]+)"', v_str)
                        if v_image:
                            variant['variant_image'] = v_image.group(1)
                        
                        if variant:
                            variants.append(variant)
                    
                    product['variants_dict'] = variants
                
                if product.get('Url') and product.get('Title'):
                    products.append(product)
                    
            except Exception as e:
                continue
    
    print(f"Successfully extracted {len(products)} products")
    return products

def import_to_mongodb(products):
    """Import products to MongoDB"""
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    
    products_collection = db['products']
    categories_collection = db['categories']
    subcategories_collection = db['subcategories']
    
    # Get existing data
    print("Checking existing data...")
    existing_count = products_collection.count_documents({'source': 'prendo'})
    print(f"Existing Prendo products: {existing_count}")
    
    # Get existing SKUs to avoid duplicates
    existing_skus = set()
    for product in products_collection.find({'source': 'prendo'}, {'sku': 1}):
        if product.get('sku'):
            existing_skus.add(product['sku'])
    
    print(f"Found {len(existing_skus)} existing SKUs")
    
    # Get existing categories and subcategories
    category_map = {}
    for cat in categories_collection.find():
        category_map[cat['name']] = cat['_id']
    
    subcategory_map = {}
    for sub in subcategories_collection.find():
        key = f"{sub['categoryId']}_{sub['name']}"
        subcategory_map[key] = sub['_id']
    
    # Process products
    batch_size = 500
    total_imported = 0
    total_skipped = 0
    duplicates = 0
    
    for i in range(0, len(products), batch_size):
        batch = products[i:i+batch_size]
        documents = []
        
        for product in batch:
            try:
                # Skip duplicates
                sku = product.get('Article_no', '')
                if sku and sku in existing_skus:
                    duplicates += 1
                    continue
                
                # Detect category
                category_name, subcategory_name = detect_category(product)
                
                # Create category if needed
                if category_name not in category_map:
                    cat_doc = {
                        'name': category_name,
                        'slug': category_name.lower().replace(' ', '-'),
                        'description': f'{category_name} category',
                        'isActive': True,
                        'isDesignable': category_name in ['Apparel', 'Accessories', 'Bags'],
                        'createdAt': datetime.utcnow(),
                        'updatedAt': datetime.utcnow()
                    }
                    cat_id = categories_collection.insert_one(cat_doc).inserted_id
                    category_map[category_name] = cat_id
                    print(f"Created category: {category_name}")
                
                category_id = category_map[category_name]
                
                # Create subcategory if needed
                sub_key = f"{category_id}_{subcategory_name}"
                if sub_key not in subcategory_map:
                    sub_doc = {
                        'name': subcategory_name,
                        'slug': subcategory_name.lower().replace(' ', '-'),
                        'categoryId': category_id,
                        'isActive': True,
                        'createdAt': datetime.utcnow(),
                        'updatedAt': datetime.utcnow()
                    }
                    sub_id = subcategories_collection.insert_one(sub_doc).inserted_id
                    subcategory_map[sub_key] = sub_id
                    print(f"Created subcategory: {subcategory_name}")
                
                subcategory_id = subcategory_map[sub_key]
                
                # Parse price
                price = parse_price(product.get('price_before_tax') or product.get('price_after_tax'))
                if price <= 0:
                    total_skipped += 1
                    continue
                
                # Extract brand
                brand = 'Unknown'
                brand_info = product.get('brand_info', '')
                if brand_info:
                    brand_match = brand_info.split('\n')[0] if '\n' in brand_info else brand_info
                    brand = clean_text(brand_match)
                
                # Get images
                variants = product.get('variants_dict', [])
                main_image = variants[0]['variant_image'] if variants else 'https://via.placeholder.com/500'
                images = [v['variant_image'] for v in variants if v.get('variant_image')]
                
                # Transform variants
                variations = []
                for v in variants:
                    if v.get('variant_name'):
                        variations.append({
                            'name': clean_text(v['variant_name']),
                            'image': v.get('variant_image', ''),
                            'price': price,
                            'inStock': True
                        })
                
                # Create document
                doc = {
                    'name': clean_text(product.get('Title', 'Unnamed Product')),
                    'description': clean_text(product.get('description', '')),
                    'price': price,
                    'basePrice': price,
                    'image': main_image,
                    'images': images or [main_image],
                    'categoryId': category_id,
                    'subcategoryId': subcategory_id,
                    'inStock': True,
                    'featured': False,
                    'isActive': True,
                    'sku': sku or f"prendo-{datetime.now().timestamp()}-{i}",
                    'brand': brand,
                    'type': 'product',
                    'sizes': product.get('Sizes', []),
                    'hasVariations': len(variations) > 0,
                    'variations': variations,
                    'tags': [brand, category_name, subcategory_name],
                    'source': 'prendo',
                    'originalData': {
                        'url': product.get('Url', ''),
                        'articleNo': sku
                    },
                    'createdAt': datetime.utcnow(),
                    'updatedAt': datetime.utcnow()
                }
                
                documents.append(doc)
                
                # Add to existing SKUs
                if sku:
                    existing_skus.add(sku)
                    
            except Exception as e:
                total_skipped += 1
                continue
        
        # Insert batch
        if documents:
            try:
                result = products_collection.insert_many(documents, ordered=False)
                total_imported += len(result.inserted_ids)
                print(f"Batch {i//batch_size + 1}: Imported {len(result.inserted_ids)} products")
            except errors.BulkWriteError as e:
                # Count successful inserts
                total_imported += e.details['nInserted']
                duplicates += len(documents) - e.details['nInserted']
                print(f"Batch {i//batch_size + 1}: {e.details['nInserted']} imported, {len(documents) - e.details['nInserted']} duplicates")
    
    # Final count
    final_count = products_collection.count_documents({'source': 'prendo'})
    
    print("\n=== Import Complete ===")
    print(f"Total products processed: {len(products)}")
    print(f"Successfully imported: {total_imported}")
    print(f"Skipped (invalid): {total_skipped}")
    print(f"Duplicates: {duplicates}")
    print(f"Total Prendo products in database: {final_count}")
    
    client.close()

def main():
    print("Starting Prendo products import...")
    
    # Extract products from file
    filepath = 'prendo_unique_combine_output.json'
    products = extract_products_from_file(filepath)
    
    if not products:
        print("No products found to import")
        return
    
    # Import to MongoDB
    import_to_mongodb(products)
    
    print("Import completed!")

if __name__ == "__main__":
    main()