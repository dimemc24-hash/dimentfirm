import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Subscription } from '../types/database'

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        setSubscription(data as Subscription | null)
        setLoading(false)
      })
  }, [userId])

  const isTrialing = subscription?.status === 'trialing'
  const isActive = subscription?.status === 'active' || isTrialing
  const isPastDue = subscription?.status === 'past_due'
  const isCanceled = subscription?.status === 'canceled'

  const trialDaysLeft = (() => {
    if (!subscription?.trial_ends_at) return 0
    const ends = new Date(subscription.trial_ends_at)
    const now = new Date()
    const diff = Math.ceil((ends.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  })()

  return {
    subscription,
    loading,
    isTrialing,
    isActive,
    isPastDue,
    isCanceled,
    trialDaysLeft,
  }
}
