import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isValidUrl = (url: string) => {
  try { return /^https?:\/\//.test(url) && !!new URL(url) }
  catch { return false }
}

// Create a real client when credentials are configured, otherwise a placeholder
// that won't crash the app during local development without Supabase.
export const supabase: SupabaseClient = isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')
