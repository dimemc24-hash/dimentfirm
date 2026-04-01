import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Gamepad2, Trophy, Flame, Zap, ChevronRight,
  CheckCircle, Lock, ArrowRight,
} from 'lucide-react'
import { MascotDialogue } from '../../components/course/MascotDialogue'
import { TrialBanner } from '../../components/billing/TrialBanner'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useXP } from '../../hooks/useXP'
import { useStreak } from '../../hooks/useStreak'
import { useModuleProgress } from '../../hooks/useProgress'
import { useBadges, BADGE_CATALOG, TOTAL_BADGES } from '../../hooks/useBadges'
import { useSubscription } from '../../hooks/useSubscription'
import { getModuleList } from '../../lib/content-loader'
import { cn } from '../../lib/cn'
import type { ChapterPath } from '../../types/database'

// ── Game definitions ─────────────────────────────────────────────────

const GAMES = [
  { slug: 'belief-trap', name: 'The Belief Trap', module: 2, icon: '💡' },
  { slug: 'budget-crisis', name: 'Budget Crisis', module: 3, icon: '💰' },
  { slug: 'envelope-challenge', name: 'Envelope Challenge', module: 4, icon: '✉️' },
  { slug: 'savings-sprint', name: 'Savings Sprint', module: 5, icon: '🏃' },
  { slug: 'credit-score-sim', name: 'Credit Score Sim', module: 7, icon: '📈' },
  { slug: 'predatory-lending-detector', name: 'Predatory Detector', module: 8, icon: '🔍' },
  { slug: 'gig-economy-sim', name: 'Gig Economy Sim', module: 9, icon: '🧭' },
]

// ── Streak milestones ────────────────────────────────────────────────

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90]

// ── Dashboard ────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { totalXP, level, levelName, nextLevel } = useXP(profile)
  const { streak } = useStreak(user?.id)
  const { modules: moduleProgress, getModuleStatus } = useModuleProgress(user?.id)
  const { earnedCount, isEarned } = useBadges(user?.id)
  const { isTrialing, trialDaysLeft } = useSubscription(user?.id)

  const chapterPath: ChapterPath = profile?.chapter_path ?? 'ch7'
  const moduleList = getModuleList()
  const currentStreak = streak?.current_streak ?? 0
  const longestStreak = streak?.longest_streak ?? 0

  // Find the next incomplete lesson for the "Continue" button
  const continueLink = useMemo(() => {
    for (const mod of moduleList) {
      const status = getModuleStatus(mod.id)
      if (status === 'available' || status === 'in_progress') {
        return `/academy/module/${mod.id}`
      }
    }
    // All modules locked or completed — go to first module
    return '/academy/module/01-fresh-start'
  }, [moduleList, getModuleStatus])

  // Count completed modules and lessons
  const completedModules = moduleProgress.filter(m => m.status === 'completed').length

  // Time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    const name = profile?.display_name?.split(' ')[0] ?? 'there'
    if (hour < 12) return `Good morning, ${name}!`
    if (hour < 17) return `Good afternoon, ${name}!`
    return `Good evening, ${name}!`
  }, [profile])

  // Mascot message
  const mascotMessage = useMemo(() => {
    if (completedModules === 10) return "You did it! You've completed the entire course. I'm so proud of you!"
    if (currentStreak >= 7) return `${currentStreak}-day streak! You're on fire! Consistency like this changes lives.`
    if (totalXP === 0) return "Welcome! Ready to start your journey? Every expert was once a beginner."
    if (completedModules >= 5) return "Over halfway through! You're building real skills that will last a lifetime."
    return `${greeting} Let's keep building your financial future together!`
  }, [completedModules, currentStreak, totalXP, greeting])

  return (
    <div className="space-y-6 pb-16">
      {/* Trial banner */}
      {isTrialing && <TrialBanner daysLeft={trialDaysLeft} />}

      {/* A. Mascot Greeting */}
      <MascotDialogue
        mascotType={chapterPath === 'ch7' ? 'ch7' : 'ch13'}
        message={mascotMessage}
      />

      {/* B. Progress Overview — XP & Level */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Level {level}</p>
            <p className="text-lg font-bold text-gray-900">{levelName}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">{totalXP.toLocaleString()} XP</span>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${nextLevel.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>{nextLevel.current} / {nextLevel.needed} XP to next level</span>
          <span>{nextLevel.progress}%</span>
        </div>
      </div>

      {/* Continue Button */}
      <Link
        to={continueLink}
        className="flex items-center justify-between w-full bg-gradient-to-r from-fresh-blue to-blue-600 text-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
      >
        <div>
          <p className="text-sm font-medium text-blue-100">Ready to learn?</p>
          <p className="text-lg font-bold">Continue Where You Left Off</p>
        </div>
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          value={totalXP.toLocaleString()}
          label="Total XP"
          color="text-amber-500"
          bg="bg-amber-50"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          value={`${earnedCount}/${TOTAL_BADGES}`}
          label="Badges"
          color="text-purple-500"
          bg="bg-purple-50"
        />
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          value={String(currentStreak)}
          label="Day Streak"
          color="text-orange-500"
          bg="bg-orange-50"
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          value={`${completedModules}/${moduleList.length}`}
          label="Modules"
          color="text-emerald-500"
          bg="bg-emerald-50"
        />
      </div>

      {/* C. Streak Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Streak Tracker
          </h2>
          {longestStreak > 0 && (
            <span className="text-xs text-gray-400">Best: {longestStreak} days</span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STREAK_MILESTONES.map(milestone => {
            const reached = currentStreak >= milestone
            return (
              <div
                key={milestone}
                className={cn(
                  'flex flex-col items-center min-w-[4rem] py-2 px-3 rounded-xl border-2 transition-colors',
                  reached
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-100 bg-gray-50 opacity-50',
                )}
              >
                <span className={cn('text-lg', reached ? '' : 'grayscale')}>
                  {reached ? '🔥' : '⬜'}
                </span>
                <span className={cn(
                  'text-xs font-bold mt-1',
                  reached ? 'text-orange-600' : 'text-gray-400',
                )}>
                  {milestone}d
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* D. Course Progress Map */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Progress</h2>
        <div className="space-y-2">
          {moduleList.map(mod => {
            const status = getModuleStatus(mod.id)
            const isCompleted = status === 'completed'
            const isLocked = status === 'locked'

            // For new users: first module is always available
            const effectiveStatus = mod.order === 1 && status === 'locked' ? 'available' : status
            const showAsActive = effectiveStatus === 'available' || effectiveStatus === 'in_progress'

            const isClickable = showAsActive || isCompleted
            const Component = isClickable ? Link : 'div' as unknown as typeof Link

            return (
              <Component
                key={mod.id}
                to={isClickable ? `/academy/module/${mod.id}` : '' as never}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border-2 transition-all group',
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300'
                    : showAsActive
                      ? 'border-fresh-blue/30 bg-white hover:border-fresh-blue hover:shadow-sm'
                      : 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed',
                )}
              >
                {/* Module number / status */}
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0',
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : showAsActive
                      ? 'bg-fresh-blue text-white'
                      : 'bg-gray-200 text-gray-400',
                )}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isLocked && mod.order !== 1 ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    mod.order
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-semibold text-sm truncate',
                    isCompleted ? 'text-emerald-700' : 'text-gray-900',
                  )}>
                    {mod.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                    <span>{mod.lesson_count} lessons</span>
                    <span>·</span>
                    <span>{mod.xp_total.toLocaleString()} XP</span>
                    {mod.game && (
                      <>
                        <span>·</span>
                        <span className="text-purple-400">🎮 Game</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                {!isLocked || mod.order === 1 ? (
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-fresh-blue transition-colors flex-shrink-0" />
                ) : null}
              </Component>
            )
          })}
        </div>
      </div>

      {/* E. Badge Collection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Badge Collection
          </h2>
          <Link
            to="/academy/badges"
            className="text-sm font-semibold text-fresh-blue hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-4">
            {earnedCount} of {TOTAL_BADGES} badges earned
          </p>

          {/* Badge progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all"
              style={{ width: `${(earnedCount / TOTAL_BADGES) * 100}%` }}
            />
          </div>

          {/* Badge grid — show first 12 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {BADGE_CATALOG.slice(0, 16).map(badge => {
              const earned = isEarned(badge.slug)
              return (
                <div
                  key={badge.slug}
                  className={cn(
                    'flex flex-col items-center justify-center p-2 rounded-xl transition-all',
                    earned
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-gray-50 border border-gray-100 opacity-40 grayscale',
                  )}
                  title={earned ? badge.name : `${badge.name} — not yet earned`}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 truncate w-full text-center">
                    {earned ? badge.name : '???'}
                  </span>
                </div>
              )
            })}
          </div>

          {TOTAL_BADGES > 16 && (
            <Link
              to="/academy/badges"
              className="block text-center text-sm text-fresh-blue font-medium mt-3 hover:underline"
            >
              + {TOTAL_BADGES - 16} more badges
            </Link>
          )}
        </div>
      </div>

      {/* G. Arcade Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-purple-500" />
          Game Arcade
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GAMES.map(game => {
            const moduleStatus = getModuleStatus(
              moduleList.find(m => m.order === game.module)?.id ?? '',
            )
            const unlocked = moduleStatus === 'completed' || moduleStatus === 'in_progress'

            const Component = unlocked ? Link : 'div' as unknown as typeof Link

            return (
              <Component
                key={game.slug}
                to={unlocked ? `/academy/game/${game.slug}` : '' as never}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 transition-all group',
                  unlocked
                    ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-300 hover:shadow-sm'
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed',
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0',
                  unlocked ? 'bg-purple-500 text-white' : 'bg-gray-200',
                )}>
                  {unlocked ? game.icon : <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-semibold text-sm',
                    unlocked ? 'text-gray-900' : 'text-gray-400',
                  )}>
                    {game.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {unlocked ? 'Up to 300 XP' : `Complete Module ${game.module} to unlock`}
                  </p>
                </div>
                {unlocked && (
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                )}
              </Component>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Stat card sub-component ──────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode
  value: string
  label: string
  color: string
  bg: string
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', bg, color)}>
        {icon}
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
