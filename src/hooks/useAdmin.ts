/**
 * useAdmin — Admin role check hook
 *
 * Checks if the current user has role='admin' via their profile.
 * Used by:
 *  - AdminRoute component to gate /admin/* routes
 *  - Admin pages to conditionally show admin-only actions
 *  - AppShell to show/hide admin nav link
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { UserRole } from '../types/database'

// ── Types ────────────────────────────────────────────────────────────

interface UseAdminReturn {
  /** True if the user has role='admin' */
  isAdmin: boolean
  /** True while the role check is in progress */
  loading: boolean
  /** The user's role, or null if not loaded */
  role: UserRole | null
  /** Error message if the check failed */
  error: string | null
}

// ── Demo detection ───────────────────────────────────────────────────

const DEMO_STORAGE_KEY = 'fsa_demo_active'
const DEMO_USER_ID = 'demo-user-0001'

function isDemoUser(userId: string | undefined): boolean {
  return userId === DEMO_USER_ID || localStorage.getItem(DEMO_STORAGE_KEY) === 'true'
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useAdmin(userId: string | undefined): UseAdminReturn {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setRole(null)
      setLoading(false)
      setError(null)
      return
    }

    // Demo user is always admin
    if (isDemoUser(userId)) {
      setRole('admin')
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false

    async function checkRole() {
      try {
        const { data, error: fetchErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId!)
          .single()

        if (cancelled) return

        if (fetchErr) {
          setError(fetchErr.message)
          setRole(null)
        } else if (data) {
          setRole(data.role as UserRole)
          setError(null)
        } else {
          setRole(null)
          setError('Profile not found')
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Unknown error')
        setRole(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    checkRole()

    return () => {
      cancelled = true
    }
  }, [userId])

  return {
    isAdmin: role === 'admin',
    loading,
    role,
    error,
  }
}

// ── Admin Route Guard ────────────────────────────────────────────────

/**
 * Convenience: checks admin role and returns redirect info.
 * Use this in route guards or layout components.
 *
 * @example
 * ```tsx
 * const { allowed, loading } = useAdminGuard(user?.id)
 * if (loading) return <LoadingSpinner />
 * if (!allowed) return <Navigate to="/dashboard" replace />
 * return <Outlet />
 * ```
 */
export function useAdminGuard(userId: string | undefined): {
  allowed: boolean
  loading: boolean
} {
  const { isAdmin, loading } = useAdmin(userId)
  return { allowed: isAdmin, loading }
}
