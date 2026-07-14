"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight
} from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import CourseModal from "./CourseModal";

interface Course {
  id: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  image?: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Python",
    description: "Learn Python programming from basics to advance and build real-world applications with confidence.",
    color: "#14B8A6",
    bgColor: "bg-teal-50/50",
    borderColor: "border-teal-100",
    image: ""
  },
  {
    id: 2,
    title: "Software Development Using VB.NET",
    description: "Build Windows applications using VB.NET step by step. Learn concepts with practical examples.",
    color: "#2563EB",
    bgColor: "bg-blue-50/50",
    borderColor: "border-blue-100",
    image: ""
  },
  {
    id: 3,
    title: "WordPress",
    description: "Create responsive and professional websites using WordPress. No coding knowledge required.",
    color: "#475569",
    bgColor: "bg-slate-50/50",
    borderColor: "border-slate-200",
    image: ""
  },
  {
    id: 4,
    title: "Animation Using Flash",
    description: "Design interactive animations and cartoons. Bring your creativity to life with exciting animations.",
    color: "#EA580C",
    bgColor: "bg-orange-50/30",
    borderColor: "border-orange-100",
    image: ""
  },
  {
    id: 5,
    title: "Introduction to World of Computer and Internet",
    description: "Understand the basics of computer, internet, networking, and how the digital world works.",
    color: "#6366F1",
    bgColor: "bg-indigo-50/50",
    borderColor: "border-indigo-100",
    image: ""
  },
  {
    id: 6,
    title: "HTML & CSS",
    description: "Design and build modern, responsive websites using HTML and CSS. Perfect for beginners.",
    color: "#F97316",
    bgColor: "bg-orange-50/50",
    borderColor: "border-orange-100",
    image: ""
  }
];

interface CoursesProps {
  forceVisible?: boolean;
}

// Single card component
const CourseCard: React.FC<{ course: Course; onClick: (course: Course) => void }> = ({ course, onClick }) => (
  <div
    onClick={() => onClick(course)}
    className={`group flex-shrink-0 w-[320px] rounded-[40px] border-2 ${course.borderColor} ${course.bgColor} transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)] hover:-translate-y-2 active:scale-95 flex flex-col justify-between relative overflow-hidden cursor-pointer touch-manipulation`}
    style={{ height: "380px" }}
  >

    {/* Top Image Section (Spans to the top edges of the card) */}
    <div className="relative w-full h-[150px] overflow-hidden border-b border-slate-100">
      {course.image ? (
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200/60 relative">
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
      )}
    </div>

    {/* Content Section */}
    <div className="p-6 flex-grow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug line-clamp-2 group-hover:text-[#14B8A6] transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
          {course.description}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(course);
        }}
        className="w-full py-3 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:gap-4 mt-4 hover:bg-white group-hover:bg-white group-hover:border-transparent group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
        style={{
          color: course.color,
          borderColor: `${course.color}40`
        }}
      >
        Explore Course <ArrowRight size={18} weight="bold" />
      </button>
    </div>
  </div>
);

import { databases, DB_ID, COURSES_COLLECTION_ID } from "@backend/services/appwrite";
import { Query } from "appwrite";

const Courses: React.FC<CoursesProps> = ({ forceVisible = false }) => {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [activeCourses, setActiveCourses] = useState<Course[]>(courses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCoursesFromAppwrite = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, COURSES_COLLECTION_ID, [
          Query.orderAsc("order"),
          Query.limit(100)
        ]);
        if (res.documents.length > 0) {
          const mapped: Course[] = res.documents.map((doc: any) => ({
            id: doc.$id,
            title: doc.title,
            description: doc.shortDescription || doc.description || "",
            color: doc.themeColor || "#14B8A6",
            bgColor: doc.bgColor || "bg-teal-50/50",
            borderColor: doc.borderColor || "border-teal-100",
            image: doc.cardImage || doc.image || ""
          }));
          setActiveCourses(mapped);
        }
      } catch (err) {
        console.warn("Appwrite courses fetch failed, using local fallback:", err);
      }
    };
    fetchCoursesFromAppwrite();
  }, []);

  // Auto-open course modal if redirected from login page with ?course= param
  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam) {
      const matched = activeCourses.find(
        (c) => c.title.toLowerCase() === decodeURIComponent(courseParam).toLowerCase()
      );
      if (matched) {
        setSelectedCourse(matched);
        setIsModalOpen(true);
      }
      // Clean the URL without causing a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("course");
      router.replace(url.pathname + (url.search || ""), { scroll: false });
    }
  }, [searchParams, router, activeCourses]);

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
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [forceVisible]);

  // Duplicate cards for seamless infinite loop
  const allCards = [...activeCourses, ...activeCourses, ...activeCourses];

  return (
    <>
      <section
        id="courses"
        ref={sectionRef}
        className={`py-24 bg-white transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        {/* Header */}
        <div className={`${tokens.spacing.container} text-center mb-16 md:mb-20`}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              explore our courses
            </h2>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium px-4">
              our courses are designed to help you gain practical skills, build real-world
              projects and grow your career in the tech industry.
            </p>
          </div>
        </div>

        {/* Infinite Marquee */}
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 h-full w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-6 py-4"
            style={{
              width: "max-content",
              animation: `marquee-rtl 32s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running"
            }}
          >
            {allCards.map((course, index) => (
              <CourseCard
                key={`${course.id}-${index}`}
                course={course}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </div>

      </section>

      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={
          selectedCourse
            ? {
                title: selectedCourse.title,
                description: selectedCourse.description,
                color: selectedCourse.color
              }
            : null
        }
      />
    </>
  );
};

export default Courses;
