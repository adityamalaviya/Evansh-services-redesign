import { callPipeline } from './fastapi';
import { logger } from './logger';

export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

export async function validateWithPipeline(
  path: string,
  body: Record<string, unknown>,
  requestId?: string
): Promise<ValidationResult> {
  try {
    return await callPipeline<ValidationResult>(path, { body, requestId });
  } catch (err) {
    logger.warn(
      { requestId, path, err: err instanceof Error ? err.message : String(err) },
      'Pipeline validation unavailable or timed out; falling back to schema validation'
    );
    // Graceful degradation: return valid so user is not blocked by auxiliary service downtime
    return { valid: true };
  }
}

