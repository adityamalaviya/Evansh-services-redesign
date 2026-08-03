import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { databases, DB_ID, COLLECTIONS, ID, Query } from '../../lib/appwrite';
import { publicLimiter } from '../../middleware/rateLimiter';
import { config } from '../../config/env';
import { logger } from '../../lib/logger';
import { callPipeline } from '../../lib/fastapi';

const router = Router();
const enrollmentSchema = z.object({
  id: z.string().min(1),
  full_name: z.string().min(2).max(150),
  email: z.string().email(),
  phone_number: z.string().regex(/^[6-9]\d{9}$/),
  age: z.coerce.number().int().min(5).max(100),
  city: z.string().min(2).max(100),
  qualification: z.string().min(2).max(150),
  prior_experience: z.enum(['beginner', 'intermediate', 'advanced']),
  additional_message: z.string().max(2000).optional().default(''),
});

router.post('/', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = enrollmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Please check the enrollment fields.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }
    const data = parsed.data;

    const pipelineResult = await callPipeline<{ valid: boolean; errors?: Record<string, string[]> }>('/pipeline/validate/enrollment', {
      body: data,
      requestId: req.requestId,
    });
    if (!pipelineResult.valid) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Please check the enrollment fields.', fields: pipelineResult.errors } });
      return;
    }

    const duplicate = await databases.listDocuments(DB_ID, COLLECTIONS.enrollments, [
      Query.equal('id', data.id), Query.equal('email', data.email.toLowerCase()), Query.limit(1),
    ]);
    if (duplicate.total > 0) {
      res.status(409).json({ error: { code: 'ALREADY_ENROLLED', message: 'This email has already enrolled for this course.' } });
      return;
    }
    await databases.createDocument(DB_ID, COLLECTIONS.enrollments, ID.unique(), {
      id: data.id,
      full_name: data.full_name,
      email: data.email.toLowerCase(),
      phone_number: data.phone_number,
      age: data.age,
      city: data.city,
      Qualification: data.qualification,
      prior_experience: data.prior_experience,
      additional_message: data.additional_message,
      status: 'pending',
    });
    sendEnrollmentEmail(data).catch((error) => logger.error({ error }, 'Enrollment email failed'));
    res.status(201).json({ success: true, message: 'Enrollment submitted successfully.' });
  } catch (error) { next(error); }
});

async function sendEnrollmentEmail(data: z.infer<typeof enrollmentSchema>) {
  if (!config.resend.apiKey) return;
  const safe = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.resend.apiKey}` },
    body: JSON.stringify({
      from: 'Evansh Services <onboarding@resend.dev>', to: [data.email], subject: 'Enrollment received - Evansh Services',
      html: `<p>Hi ${safe(data.full_name)},</p><p>We received your enrollment request. Our team will contact you within 24 hours.</p><p>Phone: ${safe(data.phone_number)}<br>City: ${safe(data.city)}<br>Qualification: ${safe(data.qualification)}</p><p>Thank you,<br>Evansh Services</p>`,
    }),
  });
  if (!response.ok) throw new Error(await response.text());
}

export default router;
