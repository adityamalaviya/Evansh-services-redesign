export async function getSession(token: string) {
  const res = await fetch(`${process.env.HONO_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
