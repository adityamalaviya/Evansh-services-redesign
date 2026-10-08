import { describe, it, expect, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { requestIdMiddleware } from './requestId';

describe('requestIdMiddleware', () => {
  it('generates a valid UUID when no x-request-id header is provided', () => {
    const req = { headers: {} } as unknown as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    requestIdMiddleware(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(req.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', req.requestId);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('preserves a valid alphanumeric x-request-id header', () => {
    const req = {
      headers: { 'x-request-id': 'custom-req-id-12345' },
    } as unknown as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    requestIdMiddleware(req, res, next);

    expect(req.requestId).toBe('custom-req-id-12345');
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', 'custom-req-id-12345');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('replaces an invalid x-request-id containing disallowed characters', () => {
    const req = {
      headers: { 'x-request-id': '<script>alert(1)</script>' },
    } as unknown as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    requestIdMiddleware(req, res, next);

    expect(req.requestId).not.toContain('<');
    expect(req.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', req.requestId);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
