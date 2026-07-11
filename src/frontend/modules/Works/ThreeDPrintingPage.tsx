// This code was created by a human and debugged by AI
"use client";
import { useEffect,useState } from "react";
type Project={id:string;title:string;description:string;image?:string};
export default function ThreeDPrintingPage(){const [items,setItems]=useState<Project[]>([]);useEffect(()=>{void fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects?category=3D%20Printing`).then((r)=>r.ok?r.json():[]).then((v:Project[])=>setItems(v)).catch(()=>setItems([]));},[]);return <main><h1>3D Printing Projects</h1>{items.map((item)=><article key={item.id}><h2>{item.title}</h2><p>{item.description}</p></article>)}</main>;}
