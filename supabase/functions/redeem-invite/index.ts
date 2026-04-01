// supabase/functions/redeem-invite/index.ts
// Validates an invite code and returns the chapter_path + trial_days.
// Called from the /invite/:code page before registration.
// This is a public endpoint (no auth required — user hasn't signed up yet).

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req: Request) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { code } = await req.json() as { code: string }

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invite code is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the database function which handles all validation + use_count increment
    const { data, error } = await supabase.rpc('redeem_invite', {
      p_code: code.trim(),
    })

    if (error) {
      console.error('redeem_invite RPC error:', error)
      return new Response(
        JSON.stringify({ valid: false, error: 'Failed to validate invite code' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // data is the jsonb returned by the SQL function:
    // { valid: true, invite_id, chapter_path, trial_days }
    // or { valid: false, error: "..." }
    return new Response(JSON.stringify(data), {
      status: data?.valid ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('redeem-invite error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return new Response(
      JSON.stringify({ valid: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
