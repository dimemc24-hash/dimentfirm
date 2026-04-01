-- Migration 00002: Complete badge definitions
-- Adds 22 module-specific badges missing from initial seed (34 total)

insert into badge_definitions (slug, name, description, icon_url, xp_reward, category, criteria) values
  -- Module 1
  ('goal-setter', '🎯 Goal Setter', 'Write 3 SMART goals in Lesson 1.5', '/badges/goal-setter.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"01-fresh-start","lesson":"05-smart-goals"}'),

  -- Module 2
  ('story-rewriter', '📖 Story Rewriter', 'Complete Money Timeline and Narrative Reconstruction', '/badges/story-rewriter.svg', 50, 'progress',
   '{"type":"lessons_complete","module":"02-money-story","lessons":["02-money-timeline","05-narrative-reconstruction"]}'),
  ('belief-breaker', '🧠 Belief Breaker', 'Score 80%+ on The Belief Trap Game', '/badges/belief-breaker.svg', 75, 'game',
   '{"type":"game_score_pct","game":"belief-trap","min_pct":80}'),

  -- Module 3
  ('budget-builder', '🏗️ Budget Builder', 'Complete your first budget in Lesson 3.4', '/badges/budget-builder.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"03-budgeting","lesson":"04-first-budget"}'),
  ('crisis-manager', '🛡️ Crisis Manager', 'Score B+ or higher on Budget Crisis Game', '/badges/crisis-manager.svg', 75, 'game',
   '{"type":"game_score_pct","game":"budget-crisis","min_pct":70}'),
  ('needs-wants-master', '🎯 Needs vs Wants Master', 'Perfect score on needs/wants sorting exercise', '/badges/needs-wants.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"03-budgeting","lesson":"03-needs-vs-wants"}'),

  -- Module 4
  ('cash-commander', '💵 Cash Commander', 'Complete cash psychology exercises in Lesson 4.2', '/badges/cash-commander.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"04-envelope-system","lesson":"02-cash-psychology"}'),
  ('envelope-champion', '📬 Envelope Champion', 'Hit savings target in Envelope Challenge Game', '/badges/envelope-champion.svg', 75, 'game',
   '{"type":"game_stars","game":"envelope-challenge","stars":2}'),

  -- Module 5
  ('emergency-fund-started', '🏦 Emergency Fund Started', 'Complete emergency fund setup exercise', '/badges/emergency-fund.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"05-emergency-fund","lesson":"03-fund-setup"}'),
  ('savings-streak', '💰 Savings Streak', 'Complete Savings Sprint Game', '/badges/savings-streak.svg', 75, 'game',
   '{"type":"game_stars","game":"savings-sprint","stars":1}'),

  -- Module 6
  ('brave-heart', '🫀 Brave Heart', 'Complete all 4 reflections in Module 6', '/badges/brave-heart.svg', 75, 'progress',
   '{"type":"module_complete","module":"06-healing"}'),

  -- Module 7
  ('credit-auditor', '🔍 Credit Auditor', 'Complete Lesson 7.1 and submit a dispute', '/badges/credit-auditor.svg', 50, 'progress',
   '{"type":"lessons_complete","module":"07-credit-rebuilding","lessons":["01-credit-report","05-dispute-letters"]}'),
  ('dispute-pro', '✉️ Dispute Pro', 'Complete dispute letter writing in Lesson 7.5', '/badges/dispute-pro.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"07-credit-rebuilding","lesson":"05-dispute-letters"}'),
  ('score-builder', '📈 Score Builder', 'Reach 650 in Credit Score Simulator', '/badges/score-builder.svg', 75, 'game',
   '{"type":"game_score_min","game":"credit-score-simulator","min_score":650}'),
  ('credit-master', '🏆 Credit Master', 'Reach 700 in Credit Score Simulator', '/badges/credit-master.svg', 100, 'game',
   '{"type":"game_score_min","game":"credit-score-simulator","min_score":700}'),

  -- Module 8
  ('trap-spotter', '🎯 Trap Spotter', 'Score 90%+ accuracy on Predatory Lending Detector', '/badges/trap-spotter.svg', 75, 'game',
   '{"type":"game_score_pct","game":"predatory-lending-detector","min_pct":90}'),
  ('apr-calculator', '🧮 APR Calculator', '100% on all APR practice problems', '/badges/apr-calculator.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"08-predatory-traps","lesson":"04-apr-practice"}'),

  -- Module 9
  ('income-architect', '💼 Income Architect', 'Complete baseline income calculation', '/badges/income-architect.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"09-income-growth","lesson":"02-income-baseline"}'),
  ('cash-flow-master', '📊 Cash Flow Master', 'Complete cash flow budgeting exercise', '/badges/cash-flow-master.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"09-income-growth","lesson":"05-cash-flow"}'),
  ('side-hustle-pro', '🏅 Side Hustle Pro', 'Cover all bills in Gig Economy Simulator without borrowing', '/badges/side-hustle-pro.svg', 75, 'game',
   '{"type":"game_stars","game":"gig-economy-simulator","stars":3}'),

  -- Module 10
  ('letter-writer', '✍️ Letter Writer', 'Complete Letter of Explanation', '/badges/letter-writer.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"10-road-map","lesson":"03-letter-of-explanation"}'),
  ('road-map-ready', '🗺️ Road Map Ready', 'Complete 12-Month Road Map capstone project', '/badges/road-map-ready.svg', 100, 'progress',
   '{"type":"lesson_complete","module":"10-road-map","lesson":"04-twelve-month-roadmap"}'),
  ('commitment-keeper', '🤝 Commitment Keeper', 'Sign Commitment Contract', '/badges/commitment-keeper.svg', 50, 'progress',
   '{"type":"lesson_complete","module":"10-road-map","lesson":"05-commitment-contract"}')
on conflict (slug) do nothing;
