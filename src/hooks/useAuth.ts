import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// ── Demo / test user ────────────────────────────────────────────────
const DEMO_CREDENTIALS = { username: 'dimemc24', password: 'Bounty24' }
const DEMO_STORAGE_KEY = 'fsa_demo_user'

const DEMO_USER: User = {
  id: 'demo-user-0001',
  email: 'dimemc24@dimentlaw.com',
  app_metadata: {},
  user_metadata: { display_name: 'Demo Admin', chapter_path: 'ch7', role: 'admin' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User

const DEMO_SESSION: Session = {
  access_token: 'demo-token',
  refresh_token: 'demo-refresh',
  expires_in: 86400,
  token_type: 'bearer',
  user: DEMO_USER,
  expires_at: Math.floor(Date.now() / 1000) + 86400,
} as Session

function isDemoLogin(email: string, password: string) {
  return email === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password
}
// ─────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true })

  useEffect(() => {
    // Check for persisted demo session first
    const stored = localStorage.getItem(DEMO_STORAGE_KEY)
    if (stored) {
      setState({ user: DEMO_USER, session: DEMO_SESSION, loading: false })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ user: session?.user ?? null, session, loading: false })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't overwrite demo session with null from Supabase
      if (localStorage.getItem(DEMO_STORAGE_KEY)) return
      setState({ user: session?.user ?? null, session, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = useCallback(async (email: string, password: string, chapterPath: 'ch7' | 'ch13', inviteCode?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { chapter_path: chapterPath, invite_code: inviteCode },
      },
    })
    if (error) throw error
    return data
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    // Demo user bypass — no Supabase needed
    if (isDemoLogin(email, password)) {
      localStorage.setItem(DEMO_STORAGE_KEY, 'true')
      setState({ user: DEMO_USER, session: DEMO_SESSION, loading: false })
      return { user: DEMO_USER, session: DEMO_SESSION }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY)
    setState({ user: null, session: null, loading: false })
    try { await supabase.auth.signOut() } catch { /* ignore if no real session */ }
  }, [])

  return { ...state, signUp, signIn, signOut }
}
