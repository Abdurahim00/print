import json
import pymongo
import os
from datetime import datetime
from dotenv import load_dotenv
from bson import ObjectId
import re

# Load environment variables
load_dotenv('.env')

def clean_text(text):
    """Clean text from encoding issues"""
    if not text:
        return text
    # Common Swedish character replacements
    replacements = {
        '�': 'ä',
        '�': 'ö', 
        '�': 'å',
        '�': 'Ä',
        '�': 'Ö',
        '�': 'Å',
        '�': 'é',
        '�': '?'  # Unknown character
    }
    for bad, good in replacements.items():
        text = text.replace(bad, good)
    return text

def parse_price(price_str):
    """Extract numeric price from string like '507.50 kr/st'"""
    if not price_str:
        return 299.0  # Default price
    
    # Remove spaces and convert comma to dot
    price_str = price_str.replace(' ', '').replace(',', '.')
    
    # Extract numeric value
    match = re.search(r'(\d+\.?\d*)', price_str)
    if match:
        return float(match.group(1))
    return 299.0  # Default price

def import_products():
    # Connect to MongoDB
    client = pymongo.MongoClient(os.getenv('MONGODB_URI'))
    db = client['printwrappro']
    collection = db['products']
    
    # Read JSON file with different encodings
    print("Reading new.json file...")
    
    # Try different encodings
    for encoding in ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']:
        try:
            with open('new.json', 'r', encoding=encoding) as f:
                content = f.read()
                # Fix common encoding issues before parsing
                content = clean_text(content)
                prendo_products = json.loads(content)
                print(f"Successfully read file with {encoding} encoding")
                print(f"Found {len(prendo_products)} products in new.json")
                break
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            print(f"Failed with {encoding}: {e}")
            continue
    else:
        print("Could not read file with any encoding")
        return
    
    # Clear existing products (optional)
    existing_count = collection.count_documents({})
    if existing_count > 0:
        print(f"Clearing {existing_count} existing products...")
        collection.delete_many({})
    
    # Transform and import products (limit to first 100 for testing)
    products_to_import = []
    
    for i, product in enumerate(prendo_products[:100]):
        # Extract price
        price = parse_price(product.get('price_before_tax', ''))
        
        # Get first image or create placeholder
        image_urls = product.get('image_urls', [])
        image = image_urls[0] if image_urls else f"https://via.placeholder.com/400x400/888888/FFFFFF?text=Product"
        
        # Clean title and description
        title = clean_text(product.get('Title', f'Product {i+1}'))
        description = clean_text(product.get('description', 'Quality product from Prendo'))
        
        # Extract brand
        brand_info = product.get('brand_info', '')
        brand = brand_info.split('\n')[0] if brand_info else 'Prendo'
        brand = clean_text(brand)
        
        # Create product document
        doc = {
            'name': title,
            'price': price,
            'basePrice': price,
            'image': image,
            'images': image_urls if image_urls else [image],
            'categoryId': 'apparel',  # Default category
            'subcategoryIds': [],
            'description': description,
            'inStock': True,
            'createdAt': datetime.now(),
            'updatedAt': datetime.now(),
            'eligibleForCoupons': True,
            'articleNo': product.get('Article_no', ''),
            'brand': brand,
            'sizes': product.get('Sizes', []),
            'sourceUrl': product.get('Url', '')
        }
        
        products_to_import.append(doc)
    
    # Insert products
    print(f"\nInserting {len(products_to_import)} products...")
    result = collection.insert_many(products_to_import)
    print(f"✅ Successfully imported {len(result.inserted_ids)} products!")
    
    # Show first 5 products
    print("\n=== FIRST 5 IMPORTED PRODUCTS ===")
    for product in collection.find().limit(5):
        print(f"\n- {product['name']}")
        print(f"  ID: {str(product['_id'])}")
        print(f"  Price: {product['price']} SEK")
        print(f"  Brand: {product.get('brand', 'N/A')}")
        print(f"  Article: {product.get('articleNo', 'N/A')}")
    
    total = collection.count_documents({})
    print(f"\nTotal products in database: {total}")
    
    client.close()

if __name__ == "__main__":
    import_products()