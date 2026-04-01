/**
 * api/webhooks/stripe.ts
 *
 * Vercel Serverless Function — Stripe webhook handler (fallback).
 *
 * This mirrors the logic in supabase/functions/stripe-webhook/index.ts
 * but runs on Vercel's Node.js runtime. Use this route when:
 * - Supabase Edge Functions are unavailable / cold-starting
 * - You prefer a single deployment platform (Vercel) for all infra
 * - You want a redundant webhook endpoint
 *
 * Stripe Dashboard → Webhooks → add endpoint:
 *   https://<your-domain>/api/webhooks/stripe
 *
 * Required env vars (set in Vercel Dashboard → Settings → Environment Variables):
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET_VERCEL   (separate from Edge Function secret)
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── Config ───────────────────────────────────────────────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_VERCEL!
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/** Grace period after payment failure (7 days) */
const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000

// Vercel must receive the raw body to verify Stripe signatures.
// Disable the built-in body parser.
export const config = {
  api: {
    bodyParser: false,
  },
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Read the raw request body as a Buffer (needed for signature verification). */
function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// ── Handler ──────────────────────────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 1. Read raw body & verify signature
    const rawBody = await readRawBody(req)
    const signature = req.headers['stripe-signature']

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        rawBody.toString('utf8'),
        signature,
        webhookSecret,
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return res.status(400).json({ error: 'Invalid signature' })
    }

    // 2. Supabase admin client (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 3. Route by event type
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(supabase, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabase, subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(supabase, invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabase, invoice)
        break
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(
          `Trial ending soon for customer ${subscription.customer}`,
          `(subscription: ${subscription.id})`,
        )
        // TODO: send email notification via Resend / Supabase Auth
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── Event Handlers ───────────────────────────────────────────────────

async function handleSubscriptionChange(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
) {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id

  const userId = subscription.metadata?.supabase_user_id

  // Map Stripe status → our DB status
  const statusMap: Record<string, string> = {
    trialing: 'trialing',
    active: 'active',
    past_due: 'past_due',
    canceled: 'canceled',
    incomplete: 'past_due',
    incomplete_expired: 'canceled',
    unpaid: 'suspended',
    paused: 'suspended',
  }

  const status = statusMap[subscription.status] || 'active'

  const updateData: Record<string, unknown> = {
    stripe_customer_id: customerId,
    stripe_sub_id: subscription.id,
    status,
    current_period_end: new Date(
      subscription.current_period_end * 1000,
    ).toISOString(),
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString(),
  }

  if (subscription.trial_end) {
    updateData.trial_ends_at = new Date(
      subscription.trial_end * 1000,
    ).toISOString()
  }

  if (userId) {
    const { error } = await supabase
      .from('subscriptions')
      .upsert({ user_id: userId, ...updateData }, { onConflict: 'user_id' })

    if (error) {
      console.error('Failed to upsert subscription by user_id:', error)
    }
  } else {
    const { error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('stripe_sub_id', subscription.id)

    if (error) {
      console.error('Failed to update subscription by stripe_sub_id:', error)
    }
  }

  console.log(`Subscription ${subscription.id} updated: status=${status}`)
}

async function handleSubscriptionDeleted(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription,
) {
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_sub_id', subscription.id)

  if (error) {
    console.error('Failed to mark subscription as canceled:', error)
  }

  console.log(`Subscription ${subscription.id} canceled`)
}

async function handlePaymentSucceeded(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice,
) {
  const subId =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id

  if (!subId) return

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      grace_ends_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_sub_id', subId)

  if (error) {
    console.error('Failed to update subscription on payment success:', error)
  }

  console.log(`Payment succeeded for subscription ${subId}`)
}

async function handlePaymentFailed(
  supabase: SupabaseClient,
  invoice: Stripe.Invoice,
) {
  const subId =
    typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id

  if (!subId) return

  const graceEndsAt = new Date(Date.now() + GRACE_PERIOD_MS).toISOString()

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      grace_ends_at: graceEndsAt,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_sub_id', subId)

  if (error) {
    console.error('Failed to update subscription on payment failure:', error)
  }

  console.log(
    `Payment failed for subscription ${subId}, grace until ${graceEndsAt}`,
  )
  // TODO: send "payment failed" email notification
}
