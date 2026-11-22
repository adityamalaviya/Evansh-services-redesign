"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@backend/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || !user) {
        router.replace("/login");
        return;
      }
      if (isAdmin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [user, isLoggedIn, isAdmin, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
      Loading dashboard...
    </div>
  );
}
