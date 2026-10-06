process.env.APPWRITE_ENDPOINT = 'https://example.com/v1';
process.env.APPWRITE_PROJECT_ID = 'test-project';
process.env.APPWRITE_API_KEY = 'test-api-key';
process.env.APPWRITE_DB_ID = 'test-db';
process.env.APPWRITE_BUCKET_ID = 'test-bucket';
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.PIPELINE_SERVICE_TOKEN = '12345678901234567890123456789012';
process.env.PIPELINE_URL = 'http://pipeline.test';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('./logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

import { validateWithPipeline } from './pipelineValidation';

describe('validateWithPipeline', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns pipeline validation response when pipeline is healthy', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ valid: true }), { status: 200 })
    );

    const result = await validateWithPipeline(
      '/pipeline/validate/course',
      { title: 'Intro to React' },
      'req-001'
    );

    expect(result).toEqual({ valid: true });
  });

  it('gracefully degrades to { valid: true } when pipeline is offline or times out', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('fetch failed (ECONNREFUSED)'));

    const result = await validateWithPipeline(
      '/pipeline/validate/course',
      { title: 'Intro to React' },
      'req-002'
    );

    // Should NOT throw an uncaught error, preventing HTTP 500
    expect(result).toEqual({ valid: true });
  });

  it('gracefully degrades to { valid: true } when pipeline returns 502/503 error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response('Service Unavailable', { status: 503 })
    );

    const result = await validateWithPipeline(
      '/pipeline/validate/service',
      { title: 'Web Development' },
      'req-003'
    );

    expect(result).toEqual({ valid: true });
  });
});
