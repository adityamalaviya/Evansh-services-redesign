"use client";

import React, { useState } from "react";
import { Check, Briefcase, Warning, ArrowLeft } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { databases, DB_ID, SERVICES_COLLECTION_ID, ID } from "@backend/services/appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ServicesAdminPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeImageUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
      return "";
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.adminCreateService({
        title,
        slug: title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: subtitle,
        image,
        display_order: 0,
        active: true,
      await databases.createDocument(DB_ID, SERVICES_COLLECTION_ID, ID.unique(), {
        title,
        subtitle,
        description: subtitle, // fall back for backwards compatibility if description attribute is used
        image,
        order: Date.now(),
      });

      setSuccess(true);
      setTitle("");
      setSubtitle("");
      setImage("");
      setTimeout(() => router.push("/admin/services"), 1200);
    } catch (err: any) {
      setError(err?.message || "Failed to save service. Please check your BFF connection.");
      setError(err?.message || "Failed to save service. Please check your Appwrite setup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/services"
          className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white border border-slate-200 rounded-xl transition-all hover:border-teal-200"
        >
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24] flex items-center gap-3">
            <Briefcase size={28} className="text-[#14B8A6]" /> Add New Service
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create a new service to display on your website</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-2xl p-4 text-sm font-semibold">
          <Check size={20} weight="bold" className="flex-shrink-0" />
          Service added successfully! It will appear on the website immediately.
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block">Service Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design & Development of Website"
              required
              className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block">Service Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              onChange={(e) => setImage(sanitizeImageUrl(e.target.value))}
              placeholder="https://... (image shown at top of the service card)"
              className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
            {image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-50">
                <img src={image} alt="Service preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block">Subtitle / Description *</label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Describe the service offered..."
              rows={4}
              required
              className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black py-3.5 px-8 rounded-2xl shadow-md shadow-teal-200/60 hover:shadow-teal-300/60 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Check size={20} weight="bold" />
                  <span>Add Service</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
