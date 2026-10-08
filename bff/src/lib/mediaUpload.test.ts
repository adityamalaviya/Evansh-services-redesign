import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request } from 'express';

const mockCreateFile = jest.fn<(...args: unknown[]) => Promise<{ $id: string }>>();
const mockDeleteFile = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.mock('./appwrite', () => ({
  storage: {
    createFile: (...args: unknown[]) => mockCreateFile(...args),
    deleteFile: (...args: unknown[]) => mockDeleteFile(...args),
  },
  BUCKET_ID: 'mock-bucket-id',
  ID: {
    unique: () => 'mock-unique-id',
  },
  Permission: {
    read: (role: unknown) => ({ role }),
  },
  Role: {
    any: () => 'any',
  },
  InputFile: {
    fromBuffer: (buf: Buffer, name: string) => ({ buffer: buf, filename: name }),
  },
}));

jest.mock('../config/env', () => ({
  config: {
    appwrite: {
      endpoint: 'https://cloud.appwrite.io/v1',
      projectId: 'mock-project-id',
    },
  },
}));

import { uploadImageWithFallback, deleteImageWithFallback } from './mediaUpload';

describe('mediaUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImageWithFallback', () => {
    it('throws an error if no file is present on the request', async () => {
      const req = {} as Request;
      await expect(uploadImageWithFallback(req, 'courses')).rejects.toThrow(
        'An image file is required'
      );
    });

    it('creates file directly in Appwrite Storage and returns UploadedImage', async () => {
      mockCreateFile.mockResolvedValueOnce({ $id: 'uploaded-file-123' });

      const req = {
        file: {
          buffer: Buffer.from('fake-image-bytes'),
          originalname: 'test.png',
          mimetype: 'image/png',
        },
      } as unknown as Request;

      const result = await uploadImageWithFallback(req, 'courses');

      expect(result).toEqual({
        file_id: 'uploaded-file-123',
        image_url:
          'https://cloud.appwrite.io/v1/storage/buckets/mock-bucket-id/files/uploaded-file-123/view?project=mock-project-id',
        category: 'courses',
      });
      expect(mockCreateFile).toHaveBeenCalledWith(
        'mock-bucket-id',
        'mock-unique-id',
        expect.objectContaining({ filename: 'test.png' }),
        expect.any(Array)
      );
    });
  });

  describe('deleteImageWithFallback', () => {
    it('does nothing when fileId is empty', async () => {
      await deleteImageWithFallback('');
      expect(mockDeleteFile).not.toHaveBeenCalled();
    });

    it('deletes file directly from Appwrite Storage', async () => {
      mockDeleteFile.mockResolvedValueOnce({});
      await deleteImageWithFallback('file-to-delete-456', 'services');

      expect(mockDeleteFile).toHaveBeenCalledWith('mock-bucket-id', 'file-to-delete-456');
    });

    it('does not throw when Appwrite Storage delete fails', async () => {
      mockDeleteFile.mockRejectedValueOnce(new Error('Appwrite storage error'));

      await expect(
        deleteImageWithFallback('file-to-delete-456', 'portfolio')
      ).resolves.not.toThrow();
    });
  });
});
