/**
 * api/notify-registration.ts
 *
 * Vercel Serverless Function — sends registration notification to Alayna
 * via Resend when a new Academy user signs up.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, chapterPath, name } = req.body ?? {}

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || 'AMH@dimentfirm.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@dimentfirm.com'

  if (!resendKey) {
    console.error('RESEND_API_KEY not configured')
    return res.status(500).json({ error: 'Email service not configured' })
  }

  const pathLabel = chapterPath === 'ch13' ? 'Steady Path (Chapter 13)' : 'Quick Sprint Path (Chapter 7)'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Fresh Start Academy <${fromEmail}>`,
        to: [notifyEmail],
        subject: `New Academy Registration: ${email}`,
        html: `
          <h2>New Fresh Start Academy Registration</h2>
          <p>A new user has registered for the Fresh Start Academy beta.</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            ${name ? `<tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555;">Path:</td>
              <td style="padding: 8px 0;">${pathLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; font-weight: bold; color: #555;">Time:</td>
              <td style="padding: 8px 0;">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 14px;">
            Please verify this is an active client within the last 6 months.
            If not, you can deactivate their account in the Academy admin panel.
          </p>
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Resend error:', errorData)
      return res.status(500).json({ error: 'Failed to send notification' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Notification error:', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
