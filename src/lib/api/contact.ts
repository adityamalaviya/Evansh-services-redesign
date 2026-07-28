// This code was created by a human and debugged by AI
import { apiFetch } from "./client";
export interface EnquiryInput { name: string; email: string; message: string; type?: "Contact" | "CourseAdmission" | "ServiceEnquiry"; }
export const submitEnquiry = (data: EnquiryInput) => apiFetch<{ id: string }>("/enquiries", { method: "POST", body: JSON.stringify(data) });
