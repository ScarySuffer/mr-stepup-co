// generateProductDataLocal.js
// Usage: node generateProductDataLocal.js

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets'); // public folder
const brandFolders = ['Puma', 'adidas', 'Converse', 'New-Balance', 'nike'];

// Helper to slugify IDs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/-+$/, '');
}

// Capitalize words for display name
function capitalizeWords(str) {
  return str.replace(/[-_]/g, ' ')
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
}

// Read files in folder
function readFiles(folderPath) {
  return fs.readdirSync(folderPath).filter(f => {
    const stat = fs.statSync(path.join(folderPath, f));
    return stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
  });
}

const allProducts = [];

for (const brand of brandFolders) {
  const brandPath = path.join(assetsDir, brand);
  if (!fs.existsSync(brandPath)) continue;

  const files = readFiles(brandPath);

  // Group by product base name
  const productsMap = {};

  files.forEach(file => {
    let baseName = file.split('.')[0].toLowerCase();

    // Remove common variations
    baseName = baseName.replace(/-(back|front|left|right|side|top|bottom|upside|showcase|both|fitted|up|upclose|single)$/i, '').trim();

    if (!productsMap[baseName]) {
      productsMap[baseName] = {
        brand,
        baseName,
        images: []
      };
    }

    // Store path for public access
    productsMap[baseName].images.push(`/assets/${brand}/${file}`);
  });

  Object.values(productsMap).forEach(product => {
    product.images.sort();
    const id = slugify(`${product.brand}-${product.baseName}`);
    allProducts.push({
      id,
      brand: product.brand,
      name: capitalizeWords(product.baseName),
      price: 999.99, // dummy price
      image: product.images[0],
      description: `High-quality sneaker from ${product.brand}.`,
      sizes: [6,7,8,9,10,11],
      otherImages: product.images.slice(1)
    });
  });
}

// Write the file in single-line JSON for each product
const outputFile = path.join(__dirname, 'src', 'components', 'productData.js');
const content =
`// Auto-generated product data from local assets\n\n` +
`const productData = [\n` +
allProducts.map(p => JSON.stringify(p)).join(',\n') +
`\n];\n\nexport default productData;\n`;

fs.writeFileSync(outputFile, content);
console.log(`✅ productData.js generated with ${allProducts.length} products at:\n${outputFile}`);
