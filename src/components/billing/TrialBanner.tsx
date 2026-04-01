import { Link } from 'react-router-dom'
import { Clock, Sparkles } from 'lucide-react'
import { cn } from '../../lib/cn'

interface TrialBannerProps {
  daysLeft: number
}

export function TrialBanner({ daysLeft }: TrialBannerProps) {
  // Don't show if more than 14 days (shouldn't happen but guard)
  if (daysLeft > 14) return null

  const isUrgent = daysLeft <= 3
  const isExpiring = daysLeft <= 1

  return (
    <div className={cn(
      'rounded-2xl p-4 border-2 transition-colors',
      isExpiring
        ? 'bg-amber-50 border-amber-200'
        : isUrgent
          ? 'bg-blue-50 border-blue-200'
          : 'bg-emerald-50 border-emerald-200',
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
          isExpiring ? 'bg-amber-100' : isUrgent ? 'bg-blue-100' : 'bg-emerald-100',
        )}>
          {isExpiring ? (
            <Clock className={cn('w-5 h-5', isExpiring ? 'text-amber-600' : 'text-blue-600')} />
          ) : (
            <Sparkles className="w-5 h-5 text-emerald-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-semibold',
            isExpiring ? 'text-amber-800' : isUrgent ? 'text-blue-800' : 'text-emerald-800',
          )}>
            {isExpiring
              ? 'Your trial ends tomorrow'
              : daysLeft === 0
                ? 'Your trial has ended'
                : `${daysLeft} days left in your free trial`}
          </p>
          <p className={cn(
            'text-xs mt-0.5',
            isExpiring ? 'text-amber-600' : isUrgent ? 'text-blue-600' : 'text-emerald-600',
          )}>
            {daysLeft > 3
              ? "Enjoy full access to all course content. No charge until your trial ends."
              : daysLeft > 0
                ? "Add a payment method to keep learning without interruption."
                : "Subscribe to continue your financial education journey."}
          </p>
        </div>

        {daysLeft <= 3 && (
          <Link
            to="/academy/billing"
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors',
              isExpiring
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-blue-500 text-white hover:bg-blue-600',
            )}
          >
            {daysLeft === 0 ? 'Subscribe' : 'Add Card'}
          </Link>
        )}
      </div>
    </div>
  )
}
