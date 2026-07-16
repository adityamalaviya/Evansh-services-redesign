import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get("session");

  if (!session?.value) {
    redirect("/login");
  }

  const res = await fetch(`${process.env.HONO_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${session.value}` },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  return <>{children}</>;
}
