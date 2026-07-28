// This code was created by a human and debugged by AI
import { apiFetch } from "./client"; import type { AuthUser } from "@/lib/store/authStore";
export interface RegisterInput { name: string; email: string; password: string; phone?: string; }
export interface LoginInput { email: string; password: string; }
export interface AuthResponse { user: AuthUser; accessToken: string; }
export const registerUser = (data: RegisterInput) => apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const loginUser = (data: LoginInput) => apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const logoutUser = (token?: string | null) => apiFetch<void>("/auth/logout", { method: "POST" }, token);
