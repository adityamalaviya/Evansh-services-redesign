"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { databases, storage, DB_ID, PROJECTS_COLLECTION_ID, BUCKET_ID, ID } from "@backend/services/appwrite";
import {
  ArrowLeft,
  UploadSimple,
  X,
  Check,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["Web Portals", "Websites", "Inventory Systems", "College Portals", "3D Printing"];

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || CATEGORIES[0];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      let imageId = "";

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.adminCreateProject(formData);
      await databases.createDocument(DB_ID, PROJECTS_COLLECTION_ID, ID.unique(), {
        title,
        description,
        category,
        imageId,
        order: Date.now(),
      });

      if (category === "3D Printing") {
        router.push("/admin/projects/3d-printing");
      } else {
        router.push("/admin/projects");
      }
      router.refresh();
    } catch (err: any) {
      console.error("Creation error:", err);
      setError(err.message || "Something went wrong while saving the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link
          href={category === "3D Printing" ? "/admin/projects/3d-printing" : "/admin/projects"}
          className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white border border-slate-200 rounded-xl transition-all hover:border-teal-200"
        >
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24]">Add New Project</h1>
          <p className="text-slate-500 text-sm">Create a new project in your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
              <WarningCircle size={20} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: General Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kutch Uday Billing System"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
                />
              </div>

              {category !== "3D Printing" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all appearance-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                </>
              )}
            </div>

            {/* Right: Image Upload */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Project Thumbnail</label>
                <div className="relative group/upload h-full min-h-[220px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className={`h-full min-h-[220px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-300 ${
                    imagePreview
                      ? "border-teal-400 bg-teal-50/50"
                      : "border-slate-200 bg-slate-50 group-hover/upload:border-[#14B8A6]/50 group-hover/upload:bg-teal-50/30"
                  }`}>
                    {imagePreview ? (
                      <div className="relative w-full h-full min-h-[140px] rounded-lg overflow-hidden border border-teal-200">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors z-20 border border-slate-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white border border-slate-200 p-4 rounded-full mb-4 text-slate-400 group-hover/upload:text-[#14B8A6] group-hover/upload:border-teal-200 transition-colors shadow-sm">
                          <UploadSimple size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-600">Click to upload image</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">PNG, JPG up to 2MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about the project details..."
              rows={4}
              required
              className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black py-4 rounded-2xl shadow-md shadow-teal-200/60 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <>
                  <Check size={20} weight="bold" />
                  <span>Publish Project</span>
                </>
              )}
            </button>
            <Link
              href={category === "3D Printing" ? "/admin/projects/3d-printing" : "/admin/projects"}
              className="w-full sm:w-auto text-slate-400 hover:text-slate-600 font-bold px-8 py-4 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {/* Warning Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
        <WarningCircle size={24} className="text-amber-500 flex-shrink-0" weight="duotone" />
        <p className="text-slate-500 text-sm leading-relaxed">
          <span className="text-amber-600 font-bold">Important:</span> Make sure your Appwrite Storage bucket has "Public" permissions or "Read" access for everyone if you want the images to be visible on the public website.
        </p>
      </div>
    </div>
  );
}
