// This code was created by a human and debugged by AI
"use client";
import { useAuthStore } from "@/lib/store/authStore";
export default function AdminDashboard(){const user=useAuthStore((s)=>s.user);return <main><h1>Admin Dashboard</h1><p>Welcome, {user?.name ?? "Administrator"}.</p></main>;}
