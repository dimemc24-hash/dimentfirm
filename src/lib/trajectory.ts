// Trajectory Comparator — "current path" vs "path after bankruptcy" for auto and home
// financing eligibility. This never recommends Chapter 7 vs 13; it only compares timelines.
//
// Eligibility bar used for the CURRENT (no-filing) path, per firm guidance:
//   Car:  $1,000+/mo disposable income AND no repo/foreclosure/judgment in the last 2 years.
//   Home: $1,500+/mo disposable income AND able to reach a 10% down payment within 2 years
//         of saving AND no repo/foreclosure/judgment in the last 5 years.
// Bankruptcy path timelines (typical, not guaranteed): ~6 months post-filing for auto,
// ~24 months post-filing for a mortgage.
//
// If someone is currently behind on a car or house payment, bankruptcy always wins that axis —
// they are not on a qualifying trajectory today, and the automatic stay stops the immediate risk.
// If someone already clears the current-path bar, we say so honestly rather than oversell
// bankruptcy on that axis.

export type HistoryBucket = 'none' | 'within2' | 'within5' | 'over5'
export type SavingsBucket = 'low' | 'mid' | 'high' | 'max'

export interface TrajectoryInputs {
  behindOnCar: boolean
  behindOnHouse: boolean
  monthlyDisposableIncome: number
  history: HistoryBucket
  savings: SavingsBucket
}

export type AxisVerdict = 'bankruptcy-faster' | 'already-qualifies' | 'comparable'

export interface AxisResult {
  verdict: AxisVerdict
  currentPathLabel: string
  currentPathDetail: string
  bkPathLabel: string
  bkPathDetail: string
}

export interface TrajectoryResult {
  car: AxisResult
  home: AxisResult
  bothCurrentPathHealthy: boolean
}

const CAR_INCOME_BAR = 1000
const HOME_INCOME_BAR = 1500

function historyClearsWithin(history: HistoryBucket, years: 2 | 5): boolean {
  if (history === 'within2') return false
  if (years === 2) return true
  // 5-year bar: 'within5' (2-5 years ago) still falls inside the last 5 years and fails it
  return history === 'over5' || history === 'none'
}

export function computeTrajectory(inputs: TrajectoryInputs): TrajectoryResult {
  const { behindOnCar, behindOnHouse, monthlyDisposableIncome, history, savings } = inputs

  // ── Car axis ──
  let car: AxisResult
  if (behindOnCar) {
    car = {
      verdict: 'bankruptcy-faster',
      currentPathLabel: 'At risk right now',
      currentPathDetail: 'Falling behind today puts you on track for repossession, not qualification.',
      bkPathLabel: '~6 months after filing',
      bkPathDetail: 'The automatic stay stops repossession immediately, and most clients qualify for competitive auto financing again around 6 months after filing.',
    }
  } else if (monthlyDisposableIncome >= CAR_INCOME_BAR && historyClearsWithin(history, 2)) {
    car = {
      verdict: 'already-qualifies',
      currentPathLabel: 'You likely already qualify',
      currentPathDetail: 'Your income and payment history put you in range for competitive auto financing now — bankruptcy would not clearly speed this up.',
      bkPathLabel: '~6 months after filing',
      bkPathDetail: 'For comparison, this is the typical timeline for clients who do file.',
    }
  } else {
    car = {
      verdict: 'bankruptcy-faster',
      currentPathLabel: 'No clear timeline',
      currentPathDetail: 'Without a change, there is no reliable path to qualifying — the debt payments most likely to be discharged are also what keeps disposable income too thin.',
      bkPathLabel: '~6 months after filing',
      bkPathDetail: 'Most clients qualify for competitive auto financing again around 6 months after filing.',
    }
  }

  // ── Home axis ──
  let home: AxisResult
  if (behindOnHouse) {
    home = {
      verdict: 'bankruptcy-faster',
      currentPathLabel: 'At risk right now',
      currentPathDetail: 'Falling behind today puts you on track for foreclosure, not qualification.',
      bkPathLabel: '~24 months after filing',
      bkPathDetail: 'The automatic stay stops foreclosure immediately, and most clients are mortgage-eligible again around 24 months after filing.',
    }
  } else if (monthlyDisposableIncome >= HOME_INCOME_BAR && savings === 'max' && historyClearsWithin(history, 5)) {
    home = {
      verdict: 'comparable',
      currentPathLabel: 'On track in about 24 months',
      currentPathDetail: 'Your income, savings capacity, and payment history already put you on a path to a 10% down payment in about two years — comparable to the typical post-filing timeline, without a bankruptcy on your record.',
      bkPathLabel: '~24 months after filing',
      bkPathDetail: 'For comparison, this is the typical timeline for clients who do file.',
    }
  } else {
    home = {
      verdict: 'bankruptcy-faster',
      currentPathLabel: 'No clear timeline',
      currentPathDetail: 'Without a change, reaching mortgage-ready income, savings, and payment history is not reliably in sight.',
      bkPathLabel: '~24 months after filing',
      bkPathDetail: 'Most clients are mortgage-eligible again around 24 months after filing.',
    }
  }

  return {
    car,
    home,
    bothCurrentPathHealthy: car.verdict === 'already-qualifies' && home.verdict === 'comparable',
  }
}

// ── Credit card payoff clarity ──
// Fixed-payment amortization at a flat monthly rate, using the researched average
// credit card APR (~22.15%, Fed G.19) as the assumption, since most people don't know
// their exact rate. If the monthly payment doesn't cover the interest accruing each
// month, the balance never shrinks — a real and common situation worth naming plainly.
// If the payoff is already fast (roughly in line with a typical Chapter 13 plan length),
// we say so honestly rather than claim bankruptcy clearly speeds it up.

const DEBT_ASSUMED_APR_PERCENT = 22
const DEBT_COMPARABLE_YEARS_BAR = 3

export interface DebtInputs {
  balance: number
  monthlyPayment: number
}

function formatYears(years: number): string {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12))
    return `About ${months} month${months === 1 ? '' : 's'}`
  }
  const rounded = Math.round(years * 10) / 10
  return `About ${rounded} year${rounded === 1 ? '' : 's'}`
}

export function computeDebtPayoff({ balance, monthlyPayment }: DebtInputs): AxisResult | null {
  if (!balance || balance <= 0 || !monthlyPayment || monthlyPayment <= 0) return null

  const monthlyRate = DEBT_ASSUMED_APR_PERCENT / 100 / 12
  const monthlyInterest = balance * monthlyRate
  const roundedBalance = Math.round(balance).toLocaleString()
  const roundedPayment = Math.round(monthlyPayment).toLocaleString()

  if (monthlyPayment <= monthlyInterest) {
    return {
      verdict: 'bankruptcy-faster',
      currentPathLabel: "Won't shrink at this rate",
      currentPathDetail: `At $${roundedPayment}/month on a $${roundedBalance} balance and today's average card rate (~${DEBT_ASSUMED_APR_PERCENT}%), the payment doesn't fully cover the interest building up each month — the balance grows instead of shrinking.`,
      bkPathLabel: 'Resolved in 3-5 years, or discharged now',
      bkPathDetail: 'A Chapter 13 plan folds this into one structured payment. Chapter 7 can discharge it outright.',
    }
  }

  const months = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate)
  const years = months / 12
  const totalInterest = monthlyPayment * months - balance
  const roundedInterest = Math.round(totalInterest).toLocaleString()

  if (years <= DEBT_COMPARABLE_YEARS_BAR) {
    return {
      verdict: 'comparable',
      currentPathLabel: formatYears(years),
      currentPathDetail: `At $${roundedPayment}/month, you're already on pace to clear this balance in a similar timeframe to a Chapter 13 plan — bankruptcy wouldn't clearly speed up this specific debt.`,
      bkPathLabel: '3-5 years, or discharged now',
      bkPathDetail: 'For comparison, this is the typical range for clients who do file.',
    }
  }

  return {
    verdict: 'bankruptcy-faster',
    currentPathLabel: formatYears(years),
    currentPathDetail: `At $${roundedPayment}/month on a $${roundedBalance} balance and today's average card rate (~${DEBT_ASSUMED_APR_PERCENT}%), you'd pay roughly $${roundedInterest} in interest before it's gone — assuming nothing new gets added and the rate never changes.`,
    bkPathLabel: 'Resolved in 3-5 years, or discharged now',
    bkPathDetail: 'A Chapter 13 plan folds this into one structured payment. Chapter 7 can discharge it outright, right now.',
  }
}
