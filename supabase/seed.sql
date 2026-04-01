-- Fresh Start Academy — Seed Data
-- Run after migrations: npx supabase db seed
-- This creates test data for local development.
-- NOTE: Badge definitions are already seeded in the migration file.

-- ============================================================
-- 1. ADMIN USER
-- ============================================================
-- Supabase Auth user must be created via the Auth API or Dashboard.
-- This seed assumes the admin signs up with email 'admin@freshstartacademy.com'
-- and then we promote them to admin role.
--
-- For local dev with `supabase start`, create the user via:
--   curl -X POST http://localhost:54321/auth/v1/signup \
--     -H 'apikey: <anon-key>' -H 'Content-Type: application/json' \
--     -d '{"email":"admin@freshstartacademy.com","password":"admin123!","data":{"chapter_path":"ch7"}}'
--
-- Then this seed promotes them:

-- We use a DO block so it doesn't fail if the user doesn't exist yet.
DO $$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Try to find the admin user by email
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@freshstartacademy.com' LIMIT 1;

  IF v_admin_id IS NOT NULL THEN
    -- Promote to admin
    UPDATE profiles SET role = 'admin', display_name = 'Admin' WHERE id = v_admin_id;
    RAISE NOTICE 'Admin user promoted: %', v_admin_id;

    -- Create a sample invite link from the admin
    INSERT INTO invite_links (code, created_by, chapter_path, trial_days, max_uses, label)
    VALUES
      ('FRESH-START-14', v_admin_id, null, 14, null, 'Default 14-day trial link'),
      ('CHAPTER7-90DAY', v_admin_id, 'ch7', 90, 50, 'Chapter 7 client batch — 90 day trial'),
      ('CHAPTER13-90DAY', v_admin_id, 'ch13', 90, 50, 'Chapter 13 client batch — 90 day trial')
    ON CONFLICT (code) DO NOTHING;

    RAISE NOTICE 'Sample invite links created';
  ELSE
    RAISE NOTICE 'Admin user not found — skipping admin setup. Sign up first, then re-run seed.';
  END IF;
END $$;

-- ============================================================
-- 2. MODULE PROGRESS TEMPLATE
-- ============================================================
-- When a new user signs up, Module 1 should be 'available' and the rest 'locked'.
-- This is handled by the app on first login, but we document the expected state:
--
-- Module 01: available (unlocked by default)
-- Module 02-10: locked (unlocked sequentially on completion)
--
-- No seed rows needed — the app creates these on first dashboard load.

-- ============================================================
-- 3. ADDITIONAL BADGE DEFINITIONS (if any new ones beyond migration)
-- ============================================================
-- The migration already seeds 12 badges. Add more here if needed.
-- Using ON CONFLICT to avoid duplicates if run multiple times.

INSERT INTO badge_definitions (slug, name, description, icon_url, xp_reward, category, criteria) VALUES
  ('quiz-ace', 'Quiz Ace', 'Score 100% on any quiz', '/badges/quiz-ace.svg', 25, 'progress', '{"type":"quiz_perfect","count":1}'),
  ('quiz-master', 'Quiz Master', 'Score 100% on 10 quizzes', '/badges/quiz-master.svg', 100, 'progress', '{"type":"quiz_perfect","count":10}'),
  ('five-games', 'Game Enthusiast', 'Complete 5 different games', '/badges/five-games.svg', 100, 'game', '{"type":"games_completed","count":5}'),
  ('early-bird', 'Early Bird', 'Complete a lesson before 7 AM', '/badges/early-bird.svg', 25, 'special', '{"type":"early_lesson"}'),
  ('marathon', 'Marathon Learner', 'Complete 3 lessons in one day', '/badges/marathon.svg', 50, 'special', '{"type":"daily_lessons","count":3}'),
  ('comeback', 'Comeback Kid', 'Return after 7+ days away', '/badges/comeback.svg', 50, 'special', '{"type":"comeback","days":7}')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 4. DEV HELPER: Sample subscription (for testing without Stripe)
-- ============================================================
-- Uncomment the following for local dev testing without Stripe:
--
-- DO $$
-- DECLARE
--   v_user_id uuid;
-- BEGIN
--   SELECT id INTO v_user_id FROM profiles LIMIT 1;
--   IF v_user_id IS NOT NULL THEN
--     INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_sub_id, status, trial_ends_at, current_period_end)
--     VALUES (
--       v_user_id,
--       'cus_test_' || v_user_id::text,
--       'sub_test_' || v_user_id::text,
--       'trialing',
--       now() + interval '14 days',
--       now() + interval '14 days'
--     ) ON CONFLICT (user_id) DO NOTHING;
--     RAISE NOTICE 'Test subscription created for user %', v_user_id;
--   END IF;
-- END $$;

-- ============================================================
-- 5. REFRESH ANALYTICS VIEW
-- ============================================================
REFRESH MATERIALIZED VIEW analytics_summary;
