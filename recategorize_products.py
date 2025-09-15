#!/usr/bin/env python3
import requests
import json
import re

# Category IDs
CATEGORIES = {
    'accessories': '68b2f7a065a5cb13315a52a7',
    'apparel': '68b2f79d65a5cb13315a529a',
    'bags': '68b2f7a465a5cb13315a52bb',
    'brands': '68a9c487edaa349aacbf3157',
    'corporate_gifts': '68a9c487edaa349aacbf3150',
    'drinkware': '68b2f7a165a5cb13315a52ae',
    'eco_friendly': '68a9c487edaa349aacbf3156',
    'exhibition': '68a9c487edaa349aacbf3154',
    'food_beverage': '68b2f7a265a5cb13315a52b1',
    'gift_advertising': '68a9c487edaa349aacbf314f',
    'giveaways': '68a9c487edaa349aacbf314d',
    'office_supplies': '68a9c487edaa349aacbf3151',
    'other': '68b2f79f65a5cb13315a52a5',
    'personal_protection': '68a9c487edaa349aacbf3153',
    'printed_materials': '68a9c487edaa349aacbf3155',
    'profile_clothing': '68a9c487edaa349aacbf314c',
    'profile_products': '68a9c487edaa349aacbf314e',
    'promotional_items': '68b2f7a165a5cb13315a52ab',
    'safety': '68b2f79f65a5cb13315a52a3',
    'tech_accessories': '68b2f7a365a5cb13315a52b6',
    'textiles': '68b2f7a265a5cb13315a52b3',
    'toys_games': '68b2f7a465a5cb13315a52b9',
    'work_clothes': '68a9c487edaa349aacbf3152'
}

def categorize_product(product):
    """Determine the best category for a product based on its name and description"""
    name_lower = product.get('name', '').lower()
    desc_lower = product.get('description', '').lower()
    tags = [tag.lower() for tag in product.get('tags', [])]
    combined_text = f"{name_lower} {desc_lower} {' '.join(tags)}"
    
    # Office & Supplies
    if any(word in combined_text for word in [
        'isskrapa', 'ice scraper', 'pennor', 'pen', 'penna', 'pencil', 
        'linjal', 'ruler', 'suddgummi', 'eraser', 'häftapparat', 'stapler',
        'gem', 'paper clip', 'anteckningsblock', 'notepad', 'skrivbord', 'desk',
        'kontorsmaterial', 'office', 'skrivare', 'printer', 'kalkylator', 'calculator',
        'papper', 'paper', 'kuvert', 'envelope', 'brevpapper', 'stationery'
    ]):
        return CATEGORIES['office_supplies']
    
    # Food & Beverage (kitchen tools)
    if any(word in combined_text for word in [
        'osthyvel', 'cheese slicer', 'köksutrustning', 'kitchen', 'skärbräda', 'cutting board',
        'kniv', 'knife', 'sked', 'spoon', 'gaffel', 'fork', 'tallrik', 'plate',
        'köksredskap', 'kitchenware', 'gryta', 'pot', 'stekpanna', 'pan',
        'smörkniv', 'butter knife', 'korkskruv', 'corkscrew', 'flasköppnare', 'bottle opener'
    ]):
        return CATEGORIES['food_beverage']
    
    # Promotional Items
    if any(word in combined_text for word in [
        'kylskåpsmagnet', 'fridge magnet', 'magnet', 'nyckelring', 'keychain',
        'reflex', 'reflector', 'klistermärke', 'sticker', 'badge', 'pin',
        'reklam', 'advertising', 'kampanj', 'campaign', 'marknadsföring', 'marketing',
        'give-away', 'giveaway', 'profilprodukt', 'promotional'
    ]):
        return CATEGORIES['promotional_items']
    
    # Tech Accessories
    if any(word in combined_text for word in [
        'usb', 'kabel', 'cable', 'laddare', 'charger', 'powerbank', 'hörlurar',
        'headphones', 'earphones', 'högtalare', 'speaker', 'mus', 'mouse',
        'tangentbord', 'keyboard', 'skärmrengöring', 'screen cleaner', 'datorväska',
        'laptop', 'tablet', 'telefon', 'phone', 'elektronik', 'electronic'
    ]):
        return CATEGORIES['tech_accessories']
    
    # Eco-friendly Products
    if any(word in combined_text for word in [
        'eco', 'eko', 'miljövänlig', 'environmental', 'hållbar', 'sustainable',
        'återvunnen', 'recycled', 'bambu', 'bamboo', 'r-pet', 'rpet',
        'biologisk', 'organic', 'kompostbar', 'compostable', 'återvinningsbar', 'recyclable'
    ]):
        return CATEGORIES['eco_friendly']
    
    # Corporate Gifts
    if any(word in combined_text for word in [
        'företagsgåva', 'corporate gift', 'affärsgåva', 'business gift',
        'kundgåva', 'client gift', 'personalgåva', 'employee gift',
        'presentkort', 'gift card', 'gåvoset', 'gift set', 'exklusiv', 'exclusive',
        'premium', 'lyx', 'luxury'
    ]):
        return CATEGORIES['corporate_gifts']
    
    # Personal Protection
    if any(word in combined_text for word in [
        'skydd', 'protection', 'säkerhet', 'safety', 'hjälm', 'helmet',
        'handskar', 'gloves', 'skyddsglasögon', 'safety glasses', 'mask', 'munskydd',
        'varsel', 'hi-vis', 'reflective', 'skyddskläder', 'protective clothing'
    ]):
        return CATEGORIES['personal_protection']
    
    # Toys & Games
    if any(word in combined_text for word in [
        'leksak', 'toy', 'spel', 'game', 'pussel', 'puzzle', 'frisbee',
        'boll', 'ball', 'lego', 'docka', 'doll', 'nalle', 'teddy',
        'barn', 'children', 'kids', 'lek', 'play'
    ]):
        return CATEGORIES['toys_games']
    
    # Textiles
    if any(word in combined_text for word in [
        'handduk', 'towel', 'filt', 'blanket', 'kudde', 'pillow',
        'lakan', 'sheet', 'tyg', 'fabric', 'textil', 'textile',
        'bomull', 'cotton', 'fleece', 'ull', 'wool'
    ]):
        return CATEGORIES['textiles']
    
    # Work Clothes
    if any(word in combined_text for word in [
        'arbetskläder', 'workwear', 'overall', 'uniform', 'arbetsbyxor', 'work pants',
        'arbetsjacka', 'work jacket', 'verktygsväst', 'tool vest', 'skyddssko', 'safety shoe',
        'arbetsskor', 'work shoes', 'yrkeskläder', 'professional clothing'
    ]):
        return CATEGORIES['work_clothes']
    
    # Giveaways (small promotional items)
    if any(word in combined_text for word in [
        'gratis', 'free', 'liten gåva', 'small gift', 'billig', 'cheap',
        'massutdelning', 'mass distribution', 'kampanjprodukt', 'campaign product'
    ]):
        return CATEGORIES['giveaways']
    
    # If no match, return None (keep in Other)
    return None

def main():
    print("=" * 80)
    print("PRODUCT RECATEGORIZATION SCRIPT")
    print("=" * 80)
    
    # Get products from Other category
    print("\nFetching products from 'Other' category...")
    
    page = 1
    products_to_update = []
    total_checked = 0
    
    while total_checked < 1000:  # Check first 1000 products
        response = requests.get(f"http://localhost:3000/api/products?categoryId={CATEGORIES['other']}&limit=100&page={page}")
        data = response.json()
        products = data['products']
        
        if not products:
            break
            
        for product in products:
            new_category = categorize_product(product)
            if new_category and new_category != CATEGORIES['other']:
                products_to_update.append({
                    'id': product['_id'],
                    'name': product['name'],
                    'old_category': CATEGORIES['other'],
                    'new_category': new_category,
                    'new_category_name': [k for k, v in CATEGORIES.items() if v == new_category][0]
                })
        
        total_checked += len(products)
        page += 1
        print(f"  Checked {total_checked} products...")
        
        if page > 10:  # Max 10 pages for safety
            break
    
    print(f"\nFound {len(products_to_update)} products to recategorize")
    
    # Group by new category
    category_groups = {}
    for product in products_to_update:
        cat_name = product['new_category_name']
        if cat_name not in category_groups:
            category_groups[cat_name] = []
        category_groups[cat_name].append(product)
    
    print("\nProducts to move:")
    print("-" * 60)
    for cat_name, products in category_groups.items():
        print(f"\n{cat_name.replace('_', ' ').title()}: {len(products)} products")
        for p in products[:3]:  # Show first 3 examples
            print(f"  - {p['name'][:50]}...")
    
    # Auto-confirm since user requested this
    print("\n" + "=" * 80)
    print("\nProceeding with automatic update as requested...")
    
    if True:  # Auto-confirm
        print("\nUpdating products...")
        success_count = 0
        error_count = 0
        
        for product in products_to_update:
            try:
                # Update the product
                update_response = requests.put(
                    f"http://localhost:3000/api/products/{product['id']}",
                    json={'categoryId': product['new_category']},
                    headers={'Content-Type': 'application/json'}
                )
                
                if update_response.status_code == 200:
                    success_count += 1
                    print(f"✅ Updated: {product['name'][:40]}... -> {product['new_category_name']}")
                else:
                    error_count += 1
                    print(f"❌ Failed: {product['name'][:40]}...")
            except Exception as e:
                error_count += 1
                print(f"❌ Error updating {product['name'][:40]}...: {e}")
        
        print(f"\n" + "=" * 80)
        print(f"RECATEGORIZATION COMPLETE")
        print(f"✅ Successfully updated: {success_count} products")
        if error_count > 0:
            print(f"❌ Failed to update: {error_count} products")
    else:
        print("\nRecategorization cancelled.")

if __name__ == "__main__":
    main()