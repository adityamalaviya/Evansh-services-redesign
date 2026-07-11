// This code was created by a human and debugged by AI
"use client";
import { useEffect,useState } from "react";import { useAuthStore } from "@/lib/store/authStore";
type Project={id:string;title:string;description:string};
export default function AdminProjectsPage(){const token=useAuthStore((s)=>s.accessToken);const [items,setItems]=useState<Project[]>([]);useEffect(()=>{void fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`,{headers:token?{Authorization:`Bearer ${token}`}:{},credentials:"include"}).then((r)=>r.ok?r.json():[]).then((v:Project[])=>setItems(v)).catch(()=>setItems([]));},[token]);return <main><h1>Projects</h1>{items.map((item)=><article key={item.id}><h2>{item.title}</h2><p>{item.description}</p></article>)}</main>;}
