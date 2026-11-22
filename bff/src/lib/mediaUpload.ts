import { Request } from 'express';
import { storage, BUCKET_ID, ID, Permission, Role, InputFile } from './appwrite';
import { config } from '../config/env';
import { logger } from './logger';

export interface UploadedImage {
  file_id: string;
  image_url: string;
  category?: string;
}

export async function uploadImageWithFallback(
  req: Request,
  category: 'courses' | 'portfolio' | 'services'
): Promise<UploadedImage> {
  if (!req.file) {
    throw new Error('An image file is required');
  }

  const fileId = ID.unique();
  const inputFile = InputFile.fromBuffer(req.file.buffer, req.file.originalname);
  const uploaded = await storage.createFile(BUCKET_ID, fileId, inputFile, [Permission.read(Role.any())]);

  const imageUrl = `${config.appwrite.endpoint}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${config.appwrite.projectId}`;

  return {
    file_id: uploaded.$id,
    image_url: imageUrl,
    category,
  };
}

export async function deleteImageWithFallback(
  fileId: string,
  _category?: 'courses' | 'portfolio' | 'services'
): Promise<void> {
  if (!fileId) return;

  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch (cleanupErr: unknown) {
    logger.warn({ cleanupErr, fileId }, 'Failed to delete file from Appwrite storage');
  }
}
