/**
 * LessonMobileNav — sticky bottom navigation bar for lesson pages on mobile.
 * Shows prev/next lesson buttons and progress indicator.
 * Only visible on mobile (hidden on lg+ where the inline nav is sufficient).
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

interface LessonMobileNavProps {
  moduleId: string
  lessonNum: number
  totalLessons: number
}

export function LessonMobileNav({ moduleId, lessonNum, totalLessons }: LessonMobileNavProps) {
  const hasPrev = lessonNum > 1
  const hasNext = lessonNum < totalLessons
  const progress = Math.round((lessonNum / totalLessons) * 100)

  return (
    <div
      className="lg:hidden fixed bottom-[56px] left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-1px_6px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Thin progress bar on top */}
      <div className="h-0.5 bg-gray-100">
        <div
          className="h-full bg-fresh-blue transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-3 py-2">
        {/* Previous */}
        {hasPrev ? (
          <Link
            to={`/module/${moduleId}/lesson/${lessonNum - 1}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 active:bg-gray-100 transition-colors touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Prev</span>
          </Link>
        ) : (
          <Link
            to={`/module/${moduleId}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 active:bg-gray-100 transition-colors touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Module</span>
          </Link>
        )}

        {/* Center: lesson indicator */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalLessons }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'rounded-full transition-all',
                i + 1 === lessonNum
                  ? 'w-6 h-1.5 bg-fresh-blue'
                  : i + 1 < lessonNum
                    ? 'w-1.5 h-1.5 bg-fresh-blue/40'
                    : 'w-1.5 h-1.5 bg-gray-200',
              )}
            />
          ))}
        </div>

        {/* Next */}
        {hasNext ? (
          <Link
            to={`/module/${moduleId}/lesson/${lessonNum + 1}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-fresh-blue text-white active:bg-blue-700 transition-colors touch-target"
          >
            <span className="hidden xs:inline">Next</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to={`/module/${moduleId}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-green-600 text-white active:bg-green-700 transition-colors touch-target"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Done</span>
          </Link>
        )}
      </div>
    </div>
  )
}
