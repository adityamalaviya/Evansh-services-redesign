import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';
import { config } from '../../config/env';
import { logger } from '../../lib/logger';
import { escapeHtml } from '../../lib/html';

const router = Router();

const replySchema = z.object({
  to: z.string().email('Invalid recipient email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message is too long'),
  originalMessage: z.string().optional(),
  recipientName: z.string().optional(),
});

// GET /api/admin/contact — list contact messages
router.get('/', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.contactMessages, queries);
    res.json({
      total: result.total,
      messages: result.documents,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/contact/reply — reply to a contact message via email
router.post('/reply', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = replySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid reply data.',
          fields: parsed.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const { to, subject, message, originalMessage, recipientName } = parsed.data;

    await sendAdminReplyEmail({
      to,
      subject,
      message,
      originalMessage: originalMessage || '',
      recipientName: recipientName || '',
    });

    res.json({ success: true, message: 'Reply sent successfully.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/contact/:id — delete a contact message
router.delete('/:id', adminLimiter, requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await databases.deleteDocument(DB_ID, COLLECTIONS.contactMessages, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

async function sendAdminReplyEmail(data: {
  to: string;
  subject: string;
  message: string;
  originalMessage: string;
  recipientName: string;
}) {
  if (!config.resend.apiKey) {
    logger.warn('RESEND_API_KEY not configured — skipping email dispatch');
    return;
  }

  const safeName = escapeHtml(data.recipientName || 'there');
  const safeMessage = escapeHtml(data.message);
  const safeOriginal = escapeHtml(data.originalMessage);

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
        <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700;">Evansh Services</h2>
        <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Response to your inquiry</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Hi ${safeName},</p>
      
      <div style="font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; margin-bottom: 24px;">${safeMessage}</div>

      <p style="font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; color: #475569;">
        Best regards,<br/>
        <strong>Evansh Services Support Team</strong>
      </p>

      ${
        safeOriginal
          ? `
        <div style="margin-top: 32px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #14b8a6; border-radius: 8px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Original Message</p>
          <div style="font-size: 13px; line-height: 1.5; color: #475569; white-space: pre-wrap;">${safeOriginal}</div>
        </div>
      `
          : ''
      }
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.resend.apiKey}`,
    },
    body: JSON.stringify({
      from: 'Evansh Services <onboarding@resend.dev>',
      to: [data.to],
      subject: data.subject,
      html: htmlContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error({ status: response.status, errorText }, 'Failed to send admin reply email via Resend');
    throw new Error('Failed to send email via delivery service.');
  }
}

export default router;

