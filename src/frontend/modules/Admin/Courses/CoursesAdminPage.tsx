"use client";

import React, { useState } from "react";
import { Check, GraduationCap, Plus, Trash, Image as ImageIcon, BookOpen, Star, ListChecks, Warning, ArrowLeft } from "@phosphor-icons/react";
import { api, formatApiError } from "@/lib/api";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  subtitle: z.string().trim().min(1, "Subtitle is required.").max(500),
  price: z.string().trim().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Valid price is required."),
  shortDescription: z.string().trim().min(1, "Short description is required.").max(1000),
  aboutDescription: z.string().trim().min(1, "About description is required.").max(5000),
});
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sanitizeImageUrl } from "@/lib/utils";
import Image from "next/image";

interface Feature {
  title: string;
  subtitle: string;
}

interface CourseForm {
  title: string;
  subtitle: string;
  shortDescription: string;
  aboutDescription: string;
  price: string;
  cardImage: string;
  heroImage: string;
  cardImageFile?: File | null;
  heroImageFile?: File | null;
  themeColor: string;
  features: Feature[];
  learnPoints: string[];
}

const defaultFeatures: Feature[] = [
  { title: "Beginner Friendly", subtitle: "Start from the basics." },
  { title: "Practical Learning", subtitle: "Hands-on examples." },
  { title: "In-Demand Skills", subtitle: "Boost your career." },
];

const emptyForm: CourseForm = {
  title: "",
  subtitle: "",
  shortDescription: "",
  aboutDescription: "",
  price: "",
  cardImage: "",
  heroImage: "",
  themeColor: "#14B8A6",
  features: defaultFeatures,
  learnPoints: [""],
};

const inputClass =
  "w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all";
const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 block mb-1.5";

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-6 shadow-sm">
      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
        <span className="text-[#14B8A6]">{icon}</span>
        <h2 className="text-base font-black text-[#1E1E24]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function CoursesAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof CourseForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setFeature = (index: number, field: keyof Feature, value: string) => {
    setForm((prev) => {
      const features = [...prev.features];
      features[index] = { ...features[index], [field]: value };
      return { ...prev, features };
    });
  };

  const setLearnPoint = (index: number, value: string) => {
    setForm((prev) => {
      const pts = [...prev.learnPoints];
      pts[index] = value;
      return { ...prev, learnPoints: pts };
    });
  };

  const addLearnPoint = () =>
    setForm((prev) => ({ ...prev, learnPoints: [...prev.learnPoints, ""] }));

  const removeLearnPoint = (index: number) =>
    setForm((prev) => ({
      ...prev,
      learnPoints: prev.learnPoints.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = courseSchema.safeParse({
      title: form.title,
      subtitle: form.subtitle,
      price: form.price,
      shortDescription: form.shortDescription,
      aboutDescription: form.aboutDescription,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const cardUpload = form.cardImageFile ? await api.adminUploadImage("courses", form.cardImageFile) : null;
      const heroUpload = form.heroImageFile ? await api.adminUploadImage("courses", form.heroImageFile) : null;
      await api.adminCreateCourse({
        title: form.title,
        subtitle: form.subtitle,
        shortDescription: form.shortDescription,
        aboutCourse: form.aboutDescription,
        price: parseInt(form.price) || 0,
        slug: form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        cardImageUrl: cardUpload?.image_url || form.cardImage,
        heroImageUrl: heroUpload?.image_url || form.heroImage,
        cardImageFileId: cardUpload?.file_id || "",
        heroImageFileId: heroUpload?.file_id || "",
        themeColor: form.themeColor,
        feature1Title: form.features[0]?.title || "",
        feature1Subtitle: form.features[0]?.subtitle || "",
        feature2Title: form.features[1]?.title || "",
        feature2Subtitle: form.features[1]?.subtitle || "",
        feature3Title: form.features[2]?.title || "",
        feature3Subtitle: form.features[2]?.subtitle || "",
        whatYouWillLearn: form.learnPoints.filter((p) => p.trim() !== "").join("\n"),
        isPublished: true,
      });

      setSuccess(true);
      setForm(emptyForm);
      setTimeout(() => router.push("/admin/courses"), 1200);
    } catch (err: any) {
      setError(formatApiError(err, "Failed to save internship. Please check your BFF connection."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white border border-slate-200 rounded-xl transition-all hover:border-teal-200"
        >
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24] flex items-center gap-3">
            <GraduationCap size={28} className="text-[#14B8A6]" /> Add New Internship
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in all the details to create a new internship on your website
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-2xl p-4 text-sm font-semibold">
          <Check size={20} weight="bold" className="flex-shrink-0" />
          Course added successfully! It will appear on the website immediately.
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

        {/* ── Basic Info ── */}
        <SectionCard title="Basic Information" icon={<BookOpen size={20} />}>
          <div className="space-y-2">
            <label className={labelClass}>Internship Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Animation Using Flash"
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Subtitle / Tagline *</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="e.g. Learn Animation Using Flash Programming from Basics to Advanced"
              required
              className={inputClass}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="3500"
                  required
                  min="0"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Short Description (shown on internship card) *</label>
            <textarea
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="A short 1-2 line description shown on the internship card..."
              rows={2}
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>About This Internship (full description) *</label>
            <textarea
              value={form.aboutDescription}
              onChange={(e) => set("aboutDescription", e.target.value)}
              placeholder="This internship is designed for anyone who wants to learn... (shown on internship detail page)"
              rows={4}
              required
              className={`${inputClass} resize-none`}
            />
          </div>
        </SectionCard>

        {/* ── Images ── */}
        <SectionCard title="Images" icon={<ImageIcon size={20} />}>
          <div className="space-y-2">
            <label className={labelClass}>Card Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
                  const MAX_SIZE = 2 * 1024 * 1024;
                  if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
                    setError("Card image must be JPG, PNG, or WEBP and 2MB or smaller.");
                    return;
                  }
                  setForm((prev) => ({ ...prev, cardImageFile: file, cardImage: URL.createObjectURL(file) }));
                }
              }}
              placeholder="https://... (image shown at top of the course card)"
              className={inputClass}
            />
            {form.cardImage && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-50">
                <Image src={sanitizeImageUrl(form.cardImage)} alt="Card preview" fill className="object-cover" unoptimized />
              </div>
            )}
            <p className="text-xs text-slate-400 pl-1">This image appears at the top of the internship card on the homepage.</p>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Hero Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
                  const MAX_SIZE = 2 * 1024 * 1024;
                  if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
                    setError("Hero image must be JPG, PNG, or WEBP and 2MB or smaller.");
                    return;
                  }
                  setForm((prev) => ({ ...prev, heroImageFile: file, heroImage: URL.createObjectURL(file) }));
                }
              }}
              placeholder="https://... (large image on the course detail page)"
              className={inputClass}
            />
            {form.heroImage && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-50">
                <Image src={sanitizeImageUrl(form.heroImage)} alt="Hero preview" fill className="object-cover" unoptimized />
              </div>
            )}
            <p className="text-xs text-slate-400 pl-1">This large illustration/image appears on the right side of the internship detail page.</p>
          </div>
        </SectionCard>

        {/* ── Features ── */}
        <SectionCard title="Internship Features (3 Highlights)" icon={<Star size={20} />}>
          <p className="text-xs text-slate-400 -mt-2">These 3 features are shown as highlights below the hero section (e.g. Beginner Friendly, Practical Learning, In-Demand Skills).</p>
          <div className="space-y-4">
            {form.features.map((feat, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <label className={labelClass}>Feature {i + 1} Title</label>
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => setFeature(i, "title", e.target.value)}
                    placeholder="e.g. Beginner Friendly"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Feature {i + 1} Subtitle</label>
                  <input
                    type="text"
                    value={feat.subtitle}
                    onChange={(e) => setFeature(i, "subtitle", e.target.value)}
                    placeholder="e.g. Start from the basics."
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── What You'll Learn ── */}
        <SectionCard title="What You'll Learn (Checklist)" icon={<ListChecks size={20} />}>
          <p className="text-xs text-slate-400 -mt-2">These bullet points appear as a checklist on the internship detail page.</p>
          <div className="space-y-3">
            {form.learnPoints.map((point, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: form.themeColor }}>
                  {i + 1}
                </div>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => setLearnPoint(i, e.target.value)}
                  placeholder="e.g. Understand syntax and fundamentals"
                  className={inputClass}
                />
                {form.learnPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLearnPoint(i)}
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLearnPoint}
            className="flex items-center gap-2 text-sm font-bold text-[#14B8A6] hover:text-[#0D9488] transition-colors pl-1"
          >
            <Plus size={16} weight="bold" /> Add Another Point
          </button>
        </SectionCard>

        {/* ── Submit ── */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black py-4 px-10 rounded-2xl shadow-md shadow-teal-200/60 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 text-base"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Check size={22} weight="bold" />
                <span>Add Internship</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
