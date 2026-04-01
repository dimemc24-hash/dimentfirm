import { Suspense, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Gamepad2, ArrowLeft, Loader2, Wrench } from 'lucide-react'
import { getGameBySlug } from '../../games'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useXP } from '../../hooks/useXP'
import type { ChapterPath } from '../../types/database'

export default function Game() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { awardXP } = useXP(profile)

  const game = slug ? getGameBySlug(slug) : undefined
  const chapterPath: ChapterPath = profile?.chapter_path ?? 'ch7'

  const handleComplete = useCallback(async (score: number) => {
    if (!game) return
    // Award XP proportional to score
    const maxScore = 1000 // Normalized
    const xpEarned = Math.round((Math.min(score, maxScore) / maxScore) * game.xpAvailable)
    if (xpEarned > 0) {
      await awardXP(xpEarned, 'game', game.slug)
    }
  }, [game, awardXP])

  // ── Game not found ─────────────────────────────────────────────────
  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Gamepad2 className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Game not found</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find a game called "{slug}". Head back to the dashboard to see available games.
        </p>
        <Link
          to="/academy/dashboard"
          className="px-5 py-2.5 bg-fresh-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // ── Game not yet built ─────────────────────────────────────────────
  if (!game.component) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-4xl">{game.icon}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h2>
        <p className="text-gray-500 mb-2 max-w-md">{game.description}</p>
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-6">
          <Wrench className="w-4 h-4" />
          <span className="text-sm font-semibold">Coming soon — still being built!</span>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/academy/module/${game.moduleSlug}`}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Back to Module
          </Link>
          <Link
            to="/academy/dashboard"
            className="px-5 py-2.5 bg-fresh-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // ── Render the game ────────────────────────────────────────────────
  const GameComponent = game.component

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-fresh-blue animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Loading {game.title}...</p>
        </div>
      }
    >
      <GameComponent
        onComplete={handleComplete}
        chapterPath={chapterPath}
      />
    </Suspense>
  )
}
