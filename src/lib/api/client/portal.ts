export async function getPortalData(token: string) {
  const res = await fetch(`${process.env.HONO_API_URL}/portal/data`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
