// This code was created by a human and debugged by AI
import { ApiError, type FieldErrors } from "./errors";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
type ErrorBody = { message?: string; error?: string; fieldErrors?: FieldErrors };
export async function apiFetch<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL is required.");
  const headers = new Headers(init.headers); if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json"); if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers, credentials: "include", cache: "no-store" });
  if (!response.ok) { const body = await response.json().catch((): ErrorBody => ({})); throw new ApiError(response.status, body.message ?? body.error ?? "Something went wrong. Please try again.", body.fieldErrors); }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}
