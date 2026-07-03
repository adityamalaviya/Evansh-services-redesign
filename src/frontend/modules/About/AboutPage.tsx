"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flag,
  GraduationCap,
  Users,
  Trophy,
  CheckCircle
} from "@phosphor-icons/react";
import { Header, Footer } from "@frontend/components";
import { tokens } from "@frontend/styles/tokens";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="pt-24 pb-20 overflow-hidden">
        <section className="pb-12 md:pb-20">
          <div className={tokens.spacing.container}>
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="text-center lg:text-left">
                <span className="text-[#14B8A6] font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
                  About Us
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 md:mb-8 transition-all">
                  Empowering students<br />
                  for a <span className="text-[#14B8A6]">better tomorrow</span>
                </h1>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 font-medium">
                  At Evansh Classes, we believe that quality education can transform lives.
                  Our mission is to provide concept-based learning, personal attention and
                  the right guidance to help students achieve their goals.
                </p>
                <Link
                  href="/courses"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1E293B] text-white px-8 md:px-10 py-4 rounded-xl md:rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
                >
                  Our Courses <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute -inset-6 md:-inset-10 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
                <Image
                  src="/assets/Ab.jpeg"
                  alt="Student learning"
                  width={600}
                  height={500}
                  className="w-full h-auto drop-shadow-xl rounded-3xl md:rounded-[40px] hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Grid */}
        <section className="pb-16 md:pb-24">
          <div className={tokens.spacing.container}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Flag size={24} weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 md:mb-4">Our Mission</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  To deliver high-quality education with innovative teaching methods that inspire learning.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <GraduationCap size={32} weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 md:mb-4">Quality Education</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  We provide concept-based learning with expert guidance to master the fundamentals.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-slate-50 text-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform">
                  <Users size={32} weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 md:mb-4">Student Focused</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  Every student is unique. We focus on individual growth and success to bring out the best.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy size={32} weight="fill" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 md:mb-4">Excellence</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  We are committed to excellence in teaching, driving consistent success for students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className={tokens.spacing.container}>
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 flex flex-col gap-2">
                Why Choose Evansh Classes?
                <div className="w-20 h-1.5 bg-[#14B8A6] rounded-full"></div>
              </h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-10 md:mb-12 font-medium">
                Dedicated to providing the best learning experience through innovative methods and a supportive environment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 md:gap-y-6 gap-x-12">
                {[
                  "Experienced Faculty",
                  "Regular Tests",
                  "Study Material",
                  "Personal Attention",
                  "Doubt Sessions",
                  "Flexible Batches"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors">
                      <CheckCircle size={20} weight="bold" />
                    </div>
                    <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section className="py-16 md:py-24">
          <div className={tokens.spacing.container}>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block bg-teal-50 text-[#14B8A6] px-6 md:px-8 py-2 md:py-3 rounded-full font-black text-lg md:text-xl mb-4 md:mb-6 shadow-sm">
                Meet Our Teachers
              </div>
              <div className="w-16 h-1 bg-[#14B8A6] rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-4 md:px-0">
              <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#14B8A6] flex-shrink-0 border-4 border-teal-50"></div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Honey R. Gurnani</h3>
                  <p className="text-[#14B8A6] font-bold text-xs md:text-sm mb-3 md:mb-4 uppercase tracking-wider">AI/ML Teacher</p>
                  <p className="text-slate-500 font-bold text-xs md:text-sm">18+ Years Experience</p>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8 hover:shadow-xl transition-all hover:scale-[1.02]">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#14B8A6] flex-shrink-0 border-4 border-teal-50"></div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Vimal Vaniya</h3>
                  <p className="text-[#14B8A6] font-bold text-xs md:text-sm mb-3 md:mb-4 uppercase tracking-wider">DSA Teacher</p>
                  <p className="text-slate-500 font-bold text-xs md:text-sm">15+ Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Start */}
        <section className="pb-16 md:pb-32 px-4 md:px-0">
          <div className={tokens.spacing.container}>
            <div className="bg-teal-50/50 p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-teal-100/50 flex flex-col lg:flex-row items-center justify-between gap-10 hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-700">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full text-center md:text-left">
                <div className="w-32 md:w-48 relative flex-shrink-0">
                  <Image
                    src="/assets/Main.jpeg"
                    alt="Ready to learn"
                    width={200}
                    height={150}
                    className="w-full h-auto drop-shadow-lg rounded-2xl"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-slate-500 font-bold text-sm md:text-base max-w-md">
                    Join thousands of students learning and achieving goals with Evansh Classes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-3 flex-shrink-0 w-full lg:w-auto">
                <Link
                  href="/courses"
                  className="group w-full lg:w-auto bg-[#1E293B] text-white px-8 md:px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-400/20"
                >
                  Explore Courses <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
