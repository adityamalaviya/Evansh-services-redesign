import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { databases, DB_ID, COLLECTIONS, ID } from '../../lib/appwrite';
import { contactLimiter } from '../../middleware/rateLimiter';
import { config } from '../../config/env';
import { logger } from '../../lib/logger';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional().default(''),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// POST /api/contact — submit contact form
router.post('/', contactLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid form data.',
          fields: parsed.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const { name, email, phone, subject, message } = parsed.data;

    // Save to Appwrite (server-side — API key used, not client session)
    await databases.createDocument(DB_ID, COLLECTIONS.contactMessages, ID.unique(), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send email via Resend (fire-and-forget — don't block response)
    sendContactEmail({ name, email, phone: phone || '', subject, message }).catch((err) => {
      logger.error({ requestId: req.requestId, err }, 'Failed to send contact email');
    });

    res.status(201).json({ success: true, message: 'Message received. We will get back to you shortly.' });
  } catch (err) {
    next(err);
  }
});

async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  if (!config.resend.apiKey) {
    logger.warn('RESEND_API_KEY not configured — skipping email notification');
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.resend.apiKey}`,
    },
    body: JSON.stringify({
      from: 'Evansh Services <onboarding@resend.dev>',
      to: [config.admin.email],
      subject: `New Contact: ${data.subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:16px;">
          <h2 style="color:#0f172a">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0;">
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;background:#f8fafc;padding:16px;border-radius:8px;">${data.message}</p>
        </div>
      `,
    }),
  });
}

export default router;
