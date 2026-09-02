const STORAGE_KEY = "evansh_admin_seen_message_ids";

export function getSeenMessageIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function markMessageAsSeen(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const seen = getSeenMessageIds();
    if (!seen.has(id)) {
      seen.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
    }
  } catch {
    // Ignore storage quota/access errors
  }
}

export function markAllMessagesAsSeen(ids: string[]): void {
  if (typeof window === "undefined" || !ids || ids.length === 0) return;
  try {
    const seen = getSeenMessageIds();
    let hasNew = false;
    for (const id of ids) {
      if (id && !seen.has(id)) {
        seen.add(id);
        hasNew = true;
      }
    }
    if (hasNew) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
    }
  } catch {
    // Ignore storage quota/access errors
  }
}

export function getUnseenCount(
  messages: Array<{ $id: string }>,
  seenIds?: Set<string>
): number {
  if (!messages || messages.length === 0) return 0;
  const seen = seenIds ?? getSeenMessageIds();
  let unseen = 0;
  for (const msg of messages) {
    if (msg?.$id && !seen.has(msg.$id)) {
      unseen++;
    }
  }
  return unseen;
}
