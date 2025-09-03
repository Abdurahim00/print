#!/usr/bin/env python3
import json
import re
import pymongo
from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

def parse_new_json():
    """Parse new.json with aggressive error recovery"""
    print("Reading new.json...")
    
    # Read with latin-1 encoding
    with open('new.json', 'r', encoding='latin-1', errors='ignore') as f:
        content = f.read()
    
    print(f"File size: {len(content):,} characters")
    
    # Try to parse normally first
    try:
        data = json.loads(content)
        print(f"✅ Successfully parsed {len(data)} products!")
        return data
    except json.JSONDecodeError as e:
        print(f"Initial parse failed at position {e.pos}")
    
    # Aggressive fix: Remove all Detaljer fields (they have problematic quotes)
    print("Removing problematic Detaljer fields...")
    content = re.sub(r'"Detaljer":[^,}]*(?:,[^"}]*"[^"]*")*[^,}]*', '""', content)
    
    try:
        data = json.loads(content)
        print(f"✅ Parsed {len(data)} products after removing Detaljer!")
        return data
    except json.JSONDecodeError as e:
        print(f"Still failed at position {e.pos}")
    
    # Even more aggressive: Extract products individually
    print("Extracting products individually...")
    products = []
    
    # Find all product objects
    # Pattern: starts with { and contains "Title" field
    pattern = r'\{\s*"Url"[^}]+?"variants_dict"[^}]+?\}(?:\s*,\s*\])?\s*\}'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        product_str = match.group(0).rstrip(',]')
        try:
            product = json.loads(product_str)
            products.append(product)
        except:
            pass
    
    if not products:
        # Try simpler pattern
        print("Trying simpler extraction...")
        # Split by "},\n{" to get individual products
        parts = content.split('},')
        
        for i, part in enumerate(parts):
            if not part.strip():
                continue
            
            # Clean up the part
            if not part.strip().startswith('{'):
                part = '{' + part
            if not part.strip().endswith('}'):
                part = part + '}'
            
            # Remove the array brackets if present
            part = part.replace('[{', '{').replace('}]', '}')
            
            try:
                product = json.loads(part)
                if 'Title' in product or 'title' in product:
                    products.append(product)
            except:
                continue
    
    print(f"✅ Extracted {len(products)} products")
    return products

def prepare_product(product):
    """Prepare product for MongoDB insertion"""
    now = datetime.now()
    
    # Parse price
    price = 0
    if 'Pris/st' in product:
        try:
            price = float(re.sub(r'[^\d.]', '', product['Pris/st']))
        except:
            pass
    elif 'price' in product:
        try:
            if isinstance(product['price'], str):
                price = float(re.sub(r'[^\d.]', '', product['price']))
            else:
                price = float(product['price'])
        except:
            pass
    
    # Get main image - prefer image_urls, fallback to variant images
    main_image = 'https://via.placeholder.com/500'
    images = []
    
    if product.get('image_urls') and len(product['image_urls']) > 0:
        main_image = product['image_urls'][0]
        images = product['image_urls']
    elif product.get('variants_dict'):
        # Use variant images
        for variant in product['variants_dict']:
            if variant.get('variant_image'):
                if main_image == 'https://via.placeholder.com/500':
                    main_image = variant['variant_image']
                images.append(variant['variant_image'])
    
    # Create database document
    doc = {
        'name': product.get('Title', product.get('title', 'Unnamed Product')),
        'description': product.get('description', ''),
        'price': price,
        'basePrice': price,
        'image': main_image,
        'images': images if images else [main_image],
        'inStock': True,
        'featured': False,
        'createdAt': now,
        'updatedAt': now,
        'isActive': True,
        'eligibleForCoupons': True,
        'source': 'new.json'
    }
    
    # Add SKU
    if 'Artikelnummer' in product:
        doc['sku'] = product['Artikelnummer']
    
    # Add variants
    if product.get('variants_dict'):
        doc['variants'] = []
        for variant in product['variants_dict']:
            doc['variants'].append({
                'name': variant.get('variant_name', ''),
                'image': variant.get('variant_image', ''),
                'url': variant.get('variant_url', '')
            })
        doc['hasVariations'] = True
    
    # Add specifications
    if 'product_info' in product:
        doc['specifications'] = product['product_info']
    
    # Store original URL
    if 'Url' in product:
        doc['originalUrl'] = product['Url']
    
    return doc

def import_to_mongodb(products):
    """Import products to MongoDB"""
    if not MONGODB_URI:
        print("❌ MONGODB_URI not found!")
        return
    
    client = MongoClient(MONGODB_URI)
    db = client.get_database()
    collection = db['products']
    
    print(f"\nConnected to MongoDB")
    
    # Clear existing products
    print("Clearing existing products...")
    result = collection.delete_many({})
    print(f"Deleted {result.deleted_count} existing products")
    
    # Prepare products
    print(f"\nPreparing {len(products)} products for import...")
    db_products = []
    
    for product in products:
        db_product = prepare_product(product)
        db_products.append(db_product)
    
    # Insert in batches
    batch_size = 500
    inserted = 0
    
    for i in range(0, len(db_products), batch_size):
        batch = db_products[i:i+batch_size]
        result = collection.insert_many(batch)
        inserted += len(result.inserted_ids)
        print(f"Progress: {inserted}/{len(db_products)} products inserted")
    
    print(f"\n✅ Successfully imported {inserted} products!")
    
    # Verify
    total = collection.count_documents({})
    with_images = collection.count_documents({'image': {'$ne': 'https://via.placeholder.com/500'}})
    with_variants = collection.count_documents({'hasVariations': True})
    
    print(f"\n📊 Final statistics:")
    print(f"- Total products: {total}")
    print(f"- Products with images: {with_images}")
    print(f"- Products with variants: {with_variants}")
    
    # Show samples
    print("\n📋 Sample products:")
    for i, product in enumerate(collection.find().limit(5)):
        print(f"{i+1}. {product['name']}")
        print(f"   Price: {product.get('price', 0)}")
        print(f"   Has image: {'Yes' if product['image'] != 'https://via.placeholder.com/500' else 'No'}")
        print(f"   Variants: {len(product.get('variants', []))}")
    
    client.close()

def main():
    products = parse_new_json()
    
    if not products:
        print("❌ No products found!")
        return
    
    # Show statistics
    print(f"\n📊 Product statistics:")
    with_images = sum(1 for p in products if p.get('image_urls') and len(p['image_urls']) > 0)
    with_variants = sum(1 for p in products if p.get('variants_dict') and len(p['variants_dict']) > 0)
    without_images_but_variants = sum(1 for p in products 
        if (not p.get('image_urls') or len(p['image_urls']) == 0) 
        and p.get('variants_dict')
        and any(v.get('variant_image') for v in p['variants_dict']))
    
    print(f"- Total products: {len(products)}")
    print(f"- With image_urls: {with_images}")
    print(f"- With variants: {with_variants}")  
    print(f"- Without images but with variant images: {without_images_but_variants}")
    
    # Import to MongoDB
    import_to_mongodb(products)

if __name__ == "__main__":
    main()