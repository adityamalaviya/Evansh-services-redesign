"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@backend/contexts/AuthContext";
import { publicEnv } from "@/lib/env";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !user) {
        router.replace("/login");
        return;
      }
      const adminEmail = publicEnv.adminEmail.trim().toLowerCase();
      const isAdmin = user.email?.trim().toLowerCase() === adminEmail;
      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [user, isLoggedIn, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
      Loading dashboard...
    </div>
  );
}
