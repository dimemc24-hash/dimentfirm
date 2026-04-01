import { useState, useCallback, useMemo } from 'react'
import { GameHeader } from './shared/GameHeader'
import { GameResult } from './shared/GameResult'
import { cn } from '../lib/cn'

interface GameProps {
  onComplete?: (score: number) => void
  chapterPath?: 'ch7' | 'ch13'
}

// ── Utilities ──────────────────────────────────────────────────────────

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

// ── Scenario data ────────────────────────────────────────────────────

interface Scenario {
  situation: string
  difficulty: 1 | 2 | 3
  beliefs: { text: string; toxic: boolean }[]
  responses: { text: string; healthy: boolean; consequence: string }[]
}

const SCENARIOS: Scenario[] = [
  // ─── Difficulty 1 (Easiest — clear-cut toxic beliefs) ────────────
  {
    situation: "You get an unexpected $500 medical bill. Your stomach drops.",
    difficulty: 1,
    beliefs: [
      { text: "Bad things always happen to me — I can't catch a break", toxic: true },
      { text: "Unexpected expenses are a normal part of life", toxic: false },
      { text: "This is stressful but manageable with a plan", toxic: false },
    ],
    responses: [
      { text: "Call the provider and ask about a payment plan or financial assistance", healthy: true, consequence: "Many providers offer 0% payment plans or reduce bills by 20-40% when asked. You negotiate it down to $350 over 6 months." },
      { text: "Put it on a credit card and worry about it later", healthy: false, consequence: "At 24% APR, that $500 becomes $620+ if you only make minimums. The stress doesn't go away — it compounds." },
      { text: "Ignore the bill and hope it goes away", healthy: false, consequence: "After 90 days it goes to collections, potentially damaging the credit score you've been rebuilding." },
    ],
  },
  {
    situation: "You're at the grocery store and your card is declined for a $47 purchase. People are in line behind you.",
    difficulty: 1,
    beliefs: [
      { text: "I'm a failure and everyone can see it", toxic: true },
      { text: "Card issues happen to everyone sometimes", toxic: false },
      { text: "This is embarrassing but not a reflection of my worth", toxic: false },
    ],
    responses: [
      { text: "Calmly try another payment method or step aside to check your account", healthy: true, consequence: "You discover a hold from a gas station pre-auth. It clears in an hour. No actual problem." },
      { text: "Leave the store immediately and don't come back", healthy: false, consequence: "Avoidance reinforces the shame. You still need groceries and now feel worse." },
      { text: "Open a new credit card to make sure this never happens again", healthy: false, consequence: "Reactive credit decisions often lead to cards with bad terms. The real fix is knowing your balances." },
    ],
  },
  {
    situation: "A family member asks if you've 'learned your lesson' about money after your bankruptcy.",
    difficulty: 1,
    beliefs: [
      { text: "They're right — I'm bad with money and always will be", toxic: true },
      { text: "Their comment reflects their misunderstanding, not my reality", toxic: false },
      { text: "I can choose how to respond to uninformed opinions", toxic: false },
    ],
    responses: [
      { text: "Calmly share that you're taking a financial education course and building new skills", healthy: true, consequence: "Setting a boundary while showing your commitment. Most people respect this more than they expected to." },
      { text: "Lash out and tell them to mind their own business", healthy: false, consequence: "Understandable, but damages the relationship without addressing the underlying hurt." },
      { text: "Agree with them and feel terrible about yourself", healthy: false, consequence: "Internalizing shame reinforces the toxic belief. Their ignorance doesn't define your future." },
    ],
  },
  {
    situation: "Your child asks why the family can't go on vacation like their friend's family.",
    difficulty: 1,
    beliefs: [
      { text: "I'm depriving my kids because of my financial mistakes", toxic: true },
      { text: "Kids need presence more than expensive experiences", toxic: false },
      { text: "We can plan affordable adventures that create great memories", toxic: false },
    ],
    responses: [
      { text: "Plan a fun local adventure — state park camping, day trips, or a staycation with activities", healthy: true, consequence: "Your kids have a blast. Studies show children value time with parents more than expensive vacations." },
      { text: "Put a vacation on a credit card you can't afford", healthy: false, consequence: "A $3,000 vacation at 20% APR takes years to pay off. The memory fades but the payments don't." },
      { text: "Feel guilty and promise a big trip 'someday' without a plan", healthy: false, consequence: "Vague promises build resentment. A concrete savings plan — even $50/month — gives everyone something to look forward to." },
    ],
  },
  {
    situation: "You overspend your grocery budget by $60 this month.",
    difficulty: 1,
    beliefs: [
      { text: "I'll never be able to stick to a budget — why even try", toxic: true },
      { text: "Budgets are guidelines that need adjusting, not pass/fail tests", toxic: false },
      { text: "One over-budget month is data, not disaster", toxic: false },
    ],
    responses: [
      { text: "Review what caused the overspend, adjust next month, and move forward", healthy: true, consequence: "You discover bulk-buy staples pushed you over. Next month you stagger those purchases and come in under budget." },
      { text: "Abandon the budget system entirely", healthy: false, consequence: "Without any spending awareness, you're flying blind. Even an imperfect budget beats no budget." },
      { text: "Skip meals next week to 'make up for it'", healthy: false, consequence: "Punishing yourself creates an unhealthy relationship with money and food. Adjustment beats punishment." },
    ],
  },
  {
    situation: "Your car needs a $400 repair. You have $600 in your emergency fund.",
    difficulty: 1,
    beliefs: [
      { text: "My emergency fund is too small — what's the point of even having one", toxic: true },
      { text: "This is exactly what the emergency fund is for", toxic: false },
      { text: "Using the fund for a real emergency is a success, not a failure", toxic: false },
    ],
    responses: [
      { text: "Use the emergency fund for the repair and rebuild it over the next few months", healthy: true, consequence: "This is the textbook correct move. Your fund prevented a $400 debt. You rebuild it at $100/month and you're back in 4 months." },
      { text: "Put the repair on a credit card to 'protect' your emergency fund", healthy: false, consequence: "Paying 20%+ interest to protect cash earning 0.5% is backwards math. The fund exists for this exact moment." },
      { text: "Drive without fixing it and hope nothing gets worse", healthy: false, consequence: "Small repairs become big repairs. That $400 fix becomes a $1,800 engine replacement in 3 months." },
    ],
  },
  {
    situation: "You realize you've been paying $45/month for three subscriptions you barely use.",
    difficulty: 1,
    beliefs: [
      { text: "$45 is such a small amount — it won't make a difference", toxic: true },
      { text: "Small leaks sink big ships — recurring costs matter", toxic: false },
      { text: "Redirecting this money could meaningfully boost my savings", toxic: false },
    ],
    responses: [
      { text: "Cancel all three and redirect the $45/month to your emergency fund", healthy: true, consequence: "That's $540/year — more than 10% of most starter emergency funds. In 2 years, it's over $1,000 saved from 'nothing.'" },
      { text: "Keep them because canceling feels like 'going backwards'", healthy: false, consequence: "Paying for things you don't use isn't maintaining lifestyle — it's waste. Canceling is a power move, not a sacrifice." },
      { text: "Cancel one and keep two 'just in case'", healthy: false, consequence: "Better than nothing, but 'just in case' for a subscription you used once in 6 months is fear-based spending." },
    ],
  },

  // ─── Difficulty 2 (Medium — more nuanced situations) ─────────────
  {
    situation: "Your friend mentions they just bought a new car. You feel a pang of jealousy and think about your older vehicle.",
    difficulty: 2,
    beliefs: [
      { text: "I'll never be able to afford nice things after bankruptcy", toxic: true },
      { text: "Everyone has different timelines for big purchases", toxic: false },
      { text: "It's normal to notice what others have", toxic: false },
    ],
    responses: [
      { text: "Research what car you could realistically afford in 12 months", healthy: true, consequence: "You create a savings goal and feel empowered by having a plan." },
      { text: "Apply for a high-interest auto loan to get a new car now", healthy: false, consequence: "The 22% APR means you'd pay almost double the car's value. This is exactly how predatory lenders profit." },
      { text: "Avoid your friend so you don't feel bad", healthy: false, consequence: "Isolation doesn't fix the underlying belief. The feeling comes back with every comparison." },
    ],
  },
  {
    situation: "Your coworker casually mentions their investment portfolio is up 15% this year.",
    difficulty: 2,
    beliefs: [
      { text: "I'm too far behind to ever build wealth", toxic: true },
      { text: "Investing is something I can learn at my own pace", toxic: false },
      { text: "Everyone starts somewhere with investing", toxic: false },
    ],
    responses: [
      { text: "Open a free brokerage account and start learning with small amounts", healthy: true, consequence: "Even $25/month invested consistently builds the habit. In 10 years, small contributions add up significantly." },
      { text: "Put all your emergency fund into stocks to catch up", healthy: false, consequence: "Markets can drop 30%+ in a bad year. Without an emergency fund, any setback forces you into debt again." },
      { text: "Decide investing isn't for 'people like you'", healthy: false, consequence: "This belief keeps you from one of the most powerful wealth-building tools available to everyone." },
    ],
  },
  {
    situation: "You get a raise at work — an extra $200/month. You feel excited for the first time in a while.",
    difficulty: 2,
    beliefs: [
      { text: "I deserve to spend this on myself after everything I've been through", toxic: true },
      { text: "This is a great opportunity to strengthen my financial foundation", toxic: false },
      { text: "I can enjoy some of this while also being strategic", toxic: false },
    ],
    responses: [
      { text: "Split it: $100 to emergency fund, $50 to a debt/savings goal, $50 for something enjoyable", healthy: true, consequence: "You build security AND enjoy life. In 10 months, your emergency fund grows by $1,000. You also got monthly treats." },
      { text: "Upgrade your lifestyle — new clothes, dining out, subscriptions", healthy: false, consequence: "Lifestyle creep absorbs the entire raise. Six months later, you feel just as stretched as before." },
      { text: "Put every penny toward debt — you don't deserve to enjoy it", healthy: false, consequence: "Extreme restriction leads to burnout and binge spending. Sustainable plans include room for joy." },
    ],
  },
  {
    situation: "A 'buy now, pay later' option pops up at checkout for a $200 item you want but don't need.",
    difficulty: 2,
    beliefs: [
      { text: "It's only four payments — that's practically free", toxic: true },
      { text: "Splitting payments doesn't change whether I can afford this", toxic: false },
      { text: "I should check if this fits my budget before committing", toxic: false },
    ],
    responses: [
      { text: "Close the tab, add it to a wish list, and revisit in 48 hours", healthy: true, consequence: "The 48-hour rule kills 70% of impulse purchases. If you still want it in 2 days, budget for it honestly." },
      { text: "Use BNPL — the payments are small and manageable", healthy: false, consequence: "BNPL services don't always report on-time payments but DO report missed ones. Late fees stack up fast." },
      { text: "Buy it outright on a credit card to avoid BNPL", healthy: false, consequence: "If it's not in your budget, the payment method doesn't matter. A want you can't afford is still a want you can't afford." },
    ],
  },
  {
    situation: "Your employer offers a 401(k) match — they'll match 50% of your contribution up to 6% of salary.",
    difficulty: 2,
    beliefs: [
      { text: "I can't afford to save for retirement right now — I have too many other problems", toxic: true },
      { text: "Even a small contribution to get the match is free money", toxic: false },
      { text: "Retirement savings and current financial stability can coexist", toxic: false },
    ],
    responses: [
      { text: "Contribute at least enough to get the full match, even if it's tight", healthy: true, consequence: "On a $40K salary, contributing 6% ($200/month) gets you $100/month in free employer money. That's $1,200/year in 'bonus' savings." },
      { text: "Skip the 401(k) entirely until all debt is paid", healthy: false, consequence: "You leave free money on the table. Even during debt payoff, the match is an instant 50% return — better than any debt's APR." },
      { text: "Max out contributions at 15% to catch up fast", healthy: false, consequence: "Over-contributing while you still need an emergency fund creates cash-flow problems. Start with the match and increase gradually." },
    ],
  },
  {
    situation: "You're invited to a friend's birthday dinner at an expensive restaurant.",
    difficulty: 2,
    beliefs: [
      { text: "I can't say no or suggest something cheaper — they'll know I'm broke", toxic: true },
      { text: "Real friends understand budget constraints", toxic: false },
      { text: "There are ways to participate without overspending", toxic: false },
    ],
    responses: [
      { text: "Go but set a personal budget — order water and an appetizer, and be upfront if needed", healthy: true, consequence: "Most people respect this. Some friends have been in your shoes. Being honest often deepens relationships." },
      { text: "Skip the dinner entirely to avoid spending", healthy: false, consequence: "Social isolation is a real cost of financial anxiety. Missing every event leads to loneliness." },
      { text: "Go and spend freely — you'll figure out the money later", healthy: false, consequence: "A $75 dinner on an unplanned expense creates stress for weeks. The fun evening becomes a guilt trigger." },
    ],
  },
  {
    situation: "You overhear someone say, 'Anyone who files bankruptcy is just lazy and irresponsible.'",
    difficulty: 2,
    beliefs: [
      { text: "They're right about me, even though they don't know me", toxic: true },
      { text: "This opinion comes from ignorance about how bankruptcy actually works", toxic: false },
      { text: "My experience doesn't match their stereotype", toxic: false },
    ],
    responses: [
      { text: "Silently remind yourself of the real causes, and maybe share facts if appropriate", healthy: true, consequence: "Medical debt, job loss, and divorce cause most bankruptcies. You know the truth. Their ignorance doesn't define you." },
      { text: "Confront them angrily", healthy: false, consequence: "Understandable impulse, but it rarely changes minds and raises your stress. Choose your battles." },
      { text: "Internalize the shame and question your progress", healthy: false, consequence: "One stranger's ignorant comment can undo weeks of positive self-work if you let it. Don't give them that power." },
    ],
  },

  // ─── Difficulty 3 (Hardest — subtle toxic beliefs) ───────────────
  {
    situation: "You see an ad: 'Bad credit? No problem! Get $5,000 today!' with an easy online application.",
    difficulty: 3,
    beliefs: [
      { text: "This is my only option because nobody else will lend to me", toxic: true },
      { text: "Legitimate lenders don't typically target people with bad credit this aggressively", toxic: false },
      { text: "I should research any lender before applying", toxic: false },
    ],
    responses: [
      { text: "Research the lender's BBB rating, read the fine print, and compare with credit union options", healthy: true, consequence: "You discover it's a 36% APR loan with hidden origination fees. Your credit union offers a secured loan at 8%." },
      { text: "Apply immediately — you need the money and this seems easy", healthy: false, consequence: "The 'easy' application locks you into a $5,000 loan that costs $8,200 to repay. Classic predatory lending." },
      { text: "Feel hopeless because only scammy lenders will work with you", healthy: false, consequence: "This isn't true. Credit unions, CDFIs, and secured products serve post-bankruptcy consumers ethically." },
    ],
  },
  {
    situation: "You check your credit score and it went DOWN 12 points this month despite doing everything right.",
    difficulty: 3,
    beliefs: [
      { text: "Nothing I do matters — the system is rigged against me", toxic: true },
      { text: "Credit scores fluctuate normally and one month doesn't define the trend", toxic: false },
      { text: "I should investigate the cause rather than assume the worst", toxic: false },
    ],
    responses: [
      { text: "Pull your free credit report to check for errors or new items", healthy: true, consequence: "You find a medical bill that was paid but reported late. You dispute it and the score bounces back next month." },
      { text: "Give up on rebuilding credit entirely", healthy: false, consequence: "A 12-point dip is normal variance. Giving up over noise means you miss the long-term upward trend." },
      { text: "Open several new credit cards to improve your score faster", healthy: false, consequence: "Multiple hard inquiries at once can drop your score further. Patience and consistency win the credit game." },
    ],
  },
  {
    situation: "You see a Facebook post from a 'financial guru' selling a $997 course: 'Learn how to become a millionaire in 12 months!'",
    difficulty: 3,
    beliefs: [
      { text: "There must be a secret to wealth that I don't know", toxic: true },
      { text: "Real financial education doesn't require a thousand-dollar course", toxic: false },
      { text: "If it sounds too good to be true, it probably is", toxic: false },
    ],
    responses: [
      { text: "Recognize the marketing tactics and continue your current financial education", healthy: true, consequence: "You save $997 and avoid a course that likely rehashes free information with added hype. Your current plan is working." },
      { text: "Buy it — you need every advantage to get ahead", healthy: false, consequence: "The 'secret' turns out to be 'spend money on my course and sell your own course.' You're out $997." },
      { text: "Feel defeated because you can't afford the 'shortcut'", healthy: false, consequence: "There are no shortcuts. Consistent, informed financial decisions beat any guru's course. You're already doing the work." },
    ],
  },
  {
    situation: "A store clerk offers a store credit card: '20% off today's purchase if you apply now!'",
    difficulty: 3,
    beliefs: [
      { text: "Every credit opportunity is a chance to rebuild my score", toxic: true },
      { text: "Store cards often have terrible terms and aren't the best way to rebuild", toxic: false },
      { text: "I should evaluate credit offers carefully, not impulsively", toxic: false },
    ],
    responses: [
      { text: "Politely decline and stick to your secured card strategy for credit building", healthy: true, consequence: "Store cards average 25-29% APR and the hard inquiry costs 5-10 credit points. Your secured card at 8% is better for rebuilding." },
      { text: "Apply — the 20% discount is too good to pass up", healthy: false, consequence: "You save $30 on today's purchase but open a 28% APR card. One carried balance wipes out years of that 'savings.'" },
      { text: "Feel embarrassed to decline in front of other customers", healthy: false, consequence: "Financial decisions should never be made based on social pressure. The clerk forgets you in 5 minutes; the card stays for years." },
    ],
  },
  {
    situation: "You just completed Module 4 of this course and it took you longer than the 'estimated time.'",
    difficulty: 3,
    beliefs: [
      { text: "I'm slower than everyone else — maybe I'm not smart enough for this", toxic: true },
      { text: "Thorough learning often takes more time, and that's a strength", toxic: false },
      { text: "Everyone processes financial education at their own pace", toxic: false },
    ],
    responses: [
      { text: "Acknowledge your effort and review the key takeaways before moving forward", healthy: true, consequence: "Research shows that slower, deeper processing leads to better retention. You'll remember this content long-term." },
      { text: "Rush through the next module to 'catch up'", healthy: false, consequence: "Speed-running financial education defeats the purpose. Understanding beats completion every time." },
      { text: "Consider dropping the course because it's taking too long", healthy: false, consequence: "You're investing in yourself. The time spent here pays dividends for decades. There's no deadline." },
    ],
  },
  {
    situation: "You receive a tax refund of $1,200. It feels like a windfall.",
    difficulty: 3,
    beliefs: [
      { text: "This is 'bonus money' so I should treat myself — I've earned it", toxic: true },
      { text: "A tax refund is my own money that was withheld — not a bonus", toxic: false },
      { text: "I can use this strategically while still enjoying some of it", toxic: false },
    ],
    responses: [
      { text: "Use the 70/20/10 split: 70% to financial goals, 20% to savings, 10% for fun", healthy: true, consequence: "$840 toward goals, $240 to savings, and $120 for guilt-free enjoyment. Strategic AND satisfying." },
      { text: "Blow it all on something fun — you deserve it", healthy: false, consequence: "The dopamine fades in days. The missed opportunity to build security lasts much longer." },
      { text: "Put every cent toward debt and feel good about being responsible", healthy: false, consequence: "100% austerity with windfalls creates resentment. The next windfall, you're more likely to splurge entirely." },
    ],
  },
]

// ── Game config ──────────────────────────────────────────────────────

const SCENARIOS_PER_TIER = 4
const TOTAL_SCENARIOS = SCENARIOS_PER_TIER * 3 // 12

type Phase = 'intro' | 'identify-belief' | 'choose-response' | 'consequence' | 'result'

const TIER_LABELS = ['Round 1', 'Round 2', 'Round 3']
const TIER_COLORS = [
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-red-100 text-red-700',
]

export default function BeliefTrap({ onComplete }: GameProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [beliefCorrect, setBeliefCorrect] = useState(false)
  const [selectedBelief, setSelectedBelief] = useState<number | null>(null)
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null)
  const [consequenceText, setConsequenceText] = useState('')
  const [responseWasHealthy, setResponseWasHealthy] = useState(false)
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000))

  // Select 4 scenarios per difficulty tier, ordered easy → hard
  const gameScenarios = useMemo(() => {
    const tier1 = SCENARIOS.filter(s => s.difficulty === 1)
    const tier2 = SCENARIOS.filter(s => s.difficulty === 2)
    const tier3 = SCENARIOS.filter(s => s.difficulty === 3)
    return [
      ...seededShuffle(tier1, seed).slice(0, SCENARIOS_PER_TIER),
      ...seededShuffle(tier2, seed + 1).slice(0, SCENARIOS_PER_TIER),
      ...seededShuffle(tier3, seed + 2).slice(0, SCENARIOS_PER_TIER),
    ]
  }, [seed])

  const scenario = gameScenarios[scenarioIdx]
  const maxScore = TOTAL_SCENARIOS * 20
  const xpAvailable = 300

  // Shuffle beliefs and responses per scenario (so correct answer isn't always first)
  const shuffledBeliefs = useMemo(
    () => scenario ? seededShuffle(scenario.beliefs, seed + scenarioIdx * 100 + 10) : [],
    [scenario, seed, scenarioIdx],
  )
  const shuffledResponses = useMemo(
    () => scenario ? seededShuffle(scenario.responses, seed + scenarioIdx * 100 + 50) : [],
    [scenario, seed, scenarioIdx],
  )

  // Which difficulty tier is the current scenario in?
  const currentTier = scenarioIdx < SCENARIOS_PER_TIER ? 0
    : scenarioIdx < SCENARIOS_PER_TIER * 2 ? 1 : 2

  const handleStart = () => setPhase('identify-belief')

  const handleBeliefSelect = (idx: number) => {
    setSelectedBelief(idx)
    const correct = shuffledBeliefs[idx].toxic
    setBeliefCorrect(correct)
    if (correct) setScore(prev => prev + 10)
    setTimeout(() => setPhase('choose-response'), 800)
  }

  const handleResponseSelect = (idx: number) => {
    setSelectedResponse(idx)
    const resp = shuffledResponses[idx]
    setResponseWasHealthy(resp.healthy)
    setConsequenceText(resp.consequence)
    if (resp.healthy) setScore(prev => prev + 10)
    setTimeout(() => setPhase('consequence'), 800)
  }

  const handleNext = () => {
    setSelectedBelief(null)
    setSelectedResponse(null)
    setConsequenceText('')

    if (scenarioIdx + 1 >= TOTAL_SCENARIOS) {
      setPhase('result')
      onComplete?.(score)
    } else {
      setScenarioIdx(prev => prev + 1)
      setPhase('identify-belief')
    }
  }

  const handleReplay = useCallback(() => {
    setPhase('intro')
    setScenarioIdx(0)
    setScore(0)
    setSelectedBelief(null)
    setSelectedResponse(null)
    setConsequenceText('')
    setSeed(Math.floor(Math.random() * 100000))
  }, [])

  // ── Result screen ──────────────────────────────────────────────────
  if (phase === 'result') {
    const xpEarned = Math.round((score / maxScore) * xpAvailable)
    return (
      <GameResult
        title="The Belief Trap"
        score={score}
        maxScore={maxScore}
        xpEarned={xpEarned}
        badgeEarned={score >= maxScore * 0.9 ? { name: 'Belief Breaker', icon: '💡' } : null}
        onReplay={handleReplay}
        gameSlug="belief-trap"
        moduleSlug="02-money-story"
      />
    )
  }

  // ── Intro screen ───────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">💡</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">The Belief Trap</h1>
        <p className="text-gray-500 mb-2">
          Financial situations trigger hidden money beliefs. Your job: spot the toxic belief,
          then choose the healthiest response.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Difficulty increases across 3 rounds — easy situations first, subtle traps last.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {TOTAL_SCENARIOS} scenarios · +10 per correct belief · +10 per healthy response · {xpAvailable} XP max
        </p>
        <button
          onClick={handleStart}
          className="bg-fresh-blue text-white font-semibold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Start Game
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto pb-16">
      <GameHeader
        title="The Belief Trap"
        score={score}
        maxScore={maxScore}
        xpAvailable={xpAvailable}
      />

      {/* Progress + difficulty badge */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <div className="flex items-center gap-2">
          <span>Scenario {scenarioIdx + 1} of {TOTAL_SCENARIOS}</span>
          <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', TIER_COLORS[currentTier])}>
            {TIER_LABELS[currentTier]}
          </span>
        </div>
        <span>{score} pts</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-fresh-blue rounded-full transition-all duration-300"
          style={{ width: `${((scenarioIdx + (phase === 'consequence' ? 1 : 0.5)) / TOTAL_SCENARIOS) * 100}%` }}
        />
      </div>

      {/* Situation card */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 mb-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Situation</p>
        <p className="text-base text-gray-800 leading-relaxed">{scenario.situation}</p>
      </div>

      {/* Phase: Identify belief */}
      {phase === 'identify-belief' && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">
            Which belief is the <span className="text-red-500">toxic trap</span>?
          </p>
          <div className="space-y-2">
            {shuffledBeliefs.map((belief, i) => (
              <button
                key={i}
                onClick={() => handleBeliefSelect(i)}
                disabled={selectedBelief !== null}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all text-sm',
                  selectedBelief === null
                    ? 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                    : selectedBelief === i && belief.toxic
                      ? 'border-emerald-400 bg-emerald-50'
                      : selectedBelief === i && !belief.toxic
                        ? 'border-amber-400 bg-amber-50'
                        : belief.toxic
                          ? 'border-emerald-300 bg-emerald-50/50 opacity-60'
                          : 'border-gray-100 opacity-40',
                )}
              >
                {belief.text}
                {selectedBelief !== null && belief.toxic && (
                  <span className="ml-2 text-emerald-600 font-bold">← Toxic belief</span>
                )}
              </button>
            ))}
          </div>
          {selectedBelief !== null && (
            <p className={cn(
              'mt-3 text-sm font-semibold text-center',
              beliefCorrect ? 'text-emerald-600' : 'text-amber-600',
            )}>
              {beliefCorrect ? 'Correct! You spotted the trap.' : 'Not quite — but now you see it!'}
            </p>
          )}
        </div>
      )}

      {/* Phase: Choose response */}
      {phase === 'choose-response' && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">
            What's the <span className="text-emerald-600">healthiest response</span>?
          </p>
          <div className="space-y-2">
            {shuffledResponses.map((resp, i) => (
              <button
                key={i}
                onClick={() => handleResponseSelect(i)}
                disabled={selectedResponse !== null}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all text-sm',
                  selectedResponse === null
                    ? 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                    : selectedResponse === i && resp.healthy
                      ? 'border-emerald-400 bg-emerald-50'
                      : selectedResponse === i && !resp.healthy
                        ? 'border-amber-400 bg-amber-50'
                        : resp.healthy
                          ? 'border-emerald-300 bg-emerald-50/50 opacity-60'
                          : 'border-gray-100 opacity-40',
                )}
              >
                {resp.text}
                {selectedResponse !== null && resp.healthy && (
                  <span className="ml-2 text-emerald-600 font-bold">← Healthiest</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase: Consequence */}
      {phase === 'consequence' && (
        <div>
          <div className={cn(
            'rounded-2xl border-2 p-5 mb-6',
            responseWasHealthy
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-amber-200 bg-amber-50',
          )}>
            <p className={cn(
              'text-sm font-bold mb-2',
              responseWasHealthy ? 'text-emerald-700' : 'text-amber-700',
            )}>
              {responseWasHealthy ? 'Great choice! +10 points' : 'Here\'s what happens:'}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{consequenceText}</p>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-fresh-blue text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            {scenarioIdx + 1 >= TOTAL_SCENARIOS ? 'See Results' : 'Next Scenario'}
          </button>
        </div>
      )}
    </div>
  )
}
