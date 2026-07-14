import {
  Client,
  Databases,
  Storage,
  Account,
  ID,
  Query,
  Models,
} from 'node-appwrite';
import { config } from '../config/env';

// ── Appwrite client (server-side only — API key never exposed to browser) ──
const client = new Client()
  .setEndpoint(config.appwrite.endpoint)
  .setProject(config.appwrite.projectId)
  .setKey(config.appwrite.apiKey);

export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

// ── Collection IDs ──────────────────────────────────────────────────────────
export const DB_ID = config.appwrite.dbId;
export const BUCKET_ID = config.appwrite.bucketId;

export const COLLECTIONS = {
  courses: 'courses',
  services: 'services',
  contactMessages: 'contactmessages',
  projects: 'project1234',
  portfolio: 'portfolio',
  portfolioImages: 'portfolioimages',
  categories: 'categories',
  settings: 'settings',
  user: 'user24651',
  userProfile: 'user_profile24651',
} as const;

// ── Helper: create a user-scoped Appwrite client from a session ─────────────
// Used in auth middleware to verify session cookies
export function createSessionClient(sessionCookie: string) {
  const sessionClient = new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.projectId)
    .setSession(sessionCookie);
  return {
    account: new Account(sessionClient),
  };
}

// ── Storage URL helper ───────────────────────────────────────────────────────
export function getFileUrl(fileId: string): string {
  return `${config.appwrite.endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${config.appwrite.projectId}`;
}

export function getFilePreviewUrl(fileId: string, width = 800, height = 600): string {
  return `${config.appwrite.endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?width=${width}&height=${height}&project=${config.appwrite.projectId}`;
}

// ── Type re-exports ──────────────────────────────────────────────────────────
export type AppwriteDocument = Models.Document;
