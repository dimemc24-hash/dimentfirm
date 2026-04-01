import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Streak } from '../types/database'

export function useStreak(userId: string | undefined) {
  const [streak, setStreak] = useState<Streak | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data }) => {
        setStreak(data as Streak | null)
        setLoading(false)
      })
  }, [userId])

  return { streak, loading }
}
