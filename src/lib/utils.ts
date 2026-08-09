import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely sanitizes an image URL to prevent DOM text reinterpretation as HTML or XSS
 * by enforcing that the protocol is blob:, data:, http:, or https:, or is a relative path.
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const proto = parsed.protocol.toLowerCase();
    if (proto === "http:" || proto === "https:" || proto === "blob:" || proto === "data:") {
      return trimmed;
    }
  } catch {
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("blob:") || lower.startsWith("data:image/")) {
      return trimmed;
    }
  }
  return "";
}
