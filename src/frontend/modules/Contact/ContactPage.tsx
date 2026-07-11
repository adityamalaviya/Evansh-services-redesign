// This code was created by a human and debugged by AI
"use client";
import { useState } from "react";
import { submitEnquiry } from "@/lib/api/contact";
export default function ContactPage() { const [message,setMessage]=useState(""); const [status,setStatus]=useState(""); async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault(); const form=new FormData(e.currentTarget); try{await submitEnquiry({name:String(form.get("name")),email:String(form.get("email")),message,type:"Contact"});setStatus("Thanks, we will be in touch.");}catch{setStatus("Unable to send your message.");}} return <main className="p-8"><h1>Contact Us</h1><form onSubmit={submit}><input name="name" required placeholder="Name"/><input name="email" type="email" required placeholder="Email"/><textarea name="message" value={message} onChange={(e)=>setMessage(e.target.value)} required/><button>Send</button></form><p>{status}</p></main>; }
