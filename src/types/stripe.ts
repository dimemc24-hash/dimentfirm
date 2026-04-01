/**
 * stripe.ts — Stripe type definitions for the Fresh Start Academy frontend
 *
 * These types mirror the shapes returned by Supabase Edge Functions
 * and used by lib/stripe-helpers.ts, lib/stripe.ts, and billing components.
 */

// ── Plan & Pricing ───────────────────────────────────────────────────

export interface PlanConfig {
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  trialDays: number
}

// ── Checkout ─────────────────────────────────────────────────────────

export interface CreateCheckoutParams {
  priceId?: string
  trialDays?: number
  inviteCode?: string
  successUrl?: string
  cancelUrl?: string
}

export interface CreateCheckoutResponse {
  url: string
  sessionId: string
}

// ── Setup Intent (card collection during trial) ──────────────────────

export interface SetupIntentResponse {
  clientSecret: string
}

export interface ConfirmSetupParams {
  setup_intent_id: string
}

export interface ConfirmSetupResponse {
  subscriptionId: string
  status: string
}

// ── Customer Portal ──────────────────────────────────────────────────

export interface CustomerPortalParams {
  returnUrl: string
}

export interface CustomerPortalResponse {
  url: string
}

// ── Subscription Status ──────────────────────────────────────────────

export type StripeSubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'

export interface SubscriptionStatusResponse {
  status: StripeSubscriptionStatus
  trial_ends_at: string | null
  current_period_end: string | null
  cancel_at: string | null
  cancel_at_period_end: boolean
}

// ── Trial Expiry Handling ────────────────────────────────────────────

export type TrialExpiryAction = 'checkout' | 'grace' | 'suspend'

export interface TrialExpiryResponse {
  action: TrialExpiryAction
  url?: string
}

// ── Webhook Events (used by supabase/functions/stripe-webhook) ───────

export type WebhookEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'customer.subscription.trial_will_end'

export interface WebhookPayload {
  type: WebhookEventType
  data: {
    object: Record<string, unknown>
  }
}

// ── Stripe Elements (frontend types) ─────────────────────────────────

export interface StripeElementsAppearance {
  theme: 'stripe' | 'night' | 'flat'
  variables?: {
    colorPrimary?: string
    colorBackground?: string
    colorText?: string
    colorDanger?: string
    fontFamily?: string
    spacingUnit?: string
    borderRadius?: string
  }
}

export interface CheckoutFormProps {
  clientSecret: string
  onSuccess: () => void
  onCancel?: () => void
}

// ── Edge Function Request Bodies ─────────────────────────────────────

export interface CreateCheckoutBody {
  price_id?: string
  trial_days: number
  invite_code?: string
  success_url: string
  cancel_url: string
}

export interface CustomerPortalBody {
  return_url: string
}

export interface ConfirmSetupBody {
  setup_intent_id: string
}

// ── Subscription DB row (mirrors database.ts but Stripe-specific) ────

export interface SubscriptionRow {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_sub_id: string | null
  status: import('./database').SubscriptionStatus
  trial_ends_at: string
  current_period_end: string | null
  cancel_at: string | null
  grace_ends_at: string | null
  comp_reason: string | null
  created_at: string
  updated_at: string
}
