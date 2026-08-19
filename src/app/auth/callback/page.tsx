"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client/apiFetch";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    if (!userId || !secret) {
      router.replace("/login?error=true");
      return;
    }
    apiFetch("/auth/callback", {
      method: "POST",
      body: JSON.stringify({ userId, secret }),
    })
      .then(() => router.replace("/dashboard"))
      .catch(() => router.replace("/login?error=true"));
  }, [router]);
  return <p>Signing you in...</p>;
}
