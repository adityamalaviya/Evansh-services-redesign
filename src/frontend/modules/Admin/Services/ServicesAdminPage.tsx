"use client";

import React, { useState } from "react";
import { Check, Briefcase } from "@phosphor-icons/react";

export default function ServicesAdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTitle("");
      setDescription("");
      alert("Service added successfully! (Database integration pending)");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#1E1E24] flex items-center gap-3">
          <Briefcase size={28} className="text-[#14B8A6]" /> Add New Service
        </h1>
        <p className="text-slate-500 text-sm mt-1">Create a new service to display on your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Service Title</label>
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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service..."
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
                  <span>Saving...</span>
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
