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
  CheckCircle,
  Hexagon
} from "@phosphor-icons/react";
import { Header } from "@/components";
import { tokens } from "@/styles/tokens";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className={tokens.spacing.container}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#14B8A6] font-bold tracking-widest uppercase text-sm mb-4 block">
                about us
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">
                empowering student<br />
                for a <span className="text-[#14B8A6]">better tomorrow</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-lg font-medium">
                At Evansh Classes, we believe that quality education can transform lives.
                Our mission is to provide concept-based learning, personal attention and
                the right guidance to help students achieve their academic goals and build
                a successful future.
              </p>
              <Link
                href="/#courses"
                className="inline-flex items-center gap-3 bg-[#1E293B] text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:gap-5 shadow-xl shadow-slate-200"
              >
                Our Courses <ArrowRight size={20} weight="bold" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10"></div>
              <Image
                src="/assets/Ab.jpeg"
                alt="Student learning"
                width={600}
                height={500}
                className="w-full h-auto drop-shadow-xl hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Grid */}
      <section className="pb-24">
        <div className={tokens.spacing.container}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Flag size={24} weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Our Mission</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                To deliver high-quality education with innovative teaching methods and a student-first approach
                that inspires learning, builds confidence and shapes brighter futures.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] rounded-xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <GraduationCap size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quality Education</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                We provide concept-based learning with expert guidance to ensure every student
                masters the fundamentals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-slate-50 text-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform">
                <Users size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Student Focused</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                Every student is unique. We focus on individual growth and success to bring
                out the best in everyone.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Excellence</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                We are committed to excellence in teaching and results, driving
                consistent success for our students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className={tokens.spacing.container}>
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black text-slate-900 mb-6 flex flex-col gap-2">
              Why Choose Evansh Classes?
              <div className="w-24 h-1.5 bg-[#14B8A6] rounded-full"></div>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">
              We are dedicated to providing the best learning experience through innovative methods,
              expert faculty and a supportive environment.
            </p>

            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
              {[
                "Experienced and Qualified Faculty",
                "Regular Tests and Performance Tracking",
                "Study Material and Notes",
                "Personal Attention to Every Student",
                "Doubt Solving Sessions",
                "Flexible Batches and Timings"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors">
                    <CheckCircle size={20} weight="bold" />
                  </div>
                  <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Teachers */}
      <section className="py-24">
        <div className={tokens.spacing.container}>
          <div className="text-center mb-16">
            <div className="inline-block bg-teal-50 text-[#14B8A6] px-8 py-3 rounded-full font-black text-xl mb-6 shadow-sm">
              Meet Our Teacher?
            </div>
            <div className="w-16 h-1 w-24 h-1.5 bg-[#14B8A6] rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Teacher 1 */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-8 hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-32 h-32 rounded-full bg-[#14B8A6] flex-shrink-0 overflow-hidden border-4 border-teal-50">
                {/* Avatar Placeholder as per image - solid teal circle */}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Honey R. Gurnani</h3>
                <p className="text-[#14B8A6] font-bold text-sm mb-4 uppercase tracking-wider">AI/ML Teacher</p>
                <p className="text-slate-500 font-bold">18+ Years Experience</p>
              </div>
            </div>

            {/* Teacher 2 */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-8 hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="w-32 h-32 rounded-full bg-[#14B8A6] flex-shrink-0 overflow-hidden border-4 border-teal-50">
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Vimal Vaniya</h3>
                <p className="text-[#14B8A6] font-bold text-sm mb-4 uppercase tracking-wider">DSA Teacher</p>
                <p className="text-slate-500 font-bold">15+ Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Footer CTA */}
      <section className="pb-32">
        <div className={tokens.spacing.container}>
          <div className="bg-teal-50/50 p-8 md:p-12 rounded-[48px] border border-teal-100/50 flex flex-col md:flex-row items-center justify-between gap-12 hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-700">
            <div className="flex items-center gap-12 w-full md:w-auto">
              <div className="w-32 md:w-48 relative flex-shrink-0">
                <Image
                  src="/images/about-cta.png"
                  alt="Ready to learn"
                  width={200}
                  height={150}
                  className="w-full h-auto drop-shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="text-slate-500 font-bold max-w-md">
                  Join thousands of students who are learning, growing and achieving their goals with Evansh Classes.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
              <span className="text-slate-300 font-bold tracking-widest uppercase text-xs">Link</span>
              <Link
                href="/#courses"
                className="bg-[#1E293B] text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-slate-400/20"
              >
                Explore Courses <ArrowRight size={20} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
