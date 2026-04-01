// supabase/functions/enforce-sessions/index.ts
// Called on page load / navigation. Registers the device session and
// evicts the oldest session if the user exceeds the max concurrent limit.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MAX_SESSIONS = parseInt(Deno.env.get('MAX_CONCURRENT_SESSIONS') || '2', 10)

// Sessions older than this are considered stale and auto-pruned
const STALE_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes

serve(async (req: Request) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { deviceHash, userAgent } = await req.json() as {
      deviceHash: string
      userAgent?: string
    }

    if (!deviceHash) {
      return new Response(JSON.stringify({ error: 'deviceHash is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get client IP from request headers (set by edge/proxy)
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null

    // 1. Prune stale sessions (last_seen > 30 min ago)
    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS).toISOString()
    await supabase
      .from('active_sessions')
      .delete()
      .eq('user_id', user.id)
      .lt('last_seen', staleThreshold)

    // 2. Upsert this device session
    const { error: upsertError } = await supabase
      .from('active_sessions')
      .upsert(
        {
          user_id: user.id,
          device_hash: deviceHash,
          ip_address: ipAddress,
          user_agent: userAgent || null,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,device_hash',
          ignoreDuplicates: false,
        }
      )

    // If upsert fails due to no unique constraint on (user_id, device_hash),
    // fall back to delete + insert
    if (upsertError) {
      await supabase
        .from('active_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('device_hash', deviceHash)

      await supabase
        .from('active_sessions')
        .insert({
          user_id: user.id,
          device_hash: deviceHash,
          ip_address: ipAddress,
          user_agent: userAgent || null,
          last_seen: new Date().toISOString(),
        })
    }

    // 3. Count active sessions for this user
    const { data: sessions, error: countError } = await supabase
      .from('active_sessions')
      .select('id, device_hash, last_seen')
      .eq('user_id', user.id)
      .order('last_seen', { ascending: true })

    if (countError || !sessions) {
      return new Response(
        JSON.stringify({ allowed: true, sessionCount: 1 }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 4. If over limit, evict oldest sessions (not the current one)
    let evicted = 0
    if (sessions.length > MAX_SESSIONS) {
      const toEvict = sessions
        .filter((s) => s.device_hash !== deviceHash)
        .slice(0, sessions.length - MAX_SESSIONS)

      if (toEvict.length > 0) {
        const evictIds = toEvict.map((s) => s.id)
        await supabase
          .from('active_sessions')
          .delete()
          .in('id', evictIds)
        evicted = toEvict.length
      }
    }

    const finalCount = sessions.length - evicted

    return new Response(
      JSON.stringify({
        allowed: true,
        sessionCount: finalCount,
        maxSessions: MAX_SESSIONS,
        evicted,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('enforce-sessions error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
