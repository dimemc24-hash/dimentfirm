# OpenClaw Master Task: Post-Discharge Financial Recovery Course

## Mission

Build a complete, production-ready web-based financial recovery course for bankruptcy clients who have received their discharge. The course must be 40 hours of coursework, deeply gamified, psychologically informed, and delivered as a self-contained web application with authentication and Stripe-powered paywall (14-day free trial, credit card required at signup).

The source material for this course is located in: `C:\Users\Viccar\Downloads\diment-firm-website\course\`
(24 documents exported from the owner's NotebookLM research library — docx and csv files)

NotebookLM reference (for context, may not be directly accessible): https://notebooklm.google.com/notebook/90288bad-6488-4580-bcee-149cd90c1dd8

---

## Course Mascots & Dual-Path System

The course serves two distinct client populations. Each has a dedicated mascot character with existing artwork:

### Hariette the Hare — Chapter 7 Guide
- **Image:** `C:\Users\Viccar\Downloads\diment-firm-website\public\hariette_hare_final.png`
- **Character:** Energetic, optimistic, wearing bright sneakers — ready to hit the ground running
- **Represents:** Chapter 7 clients who received a full discharge and are starting fresh with a clean slate
- **Personality in course:** Encouraging, forward-looking, celebrates the fresh start. "You made it through — now let's build something amazing."
- **Chapter 7 context:** These clients had qualifying debts wiped out entirely. They may have lost some assets in the process. Their path is about rebuilding credit, establishing new financial habits from scratch, and learning to trust themselves with money again.

### Sheldon the Tortoise — Chapter 13 Guide
- **Images:**
  - `C:\Users\Viccar\Downloads\diment-firm-website\public\sheldon_tortoise_final.png` (with hard hat and gavel)
  - `C:\Users\Viccar\Downloads\diment-firm-website\public\sheldon_tortoise_adorable_worker_1772080468357.png` (with G&P Law hard hat, tools, and blueprints)
  - `C:\Users\Viccar\Downloads\diment-firm-website\public\art turtle.png` (casual/cute variant)
- **Character:** Steady, methodical, wears a hard hat and carries tools — always building, always progressing
- **Represents:** Chapter 13 clients who completed a 3-5 year repayment plan and earned their discharge
- **Personality in course:** Patient, proud of perseverance, focused on the long game. "You stuck with a plan for years — that takes incredible discipline. Let's put that discipline to work for YOUR future now."
- **Chapter 13 context:** These clients demonstrated years of committed repayment. They kept more assets but lived on restricted budgets for 3-5 years. Their path involves transitioning from court-mandated budgeting to self-directed financial management, and healing from years of financial restriction.

### How the Dual-Path Works in the Course:

1. **At signup**, users select whether they completed Chapter 7 or Chapter 13 (or allow the firm's invite link to pre-set this).
2. **Core content is shared** — 90%+ of lessons apply to both groups.
3. **Path-specific variations** appear as:
   - Mascot dialogue/tips (Hariette speaks to Ch.7 learners, Sheldon speaks to Ch.13 learners)
   - Contextual examples (Ch.7: "Now that your debts are discharged..." vs. Ch.13: "After years of your repayment plan...")
   - 2-3 lessons per module that swap or adjust content based on path (e.g., credit rebuilding timelines differ)
   - Different starting emotional framing (fresh start vs. marathon finish line)
4. **Games adapt** — scenarios reference the learner's chapter context where relevant
5. **The mascot appears throughout** as a companion: in lesson sidebars, game UI, achievement celebrations, streak reminders, and the dashboard. They should feel like a friendly guide, not a gimmick.

---

## Agent Architecture & Workflow

You will orchestrate this project using the following agent roles and phases. Do NOT skip phases. Each phase must complete before the next begins, except where parallelism is explicitly specified.

---

### PHASE 1: Course Architect Agent

**Role:** Lead strategist. Reads ALL source materials thoroughly before doing anything else.

**Tasks:**
1. Ingest every document in `C:\Users\Viccar\Downloads\diment-firm-website\course\` completely. Do not skim. Key documents include:
   - "The Post-Bankruptcy Curriculum_ From Healing to Financial Resilience.docx" — likely the master curriculum reference
   - "Mastering Financial Resilience Through Strategic Gamification.docx" — gamification strategy
   - "Mastering the Gig Economy_ Financial Volatility Simulations.docx" — gig simulator design source
   - "Healing the Scars of Financial Trauma.docx" and "Radical Self-Compassion and the Path to Financial Healing.docx" — psychological component
   - "The Financial Restoration and Empowerment Compendium.docx" — comprehensive reference
   - Plus 18 more documents covering budgeting, credit rebuilding, predatory lending, envelope budgeting, emergency savings, and assessment metrics
2. Identify the major themes, topics, practical skills, and psychological dimensions present in the research.
3. Design a comprehensive course outline targeting 40 hours of total learner engagement (content + interactive exercises + games).
4. Structure the course into modules and lessons. Each module should be a coherent unit. Aim for 8-12 modules, each containing 3-6 lessons. Identify which lessons need Chapter 7 vs. Chapter 13 content variations and flag them in the blueprint.
5. Place a dedicated (but concise) module on financial trauma, shame, and psychological recovery at approximately the midpoint of the course. This should NOT be the first place these themes appear — weave psychological awareness and trauma-informed language throughout every module from the start. Reference the research in "Healing the Scars of Financial Trauma.docx" and "Radical Self-Compassion and the Path to Financial Healing.docx" heavily for this.
5a. Design the mascot integration plan: where Hariette and Sheldon appear, what kinds of things they say, how their dialogue differs by chapter path. The mascots should feel like companions on the journey — they celebrate wins, offer encouragement during hard topics, provide tips in game UIs, and appear on the dashboard. They are NOT lecturers.
6. For each lesson, specify:
   - Learning objectives (what the learner can DO after completing it)
   - Content type (instructional text, interactive exercise, quiz, game/simulation, reflection prompt)
   - Estimated engagement time
   - Gamification elements (points, badges, unlocks, streaks, challenges)
7. Identify where full interactive games/simulations should be placed. At minimum, include:
   - A "Gig Economy Simulator" — an interactive game where players face income shortfall scenarios and choose from real side-hustle options (rideshare driving, food delivery, lawn care, freelance work, selling items, etc.) to close the gap WITHOUT borrowing. The game should model realistic earnings, time costs, and tradeoffs. Make it replayable with varying scenarios.
   - A "Budget Crisis" scenario game — players get a monthly budget and must navigate unexpected expenses (car repair, medical bill, job loss) using the skills taught in the course. Score based on decisions.
   - At least 2-3 additional games/simulations that emerge naturally from the source material and course structure.
8. Define the gamification system:
   - XP points for completing lessons, exercises, and games
   - Achievement badges for milestones (e.g., "Budget Builder," "Emergency Fund Started," "Debt-Free Thinker," "Side Hustle Pro")
   - Progress streaks for consecutive daily engagement
   - Module unlock progression (complete Module N to unlock Module N+1, but allow replaying completed modules and games freely)
   - A learner dashboard showing progress, XP, badges, streak, and module map
9. Output a complete, detailed course blueprint document.

---

### PHASE 2: Section Builder Agents (PARALLEL)

**Role:** Content creators. One agent per module. Run in parallel.

**Instructions for ALL Section Builder agents:**

1. You will receive the course blueprint AND the relevant source materials for your assigned module.
2. Write complete lesson content for every lesson in your module. This is not an outline — write the actual instructional content, exercises, quiz questions (with answers), reflection prompts, and game/simulation specifications.
3. Content voice and tone:
   - Warm, non-judgmental, empowering. Never condescending.
   - Acknowledge that bankruptcy is not a moral failing. Many clients are coming from medical debt, job loss, divorce, or predatory lending.
   - Use plain language. Assume no financial background. Define every term on first use.
   - Include real examples and scenarios. Use diverse names and situations.
   - Normalize struggle. Celebrate small wins.
   - Write mascot dialogue for BOTH Hariette (Ch.7) and Sheldon (Ch.13) throughout. Each lesson should include 2-4 mascot moments (tips, encouragement, celebrations). Where the chapter context doesn't matter, both mascots can say the same thing. Where it does, write path-specific dialogue. Format mascot dialogue clearly so the content renderer can swap based on user path.
4. Psychological integration (EVERY module):
   - Open each module with a brief "check-in" reflection (e.g., "How are you feeling about your finances today? No wrong answers.")
   - Acknowledge the emotional weight of the topic before diving into mechanics
   - Include at least one "You're not alone" sidebar per module with anonymized statistics or common experiences
   - Frame every skill as regaining control and agency, not as penance
5. Gamification integration:
   - Specify exact XP values for each activity
   - Define any badges earnable in this module
   - Include at least one scored challenge or mini-game per module
   - Write encouraging feedback for both correct and incorrect quiz answers (no shaming)
6. For the dedicated psychological recovery module (mid-course):
   - Cover: financial shame, identity after bankruptcy, impact on relationships, anxiety about the future, rebuilding self-trust with money
   - Include guided reflection exercises
   - Provide actionable coping strategies (not just "it gets better")
   - This module should feel like a supportive pause, not a lecture
   - Keep it focused — 60-90 minutes of engagement, not a full-length module
7. For game/simulation lessons:
   - Write a complete game design document: rules, mechanics, scoring, scenarios, UI/UX description, win/loss conditions, replayability hooks
   - The game must be implementable as a browser-based interactive (React component)
   - Games should be genuinely fun and replayable, not just dressed-up quizzes
8. Output format: Complete lesson content in structured markdown with clear metadata headers for each lesson.

---

### PHASE 3: Critic Agent (SEQUENTIAL — iterates with Section Builders)

**Role:** Rigorous quality reviewer. Operates with high standards. Does NOT rubber-stamp.

**Process — repeat for EACH module:**

1. Read the module content thoroughly.
2. Evaluate against ALL of the following criteria, scoring each 1-5:
   - **Accuracy:** Is the financial/legal information correct? Flag anything questionable.
   - **Completeness:** Does it cover what the blueprint specified? Any gaps?
   - **Clarity:** Would someone with no financial background understand this? Any jargon left undefined?
   - **Engagement:** Is this interesting? Would someone actually want to read/do this? Be honest.
   - **Psychological sensitivity:** Is the tone trauma-informed throughout? Any moments that could feel judgmental or shaming, even subtly?
   - **Gamification quality:** Are the game elements genuinely motivating or do they feel tacked on? Are XP values balanced?
   - **Practical value:** Will completing this module actually help someone manage their finances better?
   - **Game design (where applicable):** Is the game fun? Replayable? Educational? Implementable?
3. For ANY criterion scoring below 4: write specific, actionable revision instructions. Not vague ("make it better") — specific ("Lesson 3.2 paragraph 4 uses the term 'amortization' without defining it. Add a plain-language definition and a concrete example.").
4. Return the module to its Section Builder agent with revision instructions.
5. Re-review revised content. Repeat until ALL criteria score 4 or above.
6. When a module passes: mark it as "Critic Approved" and forward to Phase 4.

**Critic rules:**
- You must find at least 3 substantive improvements on the first pass of every module. If you cannot, you are not looking hard enough.
- Do not accept "good enough." The standard is: would you be comfortable handing this to someone going through one of the hardest financial experiences of their life?
- Pay special attention to the games. A boring game is worse than no game — it signals that the course doesn't respect the learner's time.

---

### PHASE 4: Final Reviewer Agent (SEQUENTIAL — after Critic approval)

**Role:** Executive quality gate. Reviews with a critical, fresh eye. Assumes the Critic may have missed things or gotten too close to the content.

**Process:**

1. Read ALL Critic-Approved modules as a complete course, in order.
2. Evaluate holistically:
   - **Flow:** Does the course progress logically? Do later modules build on earlier ones?
   - **Consistency:** Is the tone consistent across modules written by different agents? Any jarring shifts?
   - **Pacing:** Is the 40-hour target realistic given the content volume? Any modules that drag or feel rushed?
   - **Gamification balance:** Is the XP/badge economy balanced across the full course? Can someone earn most badges in Module 1 and have nothing to work toward later?
   - **Psychological arc:** Does the emotional journey make sense? Does the mid-course trauma module land at the right moment — after enough trust is built but before the hardest practical content?
   - **Redundancy:** Are any concepts repeated unnecessarily across modules?
   - **Gaps:** Is there anything a recently-discharged bankruptcy client would need to know that is NOT covered?
   - **Game portfolio:** Do the games offer variety? Different mechanics, different skills tested?
3. Write a detailed review report. For each issue found, specify:
   - Which module/lesson is affected
   - What the problem is
   - What the fix should be
   - Priority: MUST FIX (blocks MVP) vs. SHOULD FIX (improves quality) vs. NICE TO HAVE
4. All MUST FIX items go back to the relevant Section Builder agents, then back through the Critic.
5. SHOULD FIX items go back to Section Builders (Critic re-review optional but recommended).
6. Sign off only when: zero MUST FIX items remain, and you are confident this course would genuinely help someone rebuild their financial life after bankruptcy.

---

### PHASE 5: Application Architecture Agent

**Role:** Senior full-stack architect. Designs the technical implementation.

**Tasks:**

1. Design the web application architecture:
   - **Frontend:** React (Vite), modern component architecture
   - **Styling:** Tailwind CSS for rapid, responsive UI
   - **Auth:** Secure authentication system supporting:
     - Invite links (firm sends client a unique signup URL, can pre-set Chapter 7 or 13 path and extended trial duration)
     - Self-registration (for non-clients like family members — they choose their path at signup or select "I'm here to learn" neutral path)
     - Email + password with email verification
   - **Payments:** Stripe integration
     - 14-day free trial for all new accounts
     - Credit card required at signup (collected via Stripe Elements)
     - After trial: monthly subscription to maintain access
     - Firm-invited clients: configurable extended free period (e.g., 90 days) — the firm can set this per-invite
     - Grace period handling: what happens when payment fails (gentle reminders, then access suspension, never data deletion)
   - **Database:** Choose appropriate DB (Supabase/Firebase/Postgres — recommend based on simplicity and cost for a small firm)
   - **Hosting:** Recommend deployment target (Vercel, Railway, etc.)
   - **Content delivery:** Course content can be stored as structured data in the DB or as static assets — architect should decide
2. Design the learner dashboard:
   - Course progress map (visual module progression)
   - XP counter and level indicator
   - Badge collection display
   - Daily streak tracker
   - "Continue where you left off" prominent CTA
   - Game arcade section (replay any unlocked game)
   - Mascot presence: Hariette or Sheldon appears on the dashboard with contextual messages (greeting, streak encouragement, milestone celebrations). Use the character images from `/public/`.
   - Chapter path indicator (subtle — not stigmatizing, just personalizes the experience)
3. Design the admin panel (for the firm):
   - Generate and manage invite links
   - View client progress (which modules completed, engagement metrics)
   - Manage subscription overrides (extend free trial, comp access, etc.)
   - Content should NOT be editable from admin panel at MVP (too complex)
4. Design the game engine approach:
   - Games as self-contained React components
   - Shared scoring/XP integration layer
   - State persistence (save game progress)
   - Scenario data stored as JSON for easy updates
5. Security considerations:
   - Prevent credential sharing (concurrent session limits or device fingerprinting)
   - Secure API routes
   - PII handling (these are bankruptcy clients — extra sensitivity required)
   - HTTPS only
6. Output a complete technical architecture document with file structure, data models, API routes, and component hierarchy.

---

### PHASE 6: Application Builder Agents (PARALLEL where possible)

**Role:** Full-stack developers. Build the actual application.

**Sub-agents:**

**6A: Core Infrastructure Agent**
- Set up the project scaffold (React + Vite + Tailwind)
- Implement auth system (signup, login, invite link handling, email verification)
- Implement Stripe integration (trial, subscription, webhook handling)
- Set up database schema and ORM/client
- Build API routes
- Implement session management and credential-sharing prevention

**6B: Learner Experience Agent**
- Build the learner dashboard with mascot integration (Hariette for Ch.7 users, Sheldon for Ch.13)
- Build the course content renderer that:
  - Transforms structured content into interactive lessons
  - Swaps mascot dialogue and path-specific content based on user's chapter selection
  - Renders mascot avatar alongside their dialogue using the character images from `/public/`
- Implement the progress tracking system (XP, badges, streaks, module completion)
- Build the quiz/exercise interactive components
- Build the reflection/check-in UI
- Build the module navigation and unlock system

**6C: Game Development Agent**
- Build each game/simulation as a standalone React component
- Implement the Gig Economy Simulator with:
  - Multiple income shortfall scenarios (randomized)
  - Real-world gig options with realistic pay rates and time requirements
  - Decision tree with consequences
  - Scoring and replay
  - Mascot as in-game coach (Hariette or Sheldon offers tips during gameplay)
- Implement the Budget Crisis game
- Implement all other games specified in the blueprint
- Integrate games with the XP/badge system
- Ensure games are mobile-responsive
- Games should use chapter-appropriate scenarios where relevant (Ch.7 player rebuilding from zero vs. Ch.13 player transitioning off a payment plan)

**6D: Admin Panel Agent**
- Build the firm admin dashboard
- Invite link generation and management
- Client progress overview
- Subscription management interface
- Basic analytics (engagement metrics, completion rates)

---

### PHASE 7: Integration & QA Agent

**Role:** Brings everything together. Tests. Fixes.

**Tasks:**
1. Integrate all builder agent outputs into a single working application
2. Load all course content into the application
3. Test the full user journey:
   - Sign up via invite link → verify email → enter payment → start course
   - Self-register → verify email → enter payment → start 14-day trial → complete lessons → play games → earn badges
   - Trial expiration → payment prompt → subscription → continued access
   - Payment failure → grace period → access suspension
4. Test all games for functionality, scoring accuracy, and fun factor
5. Test responsive design (mobile, tablet, desktop)
6. Test auth edge cases (concurrent sessions, expired invites, password reset)
7. Verify Stripe webhooks handle all payment events correctly
8. Performance test: course content loads quickly, games run smoothly
9. Accessibility check: screen reader compatibility, keyboard navigation, color contrast
10. Fix all bugs found
11. Output: a deployable application with deployment instructions

---

## Critical Constraints

1. **Legal disclaimer required:** The course is educational, not legal or financial advice. Include appropriate disclaimers. The firm is providing this as a value-add service, not as professional counsel.
2. **No personally identifiable bankruptcy information** should ever be stored or referenced in the course platform. Client data and course data are completely separate systems.
3. **Trauma-informed design is non-negotiable.** If any agent produces content that could shame, blame, or re-traumatize a bankruptcy client, it must be caught and corrected. This includes subtle things like stock photos of stressed people, red "failure" colors on wrong quiz answers, or language that implies the client caused their situation.
4. **Games must be genuinely engaging.** If a game is not fun enough that someone would play it voluntarily (not just for course credit), it needs redesign. Test this by asking: "Would I play this on my phone while waiting for an appointment?" If the answer is no, iterate.
5. **40 hours is a target, not a minimum.** If the content naturally comes to 35 excellent hours, that is better than 40 hours with 5 hours of padding. Quality over quantity.
6. **Mobile-first design.** Most users will likely access this on their phone. Every screen, every game, every interaction must work well on mobile.

---

## Source Material Instructions

Before beginning Phase 1, read and internalize ALL 24 documents in `C:\Users\Viccar\Downloads\diment-firm-website\course\`:

**Curriculum & Strategy:**
- A Fresh Start_ Your Roadmap to Sustainable Financial Health.docx
- The Post-Bankruptcy Curriculum_ From Healing to Financial Resilience.docx
- The Architect's Blueprint for Financial Resurrection.docx
- Blueprint for a Twelve Month Financial Recovery Strategy.docx
- The Financial Restoration and Empowerment Compendium.docx
- Strategic Framework for Institutional Financial Wellness_ A Roadmap for Student Engagement.docx

**Budgeting & Income:**
- The 50_30_20 Blueprint for Post-Bankruptcy Recovery.docx
- The Master Guide to Cash-Based Envelope Budgeting.docx
- The Architecture of Automated Emergency Savings.docx
- Mastering the Variable Income Baseline.docx
- A Guide to Calculating Average Monthly Net Income.docx

**Gamification & Simulations:**
- Mastering Financial Resilience Through Strategic Gamification.docx
- Mastering the Gig Economy_ Financial Volatility Simulations.docx

**Psychological & Emotional:**
- Healing the Scars of Financial Trauma.docx
- Radical Self-Compassion and the Path to Financial Healing.docx
- Breaking the Belief Trap_ Rewriting Your Financial Narrative.docx
- The Financial Narrative_ Healing Your Emotional Wealth Script.docx

**Financial Literacy & Protection:**
- Financial Literacy and Economic Resilience Toolkit.docx
- Navigating the Hazards of Predatory Lending.docx
- Premier Secured Credit Cards for Rebuilding Financial Health.docx

**Assessment & Metrics:**
- Baseline Strategies for Assessing Adult Financial Mindsets.docx
- Metrics for Mastering Adult Financial Literacy.docx
- Metrics of Financial Empowerment and Adult Learner Success.docx
- Financial Literacy and Debt Management Strategies - Table 1.csv

**Character assets** are in `C:\Users\Viccar\Downloads\diment-firm-website\public\`:
- hariette_hare_final.png (Hariette — Chapter 7 mascot)
- sheldon_tortoise_final.png (Sheldon — Chapter 13 mascot, hard hat + gavel)
- sheldon_tortoise_adorable_worker_1772080468357.png (Sheldon worker variant with G&P Law branding)
- art turtle.png (Sheldon casual variant)

Treat these as the authoritative knowledge base. The course should reflect this research, not generic financial literacy content you could find anywhere online. The value of this course is that it is specifically designed for people rebuilding after bankruptcy, informed by real research on what they need.

---

## Output Structure

When complete, the project directory should contain:
```
/course-app
  /src
    /components      — Reusable UI components
    /components/mascot — Mascot renderer, dialogue bubbles, avatar display
    /pages           — Route pages (dashboard, lessons, games, admin, auth)
    /games           — Game components (each game self-contained)
    /content         — Course content as structured data
    /content/shared  — Lessons common to both paths
    /content/ch7     — Chapter 7 path-specific content and Hariette dialogue
    /content/ch13    — Chapter 13 path-specific content and Sheldon dialogue
    /hooks           — Custom React hooks
    /utils           — Helpers, Stripe integration, auth utilities
    /api             — API route handlers
    /styles          — Tailwind config, global styles
  /public
    /mascots         — Hariette and Sheldon character images (copied from source)
  /docs
    /course-blueprint.md     — Phase 1 output
    /content/                — All lesson content (markdown + metadata)
    /game-designs/           — Game design documents
    /critic-reports/         — Critic review logs
    /final-review/           — Final reviewer report
    /architecture.md         — Technical architecture doc
  package.json
  README.md          — Setup and deployment instructions
  .env.example       — Required environment variables
```

---

## Definition of Done

The task is complete when:
- [ ] All course content is written, reviewed by Critic, and approved by Final Reviewer
- [ ] Content includes both Chapter 7 (Hariette) and Chapter 13 (Sheldon) path variations
- [ ] Mascot characters are integrated throughout lessons, games, and dashboard
- [ ] All games are designed, built, and playable
- [ ] The web application runs locally with `npm run dev`
- [ ] A user can sign up (selecting Ch.7 or Ch.13 path), start the course, complete lessons, play games, earn XP/badges
- [ ] Invite links can pre-configure chapter path and extended trial duration
- [ ] Stripe payment flow works in test mode (14-day trial, card at signup)
- [ ] Admin panel allows generating invite links and viewing client progress
- [ ] Credential sharing is mitigated
- [ ] The course treats every learner with dignity and respect
- [ ] Deployment instructions are clear and complete
