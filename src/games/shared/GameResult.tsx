import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Zap, RotateCcw, Home, Star, Trophy, Infinity as InfinityIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useHighScores } from './useHighScores'

interface GameResultProps {
  title: string
  score: number
  maxScore: number
  xpEarned: number
  badgeEarned?: { name: string; icon: string } | null
  onReplay?: () => void
  /** Callback for "Keep Playing" / endless mode. If provided, shows the button. */
  onKeepPlaying?: () => void
  moduleSlug?: string
  /** Game slug for high score tracking */
  gameSlug?: string
}

function getGrade(pct: number): { letter: string; color: string; message: string } {
  if (pct >= 95) return { letter: 'A+', color: 'text-emerald-600', message: 'Outstanding! You absolutely crushed it!' }
  if (pct >= 90) return { letter: 'A', color: 'text-emerald-600', message: 'Excellent work! You really know your stuff.' }
  if (pct >= 80) return { letter: 'B', color: 'text-blue-600', message: 'Great job! Solid understanding all around.' }
  if (pct >= 70) return { letter: 'C', color: 'text-amber-600', message: 'Good effort! Review the module to sharpen up.' }
  if (pct >= 60) return { letter: 'D', color: 'text-orange-600', message: 'Getting there! A second playthrough will help a lot.' }
  return { letter: 'F', color: 'text-gray-500', message: "Don't worry — every expert started somewhere. Try again!" }
}

function getStars(pct: number): number {
  if (pct >= 90) return 3
  if (pct >= 70) return 2
  if (pct >= 40) return 1
  return 0
}

export function GameResult({
  title,
  score,
  maxScore,
  xpEarned,
  badgeEarned,
  onReplay,
  onKeepPlaying,
  moduleSlug,
  gameSlug,
}: GameResultProps) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const grade = getGrade(pct)
  const stars = getStars(pct)

  // High scores
  const highScores = useHighScores(gameSlug ?? title, maxScore)
  const [scoreResult, setScoreResult] = useState<{ isNewBest: boolean; rank: number; streak: number } | null>(null)

  // Animated score counter
  const [displayScore, setDisplayScore] = useState(0)
  const [showGrade, setShowGrade] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const [showHighScores, setShowHighScores] = useState(false)

  // Submit score once on mount
  useEffect(() => {
    const result = highScores.submitScore(score)
    setScoreResult(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Animate score counting up
    const duration = 1200
    const steps = 30
    const stepTime = duration / steps
    const increment = score / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const current = Math.min(Math.round(increment * step), score)
      setDisplayScore(current)
      if (step >= steps) {
        clearInterval(timer)
        setDisplayScore(score)
        setTimeout(() => setShowGrade(true), 200)
        setTimeout(() => setShowXP(true), 600)
        setTimeout(() => setShowBadge(true), 1000)
        setTimeout(() => setShowHighScores(true), 1400)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="max-w-sm mx-auto text-center py-8">
      {/* Title */}
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Complete!</h2>

      {/* New Personal Best banner */}
      {scoreResult?.isNewBest && (
        <div className="mb-4 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-xl px-4 py-2 animate-pulse">
          <span className="text-sm font-bold text-amber-700">🎉 NEW PERSONAL BEST!</span>
        </div>
      )}

      {/* Score circle */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#9ca3af'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 tabular-nums">{displayScore}</span>
          <span className="text-xs text-gray-400">of {maxScore}</span>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center justify-center gap-1 mb-4">
        {[1, 2, 3].map(i => (
          <Star
            key={i}
            className={cn(
              'w-8 h-8 transition-all duration-300',
              i <= stars
                ? 'text-amber-400 fill-amber-400 scale-100'
                : 'text-gray-200 scale-90',
            )}
            style={{ transitionDelay: `${i * 200}ms` }}
          />
        ))}
      </div>

      {/* Grade */}
      <div className={cn(
        'transition-all duration-300',
        showGrade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}>
        <span className={cn('text-5xl font-black', grade.color)}>{grade.letter}</span>
        <p className="text-sm text-gray-500 mt-2 px-4">{grade.message}</p>
      </div>

      {/* Play streak */}
      {scoreResult && scoreResult.streak >= 2 && (
        <div className={cn(
          'mt-3 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 transition-all duration-300',
          showGrade ? 'opacity-100' : 'opacity-0',
        )}>
          <span className="text-sm">🔥</span>
          <span className="text-xs font-bold text-orange-700">{scoreResult.streak}-game streak!</span>
        </div>
      )}

      {/* XP earned */}
      <div className={cn(
        'mt-6 inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-5 py-2.5 transition-all duration-300',
        showXP ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
      )}>
        <Zap className="w-5 h-5 text-purple-500" />
        <span className="font-bold text-purple-700">+{xpEarned} XP earned!</span>
      </div>

      {/* Badge earned */}
      {badgeEarned && (
        <div className={cn(
          'mt-4 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 transition-all duration-500',
          showBadge ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
        )}>
          <p className="text-xs text-amber-600 font-bold uppercase tracking-wide mb-1">Badge Earned!</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{badgeEarned.icon}</span>
            <span className="font-bold text-amber-800">{badgeEarned.name}</span>
          </div>
        </div>
      )}

      {/* High Scores leaderboard */}
      {highScores.totalPlays > 1 && (
        <div className={cn(
          'mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-500',
          showHighScores ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Top Scores</p>
          </div>
          <div className="space-y-1">
            {highScores.scores.slice(0, 3).map((entry, idx) => (
              <div key={idx} className={cn(
                'flex items-center justify-between px-3 py-1.5 rounded-lg text-xs',
                idx === 0 ? 'bg-amber-50' : 'bg-white',
              )}>
                <span className="font-bold text-gray-400 w-6">#{idx + 1}</span>
                <span className="font-bold text-gray-900">{entry.score}/{maxScore}</span>
                <span className={cn('font-bold',
                  entry.grade.startsWith('A') ? 'text-emerald-600' :
                  entry.grade === 'B' ? 'text-blue-600' :
                  entry.grade === 'C' ? 'text-amber-600' : 'text-gray-400',
                )}>{entry.grade}</span>
                <span className="text-gray-400">{entry.date}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2">{highScores.totalPlays} total plays</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-8 space-y-3">
        {/* Keep Playing button — for endless-eligible games */}
        {onKeepPlaying && (
          <button
            onClick={onKeepPlaying}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
          >
            <InfinityIcon className="w-4 h-4" />
            Keep Playing — Endless Mode
          </button>
        )}

        {onReplay && (
          <button
            onClick={onReplay}
            className="w-full flex items-center justify-center gap-2 bg-fresh-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        )}

        <Link
          to={moduleSlug ? `/module/${moduleSlug}` : '/dashboard'}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          {moduleSlug ? 'Back to Module' : 'Back to Dashboard'}
        </Link>
      </div>
    </div>
  )
}
