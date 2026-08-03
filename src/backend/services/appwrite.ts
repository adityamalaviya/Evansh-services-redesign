import { Client, Account, Databases, ID } from 'appwrite';
import { publicEnv } from '@/lib/env';

const client = new Client();
client.setEndpoint(publicEnv.appwriteEndpoint);
client.setProject(publicEnv.appwriteProjectId);

export const account = new Account(client);
export const databases = new Databases(client);
export { client, ID };

// Database & Collection IDs — set these in Appwrite console
// IMPORTANT: If projects are not showing, verify these IDs match your Appwrite Console exactly.
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'Evansh';
export const PROJECTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID || 'projects';
export const INTERNSHIPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_INTERNSHIPS_COLLECTION_ID || 'internships';
export const CONTACT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID || 'contact';
export const COURSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID || 'courses';
export const SERVICES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID || 'services';
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'project-images';

