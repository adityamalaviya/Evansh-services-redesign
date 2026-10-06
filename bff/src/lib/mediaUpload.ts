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

  // 1. Try auxiliary FastAPI Pipeline
  try {
    const body = new FormData();
    body.append(
      'file',
      new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }),
      req.file.originalname
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    const response = await fetch(`${config.pipeline.url}/media/${category}/upload-image`, {
      method: 'POST',
      headers: {
        'X-Service-Token': config.pipeline.serviceToken,
        'X-Admin-Verified': 'true',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
      },
      body,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (response.ok) {
      const result = (await response.json()) as UploadedImage;
      if (result.file_id && result.image_url) {
        return result;
      }
    }
    logger.warn(
      { status: response.status, category },
      'Pipeline image upload non-200; falling back to direct Appwrite storage upload'
    );
  } catch (err: unknown) {
    logger.warn(
      { err: err instanceof Error ? err.message : String(err), category },
      'Pipeline image upload unavailable; falling back to direct Appwrite storage upload'
    );
  }

  // 2. Direct Appwrite Storage Fallback
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
  category: 'courses' | 'portfolio' | 'services'
): Promise<void> {
  if (!fileId) return;

  // 1. Try auxiliary FastAPI Pipeline deletion
  try {
    const formData = new FormData();
    formData.append('file_id', fileId);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6_000);

    const res = await fetch(`${config.pipeline.url}/media/${category}/delete-image`, {
      method: 'DELETE',
      headers: {
        'X-Service-Token': config.pipeline.serviceToken,
        'X-Admin-Verified': 'true',
      },
      body: formData,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (res.ok) return;
  } catch (err: unknown) {
    logger.warn(
      { err: err instanceof Error ? err.message : String(err), fileId },
      'Pipeline delete image failed; attempting direct Appwrite storage deletion'
    );
  }

  // 2. Fallback: Direct Appwrite Storage deletion
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
  } catch (cleanupErr: unknown) {
    logger.warn({ cleanupErr, fileId }, 'Failed to delete file from Appwrite storage');
  }
}
