"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Hexagon, UserCircle, SignOut } from "@phosphor-icons/react";
import { tokens } from "@/styles/tokens";
import { useAuth } from "@/lib/contexts/AuthContext";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className={`${tokens.spacing.container} flex items-center justify-between h-20`}>
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#1E293B] p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <Hexagon size={24} weight="fill" className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1E293B]">
            Evansh Services
          </span>
        </Link>

        {/* Navigation Section */}
        <nav className="hidden md:flex items-center gap-12 bg-white px-14 py-4 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-xl">
          <Link href="/#home" className="px-4 py-2 text-sm font-bold text-slate-800 hover:text-[#14B8A6] transition-all hover:scale-110 active:scale-95 relative group">
            Home
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-1/2 group-hover:left-1/4"></span>
          </Link>
          <Link href="/#courses" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all hover:scale-110 active:scale-95 relative group">
            Courses
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-1/2 group-hover:left-1/4"></span>
          </Link>
          <Link href="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all hover:scale-110 active:scale-95 relative group">
            About Us
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-1/2 group-hover:left-1/4"></span>
          </Link>
          <Link href="/contact" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all hover:scale-110 active:scale-95 relative group">
            Contact
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-1/2 group-hover:left-1/4"></span>
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] border border-[#14B8A6]/20 transition-all hover:scale-110 cursor-pointer group/avatar relative">
                <UserCircle size={32} weight="fill" />
                {/* Logout Tooltip */}
                <button 
                  onClick={logout}
                  className="absolute top-full right-0 mt-4 bg-white shadow-xl rounded-xl p-3 text-slate-600 opacity-0 group-hover/avatar:opacity-100 transition-all pointer-events-none group-hover/avatar:pointer-events-auto border border-slate-100 flex items-center gap-2 text-xs font-bold whitespace-nowrap hover:text-red-500"
                >
                  <SignOut size={16} weight="bold" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-4 bg-[#1E293B] text-white px-10 py-3 rounded-2xl text-sm font-black hover:bg-slate-800 transition-all hover:scale-110 active:scale-90 hover:shadow-[0_10px_20px_rgba(30,41,59,0.3)] ring-offset-2 hover:ring-2 ring-slate-200"
            >
              Login <ArrowRight size={20} weight="bold" />
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle (Simplified for now) */}
        <div className="md:hidden">
          <Link 
            href="/login" 
            className="bg-[#1E293B] text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
