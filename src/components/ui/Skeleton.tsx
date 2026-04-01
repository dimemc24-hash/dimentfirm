/**
 * Skeleton — reusable loading placeholder for better perceived performance on mobile.
 * Use in Dashboard, Lesson, Module, Profile pages during data fetches.
 */

import { cn } from '../../lib/cn'

interface SkeletonProps {
  className?: string
  /** Number of lines to render */
  lines?: number
  /** Show as circle (for avatars) */
  circle?: boolean
}

export function Skeleton({ className, lines, circle }: SkeletonProps) {
  if (circle) {
    return (
      <div className={cn('rounded-full bg-gray-200 animate-pulse', className)} />
    )
  }

  if (lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-gray-200 rounded-lg animate-pulse',
              i === lines - 1 ? 'w-3/4' : 'w-full',
              className,
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('bg-gray-200 rounded-lg animate-pulse', className)} />
  )
}

/** Dashboard skeleton — shows while profile/XP/streak data loads */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Mascot greeting */}
      <div className="rounded-2xl border-2 border-gray-100 p-4">
        <div className="flex gap-3">
          <Skeleton circle className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* XP card */}
      <div className="rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between mb-3">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Continue button */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl border border-gray-100 p-4">
            <Skeleton className="h-9 w-9 rounded-lg mb-2" />
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Course progress */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Lesson skeleton — shows while content loads */
export function LessonSkeleton() {
  return (
    <div className="animate-in fade-in">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-3 w-48 mb-2" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>

      {/* Content blocks */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton lines={4} />
        <div className="rounded-2xl border-2 border-gray-100 p-4">
          <div className="flex gap-3">
            <Skeleton circle className="w-12 h-12" />
            <Skeleton lines={2} className="flex-1" />
          </div>
        </div>
        <Skeleton lines={5} />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton lines={3} />
      </div>
    </div>
  )
}

/** Module skeleton — shows while module data loads */
export function ModuleSkeleton() {
  return (
    <div className="animate-in fade-in">
      <Skeleton className="h-4 w-24 mb-6" />

      {/* Header */}
      <div className="rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4 mt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <Skeleton className="h-6 w-20 mb-4" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
            <Skeleton circle className="w-6 h-6" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
