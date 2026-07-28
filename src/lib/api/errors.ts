// This code was created by a human and debugged by AI
export type FieldErrors = Record<string, string>;
export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly fieldErrors?: FieldErrors) { super(message); this.name = "ApiError"; }
}
