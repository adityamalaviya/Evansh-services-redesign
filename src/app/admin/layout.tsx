import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await cookies();
  const token = session.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await getSession(token);

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return <>{children}</>;
}
