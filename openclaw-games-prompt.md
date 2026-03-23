# OpenClaw Task: Build All 7 Games

Project: D:\Apps_for_Git\course-app\
SHELL: Windows PowerShell. Use ; not &&. Use dir not ls. Use Get-Content not cat.

Build all 7 games as self-contained React components in src/games/. Each game must:
- Be a standalone React component
- Integrate with useXP hook for XP awarding
- Be mobile-responsive (Tailwind, touch-friendly)
- Have real game logic, scoring, and replayability
- Use warm colors, no harsh reds for wrong answers

Read the game design specs from the module content files for detailed mechanics:
- docs/content/module-02-money-story.md (Belief Trap spec)
- docs/content/module-03-budgeting.md (Budget Crisis spec)
- docs/content/module-04-envelope-system.md (Envelope Challenge spec)
- docs/content/module-05-emergency-fund.md (Savings Sprint spec)
- docs/content/module-07-credit-rebuilding.md (Credit Score Simulator spec)
- docs/content/module-08-predatory-traps.md (Predatory Lending Detector spec)
- docs/content/module-09-income-growth.md (Gig Economy Simulator spec)

NOTE: Filenames include topic slugs. module-01-welcome.md NOT module-01.md.

## Game 1: The Belief Trap (src/games/BeliefTrap.tsx)
Scenario-based decision game. Player encounters financial situations that trigger toxic money beliefs. Identify the belief, choose healthier response, see consequences. Pool of 20+ scenarios. Scoring by correct identification + healthy response. 300 XP on completion.

## Game 2: Budget Crisis (src/games/BudgetCrisis.tsx) — MAJOR
Monthly budget sim with random emergencies. Player gets income, weekly expenses arrive plus random crises (car repair, medical bill, job loss). Decide which bills to pay, what to cut, whether to use savings. Cascading consequences. 10+ crisis combos, 3 difficulty tiers. Score 0-100 financial health, grade A-F. Chapter-aware (ch7 starts from zero, ch13 transitions off plan). 300 XP.

## Game 3: Envelope Challenge (src/games/EnvelopeChallenge.tsx)
30-day savings simulation. Random envelope amounts each day, balance against daily expenses. Goal: save the most while covering all expenses. 150 XP.

## Game 4: Savings Sprint (src/games/SavingsSprint.tsx)
6-month sim protecting growing emergency fund. Temptations + real emergencies appear. Must distinguish correctly. Fund grows with interest if untouched. Score by final balance + correct decisions. 150 XP.

## Game 5: Credit Score Simulator (src/games/CreditScoreSimulator.tsx) — MAJOR
Start with ~520 post-bankruptcy score. Monthly decisions: pay in full or minimum, apply for new credit, utilization %. Real-time score impact with explanations. Goal: reach 650+ in 12 months. Chapter-aware starting scores. 300 XP + bonus badges at 650/700.

## Game 6: Predatory Lending Detector (src/games/PredatoryLendingDetector.tsx) — MAJOR
Sort incoming mail offers into Legitimate/Predatory/Needs Research. Click into offers to see details, spot red flags. 40+ offers in pool. Consequences shown for wrong choices. 300 XP.

## Game 7: Gig Economy Simulator (src/games/GigEconomySimulator.tsx) — MAJOR
$1,500 monthly expenses, no steady paycheck. Daily gig choices: rideshare ($15-25/hr), delivery ($12-20/hr), lawn care ($20-30/hr), freelancing ($50-100/project). Each has time cost, startup cost, physical toll. Complications: gas, weather, late payments, burnout meter. Cover bills without borrowing. 300 XP.

## Also create:
- src/games/index.ts — barrel export for all games
- src/games/shared/GameHeader.tsx — reusable header with score, timer, XP display
- src/games/shared/GameResult.tsx — reusable end screen with score, XP earned, replay button, badge earned notification
- Update src/pages/Game.tsx to load the correct game component based on route params

## Scenario Data:
Store scenario data as JSON arrays within each game file or in a companion data file (e.g. src/games/data/budget-crisis-scenarios.json). This makes them easy to update later.
