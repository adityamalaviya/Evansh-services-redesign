"use server";

import { requireServerEnv } from "@/lib/env";

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const RESEND_API_KEY = requireServerEnv("RESEND_API_KEY");
  const ADMIN_EMAIL = requireServerEnv("ADMIN_EMAIL");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Evansh Services <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `New Message: ${formData.subject}`,
        html: `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px;">
            <div style="margin-bottom: 32px;">
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 8px;">New Contact Inquiry</h1>
              <p style="color: #64748b; font-size: 16px;">You have received a new message from the Evansh Services contact form.</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 24px; rounded: 16px; margin-bottom: 32px; border-radius: 16px;">
              <div style="margin-bottom: 16px;">
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 4px;">From</p>
                <p style="margin: 0; font-weight: 600; color: #0f172a;">${formData.name}</p>
              </div>
              <div style="margin-bottom: 16px;">
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 4px;">Email Address</p>
                <p style="margin: 0; font-weight: 600; color: #0f172a;">${formData.email}</p>
              </div>
              <div style="margin-bottom: 16px;">
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 4px;">Phone</p>
                <p style="margin: 0; font-weight: 600; color: #0f172a;">${formData.phone || 'Not provided'}</p>
              </div>
              <div>
                <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 4px;">Subject</p>
                <p style="margin: 0; font-weight: 600; color: #0f172a;">${formData.subject}</p>
              </div>
            </div>
            
            <div>
              <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 8px;">Message</p>
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; font-size: 15px; color: #334155; white-space: pre-wrap;">${formData.message}</div>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8;">This email was sent from the Evansh Services Website.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    return { success: true };
  } catch (err: any) {
    console.error("Email API failed:", err);
    return { success: false, error: err.message };
  }
}
