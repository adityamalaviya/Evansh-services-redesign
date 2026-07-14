"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, BracketsCurly } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-[#F8FAFC]">
      <div className={`${tokens.spacing.container} relative z-10`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="text-5xl md:text-8xl font-black leading-[1.1] text-slate-900 tracking-tight mb-6 md:mb-8">
              Learn today<br />
              <span className="text-[#14B8A6]">Build tomorrow</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 mb-8 md:mb-12 leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
              Expert IT Training. Practical Knowledge and UnderStanding. Real-World Skills for your Success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/about"
                className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0F766E] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0D635C] transition-all hover:scale-110 active:scale-95 shadow-[0_20px_40px_rgba(15,118,110,0.2)]"
              >
                About Us <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="#courses"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-[#14B8A6] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0D9488] transition-all hover:scale-110 active:scale-95 shadow-[0_20px_40px_rgba(20,184,166,0.25)]"
              >
                Get Started <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative mt-12 lg:mt-0">
            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 md:w-72 md:h-72 bg-slate-200 rounded-full blur-3xl opacity-30"></div>

            {/* Main Image */}
            <div className="relative z-10">
              <Image
                src="/assets/Main.jpeg"
                alt="Student learning IT"
                width={600}
                height={500}
                className="w-full h-auto drop-shadow-2xl rounded-3xl"
                priority
              />
            </div>

            {/* Floating Icons */}
            <div className="absolute top-4 left-0 md:top-10 bg-white p-2 md:p-3 rounded-2xl shadow-xl animate-bounce">
              <Code size={32} weight="bold" className="text-[#14B8A6]" />
            </div>
            <div className="absolute bottom-10 right-0 bg-white p-2 md:p-3 rounded-2xl shadow-xl animate-pulse">
              <BracketsCurly size={32} weight="bold" className="text-[#1E293B]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
