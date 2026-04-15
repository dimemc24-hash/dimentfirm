/**
 * api/notify-deskpet.ts
 *
 * Vercel Serverless Function — handles Free Desk Pet requests.
 * - Sends notification email to Alayna via Resend
 * - Sends confirmation email to the requester
 * - Stores request in Supabase `desk_pet_requests` table for admin queue
 *
 * Supabase table schema:
 *   create table public.desk_pet_requests (
 *     id uuid primary key default gen_random_uuid(),
 *     name text not null,
 *     email text not null,
 *     mailing_address text not null,
 *     status text not null default 'pending',   -- pending | fulfilled | canceled
 *     notes text,
 *     created_at timestamptz not null default now(),
 *     fulfilled_at timestamptz
 *   );
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, mailingAddress } = req.body ?? {}

  if (!name || !email || !mailingAddress) {
    return res.status(400).json({ error: 'Name, email, and mailing address are required' })
  }

  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'AMH@dimentfirm.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@dimentfirm.com'

  // ── Write to Supabase for admin queue (if configured) ──
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey)
      await supabase.from('desk_pet_requests').insert({
        name,
        email,
        mailing_address: mailingAddress,
        status: 'pending',
      })
    } catch (err) {
      console.error('Supabase insert failed:', err)
      // Don't block the email send if DB write fails
    }
  }

  // ── Send email notifications ──
  if (!resendKey) {
    console.error('RESEND_API_KEY not configured')
    return res.status(500).json({ error: 'Email service not configured' })
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })

  try {
    // Notify Alayna
    const notifyResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Diment & Associates <${fromEmail}>`,
        to: [notifyEmail],
        reply_to: email,
        subject: `Free Desk Pet Request from ${name}`,
        html: `
          <h2>New Desk Pet Request</h2>
          <p>Someone requested a free desk pet through the Diment & Associates website.</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555; vertical-align: top;">Name:</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555; vertical-align: top;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555; vertical-align: top;">Mailing Address:</td>
              <td style="padding: 8px 0; white-space: pre-line;">${escapeHtml(mailingAddress)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555; vertical-align: top;">Requested:</td>
              <td style="padding: 8px 0;">${timestamp} (Central)</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 14px; margin-top: 20px;">
            This request has been added to the admin queue. Log in to mark it fulfilled when the pet ships.
          </p>
        `,
      }),
    })

    if (!notifyResp.ok) {
      const errText = await notifyResp.text()
      console.error('Notification email failed:', errText)
    }

    // Confirm to requester
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Diment & Associates <${fromEmail}>`,
        to: [email],
        reply_to: notifyEmail,
        subject: 'Your Free Desk Pet is on the way!',
        html: `
          <h2>Thanks, ${escapeHtml(name.split(' ')[0])}!</h2>
          <p>We got your desk pet request. Sheldon, Hariette, or one of their friends
             will be heading your way soon — keep an eye on your mailbox over the next couple of weeks.</p>
          <p>If you have any questions, just reply to this email or give us a call at
             <strong><a href="tel:2256120765">225-612-0765</a></strong>.</p>
          <p style="margin-top: 24px;">Welcome to the Diment & Associates family.</p>
          <p style="color: #888; font-size: 14px; margin-top: 24px;">
            — The Team at Diment & Associates<br>
            Baton Rouge, Louisiana
          </p>
        `,
      }),
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Desk pet notification error:', err)
    return res.status(500).json({ error: 'Failed to process request' })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
