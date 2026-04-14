import { useState } from 'react'
import {
  User, Mail, BookOpen, Calendar, Zap, Flame, Award,
  Edit3, Check, X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useXP } from '../../hooks/useXP'
import { useStreak } from '../../hooks/useStreak'
import { useBadges, TOTAL_BADGES } from '../../hooks/useBadges'
import { cn } from '../../lib/cn'

export default function Profile() {
  const { user } = useAuth()
  const { profile, loading: profileLoading, updateProfile } = useProfile(user?.id)
  const { totalXP, level, levelName, nextLevel } = useXP(profile)
  const { streak } = useStreak(user?.id)
  const { earnedCount } = useBadges(user?.id)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startEdit = () => {
    setEditName(profile?.display_name ?? '')
    setEditing(true)
    setError(null)
  }

  const cancelEdit = () => {
    setEditing(false)
    setError(null)
  }

  const saveEdit = async () => {
    if (!editName.trim()) { setError('Name cannot be empty'); return }
    setSaving(true)
    setError(null)
    try {
      await updateProfile({ display_name: editName.trim() })
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    }
    setSaving(false)
  }

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  if (profileLoading) {
    return <div className="text-center py-16 text-gray-400">Loading profile…</div>
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Profile not found. Please try logging in again.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-r from-fresh-blue via-gentle-purple to-warm-amber" />

        <div className="px-4 sm:px-6 pb-5 sm:pb-6 -mt-10">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-xl sm:text-2xl font-bold text-fresh-blue bg-gradient-to-br from-blue-50 to-purple-50">
            {(profile.display_name || profile.email)[0].toUpperCase()}
          </div>

          <div className="mt-3 flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2">
            <div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="text-xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-fresh-blue/40"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="p-1.5 text-soft-green hover:bg-green-50 rounded-lg transition-colors"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">
                    {profile.display_name || 'Unnamed'}
                  </h1>
                  <button
                    onClick={startEdit}
                    className="p-1 text-gray-400 hover:text-fresh-blue rounded-md hover:bg-blue-50 transition-colors"
                    title="Edit name"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <p className="text-sm text-gray-400 mt-0.5">{profile.email}</p>
            </div>

            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', 'bg-amber-100 text-amber-700')}>
              Beta Access
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Zap className="w-5 h-5 text-warm-amber" />}
          label="Total XP"
          value={totalXP.toLocaleString()}
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-gentle-purple" />}
          label="Level"
          value={`${level} — ${levelName}`}
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-red-500" />}
          label="Current Streak"
          value={`${streak?.current_streak ?? 0} days`}
          sub={`Best: ${streak?.longest_streak ?? 0}`}
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-warm-amber" />}
          label="Badges"
          value={`${earnedCount} / ${TOTAL_BADGES}`}
        />
      </div>

      {/* Level progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Level {level} — {levelName}
          </span>
          <span className="text-xs text-gray-400">
            {nextLevel.current} / {nextLevel.needed} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fresh-blue to-gentle-purple rounded-full transition-all duration-700"
            style={{ width: `${nextLevel.progress}%` }}
          />
        </div>
        {nextLevel.progress < 100 && (
          <p className="text-xs text-gray-400 mt-1.5">
            {nextLevel.needed - nextLevel.current} XP until Level {level + 1}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
        <DetailRow
          icon={<BookOpen className="w-4 h-4 text-fresh-blue" />}
          label="Chapter Path"
          value={profile.chapter_path === 'ch7' ? 'Chapter 7 — Fresh Start' : 'Chapter 13 — Repayment Plan'}
        />
        <DetailRow
          icon={<Calendar className="w-4 h-4 text-gray-400" />}
          label="Member Since"
          value={formatDate(profile.created_at)}
        />
        <DetailRow
          icon={<Mail className="w-4 h-4 text-gray-400" />}
          label="Email"
          value={profile.email}
        />
        {profile.invited_by && (
          <DetailRow
            icon={<User className="w-4 h-4 text-gray-400" />}
            label="Invited By"
            value={profile.invited_by}
          />
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="mb-2">{icon}</div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 px-4 sm:px-5 py-3">
      <div className="flex items-center gap-2 xs:w-36 flex-shrink-0">
        {icon}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="text-sm text-gray-900 font-medium break-anywhere pl-6 xs:pl-0">{value}</span>
    </div>
  )
}
