import { useParams, Link } from 'react-router-dom'
import {
  BookOpen, Clock, Zap, Trophy, Gamepad2, ArrowLeft,
  CheckCircle, Circle, Lock, ChevronRight,
} from 'lucide-react'
import { getModuleById, getModuleList } from '../../lib/content-loader'
import { ModuleAssessment } from '../../components/course/ModuleAssessment'
import { MODULE_ASSESSMENTS } from '../../data/moduleEnrichment'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useLessonProgress } from '../../hooks/useProgress'
import { cn } from '../../lib/cn'
import type { ChapterPath } from '../../types/database'

export default function Module() {
  const { id: moduleId } = useParams<{ id: string }>()
  const moduleMeta = moduleId ? getModuleById(moduleId) : null
  const moduleList = getModuleList()

  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { getLessonStatus } = useLessonProgress(user?.id, moduleId ?? '')

  const chapterPath: ChapterPath = profile?.chapter_path ?? 'ch7'

  // Find adjacent modules for navigation
  const currentOrder = moduleMeta?.order ?? 0
  const prevModule = moduleList.find(m => m.order === currentOrder - 1)
  const nextModule = moduleList.find(m => m.order === currentOrder + 1)

  // Mascot for this chapter path
  const mascotName = chapterPath === 'ch7' ? 'Hariette' : 'Sheldon'
  const mascotEmoji = chapterPath === 'ch7' ? '🐇' : '🐢'
  const mascotImage = chapterPath === 'ch7'
    ? '/mascots/hariette_hare_final.png'
    : '/mascots/sheldon_tortoise_final.png'

  if (!moduleMeta || !moduleId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Module not found</h2>
        <p className="text-gray-500 mb-6">
          We couldn't find this module. Let's head back to the dashboard.
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

  return (
    <div className="pb-16">
      {/* Back to dashboard */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-fresh-blue transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All Modules
      </Link>

      {/* Module header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mb-8 border border-blue-100">
        <div className="flex items-start gap-4">
          {/* Module number badge */}
          <div className="w-14 h-14 bg-fresh-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xl font-bold">{moduleMeta.order}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {moduleMeta.title}
            </h1>
            <p className="text-gray-600 mb-4">{moduleMeta.description}</p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>{moduleMeta.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>~{moduleMeta.lessons.reduce((sum, l) => sum + l.duration_min, 0)} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <Zap className="w-4 h-4" />
                <span>{moduleMeta.xp_total} XP</span>
              </div>
              {moduleMeta.badges.length > 0 && (
                <div className="flex items-center gap-1.5 text-purple-600">
                  <Trophy className="w-4 h-4" />
                  <span>{moduleMeta.badges.length} badge{moduleMeta.badges.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mascot encouragement */}
        <div className="mt-5 flex items-center gap-3 bg-white/60 rounded-xl p-3">
          <img
            src={mascotImage}
            alt={mascotName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <p className="text-sm text-gray-600 italic">
            {mascotEmoji} "{getModuleEncouragement(moduleMeta.order, mascotName)}"
          </p>
        </div>
      </div>

      {/* Lesson list */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Lessons</h2>
        <div className="space-y-2">
          {moduleMeta.lessons.map((lesson, idx) => {
            const lessonNum = idx + 1
            const dbStatus = getLessonStatus(lesson.id)
            // Map DB LessonStatus → UI status for styling
            const status: 'completed' | 'available' | 'locked' =
              dbStatus === 'completed' ? 'completed'
                : dbStatus === 'in_progress' ? 'available'
                  : idx === 0 ? 'available' // First lesson always accessible
                    : getLessonStatus(moduleMeta.lessons[idx - 1].id) === 'completed'
                      ? 'available' // Unlock if previous is completed
                      : 'locked'

            return (
              <Link
                key={lesson.id}
                to={`/academy/module/${moduleId}/lesson/${lessonNum}`}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border-2 transition-all group',
                  status === 'completed'
                    ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                    : status === 'locked'
                      ? 'border-gray-100 bg-gray-50 opacity-60 pointer-events-none'
                      : 'border-gray-200 bg-white hover:border-fresh-blue/30 hover:shadow-sm',
                )}
              >
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : status === 'locked' ? (
                    <Lock className="w-6 h-6 text-gray-300" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 group-hover:text-fresh-blue transition-colors" />
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-semibold text-sm',
                    status === 'completed' ? 'text-green-700' : 'text-gray-900',
                  )}>
                    {lessonNum}. {lesson.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    <span>{lesson.duration_min} min</span>
                    <span>·</span>
                    <span>{lesson.xp_available} XP</span>
                    {lesson.type && (
                      <>
                        <span>·</span>
                        <span className="capitalize">{lesson.type}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-fresh-blue transition-colors flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      </div>

      {/* Game section */}
      {moduleMeta.game && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🎮 Module Game</h2>
          <Link
            to={`/academy/game/${moduleMeta.game}`}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-300 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">
                {formatGameName(moduleMeta.game)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Complete lessons first to unlock • Up to 300 XP
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
          </Link>
        </div>
      )}

      {/* Badges section */}
      {moduleMeta.badges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🏆 Badges Available</h2>
          <div className="flex flex-wrap gap-3">
            {moduleMeta.badges.map(badge => (
              <div
                key={badge}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-amber-100 bg-amber-50/50"
              >
                <span className="text-lg">🌟</span>
                <span className="text-sm font-semibold text-amber-800 capitalize">
                  {badge.replace(/-/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module Assessment (end-of-module insight assessment) */}
      {moduleId && MODULE_ASSESSMENTS[moduleId] && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Module Assessment</h2>
          <ModuleAssessment
            data={MODULE_ASSESSMENTS[moduleId]}
            moduleId={moduleId}
          />
        </div>
      )}

      {/* Module navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        {prevModule ? (
          <Link
            to={`/academy/module/${prevModule.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Module {prevModule.order}
          </Link>
        ) : (
          <div />
        )}

        {nextModule && (
          <Link
            to={`/academy/module/${nextModule.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-fresh-blue text-white hover:bg-blue-700 transition-colors"
          >
            Module {nextModule.order}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatGameName(slug: string): string {
  const names: Record<string, string> = {
    'belief-trap': 'The Belief Trap',
    'budget-crisis': 'Budget Crisis Simulator',
    'envelope-challenge': 'The Envelope Challenge',
    'savings-sprint': 'Savings Sprint',
    'credit-score-sim': 'Credit Score Simulator',
    'predatory-lending-detector': 'Predatory Lending Detector',
    'gig-economy-sim': 'Gig Economy Simulator',
  }
  return names[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getModuleEncouragement(order: number, name: string): string {
  const messages: Record<number, string> = {
    1: `Welcome! I'm ${name}, and I'll be with you every step of the way.`,
    2: `This one's personal — we're going to uncover some things about how you think about money. It's going to be eye-opening!`,
    3: `Time to build your budget! Don't worry — we'll make it practical and judgment-free.`,
    4: `Cash is king in the early days of rebuilding. Let me show you why.`,
    5: `Your emergency fund is your freedom fund. Let's start building it today.`,
    6: `This module is different — it's a quiet pause to heal. No scores, no pressure. Just you.`,
    7: `Credit rebuilding is a marathon, not a sprint. Good thing I'm great at marathons!`,
    8: `Knowledge is your best defense. After this, no predatory lender stands a chance.`,
    9: `Let's talk about growing your income — there are more options than you think!`,
    10: `The final chapter! Time to put everything together into your 12-month plan.`,
  }
  return messages[order] ?? `Let's dive into this module together!`
}
