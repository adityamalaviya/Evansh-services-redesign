"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, Briefcase, Warning, ArrowLeft } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { databases, DB_ID, SERVICES_COLLECTION_ID } from "@backend/services/appwrite";
import Link from "next/link";

const inputClass =
  "w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all";
const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-1.5";

interface ServiceForm {
  title: string;
  subtitle: string;
  image: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [form, setForm] = useState<ServiceForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchService = useCallback(async () => {
    try {
      const doc: any = await api.adminGetService(serviceId);
      const doc: any = await databases.getDocument(DB_ID, SERVICES_COLLECTION_ID, serviceId);
      setForm({
        title: doc.title || "",
        subtitle: doc.subtitle || doc.description || "",
        image: doc.image || "",
      });
    } catch {
      setError("Service not found or connection error.");
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const set = (key: keyof ServiceForm, value: string) => {
    if (!form) return;
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await api.adminUpdateService(serviceId, {
        title: form.title,
        slug: form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: form.subtitle,
      await databases.updateDocument(DB_ID, SERVICES_COLLECTION_ID, serviceId, {
        title: form.title,
        subtitle: form.subtitle,
        description: form.subtitle, // backward compatibility
        image: form.image,
      });
      router.push("/admin/services");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to update service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/services"
            className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white border border-slate-200 rounded-xl transition-all"
          >
            <ArrowLeft size={18} weight="bold" />
          </Link>
          <h1 className="text-2xl font-black text-[#1E1E24]">Edit Service</h1>
        </div>
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6">
          <Warning size={24} className="flex-shrink-0" />
          <div>
            <p className="font-bold">Error loading service</p>
            <p className="text-sm opacity-90 mt-1">{error || "Service not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/services"
          className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white border border-slate-200 rounded-xl transition-all hover:border-teal-200"
        >
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24] flex items-center gap-3">
            <Briefcase size={26} className="text-[#14B8A6]" /> Edit Service
          </h1>
          <p className="text-slate-500 text-sm">Update the service details</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">

          {/* Title */}
          <div className="space-y-2">
            <label className={labelClass}>Service Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Design & Development of Website"
              required
              className={inputClass}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className={labelClass}>Service Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://... (image shown at top of the service card)"
              className={inputClass}
            />
            {form.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-50">
                <img
                  src={form.image}
                  alt="Service preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Subtitle / Description */}
          <div className="space-y-2">
            <label className={labelClass}>Subtitle / Description *</label>
            <textarea
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Describe the service offered..."
              rows={4}
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black py-3.5 px-8 rounded-2xl shadow-md shadow-teal-200/60 hover:shadow-teal-300/60 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={20} weight="bold" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
