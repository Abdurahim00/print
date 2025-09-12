#!/usr/bin/env python3
import json
import re
from urllib.parse import unquote
from collections import Counter, defaultdict

def extract_better_subcategory(product):
    """
    Extract a more specific subcategory based on URL, name, and description
    """
    url = (product.get('sourceUrl') or product.get('variant_url') or '').lower()
    name = (product.get('name') or '').lower()
    description = (product.get('description') or '').lower()
    
    # Decode URL
    url = unquote(url)
    
    # Combined text for analysis
    combined = f"{url} {name} {description}"
    
    # Comprehensive categorization rules
    # Priority 1: Specific product types from URL patterns
    
    # Giveaways & Promotional Items
    if any(x in url for x in ['/giveaways/', '/give-aways/', '/promotionalprodukter/']):
        if 'nyckelring' in url or 'keychain' in combined or 'key ring' in combined:
            return 'keychains'
        if 'nyckelband' in url or 'lanyard' in combined:
            return 'lanyards'
        if 'pins' in url or 'pin' in name:
            return 'pins-badges'
        if 'magnet' in combined:
            return 'magnets'
        if 'reflex' in combined or 'reflector' in combined:
            return 'reflectors'
        if 'armband' in url or 'wristband' in combined or 'bracelet' in combined:
            return 'wristbands'
        if 'sticker' in combined:
            return 'stickers'
        if 'ballong' in url or 'balloon' in combined:
            return 'balloons'
        if 'godis' in url or 'candy' in combined or 'sweet' in combined:
            return 'candy'
        if 'mint' in combined:
            return 'mints'
        if 'flaskoppnare' in url or 'bottle opener' in combined or 'öppnare' in name:
            return 'bottle-openers'
        if 'bagagebricka' in url or 'luggage tag' in combined or 'bagagetag' in name:
            return 'luggage-tags'
    
    # Bags
    if any(x in url for x in ['/vaskor/', '/bags/', '/ryggsackar/']):
        if 'shopping' in combined:
            return 'shopping-bags'
        if 'trolley' in combined:
            return 'trolley-bags'
        if 'resvaska' in combined or 'travel' in combined or 'luggage' in combined:
            return 'travel-bags'
        if 'ryggsack' in combined or 'backpack' in combined:
            return 'backpacks'
        if 'sport' in combined:
            return 'sports-bags'
        if 'axelvaska' in combined or 'shoulder' in combined:
            return 'shoulder-bags'
        if 'datorvaska' in combined or 'laptop' in combined or 'computer bag' in combined:
            return 'laptop-bags'
        if 'kylvaska' in combined or 'cooler' in combined:
            return 'cooler-bags'
        if 'gym' in combined:
            return 'gym-bags'
        if 'necessär' in combined or 'toiletry' in combined:
            return 'toiletry-bags'
        if 'skopåse' in combined or 'shoe bag' in combined:
            return 'shoe-bags'
        if 'drawstring' in combined or 'gympapåse' in name:
            return 'drawstring-bags'
    
    # Clothing - More specific
    if any(x in url for x in ['/profilklader/', '/klader/', '/clothing/', '/apparel/']):
        if 't-shirt' in combined or 'tshirt' in combined:
            return 't-shirts'
        if 'pike' in combined or 'polo' in combined:
            return 'polo-shirts'
        if 'skjorta' in combined or 'shirt' in name and 't-shirt' not in combined:
            return 'shirts'
        if 'huvtroja' in combined or 'hoodie' in combined or 'hood' in name:
            return 'hoodies'
        if 'sweatshirt' in combined:
            return 'sweatshirts'
        if 'jacka' in combined or 'jacket' in combined:
            return 'jackets'
        if 'vast' in combined or 'vest' in combined:
            return 'vests'
        if 'byxa' in combined or 'byxor' in combined or 'pants' in combined or 'trouser' in combined:
            return 'pants'
        if 'shorts' in combined:
            return 'shorts'
        if 'keps' in combined or 'cap' in name:
            return 'caps'
        if 'mossa' in combined or 'beanie' in combined:
            return 'beanies'
        if 'hatt' in combined or 'hat' in name:
            return 'hats'
        if 'scarf' in combined or 'halsduk' in combined:
            return 'scarves'
        if 'handsk' in combined or 'glove' in combined:
            return 'gloves'
        if 'overall' in combined:
            return 'overalls'
        if 'förkläde' in combined or 'apron' in combined:
            return 'aprons'
    
    # Workwear
    if any(x in url for x in ['/arbetsklader/', '/workwear/', '/varselklader/']):
        if 'varsel' in combined or 'hi-vis' in combined or 'high-vis' in combined:
            return 'hi-vis-clothing'
        if 'arbetsbyxa' in combined or 'work pant' in combined:
            return 'work-pants'
        if 'arbetsjacka' in combined or 'work jacket' in combined:
            return 'work-jackets'
        if 'arbetstroja' in combined or 'work shirt' in combined:
            return 'work-shirts'
        if 'arbetspike' in combined or 'work polo' in combined:
            return 'work-polos'
    
    # Office & Business
    if any(x in url for x in ['/kontorsmaterial/', '/office/', '/kontor/']):
        if 'penna' in combined or 'pen' in name:
            return 'pens'
        if 'blyerts' in combined or 'pencil' in combined:
            return 'pencils'
        if 'anteckningsbok' in combined or 'notebook' in combined:
            return 'notebooks'
        if 'kalender' in combined or 'calendar' in combined:
            return 'calendars'
        if 'mapp' in combined or 'folder' in combined:
            return 'folders'
        if 'portfolio' in combined:
            return 'portfolios'
        if 'pennställ' in combined or 'pen holder' in combined:
            return 'pen-holders'
    
    # Drinkware
    if any(x in url for x in ['/muggar/', '/flaskor/', '/drinkware/', '/termos/']):
        if 'mugg' in combined or 'mug' in name:
            return 'mugs'
        if 'termos' in combined or 'thermo' in combined:
            return 'thermo-mugs'
        if 'flaska' in combined or 'bottle' in name:
            if 'sport' in combined:
                return 'sports-bottles'
            return 'water-bottles'
        if 'glas' in combined or 'glass' in name:
            return 'glasses'
        if 'tumbler' in combined:
            return 'tumblers'
    
    # Electronics & Tech
    if any(x in url for x in ['/elektronik/', '/tech/', '/mobiltillbehor/']):
        if 'powerbank' in combined:
            return 'powerbanks'
        if 'usb' in combined:
            return 'usb-drives'
        if 'högtalare' in combined or 'speaker' in combined:
            return 'speakers'
        if 'hörlurar' in combined or 'headphone' in combined or 'earphone' in combined:
            return 'headphones'
        if 'mobilskal' in combined or 'phone case' in combined:
            return 'phone-cases'
        if 'laddare' in combined or 'charger' in combined:
            return 'chargers'
        if 'kabel' in combined or 'cable' in combined:
            return 'cables'
        if 'bluetooth' in combined:
            return 'bluetooth-devices'
    
    # Home & Kitchen
    if any(x in url for x in ['/hem-hushall/', '/koksprodukter/', '/kitchen/', '/home/']):
        if 'handduk' in combined or 'towel' in combined:
            return 'towels'
        if 'köksredskap' in combined or 'kitchen tool' in combined:
            return 'kitchen-tools'
        if 'matlåda' in combined or 'lunch box' in combined:
            return 'lunch-boxes'
        if 'ljus' in combined or 'candle' in combined:
            return 'candles'
        if 'doftljus' in combined or 'scented' in combined:
            return 'scented-candles'
        if 'kudde' in combined or 'pillow' in combined:
            return 'pillows'
        if 'filt' in combined or 'blanket' in combined:
            return 'blankets'
        if 'plåd' in combined or 'tray' in combined:
            return 'trays'
    
    # Sports & Leisure
    if any(x in url for x in ['/sport/', '/fritid/', '/golf/', '/training/']):
        if 'golf' in combined:
            return 'golf-accessories'
        if 'fotboll' in combined or 'football' in combined or 'soccer' in combined:
            return 'footballs'
        if 'paraply' in combined or 'umbrella' in combined:
            return 'umbrellas'
        if 'leksak' in combined or 'toy' in combined:
            return 'toys'
        if 'spel' in combined or 'game' in combined:
            return 'games'
        if 'solglasögon' in combined or 'sunglasses' in combined:
            return 'sunglasses'
        if 'strandprodukter' in url or 'beach' in combined:
            return 'beach-products'
        if 'camping' in combined:
            return 'camping-gear'
    
    # Tools & Safety
    if 'verktyg' in combined or 'tool' in name:
        if 'multitool' in combined or 'multiverktyg' in combined:
            return 'multitools'
        if 'ficklampa' in combined or 'flashlight' in combined or 'torch' in combined:
            return 'flashlights'
        if 'måttband' in combined or 'measuring tape' in combined:
            return 'measuring-tapes'
        return 'tools'
    
    # Textiles
    if any(x in url for x in ['/textil/', '/textile/']):
        if 'sängkläder' in combined or 'bedding' in combined:
            return 'bedding'
        return 'textiles'
    
    # Secondary categorization based on name patterns
    if 't-shirt' in name or 'tshirt' in name:
        return 't-shirts'
    if 'polo' in name or 'pike' in name:
        return 'polo-shirts'
    if 'hoodie' in name or 'huvtroja' in name:
        return 'hoodies'
    if 'jacket' in name or 'jacka' in name:
        return 'jackets'
    if 'byxa' in name or 'byxor' in name or 'pants' in name:
        return 'pants'
    if 'shorts' in name:
        return 'shorts'
    if 'keps' in name or 'cap' in name:
        return 'caps'
    if 'bag' in name or 'väska' in name:
        return 'bags'
    if 'ryggsäck' in name or 'backpack' in name:
        return 'backpacks'
    if 'penna' in name or 'pen' in name:
        return 'pens'
    if 'mugg' in name or 'mug' in name:
        return 'mugs'
    if 'flaska' in name or 'bottle' in name:
        return 'bottles'
    
    # If still no match, return None for manual review
    return None

def improve_all_categorizations():
    """
    Improve categorization for all products
    """
    print("Loading products...")
    with open('products-with-complete-subcategories.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"Loaded {len(products)} products")
    
    # Statistics
    improved_count = 0
    generic_before = 0
    generic_after = 0
    subcategory_distribution = Counter()
    improvements = []
    
    # Process all products
    for product in products:
        old_subcategory = product.get('extractedSubcategory')
        
        # Count generic before
        if old_subcategory and ('general-' in old_subcategory or not old_subcategory):
            generic_before += 1
        
        # Try to extract better subcategory
        new_subcategory = extract_better_subcategory(product)
        
        # If we found a better subcategory, use it
        if new_subcategory:
            if old_subcategory != new_subcategory:
                if old_subcategory and 'general-' in old_subcategory:
                    improved_count += 1
                    improvements.append({
                        'name': product.get('name', 'Unknown'),
                        'old': old_subcategory,
                        'new': new_subcategory
                    })
            product['extractedSubcategory'] = new_subcategory
        elif not old_subcategory or 'general-' in old_subcategory:
            # Keep trying with existing subcategory from original extraction
            if not product.get('extractedSubcategory'):
                # Assign to "other" subcategory based on category
                category_id = product.get('category')
                if category_id == '68b2f79f65a5cb13315a52a5':  # Gifts
                    product['extractedSubcategory'] = 'other-gifts'
                elif category_id == '68b2f79d65a5cb13315a529a':  # Bags
                    product['extractedSubcategory'] = 'other-bags'
                elif category_id == '68b2f7a465a5cb13315a52bb':  # Office
                    product['extractedSubcategory'] = 'other-office'
                elif category_id == '68b2f7a165a5cb13315a52ae':  # Apparel
                    product['extractedSubcategory'] = 'other-apparel'
                elif category_id == '68b2f7a065a5cb13315a52a7':  # Electronics
                    product['extractedSubcategory'] = 'other-electronics'
                else:
                    product['extractedSubcategory'] = 'other-products'
        
        # Count final subcategory
        final_subcategory = product.get('extractedSubcategory', 'uncategorized')
        subcategory_distribution[final_subcategory] += 1
        
        # Count generic after
        if final_subcategory and ('general-' in final_subcategory or 'other-' in final_subcategory):
            generic_after += 1
    
    # Print results
    print("\n📊 IMPROVEMENT RESULTS:")
    print("=" * 60)
    print(f"Products with generic categorization before: {generic_before:,}")
    print(f"Products with generic categorization after: {generic_after:,}")
    print(f"Products improved: {improved_count:,}")
    print(f"Improvement rate: {(improved_count/generic_before*100):.1f}%" if generic_before > 0 else "N/A")
    
    print("\n📁 NEW SUBCATEGORY DISTRIBUTION (Top 30):")
    print("=" * 60)
    for subcat, count in subcategory_distribution.most_common(30):
        percentage = (count / len(products)) * 100
        print(f"{subcat:30} {count:6,} products ({percentage:5.1f}%)")
    
    print("\n✨ SAMPLE IMPROVEMENTS:")
    print("=" * 60)
    for imp in improvements[:10]:
        print(f"  {imp['name'][:50]}")
        print(f"    {imp['old']} → {imp['new']}")
    
    # Count unique subcategories
    unique_subcategories = len(subcategory_distribution)
    print(f"\n📈 Total unique subcategories: {unique_subcategories}")
    
    # Save improved products
    print("\n💾 Saving improved categorization...")
    with open('products-improved-categorization.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print("✅ Saved to: products-improved-categorization.json")
    
    # Generate summary report
    report = {
        'timestamp': str(json.dumps({'time': 'now'})),
        'statistics': {
            'total_products': len(products),
            'generic_before': generic_before,
            'generic_after': generic_after,
            'improved': improved_count,
            'improvement_rate': improved_count/generic_before*100 if generic_before > 0 else 0
        },
        'subcategory_distribution': dict(subcategory_distribution.most_common()),
        'unique_subcategories': unique_subcategories,
        'sample_improvements': improvements[:50]
    }
    
    with open('improved-categorization-report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("📁 Report saved to: improved-categorization-report.json")

if __name__ == "__main__":
    improve_all_categorizations()
