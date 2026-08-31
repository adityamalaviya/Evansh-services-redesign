import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/appwrite/client', () => ({
  account: {
    get: vi.fn().mockRejectedValue(new Error('unauthenticated')),
    createJWT: vi.fn(),
  },
  client: {},
  databases: {},
  ID: { unique: () => 'mock_id' },
}));

import { api } from '@/lib/api';

describe('Contact Form & Admin Messages Flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submits contact form data to /api/contact successfully', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: 'Message received. We will get back to you shortly.' }),
    } as Response);

    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      subject: 'Consulting Inquiry',
      message: 'Hello, I would like to inquire about cloud architecture consulting.',
    };

    const res = await api.submitContact(payload);
    expect(res.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
  });

  it('fetches contact messages for admin panel', async () => {
    const mockMessages = [
      {
        $id: 'msg_1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        subject: 'Consulting Inquiry',
        message: 'Hello, I would like to inquire about cloud architecture consulting.',
        $createdAt: '2026-08-23T12:00:00.000Z',
      },
    ];

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ total: 1, messages: mockMessages }),
    } as Response);

    const res = await api.adminGetContacts();
    expect(res.total).toBe(1);
    expect(res.messages).toEqual(mockMessages);
  });

  it('deletes a contact message in admin panel', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    await api.adminDeleteContact('msg_1');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/contact/msg_1'),
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});
