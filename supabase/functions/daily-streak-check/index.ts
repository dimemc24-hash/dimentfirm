// supabase/functions/daily-streak-check/index.ts
// Cron function (runs daily at 5am UTC).
// Resets streaks for users who missed yesterday.
// Also suspends subscriptions past their grace period.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  // This function is triggered by a cron schedule, not user requests.
  // Optionally verify a shared secret header for security.
  const cronSecret = Deno.env.get('CRON_SECRET')
  if (cronSecret) {
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // ── 1. Reset broken streaks ──────────────────────────────
    // Users whose last_active_date is before yesterday have broken their streak.
    const { data: brokenStreaks, error: streakError } = await supabase
      .from('streaks')
      .select('user_id, current_streak, longest_streak, last_active_date')
      .lt('last_active_date', yesterday)
      .gt('current_streak', 0)

    if (streakError) {
      console.error('Error fetching broken streaks:', streakError)
    }

    let streaksReset = 0
    if (brokenStreaks && brokenStreaks.length > 0) {
      const userIds = brokenStreaks.map((s) => s.user_id)

      const { error: resetError } = await supabase
        .from('streaks')
        .update({
          current_streak: 0,
          updated_at: new Date().toISOString(),
        })
        .in('user_id', userIds)

      if (resetError) {
        console.error('Error resetting streaks:', resetError)
      } else {
        streaksReset = userIds.length
      }
    }

    // ── 2. Suspend past-due subscriptions past grace period ──
    const now = new Date().toISOString()

    const { data: expiredGrace, error: graceError } = await supabase
      .from('subscriptions')
      .select('id, user_id')
      .eq('status', 'past_due')
      .not('grace_ends_at', 'is', null)
      .lt('grace_ends_at', now)

    if (graceError) {
      console.error('Error fetching expired grace subscriptions:', graceError)
    }

    let subscriptionsSuspended = 0
    if (expiredGrace && expiredGrace.length > 0) {
      const subIds = expiredGrace.map((s) => s.id)

      const { error: suspendError } = await supabase
        .from('subscriptions')
        .update({
          status: 'suspended',
          updated_at: now,
        })
        .in('id', subIds)

      if (suspendError) {
        console.error('Error suspending subscriptions:', suspendError)
      } else {
        subscriptionsSuspended = subIds.length
      }
    }

    // ── 3. Clean up stale active_sessions (> 24h old) ────────
    const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: sessionsCleared } = await supabase
      .from('active_sessions')
      .delete({ count: 'exact' })
      .lt('last_seen', staleThreshold)

    const summary = {
      date: today,
      streaksReset,
      subscriptionsSuspended,
      staleSessions: sessionsCleared ?? 0,
    }

    console.log('Daily streak check complete:', JSON.stringify(summary))

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('daily-streak-check error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
