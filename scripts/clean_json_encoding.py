#!/usr/bin/env python3
import json
import sys

def clean_json_file(input_file, output_file):
    """Clean JSON file with encoding issues."""
    try:
        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        content = None
        
        for encoding in encodings:
            try:
                with open(input_file, 'r', encoding=encoding, errors='ignore') as f:
                    content = f.read()
                print(f"Successfully read file with {encoding} encoding")
                break
            except Exception as e:
                continue
        
        if content is None:
            print("Could not read file with any encoding")
            return False
        
        # Clean up control characters and fix common issues
        # Remove BOM if present
        if content.startswith('\ufeff'):
            content = content[1:]
        
        # Replace problematic characters
        content = content.replace('\x00', '')  # Null bytes
        content = content.replace('\r\n', '\n')  # Windows line endings
        
        # Try to parse JSON
        try:
            data = json.loads(content)
            print(f"Successfully parsed JSON with {len(data)} items")
            
            # Write cleaned JSON
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f"Cleaned JSON saved to {output_file}")
            return True
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            # Try to fix common JSON issues
            # This is a simple attempt, might need more sophisticated fixing
            print("Attempting to fix JSON structure...")
            
            # Save the raw content for inspection
            with open(output_file + '.raw', 'w', encoding='utf-8', errors='ignore') as f:
                f.write(content)
            print(f"Raw content saved to {output_file}.raw for inspection")
            return False
            
    except Exception as e:
        print(f"Error processing file: {e}")
        return False

if __name__ == "__main__":
    # Clean the problematic JSON file
    print("Cleaning prendo_unique_combine_output.json...")
    clean_json_file('prendo_unique_combine_output.json', 'prendo_unique_combine_output_clean.json')
    
    print("\nCleaning prendo_output_22_08_2025 (1).json...")
    clean_json_file('prendo_output_22_08_2025 (1).json', 'prendo_output_clean.json')