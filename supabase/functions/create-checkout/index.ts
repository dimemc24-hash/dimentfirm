// supabase/functions/create-checkout/index.ts
// Creates a Stripe Customer + Subscription with trial for a new user.
// Called from the frontend after Supabase Auth signup.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const priceId = Deno.env.get('STRIPE_PRICE_ID')!
const defaultTrialDays = parseInt(Deno.env.get('DEFAULT_TRIAL_DAYS') || '14', 10)

serve(async (req: Request) => {
  // CORS preflight
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const { paymentMethodId, trialDays } = await req.json() as {
      paymentMethodId: string
      trialDays?: number
    }

    if (!paymentMethodId) {
      return new Response(JSON.stringify({ error: 'paymentMethodId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if user already has a subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingSub) {
      return new Response(JSON.stringify({ error: 'User already has a subscription' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1. Create Stripe Customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // 2. Create Subscription with trial
    const actualTrialDays = trialDays ?? defaultTrialDays
    const trialEnd = Math.floor(Date.now() / 1000) + actualTrialDays * 86400

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_end: trialEnd,
      default_payment_method: paymentMethodId,
      metadata: {
        supabase_user_id: user.id,
      },
    })

    // 3. Create subscription row in our database
    const trialEndsAt = new Date(trialEnd * 1000).toISOString()
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        stripe_customer_id: customer.id,
        stripe_sub_id: subscription.id,
        status: 'trialing',
        trial_ends_at: trialEndsAt,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })

    if (insertError) {
      console.error('Failed to insert subscription row:', insertError)
      // Don't fail the request — Stripe webhook will also create/update the row
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscriptionId: subscription.id,
        customerId: customer.id,
        status: subscription.status,
        trialEndsAt,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('create-checkout error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
