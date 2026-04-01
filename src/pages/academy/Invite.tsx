import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight, Gift, Clock, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/cn'
import type { ChapterPath } from '../../types/database'

interface InviteInfo {
  valid: boolean
  code: string
  chapterPath: ChapterPath | null
  trialDays: number
  label: string | null
  error?: string
}

export default function Invite() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) {
      setInvite({ valid: false, code: '', chapterPath: null, trialDays: 14, label: null, error: 'No invite code provided' })
      setLoading(false)
      return
    }

    async function validateInvite() {
      try {
        const { data, error } = await supabase
          .from('invite_links')
          .select('code, chapter_path, trial_days, label, max_uses, use_count, expires_at, is_active')
          .eq('code', code)
          .single()

        if (error || !data) {
          setInvite({
            valid: false,
            code: code!,
            chapterPath: null,
            trialDays: 14,
            label: null,
            error: 'This invite link is not valid.',
          })
          return
        }

        // Check validity conditions
        if (!data.is_active) {
          setInvite({
            valid: false,
            code: code!,
            chapterPath: null,
            trialDays: 14,
            label: null,
            error: 'This invite link has been deactivated.',
          })
          return
        }

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setInvite({
            valid: false,
            code: code!,
            chapterPath: null,
            trialDays: 14,
            label: null,
            error: 'This invite link has expired.',
          })
          return
        }

        if (data.max_uses !== null && data.use_count >= data.max_uses) {
          setInvite({
            valid: false,
            code: code!,
            chapterPath: null,
            trialDays: 14,
            label: null,
            error: 'This invite link has reached its usage limit.',
          })
          return
        }

        setInvite({
          valid: true,
          code: data.code,
          chapterPath: data.chapter_path as ChapterPath | null,
          trialDays: data.trial_days,
          label: data.label,
        })
      } catch {
        setInvite({
          valid: false,
          code: code!,
          chapterPath: null,
          trialDays: 14,
          label: null,
          error: 'Unable to verify invite. Please try again.',
        })
      } finally {
        setLoading(false)
      }
    }

    validateInvite()
  }, [code])

  const handleAccept = () => {
    if (!invite?.valid) return
    const params = new URLSearchParams({ invite: invite.code })
    if (invite.chapterPath) params.set('path', invite.chapterPath)
    if (invite.trialDays !== 14) params.set('trial', String(invite.trialDays))
    navigate(`/academy/register?${params.toString()}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-fresh-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Verifying your invite…</p>
        </div>
      </div>
    )
  }

  // Invalid invite
  if (!invite?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite</h1>
            <p className="text-gray-500 mb-6 text-sm">
              {invite?.error ?? 'This invite link is no longer valid.'}
            </p>

            <div className="space-y-3">
              <Link
                to="/academy/register"
                className="flex items-center justify-center gap-2 w-full bg-fresh-blue text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-colors"
              >
                Sign Up Without an Invite
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/academy"
                className="block text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Valid invite
  const mascot = invite.chapterPath === 'ch13'
    ? { src: '/mascots/sheldon/sheldon.png', alt: 'Sheldon the Tortoise', emoji: '🐢' }
    : { src: '/mascots/hariette/hariette.png', alt: 'Hariette the Hare', emoji: '🐇' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
          {/* Mascot */}
          <div className="relative inline-block mb-5">
            <img
              src={mascot.src}
              alt={mascot.alt}
              className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <Gift className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            You're Invited! {mascot.emoji}
          </h1>

          {invite.label && (
            <p className="text-sm text-fresh-blue font-medium mb-1">{invite.label}</p>
          )}

          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Someone thinks you'd love Fresh Start Academy — a post-bankruptcy financial recovery course
            built with compassion and fun.
          </p>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{invite.trialDays}-Day Free Trial</p>
                <p className="text-xs text-gray-400">No credit card required to start</p>
              </div>
            </div>

            {invite.chapterPath && (
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  invite.chapterPath === 'ch7' ? 'bg-amber-100' : 'bg-teal-100',
                )}>
                  <span className="text-sm">{mascot.emoji}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {invite.chapterPath === 'ch7' ? 'Chapter 7' : 'Chapter 13'} Path
                  </p>
                  <p className="text-xs text-gray-400">Pre-selected for your journey</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Full Access</p>
                <p className="text-xs text-gray-400">10 modules, 7 games, 38 badges</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAccept}
            className="flex items-center justify-center gap-2 w-full bg-fresh-blue text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-600 transition-colors shadow-sm active:scale-[0.98]"
          >
            Accept & Create Account
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-gray-400 mt-3">
            Already have an account?{' '}
            <Link to="/academy/login" className="text-fresh-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
