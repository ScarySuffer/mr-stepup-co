// generateProductDataLocal.js
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const brandFolders = ['Puma', 'adidas', 'Converse', 'New-Balance', 'nike'];

// Helpers
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

// Read image files in a folder
function readFiles(folderPath) {
  if (!fs.existsSync(folderPath)) return [];
  return fs.readdirSync(folderPath).filter(f => {
    const stat = fs.statSync(path.join(folderPath, f));
    return stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
  });
}

const allProducts = [];

for (const brand of brandFolders) {
  const brandPath = path.join(assetsDir, brand);
  if (!fs.existsSync(brandPath)) continue;

  const subFolders = ['front', 'left', 'right', 'otherViews'];
  const productMap = {};

  subFolders.forEach(sub => {
    const subPath = path.join(brandPath, sub);
    if (!fs.existsSync(subPath)) return;

    const files = readFiles(subPath);
    files.forEach(file => {
      let baseName = file.replace(/\.(jpg|jpeg|png|webp)$/i, '')
                         .replace(/-(front|left|right|side|top|bottom|upside|showcase)$/i, '')
                         .trim()
                         .toLowerCase();

      if (!productMap[baseName]) productMap[baseName] = { brand, baseName, images: [] };

      const publicPath = `/assets/${brand}/${sub}/${file}`;
      if (sub === 'front') productMap[baseName].frontImage = publicPath;
      else if (sub === 'left') productMap[baseName].leftImage = publicPath;
      else if (sub === 'right') productMap[baseName].rightImage = publicPath;
      else productMap[baseName].images.push(publicPath); // otherViews
    });
  });

  Object.values(productMap).forEach(prod => {
    const id = slugify(`${prod.brand}-${prod.baseName}`);
    allProducts.push({
      id,
      brand: prod.brand,
      name: capitalizeWords(prod.baseName),
      price: 999.99,
      image: prod.frontImage || prod.leftImage || prod.rightImage || prod.images[0],
      secondaryImage: prod.rightImage || prod.leftImage || prod.frontImage || prod.images[1] || prod.images[0],
      description: `High-quality sneaker from ${prod.brand}.`,
      sizes: [6,7,8,9,10,11],
      otherImages: [
        ...(prod.leftImage ? [prod.leftImage] : []),
        ...(prod.rightImage ? [prod.rightImage] : []),
        ...prod.images
      ]
    });
  });
}

// Write the file
const outputFile = path.join(__dirname, 'src', 'components', 'productData.js');
const content =
`// Auto-generated product data from local assets\n\n` +
`const productData = [\n` +
allProducts.map(p => JSON.stringify(p)).join(',\n') +
`\n];\n\nexport default productData;\n`;

fs.writeFileSync(outputFile, content);
console.log(`✅ productData.js generated with ${allProducts.length} products at:\n${outputFile}`);
