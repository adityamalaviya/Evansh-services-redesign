"use client";

import React, { useState } from "react";
import { Check, GraduationCap } from "@phosphor-icons/react";

export default function CoursesAdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconEmoji, setIconEmoji] = useState("");
  const [themeColor, setThemeColor] = useState("#14B8A6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Dummy submit for now, as Appwrite collection for courses isn't stated
    setTimeout(() => {
      setIsSubmitting(false);
      setTitle("");
      setDescription("");
      setIconEmoji("");
      alert("Course added successfully! (Database integration pending)");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <GraduationCap size={28} className="text-[#14B8A6]" /> Add New Course
        </h1>
        <p className="text-slate-400 text-sm mt-1">Create a new course to display on your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Course Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python Programming"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6]/60 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Icon (Emoji or Text)</label>
                <input
                  type="text"
                  value={iconEmoji}
                  onChange={(e) => setIconEmoji(e.target.value)}
                  placeholder="e.g. 🐍 or N"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6]/60 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Theme Color (Hex)</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6]/60 transition-all uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about the course..."
              rows={4}
              required
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#14B8A6]/60 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#14B8A6] hover:bg-[#0D9488] text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-teal-950/40 hover:shadow-teal-900/60 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={20} weight="bold" />
                  <span>Add Course</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
