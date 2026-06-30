"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  EnvelopeSimple, 
  LockKey, 
  Eye, 
  EyeSlash, 
  ArrowRight, 
  GoogleLogo, 
  GithubLogo, 
  FacebookLogo,
  UserCircle
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { tokens } from "@/styles/tokens";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    login();
    setIsSubmitting(false);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-[#f8fafb] flex items-center justify-center p-0 md:p-4 lg:p-8 font-sans md:overflow-hidden">
      {/* Global Logo Branding */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 lg:top-10 lg:left-10 flex items-center gap-2 md:gap-3 z-30">
        <div className="w-7 h-7 md:w-8 md:h-8 relative">
          <Image
            src="/assets/logo-new.png"
            alt="Evanish Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-base md:text-lg font-bold text-slate-800 tracking-tight">Evansh Services</span>
      </div>

      {/* Main Container - Elevated Glass Card */}
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
                Learn. Grow.<br />
                <span className="text-[#14b8a6]">Succeed</span>
              </h1>
              <p className="text-slate-500 text-base md:text-xl max-w-sm font-medium leading-relaxed">
                Join thousands of learners building their future with us.
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

          {/* Right Section: Login Form */}
          <div className="flex-1 bg-[#f8fafb] p-6 py-12 md:p-12 lg:p-20 flex items-center justify-center border-t md:border-t-0 md:border-l border-teal-50/50">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group">

              {/* Dot Pattern Decoration */}
              <div className="absolute top-8 right-8 grid grid-cols-4 gap-2 opacity-[0.07]">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                ))}
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Login</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Email Field */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">Email</label>
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

                {/* Password Field */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[2px] ml-1">Password</label>
                  <div className="relative group/field">
                    <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within/field:text-[#14b8a6] transition-colors duration-300">
                      <LockKey size={22} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-14 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#14b8a6]/20 focus:ring-4 focus:ring-[#14b8a6]/5 transition-all duration-300 text-sm font-semibold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-5 flex items-center text-slate-300 hover:text-slate-500 transition-colors duration-300"
                    >
                      {showPassword ? <EyeSlash size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link href="/forgot-password" size={22} className="text-xs font-bold text-[#14b8a6] hover:text-[#0d9488] transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-2xl font-bold text-[15px] shadow-[0_12px_24px_rgba(20,184,166,0.25)] hover:shadow-[0_16px_32px_rgba(20,184,166,0.3)] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3 group/btn mt-4"
                  style={{ padding: "18px" }}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} weight="bold" className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-5 py-3">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[3px] whitespace-nowrap">Or Continue With</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Social Logins */}
                <div className="flex items-center justify-center gap-6">
                  {[
                    { 
                      label: "Google", 
                      bg: "hover:bg-red-50/30",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-5.5 h-5.5">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c3.11 0 5.71-1.01 7.61-2.74l-3.57-2.77c-1.03.69-2.35 1.11-4.04 1.11-3.11 0-5.74-2.1-6.68-4.92H1.67v2.85C3.65 20.35 7.56 23 12 23z" fill="#34A853"/>
                          <path d="M5.32 13.68c-.24-.72-.38-1.48-.38-2.28s.14-1.56.38-2.28V6.27H1.67c-.8 1.6-1.25 3.39-1.25 5.27s.45 3.67 1.25 5.27l3.65-2.86z" fill="#FBBC05"/>
                          <path d="M12 4.75c1.69 0 3.21.58 4.41 1.73l3.31-3.32C17.71 1.21 15.11 0 12 0 7.56 0 3.65 2.65 1.67 6.27L5.32 9.12c.94-2.82 3.57-4.37 6.68-4.37z" fill="#EA4335"/>
                        </svg>
                      )
                    },
                    { 
                      label: "GitHub", 
                      bg: "hover:bg-slate-50",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-slate-900">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                      )
                    },
                    { 
                      label: "Facebook", 
                      bg: "hover:bg-blue-50/30",
                      icon: (
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <circle cx="12" cy="12" r="12" fill="#1877F2"/>
                          <path d="M15 12h-2v7h-3v-7H8V9h2V7.4C10 5.5 11.1 4.5 12.7 4.5c.8 0 1.5.1 1.5.1v1.6h-.8C12.4 6.2 12 7 12 7.8V9h3l-.5 3z" fill="white"/>
                        </svg>
                      )
                    }
                  ].map((social, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`w-24 h-14 flex items-center justify-center bg-white rounded-full border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:translate-y-0 active:shadow-inner transition-all duration-300 group/social ${social.bg}`}
                    >
                      <div className="relative transform transition-transform duration-300 group-hover/social:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                        {social.icon}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Register Link */}
                <p className="text-center text-sm font-semibold text-slate-400 mt-10">
                  Don't have an account yet?{" "}
                  <Link href="/register" className="text-[#14b8a6] font-extrabold hover:text-[#0d9488] transition-colors">
                    Register for free
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
