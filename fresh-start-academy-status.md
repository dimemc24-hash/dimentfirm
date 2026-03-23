# Fresh Start Academy — Development Status Report

**Date:** February 26, 2026
**Project Location:** `D:\Apps_for_Git\course-app\`
**Source Materials:** `C:\Users\Viccar\Downloads\diment-firm-website\course\` (24 documents)

---

## Executive Summary

Fresh Start Academy is a 40-hour, gamified, web-based financial recovery course for post-discharge bankruptcy clients. It features dual learning paths (Chapter 7 / Chapter 13), two mascot companions (Hariette the Hare and Sheldon the Tortoise), 7 interactive games, and a Stripe-powered paywall with free trial access.

**Content is ~85% complete. The application is ~15% scaffolded. The critical remaining work is fixing content alignment issues and building out the web application.**

---

## Phase Completion Status

| Phase | Description | Status | Notes |
|-------|-------------|--------|-------|
| 1. Course Architect | Blueprint & structure design | COMPLETE | 10 modules, 48 lessons, 7 games, ~38 badges |
| 2. Section Builders | Write all module content | COMPLETE | 551KB across 10 module files (13,000+ lines) |
| 3. Critic Review | Quality review & revisions | COMPLETE | ~50 issues found, all addressed |
| 4. Final Review | Holistic quality gate | COMPLETE | 5 MUST FIX, 9 SHOULD FIX, 7 NICE TO HAVE |
| 5. App Architecture | Technical design | COMPLETE | React/Vite + Supabase + Stripe + Vercel |
| 6. App Build | Code the application | PARTIAL | 26 files scaffolded, most pages are stubs |
| 7. Integration & QA | Assembly and testing | NOT STARTED | — |

---

## Content: What's Written

All 10 modules have complete lesson content:

| Module | Title | Lessons | Time | Content Size |
|--------|-------|---------|------|-------------|
| 1 | Welcome to Your Fresh Start | 6 | 3.0 hr | 1,056 lines |
| 2 | Your Money Story | 6 | 4.0 hr | 1,467 lines |
| 3 | Budgeting Foundations | 6 | 5.0 hr | 1,543 lines |
| 4 | Cash-Based Living & Envelopes | 5 | 3.5 hr | 1,083 lines |
| 5 | Building Your Emergency Fund | 6 | 3.5 hr | 1,104 lines |
| 6 | Healing Your Relationship with Money | 4 | 1.25 hr | 594 lines |
| 7 | Credit Rebuilding | 7 | 5.0 hr | 1,559 lines |
| 8 | Avoiding Predatory Traps | 5 | 3.5 hr | 1,437 lines |
| 9 | Income Growth & Gig Economy | 6 | 4.5 hr | 1,593 lines |
| 10 | Your 12-Month Financial Road Map | 6 | 4.5 hr | 1,601 lines |
| **Total** | | **57 lessons** | **~37.75 hr** | **13,037 lines** |

Each module includes:
- Full instructional text for every lesson
- Quiz questions with answers
- Reflection/check-in prompts
- Interactive exercise specifications
- Mascot dialogue (Hariette for Ch.7, Sheldon for Ch.13)
- XP values and badge criteria
- Game design documents (where applicable)

---

## Games: 7 Interactive Simulations

| # | Game | Module | Mechanic | Status |
|---|------|--------|----------|--------|
| 1 | **The Belief Trap** | 2 | Identify & reframe toxic money beliefs in scenarios | Designed, not coded |
| 2 | **Budget Crisis** | 3 | Navigate monthly budget with random emergencies | Designed, not coded |
| 3 | **Envelope Challenge** | 4 | Balance saving vs. spending over 30 simulated days | Designed, not coded |
| 4 | **Savings Sprint** | 5 | Protect growing emergency fund from temptations | Designed, not coded |
| 5 | **Credit Score Simulator** | 7 | Make decisions to rebuild credit score to 650+ | Designed, not coded |
| 6 | **Predatory Lending Detector** | 8 | Sort predatory vs. legitimate financial offers | Designed, not coded |
| 7 | **Gig Economy Simulator** | 9 | Earn enough through gigs to cover monthly bills | Designed, not coded |

All games have complete design documents (rules, mechanics, scoring, scenarios, replayability hooks, React component specs). None have been implemented as code yet.

---

## Gamification System

**XP Economy:**
- Lesson completion: 100 XP | Quiz question correct: 10 XP | Reflection: 50 XP
- Mini-game completion: 150 XP | Major game: 300 XP | Module completion bonus: 500 XP

**10 Levels:** Fresh Start (0 XP) through Master of Your Money (45,000 XP)

**~38 Badges** across categories:
- 10 module completion badges
- 12 skill badges (Goal Setter, Budget Builder, Credit Auditor, etc.)
- 6 game achievement badges (Belief Breaker, Crisis Manager, Side Hustle Pro, etc.)
- 4 special badges (Brave Heart, Letter Writer, Course Graduate, Commitment Keeper)
- 6 streak badges (3-day through 90-day)

**Streaks:** Daily engagement tracking with mascot encouragement (never guilt)

**Module Progression:** Sequential unlock — complete Module N to unlock Module N+1. Completed modules and games freely replayable via "Arcade" section.

---

## Dual-Path System (Chapter 7 / Chapter 13)

**Mascots:**
- **Hariette the Hare** (Chapter 7) — Energetic, forward-looking. "Your debts are behind you — let's build something new!"
- **Sheldon the Tortoise** (Chapter 13) — Steady, disciplined. "You showed years of discipline. That's your superpower now."

**How it works:**
- ~83% of content is shared between both paths
- 8 of 48 lessons have chapter-specific variations
- Mascot dialogue splits ~80% shared / ~20% path-specific
- Games adapt scenarios to chapter context (Ch.7 starts from zero, Ch.13 transitions off payment plan)
- Users select their path at signup (or it's pre-set via invite link from the firm)

---

## Application: What's Built

**Tech stack (chosen by architecture agent):**
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Auth/DB: Supabase (Auth + PostgreSQL + Row-Level Security)
- Payments: Stripe (subscriptions, webhooks, customer portal)
- State: Zustand
- Hosting target: Vercel

**Files created (26 source files):**

```
src/
  App.tsx                          — Root app component
  main.tsx                         — Entry point
  router.tsx                       — React Router route tree
  lib/
    cn.ts                          — Tailwind class utility
    supabase.ts                    — Supabase client
  components/
    layout/AppShell.tsx            — Main layout wrapper
  pages/
    Landing.tsx                    — Public landing page (38 lines)
    Login.tsx                      — Login page (stub, 11 lines)
    Register.tsx                   — Registration page (stub, 11 lines)
    Invite.tsx                     — Invite link handler (stub, 14 lines)
    Dashboard.tsx                  — Learner dashboard (112 lines — most built-out)
    Module.tsx                     — Module view (stub, 14 lines)
    Lesson.tsx                     — Lesson view (stub, 14 lines)
    Game.tsx                       — Game view (stub, 14 lines)
    Badges.tsx                     — Badge collection (stub, 11 lines)
    Billing.tsx                    — Billing/subscription (stub, 11 lines)
    Profile.tsx                    — User profile (stub, 11 lines)
    Settings.tsx                   — User settings (stub, 11 lines)
    NotFound.tsx                   — 404 page (stub, 11 lines)
    admin/
      AdminLayout.tsx              — Admin panel layout (14 lines)
      Invites.tsx                  — Invite management (stub, 10 lines)
      Clients.tsx                  — Client progress view (stub, 10 lines)
      Analytics.tsx                — Engagement analytics (stub, 10 lines)
```

**What's NOT built yet:**
- Auth flow (signup, login, email verification, invite link handling)
- Stripe integration (trial, subscription, webhooks)
- Supabase database schema
- Course content renderer (markdown to interactive lessons)
- Mascot dialogue system (path-switching, avatar display)
- Progress tracking (XP, badges, streaks)
- Any of the 7 games
- Quiz/exercise interactive components
- Admin panel functionality
- Responsive/mobile design

---

## Outstanding Issues (from Final Review)

### MUST FIX (5 — blocks MVP)

1. **Module 1 Lesson 1.2** — Course structure table describes a wrong 8-module course, not the actual 10 modules. Lists "20-25 hours" instead of ~38 hours.
2. **Module 1 Lesson 1.6** — Module preview descriptions reference entirely different modules that don't exist in the course.
3. **Module 1 Lesson 1.6 Quiz** — Questions reference wrong module numbers (e.g., says credit reports are in "Module 4" — should be Module 7).
4. **XP Totals Inconsistent** — Module content files calculate XP differently from the blueprint. Reflections are sometimes 50 XP, sometimes 75 XP. Module 7 header says 1,150 XP but summary says 1,250 XP.
5. **Badge Count Mismatch** — Blueprint lists 32 badges but actual content awards a different number. Some badges mentioned in blueprint don't appear in content and vice versa.

### SHOULD FIX (9 — improves quality)

6. Module 6 timing estimate (75 min) is too tight — should be 90-120 min
7. Module 9 "Next Up" footer references wrong module name
8. Module 8 "Next Up" footer references wrong module name
9. Module 1 closing incorrectly previews Module 2's content
10. No banking module — gap for clients who are unbanked post-discharge
11. Mascot dialogue format inconsistent across modules (3 different formats used)
12. Tax information in Module 9 needs date-specific disclaimer
13. Modules 2-3-4 are 12.5 hours back-to-back — needs pacing note
14. Credit card recommendations in Module 7 will become outdated — needs date stamp

### NICE TO HAVE (7)

15. No post-course follow-up mechanism (30/90/180/365-day check-ins)
16. No accessibility considerations documented (screen readers, alt text)
17. Game design docs embedded in content files — should be separated
18. No insurance basics coverage
19. Minor redundancy: emergency fund concept in both Modules 3 and 5
20. Mascot personalities converge in later modules (Modules 7-10)
21. Pre/post assessment questions don't match for valid comparison

---

## Learner Journey: How Someone Proceeds Through the Course

### Onboarding

1. **Receive invite link** from the firm (or self-register at the public URL)
2. **Create account** — email + password, select Chapter 7 or Chapter 13 path (or "I'm here to learn" for non-clients)
3. **Enter payment info** — credit card collected via Stripe Elements
4. **Free trial begins** — 14 days for self-registrants, up to 90 days for firm-invited clients
5. **Meet your mascot** — Hariette (Ch.7) or Sheldon (Ch.13) greets you on your dashboard

### Module 1: Welcome to Your Fresh Start (~3 hours)

**The emotional foundation.** This is where the course earns trust.

- **Lesson 1.1 — You Made It Through:** Validates the bankruptcy journey. Path-specific: Hariette celebrates the clean slate, Sheldon honors the years of discipline. Establishes that this is a safe space.
- **Lesson 1.2 — What This Course Is (And Isn't):** Sets expectations. This is education, not therapy or legal advice. Explains the gamification system, time commitment, and what completion looks like.
- **Lesson 1.3 — Your Financial Check-In:** Baseline assessment adapted from CFPB materials. 15 questions measuring financial confidence, knowledge, and emotional relationship with money. Results are private — used for your own before/after comparison at graduation.
- **Lesson 1.4 — Understanding Your Discharge:** Path-specific deep dive. Ch.7: what "discharge" means legally, what debts were eliminated, what may have survived. Ch.13: what completing the repayment plan means, what was preserved, how the discharge differs.
- **Lesson 1.5 — Setting Your SMART Goals:** Interactive exercise writing 3 financial goals (short-term, medium-term, long-term) using the SMART framework. Badge earned: "Goal Setter."
- **Lesson 1.6 — Meet Your Financial Toolkit:** Preview of all 10 modules and what you'll learn. Mini-quiz to test engagement.

**Badges available:** Fresh Start (complete module), Goal Setter (write 3 goals)

### Module 2: Your Money Story (~4 hours)

**Understanding your financial psychology.** Before we teach tools, we understand patterns.

- **Lesson 2.1 — Where Your Money Beliefs Come From:** How childhood, family, culture, and trauma shaped your relationship with money.
- **Lesson 2.2 — The Money Timeline Exercise:** Interactive guided exercise creating a personal timeline of key financial memories from childhood to present. Identifies patterns.
- **Lesson 2.3 — Toxic Money Scripts:** The 4 major toxic money scripts (Money Avoidance, Money Worship, Money Status, Money Vigilance) with quiz to identify your dominant scripts.
- **Lesson 2.4 — Scarcity vs. Abundance Mindset:** Path-specific — Ch.7 addresses "starting from nothing" scarcity; Ch.13 addresses "years of restriction" scarcity.
- **Lesson 2.5 — Rewriting Your Financial Narrative:** Guided narrative reconstruction exercise. Write your old money story, then rewrite it with agency and self-compassion.
- **Lesson 2.6 — The Belief Trap Game:** First major game. Encounter financial scenarios that trigger toxic beliefs. Identify the belief, choose a healthier response, see consequences. 20+ randomized scenarios, multiple difficulty levels.

**Badges available:** Story Rewriter (complete timeline + narrative), Belief Breaker (80%+ on Belief Trap game)

### Module 3: Budgeting Foundations (~5 hours)

**The practical core.** This is where learners build their first real budget.

- **Lesson 3.1 — Why Budgets Fail (And How Yours Won't):** Common failure patterns and the principles that make budgets stick.
- **Lesson 3.2 — Calculating Your Real Income:** Interactive exercise. Path-specific: Ch.13 addresses transitioning from court-managed to self-managed income.
- **Lesson 3.3 — The 50/30/20 Blueprint:** The post-bankruptcy adaptation of the 50/30/20 rule applied to the learner's own numbers.
- **Lesson 3.4 — Needs vs. Wants vs. Savings:** Interactive sorting exercise with 20+ common expenses. Encouraging feedback for both correct and incorrect answers.
- **Lesson 3.5 — Building Your First Budget:** Step-by-step guided exercise creating a working monthly budget using real numbers.
- **Lesson 3.6 — Budget Crisis Game:** Major game. Monthly budget simulation with random emergencies (car breakdown, medical bill, job loss). Decisions cascade — skipping a bill means late fees and credit impact. 10+ scenario combinations, 3 difficulty tiers. Ch.7 starts from zero savings; Ch.13 transitions off court-managed budget.

**Badges available:** Budget Builder (complete first budget), Crisis Manager (score B+ on Budget Crisis), Needs vs. Wants Master (perfect sorting score)

### Module 4: Cash-Based Living & The Envelope System (~3.5 hours)

**Tactical spending control.** Cash as a power tool, not a limitation.

- The psychology of spending cash vs. card (the "pain of paying" research)
- Step-by-step envelope system setup with personalized categories
- Strategies for when envelopes run empty
- Digital alternatives (banking sub-accounts, budgeting apps)
- **Envelope Challenge Game:** 30-day simulation balancing saving vs. spending

**Badges available:** Cash Commander (complete envelope setup), Envelope Champion (hit savings target in game)

### Module 5: Building Your Emergency Fund (~3.5 hours)

**Financial safety net.** Framed as self-care, not deprivation.

- Why emergency funds prevent relapse into debt cycles
- True emergencies vs. "slush fund" spending (16 scenario exercise)
- Creating a personalized $1,000 starter fund plan
- Setting up automated savings (walkthrough)
- Where to keep emergency funds (high-yield savings, CDs comparison)
- **Savings Sprint Game:** 6-month simulation protecting growing fund from temptations and emergencies

**Badges available:** Emergency Fund Started (complete $1,000 plan), Savings Streak (7-day streak)

### Module 6: Healing Your Relationship with Money (~75-120 minutes)

**The emotional midpoint.** A supportive pause at the center of the course.

This is the dedicated psychological module — intentionally shorter and slower. No quizzes. No games. No scoring pressure. Just reflection and healing.

- **Lesson 6.1 — Financial Shame: You Are Not Your Debt:** The neuroscience of shame. Separating self-worth from net worth. Path-specific: Ch.7 addresses "losing everything" shame; Ch.13 addresses exhaustion of years under restriction.
- **Lesson 6.2 — Your Identity After Bankruptcy:** Guided reflection on who you are beyond the bankruptcy. Ch.7: "Who am I now that the debts are gone?" Ch.13: "Who am I without the payment plan defining my life?"
- **Lesson 6.3 — Money, Relationships, and Boundaries:** How to talk about finances with partners, family, friends. Setting boundaries. Handling judgment.
- **Lesson 6.4 — Rebuilding Self-Trust with Money:** Concrete self-trust practices: small financial commitments, evidence collection, self-compassion routines. Actionable coping strategies.

**Badge available:** Brave Heart (complete all 4 reflections). XP is for presence only.

### Module 7: Credit Rebuilding (~5 hours)

**Reclaiming financial power.** Framed as rebuilding agency, not seeking approval.

- The 90-day credit report audit (pull and verify all 3 bureaus)
- How FICO scores actually work (the 35/30/15/10/10 breakdown)
- Secured credit card comparison and selection
- Credit builder loans and authorized user strategy
- Writing a dispute letter for post-bankruptcy errors
- Credit utilization optimization exercise
- **Credit Score Simulator Game:** Major game. Start with a ~520 post-bankruptcy score. Make monthly decisions (pay in full? apply for new credit? utilization %) and watch real-time score impact. Goal: reach 650+ in 12 simulated months. Ch.7 starts at ~500; Ch.13 starts at ~540.

**Badges available:** Credit Auditor, Dispute Pro, Score Builder (reach 650), Credit Master (reach 700)

### Module 8: Avoiding Predatory Traps (~3.5 hours)

**Building an immune system.** Empowerment, not fear.

- Why post-bankruptcy consumers are targeted
- The predatory players: payday lenders, buy-here-pay-here lots, title lenders, subprime mortgage traps
- 10+ red flags (guaranteed approval, loan flipping, equity stripping, pressure tactics)
- Calculating true APR and total loan cost
- **Predatory Lending Detector Game:** Major game. Sort incoming mail — loan offers, credit cards, auto financing — into Legitimate/Predatory/Needs Research. Subtle traps. 40+ offers in the database.

**Badges available:** Trap Spotter (90%+ on game), APR Calculator (100% on APR exercise)

### Module 9: Income Growth & The Gig Economy (~4.5 hours)

**Expanding possibilities.** Side hustles as empowerment, not desperation.

- Managing variable and irregular income
- The baseline income method (lowest-earning-month calculation)
- Realistic side hustle evaluation (honest time/money tradeoffs)
- Gig economy opportunities AND pitfalls (taxes, benefits gaps, volatility)
- Cash flow budgeting for irregular income
- **Gig Economy Simulator Game:** Major game. $1,500 monthly expense target, no steady paycheck. Choose daily from available gigs (rideshare $15-25/hr, delivery $12-20/hr, lawn care $20-30/hr, freelancing $50-100/project). Each gig has realistic pay, time cost, startup costs, and physical toll. Complications: gas costs, weather, late-paying clients, burnout meter. Goal: cover all bills without borrowing.

**Badges available:** Side Hustle Pro, Income Architect, Cash Flow Master

### Module 10: Your 12-Month Financial Road Map (~4.5 hours)

**The capstone.** From learner to architect of your financial future.

- Life after bankruptcy: renting, buying, financing timelines. Path-specific: Ch.7 FHA mortgage at 2 years; Ch.13 at 1 year post-discharge.
- Writing a professional Letter of Explanation (for landlords/lenders)
- Major financial decision frameworks
- **Capstone Project: 12-Month Road Map** — the final project. Month-by-month plan covering budget, savings targets, credit milestones, income growth, and behavioral commitments.
- Signing a personal commitment contract
- **Graduation:** Repeat the baseline assessment from Module 1. Compare before/after. Mascot delivers personalized graduation message. Full stats review: XP earned, badges collected, games played, streaks.

**Badges available:** Road Map Ready, Letter Writer, Commitment Keeper, Course Graduate

### Post-Course

- Subscription maintains access to all content, games (Arcade section), and their personal data
- 14-day free trial for self-registrants / up to 90 days for firm-invited clients
- After trial expiry: monthly subscription via Stripe to maintain access
- Credential sharing mitigated via concurrent session limits

---

## What Needs to Happen Next

### Immediate (Content Fixes)
1. Fix Module 1 course structure tables and quiz references (MUST FIX #1-3)
2. Audit and standardize all XP calculations across all 10 modules (MUST FIX #4)
3. Create master badge registry and reconcile with content (MUST FIX #5)
4. Standardize mascot dialogue format across all modules (SHOULD FIX #11)
5. Fix all "Next Up" footer references (SHOULD FIX #7-9)

### Application Build
6. Implement Supabase database schema (users, progress, badges, streaks, sessions)
7. Build auth system (signup, login, invite links, chapter path selection)
8. Integrate Stripe (trial, subscription, webhooks, card collection at signup)
9. Build course content renderer with mascot path-switching
10. Implement progress tracking (XP, badges, streaks, module unlock)
11. Build all 7 games as React components
12. Build admin panel (invite management, client progress, subscription overrides)
13. Mobile-first responsive design
14. Integration testing and QA

---

*Report generated February 26, 2026*
