"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from "@phosphor-icons/react";
import EnrollmentModal from "./EnrollmentModal";
import { useAuth } from "@backend/contexts/AuthContext";

export interface CourseModalData {
  title: string;
  description: string;
  color: string;
  // Fields from DB — used in modal instead of hardcoded values
  subtitle?: string;
  aboutCourse?: string;
  price?: number;
  heroImageUrl?: string;
  feature1Title?: string;
  feature1Subtitle?: string;
  feature2Title?: string;
  feature2Subtitle?: string;
  feature3Title?: string;
  feature3Subtitle?: string;
  whatYouWillLearn?: string;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseModalData | null;
}

/** whatYouWillLearn is stored as newline-separated by the admin form */
function parseWhatYouWillLearn(raw?: string): string[] {
  if (!raw) return [];
  // Try JSON array first
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch { /* not JSON */ }
  // Newline-separated
  const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  // Comma-separated fallback
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course }) => {
  const [mounted, setMounted] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const handleStartLearning = () => {
    if (!isLoading && !isLoggedIn) {
      const courseName = course?.title ?? "";
      router.push(`/login?redirect=/courses&course=${encodeURIComponent(courseName)}`);
    } else {
      setIsEnrollmentOpen(true);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !course) return null;

  // ── Derived values — DB data with sensible fallbacks ─────────────────────
  const subtitle = course.subtitle || `Learn ${course.title} Programming\nfrom Basics to Advanced`;
  const shortDescription = course.description;
  const aboutCourse = course.aboutCourse || `This course is designed for anyone who wants to learn ${course.title} programming from scratch or take their skills to the next level.`;
  const priceDisplay = course.price != null ? `₹${course.price.toLocaleString("en-IN")}` : "₹3500";

  const features = [
    { title: course.feature1Title, subtitle: course.feature1Subtitle },
    { title: course.feature2Title, subtitle: course.feature2Subtitle },
    { title: course.feature3Title, subtitle: course.feature3Subtitle },
  ].filter((f) => f.title);

  // Fall back to generic features if none defined in DB
  const displayFeatures = features.length > 0 ? features : [
    { title: "Beginner Friendly", subtitle: "Start from the basics." },
    { title: "Practical Learning", subtitle: "Hands-on examples." },
    { title: "In-Demand Skills",  subtitle: "Boost your career." },
  ];

  const whatYouWillLearn = parseWhatYouWillLearn(course.whatYouWillLearn);
  const displayLearnPoints = whatYouWillLearn.length > 0 ? whatYouWillLearn : [
    "Understand syntax and fundamentals",
    "Work with real-world examples",
    "Complete mini-projects",
    "Get a certificate",
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-6 lg:p-12">
      {/* Backdrop with deeper blur and darker tint */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content - Fixed Aspect & Centered */}
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#F9FBFC] rounded-[32px] md:rounded-[48px] shadow-[0_32px_128px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transition-all duration-500 scale-100 opacity-100 border border-white/20">

        {/* Modal Header - Compact Responsive */}
        <div className="px-6 md:px-10 py-4 md:py-6 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <button
            onClick={onClose}
            className="flex items-center gap-2 md:gap-3 text-slate-400 font-bold hover:text-[#14B8A6] transition-all group"
          >
            <div className="bg-slate-50 p-1.5 md:p-2 rounded-full group-hover:bg-teal-50 transition-colors">
              <ArrowLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-xs md:text-sm">Back to Courses</span>
          </button>

        </div>

        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent overflow-x-hidden">
          <div className="px-6 md:px-20 py-8 md:py-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-start mb-12">
              {/* Left Content */}
              <div className="space-y-6 md:space-y-8 animate-in slide-in-from-left-5 duration-700">
                <div>
                  <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4">{course.title}</h1>
                  {/* ✅ Dynamic subtitle from DB */}
                  <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: course.color }}>
                    {subtitle.split("\n").map((line, i) => (
                      <span key={i}>{line}{i < subtitle.split("\n").length - 1 && <br />}</span>
                    ))}
                  </h2>
                  {/* ✅ Dynamic short description from DB */}
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 md:mb-10">
                    {shortDescription}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* ✅ Dynamic price from DB */}
                  <div className="bg-white px-8 py-4 rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                    <span className="text-3xl font-black text-slate-900">{priceDisplay}</span>
                  </div>
                  <button
                    onClick={handleStartLearning}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: course.color }}
                  >
                    Start Learning <ArrowRight size={20} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Right Illustration Side - Hidden on small mobile or simplified */}
              <div className="relative h-[300px] md:h-[450px] hidden sm:block animate-in slide-in-from-right-5 duration-700">
                {course.heroImageUrl ? (
                  /* ✅ Dynamic hero image from DB */
                  <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
                    {/* Use plain img — heroImageUrl can be any external domain */}
                    <img
                      src={course.heroImageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    {/* Floating Code Window (original fallback) */}
                    <div className="absolute top-0 left-0 w-[200px] md:w-[240px] bg-slate-900 p-4 md:p-6 rounded-3xl shadow-2xl z-20 border border-slate-700/50">
                      <div className="flex gap-1.5 mb-4 md:mb-6">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-2 md:space-y-4 font-mono text-[8px] md:text-[10px]">
                        <div className="flex gap-2"><span className="text-teal-400">print</span><span className="text-slate-100">(&quot;Hello!&quot;)</span></div>
                        <div className="flex gap-2"><span className="text-teal-400">name</span><span className="text-slate-100">= &quot;{course.title}&quot;</span></div>
                      </div>
                    </div>
                    {/* Main Image with Laptop */}
                    <div className="absolute bottom-0 right-0 w-[300px] md:w-[450px] z-10">
                      <Image
                        src="/assets/Main.jpeg"
                        alt="Student workspace"
                        width={450}
                        height={340}
                        className="rounded-[32px] md:rounded-[40px] shadow-2xl"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ✅ Features Section — dynamic from DB, fallback to originals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {displayFeatures.map((f, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5">
                  <h3 className="text-sm md:text-base font-black text-slate-900 mb-1">{f.title}</h3>
                  {f.subtitle && <p className="text-[11px] md:text-xs font-medium text-slate-400">{f.subtitle}</p>}
                </div>
              ))}
            </div>

            {/* Bottom Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-8 border-t border-slate-100 animate-in slide-in-from-bottom-5 duration-700 delay-300">
              {/* ✅ About This Course — dynamic from DB */}
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-6 flex flex-col gap-2">
                  About This Course
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: course.color }}></div>
                </h3>
                <p className="text-slate-500 font-bold text-xs md:text-sm leading-relaxed">
                  {aboutCourse}
                </p>
              </div>
              {/* ✅ What You'll Learn — dynamic from DB */}
              <div className="space-y-3 md:space-y-4">
                {displayLearnPoints.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={24} weight="fill" style={{ color: course.color }} />
                    <span className="text-slate-700 font-bold text-xs md:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        course={course}
      />
    </>
  );
};

export default CourseModal;
