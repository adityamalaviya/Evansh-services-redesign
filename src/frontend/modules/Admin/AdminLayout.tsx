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
import { ConfirmModal } from "@frontend/components";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }
    if (!isLoading && !isLoggingOut) {
      if (!isLoggedIn) {
        router.push("/admin/login");
        return;
      }
      if (!isAdmin(user?.email)) {
        router.push("/admin/login?error=access_denied");
      }
    }
  }, [isLoading, isLoggedIn, user, router, isLoggingOut, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isLoggingOut && (isLoading || !isLoggedIn || !isAdmin(user?.email))) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-30 flex flex-col transition-transform duration-300 shadow-sm
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-[#14B8A6] p-2 rounded-xl flex-shrink-0">
            <Hexagon size={22} weight="fill" className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[#1E1E24] font-black text-sm tracking-tight">Evansh Admin</p>
            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
          </div>
          <button
            className="ml-auto text-slate-400 hover:text-slate-600 lg:hidden flex-shrink-0"
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
                    ? "bg-[#14B8A6] text-white shadow-md shadow-teal-200/60"
                    : "text-slate-500 hover:text-[#1E1E24] hover:bg-slate-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <SignOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-500 hover:text-[#1E1E24] p-1"
          >
            <List size={24} />
          </button>
          <span className="text-[#1E1E24] font-bold text-sm">Evansh Admin</span>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Admin Logout"
        message="Are you sure you want to log out from the Admin Panel?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
