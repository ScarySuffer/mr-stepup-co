const admin = require('firebase-admin');
const productData = require('./components/productData.js'); // now works
const serviceAccount = require('./firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadProducts() {
  try {
    for (const product of productData) {
      await db.collection('products').doc(product.id).set(product, { merge: true });
      console.log(`✅ Uploaded: ${product.name}`);
    }
    console.log('🎉 All products uploaded successfully!');
  } catch (err) {
    console.error('❌ Error uploading products:', err);
  }
}

uploadProducts();
