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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      router.push("/");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed. Please try again.");
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <EnvelopeSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <LockKey size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-[#14b8a6]/30"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
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
