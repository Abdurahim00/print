#!/usr/bin/env python3
import re
import json

def fix_json():
    print("Reading new.json...")
    
    # Read with latin-1 encoding
    with open('new.json', 'r', encoding='latin-1') as f:
        content = f.read()
    
    print("Fixing JSON issues...")
    
    # Fix the specific Detaljer field issue
    # Pattern: "Detaljer": "" something\\n" something\\n"
    # Should be: "Detaljer": "something\\n something\\n"
    content = re.sub(
        r'"Detaljer":\s*""\s*([^"]+)\\\\n"\s*([^"]+)\\\\n"\s*([^"]+)\\\\n"\s*([^"]+)"',
        r'"Detaljer": "\1\\n\2\\n\3\\n\4"',
        content
    )
    
    # Alternative pattern for shorter Detaljer
    content = re.sub(
        r'"Detaljer":\s*""\s*([^"]+)\\\\n"\s*([^"]+)"',
        r'"Detaljer": "\1\\n\2"',
        content
    )
    
    # Remove double quotes at start of string values
    content = re.sub(r':\s*""\s+([^"])', r': "\1', content)
    
    # Fix trailing commas
    content = re.sub(r',\s*}', '}', content)
    content = re.sub(r',\s*]', ']', content)
    
    print("Parsing JSON...")
    
    try:
        data = json.loads(content)
        print(f"Success! Loaded {len(data)} products")
        
        # Write cleaned version
        with open('new_cleaned.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        
        print("Saved to new_cleaned.json")
        
        # Show sample
        if data:
            item = data[0]
            print(f"\nFirst product: {item.get('Title', 'No title')}")
            print(f"Has image_urls: {'image_urls' in item}")
            print(f"Has variants_dict: {'variants_dict' in item}")
            if 'variants_dict' in item:
                print(f"Number of variants: {len(item['variants_dict'])}")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"JSON error at line {e.lineno}, column {e.colno}: {e.msg}")
        # Show context
        lines = content.split('\n')
        if e.lineno and e.lineno > 0:
            start = max(0, e.lineno - 3)
            end = min(len(lines), e.lineno + 2)
            print("\nContext:")
            for i in range(start, end):
                if i == e.lineno - 1:
                    print(f">>> {lines[i][:100]}")
                else:
                    print(f"    {lines[i][:100]}")
        return False

if __name__ == "__main__":
    fix_json()