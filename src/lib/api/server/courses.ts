export async function getCourses() {
  const res = await fetch(`${process.env.HONO_API_URL}/courses`, {
    next: { revalidate: 3600, tags: ['courses'] }
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
