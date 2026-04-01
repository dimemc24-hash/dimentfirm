/**
 * StreakNotification — Animated popup for streaks, combos, and milestones.
 *
 * Shows a brief notification with scale-in animation, then fades out.
 */

import { useState, useEffect } from 'react'
import { cn } from '../../lib/cn'

interface StreakNotificationProps {
  /** Current streak count (0 = hidden) */
  streak: number
  /** Label for what's being streaked */
  label?: string
  /** Optional extra message like "New Personal Best!" */
  message?: string
  /** Color theme */
  variant?: 'fire' | 'ice' | 'gold'
}

const variantStyles = {
  fire: { bg: 'bg-orange-500', text: 'text-white', emoji: '🔥' },
  ice: { bg: 'bg-blue-500', text: 'text-white', emoji: '❄️' },
  gold: { bg: 'bg-amber-400', text: 'text-amber-900', emoji: '⭐' },
}

export function StreakNotification({ streak, label = 'Streak', message, variant = 'fire' }: StreakNotificationProps) {
  const [visible, setVisible] = useState(false)
  const [displayStreak, setDisplayStreak] = useState(0)

  useEffect(() => {
    if (streak > 0 && streak !== displayStreak) {
      setDisplayStreak(streak)
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [streak, displayStreak])

  if (!visible || streak <= 0) return null

  const style = variantStyles[variant]

  return (
    <div className={cn(
      'fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none',
      'transition-all duration-300',
      visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
    )}>
      <div className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg',
        style.bg, style.text,
      )}>
        <span className="text-lg">{style.emoji}</span>
        <span className="font-bold text-sm">{streak}× {label}!</span>
        {message && <span className="text-xs opacity-90">· {message}</span>}
      </div>
    </div>
  )
}

/**
 * MilestonePopup — Appears briefly for achievements.
 */
interface MilestonePopupProps {
  show: boolean
  icon: string
  title: string
  subtitle?: string
}

export function MilestonePopup({ show, icon, title, subtitle }: MilestonePopupProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className={cn(
      'fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none',
      'transition-all duration-500',
      visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 -translate-y-4',
    )}>
      <div className="bg-white border-2 border-amber-200 rounded-2xl shadow-xl px-6 py-4 text-center min-w-[200px]">
        <div className="text-3xl mb-1">{icon}</div>
        <p className="font-bold text-gray-900 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
