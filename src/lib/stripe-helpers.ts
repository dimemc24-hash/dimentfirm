import { supabase } from './supabase'

/**
 * Start a subscription: creates a Stripe Customer + Subscription (with trial)
 * from a PaymentMethod already created client-side via stripe.createPaymentMethod().
 * Calls the create-checkout Edge Function.
 */
export async function startSubscription(params: {
  paymentMethodId: string
  trialDays?: number
}): Promise<{
  success: boolean
  subscriptionId: string
  customerId: string
  status: string
  trialEndsAt: string
} | null> {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        paymentMethodId: params.paymentMethodId,
        trialDays: params.trialDays,
      },
    })
    if (error) throw error
    return data as {
      success: boolean
      subscriptionId: string
      customerId: string
      status: string
      trialEndsAt: string
    }
  } catch (err) {
    console.error('Failed to start subscription:', err)
    return null
  }
}

/**
 * Get the Stripe Customer Portal URL for managing subscription.
 * Calls the create-portal-session Edge Function.
 */
export async function getCustomerPortalUrl(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        returnUrl: `${window.location.origin}/academy/billing`,
      },
    })
    if (error) throw error
    return (data as { url: string }).url
  } catch (err) {
    console.error('Failed to get customer portal URL:', err)
    return null
  }
}
