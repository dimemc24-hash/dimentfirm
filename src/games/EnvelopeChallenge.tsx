import { useState, useCallback, useMemo } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { cn } from '../lib/cn'
import { DollarSign, Wallet, SkipForward, PiggyBank } from 'lucide-react'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── Seeded random for reproducible "random" feel per session ─────────

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ── Daily events ─────────────────────────────────────────────────────

interface DayEvent {
  day: number
  envelopeAmount: number
  expenseName: string
  expenseAmount: number
  expenseFlavor: string
}

function generateDays(seed: number): DayEvent[] {
  const rand = seededRandom(seed)
  const expenses = [
    { name: 'Groceries', range: [30, 80], flavor: 'Weekly grocery run' },
    { name: 'Gas', range: [25, 55], flavor: 'Filling up the tank' },
    { name: 'Utility bill', range: [40, 120], flavor: 'Electric or water bill due' },
    { name: 'Medicine', range: [15, 45], flavor: 'Prescription refill' },
    { name: 'Phone bill', range: [35, 65], flavor: 'Monthly phone payment' },
    { name: 'Car repair', range: [80, 200], flavor: 'Check engine light came on' },
    { name: 'School supplies', range: [20, 50], flavor: 'Kids need supplies' },
    { name: 'Internet bill', range: [40, 70], flavor: 'Monthly internet service' },
    { name: 'Laundry', range: [10, 25], flavor: 'Laundromat day' },
    { name: 'Pet food', range: [15, 35], flavor: 'Fido needs kibble' },
    { name: 'Haircut', range: [15, 40], flavor: 'Time for a trim' },
    { name: 'Bus pass', range: [30, 60], flavor: 'Monthly transit pass' },
    { name: 'Dentist copay', range: [25, 75], flavor: 'Dental checkup copay' },
    { name: 'Birthday gift', range: [20, 50], flavor: "It's a friend's birthday" },
    { name: 'Home repair', range: [30, 100], flavor: 'Leaky faucet fix' },
  ]

  const days: DayEvent[] = []
  for (let d = 1; d <= 30; d++) {
    const exp = expenses[Math.floor(rand() * expenses.length)]
    const expAmount = Math.round(exp.range[0] + rand() * (exp.range[1] - exp.range[0]))
    const envAmount = Math.round(5 + rand() * 45) // $5 – $50
    days.push({
      day: d,
      envelopeAmount: envAmount,
      expenseName: exp.name,
      expenseAmount: expAmount,
      expenseFlavor: exp.flavor,
    })
  }
  return days
}

// ── Component ────────────────────────────────────────────────────────

type Phase = 'intro' | 'playing' | 'result'

const MONTHLY_INCOME = 2800
const XP_AVAILABLE = 150
const MAX_SCORE = 1000

export default function EnvelopeChallenge({ onComplete }: GameProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [dayIdx, setDayIdx] = useState(0)
  const [balance, setBalance] = useState(MONTHLY_INCOME)
  const [saved, setSaved] = useState(0)
  const [, setSkipped] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [lastAction, setLastAction] = useState<'save' | 'skip' | null>(null)

  const [seed] = useState(() => Math.floor(Math.random() * 10000))
  const days = useMemo(() => generateDays(seed), [seed])

  const day = days[dayIdx]
  const isLastDay = dayIdx >= days.length - 1

  const handleSave = () => {
    if (animating) return
    const totalCost = day.expenseAmount + day.envelopeAmount

    if (balance < totalCost) {
      // Can't afford both — just pay expense
      handleSkip()
      return
    }

    setAnimating(true)
    setLastAction('save')
    setBalance(prev => prev - totalCost)
    setSaved(prev => prev + day.envelopeAmount)
    setSavedCount(prev => prev + 1)

    setTimeout(() => {
      setAnimating(false)
      advance()
    }, 600)
  }

  const handleSkip = () => {
    if (animating) return
    setAnimating(true)
    setLastAction('skip')
    setBalance(prev => prev - day.expenseAmount)
    setSkipped(prev => prev + 1)

    setTimeout(() => {
      setAnimating(false)
      advance()
    }, 600)
  }

  const advance = () => {
    if (isLastDay) {
      setPhase('result')
      onComplete?.(calcScore())
    } else {
      setDayIdx(prev => prev + 1)
      setLastAction(null)
    }
  }

  const calcScore = useCallback(() => {
    // Multi-factor scoring:
    // - Savings ratio (50%): saved vs 50% of theoretical max (budget constraints prevent saving all)
    // - Consistency (30%): what fraction of days did you save an envelope?
    // - Survival (20%): bonus for finishing with positive balance
    const maxPossibleSave = days.reduce((s, d) => s + d.envelopeAmount, 0)
    const realisticTarget = maxPossibleSave * 0.5 // 50% of theoretical max = full points
    const savingsScore = Math.min(500, Math.round((saved / Math.max(realisticTarget, 1)) * 500))
    const consistencyScore = Math.round((savedCount / 30) * 300)
    const survivalScore = balance >= 0 ? 200 : Math.max(0, 200 + balance)
    return Math.min(MAX_SCORE, savingsScore + consistencyScore + survivalScore)
  }, [saved, savedCount, balance, days])

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setDayIdx(0)
    setBalance(MONTHLY_INCOME)
    setSaved(0)
    setSkipped(0)
    setSavedCount(0)
    setLastAction(null)
  }, [])

  // ── Result ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = calcScore()
    const xpEarned = Math.round((finalScore / MAX_SCORE) * XP_AVAILABLE)
    return (
      <div>
        {/* Summary stats before result card */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">${saved}</p>
            <p className="text-xs text-emerald-600">Saved</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{savedCount}</p>
            <p className="text-xs text-blue-600">Envelopes</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-gray-700">${balance}</p>
            <p className="text-xs text-gray-500">Remaining</p>
          </div>
        </div>
        <GameResult
          title="Envelope Challenge"
          score={finalScore}
          maxScore={MAX_SCORE}
          xpEarned={xpEarned}
          badgeEarned={savedCount >= 25 ? { name: 'Envelope Master', icon: '✉️' } : null}
          onReplay={handleReplay}
          gameSlug="envelope-challenge"
          moduleSlug="04-envelope-system"
        />
      </div>
    )
  }

  // ── Intro ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">✉️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">The Envelope Challenge</h1>
        <p className="text-gray-500 mb-2">
          You have <strong>${MONTHLY_INCOME}</strong> for the month.
          Each day, an envelope appears with a random savings amount ($5–$50).
          You also have a daily expense you <em>must</em> pay.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Choose: save the envelope amount (plus pay the expense) or skip saving and just pay the expense.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Goal: maximize your savings without running out of money.
          30 days · {XP_AVAILABLE} XP max
        </p>
        <button
          onClick={() => setPhase('playing')}
          className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Start Challenge
        </button>
      </div>
    )
  }

  // ── Playing ────────────────────────────────────────────────────────
  const canAffordBoth = balance >= day.expenseAmount + day.envelopeAmount
  const canAffordExpense = balance >= day.expenseAmount

  return (
    <div className="max-w-lg mx-auto pb-16">
      <GameHeader
        title="Envelope Challenge"
        score={saved}
        xpAvailable={XP_AVAILABLE}
      />

      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>Day {day.day} of 30</span>
        <span>${balance} remaining</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${(dayIdx / 30) * 100}%` }}
        />
      </div>

      {/* Balance & savings summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-xs text-gray-400">Balance</p>
            <p className={cn(
              'text-lg font-bold',
              balance < 200 ? 'text-amber-600' : 'text-gray-900',
            )}>${balance}</p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-3 flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-xs text-emerald-600">Saved</p>
            <p className="text-lg font-bold text-emerald-700">${saved}</p>
          </div>
        </div>
      </div>

      {/* Day card */}
      <div className={cn(
        'bg-white rounded-2xl border-2 p-5 mb-4 shadow-sm transition-all',
        animating && lastAction === 'save'
          ? 'border-emerald-300 bg-emerald-50/50'
          : animating && lastAction === 'skip'
            ? 'border-gray-300'
            : 'border-gray-100',
      )}>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Day {day.day}</p>

        {/* Expense (mandatory) */}
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">{day.expenseName}</p>
            <p className="text-xs text-gray-500">{day.expenseFlavor}</p>
          </div>
          <span className="text-sm font-bold text-red-600">−${day.expenseAmount}</span>
        </div>

        {/* Envelope (optional save) */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Today's Envelope</p>
              <p className="text-xs text-emerald-600">Save this amount?</p>
            </div>
          </div>
          <span className="text-lg font-bold text-emerald-700">${day.envelopeAmount}</span>
        </div>
      </div>

      {/* Affordability warning */}
      {!canAffordBoth && canAffordExpense && (
        <p className="text-xs text-amber-600 text-center mb-3">
          ⚠️ You can't afford both the expense and the envelope today.
        </p>
      )}
      {!canAffordExpense && (
        <p className="text-xs text-red-600 text-center mb-3">
          ⚠️ You're running very low! You can barely cover today's expense.
        </p>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleSave}
          disabled={!canAffordBoth || animating}
          className={cn(
            'flex flex-col items-center gap-1 py-4 px-4 rounded-xl font-semibold transition-all',
            canAffordBoth && !animating
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-sm">Save ${day.envelopeAmount}</span>
          <span className="text-xs opacity-75">Total: −${day.expenseAmount + day.envelopeAmount}</span>
        </button>

        <button
          onClick={handleSkip}
          disabled={animating}
          className={cn(
            'flex flex-col items-center gap-1 py-4 px-4 rounded-xl font-semibold transition-all',
            !animating
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
          )}
        >
          <SkipForward className="w-5 h-5" />
          <span className="text-sm">Skip Envelope</span>
          <span className="text-xs opacity-75">Pay: −${day.expenseAmount}</span>
        </button>
      </div>
    </div>
  )
}
