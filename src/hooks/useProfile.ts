import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

const DEMO_PROFILE: Profile = {
  id: 'demo-user-0001',
  email: 'dimemc24@dimentlaw.com',
  display_name: 'Demo Admin',
  avatar_url: null,
  chapter_path: 'ch7',
  role: 'admin',
  level: 3,
  total_xp: 2450,
  invited_by: null,
  onboarded_at: new Date().toISOString(),
  created_at: '2026-01-15T00:00:00Z',
  updated_at: new Date().toISOString(),
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    // Demo user — return mock profile immediately
    if (userId === 'demo-user-0001') {
      setProfile(DEMO_PROFILE)
      setLoading(false)
      return
    }

    async function fetch() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        if (error) throw error
        setProfile(data as Profile)
      } catch {
        // Profile might not exist yet (pre-trigger), use fallback
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [userId])

  const updateProfile = async (updates: Partial<Pick<Profile, 'display_name' | 'avatar_url'>>) => {
    if (!userId) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    setProfile(data as Profile)
  }

  return { profile, loading, updateProfile }
}
