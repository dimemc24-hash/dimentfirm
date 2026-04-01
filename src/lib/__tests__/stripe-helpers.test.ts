import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock supabase (vi.hoisted to avoid TDZ issues) ──────────────────────────

const { mockInvoke, mockSupabase } = vi.hoisted(() => {
  const mockInvoke = vi.fn()
  const mockSupabase = { functions: { invoke: mockInvoke } }
  return { mockInvoke, mockSupabase }
})

vi.mock('../supabase', () => ({ supabase: mockSupabase }))

import {
  createSetupIntent,
  createCheckoutSession,
  getCustomerPortalUrl,
  getSubscriptionStatus,
  handleTrialExpiry,
  confirmSetupAndSubscribe,
} from '../stripe-helpers'

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
})

// ── createSetupIntent ────────────────────────────────────────────────────────

describe('createSetupIntent', () => {
  it('returns clientSecret on success', async () => {
    mockInvoke.mockResolvedValue({
      data: { clientSecret: 'seti_secret_123' },
      error: null,
    })

    const result = await createSetupIntent()
    expect(result).toEqual({ clientSecret: 'seti_secret_123' })
    expect(mockInvoke).toHaveBeenCalledWith('stripe-create-setup-intent')
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: new Error('Network error'),
    })

    const result = await createSetupIntent()
    expect(result).toBeNull()
  })

  it('returns null when invoke throws', async () => {
    mockInvoke.mockRejectedValue(new Error('Connection refused'))

    const result = await createSetupIntent()
    expect(result).toBeNull()
  })
})

// ── createCheckoutSession ────────────────────────────────────────────────────

describe('createCheckoutSession', () => {
  it('returns checkout URL on success', async () => {
    mockInvoke.mockResolvedValue({
      data: { url: 'https://checkout.stripe.com/session_abc' },
      error: null,
    })

    const result = await createCheckoutSession({ priceId: 'price_123' })
    expect(result).toEqual({ url: 'https://checkout.stripe.com/session_abc' })
  })

  it('passes trial days and invite code in body', async () => {
    mockInvoke.mockResolvedValue({ data: { url: 'https://...' }, error: null })

    await createCheckoutSession({
      priceId: 'price_abc',
      trialDays: 30,
      inviteCode: 'INV-001',
    })

    expect(mockInvoke).toHaveBeenCalledWith('stripe-create-checkout', {
      body: expect.objectContaining({
        price_id: 'price_abc',
        trial_days: 30,
        invite_code: 'INV-001',
      }),
    })
  })

  it('defaults trialDays to 14 when not provided', async () => {
    mockInvoke.mockResolvedValue({ data: { url: 'https://...' }, error: null })

    await createCheckoutSession({})

    expect(mockInvoke).toHaveBeenCalledWith('stripe-create-checkout', {
      body: expect.objectContaining({ trial_days: 14 }),
    })
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('Forbidden') })

    const result = await createCheckoutSession({})
    expect(result).toBeNull()
  })
})

// ── getCustomerPortalUrl ─────────────────────────────────────────────────────

describe('getCustomerPortalUrl', () => {
  it('returns portal URL on success', async () => {
    mockInvoke.mockResolvedValue({
      data: { url: 'https://billing.stripe.com/portal_abc' },
      error: null,
    })

    const result = await getCustomerPortalUrl()
    expect(result).toBe('https://billing.stripe.com/portal_abc')
  })

  it('passes return_url in body', async () => {
    mockInvoke.mockResolvedValue({ data: { url: 'https://...' }, error: null })

    await getCustomerPortalUrl()

    expect(mockInvoke).toHaveBeenCalledWith('stripe-customer-portal', {
      body: expect.objectContaining({ return_url: expect.stringContaining('/billing') }),
    })
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('No customer') })

    const result = await getCustomerPortalUrl()
    expect(result).toBeNull()
  })
})

// ── getSubscriptionStatus ────────────────────────────────────────────────────

describe('getSubscriptionStatus', () => {
  it('returns subscription details on success', async () => {
    const subData = {
      status: 'active',
      trial_ends_at: '2026-03-15T00:00:00Z',
      current_period_end: '2026-04-15T00:00:00Z',
      cancel_at: null,
    }
    mockInvoke.mockResolvedValue({ data: subData, error: null })

    const result = await getSubscriptionStatus()
    expect(result).toEqual(subData)
    expect(mockInvoke).toHaveBeenCalledWith('stripe-subscription-status')
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('Not found') })

    const result = await getSubscriptionStatus()
    expect(result).toBeNull()
  })
})

// ── handleTrialExpiry ────────────────────────────────────────────────────────

describe('handleTrialExpiry', () => {
  it('returns action and URL on success', async () => {
    mockInvoke.mockResolvedValue({
      data: { action: 'checkout', url: 'https://checkout.stripe.com/session_xyz' },
      error: null,
    })

    const result = await handleTrialExpiry()
    expect(result).toEqual({ action: 'checkout', url: 'https://checkout.stripe.com/session_xyz' })
  })

  it('returns suspend action on error', async () => {
    mockInvoke.mockRejectedValue(new Error('Server error'))

    const result = await handleTrialExpiry()
    expect(result).toEqual({ action: 'suspend' })
  })
})

// ── confirmSetupAndSubscribe ─────────────────────────────────────────────────

describe('confirmSetupAndSubscribe', () => {
  it('returns subscription info on success', async () => {
    mockInvoke.mockResolvedValue({
      data: { subscriptionId: 'sub_123', status: 'active' },
      error: null,
    })

    const result = await confirmSetupAndSubscribe('seti_abc')
    expect(result).toEqual({ subscriptionId: 'sub_123', status: 'active' })
  })

  it('passes setup_intent_id in body', async () => {
    mockInvoke.mockResolvedValue({
      data: { subscriptionId: 'sub_123', status: 'active' },
      error: null,
    })

    await confirmSetupAndSubscribe('seti_abc')

    expect(mockInvoke).toHaveBeenCalledWith('stripe-confirm-setup', {
      body: { setup_intent_id: 'seti_abc' },
    })
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('Invalid intent') })

    const result = await confirmSetupAndSubscribe('seti_bad')
    expect(result).toBeNull()
  })
})
