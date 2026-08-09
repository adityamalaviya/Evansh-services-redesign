"use client";

import React, { useState } from "react";
import { Check, Briefcase, Warning, ArrowLeft } from "@phosphor-icons/react";
import { api, formatApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sanitizeImageUrl } from "@/lib/utils";
import Image from "next/image";

export default function ServicesAdminPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const uploaded = imageFile ? await api.adminUploadImage("services", imageFile) : null;
      await api.adminCreateService({
        title,
        slug: title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: subtitle,
        image: uploaded?.image_url || image,
        imageFileId: uploaded?.file_id || "",
        display_order: 0,
        active: true,
      });

      setSuccess(true);
      setTitle("");
      setSubtitle("");
      setImage("");
      setImageFile(null);
      setTimeout(() => router.push("/admin/services"), 1200);
    } catch (err: any) {
      setError(formatApiError(err, "Failed to save service. Please check your BFF connection."));
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm">
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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block">Service Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size <= 2 * 1024 * 1024) { setImageFile(file); setImage(URL.createObjectURL(file)); }
                else if (file) setError("Image must be JPG or PNG and 2MB or smaller.");
              }}
              className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
            />
            {image && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-50">
                <Image src={sanitizeImageUrl(image)} alt="Service preview" fill className="object-cover" unoptimized />
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
