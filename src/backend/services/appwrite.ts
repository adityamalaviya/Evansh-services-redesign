import { Client, Account, ID } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.warn('Appwrite configuration missing. Check your .env.local file.');
}

const client = new Client();
if (endpoint) client.setEndpoint(endpoint);
if (projectId) client.setProject(projectId);

export const account = new Account(client);
export { client, ID };


