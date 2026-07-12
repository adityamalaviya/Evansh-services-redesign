export async function getProjects() {
  const res = await fetch(`${process.env.HONO_API_URL}/projects`, {
    next: { revalidate: 3600, tags: ['projects'] }
  });
  if (!res.ok) {
    console.error(`API error: ${res.status} ${res.url}`);
    return null;
  }
  return res.json();
}
