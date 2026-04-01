import { useState, useCallback } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { StreakNotification, MilestonePopup } from './shared/StreakNotification'
import { cn } from '../lib/cn'
import { TrendingUp, TrendingDown, ChevronRight, Info, Target, Infinity as InfinityIcon } from 'lucide-react'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── FICO factor weights ──────────────────────────────────────────────

interface ScoreFactors {
  paymentHistory: number     // 35% — 0-100 scale
  utilization: number        // 30% — 0-100 (lower is better)
  historyLength: number      // 15% — months
  newCredit: number          // 10% — inquiries in last 6 months
  creditMix: number          // 10% — number of account types (1-3)
}

function computeScore(factors: ScoreFactors): number {
  // Payment history: 35% (100 pts best)
  const phScore = factors.paymentHistory * 0.35

  // Utilization: 30% (lower better — <10% = 100, <30% = 80, <50% = 50, >50% = 20)
  const utilPct = factors.utilization
  const utilScore = (utilPct <= 10 ? 100 : utilPct <= 30 ? 80 : utilPct <= 50 ? 50 : 20) * 0.30

  // History length: 15% (scaled by months, max at 24)
  const hlScore = Math.min(100, (factors.historyLength / 24) * 100) * 0.15

  // New credit: 10% (fewer inquiries better)
  const ncScore = (factors.newCredit <= 1 ? 100 : factors.newCredit <= 3 ? 70 : 40) * 0.10

  // Credit mix: 10%
  const cmScore = (factors.creditMix >= 3 ? 100 : factors.creditMix >= 2 ? 70 : 40) * 0.10

  // Map 0-100 composite to FICO 300-850 range
  const composite = phScore + utilScore + hlScore + ncScore + cmScore
  return Math.round(300 + (composite / 100) * 550)
}

// ── Decision data ────────────────────────────────────────────────────

interface Decision {
  description: string
  choices: Choice[]
}

interface Choice {
  text: string
  effects: Partial<ScoreFactors> & { utilDelta?: number; inquiryAdd?: number; mixAdd?: number }
  explanation: string
  isOptimal: boolean
}

const MONTHLY_DECISIONS: Decision[][] = [
  // Month 1
  [
    {
      description: 'Your secured credit card statement is $150 on a $500 limit (30% utilization). How do you pay it?',
      choices: [
        { text: 'Pay the full $150 balance', effects: { utilDelta: -30, paymentHistory: 5 }, explanation: 'Full payment = 0% utilization next month + on-time payment recorded. Ideal behavior.', isOptimal: true },
        { text: 'Pay minimum ($25)', effects: { utilDelta: -5, paymentHistory: 2 }, explanation: 'Minimum payment counts as on-time, but high remaining balance keeps utilization elevated.', isOptimal: false },
        { text: 'Pay $100, keep $50 balance', effects: { utilDelta: -20, paymentHistory: 4 }, explanation: 'Good payment, brings utilization to 10%. Almost optimal — aim for full payoff.', isOptimal: false },
      ],
    },
    {
      description: 'You receive a pre-approved offer for a store credit card with 28% APR. Apply?',
      choices: [
        { text: 'Decline — stick with secured card', effects: {}, explanation: 'Smart move. Store cards have terrible terms and the hard inquiry costs more than the benefit right now.', isOptimal: true },
        { text: 'Apply for the card', effects: { inquiryAdd: 1, mixAdd: 1, paymentHistory: -3 }, explanation: 'Hard inquiry costs 5-10 points. Store cards rarely help rebuild and often hurt with high APR.', isOptimal: false },
        { text: 'Ask for more details first', effects: {}, explanation: 'Researching is fine, but these offers rarely improve. Store cards average 25-29% APR.', isOptimal: false },
      ],
    },
    {
      description: 'You notice an error on your credit report — a $0 balance account is showing as $200 owed. What do you do?',
      choices: [
        { text: 'File a dispute with all three bureaus', effects: { paymentHistory: 8 }, explanation: 'Disputing errors can quickly add 10-30 points. Always dispute inaccuracies.', isOptimal: true },
        { text: 'Ignore it — it\'s not a lot of money', effects: { paymentHistory: -2 }, explanation: 'Even small errors drag your score down. Every point matters at this stage.', isOptimal: false },
        { text: 'Call the creditor to sort it out', effects: { paymentHistory: 5 }, explanation: 'Good instinct, but going through the bureaus creates a paper trail and legal obligation to investigate.', isOptimal: false },
      ],
    },
  ],
  // Month 2
  [
    {
      description: 'Your secured card statement: $80 on $500 limit (16% utilization).',
      choices: [
        { text: 'Pay full $80', effects: { utilDelta: -16, paymentHistory: 5 }, explanation: 'Zero utilization reported. On-time payment #2. Building a pattern.', isOptimal: true },
        { text: 'Pay minimum', effects: { utilDelta: -3, paymentHistory: 2 }, explanation: 'On-time but utilization stays high. Pay more to drop it.', isOptimal: false },
        { text: 'Overpay — put $200 on the card then pay it all', effects: { utilDelta: -16, paymentHistory: 5 }, explanation: 'Unnecessary gymnastics. Just use the card naturally and pay in full.', isOptimal: false },
      ],
    },
    {
      description: 'A family member offers to add you as an authorized user on their 10-year credit card with perfect history.',
      choices: [
        { text: 'Accept — this can help credit history', effects: { paymentHistory: 10, mixAdd: 1 }, explanation: 'Authorized user status adds their account history to yours. Instant boost to length and payment history.', isOptimal: true },
        { text: 'Decline — don\'t want to risk their credit', effects: {}, explanation: 'Your spending doesn\'t affect their score (they can set a $0 limit). This is a powerful, free credit tool.', isOptimal: false },
        { text: 'Ask them to think about it', effects: {}, explanation: 'If they offered, they\'ve thought about it. This is one of the best ways to rebuild.', isOptimal: false },
      ],
    },
  ],
  // Month 3
  [
    {
      description: 'Secured card statement: $200 on $500 limit (40% utilization — too high).',
      choices: [
        { text: 'Pay full $200 immediately', effects: { utilDelta: -40, paymentHistory: 5 }, explanation: 'Back to 0%. High utilization was a one-month blip. Recovery is quick when you pay in full.', isOptimal: true },
        { text: 'Pay $150, leave $50', effects: { utilDelta: -30, paymentHistory: 4 }, explanation: 'Better — 10% utilization. But full payoff would be ideal after a high-utilization month.', isOptimal: false },
        { text: 'Pay minimum', effects: { utilDelta: -5, paymentHistory: 2 }, explanation: 'Still at 35% utilization. This single factor could keep your score stalled.', isOptimal: false },
      ],
    },
    {
      description: 'You want to check your credit score. How?',
      choices: [
        { text: 'Use free Credit Karma / AnnualCreditReport.com', effects: { paymentHistory: 2 }, explanation: 'Soft pulls don\'t affect your score. Check as often as you want for free.', isOptimal: true },
        { text: 'Apply for a credit card to see what limit they offer', effects: { inquiryAdd: 1, paymentHistory: -3 }, explanation: 'Hard inquiry for no good reason. Use free tools instead.', isOptimal: false },
        { text: 'Pay for a credit monitoring service', effects: {}, explanation: 'Unnecessary — free options give the same info. Save that money for your emergency fund.', isOptimal: false },
      ],
    },
    {
      description: 'A credit repair company guarantees they can raise your score 100 points for $500.',
      choices: [
        { text: 'Decline — you can do this yourself', effects: { paymentHistory: 3 }, explanation: 'Correct. Everything a credit repair company does, you can do for free. The FTC warns about these services.', isOptimal: true },
        { text: 'Sign up — 100 points would be amazing', effects: { paymentHistory: -5 }, explanation: 'No one can guarantee credit score increases. This is likely a scam or at best an overpriced service.', isOptimal: false },
      ],
    },
  ],
  // Month 4
  [
    {
      description: 'Your secured card issuer offers to increase your limit from $500 to $1,000 with no hard inquiry.',
      choices: [
        { text: 'Accept the increase', effects: { utilDelta: -15, paymentHistory: 3 }, explanation: 'Higher limit with same spending = lower utilization ratio. Free credit boost.', isOptimal: true },
        { text: 'Decline — higher limits tempt spending', effects: {}, explanation: 'Valid concern, but if you maintain discipline, lower utilization helps your score significantly.', isOptimal: false },
      ],
    },
    {
      description: 'Secured card: $120 on now-$1,000 limit (12% utilization).',
      choices: [
        { text: 'Pay in full', effects: { utilDelta: -12, paymentHistory: 5 }, explanation: 'Month 4 of consistent on-time payments. You\'re building a strong pattern.', isOptimal: true },
        { text: 'Pay half', effects: { utilDelta: -6, paymentHistory: 3 }, explanation: '6% utilization is fine, but full payoff avoids interest and maximizes history.', isOptimal: false },
      ],
    },
  ],
  // Month 5
  [
    {
      description: 'You see a "credit-builder loan" from a credit union — $1,000 at 5% APR, held in savings until paid off.',
      choices: [
        { text: 'Take the credit-builder loan', effects: { mixAdd: 1, paymentHistory: 5 }, explanation: 'Credit-builder loans add an installment account (credit mix) and payment history. Smart diversification.', isOptimal: true },
        { text: 'Stick with just the secured card', effects: { paymentHistory: 2 }, explanation: 'Not wrong, but credit mix (10% of score) benefits from having both revolving and installment accounts.', isOptimal: false },
      ],
    },
    {
      description: 'Card statement: $90 on $1,000 limit (9% utilization).',
      choices: [
        { text: 'Pay in full', effects: { utilDelta: -9, paymentHistory: 5 }, explanation: 'Five months of perfect payments. Lenders are starting to notice the pattern.', isOptimal: true },
        { text: 'Pay minimum', effects: { utilDelta: -2, paymentHistory: 2 }, explanation: 'On-time, but you\'re paying interest unnecessarily. Full payoff is always better.', isOptimal: false },
      ],
    },
    {
      description: 'A coworker suggests applying for 3 credit cards to "build faster."',
      choices: [
        { text: 'Decline — multiple inquiries will hurt', effects: {}, explanation: 'Exactly right. 3 hard inquiries in one month could cost 15-30 points. Slow and steady wins.', isOptimal: true },
        { text: 'Apply for all three', effects: { inquiryAdd: 3, paymentHistory: -10, mixAdd: 2 }, explanation: 'Three inquiries tank your new credit factor. Most applications get denied anyway at this score range.', isOptimal: false },
        { text: 'Apply for just one', effects: { inquiryAdd: 1, paymentHistory: -2, mixAdd: 1 }, explanation: 'One inquiry is manageable, but only if it\'s a card with no annual fee that you actually need.', isOptimal: false },
      ],
    },
  ],
  // Month 6
  [
    {
      description: 'Your dispute from Month 1 was resolved — the error was removed!',
      choices: [
        { text: 'Verify removal on all three bureau reports', effects: { paymentHistory: 10 }, explanation: 'Always verify. Sometimes an error is removed from one bureau but not others.', isOptimal: true },
        { text: 'Assume it\'s done', effects: { paymentHistory: 5 }, explanation: 'Usually fine, but errors can reappear. A quick check takes 5 minutes.', isOptimal: false },
      ],
    },
    {
      description: 'Card statement: $60 on $1,000 (6% utilization). You also have the credit-builder loan payment of $85.',
      choices: [
        { text: 'Pay both in full and on time', effects: { utilDelta: -6, paymentHistory: 7 }, explanation: 'Two on-time payments in one month. Multiple positive data points build fast.', isOptimal: true },
        { text: 'Pay card in full, minimum on loan', effects: { utilDelta: -6, paymentHistory: 4 }, explanation: 'Both count as on-time, but paying loan on schedule shows better financial discipline.', isOptimal: false },
      ],
    },
  ],
  // Month 7
  [
    {
      description: 'You receive a credit limit increase offer to $2,000 — but it requires a hard inquiry.',
      choices: [
        { text: 'Accept — the lower utilization is worth the inquiry', effects: { utilDelta: -10, inquiryAdd: 1, paymentHistory: 2 }, explanation: 'At month 7, one inquiry for a significant limit increase is worth the trade. Utilization benefit outweighs inquiry cost.', isOptimal: true },
        { text: 'Decline — avoid the hard inquiry', effects: {}, explanation: 'Reasonable caution, but a $2,000 limit would halve your utilization ratio permanently.', isOptimal: false },
      ],
    },
    {
      description: 'Both payments due this month (card + loan).',
      choices: [
        { text: 'Pay both on time and in full', effects: { utilDelta: -5, paymentHistory: 7 }, explanation: 'Consistency is your superpower. Seven straight months of perfect payments.', isOptimal: true },
        { text: 'Pay card, skip loan this month', effects: { paymentHistory: -15 }, explanation: 'Missing ANY payment at this stage is devastating. Even one 30-day late can cost 50-100 points.', isOptimal: false },
      ],
    },
  ],
  // Month 8
  [
    {
      description: 'Your secured card issuer offers to convert to an unsecured card — your deposit gets refunded!',
      choices: [
        { text: 'Convert to unsecured', effects: { paymentHistory: 8 }, explanation: 'This is a milestone! The issuer trusts you. Same account, better terms, deposit back in your pocket.', isOptimal: true },
        { text: 'Stay secured — it\'s working fine', effects: { paymentHistory: 2 }, explanation: 'The unsecured conversion preserves your account history. There\'s no downside to converting.', isOptimal: false },
      ],
    },
    {
      description: 'Monthly payments due.',
      choices: [
        { text: 'Both paid in full, on time', effects: { utilDelta: -4, paymentHistory: 7 }, explanation: 'Eight months. Your score is climbing. The algorithm loves consistency.', isOptimal: true },
        { text: 'Pay card only — tight month', effects: { paymentHistory: -10 }, explanation: 'Even one missed loan payment sets you back months. Find the money or call the lender to arrange.', isOptimal: false },
      ],
    },
  ],
  // Month 9
  [
    {
      description: 'You notice a medical collection ($85) on your report that you already paid. Action?',
      choices: [
        { text: 'Dispute with proof of payment', effects: { paymentHistory: 12 }, explanation: 'Paid collections that still report are disputable. Removing this could mean 10-25 points.', isOptimal: true },
        { text: 'Ignore it — it\'s small', effects: {}, explanation: 'Even small collections weigh on your score. Always dispute with proof of payment.', isOptimal: false },
      ],
    },
    {
      description: 'Monthly payments. Card: $110 on $2,000 (5.5%). Loan: $85.',
      choices: [
        { text: 'Pay everything on time', effects: { utilDelta: -5, paymentHistory: 7 }, explanation: 'Nine months of perfect history. You\'re in strong territory.', isOptimal: true },
        { text: 'Pay minimums on both', effects: { paymentHistory: 3 }, explanation: 'On-time minimums still count, but carrying balances costs interest and keeps utilization up.', isOptimal: false },
      ],
    },
  ],
  // Month 10
  [
    {
      description: 'A legitimate credit card with 0% intro APR, no annual fee, and 1.5% cash back is offered.',
      choices: [
        { text: 'Apply — your score can handle one inquiry now', effects: { inquiryAdd: 1, mixAdd: 1, paymentHistory: 3 }, explanation: 'At 10 months with strong history, adding a quality card boosts credit mix. The inquiry cost is minimal.', isOptimal: true },
        { text: 'Wait a few more months', effects: { paymentHistory: 2 }, explanation: 'Not wrong — patience is never bad. But this is a good card at a good time.', isOptimal: false },
      ],
    },
    {
      description: 'Monthly payments due (now 3 accounts).',
      choices: [
        { text: 'All three paid on time', effects: { utilDelta: -3, paymentHistory: 8 }, explanation: 'Three accounts, all current. Credit mix score factor is now maximized.', isOptimal: true },
        { text: 'Pay two, skip one', effects: { paymentHistory: -20 }, explanation: 'ONE missed payment at this point erases months of progress. Never miss a payment.', isOptimal: false },
      ],
    },
  ],
  // Month 11
  [
    {
      description: 'Your credit-builder loan is almost paid off. Final payment of $85 due.',
      choices: [
        { text: 'Make final payment on time', effects: { paymentHistory: 10 }, explanation: 'Loan paid in full as agreed. This is a major positive event on your report.', isOptimal: true },
        { text: 'Let it auto-close by skipping', effects: { paymentHistory: -15 }, explanation: 'Defaulting on the last payment ruins the entire purpose of the loan. Always finish what you started.', isOptimal: false },
      ],
    },
    {
      description: 'Card payments: $95 across two cards on $3,000 total limit (3.2% utilization).',
      choices: [
        { text: 'Pay both in full', effects: { utilDelta: -3, paymentHistory: 7 }, explanation: 'Sub-5% utilization. This is expert-level credit management.', isOptimal: true },
        { text: 'Pay one in full, minimum on other', effects: { paymentHistory: 4 }, explanation: 'Both on-time, but carrying a balance on one card increases overall utilization.', isOptimal: false },
      ],
    },
  ],
  // Month 12
  [
    {
      description: 'Final month! Review your credit report one more time.',
      choices: [
        { text: 'Pull free reports from all 3 bureaus and review', effects: { paymentHistory: 5 }, explanation: 'End-of-year review catches any lingering errors. You\'re taking ownership of your credit.', isOptimal: true },
        { text: 'You\'ve been checking regularly — skip it', effects: { paymentHistory: 1 }, explanation: 'Regular checking is great, but a thorough annual review catches things quick checks miss.', isOptimal: false },
      ],
    },
    {
      description: 'Final card payments of the year.',
      choices: [
        { text: 'Pay in full, as always', effects: { utilDelta: -2, paymentHistory: 8 }, explanation: '12 months of perfect payments. You\'ve rebuilt a solid credit foundation.', isOptimal: true },
        { text: 'Celebrate with a big purchase on the card', effects: { utilDelta: 25, paymentHistory: 2 }, explanation: 'Spiking utilization in the final month lowers the score right when it matters. Patience!', isOptimal: false },
      ],
    },
  ],
]

// ── Component ────────────────────────────────────────────────────────

type Phase = 'intro' | 'month' | 'decision' | 'feedback' | 'month-summary' | 'result'

const XP_AVAILABLE = 300
const MAX_SCORE = 1000

export default function CreditScoreSimulator({ onComplete, chapterPath }: GameProps) {
  const startingCreditScore = chapterPath === 'ch13' ? 540 : 520

  const [phase, setPhase] = useState<Phase>('intro')
  const [monthIdx, setMonthIdx] = useState(0)
  const [decisionIdx, setDecisionIdx] = useState(0)
  const [factors, setFactors] = useState<ScoreFactors>({
    paymentHistory: 30,
    utilization: 35,
    historyLength: 0,
    newCredit: 0,
    creditMix: 1,
  })
  const [creditScore, setCreditScore] = useState(startingCreditScore)
  const [optimalCount, setOptimalCount] = useState(0)
  const [totalDecisions, setTotalDecisions] = useState(0)
  const [lastFeedback, setLastFeedback] = useState<{ text: string; optimal: boolean; scoreDelta: number } | null>(null)
  const [scoreHistory, setScoreHistory] = useState<number[]>([startingCreditScore])

  // Endless mode
  const [endlessMode, setEndlessMode] = useState(false)
  const [peakCreditScore, setPeakCreditScore] = useState(startingCreditScore)

  // Engagement: streak tracking
  const [optimalStreak, setOptimalStreak] = useState(0)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneText, setMilestoneText] = useState({ icon: '', title: '', subtitle: '' })

  // In endless mode, cycle through decisions with offsets
  const effectiveDecisions = endlessMode && monthIdx >= MONTHLY_DECISIONS.length
    ? MONTHLY_DECISIONS[monthIdx % MONTHLY_DECISIONS.length]
    : MONTHLY_DECISIONS[monthIdx] ?? []

  const currentDecisions = effectiveDecisions
  const currentDecision = currentDecisions[decisionIdx]

  const handleStart = () => {
    setPhase('month')
  }

  const handleBeginMonth = () => {
    // Advance history length
    setFactors(prev => ({ ...prev, historyLength: prev.historyLength + 1 }))
    setDecisionIdx(0)
    setPhase('decision')
  }

  const handleChoice = (choiceIdx: number) => {
    const choice = currentDecision.choices[choiceIdx]
    const prevScore = creditScore

    setTotalDecisions(prev => prev + 1)
    if (choice.isOptimal) {
      setOptimalCount(prev => prev + 1)
      setOptimalStreak(prev => {
        const next = prev + 1
        // Milestone triggers
        if (next === 5) {
          setMilestoneText({ icon: '🔥', title: '5 in a row!', subtitle: 'On fire!' })
          setShowMilestone(true)
          setTimeout(() => setShowMilestone(false), 3000)
        } else if (next === 10) {
          setMilestoneText({ icon: '⭐', title: '10 streak!', subtitle: 'Credit expert!' })
          setShowMilestone(true)
          setTimeout(() => setShowMilestone(false), 3000)
        }
        return next
      })
    } else {
      setOptimalStreak(0)
    }

    // Apply effects
    setFactors(prev => {
      const next = { ...prev }
      if (choice.effects.paymentHistory) next.paymentHistory = Math.max(0, Math.min(100, next.paymentHistory + choice.effects.paymentHistory))
      if (choice.effects.utilDelta) next.utilization = Math.max(0, Math.min(100, next.utilization + choice.effects.utilDelta))
      if (choice.effects.inquiryAdd) next.newCredit = next.newCredit + choice.effects.inquiryAdd
      if (choice.effects.mixAdd) next.creditMix = Math.min(3, next.creditMix + choice.effects.mixAdd)

      const newScore = computeScore(next)
      setCreditScore(newScore)
      setPeakCreditScore(prev => Math.max(prev, newScore))

      setLastFeedback({
        text: choice.explanation,
        optimal: choice.isOptimal,
        scoreDelta: newScore - prevScore,
      })

      return next
    })

    setPhase('feedback')
  }

  const handleFeedbackContinue = () => {
    if (decisionIdx + 1 < currentDecisions.length) {
      setDecisionIdx(prev => prev + 1)
      setPhase('decision')
    } else {
      setScoreHistory(prev => [...prev, creditScore])
      setPhase('month-summary')
    }
  }

  const handleNextMonth = () => {
    if (!endlessMode && monthIdx + 1 >= MONTHLY_DECISIONS.length) {
      setPhase('result')
      onComplete?.(calcScore())
    } else {
      setMonthIdx(prev => prev + 1)
      setPhase('month')
    }
  }

  const handleKeepPlaying = useCallback(() => {
    setEndlessMode(true)
    setMonthIdx(prev => prev + 1)
    setPhase('month')
  }, [])

  const calcScore = useCallback(() => {
    // Score: optimal decision ratio (50%) + credit score achieved (50%)
    // Lower credit target — reaching 680 from ~520 is a realistic strong outcome
    const maxCredit = 680
    const creditDelta = Math.max(0, creditScore - startingCreditScore)
    const creditTarget = maxCredit - startingCreditScore // ~160 points
    const creditPart = Math.min(500, Math.round((creditDelta / creditTarget) * 500))
    const optimalPart = totalDecisions > 0 ? Math.round((optimalCount / totalDecisions) * 500) : 0
    return Math.min(MAX_SCORE, creditPart + optimalPart)
  }, [creditScore, startingCreditScore, optimalCount, totalDecisions])

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setMonthIdx(0)
    setDecisionIdx(0)
    setFactors({ paymentHistory: 30, utilization: 35, historyLength: 0, newCredit: 0, creditMix: 1 })
    setCreditScore(startingCreditScore)
    setOptimalCount(0)
    setTotalDecisions(0)
    setLastFeedback(null)
    setScoreHistory([startingCreditScore])
    setEndlessMode(false)
    setPeakCreditScore(startingCreditScore)
    setOptimalStreak(0)
  }, [startingCreditScore])

  // ── Result ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = calcScore()
    const xpEarned = Math.round((finalScore / MAX_SCORE) * XP_AVAILABLE)
    return (
      <div>
        <div className="max-w-sm mx-auto mb-6">
          {/* Score journey mini chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Credit Score Journey</p>
            <div className="flex items-end gap-1 h-20">
              {scoreHistory.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={cn(
                      'w-full rounded-t',
                      s >= 650 ? 'bg-emerald-400' : s >= 580 ? 'bg-amber-400' : 'bg-gray-300',
                    )}
                    style={{ height: `${Math.max(10, ((s - 300) / 550) * 100)}%` }}
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5">{i === 0 ? 'Start' : `M${i}`}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Started: {startingCreditScore}</span>
              <span className="font-bold text-emerald-600">Final: {creditScore}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-emerald-700">{creditScore}</p>
              <p className="text-xs text-emerald-600">Final Score</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-700">+{creditScore - startingCreditScore}</p>
              <p className="text-xs text-blue-600">Points Gained</p>
            </div>
            {endlessMode && (
              <>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-purple-700">{monthIdx + 1}</p>
                  <p className="text-xs text-purple-600">Months Played</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-amber-700">{peakCreditScore}</p>
                  <p className="text-xs text-amber-600">Peak Score</p>
                </div>
              </>
            )}
          </div>
        </div>
        <GameResult
          title="Credit Score Simulator"
          score={finalScore}
          maxScore={MAX_SCORE}
          xpEarned={xpEarned}
          badgeEarned={creditScore >= 700 ? { name: 'Score Master', icon: '🏆' } : creditScore >= 650 ? { name: 'Credit Starter', icon: '📈' } : null}
          onReplay={handleReplay}
          onKeepPlaying={handleKeepPlaying}
          moduleSlug="07-credit-rebuilding"
          gameSlug="credit-score-sim"
        />
      </div>
    )
  }

  // ── Intro ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Credit Score Simulator</h1>
        <p className="text-gray-500 mb-2">
          Starting score: <strong>{startingCreditScore}</strong>. Make smart decisions over
          <strong> 12 months</strong> to rebuild your credit.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Every choice affects your FICO score factors: payment history (35%), utilization (30%),
          length (15%), new credit (10%), mix (10%).
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Goal: reach <strong>650+</strong>. Bonus badge at <strong>700+</strong>. · {XP_AVAILABLE} XP max
        </p>
        <p className="text-xs text-purple-400 mb-8">
          Endless mode unlocks after 12 months — keep pushing your score higher!
        </p>
        <button onClick={handleStart} className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
          Start Simulation
        </button>
      </div>
    )
  }

  // ── Month Start ────────────────────────────────────────────────────
  if (phase === 'month') {
    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Credit Score Sim" score={creditScore} maxScore={850} xpAvailable={XP_AVAILABLE} />
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-blue-600">{monthIdx + 1}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {endlessMode
              ? <span className="flex items-center justify-center gap-2">Month {monthIdx + 1} <InfinityIcon className="w-5 h-5 text-purple-500" /></span>
              : `Month ${monthIdx + 1} of 12`}
          </h2>
          <p className="text-3xl font-bold text-gray-900 mb-1">{creditScore}</p>
          <p className="text-sm text-gray-400 mb-4">Current Credit Score</p>

          {/* Factor breakdown */}
          <div className="max-w-xs mx-auto space-y-2 mb-6">
            <FactorBar label="Payment History" pct={factors.paymentHistory} weight="35%" color="emerald" />
            <FactorBar label="Utilization" pct={100 - factors.utilization} weight="30%" color="blue" />
            <FactorBar label="History Length" pct={Math.min(100, (factors.historyLength / 24) * 100)} weight="15%" color="purple" />
            <FactorBar label="New Credit" pct={factors.newCredit <= 1 ? 100 : factors.newCredit <= 3 ? 70 : 40} weight="10%" color="amber" />
            <FactorBar label="Credit Mix" pct={factors.creditMix >= 3 ? 100 : factors.creditMix >= 2 ? 70 : 40} weight="10%" color="pink" />
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {currentDecisions.length} decision{currentDecisions.length !== 1 ? 's' : ''} this month
          </p>
          <button onClick={handleBeginMonth} className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors">
            Begin Month →
          </button>
        </div>
      </div>
    )
  }

  // ── Decision ───────────────────────────────────────────────────────
  if (phase === 'decision' && currentDecision) {
    return (
      <div className="max-w-lg mx-auto pb-16">
        <StreakNotification streak={optimalStreak} label="Optimal" variant="fire" />
        <MilestonePopup show={showMilestone} icon={milestoneText.icon} title={milestoneText.title} subtitle={milestoneText.subtitle} />
        <GameHeader title={endlessMode ? 'Credit Sim ∞' : 'Credit Score Sim'} score={creditScore} maxScore={850} xpAvailable={XP_AVAILABLE} />

        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Month {monthIdx + 1} — Decision {decisionIdx + 1}/{currentDecisions.length}</span>
          <div className="flex items-center gap-2">
            {optimalStreak >= 3 && <span className="text-orange-500 font-bold">🔥{optimalStreak}</span>}
            <span>Score: {creditScore}</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((monthIdx * 3 + decisionIdx) / (12 * 3)) * 100}%` }} />
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-2 mb-1">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-400">Scenario</p>
          </div>
          <p className="text-base text-gray-800 leading-relaxed">{currentDecision.description}</p>
        </div>

        <div className="space-y-2">
          {currentDecision.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(i)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Feedback ───────────────────────────────────────────────────────
  if (phase === 'feedback' && lastFeedback) {
    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Credit Score Sim" score={creditScore} maxScore={850} xpAvailable={XP_AVAILABLE} />

        <div className={cn(
          'rounded-2xl border-2 p-5 mb-4',
          lastFeedback.optimal ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
        )}>
          <div className="flex items-center gap-2 mb-2">
            {lastFeedback.scoreDelta > 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            ) : lastFeedback.scoreDelta < 0 ? (
              <TrendingDown className="w-5 h-5 text-red-500" />
            ) : (
              <Target className="w-5 h-5 text-gray-400" />
            )}
            <span className={cn(
              'text-sm font-bold',
              lastFeedback.scoreDelta > 0 ? 'text-emerald-700' : lastFeedback.scoreDelta < 0 ? 'text-red-600' : 'text-gray-600',
            )}>
              {lastFeedback.scoreDelta > 0 ? `+${lastFeedback.scoreDelta} points` : lastFeedback.scoreDelta < 0 ? `${lastFeedback.scoreDelta} points` : 'No score change'}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{lastFeedback.text}</p>
        </div>

        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-gray-900">{creditScore}</span>
          <span className="text-sm text-gray-400 ml-2">credit score</span>
        </div>

        <button onClick={handleFeedbackContinue} className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // ── Month Summary ──────────────────────────────────────────────────
  if (phase === 'month-summary') {
    const delta = scoreHistory.length >= 2 ? creditScore - scoreHistory[scoreHistory.length - 2] : creditScore - startingCreditScore
    return (
      <div className="max-w-lg mx-auto pb-16">
        <GameHeader title="Credit Score Sim" score={creditScore} maxScore={850} xpAvailable={XP_AVAILABLE} />

        <div className="text-center py-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Month {monthIdx + 1} Complete</h3>
          <p className="text-3xl font-bold text-gray-900">{creditScore}</p>
          <p className={cn(
            'text-sm font-semibold mt-1',
            delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-600' : 'text-gray-400',
          )}>
            {delta > 0 ? `+${delta}` : delta} this month · {creditScore - startingCreditScore > 0 ? '+' : ''}{creditScore - startingCreditScore} total
          </p>
        </div>

        {/* Progress toward goal */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Goal: 650</span>
            <span>{creditScore >= 650 ? '✅ Reached!' : `${650 - creditScore} points to go`}</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                creditScore >= 650 ? 'bg-emerald-500' : 'bg-blue-500',
              )}
              style={{ width: `${Math.min(100, ((creditScore - 300) / (650 - 300)) * 100)}%` }}
            />
          </div>
        </div>

        <button onClick={handleNextMonth} className="w-full bg-fresh-blue text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
          {!endlessMode && monthIdx + 1 >= MONTHLY_DECISIONS.length ? 'See Final Results' : `Start Month ${monthIdx + 2} →`}
        </button>

        {endlessMode && (
          <button
            onClick={() => { setPhase('result'); onComplete?.(calcScore()) }}
            className="w-full mt-2 bg-gray-100 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            End Run — See Results
          </button>
        )}
      </div>
    )
  }

  return null
}

// ── Factor bar sub-component ─────────────────────────────────────────

function FactorBar({ label, pct, weight, color }: { label: string; pct: number; weight: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    amber: 'bg-amber-400',
    pink: 'bg-pink-400',
  }
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-400">{weight}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', colorMap[color])} style={{ width: `${Math.max(5, pct)}%` }} />
      </div>
    </div>
  )
}
