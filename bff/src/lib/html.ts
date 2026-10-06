/** Escapes HTML special characters to prevent injection in email templates. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Strips HTML tags iteratively until clean to prevent multi-character bypasses (CodeQL CWE-116). */
export function stripHtmlToText(value: string): string {
  let text = value;
  let previous: string;
  do {
    previous = text;
    text = text.replace(/<[^>]*>/g, '');
  } while (text !== previous);
  return text.replace(/[<>]/g, '').trim();
}
