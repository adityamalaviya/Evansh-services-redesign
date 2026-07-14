"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { LockKey, Eye, EyeSlash, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useSearchParams, useRouter } from "next/navigation";
import { account } from "@backend/services/appwrite";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Appwrite sends userId & secret as query params
  const userId = searchParams.get("userId") ?? "";
  const secret = searchParams.get("secret") ?? "";

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  }, [userId, secret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await account.updateRecovery(userId, secret, password);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please request a new reset link.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-[#f8fafb] flex items-center justify-center p-0 md:p-4 lg:p-8 font-sans md:overflow-hidden">
      {/* Global Logo Branding */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 lg:top-10 lg:left-10 flex items-center gap-2 md:gap-3 z-30">
        <div className="w-7 h-7 md:w-8 md:h-8 relative">
          <Image src="/assets/logo-new.png" alt="Evansh Logo" fill className="object-contain" />
        </div>
        <span className="text-base md:text-lg font-bold text-slate-800 tracking-tight">Evansh Services</span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1200px] md:h-auto md:max-h-[85vh] bg-white md:rounded-[48px] shadow-[0_32px_80px_rgba(20,184,166,0.08)] flex flex-col md:flex-row overflow-hidden border border-teal-50/50 relative">
        <div className="flex flex-col md:flex-row w-full">

          {/* Left Section */}
          <div className="flex-1 p-8 pt-24 md:p-12 lg:p-24 flex flex-col justify-center bg-white relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-teal-50/40 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] md:w-[30%] md:h-[30%] bg-teal-100/30 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />

            <div className="relative z-10 mb-8 md:mb-12">
              <h1 className="text-3xl md:text-3xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-4 md:mb-6">
                Create New<br />
                <span className="text-[#14b8a6]">Password</span>
              </h1>
              <p className="text-slate-500 text-base md:text-xl max-w-sm font-medium leading-relaxed">
                Choose a strong password to secure your Evansh Services account.
              </p>
            </div>

            <div className="relative w-full aspect-[4/3] max-w-[300px] md:max-w-[500px] z-10 mx-auto md:mx-0">
              <Image
                src="/assets/Log_Image.jpeg"
                alt="Learning Illustration"
                fill
                className="object-contain transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 bg-[#f8fafb] p-6 py-12 md:p-12 lg:p-20 flex items-center justify-center border-t md:border-t-0 md:border-l border-teal-50/50">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">

              {/* Dot Pattern */}
              <div className="absolute top-8 right-8 grid grid-cols-4 gap-2 opacity-[0.07]">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                ))}
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                    <CheckCircle size={36} weight="fill" className="text-[#14b8a6]" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3">Password Updated!</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                    Your password has been reset successfully. Redirecting you to login…
                  </p>
                  <Link href="/login" className="text-sm font-bold text-[#14b8a6] hover:text-[#0d9488] transition-colors">
                    Go to Login →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Password</h2>
                    <p className="text-slate-400 text-sm font-medium mt-2">
                      Enter and confirm your new password below.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                      {error}
                      {(!userId || !secret) && (
                        <div className="mt-3">
                          <Link href="/forgot-password" className="font-bold underline">
                            Request a new reset link
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">New Password</label>
                      <div className="relative group/field">
                        <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within/field:text-[#14b8a6] transition-colors duration-300">
                          <LockKey size={22} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 characters"
                          className="w-full pl-14 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#14b8a6]/20 focus:ring-4 focus:ring-[#14b8a6]/5 transition-all duration-300 text-sm font-semibold"
                          required
                          minLength={8}
                          disabled={!userId || !secret}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showPassword ? <EyeSlash size={22} /> : <Eye size={22} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">Confirm Password</label>
                      <div className="relative group/field">
                        <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within/field:text-[#14b8a6] transition-colors duration-300">
                          <LockKey size={22} />
                        </div>
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full pl-14 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#14b8a6]/20 focus:ring-4 focus:ring-[#14b8a6]/5 transition-all duration-300 text-sm font-semibold"
                          required
                          disabled={!userId || !secret}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showConfirm ? <EyeSlash size={22} /> : <Eye size={22} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !userId || !secret}
                      className="w-full py-4 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-2xl font-bold text-[15px] shadow-[0_12px_24px_rgba(20,184,166,0.25)] hover:shadow-[0_16px_32px_rgba(20,184,166,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3 group/btn mt-2"
                      style={{ padding: "18px" }}
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Update Password</span>
                          <ArrowRight size={20} weight="bold" className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-sm font-semibold text-slate-400 mt-4">
                      <Link href="/login" className="text-[#14b8a6] font-extrabold hover:text-[#0d9488] transition-colors">
                        ← Back to Login
                      </Link>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
