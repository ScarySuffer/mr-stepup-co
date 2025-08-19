// generateProductDataLocal.js
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const brandFolders = ['Puma', 'adidas', 'Converse', 'New-Balance', 'nike'];

// Helpers
/**
 * Converts a string to a URL-friendly slug.
 * @param {string} text - The input string.
 * @returns {string} The slugified string.
 */
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/-+$/, '');
}

/**
 * Capitalizes the first letter of each word in a string,
 * replacing hyphens and underscores with spaces.
 * @param {string} str - The input string.
 * @returns {string} The string with capitalized words.
 */
function capitalizeWords(str) {
  return str.replace(/[-_]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Reads image files from a specific folder.
 * @param {string} folderPath - The path to the folder.
 * @returns {string[]} An array of image file names.
 */
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
      // Clean up the filename to get the base product name
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
      // Main image will prioritize front, then left, then right, then any other image
      image: prod.frontImage || prod.leftImage || prod.rightImage || prod.images[0],
      // The hover image will prioritize a different view for a better effect
      hoverImage: prod.rightImage || prod.leftImage || prod.frontImage || prod.images[1] || prod.images[0],
      description: `High-quality sneaker from ${prod.brand}.`,
      sizes: [6, 7, 8, 9, 10, 11],
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
