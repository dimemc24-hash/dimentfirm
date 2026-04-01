import { useState, useCallback, useMemo } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { StreakNotification } from './shared/StreakNotification'
import { cn } from '../lib/cn'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── Data ─────────────────────────────────────────────────────────────

interface Bill {
  name: string
  amount: number
  category: 'essential' | 'important' | 'flexible'
  skipPenalty: string
  creditImpact: number
  qolImpact: number
}

const MONTHLY_BILLS: Bill[] = [
  { name: 'Rent', amount: 1250, category: 'essential', skipPenalty: 'Eviction notice — 30 days to pay or vacate.', creditImpact: -30, qolImpact: -40 },
  { name: 'Car payment', amount: 680, category: 'essential', skipPenalty: 'Repossession risk. Late fee + credit hit.', creditImpact: -25, qolImpact: -20 },
  { name: 'Groceries', amount: 575, category: 'essential', skipPenalty: 'Food insecurity. Can reduce but not skip entirely.', creditImpact: 0, qolImpact: -30 },
  { name: 'Utilities', amount: 250, category: 'essential', skipPenalty: 'Power shut-off warning. Late fee added.', creditImpact: -10, qolImpact: -25 },
  { name: 'Car insurance', amount: 210, category: 'essential', skipPenalty: 'Policy lapse — driving uninsured is illegal in LA.', creditImpact: 0, qolImpact: -15 },
  { name: 'Gas', amount: 200, category: 'important', skipPenalty: 'Can\'t get to work. Income at risk.', creditImpact: 0, qolImpact: -20 },
  { name: 'Internet', amount: 105, category: 'important', skipPenalty: 'Lose connection for work-from-home and job applications.', creditImpact: 0, qolImpact: -10 },
  { name: 'Phone', amount: 45, category: 'important', skipPenalty: 'Service suspended — hard to job search or communicate.', creditImpact: -5, qolImpact: -15 },
  { name: 'Subscriptions', amount: 30, category: 'flexible', skipPenalty: 'Entertainment reduced but no real harm.', creditImpact: 0, qolImpact: -3 },
  { name: 'Personal care', amount: 35, category: 'flexible', skipPenalty: 'Manageable short-term. Affects confidence.', creditImpact: 0, qolImpact: -5 },
]

interface CrisisEvent {
  description: string
  amount: number
  icon: string
  isGood: boolean
}

const MILD_CRISES: CrisisEvent[] = [
  { description: 'Parking ticket', amount: -75, icon: '🎫', isGood: false },
  { description: 'Birthday gift for family member', amount: -50, icon: '🎂', isGood: false },
  { description: 'School supplies needed', amount: -60, icon: '📚', isGood: false },
  { description: 'Flat tire on the highway', amount: -150, icon: '🛞', isGood: false },
  { description: 'Copay for urgent care visit', amount: -125, icon: '🏥', isGood: false },
  { description: 'Pet needs vet visit', amount: -150, icon: '🐾', isGood: false },
]

const HARSH_CRISES: CrisisEvent[] = [
  { description: 'Car breakdown — mechanic needed', amount: -500, icon: '🔧', isGood: false },
  { description: 'Hours cut at work this month', amount: -300, icon: '📉', isGood: false },
  { description: 'Fridge died — needs replacement', amount: -350, icon: '❄️', isGood: false },
  { description: 'Water heater broke', amount: -300, icon: '💧', isGood: false },
  { description: 'Unexpected medical bill', amount: -275, icon: '🏥', isGood: false },
  { description: 'Rent increase notice — extra due now', amount: -100, icon: '📄', isGood: false },
]

const POSITIVE_EVENTS: CrisisEvent[] = [
  { description: 'Overtime opportunity this month!', amount: 250, icon: '💪', isGood: true },
  { description: 'Tax refund arrived!', amount: 180, icon: '📬', isGood: true },
  { description: 'Neighbor paid you for helping move', amount: 100, icon: '🤝', isGood: true },
  { description: 'Found freelance gig online', amount: 150, icon: '💻', isGood: true },
  { description: 'Sold old electronics online', amount: 85, icon: '📱', isGood: true },
  { description: 'Received gift card from family', amount: 50, icon: '🎁', isGood: true },
  { description: 'Cash back reward from credit card', amount: 40, icon: '💳', isGood: true },
]

interface ShopItem {
  name: string
  description: string
  minCost: number
  maxCost: number
  qolBoost: number
  icon: string
  type: 'fun' | 'investment' | 'scam'
  returnMonths?: number
  returnMultiplier?: number
  availableFromMonth?: number
}

const SHOP_ITEMS: ShopItem[] = [
  { name: 'Concert Tickets', description: 'Live show tonight — unwind and enjoy!', minCost: 80, maxCost: 150, qolBoost: 5, icon: '🎵', type: 'fun' },
  { name: 'Dining Out', description: 'Treat yourself to a nice dinner.', minCost: 40, maxCost: 75, qolBoost: 3, icon: '🍽️', type: 'fun' },
  { name: 'New Outfit', description: 'Looking good, feeling good.', minCost: 60, maxCost: 120, qolBoost: 3, icon: '👔', type: 'fun' },
  { name: 'Weekend Day Trip', description: 'Explore somewhere new nearby.', minCost: 50, maxCost: 100, qolBoost: 4, icon: '🚗', type: 'fun' },
  { name: 'High-Yield Savings', description: 'Open a savings account with 4% APY. Returns in 3 months.', minCost: 100, maxCost: 100, qolBoost: 0, icon: '🏦', type: 'investment', returnMonths: 3, returnMultiplier: 1.04 },
  { name: '401k Match', description: 'Contribute to employer 401k match — they match 100%!', minCost: 100, maxCost: 100, qolBoost: 0, icon: '📈', type: 'investment', returnMonths: 1, returnMultiplier: 2.0 },
  { name: 'Crypto Investment', description: 'GUARANTEED 50% returns! Limited time! Act now!', minCost: 200, maxCost: 500, qolBoost: 0, icon: '🪙', type: 'scam', availableFromMonth: 3, returnMonths: 1, returnMultiplier: 0 },
  { name: "Friend's Business", description: "Your buddy says you can DOUBLE your money. Can't lose!", minCost: 300, maxCost: 300, qolBoost: 0, icon: '🤝', type: 'scam', availableFromMonth: 4, returnMonths: 2, returnMultiplier: 0 },
]

interface ActiveInvestment {
  name: string
  amount: number
  returnMonth: number
  returnAmount: number
  isScam: boolean
}

interface ShopItemInstance {
  name: string
  description: string
  cost: number
  qolBoost: number
  icon: string
  type: 'fun' | 'investment' | 'scam'
  returnMonths?: number
  returnMultiplier?: number
}

// ── Helpers ──────────────────────────────────────────────────────────

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr]
  let s = Math.abs(seed) || 1
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function seededRandom(seed: number): number {
  const s = ((Math.abs(seed) || 1) * 16807) % 2147483647
  return s / 2147483647
}

function generateMonthEvents(month: number, seed: number): CrisisEvent[] {
  switch (month) {
    case 1: return seededShuffle(POSITIVE_EVENTS, seed + 100).slice(0, 2)
    case 2: return [
      ...seededShuffle(MILD_CRISES, seed + 200).slice(0, 1),
      ...seededShuffle(POSITIVE_EVENTS, seed + 201).slice(0, 1),
    ]
    case 3: return [
      ...seededShuffle(MILD_CRISES, seed + 300).slice(0, 2),
    ]
    case 4: return [
      ...seededShuffle(MILD_CRISES, seed + 400).slice(0, 1),
      ...seededShuffle(HARSH_CRISES, seed + 401).slice(0, 1),
    ]
    case 5: return [
      ...seededShuffle(HARSH_CRISES, seed + 500).slice(0, 2),
    ]
    case 6: return [
      ...seededShuffle(HARSH_CRISES, seed + 600).slice(0, 1),
      ...seededShuffle(POSITIVE_EVENTS, seed + 601).slice(0, 1),
    ]
    default: {
      // Endless mode months (7+): progressively harder
      const harshCount = Math.min(3, 1 + Math.floor((month - 6) / 2))
      const mildCount = month % 3 === 0 ? 1 : 0
      const positiveCount = month % 2 === 0 ? 1 : 0
      return [
        ...seededShuffle(HARSH_CRISES, seed + month * 100).slice(0, harshCount),
        ...seededShuffle(MILD_CRISES, seed + month * 101).slice(0, mildCount),
        ...seededShuffle(POSITIVE_EVENTS, seed + month * 102).slice(0, positiveCount),
      ]
    }
  }
}

function generateShopItems(month: number, seed: number): ShopItemInstance[] {
  const funItems = SHOP_ITEMS.filter(i => i.type === 'fun')
  const investItems = SHOP_ITEMS.filter(i => i.type === 'investment')
  const scamItems = SHOP_ITEMS.filter(i => i.type === 'scam' && (i.availableFromMonth || 1) <= month)

  const selectedFun = seededShuffle(funItems, seed + month * 50).slice(0, 2)
  const selectedInvest = seededShuffle(investItems, seed + month * 51).slice(0, 1)

  const items: ShopItemInstance[] = [
    ...selectedFun.map((item, idx) => ({
      name: item.name,
      description: item.description,
      cost: Math.round(item.minCost + seededRandom(seed + month * 52 + idx) * (item.maxCost - item.minCost)),
      qolBoost: item.qolBoost,
      icon: item.icon,
      type: item.type as 'fun' | 'investment' | 'scam',
      returnMonths: item.returnMonths,
      returnMultiplier: item.returnMultiplier,
    })),
    ...selectedInvest.map(item => ({
      name: item.name,
      description: item.description,
      cost: item.minCost,
      qolBoost: item.qolBoost,
      icon: item.icon,
      type: item.type as 'fun' | 'investment' | 'scam',
      returnMonths: item.returnMonths,
      returnMultiplier: item.returnMultiplier,
    })),
    ...scamItems.map((item, idx) => ({
      name: item.name,
      description: item.description,
      cost: Math.round(item.minCost + seededRandom(seed + month * 53 + idx) * (item.maxCost - item.minCost)),
      qolBoost: item.qolBoost,
      icon: item.icon,
      type: item.type as 'fun' | 'investment' | 'scam',
      returnMonths: item.returnMonths,
      returnMultiplier: item.returnMultiplier,
    })),
  ]

  return items
}

function getMonthGrade(billsPaidPct: number, balanceTrend: number, creditTrend: number, qol: number): string {
  let points = 0
  points += billsPaidPct * 40
  points += balanceTrend > 0 ? 20 : balanceTrend > -200 ? 10 : 0
  points += creditTrend > 0 ? 20 : creditTrend >= 0 ? 10 : 0
  points += qol >= 60 ? 20 : qol >= 40 ? 10 : 0
  if (points >= 85) return 'A'
  if (points >= 70) return 'B'
  if (points >= 55) return 'C'
  if (points >= 35) return 'D'
  return 'F'
}

// ── Component ────────────────────────────────────────────────────────

type Phase =
  | 'intro'
  | 'month-start'
  | 'bills'
  | 'events'
  | 'event-resolve'
  | 'shop'
  | 'shop-payment'
  | 'month-summary'
  | 'result'

const INCOME = 3800
const TOTAL_MONTHS = 6
const XP_AVAILABLE = 300
const MAX_SCORE = 1000

export default function BudgetCrisis({ onComplete, chapterPath }: GameProps) {
  const startingSavings = chapterPath === 'ch13' ? 800 : 400
  const startCreditScore = chapterPath === 'ch13' ? 560 : 530

  // Core state
  const [phase, setPhase] = useState<Phase>('intro')
  const [month, setMonth] = useState(1)
  const [balance, setBalance] = useState(0)
  const [savings, setSavings] = useState(startingSavings)
  const [creditScore, setCreditScore] = useState(startCreditScore)
  const [qol, setQol] = useState(70)
  const [qolHistory, setQolHistory] = useState<number[]>([])

  // Credit cards
  const [creditCardOpen, setCreditCardOpen] = useState(false)
  const [creditCardBalance, setCreditCardBalance] = useState(0)
  const [creditCardLimit] = useState(1000)
  const [creditCardPromoMonths, setCreditCardPromoMonths] = useState(0)
  const [securedCardOpen, setSecuredCardOpen] = useState(false)
  const [securedCardBalance, setSecuredCardBalance] = useState(0)
  const [securedCardCollateral, setSecuredCardCollateral] = useState(0)

  // Bills
  const [billPayments, setBillPayments] = useState<Record<number, 'full' | 'minimum' | 'skip'>>({})
  const [lateFees, setLateFees] = useState<Record<number, number>>({})
  const [ccPaymentChoice, setCcPaymentChoice] = useState<'full' | 'minimum' | 'skip'>('minimum')
  const [scPaymentChoice, setScPaymentChoice] = useState<'full' | 'minimum' | 'skip'>('minimum')

  // Events
  const [monthEvents, setMonthEvents] = useState<CrisisEvent[]>([])
  const [eventIdx, setEventIdx] = useState(0)

  // Shop
  const [shopItems, setShopItems] = useState<ShopItemInstance[]>([])
  const [selectedShopIdx, setSelectedShopIdx] = useState<number | null>(null)

  // Investments
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>([])
  const [investmentReturns, setInvestmentReturns] = useState<{ name: string; amount: number; isLoss: boolean }[]>([])

  // Tracking
  const [monthLog, setMonthLog] = useState<string[]>([])
  const [smartDecisions, setSmartDecisions] = useState(0)
  const [prevBalance, setPrevBalance] = useState(0)
  const [prevSavings, setPrevSavings] = useState(startingSavings)
  const [prevCreditScore, setPrevCreditScore] = useState(startCreditScore)
  const [prevQol, setPrevQol] = useState(70)
  const [monthGrades, setMonthGrades] = useState<string[]>([])
  const [showCreditTools, setShowCreditTools] = useState(false)

  // Endless mode
  const [endlessMode, setEndlessMode] = useState(false)
  const [billPayStreak, setBillPayStreak] = useState(0) // consecutive months all bills paid in full

  const [seed] = useState(() => Math.floor(Math.random() * 100000))

  // ── Month initialization ──────────────────────────────────────────

  const startNewMonth = useCallback((m: number) => {
    setMonth(m)
    setPrevBalance(balance)
    setPrevSavings(savings)
    setPrevCreditScore(creditScore)
    setPrevQol(qol)

    const log: string[] = []
    let newBalance = balance + INCOME
    let newCreditScore = creditScore
    let newCreditCardBal = creditCardBalance
    let newPromo = creditCardPromoMonths

    log.push(`💰 Monthly income: +$${INCOME.toLocaleString()}`)

    // Process maturing investments
    const returns: typeof investmentReturns = []
    const remaining: ActiveInvestment[] = []
    for (const inv of activeInvestments) {
      if (inv.returnMonth === m) {
        if (inv.returnAmount > 0) {
          newBalance += inv.returnAmount
          returns.push({ name: inv.name, amount: inv.returnAmount, isLoss: false })
          log.push(`📈 ${inv.name} returned: +$${inv.returnAmount}`)
        } else {
          returns.push({ name: inv.name, amount: inv.amount, isLoss: true })
          log.push(`💸 ${inv.name}: $${inv.amount} LOST!`)
        }
      } else {
        remaining.push(inv)
      }
    }

    // Credit card interest (after promo ends)
    if (creditCardOpen && m > 1) {
      if (newPromo > 0) newPromo--
      if (newPromo <= 0 && newCreditCardBal > 0) {
        const interest = Math.round(newCreditCardBal * 0.22 / 12)
        newCreditCardBal += interest
        log.push(`💳 Credit card interest: +$${interest} added to balance`)
      }
    }

    // Credit score bonuses for open cards
    if (creditCardOpen) { newCreditScore = Math.min(850, newCreditScore + 3); log.push('💳 Credit card on file: +3 credit score') }
    if (securedCardOpen) { newCreditScore = Math.min(850, newCreditScore + 5); log.push('🔒 Secured card on file: +5 credit score') }

    // Apply state
    setBalance(newBalance)
    setCreditScore(newCreditScore)
    setCreditCardBalance(newCreditCardBal)
    setCreditCardPromoMonths(newPromo)
    setActiveInvestments(remaining)
    setInvestmentReturns(returns)
    setMonthEvents(generateMonthEvents(m, seed))
    setShopItems(generateShopItems(m, seed))
    setMonthLog(log)
    setEventIdx(0)
    setSelectedShopIdx(null)
    setShowCreditTools(false)

    // Init bill payments to full
    const initial: Record<number, 'full' | 'minimum' | 'skip'> = {}
    MONTHLY_BILLS.forEach((_, i) => { initial[i] = 'full' })
    setBillPayments(initial)
    setCcPaymentChoice('minimum')
    setScPaymentChoice('minimum')

    setPhase('month-start')
  }, [balance, savings, creditScore, qol, creditCardBalance, creditCardOpen, creditCardPromoMonths, securedCardOpen, activeInvestments, seed])

  // ── Bill payment total calculation ─────────────────────────────────

  const billTotal = useMemo(() => {
    let total = 0
    MONTHLY_BILLS.forEach((bill, i) => {
      const fee = lateFees[i] || 0
      const payment = billPayments[i] || 'full'
      if (payment === 'full') total += bill.amount + fee
      else if (payment === 'minimum') total += Math.round(bill.amount * 0.5)
    })
    // Credit card payment
    if (creditCardOpen && creditCardBalance > 0) {
      if (ccPaymentChoice === 'full') total += creditCardBalance
      else if (ccPaymentChoice === 'minimum') total += Math.max(25, Math.round(creditCardBalance * 0.02))
    }
    // Secured card payment
    if (securedCardOpen && securedCardBalance > 0) {
      if (scPaymentChoice === 'full') total += securedCardBalance
      else if (scPaymentChoice === 'minimum') total += Math.max(25, Math.round(securedCardBalance * 0.02))
    }
    return total
  }, [billPayments, lateFees, creditCardOpen, creditCardBalance, ccPaymentChoice, securedCardOpen, securedCardBalance, scPaymentChoice])

  // ── Handlers ───────────────────────────────────────────────────────

  const handleStart = () => {
    setBalance(INCOME)
    setMonthLog([`💰 Monthly income: +$${INCOME.toLocaleString()}`])
    setMonthEvents(generateMonthEvents(1, seed))
    setShopItems(generateShopItems(1, seed))
    const initial: Record<number, 'full' | 'minimum' | 'skip'> = {}
    MONTHLY_BILLS.forEach((_, i) => { initial[i] = 'full' })
    setBillPayments(initial)
    setPhase('month-start')
  }

  const handleOpenSecuredCard = (collateralAmount: number) => {
    if (savings < collateralAmount) return
    setSavings(prev => prev - collateralAmount)
    setSecuredCardOpen(true)
    setSecuredCardCollateral(collateralAmount)
    setSmartDecisions(prev => prev + 10)
    setMonthLog(prev => [...prev, `🔒 Opened secured card with $${collateralAmount} collateral`])
  }

  const handleOpenCreditCard = () => {
    if (month < 2 || creditCardOpen) return
    setCreditCardOpen(true)
    setCreditCardPromoMonths(3)
    setMonthLog(prev => [...prev, '💳 Opened regular credit card ($1,000 limit, 3-month promo)'])
  }

  const handleConfirmBills = () => {
    let totalPaid = 0
    const log: string[] = []
    let creditDelta = 0
    let qolDelta = 0
    const newLateFees: Record<number, number> = {}
    let newSmart = smartDecisions
    let newCcBal = creditCardBalance
    let newScBal = securedCardBalance
    let newScCollateral = securedCardCollateral

    MONTHLY_BILLS.forEach((bill, i) => {
      const payment = billPayments[i] || 'full'
      const fee = lateFees[i] || 0
      const fullCost = bill.amount + fee
      const feeStr = fee > 0 ? ` (+$${fee} late fee)` : ''

      switch (payment) {
        case 'full':
          totalPaid += fullCost
          log.push(`✅ ${bill.name}: $${fullCost}${feeStr}`)
          newSmart += 2
          break
        case 'minimum': {
          const minAmount = Math.round(bill.amount * 0.5)
          totalPaid += minAmount
          creditDelta += Math.round(bill.creditImpact * 0.3)
          qolDelta += Math.round(bill.qolImpact * 0.3)
          const lateFee = bill.category === 'essential' ? 25 : bill.category === 'important' ? 15 : 0
          if (lateFee > 0) newLateFees[i] = lateFee
          log.push(`⚡ ${bill.name}: $${minAmount} (minimum)${lateFee > 0 ? ` — $${lateFee} late fee next month` : ''}`)
          newSmart += 1
          break
        }
        case 'skip': {
          creditDelta += bill.creditImpact
          qolDelta += bill.qolImpact
          const lateFee = bill.category === 'essential' ? 25 : bill.category === 'important' ? 15 : 0
          if (lateFee > 0) newLateFees[i] = lateFee
          log.push(`❌ ${bill.name}: SKIPPED — ${bill.skipPenalty}`)
          break
        }
      }
    })

    // Credit card payment
    if (creditCardOpen && creditCardBalance > 0) {
      switch (ccPaymentChoice) {
        case 'full':
          totalPaid += creditCardBalance
          newCcBal = 0
          log.push(`✅ Credit Card: $${creditCardBalance} (paid in full)`)
          newSmart += 5
          break
        case 'minimum': {
          const minPay = Math.max(25, Math.round(creditCardBalance * 0.02))
          totalPaid += minPay
          newCcBal -= minPay
          log.push(`⚡ Credit Card: $${minPay} (minimum payment)`)
          newSmart += 2
          break
        }
        case 'skip':
          creditDelta -= 15
          newCcBal += 35
          log.push('❌ Credit Card: MISSED — credit hit (-15) + $35 late fee')
          newSmart -= 5
          break
      }
    }

    // Secured card payment
    if (securedCardOpen && securedCardBalance > 0) {
      switch (scPaymentChoice) {
        case 'full':
          totalPaid += securedCardBalance
          newScBal = 0
          log.push(`✅ Secured Card: $${securedCardBalance} (paid in full)`)
          newSmart += 5
          break
        case 'minimum': {
          const minPay = Math.max(25, Math.round(securedCardBalance * 0.02))
          totalPaid += minPay
          newScBal -= minPay
          log.push(`⚡ Secured Card: $${minPay} (minimum payment)`)
          newSmart += 2
          break
        }
        case 'skip': {
          const deduction = Math.min(newScCollateral, newScBal)
          newScCollateral -= deduction
          newScBal -= deduction
          log.push(`⚠️ Secured Card: $${deduction} auto-deducted from collateral`)
          break
        }
      }
    }

    setBalance(prev => prev - totalPaid)
    setCreditScore(prev => Math.max(300, Math.min(850, prev + creditDelta)))
    setQol(prev => Math.max(0, Math.min(100, prev + qolDelta)))
    setLateFees(newLateFees)
    setSmartDecisions(newSmart)
    setCreditCardBalance(newCcBal)
    setSecuredCardBalance(newScBal)
    setSecuredCardCollateral(newScCollateral)
    setMonthLog(prev => [...prev, ...log])
    setPhase('events')
  }

  const handleEventPayment = (source: 'balance' | 'savings' | 'creditCard' | 'securedCard') => {
    const event = monthEvents[eventIdx]
    const log: string[] = []

    if (event.amount > 0) {
      setBalance(prev => prev + event.amount)
      log.push(`${event.icon} ${event.description}: +$${event.amount}`)
    } else {
      const cost = Math.abs(event.amount)
      switch (source) {
        case 'balance':
          setBalance(prev => prev - cost)
          log.push(`${event.icon} Paid from balance: -$${cost}`)
          break
        case 'savings':
          if (savings >= cost) {
            setSavings(prev => prev - cost)
            log.push(`${event.icon} Paid from savings: -$${cost}`)
          } else {
            const fromSavings = savings
            const fromBalance = cost - fromSavings
            setSavings(0)
            setBalance(prev => prev - fromBalance)
            log.push(`${event.icon} $${fromSavings} from savings, $${fromBalance} from balance`)
          }
          break
        case 'creditCard':
          setCreditCardBalance(prev => prev + cost)
          log.push(`${event.icon} Charged to credit card: $${cost}`)
          break
        case 'securedCard':
          setSecuredCardBalance(prev => prev + cost)
          log.push(`${event.icon} Charged to secured card: $${cost}`)
          break
      }
    }

    setMonthLog(prev => [...prev, ...log])
    setPhase('event-resolve')
  }

  const handleEventNext = () => {
    if (eventIdx + 1 < monthEvents.length) {
      setEventIdx(prev => prev + 1)
      setPhase('events')
    } else {
      setPhase('shop')
    }
  }

  const handleShopPurchase = (source: 'balance' | 'savings' | 'creditCard' | 'securedCard') => {
    if (selectedShopIdx === null) return
    const item = shopItems[selectedShopIdx]
    const log: string[] = []

    switch (source) {
      case 'balance': setBalance(prev => prev - item.cost); break
      case 'savings': setSavings(prev => prev - item.cost); break
      case 'creditCard': setCreditCardBalance(prev => prev + item.cost); break
      case 'securedCard': setSecuredCardBalance(prev => prev + item.cost); break
    }

    if (item.qolBoost > 0) {
      setQol(prev => Math.min(100, prev + item.qolBoost))
    }

    if (item.type === 'investment' || item.type === 'scam') {
      const returnMonth = month + (item.returnMonths || 1)
      const returnAmount = item.type === 'scam' ? 0 : Math.round(item.cost * (item.returnMultiplier || 1))
      setActiveInvestments(prev => [...prev, {
        name: item.name,
        amount: item.cost,
        returnMonth,
        returnAmount,
        isScam: item.type === 'scam',
      }])
      if (item.type === 'scam') {
        log.push(`${item.icon} Invested $${item.cost} in "${item.name}"`)
        setSmartDecisions(prev => prev - 10)
      } else {
        log.push(`${item.icon} Invested $${item.cost} in ${item.name} (returns Month ${returnMonth})`)
        setSmartDecisions(prev => prev + 10)
      }
    } else {
      log.push(`${item.icon} ${item.name}: -$${item.cost} (+${item.qolBoost} QoL)`)
    }

    setMonthLog(prev => [...prev, ...log])
    setShopItems(prev => prev.filter((_, i) => i !== selectedShopIdx))
    setSelectedShopIdx(null)
  }

  const handleEndMonth = () => {
    setQolHistory(prev => [...prev, qol])
    const billsPaidFull = Object.values(billPayments).filter(p => p === 'full').length
    const billsPaidPct = billsPaidFull / MONTHLY_BILLS.length
    const balanceTrend = balance - prevBalance
    const creditTrend = creditScore - prevCreditScore
    const grade = getMonthGrade(billsPaidPct, balanceTrend, creditTrend, qol)
    setMonthGrades(prev => [...prev, grade])
    // Track bill payment streak
    if (billsPaidPct >= 1) {
      setBillPayStreak(prev => prev + 1)
    } else {
      setBillPayStreak(0)
    }
    setPhase('month-summary')
  }

  const handleNextMonth = () => {
    if (!endlessMode && month >= TOTAL_MONTHS) {
      setPhase('result')
      onComplete?.(calcScore())
    } else {
      startNewMonth(month + 1)
    }
  }

  const handleKeepPlaying = useCallback(() => {
    setEndlessMode(true)
    startNewMonth(month + 1)
  }, [month, startNewMonth])

  const calcScore = useCallback(() => {
    // 1. Savings health (200 pts) — % of target $1,500
    const savingsScore = Math.min(200, Math.round((savings / 1500) * 200))
    // 2. Credit score improvement (200 pts)
    const creditDelta = creditScore - startCreditScore
    const creditPart = Math.min(200, Math.max(0, Math.round((creditDelta / 100) * 200)))
    // 3. Quality of life average (200 pts)
    const allQol = [...qolHistory, qol]
    const avgQol = allQol.reduce((a, b) => a + b, 0) / allQol.length
    const qolPart = Math.min(200, Math.round((avgQol / 100) * 200))
    // 4. Debt management (200 pts) — low credit card debt
    const totalDebt = creditCardBalance + securedCardBalance
    const debtPart = totalDebt === 0 ? 200 : totalDebt < 200 ? 150 : totalDebt < 500 ? 100 : totalDebt < 1000 ? 50 : 0
    // 5. Smart decisions (200 pts)
    const maxSmart = (MONTHLY_BILLS.length * 2 * TOTAL_MONTHS) + 60
    const smartPart = Math.min(200, Math.max(0, Math.round((smartDecisions / maxSmart) * 200)))

    return Math.min(MAX_SCORE, savingsScore + creditPart + qolPart + debtPart + smartPart)
  }, [savings, creditScore, startCreditScore, qol, qolHistory, creditCardBalance, securedCardBalance, smartDecisions])

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setMonth(1)
    setBalance(0)
    setSavings(startingSavings)
    setCreditScore(startCreditScore)
    setQol(70)
    setQolHistory([])
    setCreditCardOpen(false)
    setCreditCardBalance(0)
    setCreditCardPromoMonths(0)
    setSecuredCardOpen(false)
    setSecuredCardBalance(0)
    setSecuredCardCollateral(0)
    setBillPayments({})
    setLateFees({})
    setMonthEvents([])
    setEventIdx(0)
    setShopItems([])
    setSelectedShopIdx(null)
    setActiveInvestments([])
    setInvestmentReturns([])
    setMonthLog([])
    setSmartDecisions(0)
    setMonthGrades([])
    setPrevBalance(0)
    setPrevSavings(startingSavings)
    setPrevCreditScore(startCreditScore)
    setPrevQol(70)
    setShowCreditTools(false)
    setEndlessMode(false)
    setBillPayStreak(0)
  }, [startingSavings, startCreditScore])

  // ── Computed values ────────────────────────────────────────────────

  const ccAvailableCredit = creditCardLimit - creditCardBalance
  const scAvailableCredit = securedCardCollateral - securedCardBalance
  const cumulativeScore = calcScore()

  // ── RENDER: Result ─────────────────────────────────────────────────

  if (phase === 'result') {
    const finalScore = calcScore()
    const xpEarned = Math.round((finalScore / MAX_SCORE) * XP_AVAILABLE)
    const creditDelta = creditScore - startCreditScore
    const allQol = [...qolHistory, qol]
    const avgQol = Math.round(allQol.reduce((a, b) => a + b, 0) / allQol.length)
    const totalDebt = creditCardBalance + securedCardBalance
    const maxSmart = (MONTHLY_BILLS.length * 2 * TOTAL_MONTHS) + 60

    const savingsScore = Math.min(200, Math.round((savings / 1500) * 200))
    const creditPart = Math.min(200, Math.max(0, Math.round((creditDelta / 100) * 200)))
    const qolPart = Math.min(200, Math.round((avgQol / 100) * 200))
    const debtPart = totalDebt === 0 ? 200 : totalDebt < 200 ? 150 : totalDebt < 500 ? 100 : totalDebt < 1000 ? 50 : 0
    const smartPart = Math.min(200, Math.max(0, Math.round((smartDecisions / maxSmart) * 200)))

    return (
      <div>
        <div className="grid grid-cols-2 gap-3 mb-4 max-w-sm mx-auto">
          <StatBox label="Final Savings" value={`$${savings.toLocaleString()}`} color="emerald" />
          <StatBox label="Credit Score" value={`${creditScore} (${creditDelta >= 0 ? '+' : ''}${creditDelta})`} color="blue" />
          <StatBox label="Avg Quality of Life" value={`${avgQol}%`} color="purple" />
          <StatBox label="Total Debt" value={`$${totalDebt}`} color={totalDebt === 0 ? 'emerald' : 'red'} />
        </div>

        {/* Score breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 max-w-sm mx-auto">
          <p className="text-xs font-bold text-gray-400 mb-3 uppercase">Score Breakdown</p>
          <ScoreRow label="Savings Health" value={savingsScore} max={200} />
          <ScoreRow label="Credit Improvement" value={creditPart} max={200} />
          <ScoreRow label="Quality of Life" value={qolPart} max={200} />
          <ScoreRow label="Debt Management" value={debtPart} max={200} />
          <ScoreRow label="Smart Decisions" value={smartPart} max={200} />
        </div>

        {/* Month grades */}
        <div className="flex justify-center gap-2 mb-4">
          {monthGrades.map((grade, i) => (
            <div key={i} className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
              grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
              grade === 'B' ? 'bg-blue-100 text-blue-700' :
              grade === 'C' ? 'bg-amber-100 text-amber-700' :
              grade === 'D' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700',
            )}>
              {grade}
            </div>
          ))}
        </div>

        <GameResult
          title={endlessMode ? `Budget Crisis — Month ${month}` : 'Budget Crisis'}
          score={finalScore}
          maxScore={MAX_SCORE}
          xpEarned={xpEarned}
          badgeEarned={finalScore >= 800 ? { name: 'Budget Hero', icon: '🦸' } : month >= 12 ? { name: 'Budget Veteran', icon: '🏅' } : null}
          onReplay={handleReplay}
          onKeepPlaying={handleKeepPlaying}
          moduleSlug="03-budgeting"
          gameSlug="budget-crisis"
        />
      </div>
    )
  }

  // ── RENDER: Intro ──────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Budget Crisis Simulator</h1>
        <p className="text-gray-500 mb-2">
          You earn <strong>${INCOME.toLocaleString()}/month</strong> with <strong>${startingSavings}</strong> in savings.
          Navigate <strong>{TOTAL_MONTHS} months</strong> of bills, crises, and financial decisions.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Pay bills (full, minimum, or skip), handle surprise events, open credit cards,
          and make smart purchases. Difficulty increases each month.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          {TOTAL_MONTHS} months · Credit cards · Shopping · {XP_AVAILABLE} XP max
        </p>
        <p className="text-xs text-purple-400 mb-8">
          Endless Mode unlocks after 6 months — crises get harder each month!
        </p>
        <button onClick={handleStart} className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          Start Game
        </button>
      </div>
    )
  }

  // ── RENDER: Month Start ────────────────────────────────────────────

  if (phase === 'month-start') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        <StreakNotification streak={billPayStreak} label="Bills Paid" variant="gold" />
        <GameHeader title={endlessMode ? 'Budget Crisis ∞' : 'Budget Crisis'} score={cumulativeScore} maxScore={MAX_SCORE} xpAvailable={XP_AVAILABLE} />

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {endlessMode ? `Month ${month} (Endless)` : `Month ${month} of ${TOTAL_MONTHS}`}
          </h2>
          <p className="text-sm text-gray-400">
            {month === 1 ? 'Welcome! Get to know your bills.' :
             month === 2 ? 'Things start happening. Regular credit card now available.' :
             month === 3 ? 'Watch out for too-good-to-be-true offers...' :
             month === 4 ? 'Pressure is building. Stay disciplined.' :
             month === 5 ? 'Major challenges ahead. Use your tools wisely.' :
             'Final month — finish strong!'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatBox label="Balance" value={`$${balance.toLocaleString()}`} color="blue" />
          <StatBox label="Savings" value={`$${savings.toLocaleString()}`} color="emerald" />
          <StatBox label="Credit Score" value={String(creditScore)} color="purple" />
          <StatBox label="Quality of Life" value={`${qol}%`} color="amber" />
        </div>

        {/* Investment returns */}
        {investmentReturns.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Investment Returns</p>
            {investmentReturns.map((r, i) => (
              <p key={i} className={cn('text-sm py-0.5', r.isLoss ? 'text-red-600' : 'text-emerald-600')}>
                {r.isLoss ? '💸' : '📈'} {r.name}: {r.isLoss ? `-$${r.amount} LOST` : `+$${r.amount}`}
              </p>
            ))}
          </div>
        )}

        {/* Credit card status */}
        {(creditCardOpen || securedCardOpen) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Credit Cards</p>
            {creditCardOpen && (
              <div className="text-sm text-gray-700 mb-1">
                💳 Regular: ${creditCardBalance} / ${creditCardLimit}
                {creditCardPromoMonths > 0 && <span className="text-emerald-600 ml-1">(promo: {creditCardPromoMonths}mo left)</span>}
                {creditCardPromoMonths <= 0 && creditCardBalance > 0 && <span className="text-red-500 ml-1">(22% APR active)</span>}
              </div>
            )}
            {securedCardOpen && (
              <div className="text-sm text-gray-700">
                🔒 Secured: ${securedCardBalance} / ${securedCardCollateral} (no interest)
              </div>
            )}
          </div>
        )}

        {/* Financial tools */}
        {(!creditCardOpen || !securedCardOpen) && (
          <div className="mb-4">
            <button
              onClick={() => setShowCreditTools(!showCreditTools)}
              className="text-sm font-semibold text-fresh-blue hover:underline mb-2"
            >
              {showCreditTools ? 'Hide Financial Tools ▲' : 'Open Financial Tools ▼'}
            </button>

            {showCreditTools && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {!securedCardOpen && (
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">🔒 Secured Credit Card</p>
                    <p className="text-xs text-gray-500 mb-2">
                      Deposit collateral from savings. Credit line = deposit. No interest. Best for credit building (+5/mo).
                    </p>
                    <div className="flex gap-2">
                      {[200, 300, 400, 500].map(amt => (
                        <button
                          key={amt}
                          onClick={() => handleOpenSecuredCard(amt)}
                          disabled={savings < amt}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                            savings >= amt
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
                          )}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!creditCardOpen && (
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-1">💳 Regular Credit Card</p>
                    {month < 2 ? (
                      <p className="text-xs text-gray-400">Available starting Month 2</p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 mb-2">
                          $1,000 credit line. Interest-free for 3 months, then 22% APR. Builds credit (+3/mo).
                        </p>
                        <button
                          onClick={handleOpenCreditCard}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
                        >
                          Apply Now
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upcoming events hint */}
        <p className="text-sm text-gray-500 mb-4 text-center">
          {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''} coming this month.
          First: choose how to pay your bills.
        </p>

        <button
          onClick={() => setPhase('bills')}
          className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Review Bills
        </button>
      </div>
    )
  }

  // ── RENDER: Bills Phase ────────────────────────────────────────────

  if (phase === 'bills') {
    const canAfford = balance >= billTotal

    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Budget Crisis" score={cumulativeScore} maxScore={MAX_SCORE} xpAvailable={XP_AVAILABLE} />

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500">Month {month} — Bills</span>
          <span className={cn('font-bold', canAfford ? 'text-emerald-600' : 'text-red-600')}>
            ${billTotal.toLocaleString()} / ${balance.toLocaleString()} available
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {MONTHLY_BILLS.map((bill, i) => {
            const fee = lateFees[i] || 0
            const fullCost = bill.amount + fee
            const minCost = Math.round(bill.amount * 0.5)
            const payment = billPayments[i] || 'full'

            return (
              <div key={bill.name} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{bill.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase',
                      bill.category === 'essential' ? 'bg-red-100 text-red-600' :
                      bill.category === 'important' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-500',
                    )}>{bill.category}</span>
                    {fee > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">+${fee} late</span>}
                  </div>
                  <span className="text-sm font-bold text-gray-600">${fullCost}</span>
                </div>

                {/* Payment options */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setBillPayments(prev => ({ ...prev, [i]: 'full' }))}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                      payment === 'full' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                    )}
                  >
                    Full ${fullCost}
                  </button>
                  <button
                    onClick={() => setBillPayments(prev => ({ ...prev, [i]: 'minimum' }))}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                      payment === 'minimum' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                    )}
                  >
                    Min ${minCost}
                  </button>
                  <button
                    onClick={() => setBillPayments(prev => ({ ...prev, [i]: 'skip' }))}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                      payment === 'skip' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                    )}
                  >
                    Skip
                  </button>
                </div>

                {/* Skip/min penalty preview */}
                {payment === 'skip' && (
                  <p className="text-xs text-red-400 mt-1">⚠️ {bill.skipPenalty}</p>
                )}
                {payment === 'minimum' && (
                  <p className="text-xs text-amber-500 mt-1">
                    Partial payment — {bill.category !== 'flexible' ? `$${bill.category === 'essential' ? 25 : 15} late fee next month` : 'minor impact'}
                  </p>
                )}
              </div>
            )
          })}

          {/* Credit card payment */}
          {creditCardOpen && creditCardBalance > 0 && (
            <div className="bg-white rounded-xl border-2 border-blue-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">💳 Credit Card Balance</span>
                <span className="text-sm font-bold text-gray-600">${creditCardBalance}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCcPaymentChoice('full')}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                    ccPaymentChoice === 'full' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                >
                  Full ${creditCardBalance}
                </button>
                <button
                  onClick={() => setCcPaymentChoice('minimum')}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                    ccPaymentChoice === 'minimum' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                >
                  Min ${Math.max(25, Math.round(creditCardBalance * 0.02))}
                </button>
                <button
                  onClick={() => setCcPaymentChoice('skip')}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                    ccPaymentChoice === 'skip' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                >
                  Skip
                </button>
              </div>
              {ccPaymentChoice === 'skip' && <p className="text-xs text-red-400 mt-1">⚠️ -15 credit score + $35 late fee</p>}
            </div>
          )}

          {/* Secured card payment */}
          {securedCardOpen && securedCardBalance > 0 && (
            <div className="bg-white rounded-xl border-2 border-emerald-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800">🔒 Secured Card Balance</span>
                <span className="text-sm font-bold text-gray-600">${securedCardBalance}</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setScPaymentChoice('full')}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                    scPaymentChoice === 'full' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                >
                  Full ${securedCardBalance}
                </button>
                <button
                  onClick={() => setScPaymentChoice('minimum')}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                    scPaymentChoice === 'minimum' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                >
                  Min ${Math.max(25, Math.round(securedCardBalance * 0.02))}
                </button>
                <button
                  onClick={() => setScPaymentChoice('skip')}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-bold transition-all',
                    scPaymentChoice === 'skip' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                >
                  Skip
                </button>
              </div>
              {scPaymentChoice === 'skip' && <p className="text-xs text-amber-500 mt-1">Auto-deducted from collateral (no credit hit)</p>}
            </div>
          )}
        </div>

        <button
          onClick={handleConfirmBills}
          disabled={!canAfford}
          className={cn(
            'w-full py-3 rounded-xl font-semibold transition-all',
            canAfford ? 'bg-fresh-blue text-white hover:bg-blue-700' : 'bg-red-100 text-red-600',
          )}
        >
          {canAfford
            ? `Pay Bills ($${billTotal.toLocaleString()})`
            : `Can't afford — reduce some bills ($${billTotal.toLocaleString()} > $${balance.toLocaleString()})`}
        </button>
      </div>
    )
  }

  // ── RENDER: Events Phase ───────────────────────────────────────────

  if (phase === 'events' && monthEvents[eventIdx]) {
    const event = monthEvents[eventIdx]
    const cost = Math.abs(event.amount)
    const isPositive = event.amount > 0

    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Budget Crisis" score={cumulativeScore} maxScore={MAX_SCORE} xpAvailable={XP_AVAILABLE} />

        <p className="text-sm text-gray-400 mb-4 text-center">
          Event {eventIdx + 1} of {monthEvents.length} — Month {month}
        </p>

        <div className={cn(
          'rounded-2xl border-2 p-5 mb-6 text-center',
          isPositive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50',
        )}>
          <span className="text-4xl block mb-3">{event.icon}</span>
          <p className="text-base font-semibold text-gray-800 mb-2">{event.description}</p>
          <p className={cn('text-2xl font-bold', isPositive ? 'text-emerald-700' : 'text-red-700')}>
            {isPositive ? '+' : '-'}${cost}
          </p>
        </div>

        {isPositive ? (
          <button
            onClick={() => handleEventPayment('balance')}
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Add to Balance (+${cost})
          </button>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <StatBox label="Balance" value={`$${balance.toLocaleString()}`} color="blue" />
              <StatBox label="Savings" value={`$${savings.toLocaleString()}`} color="emerald" />
            </div>

            <button
              onClick={() => handleEventPayment('balance')}
              className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Pay from Balance (-${cost})
            </button>

            <button
              onClick={() => handleEventPayment('savings')}
              disabled={savings <= 0}
              className={cn(
                'w-full py-3 rounded-xl font-semibold transition-all',
                savings > 0 ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed',
              )}
            >
              Use Savings ({savings >= cost ? `-$${cost}` : `$${savings} savings + $${cost - savings} balance`})
            </button>

            {creditCardOpen && ccAvailableCredit >= cost && (
              <button
                onClick={() => handleEventPayment('creditCard')}
                className="w-full py-3 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Charge to Credit Card (${ccAvailableCredit} available)
              </button>
            )}

            {securedCardOpen && scAvailableCredit >= cost && (
              <button
                onClick={() => handleEventPayment('securedCard')}
                className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Charge to Secured Card (${scAvailableCredit} available)
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── RENDER: Event Resolve ──────────────────────────────────────────

  if (phase === 'event-resolve') {
    const lastLog = monthLog[monthLog.length - 1]
    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Budget Crisis" score={cumulativeScore} maxScore={MAX_SCORE} xpAvailable={XP_AVAILABLE} />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 text-center">
          <p className="text-sm text-gray-700 mb-4">{lastLog}</p>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Balance" value={`$${balance.toLocaleString()}`} color={balance >= 0 ? 'blue' : 'red'} />
            <StatBox label="Savings" value={`$${savings.toLocaleString()}`} color="emerald" />
          </div>
        </div>
        <button onClick={handleEventNext} className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Continue
        </button>
      </div>
    )
  }

  // ── RENDER: Shop Phase ─────────────────────────────────────────────

  if (phase === 'shop') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Budget Crisis" score={cumulativeScore} maxScore={MAX_SCORE} xpAvailable={XP_AVAILABLE} />

        <h3 className="text-lg font-bold text-gray-900 mb-1 text-center">Monthly Opportunities</h3>
        <p className="text-xs text-gray-400 text-center mb-4">Optional purchases and investments. Choose wisely!</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatBox label="Balance" value={`$${balance.toLocaleString()}`} color="blue" />
          <StatBox label="Savings" value={`$${savings.toLocaleString()}`} color="emerald" />
        </div>

        {shopItems.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mb-6">No more items available this month.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {shopItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase',
                      item.type === 'fun' ? 'bg-purple-100 text-purple-600' :
                      item.type === 'investment' ? 'bg-blue-100 text-blue-600' :
                      'bg-blue-100 text-blue-600', // scams look like investments
                    )}>
                      {item.type === 'fun' ? 'fun' : 'invest'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">${item.cost}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                {item.qolBoost > 0 && <p className="text-xs text-purple-500 mb-2">+{item.qolBoost} Quality of Life</p>}

                {selectedShopIdx === idx ? (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-600">Pay with:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {balance >= item.cost && (
                        <button onClick={() => handleShopPurchase('balance')}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500 text-white hover:bg-blue-600">
                          Balance
                        </button>
                      )}
                      {savings >= item.cost && (
                        <button onClick={() => handleShopPurchase('savings')}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600">
                          Savings
                        </button>
                      )}
                      {creditCardOpen && ccAvailableCredit >= item.cost && (
                        <button onClick={() => handleShopPurchase('creditCard')}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600">
                          Credit Card
                        </button>
                      )}
                      {securedCardOpen && scAvailableCredit >= item.cost && (
                        <button onClick={() => handleShopPurchase('securedCard')}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-500 text-white hover:bg-teal-600">
                          Secured Card
                        </button>
                      )}
                      <button onClick={() => setSelectedShopIdx(null)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-200 text-gray-600 hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                    {balance < item.cost && savings < item.cost && !(creditCardOpen && ccAvailableCredit >= item.cost) && !(securedCardOpen && scAvailableCredit >= item.cost) && (
                      <p className="text-xs text-red-400">Can't afford this right now</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedShopIdx(idx)}
                    className="text-xs font-bold text-fresh-blue hover:underline"
                  >
                    {item.type === 'fun' ? 'Buy' : 'Invest'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleEndMonth}
          className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Done Shopping — End Month
        </button>
      </div>
    )
  }

  // ── RENDER: Shop Payment (unused — inline now) ─────────────────────

  // ── RENDER: Month Summary ──────────────────────────────────────────

  if (phase === 'month-summary') {
    const grade = monthGrades[monthGrades.length - 1] || 'C'
    const balanceDelta = balance - prevBalance
    const savingsDelta = savings - prevSavings
    const creditDelta = creditScore - prevCreditScore
    const qolDelta = qol - prevQol

    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Budget Crisis" score={cumulativeScore} maxScore={MAX_SCORE} xpAvailable={XP_AVAILABLE} />

        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Month {month} Report Card</h3>
          <div className={cn(
            'inline-flex w-14 h-14 rounded-xl items-center justify-center text-2xl font-bold mt-2',
            grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
            grade === 'B' ? 'bg-blue-100 text-blue-700' :
            grade === 'C' ? 'bg-amber-100 text-amber-700' :
            grade === 'D' ? 'bg-orange-100 text-orange-700' :
            'bg-red-100 text-red-700',
          )}>
            {grade}
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <p className="text-xs font-bold text-gray-400 mb-3 uppercase">Trends</p>
          <TrendRow label="Balance" value={`$${balance.toLocaleString()}`} delta={balanceDelta} prefix="$" />
          <TrendRow label="Savings" value={`$${savings.toLocaleString()}`} delta={savingsDelta} prefix="$" />
          <TrendRow label="Credit Score" value={String(creditScore)} delta={creditDelta} />
          <TrendRow label="Quality of Life" value={`${qol}%`} delta={qolDelta} suffix="%" />
        </div>

        {/* Credit card status */}
        {(creditCardOpen || securedCardOpen) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Credit Cards</p>
            {creditCardOpen && (
              <p className="text-sm text-gray-700 mb-1">
                💳 Regular: ${creditCardBalance} balance ({creditCardPromoMonths > 0 ? `promo: ${creditCardPromoMonths}mo` : '22% APR'})
              </p>
            )}
            {securedCardOpen && (
              <p className="text-sm text-gray-700">
                🔒 Secured: ${securedCardBalance} balance / ${securedCardCollateral} collateral
              </p>
            )}
          </div>
        )}

        {/* Active investments */}
        {activeInvestments.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Pending Investments</p>
            {activeInvestments.map((inv, i) => (
              <p key={i} className="text-sm text-gray-700">
                {inv.isScam ? '📊' : '📈'} {inv.name}: ${inv.amount} (returns Month {inv.returnMonth})
              </p>
            ))}
          </div>
        )}

        {/* Activity log */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 max-h-48 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Activity Log</p>
          {monthLog.map((entry, i) => (
            <p key={i} className="text-xs text-gray-600 py-0.5">{entry}</p>
          ))}
        </div>

        {/* Cumulative score */}
        <div className="text-center text-sm text-gray-500 mb-4">
          Running Score: <span className="font-bold text-gray-700">{cumulativeScore}</span> / {MAX_SCORE}
        </div>

        <button
          onClick={handleNextMonth}
          className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          {!endlessMode && month >= TOTAL_MONTHS ? 'See Final Results' : `Start Month ${month + 1}`}
        </button>

        {endlessMode && (
          <button
            onClick={() => { setPhase('result'); onComplete?.(calcScore()) }}
            className="w-full mt-2 bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            End Run — See Final Results
          </button>
        )}
      </div>
    )
  }

  return null
}

// ── Sub-components ───────────────────────────────────────────────────

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }
  return (
    <div className={cn('rounded-xl border p-3 text-center', colorMap[color] ?? colorMap.blue)}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs opacity-75">{label}</p>
    </div>
  )
}

function TrendRow({ label, value, delta, prefix = '', suffix = '' }: {
  label: string; value: string; delta: number; prefix?: string; suffix?: string
}) {
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→'
  const color = delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-500' : 'text-gray-400'
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-800">{value}</span>
        <span className={cn('text-xs font-bold', color)}>
          {arrow} {prefix}{Math.abs(delta)}{suffix}
        </span>
      </div>
    </div>
  )
}

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-800">{value}/{max}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
