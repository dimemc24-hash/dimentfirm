import { useState, useEffect, useCallback } from 'react'
import {
  Users, TrendingUp, BookOpen, Zap, Flame, BarChart3,
  RefreshCw, ArrowUpRight, Clock,
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { cn } from '../../../lib/cn'

interface MetricCard {
  label: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}

interface ModuleFunnel {
  module: number
  started: number
  completed: number
}

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeThisWeek, setActiveThisWeek] = useState(0)
  const [trialConversion, setTrialConversion] = useState(0)
  const [avgProgress, setAvgProgress] = useState(0)
  const [totalXPAwarded, setTotalXPAwarded] = useState(0)
  const [popularModule, setPopularModule] = useState('—')
  const [moduleFunnel, setModuleFunnel] = useState<ModuleFunnel[]>([])
  const [signupsByWeek, setSignupsByWeek] = useState<Array<{ week: string; count: number }>>([])
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'learner')
      setTotalUsers(userCount ?? 0)

      // 2. Active this week (streaks updated in last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { count: activeCount } = await supabase
        .from('streaks')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_date', weekAgo.toISOString().split('T')[0])
      setActiveThisWeek(activeCount ?? 0)

      // 3. Trial conversion rate
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('status')
      if (subs && subs.length > 0) {
        const converted = subs.filter((s: { status: string }) => s.status === 'active').length
        const total = subs.length
        setTrialConversion(total > 0 ? Math.round((converted / total) * 100) : 0)
      }

      // 4. Average progress (% of 10 modules completed)
      const { data: modProgress } = await supabase
        .from('module_progress')
        .select('user_id, status')
      if (modProgress && (userCount ?? 0) > 0) {
        const completed = modProgress.filter((m: { status: string }) => m.status === 'completed').length
        const totalPossible = (userCount ?? 1) * 10
        setAvgProgress(Math.round((completed / totalPossible) * 100))
      }

      // 5. Total XP awarded
      const { data: xpData } = await supabase
        .from('xp_ledger')
        .select('amount')
      if (xpData) {
        const total = xpData.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0)
        setTotalXPAwarded(total)
      }

      // 6. Most popular module (most 'in_progress' or 'completed')
      if (modProgress) {
        const counts: Record<string, number> = {}
        for (const m of modProgress as Array<{ user_id: string; status: string; module_id?: string }>) {
          const mid = (m as { module_id: string }).module_id
          if (mid) counts[mid] = (counts[mid] ?? 0) + 1
        }
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
        if (sorted.length > 0) {
          const topMod = sorted[0][0]
          const num = topMod.replace(/\D/g, '')
          setPopularModule(`Module ${parseInt(num, 10)}`)
        }
      }

      // 7. Module completion funnel
      if (modProgress) {
        const funnel: ModuleFunnel[] = []
        for (let i = 1; i <= 10; i++) {
          const mid = `module-${String(i).padStart(2, '0')}`
          const entries = (modProgress as Array<{ module_id?: string; status: string }>)
            .filter((m) => (m as { module_id: string }).module_id === mid)
          funnel.push({
            module: i,
            started: entries.length,
            completed: entries.filter(m => m.status === 'completed').length,
          })
        }
        setModuleFunnel(funnel)
      }

      // 8. Signups by week (last 8 weeks)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('role', 'learner')
        .order('created_at', { ascending: true })
      if (profiles) {
        const weeks: Record<string, number> = {}
        for (const p of profiles as Array<{ created_at: string }>) {
          const d = new Date(p.created_at)
          const weekStart = new Date(d)
          weekStart.setDate(d.getDate() - d.getDay())
          const key = weekStart.toISOString().split('T')[0]
          weeks[key] = (weeks[key] ?? 0) + 1
        }
        const sorted = Object.entries(weeks)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-8)
          .map(([week, count]) => ({ week, count }))
        setSignupsByWeek(sorted)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  const metrics: MetricCard[] = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: <Users className="w-5 h-5" />,
      color: 'from-fresh-blue to-blue-600',
    },
    {
      label: 'Active This Week',
      value: activeThisWeek,
      change: totalUsers > 0 ? `${Math.round((activeThisWeek / totalUsers) * 100)}%` : undefined,
      icon: <Clock className="w-5 h-5" />,
      color: 'from-soft-green to-green-600',
    },
    {
      label: 'Trial → Paid',
      value: `${trialConversion}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-warm-amber to-amber-600',
    },
    {
      label: 'Avg. Progress',
      value: `${avgProgress}%`,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'from-gentle-purple to-purple-600',
    },
    {
      label: 'Total XP Awarded',
      value: totalXPAwarded.toLocaleString(),
      icon: <Zap className="w-5 h-5" />,
      color: 'from-warm-amber to-orange-600',
    },
    {
      label: 'Most Popular',
      value: popularModule,
      icon: <Flame className="w-5 h-5" />,
      color: 'from-red-400 to-red-600',
    },
  ]

  const maxFunnelStart = Math.max(...moduleFunnel.map(m => m.started), 1)
  const maxSignup = Math.max(...signupsByWeek.map(w => w.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Course performance at a glance</p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading analytics…</div>
      ) : (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map(m => (
              <div
                key={m.label}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white', m.color)}>
                    {m.icon}
                  </div>
                  {m.change && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-soft-green">
                      <ArrowUpRight className="w-3 h-3" />
                      {m.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Signups over time */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-fresh-blue" />
                Signups by Week
              </h2>
              {signupsByWeek.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No signup data yet</p>
              ) : (
                <div className="space-y-2">
                  {signupsByWeek.map(w => (
                    <div key={w.week} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-20 flex-shrink-0 font-mono">
                        {new Date(w.week + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-fresh-blue to-blue-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((w.count / maxSignup) * 100, 8)}%` }}
                        >
                          <span className="text-[10px] text-white font-bold">{w.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Module completion funnel */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-gentle-purple" />
                Module Completion Funnel
              </h2>
              {moduleFunnel.every(m => m.started === 0) ? (
                <p className="text-sm text-gray-400 text-center py-8">No progress data yet</p>
              ) : (
                <div className="space-y-2">
                  {moduleFunnel.map(m => (
                    <div key={m.module} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 w-8 flex-shrink-0 text-right">
                        M{m.module}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                        {/* Started bar (background) */}
                        <div
                          className="absolute inset-y-0 left-0 bg-blue-200 rounded-full transition-all duration-500"
                          style={{ width: `${(m.started / maxFunnelStart) * 100}%` }}
                        />
                        {/* Completed bar (foreground) */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-soft-green to-green-400 rounded-full transition-all duration-500"
                          style={{ width: `${(m.completed / maxFunnelStart) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-14 flex-shrink-0">
                        {m.completed}/{m.started}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200" /> Started</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-soft-green" /> Completed</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* XP distribution placeholder */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-warm-amber" />
              XP Distribution
            </h2>
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
              <p>XP histogram will render here once more client data is available.</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
