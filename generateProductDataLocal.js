// generateProductDataLocal.js
const fs = require('fs');
const path = require('path');

// Assuming public/assets is the base directory for your product images
// Adjust this path if your script is located elsewhere relative to 'public/assets'
const assetsDir = path.join(__dirname, 'public', 'assets');

const brandFolders = ['Puma', 'adidas', 'Converse', 'New-Balance', 'nike']; // Your top-level brand folders

// --- NEW: Define a mapping of brands to specific colors ---
const brandColorMap = {
    'Puma': 'orange',    // Puma will get the orange card design
    'adidas': 'blue',    // Adidas will get the blue card design
    'Converse': 'pink',  // Converse will get the pink card design
    'New-Balance': 'green', // New Balance will get the green card design
    'nike': 'red'       // Nike will get the red card design
    // The 'yellow' color is left available if you add another brand or want a fallback
};

// Helpers (No changes needed here)
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

      if (sub === 'front') {
        productMap[baseName].frontImage = publicPath;
      } else if (sub === 'left') {
        productMap[baseName].leftImage = publicPath;
      } else if (sub === 'right') {
        productMap[baseName].rightImage = publicPath;
      } else if (sub === 'otherViews') {
        productMap[baseName].otherImages.push(publicPath);
      }
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
      price: parseFloat(((Math.random() * 2000) + 1000).toFixed(2)),
      description: `High-quality sneaker from ${capitalizeWords(prod.brand)}. Experience comfort and style.`,
      sizes: [6, 7, 8, 9, 10, 11, 12].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3).sort((a,b) => a-b),
      // --- IMPORTANT CHANGE HERE: Assign color based on brandColorMap ---
      color: brandColorMap[prod.brand] || 'blue', // Assigns a fixed color by brand, defaults to 'blue'
      image: mainImage,
      hoverImage: hoverImage,
      galleryImages: galleryImages
    });
  });
}

// Write the file
const outputFile = path.join(__dirname, 'src', 'components', 'productData.js');
const content =
`// Auto-generated product data from local assets\n\n` +
`const productData = [\n` +
allProducts.map(p => JSON.stringify(p, null, 2)).join(',\n') +
`\n];\n\nexport default productData;\n`;

fs.writeFileSync(outputFile, content);
console.log(`✅ productData.js generated with ${allProducts.length} products at:\n${outputFile}`);