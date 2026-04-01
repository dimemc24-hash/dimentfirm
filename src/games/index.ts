import { lazy, type ComponentType } from 'react'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// All 7 games — lazy loaded
const BeliefTrap = lazy(() => import('./BeliefTrap'))
const BudgetCrisis = lazy(() => import('./BudgetCrisis'))
const EnvelopeChallenge = lazy(() => import('./EnvelopeChallenge'))
const SavingsSprint = lazy(() => import('./SavingsSprint'))
const CreditScoreSimulator = lazy(() => import('./CreditScoreSimulator'))
const PredatoryLendingDetector = lazy(() => import('./PredatoryLendingDetector'))
const GigEconomySimulator = lazy(() => import('./GigEconomySimulator'))

export interface GameDefinition {
  slug: string
  title: string
  description: string
  module: number
  moduleSlug: string
  xpAvailable: number
  component: ComponentType<GameProps> | null
  icon: string
}

export const GAME_REGISTRY: GameDefinition[] = [
  {
    slug: 'belief-trap',
    title: 'The Belief Trap',
    description: 'Identify toxic money beliefs and choose healthier responses in real-world scenarios.',
    module: 2,
    moduleSlug: '02-money-story',
    xpAvailable: 300,
    component: BeliefTrap,
    icon: '💡',
  },
  {
    slug: 'budget-crisis',
    title: 'Budget Crisis Simulator',
    description: 'Navigate a month of financial surprises while keeping your budget balanced.',
    module: 3,
    moduleSlug: '03-budgeting',
    xpAvailable: 300,
    component: BudgetCrisis,
    icon: '💰',
  },
  {
    slug: 'envelope-challenge',
    title: 'The Envelope Challenge',
    description: 'Save as much as possible in 30 days using the envelope system.',
    module: 4,
    moduleSlug: '04-envelope-system',
    xpAvailable: 150,
    component: EnvelopeChallenge,
    icon: '✉️',
  },
  {
    slug: 'savings-sprint',
    title: 'Savings Sprint',
    description: 'Build your emergency fund over 6 months while life throws curveballs.',
    module: 5,
    moduleSlug: '05-emergency-fund',
    xpAvailable: 150,
    component: SavingsSprint,
    icon: '🏃',
  },
  {
    slug: 'credit-score-sim',
    title: 'Credit Score Simulator',
    description: 'See how different financial decisions affect your credit score over 12 months.',
    module: 7,
    moduleSlug: '07-credit-rebuilding',
    xpAvailable: 300,
    component: CreditScoreSimulator,
    icon: '📈',
  },
  {
    slug: 'predatory-lending-detector',
    title: 'Predatory Lending Detector',
    description: 'Sort real lending offers from predatory traps in a timed mailbox challenge.',
    module: 8,
    moduleSlug: '08-predatory-traps',
    xpAvailable: 300,
    component: PredatoryLendingDetector,
    icon: '🔍',
  },
  {
    slug: 'gig-economy-sim',
    title: 'Gig Economy Simulator',
    description: 'Survive 30 days of gig work — manage income, burnout, and expenses.',
    module: 9,
    moduleSlug: '09-income-growth',
    xpAvailable: 300,
    component: GigEconomySimulator,
    icon: '🧭',
  },
]

export function getGameBySlug(slug: string): GameDefinition | undefined {
  return GAME_REGISTRY.find(g => g.slug === slug)
}
