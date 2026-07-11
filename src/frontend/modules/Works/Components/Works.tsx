// This code was created by a human and debugged by AI
"use client";
import { useEffect,useState } from "react";
type Project={id:string;title:string;category:string;description:string};
const Works=()=>{const [items,setItems]=useState<Project[]>([]);useEffect(()=>{void fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`).then((r)=>r.ok?r.json():[]).then((v:Project[])=>setItems(v)).catch(()=>setItems([]));},[]);return <section><h1>Our Works</h1>{items.map((item)=><article key={item.id}><h2>{item.title}</h2><p>{item.category}</p><p>{item.description}</p></article>)}</section>;};export default Works;
