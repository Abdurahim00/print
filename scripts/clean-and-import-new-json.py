#!/usr/bin/env python3
import json
import re
import sys

def clean_json_file(input_file, output_file):
    """Clean and fix the new.json file"""
    print(f"Reading {input_file}...")
    
    # Try different encodings
    encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
    content = None
    
    for encoding in encodings:
        try:
            with open(input_file, 'r', encoding=encoding) as f:
                content = f.read()
            print(f"Successfully read with {encoding} encoding")
            break
        except UnicodeDecodeError:
            continue
    
    if not content:
        print("Could not read file with any encoding")
        return False
    
    # Fix common JSON issues
    print("Fixing JSON formatting issues...")
    
    # Replace smart quotes with regular quotes
    content = content.replace('"', '"').replace('"', '"')
    content = content.replace(''', "'").replace(''', "'")
    
    # Fix problematic quotes in specific fields
    # Fix the "Detaljer" field issue with unescaped quotes
    content = re.sub(r'""\s+([^"]+)\\n"\s+([^"]+)\\n"', r'"\1\\n\2\\n"', content)
    
    # Fix escaped quotes in values
    content = re.sub(r'\\+"', '\\"', content)
    
    # Remove trailing commas before closing brackets/braces
    content = re.sub(r',\s*}', '}', content)
    content = re.sub(r',\s*]', ']', content)
    
    # Fix unescaped newlines in strings
    content = re.sub(r'(?<!\\)\n(?!["\]}])', '\\n', content)
    
    # Fix specific pattern: "" at start of string value
    content = re.sub(r':\s*""\s*([^"\\]+)', r': "\1', content)
    
    # Try to parse and validate
    try:
        data = json.loads(content)
        print(f"Successfully parsed JSON with {len(data)} items")
        
        # Write cleaned JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Wrote cleaned JSON to {output_file}")
        
        # Print sample structure
        if data and len(data) > 0:
            print(f"\nSample item keys: {list(data[0].keys())[:10]}")
            if 'Title' in data[0]:
                print(f"Title: {data[0]['Title']}")
            if 'image_urls' in data[0]:
                print(f"Has image_urls: {len(data[0]['image_urls'])} images")
            if 'variants_dict' in data[0]:
                print(f"Has variants: {len(data[0]['variants_dict'])} variants")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        
        # Try to find the problematic area
        error_pos = e.pos if hasattr(e, 'pos') else 0
        start = max(0, error_pos - 200)
        end = min(len(content), error_pos + 200)
        print(f"\nProblematic area around position {error_pos}:")
        print(content[start:end])
        
        return False

if __name__ == "__main__":
    if clean_json_file('new.json', 'new_cleaned.json'):
        print("\nSuccess! Use new_cleaned.json for import")
    else:
        print("\nFailed to clean JSON file")