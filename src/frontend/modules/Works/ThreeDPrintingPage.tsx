"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Laptop, Database, GraduationCap, Printer, Cube, DotsThreeOutline, Image as ImageIcon } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import Header from "@frontend/components/Navigation/Header/Header";
import Footer from "@frontend/components/Navigation/Footer/Footer";

import { databases, storage, DB_ID, PROJECTS_COLLECTION_ID, BUCKET_ID } from "@backend/services/appwrite";
import { Query, Models } from "appwrite";

interface Project {
  id: string | number;
  title: string;
  category: string;
  description: string;
  image: string;
}

const categories = [
  { name: "All Projects", icon: <Globe size={18} />, href: "/works" },
  { name: "Web Portals", icon: <Laptop size={18} />, href: "/works" },
  { name: "Websites", icon: <Globe size={18} />, href: "/works" },
  { name: "Inventory Systems", icon: <Database size={18} />, href: "/works" },
  { name: "College Portals", icon: <GraduationCap size={18} />, href: "/works" },
  { name: "Printing", icon: <Printer size={18} />, href: "/works" },
  { name: "3D Printing", icon: <Cube size={18} />, href: "/works/3d-printing" },
];

export default function ThreeDPrintingPage() {
  const activeCategory = "3D Printing";
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID, [
          Query.equal("category", "3D Printing"),
          Query.orderAsc("order"),
          Query.limit(100)
        ]);
        
        const fetchedProjects = res.documents.map((doc: Models.Document & { title?: string; category?: string; description?: string; imageId?: string }) => ({
          id: doc.$id,
          title: doc.title || "",
          category: doc.category || "",
          description: doc.description || "",
          image: doc.imageId ? storage.getFilePreview(BUCKET_ID, doc.imageId).toString() : ""
        }));
        
        setDbProjects(fetchedProjects);
      } catch (err) {
        console.error("DB Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="pt-20">
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
                3D Printing <span className="text-[#14B8A6]">Projects</span>
              </h1>
              <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
                Innovative ideas brought to life through precision 3D printing.
                Explore some of our custom printed prototypes and models.
              </p>
            </div>

            {/* Categories Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${activeCategory === cat.name
                    ? "bg-[#0F766E] text-white border-[#0F766E] shadow-xl shadow-teal-100"
                    : "bg-white text-slate-600 border-slate-100 hover:border-[#14B8A6] hover:text-[#14B8A6]"
                    }`}
                >
                  {cat.icon}
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin" />
              </div>
            ) : dbProjects.length === 0 ? (
               <div className="text-center py-24 space-y-4">
                  <p className="text-slate-400 text-lg font-medium">No 3D printing projects to show yet.</p>
                  <p className="text-slate-500 text-sm">Add some projects from the admin panel to see them here.</p>
               </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dbProjects.map((project, index) => (
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
            <div className="mt-24 bg-[#E0F2F1] rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-4">
                  <h3 className="text-[#0D9488] font-bold flex items-center gap-2 justify-center md:justify-start">
                    <Cube size={24} weight="fill" className="text-[#0D9488]" />
                    Have an idea in mind?
                  </h3>
                  <h2 className="text-3xl md:text-4xl text-slate-900 font-black">
                    Let's bring it to life with <span className="text-[#14B8A6]">3D printing!</span>
                  </h2>
                </div>
                <Link
                  href="/contact"
                  className="bg-[#0F766E] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#0D635C] transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  Discuss Your Project <ArrowRight size={20} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
