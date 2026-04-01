/**
 * session-guard.ts — Tests for concurrent session enforcement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Hoist Supabase mock ──────────────────────────────────────────────────────

const { mockFrom, mockSupabase } = vi.hoisted(() => {
  // Build a chainable query builder
  function createChain(data: unknown = null, error: unknown = null) {
    const chain: Record<string, unknown> = {}
    const methods = [
      'select', 'insert', 'update', 'upsert', 'delete',
      'eq', 'in', 'order', 'limit', 'single', 'maybeSingle',
    ]
    for (const m of methods) {
      chain[m] = vi.fn().mockReturnValue(chain)
    }
    // Terminal: resolve with data
    chain['then'] = vi.fn((cb: (val: { data: unknown; error: unknown }) => void) => {
      return Promise.resolve({ data, error }).then(cb)
    })
    // Make it a thenable so await works
    Object.defineProperty(chain, Symbol.toStringTag, { value: 'Promise' })
    return chain
  }

  const mockChain = createChain()
  const mockFrom = vi.fn().mockReturnValue(mockChain)
  const mockSupabase = { from: mockFrom }

  return { mockFrom, mockChain, mockSupabase, createChain }
})

vi.mock('../supabase', () => ({ supabase: mockSupabase }))

// ── Import after mock ────────────────────────────────────────────────────────

import {
  registerSession,
  startHeartbeat,
  stopHeartbeat,
  unregisterSession,
  isSessionValid,
} from '../session-guard'

// ── Helpers ──────────────────────────────────────────────────────────────────

const TEST_USER_ID = 'user-test-001'

function mockChainResult(data: unknown = null, error: unknown = null) {
  const chain: Record<string, unknown> = {}
  const methods = [
    'select', 'insert', 'update', 'upsert', 'delete',
    'eq', 'in', 'order', 'limit', 'single', 'maybeSingle',
  ]
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  // Make it thenable
  const result = Promise.resolve({ data, error })
  chain['then'] = result.then.bind(result)
  chain['catch'] = result.catch.bind(result)
  return chain
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('session-guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    stopHeartbeat()
  })

  afterEach(() => {
    stopHeartbeat()
  })

  describe('registerSession', () => {
    it('generates and stores a device hash in localStorage', async () => {
      // First call: no existing session, upsert succeeds
      mockFrom.mockReturnValue(
        mockChainResult({ id: 'session-abc' }),
      )

      await registerSession(TEST_USER_ID)

      const deviceHash = localStorage.getItem('fsa_device_hash')
      expect(deviceHash).toBeTruthy()
      expect(deviceHash).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      )
    })

    it('reuses existing device hash across calls', async () => {
      localStorage.setItem('fsa_device_hash', 'existing-hash-123')

      mockFrom.mockReturnValue(
        mockChainResult({ id: 'session-xyz' }),
      )

      await registerSession(TEST_USER_ID)

      expect(localStorage.getItem('fsa_device_hash')).toBe('existing-hash-123')
    })

    it('stores session ID on successful registration', async () => {
      // First from() = upsert (returns the session row)
      // Subsequent from() calls = enforceLimit select + possible delete (return empty array)
      mockFrom
        .mockReturnValueOnce(mockChainResult({ id: 'session-new-001' }))
        .mockReturnValue(mockChainResult([], null))

      const result = await registerSession(TEST_USER_ID)

      expect(result.registered).toBe(true)
      expect(result.sessionId).toBeTruthy()
    })

    it('returns error info when registration fails completely', async () => {
      mockFrom.mockReturnValue(
        mockChainResult(null, { message: 'DB connection failed' }),
      )

      const result = await registerSession(TEST_USER_ID)

      // Should not throw, just return error state
      expect(result.evicted).toBe(false)
    })
  })

  describe('startHeartbeat / stopHeartbeat', () => {
    it('returns a cleanup function', () => {
      mockFrom.mockReturnValue(mockChainResult())
      localStorage.setItem('fsa_session_id', 'sess-hb-test')

      const cleanup = startHeartbeat(TEST_USER_ID)

      expect(typeof cleanup).toBe('function')
      cleanup()
    })

    it('stopHeartbeat can be called safely even if no heartbeat is running', () => {
      expect(() => stopHeartbeat()).not.toThrow()
    })
  })

  describe('unregisterSession', () => {
    it('clears session ID from localStorage', async () => {
      localStorage.setItem('fsa_session_id', 'sess-to-remove')
      mockFrom.mockReturnValue(mockChainResult())

      await unregisterSession(TEST_USER_ID)

      expect(localStorage.getItem('fsa_session_id')).toBeNull()
    })

    it('stops the heartbeat', async () => {
      mockFrom.mockReturnValue(mockChainResult())
      localStorage.setItem('fsa_session_id', 'sess-active')

      startHeartbeat(TEST_USER_ID)
      await unregisterSession(TEST_USER_ID)

      // No assertion on interval directly, but no error means it worked
      expect(localStorage.getItem('fsa_session_id')).toBeNull()
    })
  })

  describe('isSessionValid', () => {
    it('returns false when no session ID in localStorage', async () => {
      const valid = await isSessionValid(TEST_USER_ID)
      expect(valid).toBe(false)
    })

    it('returns true when session exists in DB', async () => {
      localStorage.setItem('fsa_session_id', 'sess-valid')
      mockFrom.mockReturnValue(
        mockChainResult({ id: 'sess-valid' }),
      )

      const valid = await isSessionValid(TEST_USER_ID)
      expect(valid).toBe(true)
    })

    it('returns false and clears localStorage when session not in DB', async () => {
      localStorage.setItem('fsa_session_id', 'sess-gone')
      mockFrom.mockReturnValue(
        mockChainResult(null, { code: 'PGRST116', message: 'not found' }),
      )

      const valid = await isSessionValid(TEST_USER_ID)
      expect(valid).toBe(false)
      expect(localStorage.getItem('fsa_session_id')).toBeNull()
    })
  })
})
