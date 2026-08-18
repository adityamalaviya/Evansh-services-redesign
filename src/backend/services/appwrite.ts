// Deprecated: Direct Appwrite calls from frontend are forbidden.
// All requests are routed through the BFF (Node.js/Express, port 3001) -> FastAPI.
// Export placeholder constants if needed for backward compatibility during migration.

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'Evansh';
export const PROJECTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID || 'projects';
export const INTERNSHIPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_INTERNSHIPS_COLLECTION_ID || 'internships';
export const CONTACT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID || 'contact';
export const COURSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COURSES_COLLECTION_ID || 'courses';
export const SERVICES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID || 'services';
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'project-images';

