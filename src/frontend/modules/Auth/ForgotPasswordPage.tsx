"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, ArrowRight, ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { account } from "@backend/services/appwrite";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Appwrite sends a reset link; redirect URL must be whitelisted in Appwrite console
      const resetUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email.trim(), resetUrl);
      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
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
          <Image
            src="/assets/logo-new.png"
            alt="Evansh Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-base md:text-lg font-bold text-slate-800 tracking-tight">Evansh Services</span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1200px] md:h-auto md:max-h-[85vh] bg-white md:rounded-[48px] shadow-[0_32px_80px_rgba(20,184,166,0.08)] flex flex-col md:flex-row overflow-hidden border border-teal-50/50 relative">

        <div className="flex flex-col md:flex-row w-full">
          {/* Left Section: Branding & Illustration */}
          <div className="flex-1 p-8 pt-24 md:p-12 lg:p-24 flex flex-col justify-center bg-white relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] bg-teal-50/40 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] md:w-[30%] md:h-[30%] bg-teal-100/30 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />

            {/* Hero Text */}
            <div className="relative z-10 mb-8 md:mb-12">
              <h1 className="text-3xl md:text-3xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-4 md:mb-6">
                Reset Your<br />
                <span className="text-[#14b8a6]">Password</span>
              </h1>
              <p className="text-slate-500 text-base md:text-xl max-w-sm font-medium leading-relaxed">
                No worries — it happens to everyone. We&apos;ll send you a reset link right away.
              </p>
            </div>

            {/* Illustration */}
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

          {/* Right Section: Form */}
          <div className="flex-1 bg-[#f8fafb] p-6 py-12 md:p-12 lg:p-20 flex items-center justify-center border-t md:border-t-0 md:border-l border-teal-50/50">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">

              {/* Dot Pattern Decoration */}
              <div className="absolute top-8 right-8 grid grid-cols-4 gap-2 opacity-[0.07]">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                ))}
              </div>

              {isSuccess ? (
                /* ── Success State ── */
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                    <CheckCircle size={36} weight="fill" className="text-[#14b8a6]" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3">Check Your Email</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                    We&apos;ve sent a password reset link to{" "}
                    <span className="font-bold text-slate-700">{email}</span>.
                    Please check your inbox (and spam folder).
                  </p>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm font-bold text-[#14b8a6] hover:text-[#0d9488] transition-colors"
                  >
                    <ArrowLeft size={16} weight="bold" />
                    Back to Login
                  </Link>
                </div>
              ) : (
                /* ── Form State ── */
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Forgot Password</h2>
                    <p className="text-slate-400 text-sm font-medium mt-2">
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Email Field */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">
                        Email
                      </label>
                      <div className="relative group/field">
                        <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within/field:text-[#14b8a6] transition-colors duration-300">
                          <EnvelopeSimple size={22} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="username@gmail.com"
                          className="w-full pl-14 pr-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#14b8a6]/20 focus:ring-4 focus:ring-[#14b8a6]/5 transition-all duration-300 text-sm font-semibold"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-2xl font-bold text-[15px] shadow-[0_12px_24px_rgba(20,184,166,0.25)] hover:shadow-[0_16px_32px_rgba(20,184,166,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3 group/btn mt-4"
                      style={{ padding: "18px" }}
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <ArrowRight size={20} weight="bold" className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                        </>
                      )}
                    </button>

                    {/* Back to Login */}
                    <p className="text-center text-sm font-semibold text-slate-400 mt-4">
                      Remembered your password?{" "}
                      <Link href="/login" className="text-[#14b8a6] font-extrabold hover:text-[#0d9488] transition-colors">
                        Back to Login
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
