"use client";

import React from "react";
import Link from "next/link";
import { Hexagon, InstagramLogo, LinkedinLogo, TwitterLogo, YoutubeLogo, ArrowRight } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 pt-16 md:pt-24 pb-8 md:pb-12 text-slate-400 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10"></div>

      <div className={tokens.spacing.container}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-1 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-3 mb-6 md:mb-8 group">
              <div className="bg-white p-2 rounded-xl transition-transform group-hover:rotate-12">
                <Hexagon size={24} weight="fill" className="text-slate-900" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Evansh Services
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8 font-medium text-sm md:text-base">
              Empowering students through concept-based learning and expert guidance for a brighter future.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {/* Icons ... */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-[#14B8A6] transition-all">
                <InstagramLogo size={20} weight="bold" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-[#14B8A6] transition-all">
                <LinkedinLogo size={20} weight="bold" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-[#14B8A6] transition-all">
                <TwitterLogo size={20} weight="bold" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-[#14B8A6] transition-all">
                <YoutubeLogo size={20} weight="bold" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-4">
              {["Home", "Courses", "About Us", "Contact", "Services"].map((item) => (
                <li key={item}>
                  <Link 
                    href={
                      item === "Home" ? "/" :
                      item === "Courses" ? "/courses" :
                      item === "About Us" ? "/about" :
                      item === "Contact" ? "/contact" :
                      item === "Services" ? "/services" :
                      `/#${item.toLowerCase()}`
                    } 
                    className="group relative hover:text-[#14B8A6] transition-all inline-block font-medium text-sm"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4 md:space-y-6">
              <li>
                <span className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Email</span>
                <a href="mailto:Dakshahir14@gmail.com" className="text-white text-sm md:text-base font-bold hover:text-[#14B8A6] transition-colors">
                  Dakshahir14@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] md:text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">Phone</span>
                <a href="tel:+916351938789" className="text-white text-sm md:text-base font-bold hover:text-[#14B8A6] transition-colors">
                  +91 6351938789
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="bg-slate-800/30 md:bg-slate-800/50 p-6 md:p-8 rounded-[32px] border border-slate-700/50">
            <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-xs md:text-sm text-slate-400 mb-6 font-medium leading-relaxed">
              Stay updated with news from Evansh Services.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-5 text-white text-xs focus:outline-none focus:border-[#14B8A6]"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#14B8A6] text-white px-3 rounded-lg hover:bg-[#119989] transition-all">
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs font-medium">
            © {new Date().getFullYear()} Evansh Services.
          </p>
          <div className="flex gap-6 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
