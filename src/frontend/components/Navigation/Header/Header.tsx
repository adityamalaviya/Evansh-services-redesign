"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Hexagon, UserCircle, SignOut, List, X } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import { useAuth } from "@backend/contexts/AuthContext";
import { ConfirmModal } from "@frontend/components";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-lg shadow-sm h-16" 
        : "bg-white lg:bg-transparent border-b border-slate-100 lg:border-none h-16 lg:h-20"
    }`}>
      <div className={`${tokens.spacing.container} flex items-center justify-between h-full`}>
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group min-w-0 z-[60]">
          <div className="bg-slate-900 p-2 rounded-xl transition-transform group-hover:rotate-12 group-hover:scale-110 flex-shrink-0">
            <Hexagon size={24} weight="fill" className="text-white" />
          </div>
          <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors truncate ${
            scrolled ? "text-slate-900" : "text-slate-800"
          }`}>
            Evansh Services
          </span>
        </Link>

        {/* Navigation Section - Right aligned flat nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="group relative px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all rounded-full hover:bg-[#14B8A6]/10 hover:scale-110 active:scale-95 cursor-pointer">
            Home
            <span className="absolute bottom-1.5 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full"></span>
          </Link>
          <Link 
            href="/#courses" 
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all rounded-full hover:bg-[#14B8A6]/10 hover:scale-110 active:scale-95 cursor-pointer"
          >
            Courses
            <span className="absolute bottom-1.5 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full"></span>
          </Link>
          <Link href="/about" className="group relative px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all rounded-full hover:bg-[#14B8A6]/10 hover:scale-110 active:scale-95 cursor-pointer">
            About Us
            <span className="absolute bottom-1.5 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full"></span>
          </Link>
          <Link href="/works" className="group relative px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all rounded-full hover:bg-[#14B8A6]/10 hover:scale-110 active:scale-95 cursor-pointer">
            Our Work
            <span className="absolute bottom-1.5 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full"></span>
          </Link>
          <Link href="/contact" className="group relative px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all rounded-full hover:bg-[#14B8A6]/10 hover:scale-110 active:scale-95 cursor-pointer">
            Contact
            <span className="absolute bottom-1.5 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full"></span>
          </Link>
          <Link href="/services" className="group relative px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-[#14B8A6] transition-all rounded-full hover:bg-[#14B8A6]/10 hover:scale-110 active:scale-95 cursor-pointer">
            Services
            <span className="absolute bottom-1.5 left-1/2 w-0 h-0.5 bg-[#14B8A6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4 rounded-full"></span>
          </Link>

          <div className="ml-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] border border-[#14B8A6]/20 transition-all hover:scale-110 cursor-pointer group/avatar relative">
                  <UserCircle size={32} weight="fill" />
                  <div className="absolute top-full right-0 pt-2 opacity-0 group-hover/avatar:opacity-100 transition-all pointer-events-none group-hover/avatar:pointer-events-auto z-50">
                    <button 
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="bg-white shadow-2xl rounded-xl p-3 text-slate-600 border border-slate-100 flex items-center gap-2 text-xs font-bold whitespace-nowrap hover:text-red-500 hover:bg-red-50 transition-colors shadow-slate-200"
                    >
                      <SignOut size={16} weight="bold" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="group relative flex items-center gap-3 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-slate-200 overflow-hidden"
              >
                Login <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          {!isLoggedIn && (
            <Link 
              href="/login" 
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex-shrink-0"
            >
              Login
            </Link>
          )}
          <button 
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
            className="p-2.5 text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all active:scale-90 z-[60] relative"
          >
            {isMobileMenuOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden absolute left-0 right-0 bg-white border-b border-slate-100 shadow-2xl transition-all duration-500 overflow-hidden top-16 ${
        isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <nav className="flex flex-col p-6 gap-2">
          {[
            { name: "Home", href: "/#home" },
            { name: "Courses", href: "/#courses" },
            { name: "About Us", href: "/about" },
            { name: "Our Work", href: "/works" },
            { name: "Contact", href: "/contact" },
            { name: "Services", href: "/services" }
          ].map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (link.name === "Courses" && window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-4 text-sm font-bold text-slate-600 hover:text-[#14B8A6] hover:bg-teal-50/50 rounded-2xl transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          {isLoggedIn && (
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-all mt-2 border-t border-slate-50"
            >
              <SignOut size={18} weight="bold" /> Logout
            </button>
          )}
        </nav>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Logout Confirmation"
        message="Are you sure you want to log out from your account? You will need to login again to access your dashboard."
        confirmText="Yes, Logout"
        cancelText="Stay Logged In"
        type="danger"
      />
    </header>
  );
};

export default Header;

