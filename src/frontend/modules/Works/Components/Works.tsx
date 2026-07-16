"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Globe, Laptop, Database, GraduationCap, Cube, DotsThreeOutline, Image as ImageIcon } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import { api } from "@/lib/api";
import { useAuth } from "@backend/contexts/AuthContext";
import EnrollmentModal from "@frontend/modules/Courses/Components/EnrollmentModal";
import { publicEnv } from "@/lib/env";
const DB_ID = publicEnv.dbId ?? "not set";
interface Project {
  id: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
}

const categories = [
  { name: "All Projects", icon: <Globe size={18} /> },
  { name: "Web Portals", icon: <Laptop size={18} /> },
  { name: "Websites", icon: <Globe size={18} /> },
  { name: "Inventory Systems", icon: <Database size={18} /> },
  { name: "College Portals", icon: <GraduationCap size={18} /> },
  { name: "3D Printing", icon: <Cube size={18} /> },
  { name: "Other Projects", icon: <DotsThreeOutline size={18} /> },
];

const Works: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, isLoading } = useAuth();

  // Auto-open project inquiry modal if redirected from login page with ?course=Start%20Your%20Journey param
  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam && decodeURIComponent(courseParam) === "Start Your Journey") {
      setIsEnrollmentOpen(true);
      // Clean the URL without causing a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("course");
      url.searchParams.delete("redirect");
      router.replace(url.pathname + (url.search || ""), { scroll: false });
    }
  }, [searchParams, router]);

  const handleStartJourneyClick = () => {
    if (!isLoading && !isLoggedIn) {
      router.push(`/login?redirect=/works&course=${encodeURIComponent("Start Your Journey")}`);
    } else {
      setIsEnrollmentOpen(true);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProjects();
        
        const fetchedProjects = res.projects.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          description: doc.description,
          image: doc.imageUrl || ""
        }));
        
        setDbProjects(fetchedProjects);
      } catch (err: any) {
        console.error("BFF Fetch error:", err);
        setError(`Failed to connect to database: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === "All Projects"
    ? dbProjects
    : dbProjects.filter(p => p.category === activeCategory);

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className={tokens.spacing.container}>
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#14B8A6] animate-pulse"></div>
            <span className="text-[#14B8A6] font-bold tracking-widest uppercase text-xs">
              our company work portfolio
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
            Our Company <span className="text-[#14B8A6]">Work Portfolio</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            We take pride in delivering innovative, reliable and result-driven digital solutions.
            Here are some of our recent projects.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${activeCategory === cat.name
                ? "bg-[#0F766E] text-white border-[#0F766E] shadow-xl shadow-teal-100"
                : "bg-white text-slate-600 border-slate-100 hover:border-[#14B8A6] hover:text-[#14B8A6]"
                }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin" />
          </div>
        ) : error ? (
           <div className="text-center py-20 space-y-4 max-w-lg mx-auto">
             <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 space-y-2">
               <p className="font-bold text-lg">Connection Error</p>
               <p className="text-sm opacity-80">{error}</p>
             </div>
             <p className="text-slate-500 text-sm">
               Please verify that your <b>Database ID</b> in <code>.env.local</code> matches your Appwrite Console exactly. 
               The current ID being used is <span className="font-mono bg-slate-100 px-1 rounded">{DB_ID}</span>.
             </p>
             <button 
                onClick={() => window.location.reload()}
                className="text-[#14B8A6] font-bold text-sm hover:underline"
             >
                Try Refreshing
             </button>
           </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-slate-400 text-lg font-medium">No projects to show for this category yet.</p>
            <p className="text-slate-500 text-sm">Update your portfolio from the admin panel.</p>
          </div>

        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon size={48} weight="thin" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <span className="text-white text-xs font-bold px-3 py-1 bg-[#14B8A6] rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 pb-10 space-y-4 relative">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-[#14B8A6] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="bg-[#14B8A6] text-white p-2 rounded-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-teal-200">
                      <ArrowRight size={16} weight="bold" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  <div className="absolute bottom-0 left-8 right-8 h-1 bg-[#14B8A6] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-24 bg-slate-900 rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-[#14B8A6] font-bold flex items-center gap-2 justify-center md:justify-start">
                <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                Have a Project in Mind?
              </h3>
              <h2 className="text-3xl md:text-4xl text-white font-black">
                Let's Work Together
              </h2>
              <p className="text-slate-400 max-w-sm">
                We turn ideas into powerful digital solutions. Let's build something amazing.
              </p>
            </div>
            <button
              onClick={handleStartJourneyClick}
              disabled={isLoading}
              className="bg-[#14B8A6] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#0D9488] transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Start Your Journey <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      </div>
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
        course={{ title: "Start Your Journey", color: "#14B8A6" }}
      />
    </section>
  );
};

export default Works;
