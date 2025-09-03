#!/usr/bin/env python3
import re
import json
from collections import defaultdict
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
DATABASE_NAME = 'printwrap-pro'

def clean_text(text):
    """Clean text encoding issues"""
    if not text:
        return ''
    
    replacements = {
        'Ã¤': 'ä', 'Ã¶': 'ö', 'Ã¥': 'å',
        'Ã„': 'Ä', 'Ã–': 'Ö', 'Ã…': 'Å',
        'Ã©': 'é', 'Â°': '°'
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text.strip()

def extract_all_product_images():
    """Extract ALL images from the JSON file"""
    print("=== ULTRA AGGRESSIVE IMAGE EXTRACTION ===")
    print("Reading JSON file...")
    
    with open('prendo_unique_combine_output.json', 'rb') as f:
        content = f.read().decode('latin-1', errors='ignore')
    
    content = clean_text(content)
    
    # Split by products - look for pattern that starts a product
    products = []
    current_product = ""
    in_product = False
    brace_count = 0
    
    lines = content.split('\n')
    
    for line in lines:
        if '"Url"' in line and '"Url"' in line:
            if in_product and current_product:
                # Save previous product
                products.append(current_product)
            in_product = True
            current_product = line
            brace_count = line.count('{') - line.count('}')
        elif in_product:
            current_product += '\n' + line
            brace_count += line.count('{') - line.count('}')
            if brace_count <= 0:
                products.append(current_product)
                in_product = False
                current_product = ""
    
    # Add last product if exists
    if current_product:
        products.append(current_product)
    
    print(f"Found {len(products)} product blocks")
    
    # Extract images from each product
    sku_to_images = {}
    products_with_images = 0
    total_images_found = 0
    
    for i, product_str in enumerate(products):
        # Extract SKU
        sku_match = re.search(r'"Article_no"\s*:\s*"([^"]*)"', product_str)
        if not sku_match:
            continue
        
        sku = sku_match.group(1)
        if not sku:
            continue
        
        images = []
        
        # Method 1: Extract from image_urls array
        image_urls_match = re.search(r'"image_urls"\s*:\s*\[([^\]]*)\]', product_str, re.DOTALL)
        if image_urls_match:
            urls_content = image_urls_match.group(1)
            url_pattern = r'"(https?://[^"]+)"'
            for url_match in re.finditer(url_pattern, urls_content):
                url = url_match.group(1)
                if url and 'placeholder' not in url.lower():
                    images.append(url)
        
        # Method 2: Extract from variants_dict
        variants_match = re.search(r'"variants_dict"\s*:\s*\[([^\]]*)\]', product_str, re.DOTALL)
        if variants_match:
            variants_content = variants_match.group(1)
            # Extract variant images
            variant_img_pattern = r'"variant_image"\s*:\s*"([^"]+)"'
            for img_match in re.finditer(variant_img_pattern, variants_content):
                url = img_match.group(1)
                if url and 'placeholder' not in url.lower() and url.startswith('http'):
                    images.append(url)
        
        # Method 3: Find ANY URL that looks like an image
        all_url_pattern = r'"[^"]*"\s*:\s*"(https?://[^"]+\.(?:jpg|jpeg|png|gif|webp|svg))"'
        for url_match in re.finditer(all_url_pattern, product_str, re.IGNORECASE):
            url = url_match.group(1)
            if url and 'placeholder' not in url.lower():
                images.append(url)
        
        # Method 4: Find URLs in static.unpr.io domain (common pattern)
        unpr_pattern = r'(https?://static\.unpr\.io/[^"]+)'
        for url_match in re.finditer(unpr_pattern, product_str):
            url = url_match.group(1)
            if url and 'placeholder' not in url.lower():
                images.append(url)
        
        # Remove duplicates and store
        if images:
            unique_images = list(dict.fromkeys(images))  # Preserve order while removing duplicates
            sku_to_images[sku] = unique_images
            products_with_images += 1
            total_images_found += len(unique_images)
        
        if (i + 1) % 1000 == 0:
            print(f"Processed {i + 1} products, found images for {products_with_images} products...")
    
    print(f"\n=== Extraction Complete ===")
    print(f"Total products processed: {len(products)}")
    print(f"Products with images found: {products_with_images}")
    print(f"Total unique images found: {total_images_found}")
    
    return sku_to_images

def update_mongodb_images(sku_to_images):
    """Update MongoDB with the extracted images"""
    print("\n=== Updating MongoDB ===")
    
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    products_collection = db['products']
    
    # Get products that need updating
    products_to_update = products_collection.find({
        'source': 'prendo',
        '$or': [
            {'image': 'https://via.placeholder.com/500'},
            {'image': None},
            {'image': ''}
        ]
    })
    
    updated = 0
    not_found = 0
    bulk_ops = []
    
    for product in products_to_update:
        sku = product.get('sku', '')
        if sku and sku in sku_to_images:
            images = sku_to_images[sku]
            bulk_ops.append({
                'updateOne': {
                    'filter': {'_id': product['_id']},
                    'update': {
                        '$set': {
                            'image': images[0],
                            'images': images
                        }
                    }
                }
            })
            updated += 1
            
            if len(bulk_ops) >= 500:
                products_collection.bulk_write(bulk_ops)
                print(f"Updated {updated} products...")
                bulk_ops = []
        else:
            not_found += 1
    
    # Execute remaining updates
    if bulk_ops:
        products_collection.bulk_write(bulk_ops)
    
    # Get final statistics
    total_prendo = products_collection.count_documents({'source': 'prendo'})
    with_images = products_collection.count_documents({
        'source': 'prendo',
        'image': {'$ne': 'https://via.placeholder.com/500'}
    })
    without_images = products_collection.count_documents({
        'source': 'prendo',
        'image': 'https://via.placeholder.com/500'
    })
    
    print(f"\n=== FINAL RESULTS ===")
    print(f"Total Prendo products: {total_prendo}")
    print(f"Products WITH images: {with_images}")
    print(f"Products WITHOUT images: {without_images}")
    print(f"Success rate: {(with_images / total_prendo * 100):.1f}%")
    print(f"\nUpdated {updated} products with images")
    print(f"{not_found} products couldn't be matched by SKU")
    
    client.close()

def main():
    # Extract all images
    sku_to_images = extract_all_product_images()
    
    # Save mapping for debugging
    print("\nSample of extracted images:")
    for sku, images in list(sku_to_images.items())[:5]:
        print(f"  SKU {sku}: {len(images)} images")
        if images:
            print(f"    First image: {images[0]}")
    
    # Update MongoDB
    update_mongodb_images(sku_to_images)

if __name__ == "__main__":
    main()