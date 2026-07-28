"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@backend/services/appwrite";
import { publicEnv } from "@/lib/env";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    account.get().then((user) => {
      const isAdmin = user.email?.trim().toLowerCase() === publicEnv.adminEmail.trim().toLowerCase();
      router.replace(isAdmin ? "/admin" : "/");
    }).catch(() => {
      setError("OAuth login could not be completed. Please try again.");
    });
  }, [router]);

  if (error) {
    return <main className="min-h-screen flex items-center justify-center text-sm text-red-600">{error}</main>;
  }

  return <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">Completing login…</main>;
}
