/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Envelope,
  Phone,
  MapPin,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Spinner,
} from "@phosphor-icons/react";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    color: string;
  } | null;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  qualification: string;
  experience: string;
  message: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  qualification: "",
  experience: "beginner",
  message: "",
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData(initialFormData);
      setSubmitStatus("idle");
      setErrors({});
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !course) return null;

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email address is required";
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim()))
      newErrors.phone = "A valid 10-digit phone number is required";
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) < 5)
      newErrors.age = "A valid age is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitStatus("loading");

    // Simulate API call (replace with actual Appwrite/email action)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  const colorHex = course.color;

  const inputBase =
    "w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-800 font-semibold text-sm placeholder:text-slate-300 placeholder:font-medium outline-none transition-all duration-200";
  const inputStyle = `${inputBase} border-slate-100 focus:border-[${colorHex}]`;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-[32px] shadow-[0_40px_140px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
        style={{ border: `2px solid ${colorHex}20` }}
      >
        {/* Colored top bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: colorHex }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 shrink-0">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: colorHex }}
            >
              {course.title === "Start Your Journey" ? "Project Inquiry" : "Course Enrollment"}
            </p>
            <h2
              id="enrollment-modal-title"
              className="text-xl md:text-2xl font-black text-slate-900"
            >
              {course.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-90"
            aria-label="Close enrollment form"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 md:px-8 pb-8">
          {/* Success State */}
          {submitStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colorHex}15` }}
              >
                <CheckCircle size={48} weight="fill" style={{ color: colorHex }} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {course.title === "Start Your Journey" ? "Inquiry Received! 🎉" : "Enrollment Received! 🎉"}
                </h3>
                <p className="text-slate-500 font-medium text-sm max-w-sm">
                  Thank you, <strong className="text-slate-700">{formData.fullName}</strong>!
                  We'll contact you at <strong className="text-slate-700">{formData.email}</strong>{" "}
                  within 24 hours to {course.title === "Start Your Journey" ? "discuss details for" : "confirm your enrollment in"}{" "}
                  <strong style={{ color: colorHex }}>{course.title}</strong>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ backgroundColor: colorHex }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-slate-400 font-semibold mb-2">
                All <span className="text-red-400">*</span> fields are required
              </p>

              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      weight="bold"
                    />
                    <input
                      id="enrollment-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`${inputBase} pl-9 border-slate-100`}
                      style={{
                        borderColor: errors.fullName
                          ? "#f87171"
                          : formData.fullName
                          ? colorHex
                          : undefined,
                      }}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-400 text-xs font-semibold mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Envelope
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      weight="bold"
                    />
                    <input
                      id="enrollment-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`${inputBase} pl-9 border-slate-100`}
                      style={{
                        borderColor: errors.email
                          ? "#f87171"
                          : formData.email
                          ? colorHex
                          : undefined,
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs font-semibold mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone + Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      weight="bold"
                    />
                    <input
                      id="enrollment-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`${inputBase} pl-9 border-slate-100`}
                      style={{
                        borderColor: errors.phone
                          ? "#f87171"
                          : formData.phone
                          ? colorHex
                          : undefined,
                      }}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-xs font-semibold mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="enrollment-age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    min={5}
                    max={80}
                    className={`${inputBase} border-slate-100`}
                    style={{
                      borderColor: errors.age
                        ? "#f87171"
                        : formData.age
                        ? colorHex
                        : undefined,
                    }}
                  />
                  {errors.age && (
                    <p className="text-red-400 text-xs font-semibold mt-1">{errors.age}</p>
                  )}
                </div>
              </div>

              {/* Row 3: City + Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      weight="bold"
                    />
                    <input
                      id="enrollment-city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={`${inputBase} pl-9 border-slate-100`}
                      style={{
                        borderColor: errors.city
                          ? "#f87171"
                          : formData.city
                          ? colorHex
                          : undefined,
                      }}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-red-400 text-xs font-semibold mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Qualification <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                      weight="bold"
                    />
                    <input
                      id="enrollment-qualification"
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="e.g. 10th, 12th, Graduate"
                      className={`${inputBase} pl-9 border-slate-100`}
                      style={{
                        borderColor: errors.qualification
                          ? "#f87171"
                          : formData.qualification
                          ? colorHex
                          : undefined,
                      }}
                    />
                  </div>
                  {errors.qualification && (
                    <p className="text-red-400 text-xs font-semibold mt-1">
                      {errors.qualification}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Prior Experience
                </label>
                <select
                  id="enrollment-experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`${inputBase} border-slate-100 cursor-pointer`}
                  style={{ borderColor: colorHex + "40" }}
                >
                  <option value="beginner">Beginner – No prior experience</option>
                  <option value="basic">Basic – Know some basics</option>
                  <option value="intermediate">Intermediate – Have some knowledge</option>
                  <option value="advanced">Advanced – Looking to upskill</option>
                </select>
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Additional Message <span className="text-slate-300">(optional)</span>
                </label>
                <textarea
                  id="enrollment-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Anything else you'd like to share? Batch timing preference, etc."
                  className={`${inputBase} border-slate-100 resize-none`}
                  style={{ borderColor: formData.message ? colorHex + "60" : undefined }}
                />
              </div>

              {/* Error Banner */}
              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
                  Something went wrong. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                style={{ backgroundColor: colorHex, boxShadow: `0 8px 32px ${colorHex}40` }}
              >
                {submitStatus === "loading" ? (
                  <>
                    <Spinner size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm Enrollment
                    <ArrowRight size={20} weight="bold" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 font-medium">
                We'll contact you within 24 hours after form submission.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EnrollmentModal;
