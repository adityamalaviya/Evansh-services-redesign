"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@backend/contexts/AuthContext";
import {
  Images,
  Cube,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Plus,
  TrendUp,
} from "@phosphor-icons/react";

interface Stats {
  totalProjects: number;
  threeDProjects: number;
}

export default function AdminDashboard() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, threeDProjects: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until auth is resolved and user is confirmed logged-in
    // to avoid firing admin API calls as a guest (which causes 401 errors)
    if (isAuthLoading || !isLoggedIn) return;

    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        setStats({
          totalProjects: res.totalProjects || 0,
          threeDProjects: res.threeDProjects || 0,
        });
      } catch {
        // BFF may be down or unauthenticated — dashboard still renders with zeros
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [isAuthLoading, isLoggedIn]);

  const statCards = [
    {
      label: "Total Projects",
      value: isLoading ? "..." : stats.totalProjects,
      icon: <Images size={26} weight="duotone" />,
      color: "text-[#14B8A6]",
      bg: "bg-teal-50",
      border: "border-teal-100",
      href: "/admin/projects",
    },
    {
      label: "3D Printing Projects",
      value: isLoading ? "..." : stats.threeDProjects,
      icon: <Cube size={26} weight="duotone" />,
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-100",
      href: "/admin/projects/3d-printing",
    },
    {
      label: "Courses",
      value: "6",
      icon: <GraduationCap size={26} weight="duotone" />,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      href: "/admin/courses",
    },
    {
      label: "Services",
      value: "12",
      icon: <Briefcase size={26} weight="duotone" />,
      color: "text-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-100",
      href: "/admin/services",
    },
  ];

  const quickActions = [
    { label: "Add New Project", href: "/admin/projects/new", icon: <Plus size={16} /> },
    { label: "View All Projects", href: "/admin/projects", icon: <ArrowRight size={16} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24] tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's an overview of your site.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal-200/60"
        >
          <Plus size={18} weight="bold" /> Add Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`bg-white border ${card.border} rounded-2xl p-6 hover:shadow-md transition-all group`}
          >
            <div className={`inline-flex p-3 rounded-xl ${card.bg} ${card.color} mb-4`}>
              {card.icon}
            </div>
            <p className="text-3xl font-black text-[#1E1E24] mb-1">{card.value}</p>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <div className={`flex items-center gap-1 mt-3 ${card.color} text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>
              Manage <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendUp size={20} className="text-[#14B8A6]" weight="duotone" />
          <h2 className="text-[#1E1E24] font-bold">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-[#14B8A6] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-200 hover:border-teal-200"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
}
