export async function getServices() {
  const res = await fetch(`${process.env.HONO_API_URL}/services`, {
    next: { revalidate: 3600, tags: ['services'] }
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
