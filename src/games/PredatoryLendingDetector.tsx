import { useState, useCallback, useEffect, useRef } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { cn } from '../lib/cn'
import { Mail, ChevronDown, ChevronUp, ChevronRight, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── Data ─────────────────────────────────────────────────────────────

type Verdict = 'legitimate' | 'predatory' | 'research'

interface RedFlag {
  text: string
  severity: 'high' | 'medium' | 'low'
}

interface MailOffer {
  lender: string
  headline: string
  details: string[]
  redFlags: RedFlag[]
  correct: Verdict
  consequence: string
  apr?: string
}

const OFFERS: MailOffer[] = [
  {
    lender: 'QuickCash Express',
    headline: 'Get $500 TODAY — No Credit Check!',
    details: [
      'Loan amount: $300–$1,000',
      'APR: 399%',
      'Fee: $45 per $100 borrowed',
      'Repayment: Due in full on next payday (14 days)',
      'Late fee: $50 + account sent to collections after 30 days',
      'No credit check required',
      'Guaranteed approval',
    ],
    redFlags: [
      { text: '399% APR — nearly 400 times a normal rate', severity: 'high' },
      { text: '"No credit check" — legitimate lenders always check', severity: 'high' },
      { text: '"Guaranteed approval" — no responsible lender guarantees', severity: 'high' },
      { text: 'Full repayment in 14 days — designed for repeat borrowing', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'A $300 payday loan at this rate costs $435 to repay in 14 days. Most borrowers can\'t, so they reborrow — paying $135 in fees every 2 weeks. Annual cost: $3,510 on a $300 loan.',
    apr: '399%',
  },
  {
    lender: 'First Federal Credit Union',
    headline: 'Secured Credit Card — Rebuild Your Credit',
    details: [
      'APR: 17.99% variable',
      'Annual fee: $0',
      'Deposit: $200–$2,000 (becomes your credit limit)',
      'Reports to all 3 credit bureaus monthly',
      'Upgrade to unsecured after 12 months of on-time payments',
      'Free credit score monitoring',
      'No origination fee',
    ],
    redFlags: [],
    correct: 'legitimate',
    consequence: 'This is a textbook legitimate secured card. Low APR for the category, no annual fee, reports to all bureaus, and has an upgrade path. Exactly what you want for rebuilding.',
  },
  {
    lender: 'EZ Auto Sales',
    headline: 'Bad Credit? No Problem! Drive Today!',
    details: [
      'APR: 24.99%',
      'Vehicles: 2010–2015 models, 80K–120K miles',
      'Down payment: $500 minimum',
      'In-house financing — we are the bank',
      'GPS tracking device installed on all vehicles',
      'Mandatory arbitration — no court disputes',
      'Vehicle warranty: 30 days / 1,000 miles',
      'Bi-weekly payments of $189 for 48 months',
    ],
    redFlags: [
      { text: '24.99% APR — double a fair auto rate', severity: 'high' },
      { text: 'GPS tracking = remote disable if you miss payment', severity: 'high' },
      { text: 'Mandatory arbitration — you waive your right to sue', severity: 'high' },
      { text: '30-day warranty on high-mileage vehicles', severity: 'medium' },
      { text: 'Bi-weekly payments obscure the true monthly cost ($409/mo)', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'Total cost: $500 down + $189 × 104 payments = $20,156 for a car worth $6,000. The GPS lets them repo your car instantly. Buy-here-pay-here lots are one of the worst post-bankruptcy traps.',
    apr: '24.99%',
  },
  {
    lender: 'National Debt Solutions',
    headline: 'Consolidate Your Debt — One Low Payment!',
    details: [
      'Debt consolidation loan: $5,000–$35,000',
      'APR: 18%–36% based on credit',
      'Origination fee: 5% of loan amount',
      'Prepayment penalty: 3% if paid off early',
      'Term: 36–60 months',
      '"We negotiate with your creditors!"',
      'Monthly fee: $49 for account management',
    ],
    redFlags: [
      { text: 'Origination fee of 5% — $250 on a $5K loan before you see a dollar', severity: 'high' },
      { text: 'Prepayment penalty — punishes you for paying off early', severity: 'high' },
      { text: '$49/month "management fee" on top of loan payments', severity: 'high' },
      { text: 'APR up to 36% — worse than many credit cards', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'On a $10,000 loan: $500 origination + $49×36 months ($1,764) in fees + $5,400+ in interest. You pay over $17,600 for $10,000. Legitimate consolidation doesn\'t charge monthly management fees.',
    apr: '18-36%',
  },
  {
    lender: 'Discover it® Secured',
    headline: 'Secured Card with Cash Back Rewards',
    details: [
      'APR: 28.24% variable',
      'Annual fee: $0',
      'Cash back: 2% at gas stations and restaurants (up to $1,000/quarter), 1% all other',
      'Deposit: $200 minimum',
      'Free FICO score on monthly statements',
      'Reports to all 3 bureaus',
      'Automatic review for upgrade after 8 months',
    ],
    redFlags: [
      { text: '28.24% APR is high — but typical for secured cards', severity: 'low' },
    ],
    correct: 'legitimate',
    consequence: 'This is a well-known, legitimate secured card from a major issuer. The APR is high but irrelevant if you pay in full monthly. Cash back rewards are a nice bonus for rebuilding.',
  },
  {
    lender: 'RentMaster Plus',
    headline: 'Rent-to-Own: Brand New Furniture, No Credit Needed',
    details: [
      'No credit check',
      'Weekly payments of $29.99 for a $400 sofa',
      'Total payments over 78 weeks: $2,339',
      'Ownership transfers after final payment',
      'Early buyout available (call for quote)',
      'Free delivery',
      'Late fee: $15 per occurrence',
    ],
    redFlags: [
      { text: 'Total cost $2,339 for a $400 item — 485% markup', severity: 'high' },
      { text: '"No credit check" — doesn\'t report payments either', severity: 'medium' },
      { text: 'Weekly payments obscure the outrageous total', severity: 'high' },
      { text: 'Early buyout "call for quote" — hides the real cost', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'You\'d pay $2,339 for a $400 sofa. That\'s an effective APR of over 200%. The same sofa is available used for $50-100 or new at a furniture store for $400 on a 0% payment plan.',
    apr: '~200%+',
  },
  {
    lender: 'Self Financial',
    headline: 'Credit Builder Account — Build Savings & Credit',
    details: [
      'Monthly payment: $25–$150',
      'Term: 12 or 24 months',
      'APR: 15.51%–15.97%',
      'Payments reported to all 3 bureaus',
      'Money held in CD — returned at end of term',
      'No credit check to open',
      'Administrative fee: $9 one-time',
    ],
    redFlags: [],
    correct: 'legitimate',
    consequence: 'Self is a legitimate credit-builder product. You\'re essentially saving into a locked CD while building payment history. The interest cost is modest for the credit-building benefit.',
  },
  {
    lender: 'FastLoan Direct',
    headline: 'Personal Loan $1,000–$5,000 — Instant Decision!',
    details: [
      'APR: 99%–199%',
      'Origination fee: 10%',
      'Term: 12–24 months',
      'Guaranteed approval with any income',
      'Direct deposit in 24 hours',
      'Prepayment penalty: 2 months of interest',
      'Automatic bank withdrawal — cannot be changed',
    ],
    redFlags: [
      { text: '99-199% APR — astronomically high', severity: 'high' },
      { text: '10% origination fee — $500 on a $5,000 loan', severity: 'high' },
      { text: '"Guaranteed approval" with no credit standards', severity: 'high' },
      { text: 'Locked automatic withdrawal — can\'t stop payments', severity: 'high' },
      { text: 'Prepayment penalty traps you in the loan', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'A $3,000 loan at 149% APR = $7,470 total repayment over 2 years. The origination fee means you only receive $2,700. The locked auto-withdrawal can overdraft your account.',
    apr: '99-199%',
  },
  {
    lender: 'Community First CDFI',
    headline: 'Emergency Loan for Community Members',
    details: [
      'Loan amount: $500–$2,000',
      'APR: 18%',
      'No origination fee',
      'Term: 6–12 months',
      'Reports to credit bureaus',
      'Free financial counseling included',
      'Hardship deferment available',
      'Based on ability to repay, not just credit score',
    ],
    redFlags: [],
    correct: 'legitimate',
    consequence: 'CDFIs (Community Development Financial Institutions) serve underbanked communities. 18% APR is fair for unsecured lending, and the financial counseling adds real value. This is what ethical lending looks like.',
  },
  {
    lender: 'Premier Title Loans',
    headline: 'Use Your Car Title — Get Cash in 30 Minutes!',
    details: [
      'Loan: 25–50% of vehicle value',
      'APR: 300%',
      'Fee: 25% of loan per month',
      'Your car title is collateral — vehicle can be repossessed',
      '30-day term, renewable',
      'No credit check',
      'Rollover fee: $75 per renewal',
    ],
    redFlags: [
      { text: '300% APR', severity: 'high' },
      { text: 'You can lose your car if you miss one payment', severity: 'high' },
      { text: '30-day term designed for rollovers at $75 each', severity: 'high' },
      { text: '25% monthly fee — $250/month on a $1,000 loan', severity: 'high' },
    ],
    correct: 'predatory',
    consequence: '1 in 5 title loan borrowers loses their vehicle. A $1,000 loan costs $250/month in fees alone. After 4 rollovers, you\'ve paid $1,300 in fees and still owe the original $1,000.',
    apr: '300%',
  },
  {
    lender: 'Capital One Platinum Secured',
    headline: 'Build Credit with Responsible Use',
    details: [
      'APR: 30.49% variable',
      'Annual fee: $0',
      'Deposit: $49, $99, or $200',
      'Access to higher credit line with no additional deposit',
      'Reports to all 3 bureaus',
      'Automatic consideration for upgrade',
      'CreditWise free credit monitoring',
    ],
    redFlags: [
      { text: '30.49% APR — high, but standard for secured cards', severity: 'low' },
    ],
    correct: 'legitimate',
    consequence: 'Major bank secured card with low deposit options. High APR only matters if you carry a balance — pay in full monthly and it\'s irrelevant. Good path to an unsecured Capital One card.',
  },
  {
    lender: 'Advance America',
    headline: 'Payday Advance — $100 to $1,000',
    details: [
      'Fee: $15–$30 per $100 borrowed',
      'APR: 400%–780% depending on state',
      'Due on next payday',
      'Automatic renewal if not paid in full',
      'No credit check',
      '"Rollovers available for a small fee"',
      'Same-day funding',
    ],
    redFlags: [
      { text: '400-780% APR', severity: 'high' },
      { text: 'Automatic renewal = debt trap by design', severity: 'high' },
      { text: '"Small fee" rollovers can cost more than the original loan', severity: 'high' },
      { text: 'No credit check — doesn\'t help your score', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'The average payday borrower renews 8 times, paying $520 in fees on a $375 loan. This business model depends on you NOT being able to pay it back on time.',
    apr: '400-780%',
  },
  {
    lender: 'GreenPath Financial Wellness',
    headline: 'Free Debt Management Plan — Lower Your Payments',
    details: [
      'Nonprofit organization',
      'Free financial counseling',
      'Negotiate lower interest rates with creditors',
      'One monthly payment to GreenPath, distributed to creditors',
      'Monthly fee: $0–$50 (income-based)',
      'Accredited by NFCC (National Foundation for Credit Counseling)',
      'Does NOT require new loan',
    ],
    redFlags: [],
    correct: 'legitimate',
    consequence: 'NFCC-accredited nonprofits are legitimate and often reduce interest rates to 0-8%. They don\'t issue new loans — they negotiate with existing creditors. Very different from debt settlement scams.',
  },
  {
    lender: 'CreditFix Pro',
    headline: 'We GUARANTEE to Remove Bankruptcies from Your Credit Report!',
    details: [
      'Service fee: $799 upfront + $99/month',
      '"100% money-back guarantee"',
      '"Proprietary legal loopholes"',
      'Promises to remove bankruptcy, collections, and late payments',
      '"Results in 45 days or less"',
      'Requires power of attorney over your credit accounts',
      'No BBB listing found',
    ],
    redFlags: [
      { text: 'Guaranteeing removal of accurate information is illegal per FTC', severity: 'high' },
      { text: '"Legal loopholes" — there are none for accurate bankruptcy records', severity: 'high' },
      { text: 'Requires power of attorney — extreme control over your accounts', severity: 'high' },
      { text: '$799 upfront fee — legitimate companies charge after results', severity: 'high' },
      { text: 'No BBB listing', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'Credit repair scams charge hundreds for things you can do for free. Accurate bankruptcy records CANNOT be legally removed before 7-10 years. The FTC actively prosecutes these companies.',
    apr: 'N/A',
  },
  {
    lender: 'OpenSky® Secured Visa',
    headline: 'No Credit Check Secured Card',
    details: [
      'APR: 22.64% variable',
      'Annual fee: $35',
      'Deposit: $200–$3,000',
      'No credit check to apply',
      'Reports to all 3 bureaus',
      'Available to anyone regardless of credit history',
    ],
    redFlags: [
      { text: '$35 annual fee — unusual for secured cards but not disqualifying', severity: 'low' },
    ],
    correct: 'research',
    consequence: 'OpenSky is legitimate but the $35 annual fee makes it less ideal than fee-free secured cards. Worth considering ONLY if you can\'t qualify for a no-fee secured card. Do more research before committing.',
  },
  {
    lender: 'MoneyLion',
    headline: 'Credit Builder Plus — $19.99/month',
    details: [
      'Credit builder loan included',
      'Cash advances up to $250 at 0% APR',
      'Reports to all 3 bureaus',
      'Investment account included',
      'Monthly membership: $19.99',
      'Managed investment with robo-advisor',
    ],
    redFlags: [
      { text: '$19.99/month is $240/year — compare to free alternatives', severity: 'medium' },
    ],
    correct: 'research',
    consequence: 'MoneyLion is legitimate but the monthly fee adds up. The credit builder loan is available from Self for less, and the cash advance feature can create dependency. Research alternatives first.',
  },
  {
    lender: 'Possible Finance',
    headline: 'Small Loan Alternative to Payday — $100-$500',
    details: [
      'APR: 150%–200%',
      'Installment payments over 8 weeks',
      'Reports to credit bureaus (unlike payday)',
      'No rollover fees',
      'Available via mobile app',
      'Can reschedule one payment for free',
    ],
    redFlags: [
      { text: '150-200% APR is still very high', severity: 'high' },
      { text: 'Better than payday but still expensive', severity: 'medium' },
    ],
    correct: 'research',
    consequence: 'Better than a payday loan (installments, reports to bureaus, no rollovers) but still very expensive. Use only in true emergencies when all other options are exhausted. Research credit union alternatives first.',
  },
  {
    lender: 'FlexRent Solutions',
    headline: 'Lease-to-Own the Latest iPhone — Just $35/week!',
    details: [
      'No credit check required',
      'Weekly payment: $35',
      'Term: 52 weeks',
      'Total cost: $1,820',
      'Retail price of phone: $799',
      'Ownership at end of lease',
      'Early purchase option available at any time',
      'Late payment fee: $15',
    ],
    redFlags: [
      { text: 'Total cost $1,820 for an $799 phone — 128% markup', severity: 'high' },
      { text: 'Weekly payments hide the true total', severity: 'medium' },
      { text: 'Doesn\'t report to credit bureaus', severity: 'medium' },
    ],
    correct: 'predatory',
    consequence: 'You\'d pay $1,820 for a phone you can buy for $799 — or get for $0 down with a carrier payment plan at 0% APR. Lease-to-own electronics is never a good deal.',
    apr: 'Effective ~128%',
  },
  {
    lender: 'Navy Federal Credit Union',
    headline: 'nRewards® Secured Card for Military & Family',
    details: [
      'APR: 18.00% variable',
      'Annual fee: $0',
      'Deposit: $200–$5,000',
      'Rewards: 1 point per dollar on all purchases',
      'Reports to all 3 bureaus',
      'Path to unsecured upgrade',
      'Eligibility: Military, DoD, and family members',
    ],
    redFlags: [],
    correct: 'legitimate',
    consequence: 'One of the best secured cards available — low APR, no annual fee, rewards, and credit union member benefits. Only limitation is military/family eligibility.',
  },
  {
    lender: 'Cash Call Inc.',
    headline: 'Personal Installment Loan — $2,600 to $10,000',
    details: [
      'APR: 90%–175%',
      'Origination fee: 4.75%',
      'Term: 24–47 months',
      'Monthly payments auto-deducted',
      'No prepayment penalty',
      '"Great for debt consolidation!"',
      'BBB rating: F',
    ],
    redFlags: [
      { text: '90-175% APR — unconscionable rates', severity: 'high' },
      { text: 'BBB rating: F', severity: 'high' },
      { text: 'Auto-deduction with no easy way to stop', severity: 'medium' },
      { text: 'Marketing debt consolidation at these rates is deceptive', severity: 'high' },
    ],
    correct: 'predatory',
    consequence: 'A $5,000 loan at 130% APR over 3 years = $19,500 total repayment. The BBB "F" rating tells you everything. They\'ve been sued by multiple state attorneys general.',
    apr: '90-175%',
  },
]

// ── Shuffle helper ───────────────────────────────────────────────────
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Component ────────────────────────────────────────────────────────

type Phase = 'intro' | 'sorting' | 'feedback' | 'result'

const XP_AVAILABLE = 300
const MAX_SCORE = 1000
const TIME_LIMIT = 300 // 5 minutes

export default function PredatoryLendingDetector({ onComplete }: GameProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [offers, setOffers] = useState<MailOffer[]>([])
  const [offerIdx, setOfferIdx] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [lastFeedback, setLastFeedback] = useState<{ offer: MailOffer; wasCorrect: boolean; chose: Verdict } | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [startTime, setStartTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [seed] = useState(() => Math.floor(Math.random() * 100000))

  const handleStart = () => {
    const shuffled = shuffle(OFFERS, seed)
    setOffers(shuffled)
    setOfferIdx(0)
    setCorrect(0)
    setTotal(0)
    setStartTime(Date.now())
    setTimeLeft(TIME_LIMIT)
    setPhase('sorting')

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Cleanup timer
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const calcScore = useCallback(() => {
    // Accuracy (70%) + time bonus (30%)
    const accuracy = total > 0 ? correct / total : 0
    const accScore = Math.round(accuracy * 700)

    const elapsed = (Date.now() - startTime) / 1000
    const speedRatio = Math.max(0, 1 - elapsed / (TIME_LIMIT * 1.5))
    const timeScore = Math.round(speedRatio * 300)

    return Math.min(MAX_SCORE, accScore + timeScore)
  }, [correct, total, startTime])

  // Time's up
  useEffect(() => {
    if (timeLeft <= 0 && phase === 'sorting') {
      setPhase('result')
      onComplete?.(calcScore())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft, phase, calcScore, onComplete])

  const handleSort = (verdict: Verdict) => {
    const offer = offers[offerIdx]
    const wasCorrect = verdict === offer.correct
    if (wasCorrect) setCorrect(prev => prev + 1)
    setTotal(prev => prev + 1)

    setLastFeedback({ offer, wasCorrect, chose: verdict })
    setExpanded(false)
    setPhase('feedback')
  }

  const handleNext = () => {
    setLastFeedback(null)
    if (offerIdx + 1 >= offers.length) {
      if (timerRef.current) clearInterval(timerRef.current)
      setPhase('result')
      onComplete?.(calcScore())
    } else {
      setOfferIdx(prev => prev + 1)
      setPhase('sorting')
    }
  }

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setOffers([])
    setOfferIdx(0)
    setCorrect(0)
    setTotal(0)
    setLastFeedback(null)
    setTimeLeft(TIME_LIMIT)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // ── Result ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = calcScore()
    const xpEarned = Math.round((finalScore / MAX_SCORE) * XP_AVAILABLE)
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    return (
      <div>
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{correct}/{total}</p>
            <p className="text-xs text-emerald-600">Correct</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{accuracy}%</p>
            <p className="text-xs text-blue-600">Accuracy</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-purple-700">{timeLeft}s</p>
            <p className="text-xs text-purple-600">Time Left</p>
          </div>
        </div>
        <GameResult
          title="Predatory Lending Detector"
          score={finalScore}
          maxScore={MAX_SCORE}
          xpEarned={xpEarned}
          badgeEarned={accuracy >= 90 ? { name: 'Trap Spotter', icon: '🔍' } : null}
          onReplay={handleReplay}
          gameSlug="predatory-lending-detector"
          moduleSlug="08-predatory-traps"
        />
      </div>
    )
  }

  // ── Intro ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Predatory Lending Detector</h1>
        <p className="text-gray-500 mb-2">
          Your mailbox is full of loan and credit offers. Some are legitimate, some are traps,
          and some need more research.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Read each offer's details. Expand for fine print. Sort into: <strong>Legitimate</strong>,
          <strong> Predatory</strong>, or <strong>Needs Research</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {OFFERS.length} offers · 5-minute time limit · Speed bonus · {XP_AVAILABLE} XP max
        </p>
        <button onClick={handleStart} className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          Open Mailbox 📬
        </button>
      </div>
    )
  }

  // ── Sorting ────────────────────────────────────────────────────────
  if (phase === 'sorting' && offers[offerIdx]) {
    const offer = offers[offerIdx]
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60

    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader
          title="Predatory Detector"
          score={correct}
          maxScore={total || 1}
          timerSeconds={timeLeft}
          xpAvailable={XP_AVAILABLE}
        />

        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Offer {offerIdx + 1} of {offers.length}</span>
          <span className={cn('font-mono', timeLeft <= 60 ? 'text-red-500 font-bold' : '')}>
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-fresh-blue rounded-full transition-all" style={{ width: `${(offerIdx / offers.length) * 100}%` }} />
        </div>

        {/* Mail card */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">{offer.lender}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{offer.headline}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-5">
            <ul className="space-y-1.5">
              {offer.details.map((detail, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-gray-300 mt-1">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable red flags hint */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Hide analysis' : 'Show red flag analysis'}
          </button>

          {expanded && offer.redFlags.length > 0 && (
            <div className="p-4 bg-red-50 border-t border-red-100 space-y-2">
              {offer.redFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className={cn(
                    'w-4 h-4 flex-shrink-0 mt-0.5',
                    flag.severity === 'high' ? 'text-red-500' : flag.severity === 'medium' ? 'text-amber-500' : 'text-gray-400',
                  )} />
                  <span className="text-xs text-gray-700">{flag.text}</span>
                </div>
              ))}
            </div>
          )}
          {expanded && offer.redFlags.length === 0 && (
            <div className="p-4 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-700">No significant red flags detected</span>
              </div>
            </div>
          )}
        </div>

        {/* Sort buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleSort('legitimate')} className="py-3 px-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:border-emerald-400 transition-all text-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-emerald-700">Legitimate</span>
          </button>
          <button onClick={() => handleSort('predatory')} className="py-3 px-2 rounded-xl border-2 border-red-200 bg-red-50 hover:border-red-400 transition-all text-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-red-700">Predatory</span>
          </button>
          <button onClick={() => handleSort('research')} className="py-3 px-2 rounded-xl border-2 border-amber-200 bg-amber-50 hover:border-amber-400 transition-all text-center">
            <HelpCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-amber-700">Research</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Feedback ───────────────────────────────────────────────────────
  if (phase === 'feedback' && lastFeedback) {
    const { offer, wasCorrect, chose } = lastFeedback
    const verdictLabels: Record<Verdict, string> = { legitimate: 'Legitimate', predatory: 'Predatory', research: 'Needs Research' }

    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Predatory Detector" score={correct} maxScore={total} xpAvailable={XP_AVAILABLE} />

        <div className={cn(
          'rounded-2xl border-2 p-5 mb-4',
          wasCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50',
        )}>
          <p className={cn('text-sm font-bold mb-1', wasCorrect ? 'text-emerald-700' : 'text-red-700')}>
            {wasCorrect ? '✅ Correct!' : `❌ You chose "${verdictLabels[chose]}" — it's actually "${verdictLabels[offer.correct]}"`}
          </p>
          <p className="text-xs text-gray-500 mb-2">{offer.lender}: {offer.headline}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{offer.consequence}</p>
        </div>

        <button onClick={handleNext} className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          {offerIdx + 1 >= offers.length ? 'See Results' : 'Next Offer'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return null
}
