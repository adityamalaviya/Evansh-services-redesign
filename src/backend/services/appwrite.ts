import { Client, Account, ID } from 'appwrite';
import { publicEnv } from '@/lib/env';

const client = new Client();
client.setEndpoint(publicEnv.appwriteEndpoint);
client.setProject(publicEnv.appwriteProjectId);

export const account = new Account(client);
export { client, ID };


