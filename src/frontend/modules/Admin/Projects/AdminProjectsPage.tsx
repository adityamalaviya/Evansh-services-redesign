"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { databases, storage, DB_ID, PROJECTS_COLLECTION_ID, BUCKET_ID } from "@backend/services/appwrite";
import { Query, Models } from "appwrite";
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Warning,
} from "@phosphor-icons/react";

type Project = Models.Document & {
  title: string;
  description: string;
  category: string;
  imageId: string;
  order: number;
};

const CATEGORIES = ["All", "Web Portals", "Websites", "Inventory Systems", "College Portals", "Printing", "3D Printing", "Other Projects"];

export default function AdminProjectsPage() {
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
      const queries = [Query.orderAsc("order"), Query.limit(100)];
      if (filterCategory !== "All") {
        queries.push(Query.equal("category", filterCategory));
      }
      const res = await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID, queries);
      setProjects(res.documents as unknown as Project[]);
    } catch {
      setError("Could not load projects. Please check your Appwrite database setup.");
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) return;
    setDeletingId(project.$id);
    try {
      // Delete image from storage if exists
      if (project.imageId) {
        await storage.deleteFile(BUCKET_ID, project.imageId).catch(() => {});
      }
      await databases.deleteDocument(DB_ID, PROJECTS_COLLECTION_ID, project.$id);
      setProjects((prev) => prev.filter((p) => p.$id !== project.$id));
    } catch {
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const getImageUrl = (imageId: string) => {
    if (!imageId) return null;
    try {
      return storage.getFilePreview(BUCKET_ID, imageId, 200, 150);
    } catch {
      return null;
    }
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
          <h1 className="text-2xl font-black text-white">All Projects</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projects in portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-all hover:bg-slate-700"
          >
            <ArrowClockwise size={18} />
          </button>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-teal-900/30"
          >
            <Plus size={18} weight="bold" /> Add Project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6]/50 transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6]/50 transition-all"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/40 text-red-300 rounded-xl p-4 text-sm">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg font-semibold mb-2">No projects found</p>
            <p className="text-slate-600 text-sm mb-6">Add your first project to get started.</p>
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
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-6 py-4">Project</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-4 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-4 hidden md:table-cell">Order</th>
                  <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-widest px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((project) => {
                  const imgUrl = getImageUrl(project.imageId);
                  return (
                    <tr key={project.$id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-10 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                            {imgUrl ? (
                              <Image
                                src={imgUrl.toString()}
                                alt={project.title}
                                width={48}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No img</div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm leading-tight line-clamp-1">{project.title}</p>
                            <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="bg-[#14B8A6]/10 text-[#14B8A6] text-xs font-bold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-slate-400 text-sm">{project.order ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.$id}`}
                            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project)}
                            disabled={deletingId === project.$id}
                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-red-950/30 rounded-lg transition-all border border-slate-700 hover:border-red-800/50 disabled:opacity-50"
                          >
                            {deletingId === project.$id ? (
                              <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
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
