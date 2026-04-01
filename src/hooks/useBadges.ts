import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { UserBadge } from '../types/database'

/** All badge definitions (client-side catalog) */
export const BADGE_CATALOG = [
  // Module completion badges
  { slug: 'fresh-start', name: 'Fresh Start', icon: '🌟', module: 1 },
  { slug: 'goal-setter', name: 'Goal Setter', icon: '🎯', module: 1 },
  { slug: 'story-rewriter', name: 'Story Rewriter', icon: '📖', module: 2 },
  { slug: 'belief-breaker', name: 'Belief Breaker', icon: '💡', module: 2 },
  { slug: 'budget-builder', name: 'Budget Builder', icon: '📊', module: 3 },
  { slug: 'budget-hero', name: 'Budget Hero', icon: '🦸', module: 3 },
  { slug: 'cash-commander', name: 'Cash Commander', icon: '💵', module: 4 },
  { slug: 'envelope-master', name: 'Envelope Master', icon: '✉️', module: 4 },
  { slug: 'safety-net-starter', name: 'Safety Net Starter', icon: '🛡️', module: 5 },
  { slug: 'savings-sprinter', name: 'Savings Sprinter', icon: '🏃', module: 5 },
  { slug: 'inner-healer', name: 'Inner Healer', icon: '💚', module: 6 },
  { slug: 'self-trust-builder', name: 'Self-Trust Builder', icon: '🤝', module: 6 },
  { slug: 'credit-starter', name: 'Credit Starter', icon: '📈', module: 7 },
  { slug: 'score-master', name: 'Score Master', icon: '🏆', module: 7 },
  { slug: 'dispute-writer', name: 'Dispute Writer', icon: '✍️', module: 7 },
  { slug: 'trap-spotter', name: 'Trap Spotter', icon: '🔍', module: 8 },
  { slug: 'apr-calculator', name: 'APR Calculator', icon: '🧮', module: 8 },
  { slug: 'income-explorer', name: 'Income Explorer', icon: '💰', module: 9 },
  { slug: 'gig-navigator', name: 'Gig Navigator', icon: '🧭', module: 9 },
  { slug: 'letter-writer', name: 'Letter Writer', icon: '📝', module: 10 },
  { slug: 'road-map-ready', name: 'Road Map Ready', icon: '🗺️', module: 10 },
  { slug: 'commitment-keeper', name: 'Commitment Keeper', icon: '🤞', module: 10 },
  { slug: 'course-graduate', name: 'Course Graduate', icon: '🎓', module: 10 },
  // Streak badges
  { slug: 'streak-3', name: '3-Day Streak', icon: '🔥', module: null },
  { slug: 'streak-7', name: 'Week Warrior', icon: '🔥', module: null },
  { slug: 'streak-14', name: 'Two-Week Titan', icon: '🔥', module: null },
  { slug: 'streak-30', name: 'Monthly Master', icon: '🔥', module: null },
  { slug: 'streak-60', name: 'Sixty-Day Sage', icon: '🔥', module: null },
  { slug: 'streak-90', name: 'Ninety-Day Legend', icon: '🔥', module: null },
  // Game badges
  { slug: 'first-game', name: 'First Game', icon: '🎮', module: null },
  { slug: 'arcade-explorer', name: 'Arcade Explorer', icon: '👾', module: null },
  { slug: 'three-star-player', name: '3-Star Player', icon: '⭐', module: null },
  { slug: 'perfect-run', name: 'Perfect Run', icon: '💎', module: null },
  // Special badges
  { slug: 'night-owl', name: 'Night Owl', icon: '🦉', module: null },
  { slug: 'speed-learner', name: 'Speed Learner', icon: '⚡', module: null },
  { slug: 'completionist', name: 'Completionist', icon: '🏅', module: null },
  { slug: 'reflection-writer', name: 'Reflection Writer', icon: '📓', module: null },
] as const

export const TOTAL_BADGES = BADGE_CATALOG.length // 38

export function useBadges(userId: string | undefined) {
  const [earned, setEarned] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        setEarned((data as UserBadge[]) ?? [])
        setLoading(false)
      })
  }, [userId])

  const earnedSlugs = new Set(earned.map(b => b.badge_slug))
  const earnedCount = earned.length

  const isEarned = (slug: string) => earnedSlugs.has(slug)

  return { earned, loading, earnedCount, isEarned, catalog: BADGE_CATALOG, total: TOTAL_BADGES }
}
