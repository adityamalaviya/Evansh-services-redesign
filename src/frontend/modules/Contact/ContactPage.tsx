"use client";

import React, { useState } from "react";
import {
  Phone,
  Envelope,
  MapPin,
  Clock,
  Headset,
  Users,
  PaperPlaneRight,
  CheckCircle,
  Warning,
} from "@phosphor-icons/react";
import { tokens } from "@frontend/styles/tokens";
import { Header, Footer } from "@frontend/components";
import { databases, DB_ID, CONTACT_COLLECTION_ID, ID } from "@backend/services/appwrite";
import { sendContactEmail } from "@backend/actions/email.actions";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (formData.phone.trim() && !/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      await databases.createDocument(DB_ID, CONTACT_COLLECTION_ID, ID.unique(), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      // Send Email Notification
      await sendContactEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "",
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      setErrorMessage(`Failed to send: ${message}`);
      setSubmitStatus("error");
    }
  };

  const inputClass = (field: keyof FormErrors): string =>
    `w-full bg-white/50 border rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-medium ${errors[field]
      ? "border-red-300 focus:ring-red-200"
      : "border-slate-100 focus:ring-[#14B8A6]/20"
    }`;

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
                  We&apos;re here to <br />
                  <span className="text-[#14B8A6]">help you!</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                  Have questions or need guidance? <br />
                  Feel free to reach out to us. We&apos;ll get back <br />
                  to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#14B8A6] group-hover:scale-110 transition-transform">
                    <Phone size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Phone</h3>
                    <p className="text-slate-500 text-sm font-medium">NA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#14B8A6] group-hover:scale-110 transition-transform">
                    <Envelope size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email</h3>
                    <p className="text-slate-500 text-sm font-medium">evanshservices24651@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-[#14B8A6] group-hover:scale-110 transition-transform">
                    <MapPin size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Address</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      1st Floor, Near SDB 73,<br />
                      Santoshi Cross Road, Ward 2A,<br />
                      Adipur, Gandhidham, Gujarat 370205
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="relative">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-teal-50 p-2.5 rounded-xl text-[#14B8A6]">
                    <Envelope size={24} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                    <p className="text-slate-500 text-sm">Fill out the form and we will get back to you.</p>
                  </div>
                </div>

                {/* Success Message */}
                {submitStatus === "success" && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle size={22} weight="fill" className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Message Sent Successfully!</p>
                      <p className="text-xs mt-0.5 opacity-80">We&apos;ll get back to you as soon as possible.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === "error" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6">
                    <Warning size={22} weight="fill" className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Failed to send message</p>
                      <p className="text-xs mt-0.5 opacity-80">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        placeholder="Name *"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass("name")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs pl-1">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs pl-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (optional)"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs pl-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass("subject")}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs pl-1">{errors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass("message")} rounded-3xl resize-none`}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-xs pl-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    id="contact-submit"
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group shadow-lg shadow-slate-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {submitStatus === "loading" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <PaperPlaneRight
                          size={20}
                          weight="bold"
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </>
                    )}
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
            <div className="relative overflow-hidden rounded-[40px] shadow-2xl shadow-slate-200 border-8 border-white transition-transform duration-500 group-hover:scale-[1.01]">
              <iframe
                src="https://maps.google.com/maps?q=1st+floor+near+SDB+73+Santoshi+Cross+Road+Ward+2A+Adipur+Gandhidham+Gujarat+370205&z=17&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.1] hover:grayscale-0 transition-all duration-700"
              ></iframe>

              {/* Static pin — tip points to geographic centre of embed (offset for Maps header ~50px) */}
              <div
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none select-none"
                style={{
                  left: "50%",
                  top: "calc(50% + 26px)",
                  animation: "pin-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 56"
                  className="w-10 h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
                  aria-label="Evansh Services location"
                >
                  {/* Pin body */}
                  <path
                    d="M20 2C11.163 2 4 9.163 4 18c0 11.25 14 34 16 34s16-22.75 16-34C36 9.163 28.837 2 20 2z"
                    fill="#EA4335"
                  />
                  {/* Gloss sheen */}
                  <ellipse cx="15" cy="13" rx="5" ry="4" fill="rgba(255,255,255,0.25)" />
                  {/* White inner circle */}
                  <circle cx="20" cy="18" r="6" fill="#fff" />
                  {/* Red dot in centre */}
                  <circle cx="20" cy="18" r="3" fill="#EA4335" />
                </svg>
                {/* Shadow beneath pin tip */}
                <div className="w-3 h-1 mx-auto rounded-full bg-black/20 blur-[2px] -mt-1" />
              </div>

              <style>{`
                @keyframes pin-drop {
                  0%   { transform: translate(-50%, calc(-100% - 30px)); opacity: 0; }
                  60%  { opacity: 1; }
                  100% { transform: translate(-50%, -100%); opacity: 1; }
                }
              `}</style>
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

