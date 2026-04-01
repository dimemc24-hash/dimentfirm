import { useState, useEffect, useCallback } from 'react'
import {
  Search, ChevronDown, ChevronUp, Users, Flame, Award,
  BookOpen, RefreshCw,
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { cn } from '../../../lib/cn'
import { getLevelForXP, getLevelName } from '../../../lib/xp'
import type { ChapterPath, SubscriptionStatus } from '../../../types/database'

interface ClientRow {
  id: string
  email: string
  display_name: string
  chapter_path: ChapterPath
  total_xp: number
  level: number
  created_at: string
  updated_at: string
}

interface ClientSubscription {
  status: SubscriptionStatus
  trial_ends_at: string | null
}

interface ClientStreak {
  current_streak: number
  longest_streak: number
  last_active_date: string | null
}

interface ModuleProgressRow {
  module_id: string
  status: string
  completed_at: string | null
}

interface LessonProgressRow {
  module_id: string
  lesson_id: string
  status: string
  xp_earned: number
}

interface BadgeRow {
  badge_slug: string
  earned_at: string
}

interface ExpandedData {
  modules: ModuleProgressRow[]
  lessons: LessonProgressRow[]
  badges: BadgeRow[]
  subscription: ClientSubscription | null
  streak: ClientStreak | null
}

const STATUS_COLORS: Record<string, string> = {
  trialing: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  past_due: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-600',
  canceled: 'bg-gray-100 text-gray-500',
  comp: 'bg-purple-100 text-purple-700',
}

export default function Clients() {
  const [clients, setClients] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedData, setExpandedData] = useState<ExpandedData | null>(null)
  const [expandLoading, setExpandLoading] = useState(false)
  const [subMap, setSubMap] = useState<Record<string, ClientSubscription>>({})
  const [streakMap, setStreakMap] = useState<Record<string, ClientStreak>>({})
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Fetch profiles (non-admin)
    const { data: profiles, error: pErr } = await supabase
      .from('profiles')
      .select('id, email, display_name, chapter_path, total_xp, level, created_at, updated_at')
      .eq('role', 'learner')
      .order('created_at', { ascending: false })
    if (pErr) { setError(pErr.message); setLoading(false); return }
    setClients((profiles as ClientRow[]) ?? [])

    // Fetch latest subscription for each user
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id, status, trial_ends_at')
      .order('created_at', { ascending: false })
    if (subs) {
      const map: Record<string, ClientSubscription> = {}
      for (const s of subs as Array<{ user_id: string; status: SubscriptionStatus; trial_ends_at: string | null }>) {
        if (!map[s.user_id]) map[s.user_id] = { status: s.status, trial_ends_at: s.trial_ends_at }
      }
      setSubMap(map)
    }

    // Fetch streaks
    const { data: streaks } = await supabase
      .from('streaks')
      .select('user_id, current_streak, longest_streak, last_active_date')
    if (streaks) {
      const map: Record<string, ClientStreak> = {}
      for (const s of streaks as Array<{ user_id: string } & ClientStreak>) {
        map[s.user_id] = {
          current_streak: s.current_streak,
          longest_streak: s.longest_streak,
          last_active_date: s.last_active_date,
        }
      }
      setStreakMap(map)
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const toggleExpand = async (userId: string) => {
    if (expandedId === userId) {
      setExpandedId(null)
      setExpandedData(null)
      return
    }

    setExpandedId(userId)
    setExpandLoading(true)

    const [modRes, lesRes, badgeRes, subRes, streakRes] = await Promise.all([
      supabase.from('module_progress').select('module_id, status, completed_at').eq('user_id', userId),
      supabase.from('lesson_progress').select('module_id, lesson_id, status, xp_earned').eq('user_id', userId),
      supabase.from('user_badges').select('badge_slug, earned_at').eq('user_id', userId).order('earned_at', { ascending: false }),
      supabase.from('subscriptions').select('status, trial_ends_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('streaks').select('current_streak, longest_streak, last_active_date').eq('user_id', userId).single(),
    ])

    setExpandedData({
      modules: (modRes.data as ModuleProgressRow[]) ?? [],
      lessons: (lesRes.data as LessonProgressRow[]) ?? [],
      badges: (badgeRes.data as BadgeRow[]) ?? [],
      subscription: subRes.data as ClientSubscription | null,
      streak: streakRes.data as ClientStreak | null,
    })
    setExpandLoading(false)
  }

  const filtered = clients.filter(c => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      c.display_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  })

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Client Progress</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {clients.length} total client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchClients}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors touch-target flex-shrink-0"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-blue/40 bg-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading clients…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {searchQuery ? 'No clients match your search' : 'No clients yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(client => {
            const sub = subMap[client.id]
            const streak = streakMap[client.id]
            const isExpanded = expandedId === client.id

            return (
              <div
                key={client.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Row */}
                <button
                  onClick={() => toggleExpand(client.id)}
                  className="w-full px-3 sm:px-4 py-3 flex items-center gap-3 sm:gap-4 text-left hover:bg-gray-50 transition-colors touch-target"
                >
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fresh-blue to-gentle-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(client.display_name || client.email)[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 truncate text-sm">
                        {client.display_name || 'Unnamed'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">
                        {client.chapter_path === 'ch7' ? 'Ch.7' : 'Ch.13'}
                      </span>
                      {/* Show sub status on mobile too (compact) */}
                      {sub && (
                        <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-medium sm:hidden', STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-500')}>
                          {sub.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{client.email}</p>
                    {/* Mobile-only compact stats */}
                    <div className="flex items-center gap-3 mt-1 sm:hidden text-[10px] text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-warm-amber" />
                        {client.total_xp.toLocaleString()} XP
                      </span>
                      <span>🔥 {streak?.current_streak ?? 0}</span>
                    </div>
                  </div>

                  {/* Desktop-only stats */}
                  <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                    {sub && (
                      <span className={cn('px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-500')}>
                        {sub.status}
                      </span>
                    )}
                    <span className="flex items-center gap-1" title="Total XP">
                      <Flame className="w-3.5 h-3.5 text-warm-amber" />
                      {client.total_xp.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1" title="Streak">
                      🔥 {streak?.current_streak ?? 0}
                    </span>
                    <span className="text-gray-400">{formatDate(client.created_at)}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-3 sm:px-4 py-4 bg-gray-50/50">
                    {expandLoading ? (
                      <p className="text-sm text-gray-400 text-center py-4">Loading details…</p>
                    ) : expandedData ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Stats */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> Overview
                          </h3>
                          <div className="text-sm space-y-1.5 text-gray-600">
                            <p><span className="font-medium">Level:</span> {getLevelForXP(client.total_xp)} — {getLevelName(getLevelForXP(client.total_xp))}</p>
                            <p><span className="font-medium">Total XP:</span> {client.total_xp.toLocaleString()}</p>
                            <p><span className="font-medium">Streak:</span> {expandedData.streak?.current_streak ?? 0} days (best: {expandedData.streak?.longest_streak ?? 0})</p>
                            <p><span className="font-medium">Last Active:</span> {formatDate(expandedData.streak?.last_active_date ?? null)}</p>
                            <p>
                              <span className="font-medium">Subscription:</span>{' '}
                              {expandedData.subscription ? (
                                <span className={cn('px-1.5 py-0.5 rounded text-xs font-medium', STATUS_COLORS[expandedData.subscription.status])}>
                                  {expandedData.subscription.status}
                                </span>
                              ) : 'None'}
                            </p>
                            <p><span className="font-medium">Signed Up:</span> {formatDate(client.created_at)}</p>
                          </div>
                        </div>

                        {/* Module progress */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" /> Module Progress
                          </h3>
                          {expandedData.modules.length === 0 ? (
                            <p className="text-sm text-gray-400">No modules started</p>
                          ) : (
                            <div className="space-y-1">
                              {Array.from({ length: 10 }, (_, i) => {
                                const mid = `module-${String(i + 1).padStart(2, '0')}`
                                const mp = expandedData.modules.find(m => m.module_id === mid)
                                const lessonsInMod = expandedData.lessons.filter(l => l.module_id === mid)
                                const completedLessons = lessonsInMod.filter(l => l.status === 'completed').length
                                const totalXP = lessonsInMod.reduce((sum, l) => sum + l.xp_earned, 0)

                                return (
                                  <div key={mid} className="flex items-center gap-2 text-xs">
                                    <span className={cn(
                                      'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                                      mp?.status === 'completed' ? 'bg-soft-green text-white' :
                                      mp?.status === 'in_progress' ? 'bg-fresh-blue text-white' :
                                      'bg-gray-200 text-gray-400'
                                    )}>
                                      {i + 1}
                                    </span>
                                    <span className="flex-1 text-gray-600">
                                      {completedLessons > 0 ? `${completedLessons} lessons` : '—'}
                                    </span>
                                    <span className="text-gray-400">{totalXP > 0 ? `${totalXP} XP` : ''}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            🏅 Badges ({expandedData.badges.length})
                          </h3>
                          {expandedData.badges.length === 0 ? (
                            <p className="text-sm text-gray-400">No badges earned</p>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {expandedData.badges.map(b => (
                                <span
                                  key={b.badge_slug}
                                  className="inline-block px-2 py-1 bg-warm-amber/10 text-warm-amber rounded-full text-xs font-medium"
                                  title={`Earned ${formatDate(b.earned_at)}`}
                                >
                                  {b.badge_slug}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
