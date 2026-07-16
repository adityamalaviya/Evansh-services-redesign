import { callPipeline } from './fastapi';

interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
}

export async function validateWithPipeline(
  path: string,
  body: Record<string, unknown>,
  requestId?: string
): Promise<ValidationResult> {
  return callPipeline<ValidationResult>(path, { body, requestId });
}
