# Print File Generation System

## Overview
The print file generation system automatically creates production-ready files when customers complete their custom product designs. These files include both individual design elements and mockups showing the designs on products.

## Features

### 1. Automatic Generation
- **Review Page**: Users can generate print files from the design review page before checkout
- **Order Processing**: Print files are automatically generated when orders are placed
- **Dashboard Access**: Admin can generate print files for existing orders from the dashboard

### 2. File Contents
Each print file (ZIP format) includes:
- **order_info.json**: Order details and metadata
- **Per Design Angle Folders** (front/back/left/right):
  - `full_design.png`: High-resolution design export
  - `mockup.jpg`: Product visualization with design
  - `elements/`: Individual design elements as separate files
  - `design_data.json`: Raw design data for re-editing

### 3. PDF Format Option
Alternative PDF format includes:
- Cover page with order information
- Design summary with specifications
- Product mockups with designs
- Individual design elements grid

## Usage

### From Design Review Page
```javascript
// Button available on review page
<Button onClick={handleGeneratePrintFile}>
  Generate Print File
</Button>
```

### From Dashboard
```javascript
import { PrintFileButton } from '@/components/dashboard/PrintFileButton'

// Add to order management view
<PrintFileButton order={order} />
```

### Programmatic Generation
```javascript
import { PrintFileService } from '@/lib/services/printFileService'

await PrintFileService.generatePrintFile({
  product: {
    id: 'product-123',
    name: 'Custom T-Shirt',
    frontImage: '/images/front.jpg',
    // ... other product details
  },
  designs: [
    {
      angle: 'front',
      stepNumber: 1,
      canvasJSON: fabricCanvasData,
      designAreaCm2: 150,
      designAreaPercentage: 25
    }
  ],
  orderId: 'ORD-123456',
  customerName: 'John Doe',
  includeIndividualElements: true,
  includeMockups: true,
  format: 'zip' // or 'pdf'
})
```

## Technical Details

### Dependencies
- **fabric**: Canvas manipulation and design rendering
- **jszip**: ZIP file generation
- **file-saver**: Browser file download handling
- **html2canvas**: HTML to canvas conversion
- **jspdf**: PDF generation

### Design Data Flow
1. User creates design in design tool
2. Design data saved to localStorage during creation
3. On review, designs are loaded and displayed
4. When adding to cart, designs are attached to cart items
5. On checkout, design data is included in order
6. Print files can be generated at any stage

### API Endpoints
- `POST /api/orders/print-file`: Generate print file for order
- Returns binary file data with appropriate headers

## File Structure Example
```
print_file_ORD-123456.zip
├── order_info.json
├── front/
│   ├── full_design.png
│   ├── mockup.jpg
│   ├── design_data.json
│   └── elements/
│       ├── front_element_1_text.png
│       └── front_element_2_image.png
└── back/
    ├── full_design.png
    ├── mockup.jpg
    ├── design_data.json
    └── elements/
        └── back_element_1_logo.png
```

## Benefits for Production
- **Consistency**: Standardized file format for all orders
- **Efficiency**: Automatic separation of design elements
- **Quality**: High-resolution exports at 3x scale
- **Flexibility**: Both individual elements and complete designs
- **Traceability**: Complete order information included