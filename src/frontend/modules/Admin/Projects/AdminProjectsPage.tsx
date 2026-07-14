"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@backend/contexts/AuthContext";
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Warning,
} from "@phosphor-icons/react";

type Project = {
  $id: string;
  title: string;
  description: string;
  category: string;
  imageId?: string;
  imageUrl?: string;
  order?: number;
};

const CATEGORIES = ["All", "Web Portals", "Websites", "Inventory Systems", "College Portals", "3D Printing"];

export default function AdminProjectsPage() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.adminGetProjects();
      const filtered_cat = filterCategory !== "All"
        ? res.projects.filter((p: any) => p.category === filterCategory)
        : res.projects;
      setProjects(filtered_cat);
    } catch {
      setError("Could not load projects. Please check your BFF connection.");
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    // Only fetch after auth is confirmed to avoid 401 guest errors
    if (isAuthLoading || !isLoggedIn) return;
    fetchProjects();
  }, [fetchProjects, isAuthLoading, isLoggedIn]);

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;
    setDeletingId(project.$id);
    try {
      // BFF handles both document and storage file deletion server-side
      await api.adminDeleteProject(project.$id);
      setProjects((prev) => prev.filter((p) => p.$id !== project.$id));
    } catch {
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (project: Project): string | null => {
    return project.imageUrl || null;
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24]">All Projects</h1>
          <p className="text-slate-500 text-sm mt-1">{projects.length} projects in portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white rounded-xl border border-slate-200 transition-all hover:border-teal-200"
          >
            <ArrowClockwise size={18} />
          </button>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-md shadow-teal-200/60"
          >
            <Plus size={18} weight="bold" /> Add Project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-[#1E1E24] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6] transition-all"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg font-semibold mb-2">No projects found</p>
            <p className="text-slate-400 text-sm mb-6">Add your first project to get started.</p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 bg-[#14B8A6] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0D9488] transition-all"
            >
              <Plus size={18} /> Add Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Project</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-4 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Order</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project) => {
                  const imgUrl = getImageUrl(project);
                  return (
                    <tr key={project.$id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
                            )}
                          </div>
                          <div>
                            <p className="text-[#1E1E24] font-semibold text-sm leading-tight line-clamp-1">{project.title}</p>
                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="bg-teal-50 text-[#14B8A6] text-xs font-bold px-3 py-1 rounded-full border border-teal-100">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-slate-500 text-sm">{project.order ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.$id}`}
                            className="p-2 text-slate-400 hover:text-[#14B8A6] bg-slate-50 hover:bg-teal-50 rounded-lg transition-all border border-slate-200 hover:border-teal-200"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project)}
                            disabled={deletingId === project.$id}
                            className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all border border-slate-200 hover:border-red-200 disabled:opacity-50"
                          >
                            {deletingId === project.$id ? (
                              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                            ) : (
                              <Trash size={16} weight="bold" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
