// uploadProducts.js
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');
const productData = require('../components/productData.js').default;
    
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const uploadProducts = async () => {
  try {
    console.log('Starting product data upload...');
    const batch = db.batch();
    const productsCollection = db.collection('products');

    productData.forEach(product => {
      // Use the existing product ID as the document ID for clean URLs
      const docRef = productsCollection.doc(product.id);
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log(`✅ Successfully uploaded ${productData.length} products to Firestore.`);
  } catch (error) {
    console.error('Error uploading product data:', error);
  }
};

uploadProducts();