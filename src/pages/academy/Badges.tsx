import { useMemo } from 'react'
import { Award, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useBadges, BADGE_CATALOG, TOTAL_BADGES } from '../../hooks/useBadges'
import { cn } from '../../lib/cn'

const MODULE_NAMES: Record<number, string> = {
  1: 'Welcome & Orientation',
  2: 'Your Money Story',
  3: 'Budget Foundations',
  4: 'Cash Flow Mastery',
  5: 'Emergency Savings',
  6: 'Emotional Recovery',
  7: 'Credit Rebuilding',
  8: 'Predatory Lending',
  9: 'Income Growth',
  10: 'Your Road Map',
}

// Group badges by category for display
function getCategory(badge: typeof BADGE_CATALOG[number]): string {
  if (badge.module !== null) return `Module ${badge.module}`
  if (badge.slug.startsWith('streak-')) return 'Streaks'
  if (['first-game', 'arcade-explorer', 'three-star-player', 'perfect-run'].includes(badge.slug)) return 'Games'
  return 'Special'
}

export default function Badges() {
  const { user } = useAuth()
  const { earned, loading, earnedCount, isEarned } = useBadges(user?.id)

  // Build earned-at lookup
  const earnedAtMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const b of earned) {
      map[b.badge_slug] = new Date(b.earned_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    }
    return map
  }, [earned])

  // Group badges
  const grouped = useMemo(() => {
    const groups: Record<string, typeof BADGE_CATALOG[number][]> = {}
    for (const badge of BADGE_CATALOG) {
      const cat = getCategory(badge)
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(badge)
    }
    return groups
  }, [])

  // Ordered group keys: Module 1-10, then Streaks, Games, Special
  const groupOrder = useMemo(() => {
    const moduleKeys = Object.keys(grouped)
      .filter(k => k.startsWith('Module'))
      .sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]))
    const other = ['Streaks', 'Games', 'Special'].filter(k => grouped[k])
    return [...moduleKeys, ...other]
  }, [grouped])

  const progressPct = TOTAL_BADGES > 0 ? Math.round((earnedCount / TOTAL_BADGES) * 100) : 0

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400">Loading your badges…</div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badge Collection</h1>
        <p className="text-gray-500">
          {earnedCount} of {TOTAL_BADGES} badges earned
        </p>

        {/* Progress bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{earnedCount} earned</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-warm-amber to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badge groups */}
      {groupOrder.map(groupName => {
        const badges = grouped[groupName]
        if (!badges) return null

        const moduleNum = groupName.startsWith('Module') ? parseInt(groupName.split(' ')[1]) : null
        const subtitle = moduleNum ? MODULE_NAMES[moduleNum] : undefined

        return (
          <div key={groupName}>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-800">{groupName}</h2>
              {subtitle && (
                <p className="text-sm text-gray-400">{subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.map(badge => {
                const unlocked = isEarned(badge.slug)
                const earnedDate = earnedAtMap[badge.slug]

                return (
                  <div
                    key={badge.slug}
                    className={cn(
                      'relative rounded-xl border p-4 text-center transition-all duration-300',
                      unlocked
                        ? 'bg-white border-warm-amber/30 shadow-sm hover:shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      'text-3xl mb-2 transition-transform',
                      unlocked ? 'grayscale-0 scale-100' : 'grayscale scale-90'
                    )}>
                      {unlocked ? badge.icon : (
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mx-auto">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <p className={cn(
                      'text-sm font-medium',
                      unlocked ? 'text-gray-900' : 'text-gray-400'
                    )}>
                      {badge.name}
                    </p>

                    {/* Earned date or locked label */}
                    {unlocked ? (
                      <p className="text-[10px] text-warm-amber mt-1">{earnedDate}</p>
                    ) : (
                      <p className="text-[10px] text-gray-300 mt-1">Locked</p>
                    )}

                    {/* Earned glow */}
                    {unlocked && (
                      <div className="absolute inset-0 rounded-xl ring-2 ring-warm-amber/20 pointer-events-none" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Encouragement */}
      {earnedCount === 0 && (
        <div className="text-center py-8 bg-amber-50/50 rounded-xl border border-amber-100">
          <Award className="w-10 h-10 text-warm-amber mx-auto mb-2" />
          <p className="text-gray-700 font-medium">Your badge journey starts here!</p>
          <p className="text-sm text-gray-500 mt-1">
            Complete lessons, play games, and build streaks to earn badges.
          </p>
        </div>
      )}

      {earnedCount === TOTAL_BADGES && (
        <div className="text-center py-8 bg-gradient-to-br from-warm-amber/10 to-amber-100/50 rounded-xl border border-warm-amber/30">
          <span className="text-4xl">🎓</span>
          <p className="text-gray-900 font-bold text-lg mt-2">Congratulations!</p>
          <p className="text-sm text-gray-600 mt-1">
            You've earned every single badge. You're a true Fresh Start champion!
          </p>
        </div>
      )}
    </div>
  )
}
