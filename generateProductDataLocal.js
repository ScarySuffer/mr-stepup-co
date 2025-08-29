// generateProductDataLocal.js
const fs = require('fs');
const path = require('path');

// Base directory for your product images (adjust if needed)
const assetsDir = path.join(__dirname, 'public', 'assets');

// Top-level brand folders
const brandFolders = ['Puma', 'adidas', 'Converse', 'New-Balance', 'nike'];

// Map brands to color codes for product cards
const brandColorMap = {
  'Puma': 'orange',
  'adidas': 'blue',
  'Converse': 'pink',
  'New-Balance': 'green',
  'nike': 'red'
};

// --- Helper functions ---
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/-+$/, '');
}

function capitalizeWords(str) {
  return str.replace(/[-_]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function readFiles(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  return fs.readdirSync(folderPath).filter(f => {
    const stat = fs.statSync(path.join(folderPath, f));
    return stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
  });
}

// --- Main product generation ---
const allProducts = [];

for (const brand of brandFolders) {
  const brandPath = path.join(assetsDir, brand);
  if (!fs.existsSync(brandPath)) continue;

  const subFoldersOrdered = ['front', 'left', 'right', 'otherViews'];
  const productMap = {};

  subFoldersOrdered.forEach(sub => {
    const subPath = path.join(brandPath, sub);
    if (!fs.existsSync(subPath)) return;

    const files = readFiles(subPath);
    files.forEach(file => {
      let baseName = file.replace(/\.(jpg|jpeg|png|webp)$/i, '')
        .replace(/-(front|left|right|side|top|bottom|upside|showcase)$/i, '')
        .trim()
        .toLowerCase();

      if (!productMap[baseName]) {
        productMap[baseName] = {
          brand,
          baseName,
          frontImage: null,
          leftImage: null,
          rightImage: null,
          otherImages: []
        };
      }

      const publicPath = `/assets/${brand}/${sub}/${file}`;

      if (sub === 'front') productMap[baseName].frontImage = publicPath;
      else if (sub === 'left') productMap[baseName].leftImage = publicPath;
      else if (sub === 'right') productMap[baseName].rightImage = publicPath;
      else if (sub === 'otherViews') productMap[baseName].otherImages.push(publicPath);
    });
  });

  Object.values(productMap).forEach(prod => {
    const id = slugify(`${prod.brand}-${prod.baseName}`);
    const galleryImages = [];
    if (prod.frontImage) galleryImages.push(prod.frontImage);
    if (prod.leftImage) galleryImages.push(prod.leftImage);
    if (prod.rightImage) galleryImages.push(prod.rightImage);
    galleryImages.push(...prod.otherImages);

    const mainImage = galleryImages[0] || `/assets/placeholder.jpg`;
    const hoverImage = galleryImages.length > 1 ? galleryImages[1] : mainImage;

    allProducts.push({
      id,
      brand: prod.brand,
      name: capitalizeWords(prod.baseName),
      price: 999.99,
      description: `High-quality sneaker from ${capitalizeWords(prod.brand)}. Experience comfort and style.`,
      sizes: [6, 7, 8, 9, 10, 11, 12]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 3)
        .sort((a, b) => a - b),
      color: brandColorMap[prod.brand] || 'blue',
      image: mainImage,
      hoverImage,
      galleryImages
    });
  });
}

// --- Write productData.js ---
const outputFile = path.join(__dirname, 'src', 'components', 'productData.js');
const content =
  `// Auto-generated product data from local assets\n\n` +
  `const productData = [\n` +
  allProducts.map(p => JSON.stringify(p, null, 2)).join(',\n') +
  `\n];\n\nexport default productData;\n`;

fs.writeFileSync(outputFile, content);
console.log(`✅ productData.js generated with ${allProducts.length} products at:\n${outputFile}`);
