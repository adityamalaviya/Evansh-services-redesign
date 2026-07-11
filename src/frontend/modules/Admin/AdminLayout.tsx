// This code was created by a human and debugged by AI
"use client";
import { useEffect } from "react";import { useRouter } from "next/navigation";import { useAuthStore } from "@/lib/store/authStore";
export default function AdminLayout({children}:{children:React.ReactNode}){const router=useRouter();const {user,isAuthenticated,clearAuth}=useAuthStore();useEffect(()=>{if(!isAuthenticated||user?.role!=="admin")router.replace("/admin/login");},[isAuthenticated,user,router]);return <section><button onClick={()=>{clearAuth();router.push("/admin/login");}}>Logout</button>{children}</section>;}
