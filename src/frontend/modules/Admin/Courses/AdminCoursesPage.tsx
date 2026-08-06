"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@backend/contexts/AuthContext";
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Warning,
} from "@phosphor-icons/react";

type CourseDocument = {
  $id: string;
  title: string;
  shortDescription?: string;
  price: number;
  themeColor: string;
};

export default function AdminCoursesPage() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [courses, setCourses] = useState<CourseDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.adminGetCourses();
      setCourses(res.courses);
    } catch (err: any) {
      setError(formatApiError(err, "Could not load internships. Please check your BFF connection."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch after auth is confirmed to avoid 401 guest errors
    if (isAuthLoading || !isLoggedIn) return;
    fetchCourses();
  }, [fetchCourses, isAuthLoading, isLoggedIn]);

  const handleDelete = async (course: CourseDocument) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;
    setDeletingId(course.$id);
    try {
      await api.adminDeleteCourse(course.$id);
      setCourses((prev) => prev.filter((c) => c.$id !== course.$id));
    } catch {
      alert("Failed to delete internship. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.shortDescription?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24]">Manage Internships</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} internships offered to students</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCourses}
            className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white rounded-xl border border-slate-200 transition-all hover:border-teal-200"
          >
            <ArrowClockwise size={18} />
          </button>
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-md shadow-teal-200/60"
          >
            <Plus size={18} weight="bold" /> Add Internship
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search internships by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-3">
            <Warning size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
          {error.includes("Session expired") && (
            <Link
              href="/admin/login"
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 self-start sm:self-auto"
            >
              Log In
            </Link>
          )}
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg font-semibold mb-2">No internships found</p>
            <p className="text-slate-400 text-sm mb-6">Add your first internship to get started.</p>
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center gap-2 bg-[#14B8A6] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0D9488] transition-all"
            >
              <Plus size={18} /> Add Internship
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Internship</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-4">Price</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((course) => {
                  return (
                    <tr key={course.$id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#1E1E24] font-semibold text-sm leading-tight line-clamp-1">{course.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{course.shortDescription || (course as any).description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-slate-700 text-sm font-bold">₹{course.price || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/courses/${course.$id}`}
                            className="p-2 text-slate-400 hover:text-[#14B8A6] bg-slate-50 hover:bg-teal-50 rounded-lg transition-all border border-slate-200 hover:border-teal-200"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </Link>
                          <button
                            onClick={() => handleDelete(course)}
                            disabled={deletingId === course.$id}
                            className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all border border-slate-200 hover:border-red-200 disabled:opacity-50"
                          >
                            {deletingId === course.$id ? (
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
