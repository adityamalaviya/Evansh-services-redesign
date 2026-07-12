"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EnvelopeSimple, LockKey, Eye, EyeSlash, Hexagon, ShieldWarning } from "@phosphor-icons/react";
import { useAuth } from "@backend/contexts/AuthContext";
import { isAdmin } from "@backend/guards/adminGuard";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn, isLoading, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect
  useEffect(() => {
    if (!isLoading && isLoggedIn && isAdmin(user?.email)) {
      router.push("/admin");
    }
  }, [isLoading, isLoggedIn, user, router]);

  useEffect(() => {
    if (searchParams.get("error") === "access_denied") {
      setError("Access denied. This account does not have admin privileges.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      
      // Get admin email from env
      const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").trim().toLowerCase();
      
      if (email.trim().toLowerCase() !== adminEmail) {
        setError(`Access denied. ${email} is not an admin account.`);
        setIsSubmitting(false);
        return;
      }
      
      window.location.href = "/admin"; // Forced redirect to ensure layout re-renders
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="bg-[#14B8A6] p-3 rounded-2xl shadow-lg shadow-teal-900/50">
            <Hexagon size={28} weight="fill" className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-xl tracking-tight">Evansh Admin</p>
            <p className="text-slate-400 text-xs font-medium">Restricted Access Only</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-2">Admin Login</h1>
            <p className="text-slate-400 text-sm">Enter your admin credentials to continue.</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/50 text-red-300 rounded-xl p-4 mb-6 text-sm">
              <ShieldWarning size={20} weight="fill" className="flex-shrink-0 mt-0.5 text-red-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 pointer-events-none">
                  <EnvelopeSimple size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@evansh.com"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#14B8A6]/60 focus:ring-2 focus:ring-[#14B8A6]/20 transition-all"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 pointer-events-none">
                  <LockKey size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-12 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:border-[#14B8A6]/60 focus:ring-2 focus:ring-[#14B8A6]/20 transition-all"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-teal-900/40 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
              suppressHydrationWarning
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Access Admin Panel"
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-8">
            🔒 Secured admin area — unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
}
