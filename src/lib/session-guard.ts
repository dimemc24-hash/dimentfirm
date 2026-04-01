/**
 * session-guard.ts — Concurrent session enforcement (frontend side)
 *
 * Flow per architecture §6.3:
 *  1. On app load → call enforce-sessions Edge Function
 *     - Registers this device (device_hash, IP, user-agent)
 *     - If > MAX_SESSIONS (default 2), oldest session is evicted
 *  2. Heartbeat every 60s → update last_seen
 *  3. If this session was evicted → redirect to login with message
 *
 * The device hash is a fingerprint stored in localStorage so the same
 * browser tab keeps the same session slot across reloads.
 */

import { supabase } from './supabase'

// ── Constants ────────────────────────────────────────────────────────

const DEVICE_HASH_KEY = 'fsa_device_hash'
const SESSION_ID_KEY = 'fsa_session_id'
const HEARTBEAT_INTERVAL_MS = 60_000 // 1 minute
const MAX_CONCURRENT_SESSIONS = Number(
  import.meta.env.VITE_MAX_CONCURRENT_SESSIONS ?? 2,
)

// ── Device fingerprint ───────────────────────────────────────────────

function getDeviceHash(): string {
  let hash = localStorage.getItem(DEVICE_HASH_KEY)
  if (!hash) {
    hash = crypto.randomUUID()
    localStorage.setItem(DEVICE_HASH_KEY, hash)
  }
  return hash
}

function getSessionId(): string | null {
  return localStorage.getItem(SESSION_ID_KEY)
}

function setSessionId(id: string): void {
  localStorage.setItem(SESSION_ID_KEY, id)
}

function clearSession(): void {
  localStorage.removeItem(SESSION_ID_KEY)
}

// ── Types ────────────────────────────────────────────────────────────

export interface SessionGuardResult {
  /** Whether this session was successfully registered */
  registered: boolean
  /** Session row ID from active_sessions */
  sessionId: string | null
  /** True if this device was evicted (too many sessions) */
  evicted: boolean
  /** Error message if registration failed */
  error?: string
}

export type EvictionCallback = () => void

// ── Register session ─────────────────────────────────────────────────

/**
 * Register this device as an active session. Call once on app mount.
 * If the user already has MAX_CONCURRENT_SESSIONS, the oldest is evicted.
 */
export async function registerSession(
  userId: string,
): Promise<SessionGuardResult> {
  const deviceHash = getDeviceHash()
  const userAgent = navigator.userAgent

  try {
    // Check if this device already has a session
    const existing = getSessionId()
    if (existing) {
      // Touch existing session
      const { error: touchErr } = await supabase
        .from('active_sessions')
        .update({ last_seen: new Date().toISOString(), user_agent: userAgent })
        .eq('id', existing)
        .eq('user_id', userId)

      if (!touchErr) {
        return { registered: true, sessionId: existing, evicted: false }
      }
      // If touch failed, the session was probably evicted — re-register below
      clearSession()
    }

    // Upsert a session row for this device
    const { data: upserted, error: upsertErr } = await supabase
      .from('active_sessions')
      .upsert(
        {
          user_id: userId,
          device_hash: deviceHash,
          user_agent: userAgent,
          last_seen: new Date().toISOString(),
        },
        { onConflict: 'user_id,device_hash', ignoreDuplicates: false },
      )
      .select('id')
      .single()

    if (upsertErr) {
      // Fallback: plain insert if upsert fails (no unique constraint)
      const { data: inserted, error: insertErr } = await supabase
        .from('active_sessions')
        .insert({
          user_id: userId,
          device_hash: deviceHash,
          user_agent: userAgent,
          last_seen: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertErr) {
        return {
          registered: false,
          sessionId: null,
          evicted: false,
          error: insertErr.message,
        }
      }

      if (inserted) {
        setSessionId(inserted.id)
        await enforceLimit(userId, inserted.id)
        return { registered: true, sessionId: inserted.id, evicted: false }
      }
    }

    if (upserted) {
      setSessionId(upserted.id)
      await enforceLimit(userId, upserted.id)
      return { registered: true, sessionId: upserted.id, evicted: false }
    }

    return { registered: false, sessionId: null, evicted: false, error: 'No data returned' }
  } catch (err) {
    return {
      registered: false,
      sessionId: null,
      evicted: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ── Enforce concurrent session limit ─────────────────────────────────

async function enforceLimit(userId: string, currentSessionId: string): Promise<void> {
  const { data: sessions } = await supabase
    .from('active_sessions')
    .select('id, last_seen')
    .eq('user_id', userId)
    .order('last_seen', { ascending: true })

  if (!sessions || sessions.length <= MAX_CONCURRENT_SESSIONS) return

  // Evict oldest sessions (keep the newest MAX_CONCURRENT_SESSIONS)
  const toEvict = sessions
    .filter((s) => s.id !== currentSessionId)
    .slice(0, sessions.length - MAX_CONCURRENT_SESSIONS)

  if (toEvict.length > 0) {
    await supabase
      .from('active_sessions')
      .delete()
      .in(
        'id',
        toEvict.map((s) => s.id),
      )
  }
}

// ── Heartbeat ────────────────────────────────────────────────────────

let heartbeatTimer: ReturnType<typeof setInterval> | null = null

/**
 * Start the session heartbeat. Updates last_seen every 60s.
 * Returns a cleanup function to stop the heartbeat.
 *
 * @param userId - The authenticated user's ID
 * @param onEvicted - Callback fired if this session is evicted
 */
export function startHeartbeat(
  userId: string,
  onEvicted?: EvictionCallback,
): () => void {
  stopHeartbeat()

  heartbeatTimer = setInterval(async () => {
    const sessionId = getSessionId()
    if (!sessionId) return

    const { error } = await supabase
      .from('active_sessions')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('user_id', userId)

    if (error) {
      // Session was deleted (evicted) — another device took the slot
      clearSession()
      stopHeartbeat()
      onEvicted?.()
    }
  }, HEARTBEAT_INTERVAL_MS)

  return stopHeartbeat
}

/**
 * Stop the session heartbeat.
 */
export function stopHeartbeat(): void {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

// ── Unregister session ───────────────────────────────────────────────

/**
 * Remove this device's session on logout. Call on sign-out.
 */
export async function unregisterSession(userId: string): Promise<void> {
  stopHeartbeat()
  const sessionId = getSessionId()
  if (sessionId) {
    await supabase
      .from('active_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId)
  }
  clearSession()
}

// ── Check if current session is still valid ──────────────────────────

/**
 * Returns true if this device's session still exists in active_sessions.
 */
export async function isSessionValid(userId: string): Promise<boolean> {
  const sessionId = getSessionId()
  if (!sessionId) return false

  const { data, error } = await supabase
    .from('active_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    clearSession()
    return false
  }
  return true
}
