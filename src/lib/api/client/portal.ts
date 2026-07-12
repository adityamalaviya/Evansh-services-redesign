export async function getPortalData(token: string) {
  const res = await fetch(`${process.env.HONO_API_URL}/portal/data`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) {
    console.error(`API error: ${res.status} ${res.url}`);
    return null;
  }
  return res.json();
}
