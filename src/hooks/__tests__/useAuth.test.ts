import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// ── Mock Supabase ────────────────────────────────────────────────────

const { mockSupabase, mockUnsubscribe } = vi.hoisted(() => {
  const mockUnsubscribe = vi.fn()
  const mockSupabase = {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  }
  return { mockSupabase, mockUnsubscribe }
})

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}))

import { useAuth } from '../useAuth'

// ── Constants ────────────────────────────────────────────────────────

const DEMO_STORAGE_KEY = 'fsa_demo_user'

const REAL_USER = {
  id: 'user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { chapter_path: 'ch7' },
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
}

const REAL_SESSION = {
  access_token: 'real-token',
  refresh_token: 'real-refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: REAL_USER,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
}

// ── Tests ────────────────────────────────────────────────────────────

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Default: no session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    })
  })

  // ── Initialization ─────────────────────────────────────────────

  it('starts with loading=true', () => {
    // Keep getSession pending
    mockSupabase.auth.getSession.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
  })

  it('loads null session when no user is authenticated', async () => {
    const { result } = renderHook(() => useAuth())
    // Wait for effect
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
  })

  it('loads existing Supabase session', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: REAL_SESSION },
    })

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toEqual(REAL_USER)
    expect(result.current.session).toEqual(REAL_SESSION)
  })

  it('subscribes to auth state changes and unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useAuth())

    expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledOnce()
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })

  // ── Demo user ──────────────────────────────────────────────────

  it('restores demo session from localStorage on mount', async () => {
    localStorage.setItem(DEMO_STORAGE_KEY, 'true')

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user?.id).toBe('demo-user-0001')
    expect(result.current.user?.user_metadata?.role).toBe('admin')
    // Should NOT have called Supabase getSession
    expect(mockSupabase.auth.getSession).not.toHaveBeenCalled()
  })

  // ── signIn ─────────────────────────────────────────────────────

  it('demo login bypasses Supabase and sets localStorage flag', async () => {
    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    let signInResult: unknown
    await act(async () => {
      signInResult = await result.current.signIn('dimemc24', 'Bounty24')
    })

    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    expect(localStorage.getItem(DEMO_STORAGE_KEY)).toBe('true')
    expect(result.current.user?.id).toBe('demo-user-0001')
    expect(signInResult).toHaveProperty('user')
    expect(signInResult).toHaveProperty('session')
  })

  it('real login calls Supabase signInWithPassword', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: REAL_USER, session: REAL_SESSION },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123')
    })

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('real login throws on Supabase error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Invalid credentials'),
    })

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      act(async () => {
        await result.current.signIn('test@example.com', 'wrong')
      }),
    ).rejects.toThrow('Invalid credentials')
  })

  // ── signUp ─────────────────────────────────────────────────────

  it('calls Supabase signUp with chapter path and invite code', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: REAL_USER, session: REAL_SESSION },
      error: null,
    })

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signUp('test@example.com', 'password', 'ch13', 'INVITE123')
    })

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: {
        data: { chapter_path: 'ch13', invite_code: 'INVITE123' },
      },
    })
  })

  it('signUp throws on Supabase error', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: new Error('Email already registered'),
    })

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await expect(
      act(async () => {
        await result.current.signUp('dupe@example.com', 'pass', 'ch7')
      }),
    ).rejects.toThrow('Email already registered')
  })

  // ── signOut ────────────────────────────────────────────────────

  it('clears demo flag and state on sign out', async () => {
    localStorage.setItem(DEMO_STORAGE_KEY, 'true')

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).not.toBeNull()

    await act(async () => {
      await result.current.signOut()
    })

    expect(localStorage.getItem(DEMO_STORAGE_KEY)).toBeNull()
    expect(result.current.user).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('calls Supabase signOut for real sessions', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabase.auth.signOut).toHaveBeenCalledOnce()
  })

  it('signOut does not throw even if Supabase signOut fails', async () => {
    mockSupabase.auth.signOut.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    // Should not throw
    await act(async () => {
      await result.current.signOut()
    })

    expect(result.current.user).toBeNull()
  })

  // ── Auth state change listener ─────────────────────────────────

  it('does not overwrite demo session with Supabase auth changes', async () => {
    localStorage.setItem(DEMO_STORAGE_KEY, 'true')

    const { result } = renderHook(() => useAuth())
    await vi.waitFor(() => expect(result.current.loading).toBe(false))

    // Simulate Supabase firing null session
    const onChangeCallback = mockSupabase.auth.onAuthStateChange.mock.calls[0]?.[0]
    if (onChangeCallback) {
      act(() => {
        onChangeCallback('SIGNED_OUT', null)
      })
    }

    // Demo session should remain
    expect(result.current.user?.id).toBe('demo-user-0001')
  })
})
