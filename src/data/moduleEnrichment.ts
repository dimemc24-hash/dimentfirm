/**
 * Module Enrichment Data — Insight quizzes, study guides, and module assessments
 * for all 10 modules.
 *
 * Quizzes appear after lesson N (configurable), study guides at lesson end,
 * and assessments on the module overview page after completion.
 */

import type { InsightQuizData } from '../components/course/InsightQuiz'
import type { StudyGuideData } from '../components/course/StudyGuide'
import type { ModuleAssessmentData } from '../components/course/ModuleAssessment'

// ════════════════════════════════════════════════════════════════════
// INSIGHT QUIZZES
// ════════════════════════════════════════════════════════════════════

/** Map: moduleId → { afterLesson: number, quiz: InsightQuizData } */
export const INSIGHT_QUIZZES: Record<string, { afterLesson: number; quiz: InsightQuizData }> = {
  '01-fresh-start': {
    afterLesson: 3,
    quiz: {
      id: 'recovery-style',
      title: "What's Your Financial Recovery Style?",
      subtitle: 'Discover how you naturally approach rebuilding — so you can lean into your strengths.',
      questions: [
        {
          question: 'When facing a financial setback, what do you do first?',
          emoji: '🧠',
          options: [
            { text: 'Research everything — I need to understand before I act', weights: { researcher: 3, planner: 1 } },
            { text: 'Make a plan — I need structure and steps', weights: { planner: 3, researcher: 1 } },
            { text: 'Take immediate action — I just need to start somewhere', weights: { doer: 3, healer: 1 } },
            { text: 'Process my emotions first — I need to be in the right headspace', weights: { healer: 3, doer: 1 } },
          ],
        },
        {
          question: 'How do you feel about looking at your bank account?',
          emoji: '💳',
          options: [
            { text: 'I check it daily — knowledge is power', weights: { researcher: 2, planner: 2 } },
            { text: 'I check weekly as part of my routine', weights: { planner: 3, doer: 1 } },
            { text: 'I check when I need to — no set schedule', weights: { doer: 3 } },
            { text: 'Honestly? I avoid it sometimes', weights: { healer: 3, researcher: 1 } },
          ],
        },
        {
          question: 'A friend asks for financial advice. You suggest they...',
          emoji: '💬',
          options: [
            { text: 'Read a specific book or take a course', weights: { researcher: 3 } },
            { text: 'Create a budget spreadsheet together', weights: { planner: 3 } },
            { text: 'Start with one small change this week', weights: { doer: 3 } },
            { text: 'Talk about their feelings around money first', weights: { healer: 3 } },
          ],
        },
        {
          question: 'What motivates you most to keep going?',
          emoji: '🔥',
          options: [
            { text: 'Seeing the data — charts, numbers, progress graphs', weights: { researcher: 3, planner: 1 } },
            { text: 'Checking off milestones on my plan', weights: { planner: 3 } },
            { text: 'Quick wins — visible results right away', weights: { doer: 3, planner: 1 } },
            { text: 'Feeling calmer and more in control emotionally', weights: { healer: 3, doer: 1 } },
          ],
        },
        {
          question: 'If you could snap your fingers and change one thing about your finances...',
          emoji: '✨',
          options: [
            { text: 'I\'d fully understand how all the systems work', weights: { researcher: 3 } },
            { text: 'I\'d have a clear 5-year plan already mapped out', weights: { planner: 3 } },
            { text: 'I\'d have $10,000 in savings right now', weights: { doer: 3 } },
            { text: 'I\'d feel zero shame or anxiety about money', weights: { healer: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'researcher',
          title: 'The Knowledge Seeker',
          emoji: '🔬',
          description: 'You rebuild through understanding. Before you act, you need to know WHY. This makes your decisions incredibly well-informed — you rarely make the same mistake twice.',
          strengths: ['Thorough understanding of financial concepts', 'Excellent at spotting scams and bad deals', 'You make confident, informed decisions'],
          watchOuts: ['Analysis paralysis — don\'t let research delay action', 'Information overload can feel overwhelming', 'Perfect knowledge isn\'t needed to start'],
          actionTip: 'Set a research timer: give yourself 30 minutes to learn about a topic, then commit to ONE action based on what you learned. Knowledge + action = power.',
        },
        {
          type: 'planner',
          title: 'The Strategic Builder',
          emoji: '📋',
          description: 'You thrive with structure. Give you a clear roadmap and you\'ll follow it to the letter. Your discipline is your superpower — once you commit to a plan, you stick with it.',
          strengths: ['Exceptional follow-through on financial goals', 'You create systems that work long-term', 'Great at breaking big goals into manageable steps'],
          watchOuts: ['Rigidity — life doesn\'t always follow the plan', 'Over-planning can delay getting started', 'Don\'t let a "broken" plan discourage you — adapt and continue'],
          actionTip: 'Build flexibility into your plan: create a "Plan B" column for each major step. When things change (and they will), you\'ll already have a pivot ready.',
        },
        {
          type: 'doer',
          title: 'The Action Taker',
          emoji: '🚀',
          description: 'You learn by doing. While others are still planning, you\'ve already opened the savings account and set up auto-transfers. Your bias toward action creates momentum that carries you forward.',
          strengths: ['Fast progress — you don\'t waste time overthinking', 'Great at building habits through repetition', 'Your energy inspires others around you'],
          watchOuts: ['Acting without research can lead to costly mistakes', 'Burnout from trying to do everything at once', 'Some financial moves require patience (credit rebuilding, investing)'],
          actionTip: 'Channel your action energy: pick THREE specific financial moves to make this week — but spend 15 minutes researching each one first. Speed + strategy = unstoppable.',
        },
        {
          type: 'healer',
          title: 'The Mindful Rebuilder',
          emoji: '🌱',
          description: 'You understand that money is emotional. By healing your relationship with money first, you build a foundation that\'s psychologically sustainable. Your rebuilding will last because it\'s rooted in self-awareness.',
          strengths: ['Deep self-awareness about money triggers', 'You build sustainable habits, not quick fixes', 'Your emotional intelligence helps in negotiations and conversations about money'],
          watchOuts: ['Don\'t let emotional processing become avoidance', 'Some financial tasks are boring but necessary — do them anyway', 'Perfectionism about "being ready" can delay practical steps'],
          actionTip: 'Pair each emotional insight with a practical action: every time you journal about money, end with "And today I will..." followed by one concrete financial step.',
        },
      ],
    },
  },

  '02-money-story': {
    afterLesson: 2,
    quiz: {
      id: 'money-personality',
      title: "What's Your Money Personality?",
      subtitle: 'Understanding your default money patterns helps you work WITH your tendencies instead of against them.',
      questions: [
        {
          question: 'You just received an unexpected $500. What\'s your gut reaction?',
          emoji: '💰',
          options: [
            { text: 'Immediately think about what I could buy', weights: { spender: 3, adventurer: 1 } },
            { text: 'Think about where to save or invest it', weights: { saver: 3, planner: 1 } },
            { text: 'Feel anxious — what if I need it for an emergency?', weights: { worrier: 3, saver: 1 } },
            { text: 'Don\'t really think about it — money comes and goes', weights: { adventurer: 3, spender: 1 } },
          ],
        },
        {
          question: 'When you were growing up, money in your house was...',
          emoji: '🏠',
          options: [
            { text: 'Something we didn\'t talk about', weights: { worrier: 2, adventurer: 2 } },
            { text: 'A constant source of stress', weights: { worrier: 3, saver: 1 } },
            { text: 'Freely spent — we enjoyed it when we had it', weights: { spender: 3, adventurer: 1 } },
            { text: 'Carefully managed and saved', weights: { saver: 3, planner: 1 } },
          ],
        },
        {
          question: 'How do you feel when you see your friends buying expensive things?',
          emoji: '👀',
          options: [
            { text: 'I want that too — I work hard, I deserve nice things', weights: { spender: 3 } },
            { text: 'Good for them — I\'m focused on my own goals', weights: { saver: 2, planner: 2 } },
            { text: 'Stressed — how can they afford that? Can I?', weights: { worrier: 3 } },
            { text: 'Indifferent — material things don\'t define happiness', weights: { adventurer: 3 } },
          ],
        },
        {
          question: 'Your biggest financial fear is...',
          emoji: '😰',
          options: [
            { text: 'Never being able to enjoy life or treat myself', weights: { spender: 3, adventurer: 1 } },
            { text: 'Not having enough saved for the future', weights: { saver: 3, worrier: 1 } },
            { text: 'A financial emergency destroying everything', weights: { worrier: 3 } },
            { text: 'Being trapped by financial obligations', weights: { adventurer: 3, spender: 1 } },
          ],
        },
        {
          question: 'If you had to describe your relationship with money in one word...',
          emoji: '💭',
          options: [
            { text: 'Complicated', weights: { worrier: 2, spender: 2 } },
            { text: 'Cautious', weights: { saver: 3, worrier: 1 } },
            { text: 'Fun', weights: { spender: 2, adventurer: 2 } },
            { text: 'Practical', weights: { planner: 3, saver: 1 } },
          ],
        },
      ],
      results: [
        {
          type: 'saver',
          title: 'The Guardian',
          emoji: '🛡️',
          description: 'Money means security to you. You\'re naturally inclined to save and protect, which is a tremendous strength after bankruptcy. You\'ll rebuild your emergency fund faster than most.',
          strengths: ['Natural saver — building funds feels rewarding', 'Risk-aware and careful with decisions', 'Long-term thinking comes naturally'],
          watchOuts: ['Saving TOO aggressively can hurt quality of life', 'Fear of spending can prevent necessary investments in yourself', 'Money hoarding can become an anxiety coping mechanism'],
          actionTip: 'Create a "Joy Budget" — allocate a small, specific amount each month that you MUST spend on something that makes you happy. Balanced saving includes living.',
        },
        {
          type: 'spender',
          title: 'The Experiencer',
          emoji: '🎯',
          description: 'Money is a tool for living well. You see value in experiences and quality. After bankruptcy, your challenge is channeling this energy into smart spending rather than eliminating it.',
          strengths: ['You enjoy life — money serves you, not the other way around', 'Generous with others, which builds strong relationships', 'You invest in experiences that create lasting memories'],
          watchOuts: ['Impulse spending can derail your recovery', 'Emotional spending (stress, boredom) is your kryptonite', 'The 24-hour rule is your best friend — wait before buying'],
          actionTip: 'Implement the "10-10-10" rule: before any purchase over $50, ask "How will I feel about this in 10 minutes? 10 days? 10 months?" It usually reframes the decision.',
        },
        {
          type: 'worrier',
          title: 'The Vigilant One',
          emoji: '👁️',
          description: 'Money stirs up anxiety for you — and that\'s completely understandable given what you\'ve been through. Your vigilance can actually be an asset: you\'ll never be caught off guard.',
          strengths: ['Hyper-aware of financial risks and threats', 'Motivated to create safety nets', 'You catch problems early before they grow'],
          watchOuts: ['Financial anxiety can become paralyzing', 'Over-monitoring accounts can increase stress', 'Avoidance (not looking at accounts) is the flip side of worry'],
          actionTip: 'Set a "Money Check-In" schedule: review finances once per week (same day, same time). Outside that window, give yourself permission NOT to worry. Containment reduces anxiety.',
        },
        {
          type: 'adventurer',
          title: 'The Free Spirit',
          emoji: '🦋',
          description: 'You value freedom over accumulation. Money is a means to autonomy, not an end in itself. Your challenge is building the financial structure that supports the freedom you crave.',
          strengths: ['Adaptable — you can adjust spending quickly', 'Not emotionally attached to money, reducing shame', 'Open to unconventional income strategies'],
          watchOuts: ['Avoiding financial planning feels like freedom but creates fragility', 'Winging it works until it doesn\'t', 'Delegation without oversight can lead to problems'],
          actionTip: 'Automate your finances: set up auto-transfers for savings and auto-pay for bills. This gives you the structure you need while preserving the freedom you want.',
        },
        {
          type: 'planner',
          title: 'The Architect',
          emoji: '📐',
          description: 'You see money as building material. You\'re naturally wired to create systems, follow budgets, and optimize. Your structured approach is ideal for methodical credit rebuilding.',
          strengths: ['Excel at budgeting and financial tracking', 'Systems-oriented — build once, benefit forever', 'Data-driven decisions reduce emotional mistakes'],
          watchOuts: ['Over-optimization can suck the joy out of spending', 'Spreadsheets can\'t capture every variable in life', 'Don\'t let the plan become more important than the goal'],
          actionTip: 'Add a "fun category" to your spreadsheet that you track but never judge. Let the numbers tell the story without controlling every dollar.',
        },
      ],
    },
  },

  '03-budgeting': {
    afterLesson: 3,
    quiz: {
      id: 'budget-style',
      title: "What's Your Ideal Budgeting Style?",
      subtitle: 'Not everyone budgets the same way — find the method that fits YOUR brain.',
      questions: [
        {
          question: 'How much detail do you want in your budget?',
          emoji: '📊',
          options: [
            { text: 'Every. Single. Category. I want to track coffee vs. tea.', weights: { detailed: 3 } },
            { text: 'Major categories — needs, wants, savings. Keep it simple.', weights: { simple: 3 } },
            { text: 'Just tell me: am I spending less than I earn? That\'s enough.', weights: { minimal: 3 } },
            { text: 'I want a visual system — envelopes, jars, something I can see', weights: { visual: 3 } },
          ],
        },
        {
          question: 'You overspent on dining out this month. Your reaction?',
          emoji: '🍔',
          options: [
            { text: 'Analyze where I went wrong and adjust next month\'s numbers', weights: { detailed: 3, simple: 1 } },
            { text: 'Move money from another category to cover it — no big deal', weights: { simple: 3 } },
            { text: 'Feel guilty and try harder next month', weights: { minimal: 2, visual: 2 } },
            { text: 'When the cash envelope is empty, it\'s empty — problem solved', weights: { visual: 3 } },
          ],
        },
        {
          question: 'How do you prefer to track spending?',
          emoji: '📱',
          options: [
            { text: 'Spreadsheet or app — I log everything', weights: { detailed: 3 } },
            { text: 'I check my bank app a few times a week', weights: { simple: 3 } },
            { text: 'I mostly keep a mental tally', weights: { minimal: 3 } },
            { text: 'Physical system — cash, envelopes, written notes', weights: { visual: 3 } },
          ],
        },
        {
          question: 'Your ideal budget review is...',
          emoji: '📅',
          options: [
            { text: 'Weekly deep-dive with charts and category breakdowns', weights: { detailed: 3 } },
            { text: 'Monthly check — are the big numbers on track?', weights: { simple: 3 } },
            { text: 'End of month: did I survive? Cool.', weights: { minimal: 3 } },
            { text: 'Daily — I look at my envelopes/jars to see what\'s left', weights: { visual: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'detailed',
          title: 'The Precision Budgeter',
          emoji: '🎯',
          description: 'You thrive on data and detail. A highly categorized budget with tracking gives you control and confidence. Apps like YNAB or detailed spreadsheets are your playground.',
          strengths: ['Maximum awareness of spending patterns', 'Great at finding and eliminating waste', 'Data-driven optimization over time'],
          watchOuts: ['Don\'t let tracking become a chore that you abandon', 'Over-categorizing can make budgeting feel like a second job', 'Leave room for spontaneous spending'],
          actionTip: 'Start with 10 categories max. You can always split them later once the habit is established. Perfect is the enemy of done.',
        },
        {
          type: 'simple',
          title: 'The 50/30/20 Natural',
          emoji: '⚖️',
          description: 'You like structure without micromanagement. The 50/30/20 rule was literally designed for you: 50% needs, 30% wants, 20% savings. Simple, effective, sustainable.',
          strengths: ['Sustainable — you\'ll actually stick with it', 'Low maintenance means fewer excuses to quit', 'Flexible within categories'],
          watchOuts: ['Too-broad categories can hide problem spending', 'The "wants" category needs occasional spot-checks', 'Revisit your splits as income or life changes'],
          actionTip: 'Set up three bank accounts (or sub-accounts): Needs, Wants, Savings. Auto-split your paycheck. Your budget runs itself.',
        },
        {
          type: 'minimal',
          title: 'The Anti-Budget Budgeter',
          emoji: '🌊',
          description: 'You hate traditional budgets — and that\'s fine! Your style is "pay yourself first": save a set amount, pay bills, spend the rest guilt-free. Simple and effective.',
          strengths: ['Zero daily effort required', 'No category guilt — spend however you want', 'Automation does the heavy lifting'],
          watchOuts: ['Without guardrails, spending can creep up', 'You might miss gradual lifestyle inflation', 'Monthly check-ins are still important'],
          actionTip: 'The "reverse budget": auto-transfer savings + auto-pay bills on payday. Whatever\'s left is yours — no tracking needed. Just make sure the auto-amounts are right.',
        },
        {
          type: 'visual',
          title: 'The Hands-On Manager',
          emoji: '✉️',
          description: 'You need to SEE and FEEL your money to manage it. Cash envelopes, physical systems, and visual progress trackers keep you engaged and accountable.',
          strengths: ['The "pain of paying" keeps spending in check', 'Tangible systems are harder to cheat', 'Visual progress is deeply motivating'],
          watchOuts: ['Cash-only is harder in an increasingly digital world', 'Physical systems don\'t earn interest', 'Need a hybrid approach for online purchases'],
          actionTip: 'Go hybrid: use cash envelopes for your highest-risk categories (dining, shopping) and digital for fixed bills. Best of both worlds.',
        },
      ],
    },
  },

  '05-emergency-fund': {
    afterLesson: 2,
    quiz: {
      id: 'savings-personality',
      title: 'What Kind of Saver Are You?',
      subtitle: 'Your saving style affects how fast you\'ll build that emergency fund. Let\'s find your approach.',
      questions: [
        {
          question: 'A sale on something you\'ve wanted is ending today. You have emergency fund money available.',
          emoji: '🏷️',
          options: [
            { text: 'The fund is untouchable — no exceptions', weights: { fortress: 3 } },
            { text: 'If it\'s a really good deal, maybe...', weights: { flexible: 3 } },
            { text: 'I\'d feel guilty either way — buy or don\'t buy', weights: { emotional: 3 } },
            { text: 'I\'d find another way to afford it without touching savings', weights: { creative: 3 } },
          ],
        },
        {
          question: 'How do you feel about saving money?',
          emoji: '🐷',
          options: [
            { text: 'It makes me feel safe and in control', weights: { fortress: 3 } },
            { text: 'It\'s important but I want to enjoy life too', weights: { flexible: 3 } },
            { text: 'It stresses me out — every dollar saved is a dollar not spent on something I need', weights: { emotional: 3 } },
            { text: 'I love finding creative ways to save more', weights: { creative: 3 } },
          ],
        },
        {
          question: 'Your car needs a $300 repair. How do you handle it?',
          emoji: '🔧',
          options: [
            { text: 'Emergency fund — that\'s literally what it\'s for', weights: { fortress: 3 } },
            { text: 'Use the fund but immediately plan to replenish it', weights: { flexible: 2, fortress: 2 } },
            { text: 'Panic a little, then figure it out', weights: { emotional: 3 } },
            { text: 'See if I can negotiate, find a cheaper option, or DIY part of it', weights: { creative: 3 } },
          ],
        },
        {
          question: 'What would help you save more consistently?',
          emoji: '🎯',
          options: [
            { text: 'Automatic transfers so I never see the money', weights: { fortress: 2, flexible: 2 } },
            { text: 'A reward system — save X, treat myself to Y', weights: { flexible: 3 } },
            { text: 'Understanding WHY I struggle to save', weights: { emotional: 3 } },
            { text: 'A savings challenge or game that makes it fun', weights: { creative: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'fortress',
          title: 'The Fortress Builder',
          emoji: '🏰',
          description: 'Once money goes into savings, it STAYS there. Your discipline is incredible — you\'ll reach your emergency fund goal faster than any other type. Just make sure the fortress has a door.',
          strengths: ['Iron discipline with savings', 'Your fund will actually be there when you need it', 'Rules-based approach eliminates decision fatigue'],
          watchOuts: ['Being too rigid can cause stress when real emergencies hit', 'Don\'t feel guilty for using the fund for genuine emergencies', 'Balance saving with living — extreme frugality isn\'t sustainable'],
          actionTip: 'Define your "emergency criteria" in writing — post it on your fridge. This way, using the fund for a real emergency feels like following the plan, not breaking it.',
        },
        {
          type: 'flexible',
          title: 'The Balanced Saver',
          emoji: '⚖️',
          description: 'You save consistently while still enjoying life. Your approach is sustainable because it doesn\'t feel like deprivation. The key is making sure flexibility doesn\'t become a loophole.',
          strengths: ['Sustainable saving habits', 'Adaptable to life changes', 'Healthy relationship with money'],
          watchOuts: ['Flexibility can become "just this once" creep', 'Lifestyle inflation can eat into savings', 'Set clear rules for what counts as an exception'],
          actionTip: 'The "sleep on it" rule: any non-emergency withdrawal from savings requires 48 hours of thinking. Most urges pass.',
        },
        {
          type: 'emotional',
          title: 'The Feeling Saver',
          emoji: '💙',
          description: 'Money is deeply emotional for you — saving feels hard because spending feels like caring for yourself. Understanding this connection is actually your superpower for sustainable saving.',
          strengths: ['Deep self-awareness about spending triggers', 'Empathetic with money — generous and caring', 'When motivated, you\'re unstoppable'],
          watchOuts: ['Emotional spending can sabotage savings goals', 'Guilt cycle: spend → feel bad → spend to feel better', 'Need to separate self-worth from net worth'],
          actionTip: 'Name your emergency fund something emotional: "My Freedom Fund" or "My Peace of Mind Account." When saving feels personal, it sticks.',
        },
        {
          type: 'creative',
          title: 'The Savings Hacker',
          emoji: '🧩',
          description: 'You find innovative ways to save that others don\'t think of. Challenges, games, deals, side hustles — you turn saving into a creative puzzle. This keeps it exciting and sustainable.',
          strengths: ['Creative problem-solving for financial challenges', 'Motivated by novelty and challenges', 'Great at finding deals and optimizations'],
          watchOuts: ['Novelty wears off — need new strategies regularly', 'Deal-hunting can actually increase spending', 'Don\'t neglect boring-but-essential financial tasks'],
          actionTip: 'Try a new savings challenge each month: "No-spend weekdays," "Round-up savings," "Sell one thing per week." Variety keeps you engaged.',
        },
      ],
    },
  },

  '07-credit-rebuilding': {
    afterLesson: 3,
    quiz: {
      id: 'credit-approach',
      title: 'What\'s Your Credit Rebuilding Strategy?',
      subtitle: 'How you think about credit affects how you rebuild it. Find your natural approach.',
      questions: [
        {
          question: 'When you think about your credit score, you feel...',
          emoji: '📈',
          options: [
            { text: 'Determined — I\'m going to fix this systematically', weights: { strategic: 3 } },
            { text: 'Overwhelmed — there\'s so much to learn', weights: { cautious: 3 } },
            { text: 'Motivated — I want to see those numbers climb', weights: { competitive: 3 } },
            { text: 'Indifferent — I\'ll focus on it when I need to', weights: { organic: 3 } },
          ],
        },
        {
          question: 'A pre-approved credit card offer arrives in the mail. You...',
          emoji: '📬',
          options: [
            { text: 'Research the terms, compare with other options, then decide', weights: { strategic: 3 } },
            { text: 'Throw it away — I\'m not ready for credit cards yet', weights: { cautious: 3 } },
            { text: 'Apply if it helps my score, even if the terms aren\'t great', weights: { competitive: 3 } },
            { text: 'File it away — I\'ll look at it when I\'m ready', weights: { organic: 3 } },
          ],
        },
        {
          question: 'How would you prefer to rebuild credit?',
          emoji: '🔨',
          options: [
            { text: 'Follow a specific month-by-month plan', weights: { strategic: 3, competitive: 1 } },
            { text: 'Start with one simple product (secured card) and grow slowly', weights: { cautious: 3 } },
            { text: 'Open multiple accounts to build history faster', weights: { competitive: 3 } },
            { text: 'Let it happen naturally through regular financial activity', weights: { organic: 3 } },
          ],
        },
        {
          question: 'How often would you check your credit score?',
          emoji: '🔄',
          options: [
            { text: 'Monthly — I\'m tracking specific metrics', weights: { strategic: 2, competitive: 2 } },
            { text: 'Quarterly — I don\'t want to obsess', weights: { cautious: 3, organic: 1 } },
            { text: 'Weekly — I want to see every point change', weights: { competitive: 3 } },
            { text: 'When I need it for something specific', weights: { organic: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'strategic',
          title: 'The Credit Architect',
          emoji: '📐',
          description: 'You approach credit rebuilding like an engineering project. With research, planning, and patience, you\'ll build a credit profile that\'s rock-solid.',
          strengths: ['Methodical approach maximizes score improvement', 'Great at optimizing utilization and payment timing', 'You\'ll avoid costly mistakes from rushing'],
          watchOuts: ['Over-optimizing can cause analysis paralysis', 'Credit rebuilding has hard time requirements — patience is mandatory', 'Don\'t open accounts just for the strategy — only what you need'],
          actionTip: 'Create a 12-month credit calendar: month 1 (secured card), month 3 (credit-builder loan), month 6 (check for graduation), etc. Let the timeline do the work.',
        },
        {
          type: 'cautious',
          title: 'The Careful Stepper',
          emoji: '🐢',
          description: 'You\'d rather go slow and safe than fast and risky. This is actually the ideal approach post-bankruptcy — one secured card, used responsibly, builds more credit than a dozen rushed applications.',
          strengths: ['Low risk of new financial problems', 'Each step is deliberate and informed', 'You\'ll never over-extend yourself'],
          watchOuts: ['Being TOO cautious can delay legitimate progress', 'Avoiding all credit means your score can\'t improve', 'Some discomfort is necessary for growth'],
          actionTip: 'One step per quarter: Q1 (secured card), Q2 (use it for one recurring bill), Q3 (check your report), Q4 (consider a second product). Small, steady, safe.',
        },
        {
          type: 'competitive',
          title: 'The Score Chaser',
          emoji: '🏆',
          description: 'You\'re motivated by seeing your number go up. This gamified approach can be incredibly effective — just make sure you\'re playing the right game (long-term health, not short-term score hacks).',
          strengths: ['Highly motivated by visible progress', 'Proactive about building new credit', 'You\'ll hit milestones faster than most'],
          watchOuts: ['Don\'t open accounts just for the score — hard inquiries hurt', 'Score obsession can cause unnecessary stress', 'A high score built on debt isn\'t really high'],
          actionTip: 'Track your "credit age" (average account age) alongside your score. This reminds you that patience is part of the game — young accounts need time to mature.',
        },
        {
          type: 'organic',
          title: 'The Natural Grower',
          emoji: '🌿',
          description: 'You trust the process. By living responsibly and letting time do its work, your credit will rebuild naturally. This stress-free approach works — it just takes a bit longer.',
          strengths: ['Low stress — you\'re not obsessing over numbers', 'Healthy relationship with credit from the start', 'Decisions are based on need, not score optimization'],
          watchOuts: ['Passive approach can miss easy wins (disputes, authorized user)', 'Errors on your report won\'t fix themselves', 'At minimum, check your report annually'],
          actionTip: 'Set two calendar reminders: (1) Check credit report every 4 months, (2) Dispute any errors within 7 days of finding them. Minimal effort, maximum protection.',
        },
      ],
    },
  },

  '09-income-growth': {
    afterLesson: 3,
    quiz: {
      id: 'income-style',
      title: 'What\'s Your Income Growth Path?',
      subtitle: 'Discover whether you\'re a side-hustler, skill-builder, negotiator, or entrepreneur at heart.',
      questions: [
        {
          question: 'You have 10 extra hours per week. You use them to...',
          emoji: '⏰',
          options: [
            { text: 'Pick up gig work — immediate cash for immediate needs', weights: { hustler: 3 } },
            { text: 'Take a course or earn a certification', weights: { builder: 3 } },
            { text: 'Prepare to ask for a raise at my current job', weights: { negotiator: 3 } },
            { text: 'Start building something of my own — a product, service, or brand', weights: { entrepreneur: 3 } },
          ],
        },
        {
          question: 'What excites you most about making more money?',
          emoji: '🔥',
          options: [
            { text: 'Quick wins — I want to see more money THIS week', weights: { hustler: 3, negotiator: 1 } },
            { text: 'Long-term growth — doubling my income in 3 years', weights: { builder: 3 } },
            { text: 'Getting paid what I\'m worth at my current job', weights: { negotiator: 3 } },
            { text: 'Building something with unlimited earning potential', weights: { entrepreneur: 3 } },
          ],
        },
        {
          question: 'Your biggest income challenge right now is...',
          emoji: '🧗',
          options: [
            { text: 'I need more money NOW — bills are pressing', weights: { hustler: 3 } },
            { text: 'I feel stuck — my skills don\'t match higher-paying jobs', weights: { builder: 3 } },
            { text: 'I\'m underpaid for what I do', weights: { negotiator: 3 } },
            { text: 'I have ideas but don\'t know how to start', weights: { entrepreneur: 3 } },
          ],
        },
        {
          question: 'How do you feel about financial risk?',
          emoji: '🎲',
          options: [
            { text: 'Keep it safe — I can\'t afford to lose anything right now', weights: { hustler: 2, negotiator: 2 } },
            { text: 'Calculated risks — invest in myself with proven ROI', weights: { builder: 3 } },
            { text: 'I\'d rather negotiate more from what I have', weights: { negotiator: 3 } },
            { text: 'Willing to take smart risks for bigger rewards', weights: { entrepreneur: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'hustler',
          title: 'The Side Hustle Strategist',
          emoji: '💪',
          description: 'You need income NOW and you\'re willing to work for it. Gig work, freelancing, and multiple income streams give you the flexibility and speed you need.',
          strengths: ['Fast results — money in your pocket this week', 'Adaptable — can switch gigs based on demand', 'Builds diverse skills across industries'],
          watchOuts: ['Burnout is real — protect your energy', 'Trading time for money has limits', 'Don\'t neglect long-term career growth for short-term cash'],
          actionTip: 'The 70/30 rule: dedicate 70% of your hustle time to earning, 30% to building skills that increase your rate. Short-term cash AND long-term growth.',
        },
        {
          type: 'builder',
          title: 'The Skill Investor',
          emoji: '📚',
          description: 'You\'re playing the long game. Investing in skills, certifications, and education will compound over time — a certification today could mean $10,000 more per year for decades.',
          strengths: ['Investments in yourself always pay dividends', 'Higher ceiling — skills compound over a career', 'More resilient to economic changes'],
          watchOuts: ['Don\'t fall into "perpetual student" trap', 'Some courses are overpriced for the value', 'Apply skills immediately — don\'t just collect certificates'],
          actionTip: 'Research the highest-ROI certification in your field. Calculate: (cost + time invested) vs. (salary increase × years). If the payback period is under 2 years, do it.',
        },
        {
          type: 'negotiator',
          title: 'The Value Advocate',
          emoji: '🤝',
          description: 'You\'re already good at what you do — you just need to capture more value. Negotiation skills can increase your income 10-20% without changing jobs or working more hours.',
          strengths: ['Highest ROI for time invested — one conversation can change your salary', 'Applies everywhere: salary, rent, bills, contracts', 'Builds confidence in your own value'],
          watchOuts: ['Negotiation without preparation backfires', 'Know your market rate before asking', 'Sometimes the best negotiation is leaving for a better offer'],
          actionTip: 'Start small: negotiate one bill this week (internet, insurance, phone). Track your savings. This builds the muscle for the big ask — your salary.',
        },
        {
          type: 'entrepreneur',
          title: 'The Builder',
          emoji: '🏗️',
          description: 'You want to create something. Whether it\'s a freelance business, a product, or a service, you\'re drawn to building income that isn\'t capped by an employer.',
          strengths: ['Unlimited earning potential', 'Creative fulfillment alongside financial growth', 'Builds assets that can grow beyond your time'],
          watchOuts: ['Entrepreneurship after bankruptcy requires extra caution', 'Start lean — don\'t invest savings into an unproven idea', 'Revenue first, scaling later'],
          actionTip: 'The "$100 startup" test: can you validate your idea and make your first $100 with less than $50 investment? If yes, you have a business. If not, keep iterating.',
        },
      ],
    },
  },

  '04-envelope-system': {
    afterLesson: 3,
    quiz: {
      id: 'spending-style',
      title: "What's Your Spending Control Style?",
      subtitle: 'Cash, cards, apps — HOW you handle money day-to-day reveals a lot about what system will work for you.',
      questions: [
        {
          question: 'When you buy your morning coffee, you prefer to pay with...',
          emoji: '☕',
          options: [
            { text: 'Cash — I like knowing exactly how much I have left', weights: { tactile: 3, guardrails: 1 } },
            { text: 'Debit card — it comes straight from my checking', weights: { guardrails: 3 } },
            { text: 'Credit card — I\'ll pay it off later for the points', weights: { optimizer: 3 } },
            { text: 'Whatever\'s fastest — I don\'t think about it', weights: { autopilot: 3 } },
          ],
        },
        {
          question: 'You\'re at the store and see something you want but didn\'t plan to buy. What happens?',
          emoji: '🛍️',
          options: [
            { text: 'If I have cash in my "fun" envelope, I buy it. If not, I walk away.', weights: { tactile: 3 } },
            { text: 'I check my budget app to see if there\'s room', weights: { guardrails: 3, optimizer: 1 } },
            { text: 'I do a quick mental calculation of my monthly spending', weights: { optimizer: 3 } },
            { text: 'If I can afford it, I buy it. Life\'s too short.', weights: { autopilot: 3 } },
          ],
        },
        {
          question: 'What\'s the hardest part of controlling spending for you?',
          emoji: '🤔',
          options: [
            { text: 'Online shopping — I can\'t "feel" the money leaving', weights: { tactile: 3 } },
            { text: 'Sticking to limits once I\'ve set them', weights: { guardrails: 3 } },
            { text: 'Knowing where to cut without feeling deprived', weights: { optimizer: 3 } },
            { text: 'Honestly, I just don\'t track it closely enough', weights: { autopilot: 3 } },
          ],
        },
        {
          question: 'If your spending system were a vehicle, it would be...',
          emoji: '🚗',
          options: [
            { text: 'A manual transmission — I want full control at all times', weights: { tactile: 3, guardrails: 1 } },
            { text: 'A car with speed limits built in — keep me in the safe zone', weights: { guardrails: 3 } },
            { text: 'A fuel-efficient hybrid — maximum output, minimum waste', weights: { optimizer: 3 } },
            { text: 'Self-driving — just get me where I need to go', weights: { autopilot: 3 } },
          ],
        },
        {
          question: 'At the end of the month, you feel best when...',
          emoji: '🗓️',
          options: [
            { text: 'My envelopes/jars are empty in the right categories — I spent with purpose', weights: { tactile: 3 } },
            { text: 'I stayed within every budget category', weights: { guardrails: 3 } },
            { text: 'I found ways to save more than expected', weights: { optimizer: 3 } },
            { text: 'All my bills are paid and I don\'t have to think about it', weights: { autopilot: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'tactile',
          title: 'The Cash Commander',
          emoji: '💵',
          description: 'You need to physically feel money leaving your hands to register spending. Digital transactions feel abstract — but cash is real. The envelope system was literally designed for someone like you.',
          strengths: ['The "pain of paying" with cash naturally limits spending', 'Visual and tangible systems keep you grounded', 'You\'re unlikely to overspend when cash is your primary tool'],
          watchOuts: ['Cash-only is hard for online bills and subscriptions', 'You need a hybrid system for the digital world', 'Don\'t keep large amounts of cash at home — safety first'],
          actionTip: 'Start with 3 cash envelopes this week: Groceries, Dining Out, and Personal Spending. Use cash for ONLY those categories. Everything else stays digital.',
        },
        {
          type: 'guardrails',
          title: 'The Boundary Setter',
          emoji: '🚧',
          description: 'You do best when clear limits are in place. You WANT to stay on track — you just need the rails to keep you there. Alerts, caps, and category limits are your power tools.',
          strengths: ['Self-aware about the need for structure', 'Great at following systems once they\'re set up', 'Naturally drawn to tools that support discipline'],
          watchOuts: ['Too many rules can feel suffocating and lead to rebellion spending', 'Make sure your guardrails have some flexibility built in', 'Boundaries only work if you\'re honest with yourself about categories'],
          actionTip: 'Set up spending alerts on your bank app: get a notification for every purchase over $25. This tiny friction point will make you pause before spending.',
        },
        {
          type: 'optimizer',
          title: 'The Efficiency Expert',
          emoji: '⚡',
          description: 'You see spending as an optimization problem. You\'re always looking for the best deal, the smartest allocation, the most efficient use of every dollar. Your brain naturally does cost-benefit analysis.',
          strengths: ['Excellent at finding value and avoiding waste', 'Strategic thinking about money maximizes every dollar', 'You naturally comparison-shop and negotiate'],
          watchOuts: ['Optimization fatigue is real — you can\'t optimize everything', 'Sometimes the cheapest option isn\'t the best value', 'Spending time to save small amounts can be a net loss'],
          actionTip: 'Apply the "$5 rule": optimize anything that saves more than $5/month (subscriptions, bills, recurring costs). Let go of optimizing anything under that threshold.',
        },
        {
          type: 'autopilot',
          title: 'The Set-It-and-Forget-It Saver',
          emoji: '🤖',
          description: 'You don\'t want to think about money daily — and that\'s valid. Your ideal system runs in the background: auto-transfers, auto-pay, and a "what\'s left is mine" approach.',
          strengths: ['Low maintenance means higher chance of sticking with it', 'Automation eliminates decision fatigue', 'You won\'t burn out from over-managing'],
          watchOuts: ['Autopilot without checkpoints can drift off course', 'You might miss billing errors or subscription creep', 'Monthly check-ins (even 10 minutes) are non-negotiable'],
          actionTip: 'Build the "Automation Stack": auto-save on payday, auto-pay all bills, auto-invest if applicable. Then set ONE monthly calendar reminder to review for 15 minutes.',
        },
      ],
    },
  },

  '06-healing': {
    afterLesson: 2,
    quiz: {
      id: 'healing-style',
      title: "What's Your Financial Healing Path?",
      subtitle: 'How you process financial pain shapes how you rebuild. There\'s no wrong answer — only YOUR answer.',
      questions: [
        {
          question: 'When you think about your bankruptcy, the strongest feeling is...',
          emoji: '💭',
          options: [
            { text: 'Shame — I feel like I failed', weights: { processor: 3, rebuilder: 1 } },
            { text: 'Relief — the worst part is over', weights: { pragmatist: 3 } },
            { text: 'Determination — I\'m going to come back stronger', weights: { warrior: 3 } },
            { text: 'Numbness — I try not to think about it', weights: { processor: 2, protector: 2 } },
          ],
        },
        {
          question: 'How do you typically deal with financial stress?',
          emoji: '🌊',
          options: [
            { text: 'Talk it out — with a friend, therapist, or journal', weights: { processor: 3 } },
            { text: 'Make a plan — action reduces my anxiety', weights: { pragmatist: 3, warrior: 1 } },
            { text: 'Push through it — dwelling doesn\'t help', weights: { warrior: 3 } },
            { text: 'Avoid it — I\'ll deal with it when I\'m ready', weights: { protector: 3 } },
          ],
        },
        {
          question: 'A family member makes a comment about your financial past. You...',
          emoji: '😤',
          options: [
            { text: 'Feel hurt but use it as a chance to process my feelings', weights: { processor: 3 } },
            { text: 'Calmly share what I\'ve learned and how I\'m rebuilding', weights: { pragmatist: 3 } },
            { text: 'Let it fuel my motivation — I\'ll prove them wrong', weights: { warrior: 3 } },
            { text: 'Change the subject — that\'s a boundary for me', weights: { protector: 3 } },
          ],
        },
        {
          question: 'What does "financial healing" mean to you?',
          emoji: '🌿',
          options: [
            { text: 'Understanding why I ended up here and forgiving myself', weights: { processor: 3, pragmatist: 1 } },
            { text: 'Building a stable financial life that I can trust', weights: { pragmatist: 3 } },
            { text: 'Proving to myself that my past doesn\'t define my future', weights: { warrior: 3 } },
            { text: 'Getting to a place where money doesn\'t cause anxiety', weights: { protector: 3, processor: 1 } },
          ],
        },
      ],
      results: [
        {
          type: 'processor',
          title: 'The Deep Healer',
          emoji: '🌊',
          description: 'You heal by understanding. Processing emotions, examining roots, and making meaning from painful experiences — this is how you transform trauma into wisdom. Your emotional depth is a gift.',
          strengths: ['Deep self-awareness prevents repeating patterns', 'Emotional processing builds genuine resilience', 'You help others by sharing your journey authentically'],
          watchOuts: ['Processing can become ruminating — set time limits', 'Don\'t wait until you\'re "fully healed" to take financial action', 'Balance inner work with outer steps — both matter'],
          actionTip: 'Try a 10-minute "money journal" practice: write about one financial emotion each week. End every entry with "And my next action step is..." This bridges feeling and doing.',
        },
        {
          type: 'pragmatist',
          title: 'The Grounded Rebuilder',
          emoji: '🏗️',
          description: 'You heal through building. New systems, new habits, new results — tangible progress is your medicine. You don\'t deny the past, but you don\'t dwell there either. Your focus is forward.',
          strengths: ['Action-oriented healing creates real momentum', 'Practical progress builds genuine confidence', 'You model healthy recovery for those around you'],
          watchOuts: ['Skipping emotional processing can lead to triggers surfacing later', 'Rebuilding without reflection risks repeating old patterns', 'Give yourself permission to NOT be okay sometimes'],
          actionTip: 'For every financial action you take, pause for 30 seconds and notice how it FEELS. Building emotional awareness alongside practical skills makes your recovery complete.',
        },
        {
          type: 'warrior',
          title: 'The Determined Thriver',
          emoji: '🔥',
          description: 'Your pain becomes fuel. You channel adversity into motivation, and setbacks into comebacks. Your fierce determination will carry you further than you imagine — just remember that even warriors rest.',
          strengths: ['Unstoppable motivation when channeled well', 'You inspire others with your resilience', 'Setbacks make you stronger, not weaker'],
          watchOuts: ['Fighting mode can mask unprocessed pain', 'Proving others wrong is fuel, not the destination', 'Rest and vulnerability are strengths, not weaknesses'],
          actionTip: 'Create a "Victory Log" — write down every financial win, no matter how small. On hard days, read it. Your evidence file of progress is your armor.',
        },
        {
          type: 'protector',
          title: 'The Gentle Guardian',
          emoji: '🛡️',
          description: 'You heal by creating safety. Boundaries, avoidance of triggers, and careful pacing — you protect yourself while rebuilding. This is wise, not weak. Trust your own timeline.',
          strengths: ['Strong boundaries protect your energy and recovery', 'You won\'t rush into bad financial decisions', 'Self-protective instincts serve you well post-bankruptcy'],
          watchOuts: ['Avoidance can prevent necessary financial actions', 'Some discomfort is required for growth — lean into it gently', 'Isolation can feel safe but slows healing'],
          actionTip: 'Choose ONE financial task that you\'ve been avoiding. Set a timer for 15 minutes and work on ONLY that. When the timer ends, stop. Small doses of courage build confidence.',
        },
      ],
    },
  },

  '08-predatory-traps': {
    afterLesson: 2,
    quiz: {
      id: 'financial-defense',
      title: "What's Your Financial Defense Style?",
      subtitle: 'After bankruptcy, predatory lenders see you as a target. Find out how well-armed you are.',
      questions: [
        {
          question: 'A "guaranteed approval" credit card ad shows up in your mail. You...',
          emoji: '📬',
          options: [
            { text: 'Throw it away — guaranteed approval means terrible terms', weights: { shield: 3 } },
            { text: 'Read the fine print before deciding anything', weights: { analyst: 3, shield: 1 } },
            { text: 'Feel tempted — rebuilding credit is hard', weights: { learner: 3 } },
            { text: 'Not sure how to evaluate it, honestly', weights: { seeker: 3 } },
          ],
        },
        {
          question: 'You need $400 for a car repair. No emergency fund. What do you consider?',
          emoji: '🔧',
          options: [
            { text: 'Ask family/friends, negotiate a payment plan with the mechanic, or sell something', weights: { shield: 3 } },
            { text: 'Research all options — personal loan vs payday loan vs credit card cash advance', weights: { analyst: 3 } },
            { text: 'A payday loan to get through the crisis quickly', weights: { learner: 3 } },
            { text: 'I\'m not sure what options exist besides borrowing', weights: { seeker: 3 } },
          ],
        },
        {
          question: 'A car dealer says, "With your credit history, this is the best rate you\'ll get — 22% APR."',
          emoji: '🚘',
          options: [
            { text: 'Walk away — I know that\'s predatory, and I can do better with patience', weights: { shield: 3, analyst: 1 } },
            { text: 'Calculate the total cost of the loan before deciding', weights: { analyst: 3 } },
            { text: 'Feel pressured but worry they might be right', weights: { learner: 3 } },
            { text: 'I\'m not sure what a good rate would be for my situation', weights: { seeker: 3 } },
          ],
        },
        {
          question: 'How confident are you in spotting financial red flags?',
          emoji: '🚩',
          options: [
            { text: 'Very — I can smell a bad deal from a mile away', weights: { shield: 3 } },
            { text: 'Fairly — I know to read the fine print and compare', weights: { analyst: 3 } },
            { text: 'Somewhat — I\'ve been burned before and I\'m more careful now', weights: { learner: 3 } },
            { text: 'Not very — I don\'t always know what to look for', weights: { seeker: 3 } },
          ],
        },
        {
          question: 'When making a major financial decision, you typically...',
          emoji: '⚖️',
          options: [
            { text: 'Sleep on it for at least 48 hours — pressure to act NOW is a red flag', weights: { shield: 3 } },
            { text: 'Compare at least 3 options and calculate true costs', weights: { analyst: 3 } },
            { text: 'Ask someone I trust for a second opinion', weights: { learner: 2, analyst: 2 } },
            { text: 'Go with my gut and hope for the best', weights: { seeker: 3 } },
          ],
        },
      ],
      results: [
        {
          type: 'shield',
          title: 'The Predator-Proof Warrior',
          emoji: '🛡️',
          description: 'You\'ve built strong defenses against financial predators. You recognize manipulation tactics, high-pressure sales, and too-good-to-be-true offers instantly. Your skepticism is your superpower.',
          strengths: ['Excellent at recognizing financial red flags', 'Strong boundary-setting with salespeople and lenders', 'You protect not just yourself but others around you'],
          watchOuts: ['Hyper-vigilance can make you too cautious about legitimate opportunities', 'Not every financial product is predatory — some are genuinely helpful', 'Share your knowledge with others who are more vulnerable'],
          actionTip: 'Become a resource: help one person in your community recognize a predatory offer this month. Teaching reinforces your own knowledge while protecting others.',
        },
        {
          type: 'analyst',
          title: 'The Fine Print Detective',
          emoji: '🔍',
          description: 'You protect yourself through research and analysis. Before you sign anything, you read every word, calculate every cost, and compare every option. Predatory lenders hate you.',
          strengths: ['Thorough evaluation prevents costly mistakes', 'APR and fee calculations are second nature', 'You make decisions based on data, not pressure'],
          watchOuts: ['Analysis paralysis can delay necessary decisions', 'Some deals expire — learn to research efficiently', 'Trust your analysis — don\'t second-guess yourself'],
          actionTip: 'Create a "financial decision checklist" with 5 must-check items (APR, total cost, fees, cancellation policy, alternatives). Use it every time. Speed through the research, not past it.',
        },
        {
          type: 'learner',
          title: 'The Experienced Guardian',
          emoji: '📖',
          description: 'You\'ve learned some lessons the hard way — and that experience is now your teacher. You\'re more careful now, more aware, and building knowledge every day. Past mistakes are your curriculum.',
          strengths: ['Real-world experience makes lessons stick', 'You\'re actively building financial literacy', 'Your story helps others avoid similar traps'],
          watchOuts: ['Past shame can make you overly cautious OR overly trusting', 'Knowledge gaps still exist — keep learning', 'Don\'t let past mistakes define your future decisions'],
          actionTip: 'Write down 3 financial "red flags" you wish you\'d known before. Keep this list in your wallet. Next time you face a decision, check your list first.',
        },
        {
          type: 'seeker',
          title: 'The Rising Defender',
          emoji: '🌅',
          description: 'You\'re at the beginning of building your financial defense skills — and that\'s exactly why this module exists. The fact that you\'re here means you\'re already ahead of where you were.',
          strengths: ['Openness to learning means rapid growth is possible', 'You recognize what you don\'t know — that\'s wisdom', 'This course will transform your confidence'],
          watchOuts: ['You\'re currently most vulnerable to predatory offers — be extra cautious', 'Never sign anything same-day — always take 48 hours', 'When in doubt, ask someone you trust or call 211'],
          actionTip: 'Your new rule: NEVER make a financial decision on the spot. Tell them, "I need 48 hours." Legitimate offers will wait. Scams won\'t — and that\'s how you\'ll tell the difference.',
        },
      ],
    },
  },

  '10-road-map': {
    afterLesson: 3,
    quiz: {
      id: 'future-builder',
      title: "What's Your Long-Term Vision Style?",
      subtitle: 'You\'ve made it to the final module. Now let\'s see how you naturally plan for the big picture.',
      questions: [
        {
          question: 'When you imagine your financial life 5 years from now, you see...',
          emoji: '🔮',
          options: [
            { text: 'A specific, detailed plan — I know the milestones', weights: { architect: 3 } },
            { text: 'A general direction — I know WHERE I want to go', weights: { navigator: 3, architect: 1 } },
            { text: 'Freedom — I want options and flexibility', weights: { explorer: 3 } },
            { text: 'Stability — no more financial surprises', weights: { guardian: 3 } },
          ],
        },
        {
          question: 'You\'re ready to buy a car. How do you approach it?',
          emoji: '🚗',
          options: [
            { text: 'Research for months, compare financing, negotiate everything', weights: { architect: 3 } },
            { text: 'Set a budget range and find the best option within it', weights: { navigator: 3 } },
            { text: 'Look for creative solutions — lease, used, rideshare for now', weights: { explorer: 3 } },
            { text: 'Buy the most reliable option I can afford — no surprises', weights: { guardian: 3 } },
          ],
        },
        {
          question: 'What does "financial graduation" from this course mean to you?',
          emoji: '🎓',
          options: [
            { text: 'Having a complete financial plan covering the next 5-10 years', weights: { architect: 3 } },
            { text: 'Knowing I have the skills to handle whatever comes next', weights: { navigator: 3 } },
            { text: 'Opening doors that were closed — mortgages, opportunities, choices', weights: { explorer: 3 } },
            { text: 'Feeling safe and secure, knowing I\'ll never be in crisis again', weights: { guardian: 3 } },
          ],
        },
        {
          question: 'Your biggest concern about major future purchases (home, car) is...',
          emoji: '🏠',
          options: [
            { text: 'Getting the best terms — I want to optimize every aspect', weights: { architect: 3 } },
            { text: 'Timing — when will my credit and savings be ready?', weights: { navigator: 3 } },
            { text: 'Keeping my options open — I don\'t want to be locked in', weights: { explorer: 3 } },
            { text: 'Not making a mistake that puts me back at square one', weights: { guardian: 3 } },
          ],
        },
        {
          question: 'Looking back at this entire course, the most valuable thing has been...',
          emoji: '💎',
          options: [
            { text: 'The specific strategies and tools I can apply immediately', weights: { architect: 3, navigator: 1 } },
            { text: 'Understanding the big picture of how money works', weights: { navigator: 3 } },
            { text: 'Realizing how many possibilities are ahead of me', weights: { explorer: 3 } },
            { text: 'Knowing I\'m not alone and having a support system', weights: { guardian: 3, explorer: 1 } },
          ],
        },
      ],
      results: [
        {
          type: 'architect',
          title: 'The Master Planner',
          emoji: '📐',
          description: 'You envision the future in precise detail — timelines, milestones, and metrics. Your Letter of Explanation will be a masterpiece. Major purchases will be planned to the penny.',
          strengths: ['Exceptional at long-range financial planning', 'You\'ll never be caught unprepared for a major purchase', 'Lenders love a borrower who plans meticulously'],
          watchOuts: ['Life doesn\'t always follow the blueprint — build in flexibility', 'Don\'t delay living while perfecting the plan', 'A good plan today beats a perfect plan next year'],
          actionTip: 'Draft your 5-year financial roadmap this week: Year 1 (rebuild credit), Year 2 (grow savings), Year 3 (qualify for auto loan), Year 4 (build down payment), Year 5 (homeownership target). Adjust annually.',
        },
        {
          type: 'navigator',
          title: 'The Compass Follower',
          emoji: '🧭',
          description: 'You know your direction even if you don\'t have every step mapped. You trust the process and adjust as you go. This adaptable approach serves you well in an unpredictable world.',
          strengths: ['Flexible enough to seize unexpected opportunities', 'Good at balancing planning with living', 'Resilient when plans need to change'],
          watchOuts: ['"General direction" can lack accountability — set some specific milestones', 'Vague goals produce vague results', 'Check your compass quarterly to make sure you\'re still on course'],
          actionTip: 'Set 3 non-negotiable milestones for the next 12 months (e.g., credit score above 620, $2,000 saved, all bills on autopay). The direction is flexible; the milestones aren\'t.',
        },
        {
          type: 'explorer',
          title: 'The Opportunity Seeker',
          emoji: '🗺️',
          description: 'You see your financial future as full of possibility. After the constraint of bankruptcy, you\'re ready for wide-open spaces. Your optimism and creativity will uncover opportunities others miss.',
          strengths: ['Open-minded about financial strategies and income sources', 'You see possibility where others see limitation', 'Creative problem-solving is your natural advantage'],
          watchOuts: ['Freedom without structure can lead to scattered progress', 'Shiny opportunities can distract from fundamentals', 'Build your foundation FIRST, then explore'],
          actionTip: 'The "Foundation First" rule: before pursuing any exciting opportunity, ask "Are my basics solid?" (Emergency fund, budget, credit building.) If yes, explore freely. If no, shore up the base.',
        },
        {
          type: 'guardian',
          title: 'The Security Builder',
          emoji: '🏰',
          description: 'After the storm of bankruptcy, your primary drive is creating unshakeable stability. You want to know — truly know — that you\'ll never face a financial crisis again. That\'s a powerful foundation.',
          strengths: ['Your caution will prevent future financial crises', 'You build deep emergency reserves and safety nets', 'Risk awareness protects you from predatory offers'],
          watchOuts: ['Fear of risk can prevent necessary growth (like using credit responsibly)', 'Total safety is impossible — aim for resilient, not bulletproof', 'At some point, you\'ll need to take calculated risks to grow'],
          actionTip: 'Define your "security number" — the savings amount that would let you sleep soundly. Work toward it relentlessly. Once you hit it, give yourself permission to start taking smart growth risks.',
        },
      ],
    },
  },
}

// ════════════════════════════════════════════════════════════════════
// STUDY GUIDES
// ════════════════════════════════════════════════════════════════════

/** Map: moduleId → lessonNum → StudyGuideData */
export const STUDY_GUIDES: Record<string, Record<number, StudyGuideData>> = {
  '01-fresh-start': {
    2: {
      id: 'what-this-course-is',
      title: 'Study Guide: Course Overview',
      keyTerms: [
        { term: 'Chapter 7 Bankruptcy', definition: 'Liquidation bankruptcy — eligible debts are wiped clean. Most common form. Fresh start is immediate.' },
        { term: 'Chapter 13 Bankruptcy', definition: 'Reorganization bankruptcy — 3-5 year repayment plan, then remaining eligible debts are discharged.' },
        { term: 'Discharge', definition: 'The court order that officially eliminates your included debts. The legal fresh start.' },
        { term: 'Fresh Start', definition: 'The post-bankruptcy opportunity to rebuild your financial life with new knowledge and habits.' },
      ],
      keyTakeaways: [
        'Bankruptcy is a legal tool for recovery, not a character flaw',
        'This course is judgment-free — everyone starts from where they are',
        'Your chapter path (7 or 13) affects timelines but not your potential',
        'Small consistent actions create massive long-term change',
      ],
      actionItems: [
        'Write down your discharge date (you\'ll need it throughout the course)',
        'Set a weekly "course time" in your calendar',
        'Tell one trusted person you\'re taking this course (accountability helps)',
      ],
      proTip: 'You don\'t need to finish every module in order. If a topic feels urgent (like credit rebuilding), skip ahead — then come back to fill in gaps.',
    },
    5: {
      id: 'smart-goals',
      title: 'Study Guide: SMART Financial Goals',
      keyTerms: [
        { term: 'SMART Goals', definition: 'Specific, Measurable, Achievable, Relevant, Time-bound — the framework for goals that actually get accomplished.' },
        { term: 'Process Goals', definition: 'Goals focused on the actions you control (e.g., "save $200/month") rather than outcomes you can\'t fully control.' },
        { term: 'Milestone', definition: 'A smaller checkpoint within a larger goal that gives you a sense of progress and motivation.' },
      ],
      keyTakeaways: [
        'Vague goals ("save more money") almost never succeed',
        'SMART goals turn wishes into plans with deadlines',
        'Break big goals into monthly or weekly milestones',
        'Write your goals down — written goals are 42% more likely to be achieved',
      ],
      actionItems: [
        'Write 3 SMART financial goals for the next 6 months',
        'Break each goal into monthly milestones',
        'Post your goals somewhere you\'ll see them daily',
        'Schedule a monthly goal review (15 minutes, same day each month)',
      ],
      proTip: 'Start with just ONE goal. Master it, then add another. Multiple simultaneous goals compete for willpower.',
    },
  },
  '03-budgeting': {
    1: {
      id: 'why-budgets-fail',
      title: 'Study Guide: Why Budgets Fail',
      keyTerms: [
        { term: 'Deprivation Mindset', definition: 'When a budget feels like punishment, triggering the opposite behavior (overspending) as a coping mechanism.' },
        { term: 'Budget Shame Cycle', definition: 'Overspend → feel guilty → restrict harshly → feel deprived → overspend again. The cycle that kills most budgets.' },
        { term: 'Values-Based Budgeting', definition: 'Allocating money based on what genuinely matters to you, rather than arbitrary rules or guilt.' },
      ],
      keyTakeaways: [
        'The #1 reason budgets fail is they feel like deprivation',
        'A budget should reflect your values, not restrict your life',
        'Perfection is the enemy of progress — 80% adherence beats 0%',
        'The best budget is one you actually follow, whatever form it takes',
      ],
      actionItems: [
        'List your top 5 values (family, health, education, etc.)',
        'Check if your current spending aligns with those values',
        'Identify one area where spending and values are misaligned',
        'Choose a budgeting style from this lesson that fits your personality',
      ],
      proTip: 'If your budget doesn\'t include fun money, it will fail. Treat "enjoyment" as a non-negotiable category, not a luxury.',
    },
    4: {
      id: 'build-budget',
      title: 'Study Guide: The 50/30/20 Budget',
      keyTerms: [
        { term: '50/30/20 Rule', definition: '50% of after-tax income to needs, 30% to wants, 20% to savings/debt. A flexible framework, not a rigid rule.' },
        { term: 'Needs', definition: 'Expenses required for survival and basic functioning: housing, food, transportation, insurance, minimum debt payments.' },
        { term: 'Wants', definition: 'Everything that improves quality of life but isn\'t strictly necessary: dining out, entertainment, subscriptions, upgrades.' },
        { term: 'After-Tax Income', definition: 'Your take-home pay — what actually hits your bank account after taxes and mandatory deductions.' },
      ],
      keyTakeaways: [
        '50/30/20 is a starting point — adjust the ratios to fit your reality',
        'After bankruptcy, you might need 60/20/20 or even 70/10/20 temporarily',
        'The 20% savings category is non-negotiable — pay yourself first',
        'Review and adjust your budget monthly for the first 6 months',
      ],
      actionItems: [
        'Calculate your actual after-tax monthly income',
        'Categorize last month\'s spending into needs/wants/savings',
        'Identify the biggest "want" you could reduce or eliminate',
        'Set up automatic transfer of 20% to savings on payday',
      ],
    },
  },
  '05-emergency-fund': {
    1: {
      id: 'emergency-fund-basics',
      title: 'Study Guide: Emergency Fund Essentials',
      keyTerms: [
        { term: 'Emergency Fund', definition: 'Money set aside specifically for unexpected, urgent expenses — NOT for wants, planned expenses, or "good deals."' },
        { term: 'Slush Fund', definition: 'Money with no specific purpose that gets spent on whatever feels important. The opposite of an emergency fund.' },
        { term: 'Phase 1 Target', definition: '$1,000 — your initial emergency fund goal. Covers most single emergencies without debt.' },
        { term: 'Phase 2 Target', definition: '3-6 months of essential expenses. Full financial safety net for job loss or major crisis.' },
      ],
      keyTakeaways: [
        'An emergency fund is the #1 protection against relapsing into debt',
        'Start with $1,000 (Phase 1) before worrying about 3-6 months',
        'Keep it in a separate high-yield savings account — out of sight, out of mind',
        'Define what counts as an "emergency" BEFORE one happens',
      ],
      actionItems: [
        'Open a separate savings account labeled "Emergency Fund"',
        'Set up automatic transfer — even $25/week ($100/month)',
        'Write your personal emergency criteria (what qualifies?)',
        'Calculate your Phase 2 target (monthly essential expenses × 4)',
      ],
      proTip: 'The hardest part is the first $100. After that, watching the number grow becomes addictive in the best way.',
    },
  },
  '07-credit-rebuilding': {
    1: {
      id: 'credit-report-audit',
      title: 'Study Guide: Credit Report Audit',
      keyTerms: [
        { term: 'Credit Bureau', definition: 'Companies (Equifax, Experian, TransUnion) that collect your borrowing/payment history and generate credit reports.' },
        { term: 'Trade Line', definition: 'Any credit account on your report — credit cards, loans, mortgages, collections.' },
        { term: 'Hard Inquiry', definition: 'When a lender checks your credit for a lending decision. Stays on report 2 years, impacts score for 1 year.' },
        { term: 'Soft Inquiry', definition: 'Credit checks that don\'t affect your score — like checking your own report or pre-approval offers.' },
        { term: 'Dispute', definition: 'Formal request to a credit bureau to investigate and correct inaccurate information on your report.' },
      ],
      keyTakeaways: [
        'Pull FREE reports from AnnualCreditReport.com — it\'s the only official site',
        'Check ALL three bureaus — they often have different information',
        'Every discharged debt should show $0 balance and "discharged in bankruptcy"',
        'Dispute errors immediately — it\'s free and can significantly boost your score',
      ],
      actionItems: [
        'Pull your free credit reports from all 3 bureaus this week',
        'Check every account for: $0 balance, correct status, accurate dates',
        'List any errors found (use the audit worksheet from the lesson)',
        'File disputes for any errors within 7 days of finding them',
      ],
      proTip: 'Set a calendar reminder to pull your reports every 4 months, rotating bureaus: January (Equifax), May (Experian), September (TransUnion).',
    },
    3: {
      id: 'fico-factors',
      title: 'Study Guide: FICO Score Factors',
      keyTerms: [
        { term: 'FICO Score', definition: 'The most widely used credit score model. Ranges 300-850. Calculated from 5 weighted factors.' },
        { term: 'Payment History (35%)', definition: 'Whether you pay on time. Most important factor. Even one 30-day late payment can drop your score 50-100 points.' },
        { term: 'Credit Utilization (30%)', definition: 'How much of your available credit you\'re using. Under 10% is ideal, under 30% is good.' },
        { term: 'Credit Age (15%)', definition: 'Average age of all your accounts. Older is better. This is why you don\'t close old accounts.' },
        { term: 'Credit Mix (10%)', definition: 'Having different types of credit (revolving + installment). Variety shows lenders you can handle different products.' },
        { term: 'New Credit (10%)', definition: 'Recent applications and new accounts. Too many hard inquiries in a short time hurts your score.' },
      ],
      keyTakeaways: [
        'Payment history + utilization = 65% of your score. Focus here first.',
        'One perfect payment is worth more than any trick or hack',
        'Keep credit card balances under 10% of your limit for maximum score impact',
        'Time is your friend — average account age improves automatically',
      ],
      actionItems: [
        'Set up autopay for at least the minimum payment on every account',
        'Calculate your current utilization ratio',
        'If utilization is over 30%, make an extra payment mid-cycle',
        'Avoid any new credit applications for the next 6 months (unless strategic)',
      ],
    },
  },
  '02-money-story': {
    3: {
      id: 'money-narratives',
      title: 'Study Guide: Unpacking Your Money Story',
      keyTerms: [
        { term: 'Money Story', definition: 'The unconscious narrative about money that you absorbed from your family, culture, and life experiences. It drives your financial behavior.' },
        { term: 'Money Scripts', definition: 'Deeply held beliefs about money (e.g., "money is evil," "I\'ll never have enough") that operate below conscious awareness.' },
        { term: 'Financial Socialization', definition: 'How your family, community, and culture taught you about money — through words, actions, and unspoken rules.' },
        { term: 'Inherited Beliefs', definition: 'Money attitudes passed down through generations, often without anyone realizing they\'re being transmitted.' },
      ],
      keyTakeaways: [
        'Your money story was written BEFORE you had a say — now you get to rewrite it',
        'Money scripts aren\'t character flaws — they\'re survival strategies that may no longer serve you',
        'Recognizing inherited beliefs is the first step to choosing which ones to keep',
        'Bankruptcy doesn\'t define your money story — it\'s a chapter, not the whole book',
      ],
      actionItems: [
        'Write down 3 things your family taught you about money (spoken or unspoken)',
        'Identify which of those beliefs are helping you now and which are holding you back',
        'Replace one unhelpful money script with a new, chosen belief',
      ],
      proTip: 'Your money story has a narrator — and it\'s you. When you catch an old script playing ("I\'m bad with money"), pause and ask: "Is this MY belief, or one I inherited?"',
    },
    5: {
      id: 'rewriting-narrative',
      title: 'Study Guide: Rewriting Your Financial Narrative',
      keyTerms: [
        { term: 'Cognitive Reframing', definition: 'The practice of identifying negative thought patterns and consciously replacing them with more accurate, helpful ones.' },
        { term: 'Financial Identity', definition: 'How you see yourself in relation to money — "I\'m bad with money" vs. "I\'m learning to manage money well."' },
        { term: 'Growth Mindset (Financial)', definition: 'Believing your financial abilities can be developed through learning and practice, not fixed at birth.' },
      ],
      keyTakeaways: [
        'Your financial identity is not fixed — it evolves with every choice you make',
        'Changing "I am" statements ("I\'m broke") to "I\'m becoming" statements transforms your trajectory',
        'Every financial action, no matter how small, is evidence for your new story',
        'You don\'t need to forget the past — you need to stop letting it author your future',
      ],
      actionItems: [
        'Write your old money story in 3 sentences, then write your NEW money story in 3 sentences',
        'Create one "I\'m becoming" statement and post it where you\'ll see it daily',
        'Share your new narrative with someone you trust',
        'Start a weekly "evidence log" of financial wins that prove your new story is true',
      ],
    },
  },
  '04-envelope-system': {
    2: {
      id: 'cash-psychology',
      title: 'Study Guide: The Psychology of Cash',
      keyTerms: [
        { term: 'Pain of Paying', definition: 'The psychological discomfort of parting with money. Cash creates more "pain" than cards, which naturally reduces spending.' },
        { term: 'Payment Decoupling', definition: 'When the act of paying is separated from the act of consuming (like credit cards), spending feels "free" — which leads to overspending.' },
        { term: 'Denomination Effect', definition: 'People are less likely to spend a single $100 bill than five $20 bills, even though the value is identical.' },
        { term: 'Mental Accounting', definition: 'The tendency to treat money differently based on where it came from or what it\'s earmarked for (e.g., "fun money" vs. "bill money").' },
      ],
      keyTakeaways: [
        'Studies show people spend 12-18% less when paying with cash vs. cards',
        'The "pain of paying" is a feature, not a bug — it\'s natural spending protection',
        'Digital payments remove friction, which removes natural spending brakes',
        'Understanding cash psychology helps you design a system that works WITH your brain',
      ],
      actionItems: [
        'Try one week of cash-only spending for your highest-risk category (dining, shopping)',
        'Notice the difference in how you FEEL when paying cash vs. card',
        'Use the denomination effect: carry larger bills to slow down spending',
      ],
      proTip: 'You don\'t need to go fully cash-based. Even using cash for just your top 2 "overspend" categories can reduce total spending by 15%.',
    },
    4: {
      id: 'envelope-method',
      title: 'Study Guide: Building Your Envelope System',
      keyTerms: [
        { term: 'Envelope System', definition: 'A budgeting method where cash is physically divided into labeled envelopes for each spending category. When an envelope is empty, spending stops.' },
        { term: 'Variable Expenses', definition: 'Spending categories that change month to month (groceries, gas, entertainment) — ideal candidates for the envelope system.' },
        { term: 'Hybrid System', definition: 'Using cash envelopes for variable expenses while keeping digital payments for fixed bills — the modern approach.' },
        { term: 'Zero-Based Allocation', definition: 'Every dollar gets a "job" (assigned to a category) before the month begins. No unallocated money means no accidental spending.' },
      ],
      keyTakeaways: [
        'The envelope system works because it\'s visual, tangible, and self-enforcing',
        'Start with 3-5 envelopes maximum — too many categories defeats the purpose',
        'The hybrid approach (cash for variable, digital for fixed) is the modern standard',
        'When the envelope is empty, the spending is done — that\'s the whole system',
      ],
      actionItems: [
        'Choose 3-5 variable expense categories for your envelopes',
        'Calculate the monthly amount for each envelope based on your budget',
        'Set up a weekly cash withdrawal on the same day each week',
        'Track what\'s left in each envelope weekly — celebrate staying within limits',
      ],
    },
  },
  '06-healing': {
    1: {
      id: 'financial-trauma',
      title: 'Study Guide: Understanding Financial Trauma',
      keyTerms: [
        { term: 'Financial Trauma', definition: 'The lasting psychological impact of a severe financial event (bankruptcy, debt crisis, poverty). It affects behavior, emotions, and decision-making long after the event.' },
        { term: 'Financial Shame', definition: 'The deep belief that your financial difficulties reflect your worth as a person. Shame says "I AM bad" vs. guilt which says "I DID something bad."' },
        { term: 'Hypervigilance', definition: 'An anxiety response where you constantly monitor finances, check accounts obsessively, or feel unable to relax about money.' },
        { term: 'Financial Avoidance', definition: 'Coping by ignoring bills, statements, or financial tasks. The flip side of hypervigilance — both are trauma responses.' },
      ],
      keyTakeaways: [
        'Financial trauma is real and valid — your nervous system doesn\'t distinguish between financial threats and physical threats',
        'Shame thrives in secrecy and isolation. Sharing your story reduces its power.',
        'Both hypervigilance and avoidance are normal trauma responses — not character flaws',
        'Healing is not linear. Some days will be harder than others, and that\'s okay.',
      ],
      actionItems: [
        'Identify which trauma response you default to: hypervigilance or avoidance',
        'Practice one grounding technique when financial anxiety spikes (deep breathing, 5-4-3-2-1 senses)',
        'Write a compassion letter to yourself about your financial journey',
      ],
      proTip: 'If financial tasks trigger strong anxiety, try "body doubling" — do your finances alongside a trusted friend who\'s doing their own tasks. Shared presence reduces isolation.',
    },
    3: {
      id: 'rebuilding-trust',
      title: 'Study Guide: Rebuilding Self-Trust',
      keyTerms: [
        { term: 'Self-Trust', definition: 'The belief in your ability to make good financial decisions. Bankruptcy shatters this — rebuilding it is essential to lasting recovery.' },
        { term: 'Micro-Commitments', definition: 'Tiny, achievable financial promises you make to yourself. Each one kept rebuilds trust. "I will check my balance today" is enough.' },
        { term: 'Evidence-Based Confidence', definition: 'Building self-trust through accumulated proof of success, not just positive thinking.' },
        { term: 'Compassionate Accountability', definition: 'Holding yourself responsible for progress while being kind about setbacks. Tough love without the tough.' },
      ],
      keyTakeaways: [
        'Self-trust is rebuilt through small, kept promises — not grand gestures',
        'Every micro-commitment you keep is a deposit in your confidence account',
        'Setbacks don\'t erase progress — they\'re data points, not verdicts',
        'You trusted yourself enough to start this course. That counts.',
      ],
      actionItems: [
        'Make ONE tiny financial micro-commitment this week and keep it',
        'Start a "kept promises" list and add to it every time you follow through',
        'When you slip, practice saying: "That happened. Here\'s what I\'ll do differently."',
        'Celebrate one financial win from the past month — you have at least one',
      ],
    },
  },
  '08-predatory-traps': {
    2: {
      id: 'predatory-red-flags',
      title: 'Study Guide: Predatory Lending Red Flags',
      keyTerms: [
        { term: 'Predatory Lending', definition: 'Lending practices that impose unfair, deceptive, or abusive terms on borrowers. Often targets people with poor credit or financial distress.' },
        { term: 'APR (Annual Percentage Rate)', definition: 'The true yearly cost of borrowing, including interest and fees. A payday loan can exceed 400% APR.' },
        { term: 'Balloon Payment', definition: 'A large lump-sum payment due at the end of a loan. Used to make monthly payments look small while hiding the true cost.' },
        { term: 'Debt Trap Cycle', definition: 'When loan terms are designed so borrowers can never fully pay off the debt — they just keep rolling it over, paying more fees each time.' },
      ],
      keyTakeaways: [
        'Predatory lenders specifically target people post-bankruptcy — you are a prime target right now',
        '"Guaranteed approval" and "No credit check" are the biggest red flags',
        'Always calculate the TRUE cost of any loan: total payments minus principal = cost of borrowing',
        'If they pressure you to sign today, walk away. Legitimate lenders give you time.',
      ],
      actionItems: [
        'Memorize the top 5 red flags: guaranteed approval, no credit check, pressure to sign now, balloon payments, APR over 36%',
        'Calculate the total cost of any current loans you have (total payments over loan life)',
        'Save the Consumer Financial Protection Bureau complaint line: 855-411-2372',
      ],
      proTip: 'The "Triple Check" rule: before signing ANY financial product, check (1) the APR, (2) total cost over the life of the loan, and (3) reviews from real customers. If any one fails, walk away.',
    },
    4: {
      id: 'alternatives-to-predatory',
      title: 'Study Guide: Healthy Alternatives',
      keyTerms: [
        { term: 'Credit Union', definition: 'Member-owned financial institutions that often offer better rates and more flexible terms than traditional banks, especially for people rebuilding credit.' },
        { term: 'Payday Alternative Loan (PAL)', definition: 'A small, short-term loan from a credit union with capped fees and reasonable terms. The safe alternative to payday loans.' },
        { term: 'Negotiated Payment Plan', definition: 'An agreement with a service provider (mechanic, doctor, utility) to pay over time, often with zero interest.' },
        { term: '211 Helpline', definition: 'Dial 211 for free referrals to local financial assistance, utility help, food banks, and emergency resources.' },
      ],
      keyTakeaways: [
        'For every predatory product, there is a legitimate, affordable alternative',
        'Credit unions are often the best financial partner for people rebuilding after bankruptcy',
        'Most service providers will negotiate payment plans if you ask — the worst they can say is no',
        'Community resources (211, local nonprofits) exist specifically for financial emergencies',
      ],
      actionItems: [
        'Research and join a credit union this month (many have zero or low minimum balances)',
        'Save these emergency resources: 211 helpline, local United Way, CFPB.gov',
        'Practice this script: "I can\'t pay the full amount today. Can we set up a payment plan?"',
        'Create a personal "emergency alternatives" list before you need it',
      ],
    },
  },
  '09-income-growth': {
    2: {
      id: 'variable-income',
      title: 'Study Guide: Managing Variable Income',
      keyTerms: [
        { term: 'Variable Income', definition: 'Income that changes from month to month — common with gig work, freelancing, commissions, tips, and seasonal employment.' },
        { term: 'Baseline Budget', definition: 'A bare-minimum budget covering only essential needs, used as the foundation when income is unpredictable.' },
        { term: 'Income Smoothing', definition: 'Saving extra during high-income months to cover shortfalls during low-income months. Creates artificial stability.' },
        { term: 'Priority Spending List', definition: 'A ranked list of expenses: when income is low, you pay from the top down and stop when money runs out.' },
      ],
      keyTakeaways: [
        'Variable income requires a different budgeting approach than fixed income',
        'Always budget based on your LOWEST expected month, not your average',
        'Income smoothing turns feast-or-famine cycles into steady, manageable cash flow',
        'A priority spending list removes decision-making stress during low-income months',
      ],
      actionItems: [
        'Calculate your average monthly income over the past 6 months',
        'Identify your lowest-income month — build your baseline budget around that number',
        'Create a ranked priority spending list (rent first, then utilities, then food, etc.)',
        'Open a separate "income smoothing" savings account for high-income months',
      ],
      proTip: 'The "3-month buffer": aim to keep 3 months of baseline expenses in your smoothing account. This turns variable income into effective fixed income.',
    },
    5: {
      id: 'side-hustle-smart',
      title: 'Study Guide: Smart Side Hustles',
      keyTerms: [
        { term: 'Active Income', definition: 'Money earned by trading your time for dollars — hourly work, gig jobs, freelancing. Stops when you stop working.' },
        { term: 'Skill-Based Income', definition: 'Earning based on a specific skill (writing, coding, tutoring) that commands higher rates than general labor.' },
        { term: 'Tax Obligations', definition: 'Self-employment income requires quarterly estimated tax payments. Set aside 25-30% of side hustle earnings for taxes.' },
        { term: 'Opportunity Cost', definition: 'What you give up (rest, family time, skill development) in exchange for side hustle income. Always factor this in.' },
      ],
      keyTakeaways: [
        'The best side hustle is one that uses skills you already have',
        'Always account for taxes, expenses, and time when calculating true side hustle earnings',
        'Burnout from over-hustling can cost you your primary income — pace yourself',
        'Skill-based side hustles pay more per hour and build your long-term career value',
      ],
      actionItems: [
        'List 3 skills you have that others would pay for',
        'Research one skill-based platform relevant to your abilities (Upwork, Fiverr, Thumbtack, etc.)',
        'Calculate your true hourly rate: (gross earnings - expenses - taxes) / hours spent',
        'Set a weekly hour limit for side hustle work — protect your health and primary job',
      ],
    },
  },
  '10-road-map': {
    2: {
      id: 'major-purchases',
      title: 'Study Guide: Planning Major Purchases After Bankruptcy',
      keyTerms: [
        { term: 'Waiting Period', definition: 'Time after bankruptcy discharge before you can qualify for certain loans: 2 years (FHA), 3 years (USDA), 4 years (conventional mortgage).' },
        { term: 'Letter of Explanation', definition: 'A document lenders may request explaining your bankruptcy circumstances. Honest, forward-looking, and professional.' },
        { term: 'Debt-to-Income Ratio (DTI)', definition: 'Monthly debt payments divided by gross monthly income. Most lenders want this below 43% for mortgage approval.' },
        { term: 'Down Payment', definition: 'The upfront cash portion of a major purchase. Larger down payments mean better loan terms and lower monthly payments.' },
      ],
      keyTakeaways: [
        'Major purchases after bankruptcy are absolutely possible — with planning and patience',
        'Waiting periods are fixed by law — use that time to build credit and savings',
        'A strong Letter of Explanation shows maturity and accountability to lenders',
        'Every month of on-time payments and growing savings brings you closer to approval',
      ],
      actionItems: [
        'Look up the waiting period for your specific type of bankruptcy (Ch. 7 vs. Ch. 13)',
        'Calculate your current DTI ratio and your target DTI',
        'Start a draft of your Letter of Explanation — you\'ll refine it later in the module',
        'Set a monthly savings target for your major purchase down payment',
      ],
      proTip: 'Lenders care about the TREND as much as the score. Two years of steady improvement is more impressive than a high score with recent blemishes.',
    },
    5: {
      id: 'capstone-review',
      title: 'Study Guide: Your Financial Capstone',
      keyTerms: [
        { term: 'Financial Foundation', definition: 'The core elements of financial stability: emergency fund, budget, credit building, and income management — all working together.' },
        { term: 'Compound Progress', definition: 'How small financial improvements build on each other over time — each module\'s skills amplify the others.' },
        { term: 'Financial Resilience', definition: 'The ability to withstand and recover from financial setbacks. What you\'re building isn\'t just wealth — it\'s bounce-back ability.' },
        { term: 'Maintenance Mode', definition: 'The phase after active rebuilding where your systems run smoothly with periodic check-ins rather than daily effort.' },
      ],
      keyTakeaways: [
        'You now have a complete financial toolkit — budgeting, saving, credit, income, and protection',
        'The modules aren\'t separate skills — they form an interconnected system',
        'Maintenance mode is the goal: your financial life runs smoothly with monthly check-ins',
        'You\'ve already proven you can rebuild — the hardest part is behind you',
      ],
      actionItems: [
        'Complete your personalized 12-month roadmap using the capstone template',
        'Schedule monthly financial check-ins for the next year (15 minutes, same day each month)',
        'Identify your weakest area and plan one focused improvement this month',
        'Write a letter to your future self to open in one year — describe where you\'ll be',
      ],
      proTip: 'Graduation isn\'t the end — it\'s the beginning of maintenance mode. The skills you\'ve built are permanent. Trust your systems and trust yourself.',
    },
  },
}

// ════════════════════════════════════════════════════════════════════
// MODULE ASSESSMENTS
// ════════════════════════════════════════════════════════════════════

/** Map: moduleId → ModuleAssessmentData */
export const MODULE_ASSESSMENTS: Record<string, ModuleAssessmentData> = {
  '03-budgeting': {
    id: 'budgeting-assessment',
    moduleTitle: 'Budgeting Foundations',
    introText: 'This isn\'t a test — it\'s a mirror. Answer honestly to get personalized budgeting recommendations that work for YOUR situation.',
    dimensions: [
      { key: 'knowledge', label: 'Budget Knowledge', emoji: '📚' },
      { key: 'discipline', label: 'Spending Discipline', emoji: '🎯' },
      { key: 'awareness', label: 'Financial Awareness', emoji: '👁️' },
      { key: 'flexibility', label: 'Adaptability', emoji: '🌊' },
    ],
    questions: [
      {
        type: 'scenario',
        scenario: 'You\'re at the grocery store and realize you\'ve already spent your food budget for the week, but you need dinner ingredients. What do you do?',
        emoji: '🛒',
        options: [
          { text: 'Buy the cheapest possible ingredients and adjust next week\'s budget', insight: 'You prioritize sticking to the plan while being resourceful.', dimension: 'discipline', score: 8 },
          { text: 'Use money from another category — I\'ll eat less out to compensate', insight: 'You\'re flexible and think in terms of total monthly balance.', dimension: 'flexibility', score: 8 },
          { text: 'Just buy what I need — food is a necessity', insight: 'You prioritize needs, which is smart. But tracking where the overspend happened will prevent repeats.', dimension: 'awareness', score: 5 },
          { text: 'I\'m not sure — I don\'t really track my food spending that closely', insight: 'Starting to track even one category (food) can reveal patterns you didn\'t know existed.', dimension: 'knowledge', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'How confident are you in creating a monthly budget?', emoji: '📋', lowLabel: 'Not confident at all', highLabel: 'Very confident', dimension: 'knowledge' },
      {
        type: 'scenario',
        scenario: 'Your car insurance bill is $600, due in 6 months. How do you prepare?',
        emoji: '🚗',
        options: [
          { text: 'Set aside $100/month in a "sinking fund" starting now', insight: 'Sinking funds are the mark of a budgeting pro. You think ahead.', dimension: 'discipline', score: 9 },
          { text: 'Deal with it when it comes — I\'ll figure it out', insight: 'This approach creates the exact kind of "surprise" expenses that derail budgets. Planning ahead is the fix.', dimension: 'discipline', score: 3 },
          { text: 'I know about sinking funds but haven\'t set one up yet', insight: 'Knowledge without action is potential waiting to be unlocked. Start with this one bill.', dimension: 'knowledge', score: 6 },
          { text: 'Ask if I can pay monthly instead of lump sum', insight: 'Great instinct! Changing bill timing is a legitimate budget strategy — just watch for fees.', dimension: 'flexibility', score: 7 },
        ],
      },
      { type: 'rating', prompt: 'How well do you know where your money goes each month?', emoji: '🔍', lowLabel: 'No idea', highLabel: 'Down to the dollar', dimension: 'awareness' },
      {
        type: 'scenario',
        scenario: 'Your income drops unexpectedly by 20% next month. First move?',
        emoji: '📉',
        options: [
          { text: 'Immediately cut wants to zero and focus only on needs', insight: 'Quick decisive action. But don\'t forget to care for your mental health too.', dimension: 'discipline', score: 7 },
          { text: 'Review my budget and find the least painful 20% to cut', insight: 'Strategic cutting preserves quality of life while meeting the challenge.', dimension: 'flexibility', score: 9 },
          { text: 'Tap my emergency fund while I figure things out', insight: 'That\'s what it\'s for! Combine it with a reduced spending plan for maximum runway.', dimension: 'awareness', score: 7 },
          { text: 'Honestly, I\'d panic and wing it', insight: 'Having a plan BEFORE a crisis hits is the whole point of budgeting. This module will help.', dimension: 'knowledge', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'How well does your current spending align with what matters most to you?', emoji: '❤️', lowLabel: 'Not at all', highLabel: 'Perfectly aligned', dimension: 'awareness' },
    ],
    recommendations: [
      { minScore: 0, maxScore: 4, dimension: 'knowledge', title: 'Start with the Basics', description: 'You\'re early in your budgeting journey. That\'s perfectly okay — everyone starts here.', actionStep: 'This week: write down every expense for 7 days. Don\'t change anything — just observe.' },
      { minScore: 5, maxScore: 7, dimension: 'knowledge', title: 'Build on Your Foundation', description: 'You have good budgeting instincts. Now it\'s time to formalize them into a system.', actionStep: 'Choose ONE budgeting method from this module and commit to it for 30 days.' },
      { minScore: 8, maxScore: 10, dimension: 'knowledge', title: 'Level Up Your Strategy', description: 'You know your stuff! Focus on optimization and automation.', actionStep: 'Set up automatic bill pay and savings transfers. Your budget should run on autopilot.' },
      { minScore: 0, maxScore: 4, dimension: 'discipline', title: 'Build the Habit First', description: 'Spending discipline is a muscle — it gets stronger with practice.', actionStep: 'Try a 7-day "no unnecessary purchases" challenge. Just 7 days. You can do this.' },
      { minScore: 5, maxScore: 7, dimension: 'discipline', title: 'Strengthen Your Systems', description: 'You have good discipline most of the time. Systems will help you through the tough times.', actionStep: 'Identify your top 2 spending triggers and create a specific plan for each one.' },
      { minScore: 0, maxScore: 4, dimension: 'awareness', title: 'Start Tracking', description: 'Awareness is the first step to control. You can\'t manage what you don\'t measure.', actionStep: 'Download a spending tracker app or start a simple spreadsheet today.' },
      { minScore: 5, maxScore: 7, dimension: 'awareness', title: 'Deepen Your Awareness', description: 'You have a general sense of your finances. Time to get specific.', actionStep: 'At month-end, categorize every transaction. Look for the "surprise" categories.' },
      { minScore: 0, maxScore: 4, dimension: 'flexibility', title: 'Build an Emergency Buffer', description: 'When unexpected changes happen, having a buffer prevents panic.', actionStep: 'Add a "miscellaneous" category to your budget (5% of income). This absorbs surprises.' },
    ],
    overallMessages: [
      { range: [0, 30], title: 'Just Getting Started', message: 'You\'re at the beginning of your budgeting journey — and that\'s exactly where this module meets you. Every expert was once a beginner.', emoji: '🌱' },
      { range: [31, 55], title: 'Building Momentum', message: 'You have some good instincts and knowledge. This module will help you turn that potential into a consistent system.', emoji: '🔧' },
      { range: [56, 75], title: 'Solid Foundation', message: 'You\'re doing better than you think! Focus on the areas where you scored lower — those are your biggest growth opportunities.', emoji: '💪' },
      { range: [76, 100], title: 'Budget Ready', message: 'You have strong budgeting awareness and skills. Fine-tune your system and help others who are earlier in their journey.', emoji: '🌟' },
    ],
  },

  '07-credit-rebuilding': {
    id: 'credit-assessment',
    moduleTitle: 'Credit Rebuilding',
    introText: 'Discover your credit rebuilding readiness and get a personalized roadmap for the next 12 months.',
    dimensions: [
      { key: 'knowledge', label: 'Credit Knowledge', emoji: '📚' },
      { key: 'readiness', label: 'Action Readiness', emoji: '🚀' },
      { key: 'patience', label: 'Long-Term Thinking', emoji: '🎯' },
      { key: 'protection', label: 'Scam Awareness', emoji: '🛡️' },
    ],
    questions: [
      {
        type: 'scenario',
        scenario: 'A company guarantees they can remove your bankruptcy from your credit report for $800. What do you do?',
        emoji: '📬',
        options: [
          { text: 'Report them — that\'s a scam. Bankruptcies can\'t be removed if accurate.', insight: 'You know your rights and can spot predatory credit repair scams.', dimension: 'protection', score: 10 },
          { text: 'Research them first — some companies are legitimate', insight: 'Good instinct to verify, but know this: NO company can remove accurate bankruptcy records.', dimension: 'protection', score: 6 },
          { text: 'Consider it — $800 to fix my credit seems worth it', insight: 'Understandable temptation, but this is always a scam. Everything they claim to do, you can do for free.', dimension: 'protection', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'How well do you understand what factors make up your FICO score?', emoji: '📊', lowLabel: 'No idea', highLabel: 'I could teach it', dimension: 'knowledge' },
      {
        type: 'scenario',
        scenario: 'You\'ve had a secured credit card for 6 months with perfect payments. A store offers you a 28% APR store card. Apply?',
        emoji: '💳',
        options: [
          { text: 'No — store cards have terrible terms and the inquiry isn\'t worth it', insight: 'Smart move! You understand that not all credit is good credit.', dimension: 'knowledge', score: 9 },
          { text: 'Maybe — it would add to my credit mix', insight: 'Credit mix matters (10% of score), but a hard inquiry + bad terms isn\'t worth it. Wait for a better offer.', dimension: 'knowledge', score: 5 },
          { text: 'Yes — I need to build more credit history', insight: 'More accounts isn\'t always better. Focus on managing your current secured card perfectly first.', dimension: 'patience', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'How comfortable are you with the idea that credit rebuilding takes 12-24 months?', emoji: '⏳', lowLabel: 'Very impatient', highLabel: 'I\'m ready to commit', dimension: 'patience' },
      {
        type: 'scenario',
        scenario: 'You check your credit report and find an account you already paid off still showing a balance. Next step?',
        emoji: '🔍',
        options: [
          { text: 'File a dispute with all three bureaus immediately, with proof of payment', insight: 'This is the correct action and shows you know the dispute process.', dimension: 'readiness', score: 10 },
          { text: 'Call the creditor to sort it out', insight: 'Good first instinct, but filing with the bureaus creates a legal obligation to investigate within 30 days.', dimension: 'readiness', score: 6 },
          { text: 'It\'s a small amount — probably not worth the hassle', insight: 'Every error hurts your score. Disputes are free and can add 10-30 points. Always worth it.', dimension: 'readiness', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How ready are you to take your first credit rebuilding action this week?', emoji: '🏃', lowLabel: 'Not ready yet', highLabel: 'Let\'s go!', dimension: 'readiness' },
    ],
    recommendations: [
      { minScore: 0, maxScore: 4, dimension: 'knowledge', title: 'Credit Fundamentals First', description: 'Review lessons 7.2-7.3 on FICO scoring factors. Understanding the system is step one.', actionStep: 'This week: memorize the 5 FICO factors and their weights (35/30/15/10/10).' },
      { minScore: 5, maxScore: 7, dimension: 'knowledge', title: 'Apply What You Know', description: 'You understand the basics. Time to put that knowledge into action.', actionStep: 'Pull your credit reports and identify your weakest FICO factor. Target that one first.' },
      { minScore: 8, maxScore: 10, dimension: 'knowledge', title: 'Credit Expert Level', description: 'Your knowledge is solid. Focus on execution and patience.', actionStep: 'Create a 12-month credit rebuilding calendar with specific monthly goals.' },
      { minScore: 0, maxScore: 4, dimension: 'readiness', title: 'Start Small', description: 'You don\'t need to do everything at once. One small action builds momentum.', actionStep: 'Action 1: Pull your free credit report this week. That\'s it. Just look at it.' },
      { minScore: 5, maxScore: 7, dimension: 'readiness', title: 'Build Your Routine', description: 'You\'re ready to act. Set up a system so credit building happens automatically.', actionStep: 'Open a secured card this month and set up one recurring bill on autopay.' },
      { minScore: 0, maxScore: 4, dimension: 'patience', title: 'Reframe Your Timeline', description: 'Credit rebuilding is a marathon. The good news: the hardest part is the first 6 months.', actionStep: 'Write your "12-month credit vision" — where do you want your score in a year? Post it somewhere visible.' },
      { minScore: 0, maxScore: 4, dimension: 'protection', title: 'Scam-Proof Yourself', description: 'Review lesson 7.5 on credit repair scams. Knowledge is your best defense.', actionStep: 'Rule: if anyone GUARANTEES credit improvement, it\'s a scam. No exceptions.' },
    ],
    overallMessages: [
      { range: [0, 30], title: 'Starting Your Credit Journey', message: 'You\'re building from the ground up — and that\'s exactly the right place to be. This module gives you everything you need.', emoji: '🌱' },
      { range: [31, 55], title: 'Growing Confidence', message: 'You have a good foundation. Fill in the knowledge gaps and start taking consistent action.', emoji: '📈' },
      { range: [56, 75], title: 'Credit Rebuilder', message: 'You\'re well-equipped to rebuild your credit. Stay patient and consistent — the numbers will follow.', emoji: '💪' },
      { range: [76, 100], title: 'Credit Ready', message: 'You have strong credit knowledge and readiness. Execute your plan and watch your score climb month by month.', emoji: '🌟' },
    ],
  },

  '01-fresh-start': {
    id: 'fresh-start-assessment',
    moduleTitle: 'Your Fresh Start',
    introText: 'You\'ve completed the orientation. Let\'s see where you\'re starting from — so we can map the best path forward for YOU.',
    dimensions: [
      { key: 'emotional', label: 'Emotional Readiness', emoji: '💙' },
      { key: 'clarity', label: 'Financial Clarity', emoji: '🔍' },
      { key: 'motivation', label: 'Motivation & Drive', emoji: '🔥' },
      { key: 'support', label: 'Support System', emoji: '🤝' },
    ],
    questions: [
      {
        type: 'scenario',
        scenario: 'You\'re filling out a form and it asks: "Have you ever filed for bankruptcy?" How do you feel?',
        emoji: '📝',
        options: [
          { text: 'Uncomfortable but honest — I check "yes" without spiraling', insight: 'You\'ve started separating your identity from your financial history. That\'s emotional maturity.', dimension: 'emotional', score: 8 },
          { text: 'A wave of shame hits, but I push through it', insight: 'The shame is normal. The fact that you push through it shows real courage.', dimension: 'emotional', score: 6 },
          { text: 'I feel anxious and consider skipping the form entirely', insight: 'Avoidance is a natural protection mechanism. This course will help you face these moments with confidence.', dimension: 'emotional', score: 3 },
          { text: 'It doesn\'t bother me — it\'s just a fact about my past', insight: 'You\'ve reached a level of acceptance that many are still working toward. Strong foundation.', dimension: 'emotional', score: 10 },
        ],
      },
      { type: 'rating', prompt: 'How clearly do you understand your current financial situation (income, debts, monthly expenses)?', emoji: '📊', lowLabel: 'Very unclear', highLabel: 'Crystal clear', dimension: 'clarity' },
      {
        type: 'scenario',
        scenario: 'It\'s Sunday night and you remember you planned to review your finances this weekend. You didn\'t. What happens?',
        emoji: '🗓️',
        options: [
          { text: 'Reschedule for tomorrow and actually do it', insight: 'Accountability without guilt — the healthy middle ground.', dimension: 'motivation', score: 8 },
          { text: 'Feel guilty but tell myself I\'ll do it next weekend', insight: 'Good intentions are a start. Building routines will turn intention into action.', dimension: 'motivation', score: 4 },
          { text: 'Do a quick 10-minute check right now — something is better than nothing', insight: 'This "good enough" attitude is incredibly powerful. Consistency beats perfection every time.', dimension: 'motivation', score: 9 },
          { text: 'Honestly, I\'d forget about it until something forced me to look', insight: 'Financial avoidance is a common trauma response. Building small habits will change this pattern.', dimension: 'motivation', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How supported do you feel in your financial recovery (friends, family, community, professionals)?', emoji: '👥', lowLabel: 'Completely alone', highLabel: 'Strongly supported', dimension: 'support' },
      {
        type: 'scenario',
        scenario: 'A friend is going through financial trouble and asks for your advice. What do you do?',
        emoji: '💬',
        options: [
          { text: 'Share my experience openly — what I went through, what I learned', insight: 'Vulnerability is strength. Your willingness to share helps both of you heal.', dimension: 'support', score: 9 },
          { text: 'Listen and suggest they talk to a professional', insight: 'Knowing the limits of peer support shows wisdom. You\'re a thoughtful friend.', dimension: 'support', score: 7 },
          { text: 'Feel awkward — I\'m not sure my advice would be good', insight: 'Your experience has made you wiser than you think. This course will help you see that.', dimension: 'emotional', score: 4 },
          { text: 'Change the subject — I don\'t want to talk about finances with others', insight: 'Financial isolation is common but can slow your recovery. Start small — one trusted person.', dimension: 'support', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How confident are you that you can successfully rebuild your financial life?', emoji: '✨', lowLabel: 'Not confident', highLabel: 'Very confident', dimension: 'motivation' },
    ],
    recommendations: [
      { minScore: 0, maxScore: 4, dimension: 'emotional', title: 'Gentle Start', description: 'Your emotional foundation needs care before you sprint into financial tasks. That\'s not weakness — it\'s wisdom.', actionStep: 'This week: practice one self-compassion exercise from Module 6 (healing). Healing and building can happen in parallel.' },
      { minScore: 5, maxScore: 7, dimension: 'emotional', title: 'Growing Emotional Strength', description: 'You\'re processing your experience and building emotional resilience. Keep going.', actionStep: 'Write down 3 things bankruptcy taught you that you\'re grateful for. Reframing is powerful.' },
      { minScore: 8, maxScore: 10, dimension: 'emotional', title: 'Emotional Solid Ground', description: 'You\'ve done significant emotional work. Your stability is a superpower for the journey ahead.', actionStep: 'Consider being a peer support person for someone earlier in their journey. Teaching heals the teacher.' },
      { minScore: 0, maxScore: 4, dimension: 'clarity', title: 'Start with What You Know', description: 'Financial clarity begins with one number. You don\'t need the whole picture today.', actionStep: 'This week: find out your exact monthly take-home pay. That one number is your starting point.' },
      { minScore: 5, maxScore: 7, dimension: 'clarity', title: 'Fill in the Gaps', description: 'You have a general sense of your finances. Time to get specific.', actionStep: 'Track every expense for 7 days. No judgment — just observation. Awareness creates clarity.' },
      { minScore: 8, maxScore: 10, dimension: 'clarity', title: 'Clear-Eyed and Ready', description: 'You know exactly where you stand. That clarity is your competitive advantage.', actionStep: 'Create a one-page financial snapshot: income, expenses, debts, savings. Update it monthly.' },
      { minScore: 0, maxScore: 4, dimension: 'motivation', title: 'Find Your Why', description: 'Motivation starts with a reason that matters to YOU — not what anyone else thinks you should want.', actionStep: 'Complete this sentence: "I\'m rebuilding because ___." Post it where you\'ll see it every morning.' },
      { minScore: 5, maxScore: 7, dimension: 'motivation', title: 'Build Momentum', description: 'You have the spark. Now create systems that keep it lit on the hard days.', actionStep: 'Schedule your first 3 "financial task" blocks this week (15 minutes each). Small wins build big motivation.' },
      { minScore: 0, maxScore: 4, dimension: 'support', title: 'You\'re Not Alone', description: 'Building support is a financial strategy, not a personal weakness.', actionStep: 'Tell ONE trusted person about your financial goals this week. Just one. That\'s your starting support system.' },
    ],
    overallMessages: [
      { range: [0, 30], title: 'Beginning the Journey', message: 'You\'re here. You showed up. That alone puts you ahead of most people. This course meets you exactly where you are — no judgment, just support.', emoji: '🌱' },
      { range: [31, 55], title: 'Building Your Foundation', message: 'You have real strengths to build on. The areas where you scored lower are just your biggest opportunities for growth.', emoji: '🔨' },
      { range: [56, 75], title: 'Stronger Than You Think', message: 'You\'re coming into this course with meaningful emotional and practical readiness. Trust yourself — you have what it takes.', emoji: '💪' },
      { range: [76, 100], title: 'Ready to Thrive', message: 'You\'re not just ready to recover — you\'re ready to thrive. Use this course to accelerate what you\'ve already started.', emoji: '🌟' },
    ],
  },

  '05-emergency-fund': {
    id: 'emergency-fund-assessment',
    moduleTitle: 'Emergency Fund Foundations',
    introText: 'An emergency fund is the firewall between you and the next crisis. Let\'s see how ready you are to build one — and what might get in the way.',
    dimensions: [
      { key: 'readiness', label: 'Savings Readiness', emoji: '💰' },
      { key: 'mindset', label: 'Emergency Mindset', emoji: '🧠' },
      { key: 'planning', label: 'Crisis Planning', emoji: '📋' },
    ],
    questions: [
      {
        type: 'scenario',
        scenario: 'Your washing machine breaks. Repair cost: $250. You have $600 in your emergency fund. What do you do?',
        emoji: '🧺',
        options: [
          { text: 'Use the emergency fund — that\'s exactly what it\'s for, then plan to replenish', insight: 'Perfect response! Using the fund for genuine emergencies AND planning to replenish shows financial maturity.', dimension: 'mindset', score: 10 },
          { text: 'Use the fund but feel anxious about the balance dropping', insight: 'The anxiety is normal — it means you value the fund. But using it for real emergencies is the right call.', dimension: 'mindset', score: 7 },
          { text: 'Try to find a cheaper fix first, even if it\'s not ideal', insight: 'Resourceful! But don\'t let frugality create bigger problems. Sometimes paying for the proper fix saves money long-term.', dimension: 'planning', score: 6 },
          { text: 'Put it on a credit card — I don\'t want to touch my savings', insight: 'This is the trap the emergency fund is designed to prevent. Using the fund is ALWAYS better than new debt.', dimension: 'mindset', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'How confident are you that you could cover a $500 unexpected expense without borrowing?', emoji: '💵', lowLabel: 'Not at all', highLabel: 'Completely confident', dimension: 'readiness' },
      {
        type: 'scenario',
        scenario: 'You receive a $200 bonus at work. Your emergency fund isn\'t at $1,000 yet. What do you do?',
        emoji: '🎉',
        options: [
          { text: 'Put all $200 in the emergency fund — I\'m on a mission', insight: 'Strong discipline! Your emergency fund will be fully funded fast.', dimension: 'readiness', score: 9 },
          { text: 'Put $150 in savings, spend $50 on something I\'ve wanted', insight: 'The 75/25 split is a great balance. Rewarding yourself keeps the habit sustainable.', dimension: 'readiness', score: 8 },
          { text: 'Split it 50/50 between savings and spending', insight: 'A reasonable approach, though prioritizing the fund until it hits $1,000 will get you to safety faster.', dimension: 'readiness', score: 6 },
          { text: 'Treat myself — I deserve it after working hard', insight: 'You do deserve nice things. But building your emergency fund first means you can enjoy treats without guilt later.', dimension: 'readiness', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'How clear are you on what counts as a true "emergency" vs. a regular expense?', emoji: '🚨', lowLabel: 'Very unclear', highLabel: 'Crystal clear', dimension: 'mindset' },
      {
        type: 'scenario',
        scenario: 'Your hours get cut at work, reducing your income by 30% for the foreseeable future. First move?',
        emoji: '📉',
        options: [
          { text: 'Review my budget immediately, cut non-essentials, and calculate how long my emergency fund lasts', insight: 'Textbook crisis response. You\'re treating this like the manageable situation it is.', dimension: 'planning', score: 10 },
          { text: 'Start looking for additional income sources while reducing spending', insight: 'Excellent dual approach — reduce outflow AND increase inflow simultaneously.', dimension: 'planning', score: 9 },
          { text: 'Dip into the emergency fund and hope things improve', insight: 'Using the fund is right, but "hoping" isn\'t a plan. Pair it with a budget review and income strategy.', dimension: 'planning', score: 5 },
          { text: 'Panic and feel paralyzed about what to do first', insight: 'Financial emergencies trigger real stress. Having a plan BEFORE the crisis is why we build these skills now.', dimension: 'planning', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How likely are you to actually start (or continue) building an emergency fund this month?', emoji: '🏃', lowLabel: 'Very unlikely', highLabel: 'Already doing it', dimension: 'readiness' },
    ],
    recommendations: [
      { minScore: 0, maxScore: 4, dimension: 'readiness', title: 'Start with $25', description: 'Any amount starts the habit. The first dollar in your emergency fund matters more than the thousandth.', actionStep: 'Open a separate savings account today and set up an automatic $25/week transfer. That\'s $100/month and $1,200/year.' },
      { minScore: 5, maxScore: 7, dimension: 'readiness', title: 'Accelerate Your Savings', description: 'You\'re on the path. Now look for ways to speed up the journey.', actionStep: 'Challenge: find one expense to cut this month and redirect it entirely to your emergency fund.' },
      { minScore: 8, maxScore: 10, dimension: 'readiness', title: 'Savings Champion', description: 'Your saving habits are strong. Make sure the fund is properly structured.', actionStep: 'Move your emergency fund to a high-yield savings account if it isn\'t already. Every fraction of interest helps.' },
      { minScore: 0, maxScore: 4, dimension: 'mindset', title: 'Define Your Emergencies', description: 'Knowing what counts as an emergency prevents the fund from being drained by non-emergencies.', actionStep: 'Write down 5 things that ARE emergencies and 5 things that AREN\'T. Post the list on your fridge.' },
      { minScore: 5, maxScore: 7, dimension: 'mindset', title: 'Strengthen Your Emergency Boundaries', description: 'You generally know what emergencies are, but pressure moments can blur the lines.', actionStep: 'Create a "24-hour rule" for emergency fund withdrawals: wait 24 hours unless it\'s a true safety issue.' },
      { minScore: 0, maxScore: 4, dimension: 'planning', title: 'Build Your Crisis Playbook', description: 'A plan made during calm is 10x better than one made during crisis.', actionStep: 'Write a one-page "If My Income Drops" plan: what to cut first, who to call, what resources to tap.' },
      { minScore: 5, maxScore: 7, dimension: 'planning', title: 'Expand Your Safety Net', description: 'You have good crisis instincts. Formalize them into a written plan.', actionStep: 'Create a ranked expense list: if money gets tight, what goes first, second, third? Decide now, not later.' },
    ],
    overallMessages: [
      { range: [0, 30], title: 'Building the Foundation', message: 'An emergency fund starts with a decision, not a dollar amount. You\'ve made the decision by being here. Now let\'s build.', emoji: '🌱' },
      { range: [31, 55], title: 'Growing Your Safety Net', message: 'You understand why an emergency fund matters and you\'re building the habits to create one. Stay consistent — momentum is on your side.', emoji: '🛡️' },
      { range: [56, 75], title: 'Solid Protection', message: 'Your emergency fund mindset is strong. Focus on the practical steps to fully fund your $1,000 Phase 1 target.', emoji: '💪' },
      { range: [76, 100], title: 'Emergency Ready', message: 'You have the knowledge, mindset, and habits to build and maintain a strong emergency fund. You\'re building real financial resilience.', emoji: '🌟' },
    ],
  },

  '09-income-growth': {
    id: 'income-growth-assessment',
    moduleTitle: 'Income Growth Strategies',
    introText: 'Rebuilding isn\'t just about spending less — it\'s about earning more. Let\'s see where your income growth potential is strongest.',
    dimensions: [
      { key: 'earning', label: 'Earning Potential', emoji: '💰' },
      { key: 'strategy', label: 'Income Strategy', emoji: '🎯' },
      { key: 'resilience', label: 'Income Resilience', emoji: '🛡️' },
      { key: 'growth', label: 'Growth Mindset', emoji: '📈' },
    ],
    questions: [
      {
        type: 'scenario',
        scenario: 'You learn that a coworker in the same role earns 15% more than you. What do you do?',
        emoji: '💼',
        options: [
          { text: 'Research market rates and schedule a meeting with my manager to discuss compensation', insight: 'Proactive, data-driven, and professional. This is exactly how successful negotiations start.', dimension: 'earning', score: 10 },
          { text: 'Feel frustrated but assume there\'s nothing I can do about it', insight: 'Pay gaps are often fixable. Assuming they aren\'t leaves money on the table. Data and preparation change the equation.', dimension: 'earning', score: 3 },
          { text: 'Start looking for a better-paying job elsewhere', insight: 'Sometimes leaving IS the right move. But negotiating first costs nothing and might surprise you.', dimension: 'strategy', score: 6 },
          { text: 'Use it as motivation to improve my skills so I can justify asking for more', insight: 'Investing in yourself is always smart. But don\'t wait — you may already deserve more than you\'re getting.', dimension: 'growth', score: 7 },
        ],
      },
      { type: 'rating', prompt: 'How confident are you in your ability to increase your income in the next 12 months?', emoji: '📈', lowLabel: 'Not confident', highLabel: 'Very confident', dimension: 'growth' },
      {
        type: 'scenario',
        scenario: 'Your main source of income suddenly disappears (job loss, client loss, etc.). How prepared are you?',
        emoji: '🚨',
        options: [
          { text: 'I have multiple income streams — losing one hurts but doesn\'t devastate me', insight: 'Income diversification is the ultimate financial safety net. You\'ve built real resilience.', dimension: 'resilience', score: 10 },
          { text: 'I have savings to cover me while I find something new', insight: 'Your emergency fund buys you time — which is the most valuable resource in a job search.', dimension: 'resilience', score: 7 },
          { text: 'I\'d immediately start hustling — gig apps, freelancing, anything', insight: 'Your action-taking instinct is valuable. Having a plan before the crisis makes that hustle more efficient.', dimension: 'resilience', score: 5 },
          { text: 'I\'d be in serious trouble — I depend entirely on one income source', insight: 'Single-income dependency is risky. Even a small side income stream adds meaningful protection.', dimension: 'resilience', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How many marketable skills do you have that could generate income outside your primary job?', emoji: '🧰', lowLabel: 'None that I know of', highLabel: 'Several — I have options', dimension: 'strategy' },
      {
        type: 'scenario',
        scenario: 'A friend suggests you start freelancing your skills on the side. Your reaction?',
        emoji: '💡',
        options: [
          { text: 'I\'ve already thought about it — let me research the right platform', insight: 'Initiative plus research is a powerful combination. You\'re ready to take the leap.', dimension: 'strategy', score: 9 },
          { text: 'Sounds interesting but I\'m not sure anyone would pay for my skills', insight: 'Imposter syndrome is lying to you. If your employer pays for your skills, others will too.', dimension: 'growth', score: 4 },
          { text: 'I\'d need to learn more before I could offer anything', insight: 'Growth mindset! But don\'t underestimate what you already know. Start with what you have, improve as you go.', dimension: 'growth', score: 6 },
          { text: 'I don\'t have time — I\'m already stretched thin', insight: 'Time is a real constraint. Focus on increasing your hourly rate (skills, negotiation) rather than adding more hours.', dimension: 'earning', score: 5 },
        ],
      },
      { type: 'rating', prompt: 'How actively are you working to increase your income right now?', emoji: '🏃', lowLabel: 'Not at all', highLabel: 'Actively pursuing growth', dimension: 'earning' },
    ],
    recommendations: [
      { minScore: 0, maxScore: 4, dimension: 'earning', title: 'Unlock Your Earning Power', description: 'Your income has room to grow — and the strategies don\'t require working more hours.', actionStep: 'This month: research what your role pays in your market (Glassdoor, PayScale). Knowledge is leverage.' },
      { minScore: 5, maxScore: 7, dimension: 'earning', title: 'Maximize Current Income', description: 'You\'re aware of your earning potential. Time to capture more of it.', actionStep: 'Prepare for a raise conversation: list your accomplishments, research market rates, and practice your ask.' },
      { minScore: 8, maxScore: 10, dimension: 'earning', title: 'Income Optimizer', description: 'You\'re actively growing your income. Keep diversifying and building.', actionStep: 'Focus on passive or semi-passive income: what asset, skill, or system could earn money while you sleep?' },
      { minScore: 0, maxScore: 4, dimension: 'strategy', title: 'Discover Your Options', description: 'You have more income options than you realize. Let\'s uncover them.', actionStep: 'List every skill you use at work and at home. Ask 3 people: "What am I good at?" Their answers might surprise you.' },
      { minScore: 5, maxScore: 7, dimension: 'strategy', title: 'Sharpen Your Strategy', description: 'You see income opportunities. Now focus on the ones with the best return on your time.', actionStep: 'Calculate your effective hourly rate for each income source. Double down on the highest-paying one.' },
      { minScore: 0, maxScore: 4, dimension: 'resilience', title: 'Build Income Backup', description: 'Depending on a single income source is a vulnerability. Even small diversification helps.', actionStep: 'Goal: create one additional income source within 60 days, even if it\'s just $200/month.' },
      { minScore: 0, maxScore: 4, dimension: 'growth', title: 'Believe in Your Value', description: 'You have more to offer than you think. Bankruptcy doesn\'t reduce your professional worth.', actionStep: 'Write down 5 skills or qualities that make you valuable. Read them when doubt creeps in.' },
      { minScore: 5, maxScore: 7, dimension: 'growth', title: 'Invest in Yourself', description: 'Your growth mindset is developing. Feed it with targeted learning.', actionStep: 'Identify the ONE skill that would increase your income most. Dedicate 3 hours/week to building it.' },
    ],
    overallMessages: [
      { range: [0, 30], title: 'Income Foundations', message: 'You\'re starting to think about income growth — and that shift in thinking is the first step. This module will show you concrete paths forward.', emoji: '🌱' },
      { range: [31, 55], title: 'Growing Your Earning Power', message: 'You have awareness and some strategies in place. Focus on taking one income-growing action this month.', emoji: '📈' },
      { range: [56, 75], title: 'Income Builder', message: 'You\'re actively working to grow your income. Keep refining your strategy and building multiple streams.', emoji: '💪' },
      { range: [76, 100], title: 'Income Growth Champion', message: 'Your income strategy is strong and diversified. You\'re building not just recovery — you\'re building prosperity.', emoji: '🌟' },
    ],
  },

  '10-road-map': {
    id: 'road-map-assessment',
    moduleTitle: 'Your Financial Road Map',
    introText: 'You\'ve reached the final module. This assessment isn\'t about what you know — it\'s about who you\'ve become. Let\'s see how far you\'ve come and where you\'re headed.',
    dimensions: [
      { key: 'preparedness', label: 'Future Preparedness', emoji: '🗺️' },
      { key: 'confidence', label: 'Financial Confidence', emoji: '💎' },
      { key: 'integration', label: 'Skills Integration', emoji: '🔗' },
      { key: 'vision', label: 'Long-Term Vision', emoji: '🔮' },
    ],
    questions: [
      {
        type: 'scenario',
        scenario: 'You\'re applying for an apartment and the landlord asks about your bankruptcy. How do you handle it?',
        emoji: '🏠',
        options: [
          { text: 'Explain honestly, show proof of financial improvement, and offer references', insight: 'This is the gold standard response. Honesty + evidence of change is incredibly persuasive.', dimension: 'confidence', score: 10 },
          { text: 'Share my Letter of Explanation and hope they understand', insight: 'Having a Letter of Explanation prepared is great. Pairing it with concrete evidence makes it stronger.', dimension: 'confidence', score: 7 },
          { text: 'Feel nervous and hope they don\'t dig too deep', insight: 'The nervousness is normal, but preparation reduces it. Your Letter of Explanation is your tool for this exact moment.', dimension: 'confidence', score: 4 },
          { text: 'Avoid applying to places that do credit checks', insight: 'Avoidance limits your options. With preparation, you can face credit checks with confidence.', dimension: 'confidence', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How well could you explain the 5 FICO factors and how to optimize each one?', emoji: '📊', lowLabel: 'I\'d struggle', highLabel: 'I could teach a class', dimension: 'integration' },
      {
        type: 'scenario',
        scenario: 'You\'re considering buying a car in 18 months. Walk through your preparation plan.',
        emoji: '🚗',
        options: [
          { text: 'Build credit now, save for a down payment, research rates for my score range, pre-qualify before shopping', insight: 'Comprehensive, strategic, and patient. You\'re thinking like a financial professional.', dimension: 'preparedness', score: 10 },
          { text: 'Start saving for a down payment and check my credit score regularly', insight: 'Good foundation — add rate research and pre-qualification to make this plan airtight.', dimension: 'preparedness', score: 7 },
          { text: 'Save what I can and hope my credit improves enough by then', insight: 'Hope is not a strategy. This module will help you build a specific, actionable plan.', dimension: 'preparedness', score: 4 },
          { text: 'I\'m not sure how to plan that far ahead for a major purchase', insight: 'That\'s exactly what this module teaches. By the end, you\'ll have a clear roadmap.', dimension: 'preparedness', score: 2 },
        ],
      },
      { type: 'rating', prompt: 'How confident are you that you could handle a major unexpected expense without going into debt?', emoji: '🛡️', lowLabel: 'Not confident', highLabel: 'Fully prepared', dimension: 'integration' },
      {
        type: 'scenario',
        scenario: 'A friend asks you to co-sign a loan for them. What\'s your response?',
        emoji: '✍️',
        options: [
          { text: 'Decline respectfully — I know co-signing puts my rebuilding credit at risk', insight: 'Protecting your credit recovery is not selfish — it\'s essential. You understand the stakes.', dimension: 'integration', score: 10 },
          { text: 'Consider it carefully, weighing the relationship against the financial risk', insight: 'Thoughtful analysis. But after bankruptcy, the financial risk almost always outweighs the relationship pressure.', dimension: 'integration', score: 6 },
          { text: 'Feel guilty but probably say yes — I don\'t want to hurt the friendship', insight: 'Boundary-setting is hard but necessary. Your financial recovery has to come first right now.', dimension: 'confidence', score: 3 },
        ],
      },
      { type: 'rating', prompt: 'Looking at the next 5 years, how clearly can you see your financial future?', emoji: '🔮', lowLabel: 'Very foggy', highLabel: 'Crystal clear roadmap', dimension: 'vision' },
    ],
    recommendations: [
      { minScore: 0, maxScore: 4, dimension: 'preparedness', title: 'Build Your Roadmap', description: 'Major purchases need a specific plan — and this module will help you create one.', actionStep: 'Write down ONE major purchase goal and its target date. Work backward to identify what you need each month.' },
      { minScore: 5, maxScore: 7, dimension: 'preparedness', title: 'Sharpen Your Plan', description: 'You\'re thinking ahead. Add specifics to turn your general plan into an actionable roadmap.', actionStep: 'For your top financial goal, write down: target date, monthly savings needed, credit score required, and specific next step.' },
      { minScore: 8, maxScore: 10, dimension: 'preparedness', title: 'Ready for Major Moves', description: 'Your preparation game is strong. Stay the course and execute.', actionStep: 'Start pre-qualifying for your next major purchase to see exactly where you stand.' },
      { minScore: 0, maxScore: 4, dimension: 'confidence', title: 'Build Your Confidence Story', description: 'Your Letter of Explanation and financial evidence file are your confidence tools.', actionStep: 'Draft your Letter of Explanation this week using the module template. Practice reading it aloud.' },
      { minScore: 5, maxScore: 7, dimension: 'confidence', title: 'Own Your Narrative', description: 'You\'re building confidence. Each interaction where you advocate for yourself makes the next one easier.', actionStep: 'Practice your "financial story" with someone you trust: what happened, what you learned, where you\'re going.' },
      { minScore: 0, maxScore: 4, dimension: 'integration', title: 'Connect the Dots', description: 'The modules work together as a system. Revisit the areas that feel weakest.', actionStep: 'Identify your weakest module topic and spend 30 minutes reviewing it this week. Connections will click.' },
      { minScore: 5, maxScore: 7, dimension: 'integration', title: 'Strengthen Your System', description: 'You\'re connecting the skills. Practice using them together in real-world scenarios.', actionStep: 'Run a "financial fire drill": simulate a $500 emergency and walk through your response using all your skills.' },
      { minScore: 0, maxScore: 4, dimension: 'vision', title: 'Paint Your Future', description: 'A clear vision pulls you forward. Take time to imagine where you want to be.', actionStep: 'Write a "Day in My Life — 5 Years From Now" journal entry in detail. Make it vivid and specific.' },
      { minScore: 5, maxScore: 7, dimension: 'vision', title: 'Focus Your Vision', description: 'You see possibilities. Now turn vision into milestones.', actionStep: 'Break your 5-year vision into annual goals. What needs to happen in Year 1? Year 2? Make it concrete.' },
    ],
    overallMessages: [
      { range: [0, 30], title: 'Beginning a New Chapter', message: 'You\'ve completed an entire financial rebuilding course. That alone puts you in a small, determined group of people who refused to give up. Every skill in this course is now available to you — revisit any module anytime.', emoji: '🌱' },
      { range: [31, 55], title: 'Growing Into Your New Financial Self', message: 'You\'ve built real knowledge and started developing new habits. The gap between where you are and where you want to be is smaller than you think. Keep building, one step at a time.', emoji: '🔨' },
      { range: [56, 75], title: 'Financially Resilient', message: 'You\'ve transformed how you think about, manage, and plan your finances. You\'re not just recovering — you\'re building something stronger than what came before.', emoji: '💪' },
      { range: [76, 100], title: 'Ready to Thrive', message: 'You came here after one of life\'s hardest financial moments. Now you have the knowledge, tools, confidence, and vision to build a financial life you\'re proud of. This isn\'t the end — it\'s your beginning.', emoji: '🎓' },
    ],
  },
}
