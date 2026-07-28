// This code was created by a human and debugged by AI
import { revalidateTag } from "next/cache";
const tags = ["services", "portfolio", "courses", "downloads"] as const;
export type CacheTag = (typeof tags)[number];
export function isCacheTag(value: string): value is CacheTag { return tags.includes(value as CacheTag); }
export function revalidateCacheTag(tag: CacheTag): void { revalidateTag(tag, "max"); }
