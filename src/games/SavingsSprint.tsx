import { useState, useCallback } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { cn } from '../lib/cn'
import { Shield, AlertTriangle, ShoppingBag, ChevronRight, PiggyBank } from 'lucide-react'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── Types ────────────────────────────────────────────────────────────

interface MonthEvent {
  description: string
  amount: number
  isEmergency: boolean
  penalty: string // Shown when player makes wrong choice
  reward: string  // Shown when player makes right choice
}

interface MonthData {
  month: number
  monthName: string
  events: MonthEvent[]
}

// ── Data ─────────────────────────────────────────────────────────────

const MONTHS: MonthData[] = [
  {
    month: 1, monthName: 'Month 1',
    events: [
      { description: 'Flash sale — 60% off shoes you\'ve been eyeing', amount: 85, isEmergency: false,
        penalty: 'Those shoes felt great for a day. Your fund takes 2 months to recover.',
        reward: 'You resisted the sale. The shoes go on clearance next month for even less — and you don\'t need them.' },
      { description: 'Your pet needs an emergency vet visit', amount: 200, isEmergency: true,
        penalty: 'Skipping the vet led to a $600 surgery later. Much worse outcome.',
        reward: 'Your pet gets treated early. Emergency fund used correctly — that\'s what it\'s for!' },
      { description: 'Friend invites you on a weekend getaway — split costs', amount: 150, isEmergency: false,
        penalty: 'Fun trip, but your emergency fund barely started growing.',
        reward: 'You suggest a local day trip instead. Same fun, $20 spent. Smart move.' },
    ],
  },
  {
    month: 2, monthName: 'Month 2',
    events: [
      { description: 'Car tire goes flat — needs replacement', amount: 120, isEmergency: true,
        penalty: 'Driving on a bad tire led to a $400 rim repair. Small problems grow.',
        reward: 'Tire replaced. You stayed safe and avoided a bigger bill. Fund working as designed.' },
      { description: 'Limited edition collectible drops online — sells out fast', amount: 95, isEmergency: false,
        penalty: 'The collectible lost value in 2 weeks. Your fund lost $95.',
        reward: 'FOMO fades fast. Your growing fund balance feels better than any collectible.' },
    ],
  },
  {
    month: 3, monthName: 'Month 3',
    events: [
      { description: 'Streaming service bundle deal — save $5/month if you prepay yearly', amount: 130, isEmergency: false,
        penalty: 'You save $60/year but drain your emergency fund for entertainment.',
        reward: 'You keep the monthly plan. The $5/month "savings" isn\'t worth weakening your safety net.' },
      { description: 'Water heater breaks — no hot water', amount: 250, isEmergency: true,
        penalty: 'Cold showers for 3 weeks while you scrambled to find the money. Miserable.',
        reward: 'Fixed within 2 days. This is a textbook emergency fund use. No debt, no stress.' },
      { description: 'Gym New Year promotion — 50% off annual membership', amount: 180, isEmergency: false,
        penalty: 'Statistics show 80% of people stop going by March. Your fund paid for a guilt trip.',
        reward: 'You try the $10/month option first. If you still go in 3 months, consider upgrading.' },
    ],
  },
  {
    month: 4, monthName: 'Month 4',
    events: [
      { description: 'You need prescription glasses — your old pair broke', amount: 180, isEmergency: true,
        penalty: 'Squinting for months caused headaches and affected your work performance.',
        reward: 'New glasses ordered. You can see clearly AND your fund handled it gracefully.' },
      { description: 'Amazing deal on a refurbished laptop', amount: 300, isEmergency: false,
        penalty: 'The laptop works, but it ate most of your fund. What if a real emergency hits next month?',
        reward: 'Your current laptop works fine. You add this to a wish list for when you have separate savings.' },
    ],
  },
  {
    month: 5, monthName: 'Month 5',
    events: [
      { description: 'Food poisoning — ER visit with $150 copay', amount: 150, isEmergency: true,
        penalty: 'Unpaid medical bills go to collections. Your rebuilding credit score takes a hit.',
        reward: 'ER visit covered. You recovered without financial stress — that\'s the whole point of the fund.' },
      { description: 'Coworker selling concert tickets at face value — amazing seats', amount: 120, isEmergency: false,
        penalty: 'Great concert, but you\'re anxious about your fund balance for weeks after.',
        reward: 'You pass on the tickets. There will always be more concerts. Your peace of mind is worth more.' },
      { description: 'Minor fender bender — insurance deductible', amount: 200, isEmergency: true,
        penalty: 'Without paying the deductible, you drive with damage. Next accident has no insurance coverage.',
        reward: 'Deductible paid, car fixed, insurance intact. Emergency fund: 3 for 3 on real emergencies.' },
    ],
  },
  {
    month: 6, monthName: 'Month 6',
    events: [
      { description: 'Black Friday deals — 70% off winter clothing', amount: 160, isEmergency: false,
        penalty: 'You bought clothes you mostly don\'t wear. The "deal" cost you fund security.',
        reward: 'You buy one needed winter coat for $40 from your regular budget. The rest can wait.' },
      { description: 'Plumbing emergency — kitchen pipe burst', amount: 280, isEmergency: true,
        penalty: 'Water damage doubled because you waited to find the money. $280 became $700.',
        reward: 'Plumber came same day. No water damage, no debt. Your 6-month fund-building effort just proved its worth.' },
    ],
  },
]

// ── Game logic ───────────────────────────────────────────────────────

type Phase = 'intro' | 'month-start' | 'classify' | 'decide' | 'feedback' | 'month-end' | 'result'

const STARTING_FUND = 500
const MONTHLY_CONTRIBUTION = 200
const MONTHLY_INTEREST_RATE = 0.005
const XP_AVAILABLE = 150
const MAX_SCORE = 1000

export default function SavingsSprint({ onComplete }: GameProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [monthIdx, setMonthIdx] = useState(0)
  const [eventIdx, setEventIdx] = useState(0)
  const [fund, setFund] = useState(STARTING_FUND)
  const [correctClassifications, setCorrectClassifications] = useState(0)
  const [totalClassifications, setTotalClassifications] = useState(0)
  const [correctDecisions, setCorrectDecisions] = useState(0)
  const [totalDecisions, setTotalDecisions] = useState(0)
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null)
  const [classifiedAs, setClassifiedAs] = useState<'emergency' | 'temptation' | null>(null)
  const [monthEvents, setMonthEvents] = useState<MonthEvent[]>([])

  const currentMonth = MONTHS[monthIdx]
  const currentEvent = monthEvents[eventIdx]

  const handleStart = () => {
    setMonthEvents(MONTHS[0].events)
    setPhase('month-start')
  }

  const handleMonthBegin = () => {
    // Add monthly contribution + interest
    setFund(prev => {
      const withInterest = prev * (1 + MONTHLY_INTEREST_RATE)
      return Math.round((withInterest + MONTHLY_CONTRIBUTION) * 100) / 100
    })
    setEventIdx(0)
    setPhase('classify')
  }

  const handleClassify = (choice: 'emergency' | 'temptation') => {
    setClassifiedAs(choice)
    setTotalClassifications(prev => prev + 1)
    const correct = (choice === 'emergency') === currentEvent.isEmergency
    if (correct) setCorrectClassifications(prev => prev + 1)
    setPhase('decide')
  }

  const handleDecide = (spend: boolean) => {
    setTotalDecisions(prev => prev + 1)
    let isGoodDecision: boolean

    if (currentEvent.isEmergency) {
      // Should spend on real emergencies
      isGoodDecision = spend
    } else {
      // Should NOT spend on temptations
      isGoodDecision = !spend
    }

    if (isGoodDecision) {
      setCorrectDecisions(prev => prev + 1)
    }

    if (spend) {
      setFund(prev => Math.max(0, prev - currentEvent.amount))
    }

    // If didn't spend on emergency, apply penalty later (bigger cost)
    if (currentEvent.isEmergency && !spend) {
      const penaltyAmount = Math.round(currentEvent.amount * 1.5)
      setFund(prev => Math.max(0, prev - penaltyAmount))
      setFeedback({
        text: currentEvent.penalty + ` The delayed cost: $${penaltyAmount} instead of $${currentEvent.amount}.`,
        good: false,
      })
    } else if (!currentEvent.isEmergency && spend) {
      setFeedback({ text: currentEvent.penalty, good: false })
    } else {
      setFeedback({ text: currentEvent.reward, good: true })
    }

    setPhase('feedback')
  }

  const handleFeedbackContinue = () => {
    setFeedback(null)
    setClassifiedAs(null)

    if (eventIdx + 1 < monthEvents.length) {
      setEventIdx(prev => prev + 1)
      setPhase('classify')
    } else {
      setPhase('month-end')
    }
  }

  const handleNextMonth = () => {
    if (monthIdx + 1 >= MONTHS.length) {
      setPhase('result')
      onComplete?.(calcScore())
    } else {
      const nextIdx = monthIdx + 1
      setMonthIdx(nextIdx)
      setMonthEvents(MONTHS[nextIdx].events)
      setPhase('month-start')
    }
  }

  const calcScore = useCallback(() => {
    // Score based on: classification accuracy (40%) + decision accuracy (40%) + fund health (20%)
    // Fund health uses a realistic max — perfect play still costs ~$1,380 in emergencies
    const classScore = totalClassifications > 0
      ? Math.round((correctClassifications / totalClassifications) * 400)
      : 0
    const decisionScore = totalDecisions > 0
      ? Math.round((correctDecisions / totalDecisions) * 400)
      : 0
    const realisticMaxFund = 500 // Achievable with good play after emergencies
    const fundScore = Math.min(200, Math.round((Math.max(0, fund) / realisticMaxFund) * 200))
    return Math.min(MAX_SCORE, classScore + decisionScore + fundScore)
  }, [fund, correctClassifications, totalClassifications, correctDecisions, totalDecisions])

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setMonthIdx(0)
    setEventIdx(0)
    setFund(STARTING_FUND)
    setCorrectClassifications(0)
    setTotalClassifications(0)
    setCorrectDecisions(0)
    setTotalDecisions(0)
    setFeedback(null)
    setClassifiedAs(null)
    setMonthEvents([])
  }, [])

  // ── Result ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = calcScore()
    const xpEarned = Math.round((finalScore / MAX_SCORE) * XP_AVAILABLE)
    const classAcc = totalClassifications > 0
      ? Math.round((correctClassifications / totalClassifications) * 100) : 0
    const decAcc = totalDecisions > 0
      ? Math.round((correctDecisions / totalDecisions) * 100) : 0

    return (
      <div>
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">${Math.round(fund)}</p>
            <p className="text-xs text-emerald-600">Final Fund</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{classAcc}%</p>
            <p className="text-xs text-blue-600">Classification</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-purple-700">{decAcc}%</p>
            <p className="text-xs text-purple-600">Decisions</p>
          </div>
        </div>
        <GameResult
          title="Savings Sprint"
          score={finalScore}
          maxScore={MAX_SCORE}
          xpEarned={xpEarned}
          badgeEarned={fund >= 1200 ? { name: 'Savings Sprinter', icon: '🏃' } : null}
          onReplay={handleReplay}
          gameSlug="savings-sprint"
          moduleSlug="05-emergency-fund"
        />
      </div>
    )
  }

  // ── Intro ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">🏃</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Savings Sprint</h1>
        <p className="text-gray-500 mb-2">
          Build your emergency fund over <strong>6 months</strong>.
          Start with <strong>${STARTING_FUND}</strong>, add <strong>${MONTHLY_CONTRIBUTION}/month</strong>,
          and earn <strong>0.5% interest</strong> monthly.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Each month brings events: some are real emergencies, some are temptations.
          Classify each correctly, then decide whether to spend from your fund.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          ⚠️ Spending on temptations = penalty. Ignoring real emergencies = bigger penalty later.
        </p>
        <button
          onClick={handleStart}
          className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Start Sprint
        </button>
      </div>
    )
  }

  // ── Month Start ────────────────────────────────────────────────────
  if (phase === 'month-start') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Savings Sprint" score={Math.round(fund)} xpAvailable={XP_AVAILABLE} />

        <div className="max-w-sm mx-auto text-center py-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{currentMonth.monthName}</h2>
          <p className="text-gray-500 text-sm mb-4">
            Monthly contribution: +${MONTHLY_CONTRIBUTION}<br />
            Interest earned: +{(MONTHLY_INTEREST_RATE * 100).toFixed(1)}%
          </p>
          <p className="text-lg font-bold text-emerald-700 mb-6">
            Fund: ${Math.round(fund * (1 + MONTHLY_INTEREST_RATE) + MONTHLY_CONTRIBUTION)}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {currentMonth.events.length} event{currentMonth.events.length > 1 ? 's' : ''} this month
          </p>
          <button
            onClick={handleMonthBegin}
            className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Begin Month →
          </button>
        </div>
      </div>
    )
  }

  // ── Playing phases ─────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto pb-16">
      <GameHeader title="Savings Sprint" score={Math.round(fund)} xpAvailable={XP_AVAILABLE} />

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>{currentMonth.monthName} — Event {eventIdx + 1}/{monthEvents.length}</span>
        <span>Fund: ${Math.round(fund)}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${((monthIdx * 3 + eventIdx) / (MONTHS.length * 3)) * 100}%` }}
        />
      </div>

      {/* Event card */}
      {currentEvent && (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 mb-4 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{currentEvent.description}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">${currentEvent.amount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Classify phase */}
      {phase === 'classify' && currentEvent && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3 text-center">
            Is this a real <span className="text-red-500">emergency</span> or a <span className="text-purple-500">temptation</span>?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleClassify('emergency')}
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-xl border-2 border-red-200 bg-red-50 hover:border-red-400 transition-all"
            >
              <Shield className="w-6 h-6 text-red-500" />
              <span className="text-sm font-bold text-red-700">Emergency</span>
              <span className="text-xs text-red-400">Needs immediate attention</span>
            </button>
            <button
              onClick={() => handleClassify('temptation')}
              className="flex flex-col items-center gap-2 py-5 px-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:border-purple-400 transition-all"
            >
              <ShoppingBag className="w-6 h-6 text-purple-500" />
              <span className="text-sm font-bold text-purple-700">Temptation</span>
              <span className="text-xs text-purple-400">Want, not need</span>
            </button>
          </div>
        </div>
      )}

      {/* Decide phase */}
      {phase === 'decide' && currentEvent && (
        <div>
          {/* Classification result */}
          <div className={cn(
            'rounded-xl p-3 mb-4 text-center text-sm font-semibold',
            (classifiedAs === 'emergency') === currentEvent.isEmergency
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200',
          )}>
            {(classifiedAs === 'emergency') === currentEvent.isEmergency
              ? `✅ Correct! This is ${currentEvent.isEmergency ? 'a real emergency' : 'a temptation'}.`
              : `⚠️ Actually, this is ${currentEvent.isEmergency ? 'a real emergency' : 'a temptation'}.`}
          </div>

          <p className="text-sm font-bold text-gray-700 mb-3 text-center">
            Spend <strong>${currentEvent.amount}</strong> from your fund?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDecide(true)}
              className="flex flex-col items-center gap-1 py-4 px-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:border-amber-400 transition-all"
            >
              <span className="text-sm font-bold text-amber-700">Spend ${currentEvent.amount}</span>
              <span className="text-xs text-amber-500">Use from fund</span>
            </button>
            <button
              onClick={() => handleDecide(false)}
              className="flex flex-col items-center gap-1 py-4 px-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:border-emerald-400 transition-all"
            >
              <span className="text-sm font-bold text-emerald-700">Don't Spend</span>
              <span className="text-xs text-emerald-500">Protect the fund</span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback phase */}
      {phase === 'feedback' && feedback && (
        <div>
          <div className={cn(
            'rounded-2xl border-2 p-5 mb-4',
            feedback.good ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
          )}>
            <p className={cn(
              'text-sm font-bold mb-2',
              feedback.good ? 'text-emerald-700' : 'text-amber-700',
            )}>
              {feedback.good ? '✨ Smart move!' : '⚠️ Lesson learned:'}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{feedback.text}</p>
          </div>

          <button
            onClick={handleFeedbackContinue}
            className="w-full flex items-center justify-center gap-2 bg-fresh-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Month end */}
      {phase === 'month-end' && (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{currentMonth.monthName} Complete</h3>
          <p className="text-2xl font-bold text-emerald-700 mb-1">
            Fund: ${Math.round(fund)}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {monthIdx + 1 < MONTHS.length
              ? `${MONTHS.length - monthIdx - 1} months remaining`
              : 'Final month complete!'}
          </p>
          <button
            onClick={handleNextMonth}
            className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
          >
            {monthIdx + 1 >= MONTHS.length ? 'See Results' : 'Next Month →'}
          </button>
        </div>
      )}
    </div>
  )
}
