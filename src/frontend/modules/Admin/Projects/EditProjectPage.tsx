"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { databases, storage, DB_ID, PROJECTS_COLLECTION_ID, BUCKET_ID, ID } from "@backend/services/appwrite";
import { 
  ArrowLeft, 
  UploadSimple, 
  Check, 
  WarningCircle, 
  Trash
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["Web Portals", "Websites", "Inventory Systems", "College Portals", "Printing", "3D Printing", "Other Projects"];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [order, setOrder] = useState<number>(0);
  const [currentImageId, setCurrentImageId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const doc: any = await databases.getDocument(DB_ID, PROJECTS_COLLECTION_ID, projectId);
      setTitle(doc.title);
      setDescription(doc.description);
      setCategory(doc.category);
      setOrder(doc.order || 0);
      setCurrentImageId(doc.imageId || "");
      
      if (doc.imageId) {
        const preview: any = storage.getFilePreview(BUCKET_ID, doc.imageId);
        setImagePreview(preview.toString());
      }
    } catch (err: any) {
      setError("Project not found or connection error.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

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
      let finalImageId = currentImageId;
      
      // 1. If new image uploaded
      if (imageFile) {
        // Delete old image if exists
        if (currentImageId) {
          try { await storage.deleteFile(BUCKET_ID, currentImageId); } catch(e) {}
        }
        const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
        finalImageId = uploadedFile.$id;
      }

      // 2. Update document
      await databases.updateDocument(DB_ID, PROJECTS_COLLECTION_ID, projectId, {
        title,
        description,
        category,
        imageId: finalImageId,
        order: Number(order)
      });

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project permanently?")) return;
    setIsDeleting(true);
    try {
      if (currentImageId) {
        await storage.deleteFile(BUCKET_ID, currentImageId).catch(() => {});
      }
      await databases.deleteDocument(DB_ID, PROJECTS_COLLECTION_ID, projectId);
      router.push("/admin/projects");
    } catch (err) {
      setError("Failed to delete project.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl">
            <ArrowLeft size={18} weight="bold" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Edit Project</h1>
            <p className="text-slate-400 text-sm">Modify existing project details</p>
          </div>
        </div>
        <button onClick={handleDelete} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
          <Trash size={24} weight="duotone" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
          {error && (
            <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/40 text-red-300 rounded-xl p-4 text-sm animate-shake">
              <WarningCircle size={20} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-medium focus:border-teal-500/60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-medium focus:border-teal-500/60 appearance-none"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Project Thumbnail</label>
              <div className="relative group/upload h-[220px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-800/30 flex flex-col items-center justify-center p-6">
                  {imagePreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center transition-opacity">
                         <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg"><UploadSimple size={24} className="text-white" /></div>
                      </div>
                    </div>
                  ) : (
                    <UploadSimple size={32} className="text-slate-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm font-medium resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-950/40 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={20} weight="bold" /> Update Project</>}
          </button>
        </div>
      </form>
    </div>
  );
}
