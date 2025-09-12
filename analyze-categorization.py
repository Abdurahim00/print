#!/usr/bin/env python3
import json
from collections import defaultdict, Counter
import re

def analyze_categorization():
    # Load products with subcategories
    print("Loading products...")
    with open('products-with-complete-subcategories.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"Loaded {len(products)} products")
    
    # Analyze categories
    category_counts = Counter()
    subcategory_counts = Counter()
    category_to_subcategories = defaultdict(set)
    generic_products = []
    
    for product in products:
        category_id = product.get('category', 'no-category')
        subcategory = product.get('extractedSubcategory', 'no-subcategory')
        
        category_counts[category_id] += 1
        subcategory_counts[subcategory] += 1
        category_to_subcategories[category_id].add(subcategory)
        
        # Track products with generic categorization
        if subcategory and ('general-' in subcategory or subcategory == 'no-subcategory'):
            generic_products.append({
                'name': product.get('name', 'Unknown'),
                'url': product.get('sourceUrl', ''),
                'subcategory': subcategory,
                'category': category_id
            })
    
    # Print category distribution
    print("\n📊 CATEGORY DISTRIBUTION:")
    print("=" * 60)
    for cat_id, count in category_counts.most_common():
        percentage = (count / len(products)) * 100
        print(f"{cat_id[:24]}: {count:,} products ({percentage:.1f}%)")
    
    # Print subcategory distribution
    print("\n📁 TOP 30 SUBCATEGORIES:")
    print("=" * 60)
    for subcat, count in subcategory_counts.most_common(30):
        percentage = (count / len(products)) * 100
        print(f"{subcat:30} {count:6,} products ({percentage:5.1f}%)")
    
    # Analyze generic categorization
    generic_by_type = defaultdict(list)
    for prod in generic_products:
        generic_by_type[prod['subcategory']].append(prod)
    
    print(f"\n⚠️  PRODUCTS WITH GENERIC CATEGORIZATION: {len(generic_products):,}")
    print("=" * 60)
    for generic_type, prods in sorted(generic_by_type.items(), key=lambda x: -len(x[1])):
        print(f"\n{generic_type}: {len(prods)} products")
        # Sample URLs to understand what these products are
        for prod in prods[:3]:
            if prod['url']:
                print(f"  - {prod['name'][:50]}")
                print(f"    URL: {prod['url']}")
    
    # Analyze URL patterns for better categorization
    print("\n🔍 ANALYZING URL PATTERNS FOR BETTER CATEGORIZATION:")
    print("=" * 60)
    
    url_patterns = defaultdict(list)
    for prod in generic_products[:1000]:  # Sample first 1000
        url = prod['url']
        if url:
            # Extract meaningful parts from URL
            parts = url.lower().split('/')
            for part in parts:
                if part and not part.startswith('http') and len(part) > 3:
                    # Skip numbers and generic terms
                    if not part.isdigit() and part not in ['www', 'com', 'se', 'med-tryck', 'varumarken']:
                        url_patterns[part].append(prod)
    
    # Find most common patterns
    common_patterns = sorted(url_patterns.items(), key=lambda x: -len(x[1]))[:20]
    
    print("\nCommon URL patterns in generic products:")
    for pattern, prods in common_patterns:
        print(f"  {pattern}: {len(prods)} products")
    
    # Generate recategorization suggestions
    print("\n💡 RECATEGORIZATION SUGGESTIONS:")
    print("=" * 60)
    
    suggestions = {
        'keychains': [],
        'bags': [],
        'clothing': [],
        'office': [],
        'drinkware': [],
        'electronics': [],
        'sports': []
    }
    
    for prod in generic_products:
        url = prod['url'].lower() if prod['url'] else ''
        name = prod['name'].lower()
        
        # Categorize based on URL and name patterns
        if 'nyckelring' in url or 'keychain' in name or 'keyring' in name:
            suggestions['keychains'].append(prod)
        elif any(x in url for x in ['vaska', 'bag', 'ryggsack', 'backpack', 'shoppingvaska']):
            suggestions['bags'].append(prod)
        elif any(x in url for x in ['trojan', 'shirt', 'jacka', 'jacket', 'byxor', 'pants', 'keps', 'cap']):
            suggestions['clothing'].append(prod)
        elif any(x in url for x in ['penna', 'pen', 'antecknings', 'notebook', 'kontor', 'office']):
            suggestions['office'].append(prod)
        elif any(x in url for x in ['mugg', 'mug', 'flaska', 'bottle', 'termos']):
            suggestions['drinkware'].append(prod)
        elif any(x in url for x in ['powerbank', 'usb', 'hogtalare', 'speaker', 'horlurar', 'headphone']):
            suggestions['electronics'].append(prod)
        elif any(x in url for x in ['sport', 'golf', 'fotboll', 'training']):
            suggestions['sports'].append(prod)
    
    for category, prods in suggestions.items():
        if prods:
            print(f"\n{category.upper()}: {len(prods)} products can be recategorized")
            for prod in prods[:2]:
                print(f"  - {prod['name'][:50]}")
    
    # Calculate improvement potential
    total_generic = len(generic_products)
    total_recategorizable = sum(len(prods) for prods in suggestions.values())
    
    print(f"\n📈 IMPROVEMENT POTENTIAL:")
    print(f"Total generic products: {total_generic:,}")
    print(f"Can be properly categorized: {total_recategorizable:,}")
    print(f"Improvement rate: {(total_recategorizable/total_generic*100):.1f}%")
    
    # Save detailed report
    report = {
        'total_products': len(products),
        'category_distribution': dict(category_counts.most_common()),
        'subcategory_distribution': dict(subcategory_counts.most_common(50)),
        'generic_products_count': len(generic_products),
        'generic_samples': generic_products[:100],
        'recategorization_potential': {
            category: len(prods) for category, prods in suggestions.items()
        },
        'improvement_rate': total_recategorizable / total_generic * 100 if total_generic > 0 else 0
    }
    
    with open('categorization-analysis.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("\n📁 Detailed report saved to: categorization-analysis.json")

if __name__ == "__main__":
    analyze_categorization()
