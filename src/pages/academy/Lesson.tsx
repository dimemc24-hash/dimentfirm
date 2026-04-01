import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, BookOpen } from 'lucide-react'
import { ContentRenderer } from '../../components/course/ContentRenderer'
import { InsightQuiz } from '../../components/course/InsightQuiz'
import { StudyGuide } from '../../components/course/StudyGuide'
import { LessonMobileNav } from '../../components/course/LessonMobileNav'
// LessonSkeleton available for future use: import { LessonSkeleton } from '../../components/ui/Skeleton'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useXP } from '../../hooks/useXP'
import { supabase } from '../../lib/supabase'
import { useSwipeNav } from '../../hooks/useSwipeNav'
import { INSIGHT_QUIZZES, STUDY_GUIDES } from '../../data/moduleEnrichment'
import { loadModuleContent, extractLessonContent, getModuleById } from '../../lib/content-loader'
import { cn } from '../../lib/cn'
import type { ChapterPath } from '../../types/database'

export default function Lesson() {
  const { id: moduleId, lid: lessonId } = useParams<{ id: string; lid: string }>()
  const navigate = useNavigate()

  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { awardXP } = useXP(profile)

  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const chapterPath: ChapterPath = profile?.chapter_path ?? 'ch7'

  const moduleMeta = moduleId ? getModuleById(moduleId) : null
  const lessonNum = lessonId ? parseInt(lessonId) : 1
  const currentLessonMeta = moduleMeta?.lessons[lessonNum - 1] ?? null
  const totalLessons = moduleMeta?.lessons.length ?? 0
  const hasPrev = lessonNum > 1
  const hasNext = lessonNum < totalLessons

  // Swipe navigation on mobile (left = next, right = prev)
  const swipeRef = useSwipeNav<HTMLDivElement>({
    onSwipeLeft: useCallback(() => {
      if (hasNext && moduleId) navigate(`/academy/module/${moduleId}/lesson/${lessonNum + 1}`)
    }, [hasNext, moduleId, lessonNum, navigate]),
    onSwipeRight: useCallback(() => {
      if (hasPrev && moduleId) navigate(`/academy/module/${moduleId}/lesson/${lessonNum - 1}`)
    }, [hasPrev, moduleId, lessonNum, navigate]),
    enabled: !loading && !!content,
  })

  // Scroll to top when navigating between lessons
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [moduleId, lessonId])

  useEffect(() => {
    if (!moduleId) return

    setLoading(true)
    setError(null)

    loadModuleContent(moduleId)
      .then(md => {
        if (!md) {
          setError('Could not load module content. Please try again.')
          return
        }

        const lessonMd = extractLessonContent(md, lessonNum)
        if (!lessonMd) {
          setError(`Lesson ${lessonNum} not found in this module.`)
          return
        }

        setContent(lessonMd)
      })
      .catch(() => {
        setError('Something went wrong loading this lesson.')
      })
      .finally(() => setLoading(false))
  }, [moduleId, lessonNum])

  const handleQuizCorrect = useCallback((questionId: string, xp: number) => {
    console.log(`Quiz correct: ${questionId}, +${xp} XP`)
    awardXP(xp, 'quiz', questionId)
  }, [awardXP])

  const handleReflectionComplete = useCallback(async (id: string, response: string, xp: number) => {
    // Award XP for the reflection
    awardXP(xp, 'lesson', `reflection:${id}`)

    // Save the reflection response to Supabase
    try {
      if (user?.id) {
        await supabase.from('reflections').upsert({
          user_id: user.id,
          module_id: moduleId ?? '',
          lesson_num: lessonNum,
          prompt_id: id,
          response,
        }, { onConflict: 'user_id,prompt_id' })
      }
    } catch (err) {
      console.error('Failed to save reflection:', err)
    }
  }, [awardXP, user, moduleId, lessonNum])

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-fresh-blue animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading lesson...</p>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────
  if (error || !content || !moduleId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          {error ?? 'Lesson not found'}
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Don't worry — this happens sometimes. Try going back to the module overview.
        </p>
        <Link
          to={`/academy/module/${moduleId ?? '01-fresh-start'}`}
          className="px-5 py-2.5 bg-fresh-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Module
        </Link>
      </div>
    )
  }

  return (
    <div ref={swipeRef} className="pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-wrap">
        <Link to="/academy/dashboard" className="hover:text-fresh-blue transition-colors hidden sm:inline">Dashboard</Link>
        <span className="hidden sm:inline">/</span>
        <Link to={`/academy/module/${moduleId}`} className="hover:text-fresh-blue transition-colors truncate max-w-[140px] sm:max-w-none">
          {moduleMeta?.title ?? `Module ${moduleId}`}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">
          Lesson {lessonNum}{currentLessonMeta ? `: ${currentLessonMeta.title}` : ''}
        </span>
      </div>

      {/* Lesson header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span>Lesson {lessonNum} of {totalLessons}</span>
          {currentLessonMeta && (
            <>
              <span>·</span>
              <span>{currentLessonMeta.duration_min} min</span>
              <span>·</span>
              <span>{currentLessonMeta.xp_available} XP available</span>
            </>
          )}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-fresh-blue rounded-full transition-all duration-500"
            style={{ width: `${(lessonNum / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <ContentRenderer
        markdown={content}
        chapterPath={chapterPath}
        idPrefix={`${moduleId}-${lessonNum}`}
        onQuizCorrect={handleQuizCorrect}
        onReflectionComplete={handleReflectionComplete}
      />

      {/* Study Guide (shown if data exists for this module + lesson) */}
      {moduleId && STUDY_GUIDES[moduleId]?.[lessonNum] && (
        <StudyGuide
          data={STUDY_GUIDES[moduleId][lessonNum]}
          moduleId={moduleId}
          lessonNum={lessonNum}
        />
      )}

      {/* Insight Quiz (shown after the configured lesson) */}
      {moduleId && INSIGHT_QUIZZES[moduleId] && INSIGHT_QUIZZES[moduleId].afterLesson === lessonNum && (
        <div className="my-8">
          <InsightQuiz
            data={INSIGHT_QUIZZES[moduleId].quiz}
            moduleId={moduleId}
          />
        </div>
      )}

      {/* Desktop navigation (hidden on mobile — mobile uses sticky bottom bar) */}
      <div className="hidden lg:flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
        {hasPrev ? (
          <Link
            to={`/academy/module/${moduleId}/lesson/${lessonNum - 1}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Lesson
          </Link>
        ) : (
          <Link
            to={`/academy/module/${moduleId}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Module Overview
          </Link>
        )}

        {hasNext ? (
          <Link
            to={`/academy/module/${moduleId}/lesson/${lessonNum + 1}`}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              'bg-fresh-blue text-white hover:bg-blue-700',
            )}
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to={`/academy/module/${moduleId}`}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
              'bg-green-600 text-white hover:bg-green-700',
            )}
          >
            Complete Module ✓
          </Link>
        )}
      </div>

      {/* Mobile sticky lesson nav — sits above the bottom tab bar */}
      {moduleId && (
        <LessonMobileNav
          moduleId={moduleId}
          lessonNum={lessonNum}
          totalLessons={totalLessons}
        />
      )}
    </div>
  )
}
