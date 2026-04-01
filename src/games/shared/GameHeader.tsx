import { useEffect, useState } from 'react'
import { Trophy, Clock, Zap, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

interface GameHeaderProps {
  title: string
  score: number
  maxScore?: number
  /** If provided, counts down from this many seconds */
  timerSeconds?: number
  /** Fires when timer hits zero */
  onTimeUp?: () => void
  xpAvailable: number
  className?: string
}

export function GameHeader({
  title,
  score,
  maxScore,
  timerSeconds,
  onTimeUp,
  xpAvailable,
  className,
}: GameHeaderProps) {
  const [remaining, setRemaining] = useState(timerSeconds ?? 0)

  useEffect(() => {
    if (timerSeconds == null || timerSeconds <= 0) return
    setRemaining(timerSeconds)
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerSeconds, onTimeUp])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timerUrgent = timerSeconds != null && remaining <= 30

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6', className)}>
      {/* Top row: back + title */}
      <div className="flex items-center gap-3 mb-3">
        <Link
          to="/dashboard"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Score */}
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 leading-none">Score</p>
            <p className="text-sm font-bold text-gray-900">
              {score}{maxScore != null ? `/${maxScore}` : ''}
            </p>
          </div>
        </div>

        {/* Timer (optional) */}
        {timerSeconds != null && (
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center',
              timerUrgent ? 'bg-red-50' : 'bg-blue-50',
            )}>
              <Clock className={cn('w-4 h-4', timerUrgent ? 'text-red-500' : 'text-blue-500')} />
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-none">Time</p>
              <p className={cn(
                'text-sm font-bold tabular-nums',
                timerUrgent ? 'text-red-600' : 'text-gray-900',
              )}>
                {mins}:{secs.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        )}

        {/* XP available */}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 leading-none">XP</p>
            <p className="text-sm font-bold text-purple-600">{xpAvailable}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
