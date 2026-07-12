"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Code,
  RocketLaunch,
  Briefcase
} from "@phosphor-icons/react";
import EnrollmentModal from "./EnrollmentModal";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    description: string;
    color: string;
  } | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course }) => {
  const [mounted, setMounted] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const router = useRouter();

  const handleStartLearning = () => {
    const courseName = course?.title ?? "";
    router.push(`/login?redirect=/courses&course=${encodeURIComponent(courseName)}`);
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
                  <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: course.color }}>
                    Learn {course.title} Programming<br />from Basics to Advanced
                  </h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 md:mb-10">
                    {course.title} is a powerful, versatile, and beginner-friendly programming language.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="bg-white px-8 py-4 rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                    <span className="text-3xl font-black text-slate-900">₹3500</span>
                  </div>
                  <button 
                    onClick={handleStartLearning}
                    disabled={false}
                    className="flex items-center justify-center gap-3 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: course.color }}
                  >
                    Start Learning <ArrowRight size={20} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Right Illustration Side - Hidden on small mobile or simplified */}
              <div className="relative h-[300px] md:h-[450px] hidden sm:block animate-in slide-in-from-right-5 duration-700">
                {/* Floating Code Window (Simplified for tablet) */}
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
              </div>
            </div>

            {/* Features Section - Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 animate-in slide-in-from-bottom-5 duration-700 delay-200">
              <div className="flex items-center gap-4 md:gap-6 p-4 md:p-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0" style={{ color: course.color }}>
                     <Code size={28} weight="bold" />
                  </div>
                <div>
                  <h3 className="text-sm md:text-lg font-black text-slate-900">Beginner Friendly</h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400">Start from the basics.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6 p-4 md:p-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0" style={{ color: course.color }}>
                  <RocketLaunch size={28} weight="bold" />
                </div>
                <div>
                  <h3 className="text-sm md:text-lg font-black text-slate-900">Practical Learning</h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400">Hands-on examples.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-6 p-4 md:p-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0" style={{ color: course.color }}>
                  <Briefcase size={28} weight="bold" />
                </div>
                <div>
                  <h3 className="text-sm md:text-lg font-black text-slate-900">In-Demand Skills</h3>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400">Boost your career.</p>
                </div>
              </div>
            </div>

            {/* Bottom Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-8 border-t border-slate-100 animate-in slide-in-from-bottom-5 duration-700 delay-300">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-6 flex flex-col gap-2">
                  About This Course
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: course.color }}></div>
                </h3>
                <p className="text-slate-500 font-bold text-xs md:text-sm leading-relaxed">
                  This course is designed for anyone who wants to learn {course.title} programming
                  from scratch or take their skills to the next level.
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                {[
                  "Understand syntax and fundamentals",
                  "Work with real-world examples",
                  "Complete mini-projects",
                  "Get a certificate"
                ].map((item, i) => (
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
