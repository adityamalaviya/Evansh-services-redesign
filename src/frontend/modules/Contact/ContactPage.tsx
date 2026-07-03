"use client";

import React from "react";
import { 
  Phone, 
  Envelope, 
  MapPin, 
  Clock, 
  Headset, 
  Users,
  PaperPlaneRight,
  ArrowRight
} from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import Header from "@frontend/components/Navigation/Header/Header";
import Footer from "@frontend/components/Navigation/Footer/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="pt-32 pb-20">
        <div className={tokens.spacing.container}>
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  We're here to <br />
                  <span className="text-[#14B8A6]">help you!</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                  Have questions or need guidance? <br />
                  Feel free to reach out to us. We'll get back <br />
                  to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                {/* Contact Item */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#14B8A6] group-hover:scale-110 transition-transform">
                    <Phone size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Phone</h3>
                    <p className="text-slate-500 text-sm font-medium">+91 6351938789</p>
                  </div>
                </div>

                {/* Contact Item */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#14B8A6] group-hover:scale-110 transition-transform">
                    <Envelope size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email</h3>
                    <p className="text-slate-500 text-sm font-medium">Dakshahir14@gmail.com</p>
                  </div>
                </div>

                {/* Contact Item */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#14B8A6] group-hover:scale-110 transition-transform">
                    <MapPin size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Address</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      SDB - 82, Ward 2A, 1st Floor,<br />
                      Above Yuva Collection,<br />
                      Adipur, Gandhidham, Gujarat 370205
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="relative">
              {/* Glassmorphic Card */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-teal-50 p-2.5 rounded-xl text-[#14B8A6]">
                    <Envelope size={24} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                    <p className="text-slate-500 text-sm">Fill out the form below and we will get back to you.</p>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Name" 
                        className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <textarea 
                      placeholder="Message" 
                      rows={4}
                      className="w-full bg-white/50 border border-slate-100 rounded-3xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group shadow-lg shadow-slate-200"
                  >
                    Send Message <PaperPlaneRight size={20} weight="bold" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>

              {/* Decorative background blur */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#14B8A6]/5 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#14B8A6]/5 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-24 relative group">
            <div className="overflow-hidden rounded-[40px] shadow-2xl shadow-slate-200 border-8 border-white transition-transform duration-500 group-hover:scale-[1.01]">
              <iframe 
                src="https://www.google.com/maps?q=SDB+-+82,+Ward+2A,1st+Floor,+Above+Yuva+Collection,+Adipur,Gandhidham,+Gujarat+370205&output=embed" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.1] hover:grayscale-0 transition-all duration-700"
              ></iframe>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="flex flex-col items-center">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-2xl border border-slate-100 flex items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900 whitespace-nowrap text-xs">Evansh Classes</span>
                  </div>
                  <div className="relative">
                    <MapPin size={48} weight="fill" className="text-red-500 drop-shadow-lg" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-2.5 h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards Section */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
            <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[32px] text-center space-y-4 hover:shadow-xl hover:shadow-slate-200 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#14B8A6] mx-auto">
                <Clock size={24} weight="bold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg">Working Hours</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Monday - Saturday <br />
                  9:00 AM - 8:00 PM
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[32px] text-center space-y-4 hover:shadow-xl hover:shadow-slate-200 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#14B8A6] mx-auto">
                <Headset size={24} weight="bold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg">Quick Support</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We try our best to <br />
                  reply within 24 hours.
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[32px] text-center space-y-4 hover:shadow-xl hover:shadow-slate-200 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#14B8A6] mx-auto">
                <Users size={24} weight="bold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg">Join Our Class</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Unlock your <br />
                  potential <br />
                  with guidance.
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center pt-8">
              <img 
                src="https://img.freepik.com/free-vector/flat-style-man-working-laptop_23-2148118023.jpg" 
                alt="Contact Support Illustration" 
                className="w-full max-w-[200px] h-auto rounded-3xl mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
