"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  EnvelopeSimple, 
  LockKey, 
  User,
  ArrowRight,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { account } from "@backend/services/appwrite";
import { ID } from "appwrite";
import { z } from "zod";
import DOMPurify from "dompurify";
import * as Sentry from "@sentry/nextjs";

const clean = (val: string): string => DOMPurify.sanitize(val.trim());

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

  const clearFieldError = (field: keyof RegisterFieldErrors): void => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!parsed.success) {
      const errs: RegisterFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof RegisterFieldErrors;
        if (!errs[field]) errs[field] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      const cleanName = clean(name);
      const cleanEmail = clean(email);
      await account.create(ID.unique(), cleanEmail, password, cleanName);
      await account.createEmailPasswordSession(cleanEmail, password);
      router.push("/");
    } catch (err: unknown) {
      Sentry.captureException(err);
      const raw = err instanceof Error ? err.message : "";
      if (raw.toLowerCase().includes("already exist") || raw.toLowerCase().includes("unique violation") || raw.toLowerCase().includes("duplicate")) {
        setError("An account with this email already exists.");
      } else if (raw.toLowerCase().includes("network") || raw.toLowerCase().includes("fetch")) {
        setError("Connection failed. Please check your internet.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafb] flex items-center justify-center p-4 font-sans">
      <div className="absolute top-6 left-6 flex items-center gap-2 z-30">
        <div className="w-7 h-7 relative">
          <Image src="/assets/logo-new.png" alt="Logo" fill className="object-contain" />
        </div>
        <span className="text-base font-bold text-slate-800">Evansh Services</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-xl border border-teal-50">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Register</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                suppressHydrationWarning
              />
            </div>
            {fieldErrors.name && (
              <p className="text-red-500 text-xs pl-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <EnvelopeSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                suppressHydrationWarning
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs pl-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <LockKey size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                suppressHydrationWarning
              />
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs pl-1">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <LockKey size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                suppressHydrationWarning
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs pl-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            suppressHydrationWarning
          >
            {isSubmitting ? "Creating Account..." : "Register Now"} <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-semibold text-slate-400">
          Already have an account? <Link href="/login" className="text-[#14b8a6] font-black">Login</Link>
        </p>
      </div>
    </div>
  );
}
