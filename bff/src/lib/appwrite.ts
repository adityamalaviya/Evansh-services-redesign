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
  enrollments: 'enrollments24651',
  projects: 'project1234',
  settings: 'settings',
} as const;

// ── Helper: create a user-scoped Appwrite client from a session ─────────────
export function createSessionClient(sessionCookie: string) {
  const sessionClient = new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.projectId)
    .setSession(sessionCookie);
  return {
    account: new Account(sessionClient),
  };
}

// ── Type re-exports ──────────────────────────────────────────────────────────
export type AppwriteDocument = Models.Document;
