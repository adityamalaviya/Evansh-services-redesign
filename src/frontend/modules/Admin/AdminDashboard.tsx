"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { databases, DB_ID, PROJECTS_COLLECTION_ID } from "@backend/services/appwrite";
import { Query } from "appwrite";
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
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, threeDProjects: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const all = await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID, [Query.limit(1)]);
        const threeD = await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID, [
          Query.equal("category", "3D Printing"),
          Query.limit(1),
        ]);
        setStats({ totalProjects: all.total, threeDProjects: threeD.total });
      } catch {
        // DB may not be set up yet
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: isLoading ? "..." : stats.totalProjects,
      icon: <Images size={28} weight="duotone" />,
      color: "text-[#14B8A6]",
      bg: "bg-teal-950/50",
      href: "/admin/projects",
    },
    {
      label: "3D Printing Projects",
      value: isLoading ? "..." : stats.threeDProjects,
      icon: <Cube size={28} weight="duotone" />,
      color: "text-purple-400",
      bg: "bg-purple-950/50",
      href: "/admin/projects/3d-printing",
    },
    {
      label: "Courses",
      value: "6",
      icon: <GraduationCap size={28} weight="duotone" />,
      color: "text-blue-400",
      bg: "bg-blue-950/50",
      href: "/admin/courses",
    },
    {
      label: "Services",
      value: "12",
      icon: <Briefcase size={28} weight="duotone" />,
      color: "text-orange-400",
      bg: "bg-orange-950/50",
      href: "/admin/services",
    },
  ];

  const quickActions = [
    { label: "Add New Project", href: "/admin/projects/new", icon: <Plus size={18} /> },
    { label: "Add 3D Project", href: "/admin/projects/new?category=3D+Printing", icon: <Plus size={18} /> },
    { label: "View All Projects", href: "/admin/projects", icon: <ArrowRight size={18} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back! Here's an overview of your site.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-900/40"
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
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group"
          >
            <div className={`inline-flex p-3 rounded-xl ${card.bg} ${card.color} mb-4`}>
              {card.icon}
            </div>
            <p className="text-3xl font-black text-white mb-1">{card.value}</p>
            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            <div className={`flex items-center gap-1 mt-3 ${card.color} text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>
              Manage <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendUp size={20} className="text-[#14B8A6]" weight="duotone" />
          <h2 className="text-white font-bold">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:text-white border border-slate-700 hover:border-slate-500"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-teal-950/40 border border-teal-800/40 rounded-2xl p-6">
        <h3 className="text-[#14B8A6] font-bold mb-2">📋 Getting Started</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Make sure your <span className="text-white font-semibold">Appwrite Database</span> is set up with the collection ID matching{" "}
          <code className="bg-slate-800 text-teal-300 px-2 py-0.5 rounded text-xs">NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID</code>.
          Projects added here will appear live on your website.
        </p>
      </div>
    </div>
  );
}
