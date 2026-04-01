import { useState, useCallback } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { StreakNotification } from './shared/StreakNotification'
import { cn } from '../lib/cn'
import {
  Car, Bike, TreePine, PenTool, Coffee,
  ChevronRight, AlertTriangle, Battery, CloudRain,
} from 'lucide-react'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── Gig definitions ──────────────────────────────────────────────────

interface Gig {
  slug: string
  name: string
  icon: React.ReactNode
  hourlyRange: [number, number]
  hoursAvailable: [number, number]
  gasCost: number          // per shift
  burnoutCost: number      // per shift
  weatherSensitive: boolean
  payDelay: number         // days until payment
  description: string
}

const GIGS: Gig[] = [
  {
    slug: 'rideshare',
    name: 'Rideshare',
    icon: <Car className="w-5 h-5" />,
    hourlyRange: [15, 25],
    hoursAvailable: [4, 8],
    gasCost: 18,
    burnoutCost: 15,
    weatherSensitive: false,
    payDelay: 1,
    description: 'Drive passengers. Good money but gas eats into profit.',
  },
  {
    slug: 'delivery',
    name: 'Delivery',
    icon: <Bike className="w-5 h-5" />,
    hourlyRange: [12, 20],
    hoursAvailable: [3, 7],
    gasCost: 8,
    burnoutCost: 12,
    weatherSensitive: false,
    payDelay: 1,
    description: 'Food and package delivery. Lower startup costs.',
  },
  {
    slug: 'lawncare',
    name: 'Lawn Care',
    icon: <TreePine className="w-5 h-5" />,
    hourlyRange: [20, 30],
    hoursAvailable: [3, 6],
    gasCost: 10,
    burnoutCost: 20,
    weatherSensitive: true,
    payDelay: 0,
    description: 'Mowing and yard work. Great pay but weather dependent.',
  },
  {
    slug: 'freelance',
    name: 'Freelance Writing',
    icon: <PenTool className="w-5 h-5" />,
    hourlyRange: [0, 0], // Fixed per project
    hoursAvailable: [2, 5],
    gasCost: 0,
    burnoutCost: 8,
    weatherSensitive: false,
    payDelay: 3,
    description: 'Write articles/blog posts. $50-100/project but payment is delayed.',
  },
]

// ── Daily events / complications ─────────────────────────────────────

interface DailyEvent {
  text: string
  effect: 'weather-bad' | 'weather-good' | 'burnout-spike' | 'bonus-tip' | 'late-payment' | 'car-issue' | 'free-day'
  amount?: number
}

const EVENTS: DailyEvent[] = [
  { text: '🌧️ Heavy rain all day — outdoor gigs canceled.', effect: 'weather-bad' },
  { text: '🌧️ Thunderstorms — lawn care not available.', effect: 'weather-bad' },
  { text: '☀️ Beautiful day — outdoor gigs have extra demand.', effect: 'weather-good', amount: 5 },
  { text: '☀️ Perfect weather — lawn care clients calling.', effect: 'weather-good', amount: 8 },
  { text: '😫 Feeling exhausted — burnout meter spikes.', effect: 'burnout-spike', amount: 20 },
  { text: '💰 A generous customer tipped $25!', effect: 'bonus-tip', amount: 25 },
  { text: '💰 Great shift — earned an extra $15 in tips!', effect: 'bonus-tip', amount: 15 },
  { text: '⏳ Freelance client is paying 2 days late.', effect: 'late-payment' },
  { text: '🔧 Car needs a quick $50 repair.', effect: 'car-issue', amount: 50 },
  { text: '🔧 Flat tire — $30 to fix and lost half a day.', effect: 'car-issue', amount: 30 },
  { text: '🎉 Today feels good — no extra complications!', effect: 'free-day' },
  { text: '✅ Caught up on rest — burnout drops a bit.', effect: 'free-day' },
]

// ── Seeded random ────────────────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

// ── Component ────────────────────────────────────────────────────────

type Phase = 'intro' | 'day-start' | 'choose-gig' | 'day-result' | 'rest-day' | 'result'

const TOTAL_DAYS = 30
const MONTHLY_EXPENSES = 1500
const XP_AVAILABLE = 300
const MAX_SCORE = 1000

interface PendingPayment {
  amount: number
  availableDay: number
  source: string
}

export default function GigEconomySimulator({ onComplete }: GameProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [day, setDay] = useState(1)
  const [cash, setCash] = useState(200)  // Starting cash
  const [burnout, setBurnout] = useState(0)
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [todayEvent, setTodayEvent] = useState<DailyEvent | null>(null)
  const [dayEarnings, setDayEarnings] = useState(0)
  const [dayGasCost, setDayGasCost] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [daysWorked, setDaysWorked] = useState(0)
  const [daysRested, setDaysRested] = useState(0)
  const [forcedRest, setForcedRest] = useState(false)
  const [billsPaid, setBillsPaid] = useState(false)
  const [weatherBad, setWeatherBad] = useState(false)

  // Endless mode
  const [endlessMode, setEndlessMode] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(1)
  const [monthlyExpenses, setMonthlyExpenses] = useState(MONTHLY_EXPENSES)
  const [peakCash, setPeakCash] = useState(200)
  const [workStreak, setWorkStreak] = useState(0) // consecutive profitable days

  const [seed] = useState(() => Math.floor(Math.random() * 100000))

  // ── Day management ─────────────────────────────────────────────────

  const startDay = useCallback(() => {
    // Process pending payments
    const received: PendingPayment[] = []
    const still: PendingPayment[] = []
    for (const p of pendingPayments) {
      if (p.availableDay <= day) received.push(p)
      else still.push(p)
    }
    if (received.length > 0) {
      const total = received.reduce((s, p) => s + p.amount, 0)
      setCash(prev => prev + total)
    }
    setPendingPayments(still)

    // Pay bills on day 15
    if (day === 15 && !billsPaid) {
      setCash(prev => prev - monthlyExpenses)
      setBillsPaid(true)
    }

    // Generate daily event
    const rand2 = seededRandom(seed + day * 71)
    const eventRoll = rand2()
    const event = eventRoll < 0.6 ? EVENTS[Math.floor(rand2() * EVENTS.length)] : null
    setTodayEvent(event)

    // Apply event effects
    let isBadWeather = false
    if (event) {
      switch (event.effect) {
        case 'weather-bad':
          isBadWeather = true
          break
        case 'weather-good':
          // Applied as bonus during gig selection
          break
        case 'burnout-spike':
          setBurnout(prev => Math.min(100, prev + (event.amount ?? 20)))
          break
        case 'bonus-tip':
          setCash(prev => prev + (event.amount ?? 0))
          break
        case 'car-issue':
          setCash(prev => prev - (event.amount ?? 0))
          break
        case 'late-payment':
          // Delay existing pending by 2 days
          setPendingPayments(prev => prev.map(p => ({ ...p, availableDay: p.availableDay + 2 })))
          break
        case 'free-day':
          setBurnout(prev => Math.max(0, prev - 10))
          break
      }
    }
    setWeatherBad(isBadWeather)

    // Check forced rest
    if (burnout >= 80) {
      setForcedRest(true)
      setPhase('rest-day')
    } else {
      setForcedRest(false)
      setPhase('choose-gig')
    }
  }, [pendingPayments, day, billsPaid, monthlyExpenses, seed, burnout])

  const handleStart = () => {
    setDay(1)
    startDay()
  }

  const handleChooseGig = (gig: Gig) => {
    const r = seededRandom(seed + day * 31 + GIGS.indexOf(gig))

    let hours: number
    let earnings: number

    if (gig.slug === 'freelance') {
      // Fixed per-project pricing
      earnings = 50 + Math.round(r() * 50) // $50-$100
      hours = 2 + Math.round(r() * 3) // 2-5 hrs
    } else {
      hours = gig.hoursAvailable[0] + Math.round(r() * (gig.hoursAvailable[1] - gig.hoursAvailable[0]))
      const rate = gig.hourlyRange[0] + Math.round(r() * (gig.hourlyRange[1] - gig.hourlyRange[0]))
      earnings = hours * rate
    }

    // Weather bonus
    if (todayEvent?.effect === 'weather-good' && !gig.weatherSensitive) {
      earnings += todayEvent.amount ?? 0
    }

    const gas = gig.gasCost
    const netEarnings = earnings - gas

    // Payment handling
    if (gig.payDelay > 0) {
      setPendingPayments(prev => [...prev, {
        amount: netEarnings,
        availableDay: day + gig.payDelay,
        source: gig.name,
      }])
    } else {
      setCash(prev => prev + netEarnings)
    }

    setBurnout(prev => Math.min(100, prev + gig.burnoutCost))
    setDayEarnings(earnings)
    setDayGasCost(gas)
    setTotalEarned(prev => prev + netEarnings)
    setDaysWorked(prev => prev + 1)
    if (netEarnings > 0) {
      setWorkStreak(prev => prev + 1)
    } else {
      setWorkStreak(0)
    }
    setCash(prev => { setPeakCash(pk => Math.max(pk, prev)); return prev })
    setPhase('day-result')
  }

  const handleRest = () => {
    setBurnout(prev => Math.max(0, prev - 25))
    setDaysRested(prev => prev + 1)
    setDayEarnings(0)
    setDayGasCost(0)
    setPhase('rest-day')
  }

  const handleNextDay = () => {
    if (day >= TOTAL_DAYS) {
      if (endlessMode) {
        // New month: reset day counter, increase expenses, bills reset
        setCurrentMonth(prev => prev + 1)
        setMonthlyExpenses(prev => prev + 100) // expenses go up each month
        setBillsPaid(false)
        setDay(1)
        setTimeout(() => startDay(), 0)
      } else {
        setPhase('result')
        onComplete?.(calcScore())
      }
    } else {
      const nextDay = day + 1
      setDay(nextDay)
      setTimeout(() => startDay(), 0)
    }
  }

  const handleKeepPlaying = useCallback(() => {
    setEndlessMode(true)
    setCurrentMonth(prev => prev + 1)
    setMonthlyExpenses(prev => prev + 100)
    setBillsPaid(false)
    setDay(1)
    setTimeout(() => startDay(), 0)
  }, [startDay])

  // Hack: startDay needs current state, so we trigger it via effect for day changes
  // Actually the setTimeout approach works fine for this game

  const calcScore = useCallback(() => {
    // Score: survived (40%) + cash remaining (30%) + efficiency (30%)
    const survived = cash >= 0 ? 400 : Math.max(0, 400 + cash * 2)
    const cashScore = Math.min(300, Math.round(Math.max(0, cash) / 400 * 300)) // $400+ = full points (was $1000)
    const effScore = daysWorked > 0 ? Math.min(300, Math.round((totalEarned / daysWorked / 100) * 300)) : 0 // $100/day = full points (was $200)
    return Math.min(MAX_SCORE, survived + cashScore + effScore)
  }, [cash, totalEarned, daysWorked])

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setDay(1)
    setCash(200)
    setBurnout(0)
    setPendingPayments([])
    setTodayEvent(null)
    setDayEarnings(0)
    setDayGasCost(0)
    setTotalEarned(0)
    setDaysWorked(0)
    setDaysRested(0)
    setForcedRest(false)
    setBillsPaid(false)
    setWeatherBad(false)
    setEndlessMode(false)
    setCurrentMonth(1)
    setMonthlyExpenses(MONTHLY_EXPENSES)
    setPeakCash(200)
    setWorkStreak(0)
  }, [])

  // ── Result ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = calcScore()
    const xpEarned = Math.round((finalScore / MAX_SCORE) * XP_AVAILABLE)
    const pendingTotal = pendingPayments.reduce((s, p) => s + p.amount, 0)

    return (
      <div>
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
          <div className={cn(
            'border rounded-xl p-3 text-center',
            cash >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200',
          )}>
            <p className={cn('text-xl font-bold', cash >= 0 ? 'text-emerald-700' : 'text-red-700')}>${cash}</p>
            <p className="text-xs text-gray-500">Final Cash</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-700">${totalEarned}</p>
            <p className="text-xs text-blue-600">Total Earned</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-purple-700">{daysWorked}d</p>
            <p className="text-xs text-purple-600">Days Worked</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-amber-700">{daysRested}d</p>
            <p className="text-xs text-amber-600">Days Rested</p>
          </div>
          {endlessMode && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center col-span-2">
              <p className="text-xl font-bold text-indigo-700">{currentMonth} months</p>
              <p className="text-xs text-indigo-600">Survived · Peak cash: ${peakCash}</p>
            </div>
          )}
        </div>
        {pendingTotal > 0 && (
          <p className="text-center text-sm text-gray-500 mb-4">
            (${pendingTotal} still pending from delayed payments)
          </p>
        )}
        <GameResult
          title={endlessMode ? `Gig Economy — Month ${currentMonth}` : 'Gig Economy Simulator'}
          score={finalScore}
          maxScore={MAX_SCORE}
          xpEarned={xpEarned}
          badgeEarned={cash >= monthlyExpenses ? { name: 'Gig Navigator', icon: '🧭' } : currentMonth >= 3 ? { name: 'Gig Veteran', icon: '💪' } : null}
          onReplay={handleReplay}
          onKeepPlaying={cash >= 0 ? handleKeepPlaying : undefined}
          moduleSlug="09-income-growth"
          gameSlug="gig-economy-sim"
        />
      </div>
    )
  }

  // ── Intro ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Gig Economy Simulator</h1>
        <p className="text-gray-500 mb-2">
          No steady paycheck. <strong>$1,500</strong> in bills due on Day 15.
          <strong> $200</strong> starting cash. <strong>30 days</strong> to survive.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Choose gigs each day. Watch your burnout meter — over 80% means forced rest.
          Gas costs eat into rideshare profit. Freelance pays well but late. Bad weather cancels outdoor gigs.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Goal: cover all expenses without going negative. · {XP_AVAILABLE} XP max
        </p>
        <p className="text-xs text-purple-400 mb-8">
          Survive the month to unlock Endless Mode — expenses increase each month!
        </p>
        <button onClick={handleStart} className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          Start Hustling
        </button>
      </div>
    )
  }

  // ── Status bar (shared across phases) ──────────────────────────────
  const pendingTotal = pendingPayments.reduce((s, p) => s + p.amount, 0)

  const statusBar = (
    <>
      <StreakNotification streak={workStreak} label="Profit" variant="gold" />
      <GameHeader title={endlessMode ? `Gig Sim — Month ${currentMonth}` : 'Gig Economy Sim'} score={cash} xpAvailable={XP_AVAILABLE} />

      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>
          Day {day} of {TOTAL_DAYS}
          {endlessMode && <span className="ml-1 text-purple-400">(Month {currentMonth})</span>}
        </span>
        <div className="flex items-center gap-2">
          {workStreak >= 3 && <span className="text-amber-500 font-bold">⭐{workStreak}</span>}
          <span>{day < 15 ? `Bills: $${monthlyExpenses} due in ${15 - day}d` : billsPaid ? 'Bills paid ✅' : 'Bills due!'}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-fresh-blue rounded-full transition-all" style={{ width: `${(day / TOTAL_DAYS) * 100}%` }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={cn('rounded-xl p-2 text-center border', cash >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100')}>
          <p className={cn('text-sm font-bold', cash >= 0 ? 'text-emerald-700' : 'text-red-700')}>${cash}</p>
          <p className="text-[10px] text-gray-400">Cash</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-2 text-center">
          <p className="text-sm font-bold text-amber-700">{pendingTotal > 0 ? `$${pendingTotal}` : '$0'}</p>
          <p className="text-[10px] text-gray-400">Pending</p>
        </div>
        <div className={cn('rounded-xl p-2 text-center border', burnout >= 60 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100')}>
          <p className={cn('text-sm font-bold', burnout >= 60 ? 'text-red-700' : 'text-blue-700')}>{burnout}%</p>
          <p className="text-[10px] text-gray-400">Burnout</p>
        </div>
      </div>

      {/* Burnout bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-400 flex items-center gap-1"><Battery className="w-3 h-3" /> Burnout</span>
          <span className={cn('font-bold', burnout >= 80 ? 'text-red-600' : burnout >= 60 ? 'text-amber-600' : 'text-emerald-600')}>
            {burnout}%{burnout >= 80 ? ' ⚠️ EXHAUSTED' : ''}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={cn(
            'h-full rounded-full transition-all',
            burnout >= 80 ? 'bg-red-500' : burnout >= 60 ? 'bg-amber-500' : 'bg-emerald-500',
          )} style={{ width: `${burnout}%` }} />
        </div>
      </div>
    </>
  )

  // ── Choose Gig ─────────────────────────────────────────────────────
  if (phase === 'choose-gig') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        {statusBar}

        {/* Today's event */}
        {todayEvent && (
          <div className={cn(
            'rounded-xl border p-3 mb-4 text-sm',
            todayEvent.effect === 'weather-bad' ? 'bg-blue-50 border-blue-200 text-blue-700' :
            todayEvent.effect === 'bonus-tip' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            todayEvent.effect === 'car-issue' ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-gray-50 border-gray-200 text-gray-700',
          )}>
            {todayEvent.text}
          </div>
        )}

        <p className="text-sm font-bold text-gray-700 mb-3">Choose today's gig:</p>

        <div className="space-y-2 mb-4">
          {GIGS.map(gig => {
            const unavailable = weatherBad && gig.weatherSensitive

            return (
              <button
                key={gig.slug}
                onClick={() => !unavailable && handleChooseGig(gig)}
                disabled={unavailable}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  unavailable
                    ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-fresh-blue hover:bg-blue-50',
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  unavailable ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-blue-600',
                )}>
                  {gig.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{gig.name}</p>
                  <p className="text-xs text-gray-500">{gig.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {gig.slug === 'freelance'
                      ? <span>$50-100/project</span>
                      : <span>${gig.hourlyRange[0]}-{gig.hourlyRange[1]}/hr</span>
                    }
                    {gig.gasCost > 0 && <span>Gas: -${gig.gasCost}</span>}
                    {gig.payDelay > 0 && <span>Pay: +{gig.payDelay}d delay</span>}
                  </div>
                </div>
                {unavailable && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <CloudRain className="w-3 h-3" /> Weather
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Rest option */}
        <button
          onClick={handleRest}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-700 font-semibold hover:border-amber-300 transition-all"
        >
          <Coffee className="w-4 h-4" />
          Take a Rest Day (−25 burnout)
        </button>
      </div>
    )
  }

  // ── Day Result ─────────────────────────────────────────────────────
  if (phase === 'day-result') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        {statusBar}

        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 text-center">
          <p className="text-xs text-gray-400 uppercase font-bold mb-2">Day {day} Earnings</p>
          <p className="text-2xl font-bold text-emerald-700">+${dayEarnings}</p>
          {dayGasCost > 0 && <p className="text-sm text-red-500 mt-1">Gas: -${dayGasCost}</p>}
          <p className="text-sm text-gray-600 mt-1">Net: ${dayEarnings - dayGasCost}</p>
          {pendingPayments.length > 0 && (
            <p className="text-xs text-amber-600 mt-2">
              ${pendingTotal} in pending payments arriving soon
            </p>
          )}
        </div>

        <button onClick={handleNextDay} className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          {day >= TOTAL_DAYS ? (endlessMode ? 'Next Month →' : 'See Results') : `Day ${day + 1} →`}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // ── Rest Day ───────────────────────────────────────────────────────
  if (phase === 'rest-day') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        {statusBar}

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6 text-center">
          {forcedRest ? (
            <>
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-amber-800 mb-1">Forced Rest Day</p>
              <p className="text-sm text-amber-700">Burnout hit {burnout}%. Your body said "enough." No work today.</p>
            </>
          ) : (
            <>
              <Coffee className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-amber-800 mb-1">Rest Day</p>
              <p className="text-sm text-amber-700">Taking care of yourself. Burnout recovering.</p>
            </>
          )}
          <p className="text-xs text-gray-500 mt-2">No earnings today</p>
        </div>

        <button onClick={handleNextDay} className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          {day >= TOTAL_DAYS ? (endlessMode ? 'Next Month →' : 'See Results') : `Day ${day + 1} →`}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return null
}
