import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { config } from '../config/env';
import { logger } from './logger';
import { AppError } from '../middleware/errorHandler';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass } = config.email;

  if (!smtpUser || !smtpPass) {
    throw new AppError(
      503,
      'EMAIL_NOT_CONFIGURED',
      'Email SMTP is not configured. Please set SMTP_USER and SMTP_PASS (e.g. your Gmail and 16-character App Password) in your server environment variables.'
    );
  }

  const host = smtpHost || (smtpUser.includes('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com');
  const port = smtpPort || (smtpSecure ? 465 : 587);

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: config.nodeEnv === 'production',
    },
  });

  return transporter;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ messageId: string }> {
  const { to, subject, html, text, replyTo, from } = options;

  // 1. Primary: Native SMTP (Gmail / Custom SMTP)
  if (config.email.smtpUser && config.email.smtpPass) {
    try {
      const mailer = getTransporter();
      const sender = from || config.email.from || `"Evansh Services" <${config.email.smtpUser}>`;

      const info = await mailer.sendMail({
        from: sender,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>?/gm, ''),
        replyTo: replyTo || config.admin.email || config.email.smtpUser,
      });

      logger.info({ messageId: info.messageId, to }, 'Email sent successfully via SMTP');
      return { messageId: info.messageId };
    } catch (err: any) {
      logger.error({ err, to }, 'SMTP email sending failed');
      const msg = err?.message || 'SMTP delivery failed. Check your email credentials.';
      throw new AppError(500, 'SMTP_DELIVERY_FAILED', msg);
    }
  }

  // 2. Fallback: Resend API if configured
  if (config.resend.apiKey) {
    try {
      const payload: Record<string, any> = {
        from: from || config.resend.fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      };
      if (replyTo || config.admin.email) {
        payload.reply_to = replyTo || config.admin.email;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.resend.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorJson.message || 'Resend API error');
      }

      const data = (await res.json()) as { id: string };
      logger.info({ id: data.id, to }, 'Email sent via Resend fallback');
      return { messageId: data.id };
    } catch (err: any) {
      logger.error({ err, to }, 'Resend email fallback failed');
      throw new AppError(500, 'RESEND_DELIVERY_FAILED', err.message);
    }
  }

  // Neither configured
  throw new AppError(
    503,
    'EMAIL_NOT_CONFIGURED',
    'No email service configured. Please set SMTP_USER and SMTP_PASS (e.g. Gmail App Password) in your backend environment variables.'
  );
}
