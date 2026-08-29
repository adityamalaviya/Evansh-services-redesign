"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite/client";
import { publicEnv } from "@/lib/env";

function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Completing login…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function completeLogin() {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      // Token flow: userId + secret in URL → exchange for session
      if (userId && secret) {
        try {
          setStatus("Exchanging token…");
          await account.createSession(userId, secret);
          setStatus("Getting user info…");
          const user = await account.get();
          const isAdmin =
            user.email?.trim().toLowerCase() ===
            publicEnv.adminEmail.trim().toLowerCase();
          const targetUrl = isAdmin ? "/admin" : "/";
          window.location.href = targetUrl;
          return;
        } catch (err: any) {
          console.error("Token exchange failed:", err);
          setError(`Login failed: ${err?.message || "token exchange error"} (code: ${err?.code ?? "?"})`);
          return;
        }
      }

      // Cookie flow fallback: no URL params, try account.get() directly
      // (handles createOAuth2Session cookie-based flow)
      try {
        setStatus("Verifying session…");
        // Retry up to 5 times — cookie may take a moment to propagate
        for (let i = 0; i < 5; i++) {
          try {
            const user = await account.get();
            const isAdmin =
              user.email?.trim().toLowerCase() ===
              publicEnv.adminEmail.trim().toLowerCase();
            const targetUrl = isAdmin ? "/admin" : "/";
            window.location.href = targetUrl;
            return;
          } catch {
            if (i < 4) await new Promise((r) => setTimeout(r, 600));
          }
        }
        setError("Login failed: no session found after OAuth redirect. Check Appwrite Console → Auth → Settings → OAuth2 providers and ensure the Web Platform (localhost:3000) is added under Settings → Platforms.");
      } catch (err: any) {
        setError(`Login failed: ${err?.message || "unknown error"}`);
      }
    }

    completeLogin();
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-sm text-red-600 max-w-lg text-center">{error}</p>
        <a href="/login" className="text-sm text-blue-600 underline">
          Back to login
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">
      {status}
    </main>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">
          Completing login…
        </main>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
