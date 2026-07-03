"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  ArrowRight, 
  Selection, 
  NotePencil, 
  Browser, 
  Monitor, 
  Globe, 
  Code 
} from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";

interface Course {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  uiElement: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Python",
    description: "Learn Python programming from basics to advance and build real-world applications with confidence.",
    icon: <div className="text-4xl">🐍</div>,
    uiElement: <Selection size={40} weight="duotone" className="text-teal-400 opacity-40" />,
    color: "#14B8A6",
    bgColor: "bg-teal-50/50",
    borderColor: "border-teal-100"
  },
  {
    id: 2,
    title: "Software Development Using VB.NET",
    description: "Build Windows applications using VB.NET step by step. Learn concepts with practical examples.",
    icon: <div className="font-black text-blue-600 text-3xl">N</div>,
    uiElement: <NotePencil size={40} weight="duotone" className="text-blue-400 opacity-40" />,
    color: "#2563EB",
    bgColor: "bg-blue-50/50",
    borderColor: "border-blue-100"
  },
  {
    id: 3,
    title: "WordPress",
    description: "Create responsive and professional websites using WordPress. No coding knowledge required.",
    icon: <div className="text-4xl">🌐</div>,
    uiElement: <Browser size={40} weight="duotone" className="text-slate-400 opacity-40" />,
    color: "#475569",
    bgColor: "bg-slate-50/50",
    borderColor: "border-slate-200"
  },
  {
    id: 4,
    title: "Animation Using Flash",
    description: "Design interactive animations and cartoons. Bring your creativity to life with exciting animations.",
    icon: <div className="font-bold text-orange-700 text-3xl">Fl</div>,
    uiElement: <Monitor size={40} weight="duotone" className="text-orange-400 opacity-40" />,
    color: "#EA580C",
    bgColor: "bg-orange-50/30",
    borderColor: "border-orange-100"
  },
  {
    id: 5,
    title: "Introduction to World of Computer and Internet",
    description: "Understand the basics of computer, internet, networking, and how the digital world works.",
    icon: <Globe size={40} weight="fill" className="text-indigo-500" />,
    uiElement: <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-indigo-200 animate-pulse"></div><div className="w-2 h-2 rounded-full bg-indigo-300"></div></div>,
    color: "#6366F1",
    bgColor: "bg-indigo-50/50",
    borderColor: "border-indigo-100"
  },
  {
    id: 6,
    title: "HTML & CSS",
    description: "Design and build modern, responsive websites using HTML and CSS. Perfect for beginners.",
    icon: <Code size={40} weight="bold" className="text-orange-500" />,
    uiElement: <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200"></div>,
    color: "#F97316",
    bgColor: "bg-orange-50/50",
    borderColor: "border-orange-100"
  }
];

import CourseModal from "./CourseModal";

interface CoursesProps {
  forceVisible?: boolean;
}

const Courses: React.FC<CoursesProps> = ({ forceVisible = false }) => {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleOpenModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (forceVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [forceVisible]);

  return (
    <>
      <section 
        id="courses"
        ref={sectionRef}
        className={`py-24 bg-white transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div className={tokens.spacing.container}>
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              explore our courses
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium px-4">
              our courses are designed to help you gain practical skills, build real-world
              projects and grow your career in the tech industry.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div 
                key={course.id}
                onClick={() => handleOpenModal(course)}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`group p-8 rounded-[40px] border-2 ${course.borderColor} ${course.bgColor} transition-all duration-500 hover:scale-[1.02] md:hover:scale-[1.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:hover:-translate-y-2 active:scale-95 flex flex-col justify-between h-full relative overflow-hidden cursor-pointer touch-manipulation`}
              >
                {/* Subtle pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform">
                  <Code size={120} weight="fill" />
                </div>

                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                      {course.icon}
                    </div>
                    <div className="pt-2">
                      {course.uiElement}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-4 whitespace-pre-line group-hover:text-[#14B8A6] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                    {course.description}
                  </p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(course);
                  }}
                  className="w-full py-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:gap-4 mt-auto hover:bg-white group-hover:bg-white group-hover:border-transparent group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 active:scale-95"
                  style={{ 
                    color: course.color, 
                    borderColor: `${course.color}40` // adding hex alpha for transparency
                  }}
                >
                  Explore Course <ArrowRight size={18} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Modal - Moved outside the section to keep it separate and centered on top of everything */}
      <CourseModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        course={selectedCourse ? {
          title: selectedCourse.title,
          description: selectedCourse.description,
          color: selectedCourse.color
        } : null}
      />
    </>
  );
};



export default Courses;
