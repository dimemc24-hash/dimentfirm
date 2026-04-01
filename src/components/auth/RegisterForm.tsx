import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { UserPlus } from 'lucide-react'
import type { ChapterPath } from '../../types/database'

interface RegisterFormProps {
  presetChapterPath?: ChapterPath | null
  inviteCode?: string
  trialDays?: number
}

export function RegisterForm({ presetChapterPath, inviteCode, trialDays = 14 }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [chapterPath, setChapterPath] = useState<ChapterPath>(presetChapterPath ?? 'ch7')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
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
      navigate('/academy/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Start Your Fresh Start</h1>
          <p className="text-gray-500 mt-2">
            {inviteCode
              ? `You've been invited! ${trialDays} days free.`
              : `${trialDays}-day free trial. No commitment.`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Chapter Path Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Which chapter did you file?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button"
                onClick={() => !presetChapterPath && setChapterPath('ch7')}
                disabled={!!presetChapterPath}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  chapterPath === 'ch7'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${presetChapterPath ? 'opacity-75' : ''}`}
              >
                <div className="text-2xl mb-1">🐇</div>
                <div className="font-semibold text-sm">Chapter 7</div>
                <div className="text-xs text-gray-500 mt-1">Fresh start path</div>
              </button>
              <button type="button"
                onClick={() => !presetChapterPath && setChapterPath('ch13')}
                disabled={!!presetChapterPath}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  chapterPath === 'ch13'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${presetChapterPath ? 'opacity-75' : ''}`}
              >
                <div className="text-2xl mb-1">🐢</div>
                <div className="font-semibold text-sm">Chapter 13</div>
                <div className="text-xs text-gray-500 mt-1">Plan completed path</div>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="reg-email" type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="reg-password" type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="reg-confirm" type="password" required value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            <UserPlus size={18} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/academy/login" className="text-emerald-600 hover:underline font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
