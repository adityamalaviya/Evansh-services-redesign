import { config } from '../config/env';
import { logger } from './logger';

interface PipelineRequestOptions {
  method?: string;
  body?: unknown;
  requestId?: string;
}

export async function callPipeline<T>(
  path: string,
  options: PipelineRequestOptions = {}
): Promise<T> {
  const { method = 'POST', body, requestId } = options;
  const url = `${config.pipeline.url}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': config.pipeline.serviceToken,
        ...(requestId ? { 'X-Request-ID': requestId } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown error');
    logger.error({ path, status: res.status, error: errText }, 'FastAPI pipeline error');
    throw new Error(`Pipeline error ${res.status}: ${errText}`);
  }

  return res.json() as Promise<T>;
}
