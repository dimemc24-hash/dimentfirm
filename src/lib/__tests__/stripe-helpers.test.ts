import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock supabase (vi.hoisted to avoid TDZ issues) ──────────────────────────

const { mockInvoke, mockSupabase } = vi.hoisted(() => {
  const mockInvoke = vi.fn()
  const mockSupabase = { functions: { invoke: mockInvoke } }
  return { mockInvoke, mockSupabase }
})

vi.mock('../supabase', () => ({ supabase: mockSupabase }))

import { startSubscription, getCustomerPortalUrl } from '../stripe-helpers'

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
})

// ── startSubscription ────────────────────────────────────────────────────────

describe('startSubscription', () => {
  it('returns subscription details on success', async () => {
    const subData = {
      success: true,
      subscriptionId: 'sub_123',
      customerId: 'cus_123',
      status: 'trialing',
      trialEndsAt: '2026-03-15T00:00:00Z',
    }
    mockInvoke.mockResolvedValue({ data: subData, error: null })

    const result = await startSubscription({ paymentMethodId: 'pm_123', trialDays: 14 })
    expect(result).toEqual(subData)
  })

  it('calls create-checkout with paymentMethodId and trialDays', async () => {
    mockInvoke.mockResolvedValue({ data: { success: true }, error: null })

    await startSubscription({ paymentMethodId: 'pm_abc', trialDays: 30 })

    expect(mockInvoke).toHaveBeenCalledWith('create-checkout', {
      body: { paymentMethodId: 'pm_abc', trialDays: 30 },
    })
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('Forbidden') })

    const result = await startSubscription({ paymentMethodId: 'pm_bad' })
    expect(result).toBeNull()
  })

  it('returns null when invoke throws', async () => {
    mockInvoke.mockRejectedValue(new Error('Connection refused'))

    const result = await startSubscription({ paymentMethodId: 'pm_bad' })
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

  it('calls create-portal-session with returnUrl pointing at /academy/billing', async () => {
    mockInvoke.mockResolvedValue({ data: { url: 'https://...' }, error: null })

    await getCustomerPortalUrl()

    expect(mockInvoke).toHaveBeenCalledWith('create-portal-session', {
      body: { returnUrl: expect.stringContaining('/academy/billing') },
    })
  })

  it('returns null on error', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('No customer') })

    const result = await getCustomerPortalUrl()
    expect(result).toBeNull()
  })
})
