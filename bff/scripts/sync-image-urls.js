require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.APPWRITE_DB_ID || process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const bucketId = process.env.APPWRITE_BUCKET_ID || process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(process.env.APPWRITE_API_KEY);
const databases = new Databases(client);
const fileUrl = (fileId) => `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;

async function syncCollection(collectionId, mappings) {
  const result = await databases.listDocuments(databaseId, collectionId);
  for (const document of result.documents) {
    const updates = {};
    for (const [fileIdField, urlField] of mappings) {
      if (document[fileIdField]) updates[urlField] = fileUrl(document[fileIdField]);
    }
    if (Object.keys(updates).length) {
      await databases.updateDocument(databaseId, collectionId, document.$id, updates);
      console.log(`${collectionId}/${document.$id}`, updates);
    }
  }
}

(async () => {
  await syncCollection('courses', [['cardImageFileId', 'cardImageUrl'], ['heroImageFileId', 'heroImageUrl']]);
  await syncCollection('services', [['imageFileId', 'ImageUrl']]);
  await syncCollection('project1234', [['thumbnailFileId', 'image_url']]);
  console.log('Image URL synchronization complete.');
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
