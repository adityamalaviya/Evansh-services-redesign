"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import Header from "@frontend/components/Navigation/Header/Header";
import Footer from "@frontend/components/Navigation/Footer/Footer";

const services = [
  {
    title: "Design & Development of Website and Web Portal",
    description: "We build responsive, user-friendly websites and powerful portals tailored to your study needs."
  },
  {
    title: "Design & Development of Applications",
    description: "Custom applications designed and developed to streamline your study operations."
  },
  {
    title: "Android Application Development",
    description: "We create feature-rich and user-friendly Android applications for your study."
  },
  {
    title: "Domain & Hosting Services",
    description: "Get your perfect domain name and secure, reliable hosting solutions under one roof."
  },
  {
    title: "Bulk SMS / Email Services",
    description: "Reach your audience instantly with our reliable bulk SMS and email services."
  },
  {
    title: "Digital Marketing Services",
    description: "Boost your online presence and grow your study with our result-driven digital marketing strategies."
  },
  {
    title: "Banners and Logo Design",
    description: "Creative and professional designs that make your brand stand out from the crowd."
  },
  {
    title: "Thesis & Report Writing",
    description: "Well-researched theses and reports prepared with accuracy and professionalism."
  },
  {
    title: "Printing and Bindings",
    description: "High-quality printing and binding services for all your academic and study needs."
  },
  {
    title: "Research Services",
    description: "In-depth research and data analysis to support your projects and business decisions."
  },
  {
    title: "Training and Placement Center",
    description: "We provide training and placement assistance to help you build a better career."
  },
  {
    title: "Design Company Profile",
    description: "Professional company profile design to showcase your study identity."
  }
];

const ServicesPage = () => {
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
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-md border border-white/80 p-8 rounded-[32px] flex flex-col h-full hover:shadow-2xl hover:shadow-teal-100/50 hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="flex-grow space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#14B8A6] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-8">
                  <button className="text-[#14B8A6] text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Read more <ArrowRight size={16} weight="bold" />
                  </button>
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
