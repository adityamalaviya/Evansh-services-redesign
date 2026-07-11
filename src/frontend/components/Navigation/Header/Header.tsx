// This code was created by a human and debugged by AI
"use client";
import Link from "next/link"; import { useAuthStore } from "@/lib/store/authStore";
const Header=()=>{const {user,clearAuth}=useAuthStore(); return <header><Link href="/">Evansh Services</Link><nav><Link href="/services">Services</Link><Link href="/courses">Courses</Link><Link href="/works">Works</Link><Link href="/contact">Contact</Link></nav>{user?<button onClick={clearAuth}>Logout</button>:<Link href="/login">Login</Link>}</header>;}; export default Header;
