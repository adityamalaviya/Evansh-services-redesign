process.env.APPWRITE_ENDPOINT = 'https://example.com/v1';
process.env.APPWRITE_PROJECT_ID = 'test-project';
process.env.APPWRITE_API_KEY = 'test-api-key';
process.env.APPWRITE_DB_ID = 'test-db';
process.env.APPWRITE_BUCKET_ID = 'test-bucket';
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.PIPELINE_SERVICE_TOKEN = 'test-pipeline-service-token-1234567890';
process.env.PIPELINE_URL = 'http://pipeline.test';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('./logger', () => ({
  logger: { error: jest.fn() },
}));

const { callPipeline } = require('./fastapi') as typeof import('./fastapi');

describe('callPipeline', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends the internal request and returns the JSON response', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ valid: true }), { status: 200 })
    );

    await expect(
      callPipeline('/pipeline/validate', {
        body: { email: 'user@example.com' },
        requestId: 'request-123',
      })
    ).resolves.toEqual({ valid: true });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://pipeline.test/pipeline/validate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-Service-Token': process.env.PIPELINE_SERVICE_TOKEN,
          'X-Request-ID': 'request-123',
        }),
      })
    );
  });
});
