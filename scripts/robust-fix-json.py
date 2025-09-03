#!/usr/bin/env python3
import re
import json

def fix_malformed_json():
    print("Reading new.json with latin-1 encoding...")
    
    with open('new.json', 'r', encoding='latin-1') as f:
        content = f.read()
    
    print(f"File size: {len(content)} characters")
    print("Applying fixes...")
    
    # Fix 1: Replace all problematic "Detaljer" fields
    # This regex handles the pattern where quotes appear in the middle of the value
    def fix_detaljer(match):
        field_content = match.group(1)
        # Remove internal quotes and fix line breaks
        fixed = field_content.replace('\\n"', '\\n').replace('"', '')
        return f'"Detaljer": "{fixed}"'
    
    content = re.sub(r'"Detaljer":\s*"([^}]+?)"(?=,\s*"[A-Z])', fix_detaljer, content)
    
    # Fix 2: Remove double quotes at the start of values
    content = re.sub(r':\s*""\s+', r': "', content)
    
    # Fix 3: Fix escaped backslashes
    content = content.replace('\\\\n', '\\n')
    
    # Fix 4: Remove trailing commas
    content = re.sub(r',\s*}', '}', content)
    content = re.sub(r',\s*]', ']', content)
    
    print("Attempting to parse JSON...")
    
    # Try to parse
    try:
        data = json.loads(content)
        print(f"✅ Successfully parsed {len(data)} products!")
        
        # Save the cleaned JSON
        with open('new_cleaned.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print("✅ Saved to new_cleaned.json")
        
        # Show statistics
        products_with_images = sum(1 for item in data if item.get('image_urls'))
        products_with_variants = sum(1 for item in data if item.get('variants_dict'))
        
        print(f"\nStatistics:")
        print(f"- Total products: {len(data)}")
        print(f"- Products with image_urls: {products_with_images}")
        print(f"- Products with variants: {products_with_variants}")
        
        if data:
            print(f"\nSample product:")
            item = data[0]
            print(f"- Title: {item.get('Title', 'No title')}")
            if 'image_urls' in item:
                print(f"- Images: {len(item['image_urls'])} images")
            if 'variants_dict' in item:
                print(f"- Variants: {len(item['variants_dict'])} variants")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing failed: {e}")
        
        # Try a more aggressive fix
        print("\nTrying more aggressive fixes...")
        
        # Remove all Detaljer fields entirely (they're causing issues)
        content = re.sub(r',?\s*"Detaljer":\s*"[^"]*(?:\\.[^"]*)*"', '', content)
        
        try:
            data = json.loads(content)
            print(f"✅ Successfully parsed {len(data)} products after removing Detaljer fields!")
            
            with open('new_cleaned.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print("✅ Saved to new_cleaned.json (without Detaljer fields)")
            
            # Show statistics
            products_with_images = sum(1 for item in data if item.get('image_urls'))
            products_with_variants = sum(1 for item in data if item.get('variants_dict'))
            
            print(f"\nStatistics:")
            print(f"- Total products: {len(data)}")
            print(f"- Products with image_urls: {products_with_images}")
            print(f"- Products with variants: {products_with_variants}")
            
            return True
            
        except json.JSONDecodeError as e2:
            print(f"❌ Still failed: {e2}")
            return False

if __name__ == "__main__":
    fix_malformed_json()