#!/bin/bash

# Fix all color.hex_code errors by adding null checks

echo "Fixing color.hex_code errors in design tool components..."

# Fix right-panel.tsx - line 92
sed -i "s/product.variations.find((v: any) => v.color.hex_code === productColor)/product.variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/right-panel.tsx

# Fix right-panel.tsx - line 151
sed -i "s/v.color.hex_code === productColor/v.color \&\& v.color.hex_code === productColor/g" components/design-tool-editor/design-tool/right-panel.tsx

# Fix central-canvas.tsx - line 393
sed -i "s/product.variations.find((v: any) => v.color.hex_code === productColor)/product.variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/cental-canvas.tsx

# Fix central-canvas.tsx - line 589
sed -i "s/product.variations.find((v: any) => v.color.hex_code === productColor)/product.variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/cental-canvas.tsx

# Fix central-canvas.tsx - line 663
sed -i "s/product.variations.find((v: any) => v.color.hex_code === productColor)/product.variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/cental-canvas.tsx

# Fix product-panel.tsx - line 496
sed -i "s/productColor === variation.color.hex_code/productColor === (variation.color \&\& variation.color.hex_code)/g" components/design-tool-editor/design-tool/panels/product-panel.tsx

# Fix product-panel.tsx - line 506-507
sed -i "s/style={{ backgroundColor: variation.color.hex_code }}/style={{ backgroundColor: variation.color?.hex_code || '#ccc' }}/g" components/design-tool-editor/design-tool/panels/product-panel.tsx
sed -i "s/handleColorChange(variation.color.hex_code)/handleColorChange(variation.color?.hex_code || '')/g" components/design-tool-editor/design-tool/panels/product-panel.tsx

# Fix design-management-panel.tsx - line 45
sed -i "s/selectedProduct.variations.find((v: any) => v.color.hex_code === productColor)/selectedProduct.variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/panels/design-management-panel.tsx

# Fix size-quantity-modal.tsx - line 57
sed -i "s/variations.find((v: any) => v.color.hex_code === productColor)/variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/modals/size-quantity-modal.tsx

# Fix size-quantity-modal.tsx - line 428
sed -i "s/product.variations.find((v: any) => v.color.hex_code === productColor)/product.variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/modals/size-quantity-modal.tsx

# Fix size-quantity-modal.tsx - line 499
sed -i "s/(selectedProduct as any).variations.find((v: any) => v.color.hex_code === productColor)/(selectedProduct as any).variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/modals/size-quantity-modal.tsx

# Fix size-quantity-modal.tsx - line 564
sed -i "s/(selectedProduct as any).variations.find((v: any) => v.color.hex_code === productColor)/(selectedProduct as any).variations.find((v: any) => v.color \&\& v.color.hex_code === productColor)/g" components/design-tool-editor/design-tool/modals/size-quantity-modal.tsx

echo "All color.hex_code errors fixed!"