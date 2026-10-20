import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, clearJwtCache } from './api';
import { account } from '@/lib/appwrite/client';

vi.mock('@/lib/appwrite/client', () => ({
  account: {
    get: vi.fn(),
    createJWT: vi.fn(),
  },
}));

global.fetch = vi.fn();

describe('api module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearJwtCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearJwtCache();
    vi.useRealTimers();
  });

  it('fetches auth headers and caches JWT', async () => {
    vi.mocked(account.get).mockResolvedValue({ $id: 'user123' } as any);
    vi.mocked(account.createJWT).mockResolvedValue({ jwt: 'test-jwt-token-1' } as any);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ total: 0, courses: [] }),
    } as any);

    // First call should create JWT
    await api.getCourses();
    expect(account.get).toHaveBeenCalledTimes(1);
    expect(account.createJWT).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-jwt-token-1',
        }),
      })
    );

    // Second call within cache window should use cached JWT without calling account API
    await api.getCourses();
    expect(account.get).toHaveBeenCalledTimes(1);
    expect(account.createJWT).toHaveBeenCalledTimes(1);
  });

  it('invalidates cache via active timeout after 4 minutes', async () => {
    vi.mocked(account.get).mockResolvedValue({ $id: 'user123' } as any);
    vi.mocked(account.createJWT)
      .mockResolvedValueOnce({ jwt: 'jwt-token-1' } as any)
      .mockResolvedValueOnce({ jwt: 'jwt-token-2' } as any);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ total: 0, courses: [] }),
    } as any);

    await api.getCourses();
    expect(account.createJWT).toHaveBeenCalledTimes(1);

    // Advance fake timer by 4 minutes
    vi.advanceTimersByTime(4 * 60 * 1000);

    // After timer runs, next call fetches new JWT
    await api.getCourses();
    expect(account.createJWT).toHaveBeenCalledTimes(2);
  });

  it('allows manual cache clearing via clearJwtCache()', async () => {
    vi.mocked(account.get).mockResolvedValue({ $id: 'user123' } as any);
    vi.mocked(account.createJWT)
      .mockResolvedValueOnce({ jwt: 'jwt-token-1' } as any)
      .mockResolvedValueOnce({ jwt: 'jwt-token-2' } as any);
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ total: 0, courses: [] }),
    } as any);

    await api.getCourses();
    expect(account.createJWT).toHaveBeenCalledTimes(1);

    clearJwtCache();

    await api.getCourses();
    expect(account.createJWT).toHaveBeenCalledTimes(2);
  });
});
