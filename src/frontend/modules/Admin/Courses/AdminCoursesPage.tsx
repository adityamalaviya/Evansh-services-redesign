"use client";

import React, { startTransition, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { databases, DB_ID, COURSES_COLLECTION_ID } from "@backend/services/appwrite";
import { Query, Models } from "appwrite";
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Warning,
} from "@phosphor-icons/react";

type CourseDocument = Models.Document & {
  title: string;
  shortDescription: string;
  price: number;
  themeColor: string;
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await databases.listDocuments(DB_ID, COURSES_COLLECTION_ID, [
        Query.orderAsc("order"),
        Query.limit(100),
      ]);
      setCourses(res.documents as unknown as CourseDocument[]);
    } catch {
      setError("Could not load courses. Please check your Appwrite database setup.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => { void fetchCourses(); });
  }, [fetchCourses]);

  const handleDelete = async (course: CourseDocument) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;
    setDeletingId(course.$id);
    try {
      await databases.deleteDocument(DB_ID, COURSES_COLLECTION_ID, course.$id);
      setCourses((prev) => prev.filter((c) => c.$id !== course.$id));
    } catch {
      alert("Failed to delete course. Please try again.");
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
          <h1 className="text-2xl font-black text-[#1E1E24]">Manage Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} courses offered to students</p>
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
            <Plus size={18} weight="bold" /> Add Course
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          {error}
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
            <p className="text-slate-500 text-lg font-semibold mb-2">No courses found</p>
            <p className="text-slate-400 text-sm mb-6">Add your first course to get started.</p>
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center gap-2 bg-[#14B8A6] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0D9488] transition-all"
            >
              <Plus size={18} /> Add Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Course</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-4">Theme</th>
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
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{course.shortDescription || (course as CourseDocument & { description?: string }).description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-slate-200" 
                            style={{ backgroundColor: course.themeColor || "#14B8A6" }}
                          />
                          <span className="text-slate-600 text-xs font-mono uppercase">{course.themeColor || "#14B8A6"}</span>
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
