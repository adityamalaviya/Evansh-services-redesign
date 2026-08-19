function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf-token="))
      ?.split("=")[1] ?? ""
  );
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:3001";
  const method = (options?.method ?? "GET").toUpperCase();
  const csrfHeaders: Record<string, string> =
    !["GET", "HEAD", "OPTIONS"].includes(method)
      ? { "x-csrf-token": getCsrfToken() }
      : {};

  const res = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> ?? {}),
      ...csrfHeaders,
    },
  });
  if (!res.ok) throw new Error(`BFF error ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
