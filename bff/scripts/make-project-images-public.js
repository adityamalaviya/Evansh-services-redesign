import 'dotenv/config';
import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.APPWRITE_DB_ID || process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const bucketId = process.env.APPWRITE_BUCKET_ID || process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(process.env.APPWRITE_API_KEY);
const databases = new Databases(client);
const storage = new Storage(client);

(async () => {
  const result = await databases.listDocuments(databaseId, 'project1234');
  for (const project of result.documents) {
    if (!project.thumbnailFileId) continue;
    await storage.updateFile(bucketId, project.thumbnailFileId, undefined, [Permission.read(Role.any())]);
    console.log(`Public read enabled: ${project.thumbnailFileId}`);
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
