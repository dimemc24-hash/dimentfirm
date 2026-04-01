import { supabase } from './supabase'

/**
 * Create a Stripe Setup Intent for collecting card details during trial signup.
 * Calls a Supabase Edge Function that creates the SetupIntent server-side.
 */
export async function createSetupIntent(): Promise<{ clientSecret: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-create-setup-intent')
    if (error) throw error
    return data as { clientSecret: string }
  } catch (err) {
    console.error('Failed to create setup intent:', err)
    return null
  }
}

/**
 * Create a Stripe Checkout Session for starting or resuming a subscription.
 * Redirects to Stripe-hosted checkout page.
 */
export async function createCheckoutSession(params: {
  priceId?: string
  trialDays?: number
  inviteCode?: string
}): Promise<{ url: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-create-checkout', {
      body: {
        price_id: params.priceId,
        trial_days: params.trialDays ?? 14,
        invite_code: params.inviteCode,
        success_url: `${window.location.origin}/dashboard?checkout=success`,
        cancel_url: `${window.location.origin}/register?checkout=canceled`,
      },
    })
    if (error) throw error
    return data as { url: string }
  } catch (err) {
    console.error('Failed to create checkout session:', err)
    return null
  }
}

/**
 * Get the Stripe Customer Portal URL for managing subscription.
 */
export async function getCustomerPortalUrl(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-customer-portal', {
      body: {
        return_url: `${window.location.origin}/billing`,
      },
    })
    if (error) throw error
    return (data as { url: string }).url
  } catch (err) {
    console.error('Failed to get customer portal URL:', err)
    return null
  }
}

/**
 * Get detailed subscription status from the server.
 * Useful for checking real-time status when the local cache might be stale.
 */
export async function getSubscriptionStatus(): Promise<{
  status: string
  trial_ends_at: string | null
  current_period_end: string | null
  cancel_at: string | null
} | null> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-subscription-status')
    if (error) throw error
    return data as {
      status: string
      trial_ends_at: string | null
      current_period_end: string | null
      cancel_at: string | null
    }
  } catch (err) {
    console.error('Failed to get subscription status:', err)
    return null
  }
}

/**
 * Handle trial expiry — call this when trial has 0 days left.
 * Redirects to checkout or shows upgrade prompt.
 */
export async function handleTrialExpiry(): Promise<{ action: 'checkout' | 'grace' | 'suspend'; url?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-handle-trial-expiry')
    if (error) throw error
    return data as { action: 'checkout' | 'grace' | 'suspend'; url?: string }
  } catch (err) {
    console.error('Failed to handle trial expiry:', err)
    return { action: 'suspend' }
  }
}

/**
 * Confirm a SetupIntent after card collection.
 * The server attaches the payment method and creates the subscription.
 */
export async function confirmSetupAndSubscribe(setupIntentId: string): Promise<{
  subscriptionId: string
  status: string
} | null> {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-confirm-setup', {
      body: { setup_intent_id: setupIntentId },
    })
    if (error) throw error
    return data as { subscriptionId: string; status: string }
  } catch (err) {
    console.error('Failed to confirm setup:', err)
    return null
  }
}
