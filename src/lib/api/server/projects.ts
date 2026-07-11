export async function getProjects() {
  const res = await fetch(`${process.env.HONO_API_URL}/projects`, {
    next: { revalidate: 3600, tags: ['projects'] }
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
