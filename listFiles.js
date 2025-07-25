const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'dynamicgen-holdings-30ee8238b9f6.json'),
});

const bucketName = 'mr-stepup-assets';

async function listFilesInFolder() {
  const prefix = 'assets/kicks/nike/';  // change brand here if needed
  const [files] = await storage.bucket(bucketName).getFiles({ prefix });

  console.log(`Files in ${prefix}:`);
  files.forEach(file => {
    console.log(file.name);
  });
}

listFilesInFolder().catch(console.error);
