import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getLevelForXP, getXPForNextLevel, getLevelName } from '../lib/xp'
import type { Profile } from '../types/database'

export function useXP(profile: Profile | null) {
  const totalXP = profile?.total_xp ?? 0
  const level = getLevelForXP(totalXP)
  const levelName = getLevelName(level)
  const nextLevel = getXPForNextLevel(totalXP)

  const awardXP = useCallback(async (amount: number, source: string, refId?: string) => {
    if (!profile) return
    try {
      const { data, error } = await supabase.rpc('award_xp', {
        p_user_id: profile.id,
        p_amount: amount,
        p_source: source,
        p_ref_id: refId ?? null,
      })
      if (error) throw error
      return data
    } catch (err) {
      console.error('Failed to award XP:', err)
    }
  }, [profile])

  return { totalXP, level, levelName, nextLevel, awardXP }
}
