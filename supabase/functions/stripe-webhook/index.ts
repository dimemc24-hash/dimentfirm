// supabase/functions/stripe-webhook/index.ts
// Handles all incoming Stripe webhook events.
// Events: subscription lifecycle, invoice payment, trial ending.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Grace period after payment failure (7 days)
const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000

serve(async (req: Request) => {
  // Only POST allowed
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Verify Stripe signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Process event
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
          `(subscription: ${subscription.id})`
        )
        // In production: send email notification via Supabase Auth / Resend / etc.
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleSubscriptionChange(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id
  const userId = subscription.metadata?.supabase_user_id

  // Map Stripe status to our status
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
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString(),
  }

  if (subscription.trial_end) {
    updateData.trial_ends_at = new Date(subscription.trial_end * 1000).toISOString()
  }

  if (userId) {
    // Try upsert by user_id
    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        { user_id: userId, ...updateData },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('Failed to upsert subscription by user_id:', error)
    }
  } else {
    // Fallback: update by stripe_sub_id
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
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
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
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  const subId = typeof invoice.subscription === 'string'
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
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  const subId = typeof invoice.subscription === 'string'
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

  console.log(`Payment failed for subscription ${subId}, grace until ${graceEndsAt}`)
  // In production: send "payment failed" email notification
}
