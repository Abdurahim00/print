#!/usr/bin/env python3
import requests
import json

# Get all categories
categories_response = requests.get("http://localhost:3000/api/categories")
categories = categories_response.json()

print("=" * 80)
print("CATEGORY ANALYSIS REPORT")
print("=" * 80)
print(f"\nTotal Categories: {len(categories)}\n")

# Check products in each category
category_stats = []
total_products = 0

for cat in categories:
    # Get products count for this category
    products_response = requests.get(f"http://localhost:3000/api/products?categoryId={cat['id']}&limit=1")
    products_data = products_response.json()
    count = products_data['pagination']['total']
    
    category_stats.append({
        'name': cat['name'],
        'id': cat['id'],
        'count': count,
        'slug': cat['slug']
    })
    total_products += count

# Sort by product count
category_stats.sort(key=lambda x: x['count'], reverse=True)

print("Categories by Product Count:")
print("-" * 60)
for stat in category_stats:
    print(f"{stat['name']:30} {stat['count']:8} products")

print("\n" + "=" * 80)
print("POTENTIAL ISSUES:")
print("-" * 60)

# Check for empty categories
empty_categories = [cat for cat in category_stats if cat['count'] == 0]
if empty_categories:
    print(f"\n⚠️  Empty Categories ({len(empty_categories)}):")
    for cat in empty_categories:
        print(f"   - {cat['name']} (ID: {cat['id']})")
else:
    print("✅ No empty categories found")

# Check for products without categories
all_products_response = requests.get("http://localhost:3000/api/products?limit=1")
all_products_count = all_products_response.json()['pagination']['total']

print(f"\n📊 Total products in database: {all_products_count}")
print(f"📊 Total products with categories: {total_products}")
print(f"📊 Products without categories: {all_products_count - total_products}")

if all_products_count != total_products:
    print(f"\n⚠️  {all_products_count - total_products} products may not be properly categorized!")

# Check subcategories
print("\n" + "=" * 80)
print("SUBCATEGORY ANALYSIS:")
print("-" * 60)

for cat in category_stats[:5]:  # Check top 5 categories
    subs_response = requests.get(f"http://localhost:3000/api/subcategories?categoryId={cat['id']}")
    subcategories = subs_response.json()
    
    if subcategories:
        print(f"\n{cat['name']} ({cat['count']} products):")
        for sub in subcategories[:5]:  # Show first 5 subcategories
            sub_products = requests.get(f"http://localhost:3000/api/products?subcategoryId={sub['id']}&limit=1")
            sub_count = sub_products.json()['pagination']['total']
            print(f"  - {sub['name']}: {sub_count} products")