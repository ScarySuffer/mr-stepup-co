const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'dynamicgen-holdings-30ee8238b9f6.json'),
});

const bucketName = 'mr-stepup-assets';
const baseURL = `https://storage.googleapis.com/${bucketName}/assets/kicks/`;

// List your brand folders exactly as they appear in GCS.
// Ensure consistency in casing with your GCS bucket structure.
const brandFolders = ['nike', 'adidas', 'Puma', 'Converse', 'New-Balance'];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/-+$/, '');
}

async function generateProductData() {
  const allProducts = [];

  for (const brand of brandFolders) {
    // List all files under the brand folder
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: `assets/kicks/${brand}/`,
    });

    // Group files by product base name (before extension)
    const productsMap = {};

    files.forEach((file) => {
      if (file.name.endsWith('/')) return; // skip folders

      const filePathParts = file.name.split('/');
      const fileName = filePathParts.pop();

      let productBaseName = fileName.split('.')[0];

      // Convert to lowercase early for consistent matching
      productBaseName = productBaseName.toLowerCase();

      // Define common patterns that indicate an image is a variant/angle of a product
      // Order matters: More complex/compound patterns should often come before simpler ones.
      const variationPatterns = [
        // Compound angle/view descriptors (e.g., "-backright", "-frontleft", " front right")
        /-(backright|frontleft|frontright|lefback|leftfront|rightback)$/i,
        /\s(backright|frontleft|frontright|lefback|leftfront|rightback)$/i,
        // Handles "front-right" or "back-left" style patterns, more general.
        /\s(front|back|left|right|side|top|bottom|upside)[-_ ](front|back|left|right|side|top|bottom|upside)$/i,
        /\s(front|back|left|right|side|top|bottom|upside)\s(front|back|left|right|side|top|bottom|upside)$/i, // e.g., " front right"
        
        // Specific views like "bottomside", "frontside"
        /-(bottomside|frontside|leftside|rightside)$/i,
        /\s(bottomside|frontside|leftside|rightside)$/i,

        // Single word angle/view descriptors
        /-(back|front|left|right|side|top|bottom|upside)$/i,
        /\s(back|front|left|right|side|top|bottom|upside)$/i,
        
        // Other common descriptive words for variations
        /-(both|fitted|up|upclose|single)$/i, // e.g., "-both", "-fitted"
        /\s(both|fitted|up|upclose|single)$/i, // e.g., " both", " fitted"

        // Specific cases like "showcase" that might have a hyphen or space
        /[-_ ]?(showcase)$/i, // Catches "-showcase", "_showcase", " showcase"

        /\s\(w\)$/i, // Matches "(W)" for women's models (now lowercase)
        /\s%26\s[a-zA-Z]+$/i, // Matches " %26 White" (for '& White')
      ];

      // Loop through patterns and strip them from the productBaseName multiple times
      // to handle cases where multiple patterns might apply or a pattern might need multiple passes.
      let previousBaseName;
      do {
        previousBaseName = productBaseName;
        for (const pattern of variationPatterns) {
          productBaseName = productBaseName.replace(pattern, '').trim();
        }
        // After stripping, also apply the trailing cleanup to catch any new trailing chars
        productBaseName = productBaseName.replace(/[-_\s]+$/, '').trim();
      } while (productBaseName !== previousBaseName); // Keep looping until no more changes are made
      
      // Use this more generic productBaseName as the key for grouping
      if (!productsMap[productBaseName]) {
        productsMap[productBaseName] = {
          brand: brand,
          baseName: productBaseName, // Now represents the core product name
          images: [],
        };
      }
      
      const publicUrl = `${baseURL}${brand}/${encodeURIComponent(fileName)}`;
      productsMap[productBaseName].images.push(publicUrl);
    });

    // Create product objects from grouped files
    Object.values(productsMap).forEach((product) => {
      // Sort images to ensure consistent main image selection.
      product.images.sort(); 

      const id = slugify(`${product.brand}-${product.baseName}`);

      allProducts.push({
        id,
        brand: product.brand,
        // Ensure the display name is nicely formatted (capitalize words if preferred)
        name: product.baseName.replace(/[-_]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').trim(),
        price: 1999.99, // dummy price, edit as needed
        image: product.images[0], // first image as main after sorting
        description: `High-quality sneaker from ${product.brand}.`,
        sizes: [6, 7, 8, 9, 10, 11],
        otherImages: product.images.slice(1), // rest of the images as otherImages
      });
    });
  }

  // Write productData.js file
  const outputFile = path.join(__dirname, 'src/components/productData.js');
  const content =
    `// Auto-generated product data\n\n` +
    `const productData = ${JSON.stringify(allProducts, null, 2)};\n\n` +
    `export default productData;\n`;

  fs.writeFileSync(outputFile, content);
  console.log(`✅ productData.js generated with ${allProducts.length} products at:\n${outputFile}`);
}

generateProductData().catch(console.error);