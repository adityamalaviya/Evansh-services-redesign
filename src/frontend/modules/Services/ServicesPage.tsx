"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import { Header, Footer } from "@frontend/components";
import { databases, DB_ID, SERVICES_COLLECTION_ID } from "@backend/services/appwrite";
import { Query } from "appwrite";

const staticServices = [
  {
    title: "Design & Development of Website and Web Portal",
    description: "We build responsive, user-friendly websites and powerful portals tailored to your study needs.",
    image: ""
  },
  {
    title: "Design & Development of Applications",
    description: "Custom applications designed and developed to streamline your study operations.",
    image: ""
  },
  {
    title: "Android Application Development",
    description: "We create feature-rich and user-friendly Android applications for your study.",
    image: ""
  },
  {
    title: "Domain & Hosting Services",
    description: "Get your perfect domain name and secure, reliable hosting solutions under one roof.",
    image: ""
  },
  {
    title: "Bulk SMS / Email Services",
    description: "Reach your audience instantly with our reliable bulk SMS and email services.",
    image: ""
  },
  {
    title: "Digital Marketing Services",
    description: "Boost your online presence and grow your study with our result-driven digital marketing strategies.",
    image: ""
  },
  {
    title: "Banners and Logo Design",
    description: "Creative and professional designs that make your brand stand out from the crowd.",
    image: ""
  },
  {
    title: "Thesis & Report Writing",
    description: "Well-researched theses and reports prepared with accuracy and professionalism.",
    image: ""
  },
  {
    title: "Printing and Bindings",
    description: "High-quality printing and binding services for all your academic and study needs.",
    image: ""
  },
  {
    title: "Research Services",
    description: "In-depth research and data analysis to support your projects and business decisions.",
    image: ""
  },
  {
    title: "Training and Placement Center",
    description: "We provide training and placement assistance to help you build a better career.",
    image: ""
  },
  {
    title: "Design Company Profile",
    description: "Professional company profile design to showcase your study identity.",
    image: ""
  }
];

const ServicesPage = () => {
  const [activeServices, setActiveServices] = useState(staticServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await databases.listDocuments(DB_ID, SERVICES_COLLECTION_ID, [
          Query.orderAsc("order"),
          Query.limit(100)
        ]);
        if (res.documents.length > 0) {
          const mapped = res.documents.map((doc: any) => ({
            title: doc.title,
            description: doc.subtitle || doc.description || "",
            image: doc.image || doc.imageUrl || ""
          }));
          setActiveServices(mapped);
        }
      } catch (err) {
        console.warn("Appwrite services fetch failed, using local fallback:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="pt-32 pb-20">
        <div className={tokens.spacing.container}>
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-20">
            <span className="text-[#14B8A6] font-bold tracking-widest uppercase text-sm">
              our services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              provide wide range of <span className="text-[#14B8A6]">digital services</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              we delivers smart, reliable and result-driven digital solutions <br className="hidden md:block" />
              to help your study grow and succeed.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {activeServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-md border border-white/80 rounded-[32px] overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-teal-100/50 hover:-translate-y-2 transition-all duration-500 group"
              >
                {/* Top Image / Placeholder Section */}
                <div className="relative w-full h-[160px] overflow-hidden bg-slate-100 border-b border-slate-100">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200/60 relative flex items-center justify-center">
                      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                      <svg className="w-12 h-12 text-[#14B8A6]/40 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L14.907 18M21.94 9.486a10.016 10.016 0 00-6.425-6.425M21.94 9.486a10.014 10.014 0 01-6.425 6.425M21.94 9.486L14.907 18M15.515 3.061a10.016 10.016 0 00-6.425 6.425m6.425-6.425L9 21M9.09 9.486a10.014 10.014 0 006.425 6.425m-6.425-6.425L9 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#14B8A6] transition-colors line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Want to see our work in <span className="text-[#14B8A6]">action?</span>
            </h2>
            <Link 
              href="/works"
              className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold inline-flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 group"
            >
              Our Company Work Portfolio 
              <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
