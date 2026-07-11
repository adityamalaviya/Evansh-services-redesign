// This code was created by a human and debugged by AI
"use client";
import { useRouter } from "next/navigation"; import { loginUser } from "@/lib/api/auth"; import { useAuthStore } from "@/lib/store/authStore";
export default function AuthLoginPage(){const router=useRouter();const setAuth=useAuthStore((s)=>s.setAuth);async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const r=await loginUser({email:String(f.get("email")),password:String(f.get("password"))});setAuth(r.user,r.accessToken);router.push("/portal/dashboard");}return <form onSubmit={submit}><input name="email" type="email" required/><input name="password" type="password" required/><button>Login</button></form>;}
