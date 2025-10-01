#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map of common hardcoded strings to translation keys
const translationMap = {
  // Common actions
  '"Save"': 't("common.save")',
  '"Cancel"': 't("common.cancel")',
  '"Delete"': 't("common.delete")',
  '"Edit"': 't("common.edit")',
  '"Add"': 't("common.add")',
  '"Remove"': 't("common.remove")',
  '"Update"': 't("common.update")',
  '"Submit"': 't("common.submit")',
  '"Close"': 't("common.close")',
  '"Search"': 't("common.search")',
  '"Filter"': 't("common.filter")',
  '"Loading..."': 't("common.loading")',
  '"Select"': 't("common.select")',
  '"None"': 't("common.none")',
  '"All"': 't("common.all")',
  '"Apply"': 't("common.apply")',
  '"Clear"': 't("common.clear")',
  '"Reset"': 't("common.reset")',
  
  // Product related
  '"Add to Cart"': 't("products.addToCart")',
  '"Out of Stock"': 't("products.outOfStock")',
  '"In Stock"': 't("products.inStock")',
  '"Products"': 't("products.products")',
  '"All Products"': 't("products.allProducts")',
  '"Price"': 't("products.price")',
  '"Quantity"': 't("products.quantity")',
  '"Description"': 't("products.description")',
  '"Category"': 't("products.category")',
  '"All Categories"': 't("products.allCategories")',
  
  // Dashboard
  '"Dashboard"': 't("dashboard.dashboard")',
  '"Admin Panel"': 't("dashboard.adminPanel")',
  '"Management Dashboard"': 't("dashboard.managementDashboard")',
  '"Total Users"': 't("dashboard.totalUsers")',
  '"Total Products"': 't("dashboard.totalProducts")',
  '"Total Templates"': 't("dashboard.totalTemplates")',
  '"Total Coupons"': 't("dashboard.totalCoupons")',
  
  // Forms
  '"Email"': 't("forms.email")',
  '"Password"': 't("forms.password")',
  '"Name"': 't("forms.name")',
  '"Address"': 't("forms.address")',
  '"Phone"': 't("forms.phone")',
  '"Required"': 't("common.required")',
  '"Optional"': 't("common.optional")',
  
  // Status
  '"Active"': 't("status.active")',
  '"Inactive"': 't("status.inactive")',
  '"Pending"': 't("status.pending")',
  '"Completed"': 't("status.completed")',
  '"Failed"': 't("status.failed")',
  '"Success"': 't("status.success")',
  
  // Pagination
  '"Previous"': 't("pagination.previous")',
  '"Next"': 't("pagination.next")',
  '"Page"': 't("pagination.page")',
  '"of"': 't("pagination.of")',
  '"per page"': 't("pagination.perPage")',
  
  // Design tool
  '"Design Tool"': 't("designTool.designTool")',
  '"Front"': 't("designTool.front")',
  '"Back"': 't("designTool.back")',
  '"Left"': 't("designTool.left")',
  '"Right"': 't("designTool.right")',
  '"Color"': 't("designTool.color")',
  '"Size"': 't("designTool.size")',
  '"Text"': 't("designTool.text")',
  '"Image"': 't("designTool.image")',
  '"Upload"': 't("designTool.upload")',
  '"Download"': 't("designTool.download")',
  '"Export"': 't("designTool.export")',
  
  // Cart & Checkout
  '"Cart"': 't("cart.cart")',
  '"Checkout"': 't("checkout.checkout")',
  '"Total"': 't("cart.total")',
  '"Subtotal"': 't("cart.subtotal")',
  '"Shipping"': 't("cart.shipping")',
  '"Tax"': 't("cart.tax")',
  '"Order Summary"': 't("checkout.orderSummary")',
  '"Payment Method"': 't("checkout.paymentMethod")',
  
  // Errors
  '"Something went wrong"': 't("errors.somethingWentWrong")',
  '"Page not found"': 't("errors.pageNotFound")',
  '"Error"': 't("common.error")',
  '"Warning"': 't("common.warning")',
  '"Try again"': 't("common.tryAgain")',
};

// Files to update
const componentsToUpdate = [
  'components/dashboard/admin-dashboard-new.tsx',
  'components/dashboard/operations-dashboard.tsx',
  'components/products/ProductsView.tsx',
  'components/products/product-card-enhanced.tsx',
  'components/products/product-card.tsx',
  'components/layout/navbar.tsx',
  'components/layout/footer.tsx',
  'components/design-tool-editor/design-tool/cental-canvas.tsx',
  'components/design-tool-editor/design-tool/panels/product-panel.tsx',
  'components/dashboard/common/ProductFormDialog.tsx',
  'components/dashboard/common/ProductTable.tsx',
  'components/dashboard/common/DesignFrameEditor.tsx',
  'components/dashboard/common/ImageAngleAssignment.tsx',
  'app/[locale]/cart/page.tsx',
  'app/[locale]/checkout/page.tsx',
  'app/[locale]/products/page.tsx',
  'app/[locale]/dashboard/page.tsx',
  'app/[locale]/admin/page.tsx',
];

// Function to update a file
function updateFile(filePath) {
  const fullPath = path.join('/mnt/c/Users/abdur/Desktop/MRmerch/printwrap_pro_v8', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;
  
  // Check if file already has useTranslations
  const hasUseTranslations = content.includes('useTranslations');
  
  // Add import if needed
  if (!hasUseTranslations && (content.includes('>') || content.includes('placeholder='))) {
    const importStatement = "import { useTranslations } from 'next-intl';\n";
    
    // Add after other imports
    if (content.includes('import')) {
      const lastImportIndex = content.lastIndexOf('import');
      const lineEnd = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, lineEnd + 1) + importStatement + content.slice(lineEnd + 1);
      hasChanges = true;
    }
    
    // Add const t = useTranslations() in the component
    const componentMatch = content.match(/(?:export\s+(?:default\s+)?function|const\s+\w+\s*=.*?(?:function|\(.*?\)\s*=>))\s*[({]/);
    if (componentMatch) {
      const insertIndex = content.indexOf('{', componentMatch.index) + 1;
      content = content.slice(0, insertIndex) + "\n  const t = useTranslations();" + content.slice(insertIndex);
      hasChanges = true;
    }
  }
  
  // Apply translations
  for (const [hardcoded, translation] of Object.entries(translationMap)) {
    const regex = new RegExp(`>\\s*${hardcoded.slice(1, -1)}\\s*<`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `>{${translation}}<`);
      hasChanges = true;
    }
    
    // Also check for placeholder, title, alt attributes
    const attrRegex = new RegExp(`(placeholder|title|alt)=${hardcoded}`, 'g');
    if (attrRegex.test(content)) {
      content = content.replace(attrRegex, `$1={${translation}}`);
      hasChanges = true;
    }
  }
  
  // Check for common patterns and update them
  const patterns = [
    // SelectItem patterns
    { 
      regex: /<SelectItem\s+value="[\w-]+">([^<]+)<\/SelectItem>/g,
      replace: (match, text) => {
        const key = text.toLowerCase().replace(/\s+/g, '');
        return match.replace(`>${text}<`, `>{t("select.${key}")}<`);
      }
    },
    // Button patterns
    {
      regex: /<Button[^>]*>([A-Z][^<]+)<\/Button>/g,
      replace: (match, text) => {
        const key = text.toLowerCase().replace(/\s+/g, '');
        if (translationMap[`"${text}"`]) {
          return match.replace(`>${text}<`, `>{${translationMap[`"${text}"`]}}<`);
        }
        return match.replace(`>${text}<`, `>{t("buttons.${key}")}<`);
      }
    },
    // Label patterns
    {
      regex: /<Label[^>]*>([^<]+)<\/Label>/g,
      replace: (match, text) => {
        const key = text.toLowerCase().replace(/\s+/g, '');
        if (translationMap[`"${text}"`]) {
          return match.replace(`>${text}<`, `>{${translationMap[`"${text}"`]}}<`);
        }
        return match.replace(`>${text}<`, `>{t("labels.${key}")}<`);
      }
    }
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches) {
      matches.forEach(match => {
        const newMatch = pattern.replace(match, match.match(pattern.regex)[1]);
        content = content.replace(match, newMatch);
        hasChanges = true;
      });
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
}

// Main execution
console.log('🌍 Applying translations to all components...\n');

componentsToUpdate.forEach(file => {
  updateFile(file);
});

console.log('\n✨ Translation application complete!');
console.log('\n📝 Next steps:');
console.log('1. Review the updated files for any missed strings');
console.log('2. Test the application in both languages');
console.log('3. Add any missing translation keys to messages/en.json and messages/sv.json');