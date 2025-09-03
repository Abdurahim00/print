#!/usr/bin/env python3
import requests
import json

print("=" * 80)
print("CHECKING FOR UNCATEGORIZED PRODUCTS")
print("=" * 80)

# Get all categories
categories_response = requests.get("http://localhost:3000/api/categories")
categories = categories_response.json()
category_ids = [cat['id'] for cat in categories]

# Get sample of all products
all_products_response = requests.get("http://localhost:3000/api/products?limit=100")
products = all_products_response.json()['products']

print(f"\nChecking {len(products)} sample products...\n")

uncategorized = []
miscategorized = []

for product in products:
    cat_id = product.get('categoryId')
    
    if not cat_id:
        uncategorized.append(product)
    elif cat_id not in category_ids:
        miscategorized.append(product)

if uncategorized:
    print(f"⚠️  Found {len(uncategorized)} products WITHOUT categories:")
    for p in uncategorized[:5]:
        print(f"   - {p['name']} (ID: {p['id']})")
else:
    print("✅ All sampled products have a categoryId")

if miscategorized:
    print(f"\n⚠️  Found {len(miscategorized)} products with INVALID category IDs:")
    for p in miscategorized[:5]:
        print(f"   - {p['name']} (Category: {p['categoryId']})")
else:
    print("✅ All sampled products have valid category IDs")

# Check "Other" category specifically
print("\n" + "=" * 80)
print("ANALYZING 'OTHER' CATEGORY (10,384 products)")
print("-" * 60)

other_products = requests.get("http://localhost:3000/api/products?categoryId=68b2f79f65a5cb13315a52a5&limit=10")
other_items = other_products.json()['products']

print("\nSample products in 'Other' category:")
for p in other_items[:5]:
    print(f"  - {p['name']}")
    if 'tags' in p and p['tags']:
        print(f"    Tags: {', '.join(p['tags'][:3])}")

# Check if these should be recategorized
print("\n⚠️  The 'Other' category contains 10,384 products (35.7% of all products)")
print("   This suggests many products may need proper categorization.")
print("\n   Recommendation: Review products in 'Other' category and redistribute to:")
print("   - Office & Supplies (currently empty)")
print("   - Corporate Gifts (currently empty)")
print("   - Profile Products (currently empty)")
print("   - Eco-friendly Products (currently empty)")