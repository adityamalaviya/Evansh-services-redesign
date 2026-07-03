"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Hexagon,
  SquaresFour,
  Images,
  SignOut,
  List,
  X,
  GraduationCap,
  Briefcase,
  Cube,
} from "@phosphor-icons/react";
import { useAuth } from "@backend/contexts/AuthContext";
import { isAdmin } from "@backend/guards/adminGuard";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <SquaresFour size={20} weight="duotone" /> },
  { label: "All Projects", href: "/admin/projects", icon: <Images size={20} weight="duotone" /> },
  { label: "3D Printing", href: "/admin/projects/3d-printing", icon: <Cube size={20} weight="duotone" /> },
  { label: "Courses", href: "/admin/courses", icon: <GraduationCap size={20} weight="duotone" /> },
  { label: "Services", href: "/admin/services", icon: <Briefcase size={20} weight="duotone" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.push("/admin/login");
        return;
      }
      if (!isAdmin(user?.email)) {
        router.push("/admin/login?error=access_denied");
      }
    }
  }, [isLoading, isLoggedIn, user, router]);

  if (isLoading || !isLoggedIn || !isAdmin(user?.email)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-[#14B8A6] p-2 rounded-xl">
            <Hexagon size={22} weight="fill" className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tight">Evansh Admin</p>
            <p className="text-slate-400 text-xs">{user?.email}</p>
          </div>
          <button
            className="ml-auto text-slate-500 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#14B8A6] text-white shadow-lg shadow-teal-900/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
          >
            <SignOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white p-1"
          >
            <List size={24} />
          </button>
          <span className="text-white font-bold text-sm">Evansh Admin</span>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
