"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Hexagon, List, X, SignOut, UserCircle } from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import { useAuth } from "@backend/contexts/AuthContext";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { isLoggedIn, isLoading, logout, user } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Auth button for desktop nav
  const AuthButton = () => {
    if (isLoading) return null;
    if (isLoggedIn && user) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-3 py-2 rounded-full">
            <UserCircle size={20} weight="fill" className="text-[#14B8A6]" />
            <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">
              {user.name || user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <SignOut size={15} weight="bold" />
            Logout
          </button>
        </div>
      );
    }
    return (
      <Link
        href="/login"
        className="group relative flex items-center gap-3 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-slate-200 overflow-hidden"
      >
        Login <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  };

  // Auth button for mobile nav
  const MobileAuthButton = () => {
    if (isLoading) return null;
    if (isLoggedIn && user) {
      return (
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-500 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 flex items-center gap-1"
        >
          <SignOut size={13} weight="bold" />
          Logout
        </button>
      );
    }
    return (
      <Link
        href="/login"
        className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex-shrink-0"
      >
        Login
      </Link>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm h-16" : "bg-transparent h-20"
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

        {/* Desktop Navigation */}
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
            <AuthButton />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <MobileAuthButton />
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
      <div className={`lg:hidden absolute left-0 right-0 bg-white border-b border-slate-100 shadow-2xl transition-all duration-500 overflow-hidden ${
        scrolled ? "top-16" : "top-20"
      } ${
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
