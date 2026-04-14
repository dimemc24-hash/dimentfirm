import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/cn'
import type { ChapterPath } from '../../types/database'

const STEPS = ['Account', 'Ready']

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const inviteCode = searchParams.get('invite') ?? undefined
  const presetPath = searchParams.get('path') as ChapterPath | null

  // Step state
  const [step, setStep] = useState(0)

  // Step 1: Account fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [chapterPath, setChapterPath] = useState<ChapterPath>(presetPath ?? 'ch7')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1: Create account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, chapterPath, inviteCode)

      // Notify Alayna of new registration (fire-and-forget)
      fetch('/api/notify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, chapterPath }),
      }).catch(() => { /* notification failure shouldn't block signup */ })

      setStep(1) // Skip to confirmation
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">Fresh Start Academy</h1>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">Beta</span>
          </div>
          <p className="text-gray-500 mt-2">
            {inviteCode
              ? "You've been invited! Create your free account."
              : 'Free for active Diment & Associates clients.'}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                i < step
                  ? 'bg-emerald-100 text-emerald-700'
                  : i === step
                    ? 'bg-fresh-blue text-white'
                    : 'bg-gray-100 text-gray-400',
              )}>
                {i < step ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-current inline-block" />
                )}
                {label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'w-6 h-0.5 rounded',
                  i < step ? 'bg-emerald-300' : 'bg-gray-200',
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Account creation */}
        {step === 0 && (
          <form
            onSubmit={handleCreateAccount}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5"
          >
            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Active client notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
              Available to Diment & Associates clients active within the last 6 months. Use the email address on file with our office.
            </div>

            {/* Chapter Path Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Which chapter did you file?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => !presetPath && setChapterPath('ch7')}
                  disabled={!!presetPath}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    chapterPath === 'ch7'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300',
                    presetPath ? 'opacity-75' : '',
                  )}
                >
                  <div className="text-2xl mb-1">🐇</div>
                  <div className="font-semibold text-sm">Quick Sprint Path</div>
                  <div className="text-xs text-gray-500 mt-1">Chapter 7</div>
                </button>
                <button
                  type="button"
                  onClick={() => !presetPath && setChapterPath('ch13')}
                  disabled={!!presetPath}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    chapterPath === 'ch13'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300',
                    presetPath ? 'opacity-75' : '',
                  )}
                >
                  <div className="text-2xl mb-1">🐢</div>
                  <div className="font-semibold text-sm">Steady Path</div>
                  <div className="text-xs text-gray-500 mt-1">Chapter 13</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fresh-blue hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/academy/login" className="text-emerald-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Confirmation */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Fresh Start Academy!</h2>
            <p className="text-gray-500 mb-2">
              Your free account is ready. Please check your email to verify your address.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              You chose the{' '}
              <strong>{chapterPath === 'ch7' ? 'Quick Sprint Path' : 'Steady Path'}</strong>.
              {chapterPath === 'ch7'
                ? " 🐇 Hariette is ready to run toward your fresh start!"
                : " 🐢 Sheldon is ready to walk this journey with you!"}
            </p>

            <button
              onClick={() => navigate('/academy/dashboard')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Go to Your Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
