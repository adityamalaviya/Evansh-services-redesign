"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/store/authStore";

const schema = z
  .object({
    name: z.string().min(2, "Min 2 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Need one uppercase")
      .regex(/[0-9]/, "Need one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: RegisterFormValues) {
    setSubmitError(null);

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(response.user, response.accessToken);
      router.push("/portal/dashboard");
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-login-card-bg login-card-shadow border border-border-light">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-text-dark tracking-tight">Create an Account</h2>
        <p className="text-sm text-text-muted mt-2">Get started with Evanish Services</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {submitError && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 text-sm font-medium animate-fade-in-up">
            <span>⚠️</span>
            <p role="alert">{submitError}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold text-text-dark">
            Name
          </label>
          <input
            id="name"
            placeholder="John Doe"
            className="login-input px-4 py-3 rounded-xl border border-border-light bg-white text-text-dark text-sm placeholder:text-text-muted"
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="text-xs font-medium text-red-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-text-dark">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="login-input px-4 py-3 rounded-xl border border-border-light bg-white text-text-dark text-sm placeholder:text-text-muted"
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="text-xs font-medium text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-text-dark">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="login-input px-4 py-3 rounded-xl border border-border-light bg-white text-text-dark text-sm placeholder:text-text-muted"
            {...register("password")}
          />
          {errors.password && (
            <p role="alert" className="text-xs font-medium text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-text-dark">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="login-input px-4 py-3 rounded-xl border border-border-light bg-white text-text-dark text-sm placeholder:text-text-muted"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p role="alert" className="text-xs font-medium text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </div>
  );
}
