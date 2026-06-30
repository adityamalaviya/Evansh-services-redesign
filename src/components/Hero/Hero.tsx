"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, BracketsCurly } from "@phosphor-icons/react";
import { tokens } from "@/styles/tokens";

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-[#F8FAFC]">
      <div className={`${tokens.spacing.container} relative z-10`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] text-slate-800 tracking-tight mb-6">
              learn today,<br />
              <span className="text-[#14B8A6]">build tomorrow</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-md">
              Expert IT Training, Practical Knowledge and Understanding, Real-World Skills for your Success.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link 
                href="/about"
                className="flex items-center gap-3 bg-[#0F766E] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#0D635C] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20"
              >
                About Us <ArrowRight size={22} weight="bold" />
              </Link>
              <button 
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 bg-[#14B8A6] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#0D9488] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/10"
              >
                Get Started <ArrowRight size={22} weight="bold" />
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-30"></div>

            {/* Main Image */}
            <div className="relative z-10 scale-110 md:scale-100">
              <Image
                src="/assets/Main.jpeg"
                alt="Student learning IT"
                width={600}
                height={500}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Floating Icons */}
            <div className="absolute top-10 left-0 bg-white p-3 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
              <Code size={32} weight="bold" className="text-[#14B8A6]" />
            </div>
            <div className="absolute bottom-20 right-0 bg-white p-3 rounded-2xl shadow-xl animate-pulse">
              <BracketsCurly size={32} weight="bold" className="text-[#1E293B]" />
            </div>
            {/* <div className="absolute top-1/2 -right-4 bg-[#1E293B] text-white px-4 py-2 rounded-lg shadow-xl font-mono text-xs">
              C++
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
