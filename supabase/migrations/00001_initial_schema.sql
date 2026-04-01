-- Fresh Start Academy — Initial Schema
-- Migration 00001

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- 3.1 profiles
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  display_name  text not null default '',
  avatar_url    text,
  chapter_path  text not null check (chapter_path in ('ch7','ch13')),
  role          text not null default 'learner' check (role in ('learner','admin')),
  level         int not null default 1,
  total_xp      int not null default 0,
  invited_by    uuid,
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 3.3 invite_links (must come before FK on profiles.invited_by)
create table invite_links (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,
  created_by      uuid not null references profiles(id),
  chapter_path    text check (chapter_path in ('ch7','ch13')),
  trial_days      int not null default 14,
  max_uses        int,
  use_count       int not null default 0,
  expires_at      timestamptz,
  is_active       boolean not null default true,
  label           text,
  created_at      timestamptz not null default now()
);

-- Add FK for profiles.invited_by now that invite_links exists
alter table profiles add constraint fk_profiles_invited_by
  foreign key (invited_by) references invite_links(id);

-- 3.2 subscriptions
create table subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade unique,
  stripe_customer_id  text not null,
  stripe_sub_id       text unique,
  status              text not null default 'trialing'
                      check (status in ('trialing','active','past_due',
                                        'suspended','canceled','comp')),
  trial_ends_at       timestamptz not null,
  current_period_end  timestamptz,
  cancel_at           timestamptz,
  grace_ends_at       timestamptz,
  comp_reason         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 3.4 module_progress
create table module_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  module_id     text not null,
  status        text not null default 'locked'
                check (status in ('locked','available','in_progress','completed')),
  started_at    timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(user_id, module_id)
);

-- 3.5 lesson_progress
create table lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  module_id     text not null,
  lesson_id     text not null,
  status        text not null default 'not_started'
                check (status in ('not_started','in_progress','completed')),
  progress_pct  int not null default 0 check (progress_pct between 0 and 100),
  quiz_score    int,
  quiz_attempts int not null default 0,
  xp_earned     int not null default 0,
  started_at    timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(user_id, module_id, lesson_id)
);

-- 3.6 xp_ledger
create table xp_ledger (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  amount      int not null,
  source      text not null check (source in (
                'lesson','quiz','game','badge','streak','bonus')),
  ref_id      text,
  note        text,
  created_at  timestamptz not null default now()
);
create index idx_xp_ledger_user on xp_ledger(user_id, created_at desc);

-- 3.7 badges
create table badge_definitions (
  slug        text primary key,
  name        text not null,
  description text not null,
  icon_url    text not null,
  xp_reward   int not null default 0,
  category    text not null check (category in (
                'progress','game','streak','special')),
  criteria    jsonb not null default '{}'
);

create table user_badges (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  badge_slug  text not null references badge_definitions(slug),
  earned_at   timestamptz not null default now(),
  unique(user_id, badge_slug)
);

-- 3.8 streaks
create table streaks (
  user_id         uuid primary key references profiles(id) on delete cascade,
  current_streak  int not null default 0,
  longest_streak  int not null default 0,
  last_active_date date,
  updated_at      timestamptz not null default now()
);

-- 3.9 game_scores
create table game_scores (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  game_slug     text not null,
  score         int not null,
  max_score     int not null,
  stars         int not null check (stars between 0 and 3),
  xp_earned     int not null default 0,
  duration_sec  int,
  metadata      jsonb default '{}',
  played_at     timestamptz not null default now()
);
create index idx_game_scores_user on game_scores(user_id, game_slug);

-- 3.10 game_saves
create table game_saves (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  game_slug   text not null,
  state       jsonb not null,
  saved_at    timestamptz not null default now(),
  unique(user_id, game_slug)
);

-- 3.11 active_sessions
create table active_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  device_hash text not null,
  ip_address  inet,
  user_agent  text,
  last_seen   timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index idx_sessions_user on active_sessions(user_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table invite_links enable row level security;
alter table module_progress enable row level security;
alter table lesson_progress enable row level security;
alter table xp_ledger enable row level security;
alter table badge_definitions enable row level security;
alter table user_badges enable row level security;
alter table streaks enable row level security;
alter table game_scores enable row level security;
alter table game_saves enable row level security;
alter table active_sessions enable row level security;

-- Helper: check if current user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- profiles
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Admins read all profiles" on profiles
  for select using (is_admin());
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- subscriptions
create policy "Users read own subscription" on subscriptions
  for select using (auth.uid() = user_id);
create policy "Admins read all subscriptions" on subscriptions
  for select using (is_admin());
create policy "Admins manage subscriptions" on subscriptions
  for all using (is_admin());

-- invite_links
create policy "Admins manage invite_links" on invite_links
  for all using (is_admin());
create policy "Anyone can read active invite links" on invite_links
  for select using (is_active = true);

-- module_progress
create policy "Users own module_progress" on module_progress
  for all using (auth.uid() = user_id);
create policy "Admins read module_progress" on module_progress
  for select using (is_admin());

-- lesson_progress
create policy "Users own lesson_progress" on lesson_progress
  for all using (auth.uid() = user_id);
create policy "Admins read lesson_progress" on lesson_progress
  for select using (is_admin());

-- xp_ledger
create policy "Users read own xp_ledger" on xp_ledger
  for select using (auth.uid() = user_id);
create policy "Admins read all xp_ledger" on xp_ledger
  for select using (is_admin());

-- badge_definitions: everyone can read
create policy "Anyone can read badge_definitions" on badge_definitions
  for select using (true);

-- user_badges
create policy "Users read own badges" on user_badges
  for select using (auth.uid() = user_id);
create policy "Admins read all badges" on user_badges
  for select using (is_admin());

-- streaks
create policy "Users own streaks" on streaks
  for all using (auth.uid() = user_id);
create policy "Admins read streaks" on streaks
  for select using (is_admin());

-- game_scores
create policy "Users own game_scores" on game_scores
  for all using (auth.uid() = user_id);
create policy "Admins read game_scores" on game_scores
  for select using (is_admin());

-- game_saves
create policy "Users own game_saves" on game_saves
  for all using (auth.uid() = user_id);

-- active_sessions
create policy "Users own sessions" on active_sessions
  for all using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: handle_new_user
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, chapter_path)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'chapter_path', 'ch7')
  );

  insert into streaks (user_id, current_streak, longest_streak)
  values (new.id, 0, 0);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- FUNCTIONS (RPC)
-- ============================================================

-- award_xp: insert ledger + update profile total_xp + check level
create or replace function award_xp(
  p_user_id uuid,
  p_amount int,
  p_source text,
  p_ref_id text default null,
  p_note text default null
) returns jsonb as $$
declare
  v_new_total int;
  v_old_level int;
  v_new_level int;
  v_thresholds int[] := array[0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200];
begin
  -- Insert ledger entry
  insert into xp_ledger (user_id, amount, source, ref_id, note)
  values (p_user_id, p_amount, p_source, p_ref_id, p_note);

  -- Update total
  update profiles
  set total_xp = total_xp + p_amount,
      updated_at = now()
  where id = p_user_id
  returning total_xp into v_new_total;

  -- Calculate new level
  select level into v_old_level from profiles where id = p_user_id;
  v_new_level := 1;
  for i in reverse 10..2 loop
    if v_new_total >= v_thresholds[i] then
      v_new_level := i;
      exit;
    end if;
  end loop;

  if v_new_level > v_old_level then
    update profiles set level = v_new_level, updated_at = now()
    where id = p_user_id;
  end if;

  return jsonb_build_object(
    'total_xp', v_new_total,
    'old_level', v_old_level,
    'new_level', v_new_level,
    'leveled_up', v_new_level > v_old_level
  );
end;
$$ language plpgsql security definer;

-- submit_score
create or replace function submit_score(
  p_user_id uuid,
  p_game_slug text,
  p_score int,
  p_max_score int,
  p_duration int default null
) returns jsonb as $$
declare
  v_stars int;
  v_xp int;
  v_pct numeric;
  v_result jsonb;
begin
  v_pct := (p_score::numeric / nullif(p_max_score, 0)) * 100;
  v_stars := case
    when v_pct >= 90 then 3
    when v_pct >= 70 then 2
    when v_pct >= 50 then 1
    else 0
  end;
  v_xp := case v_stars
    when 3 then 100
    when 2 then 60
    when 1 then 30
    else 0
  end;

  insert into game_scores (user_id, game_slug, score, max_score, stars, xp_earned, duration_sec)
  values (p_user_id, p_game_slug, p_score, p_max_score, v_stars, v_xp, p_duration);

  -- Delete save
  delete from game_saves where user_id = p_user_id and game_slug = p_game_slug;

  -- Award XP
  if v_xp > 0 then
    v_result := award_xp(p_user_id, v_xp, 'game', p_game_slug);
  else
    v_result := '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'stars', v_stars,
    'xp_earned', v_xp,
    'xp_result', v_result
  );
end;
$$ language plpgsql security definer;

-- update_streak
create or replace function update_streak(p_user_id uuid)
returns jsonb as $$
declare
  v_streak record;
  v_today date := current_date;
begin
  select * into v_streak from streaks where user_id = p_user_id;

  if v_streak is null then
    insert into streaks (user_id, current_streak, longest_streak, last_active_date)
    values (p_user_id, 1, 1, v_today);
    return jsonb_build_object('current_streak', 1, 'longest_streak', 1, 'updated', true);
  end if;

  if v_streak.last_active_date = v_today then
    return jsonb_build_object(
      'current_streak', v_streak.current_streak,
      'longest_streak', v_streak.longest_streak,
      'updated', false
    );
  end if;

  if v_streak.last_active_date = v_today - 1 then
    update streaks set
      current_streak = current_streak + 1,
      longest_streak = greatest(longest_streak, current_streak + 1),
      last_active_date = v_today,
      updated_at = now()
    where user_id = p_user_id;

    return jsonb_build_object(
      'current_streak', v_streak.current_streak + 1,
      'longest_streak', greatest(v_streak.longest_streak, v_streak.current_streak + 1),
      'updated', true
    );
  end if;

  -- Streak broken
  update streaks set
    current_streak = 1,
    last_active_date = v_today,
    updated_at = now()
  where user_id = p_user_id;

  return jsonb_build_object(
    'current_streak', 1,
    'longest_streak', v_streak.longest_streak,
    'updated', true,
    'streak_broken', true
  );
end;
$$ language plpgsql security definer;

-- redeem_invite
create or replace function redeem_invite(p_code text)
returns jsonb as $$
declare
  v_invite record;
begin
  select * into v_invite from invite_links
  where code = p_code and is_active = true;

  if v_invite is null then
    return jsonb_build_object('valid', false, 'error', 'Invite code not found or inactive');
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at < now() then
    return jsonb_build_object('valid', false, 'error', 'Invite code has expired');
  end if;

  if v_invite.max_uses is not null and v_invite.use_count >= v_invite.max_uses then
    return jsonb_build_object('valid', false, 'error', 'Invite code has reached its usage limit');
  end if;

  -- Increment use count
  update invite_links set use_count = use_count + 1 where id = v_invite.id;

  return jsonb_build_object(
    'valid', true,
    'invite_id', v_invite.id,
    'chapter_path', v_invite.chapter_path,
    'trial_days', v_invite.trial_days
  );
end;
$$ language plpgsql security definer;

-- ============================================================
-- MATERIALIZED VIEW: analytics_summary
-- ============================================================

create materialized view analytics_summary as
select
  count(distinct p.id) as total_users,
  count(distinct p.id) filter (where s.status in ('trialing','active','comp')) as active_subs,
  count(distinct p.id) filter (where p.chapter_path = 'ch7') as ch7_users,
  count(distinct p.id) filter (where p.chapter_path = 'ch13') as ch13_users,
  coalesce(avg(p.total_xp), 0) as avg_xp,
  count(distinct mp.user_id) filter (where mp.status = 'completed') as users_with_completed_modules,
  count(distinct gs.user_id) as users_who_played_games
from profiles p
left join subscriptions s on s.user_id = p.id
left join module_progress mp on mp.user_id = p.id
left join game_scores gs on gs.user_id = p.id;

-- ============================================================
-- SEED DATA: badge_definitions
-- ============================================================

insert into badge_definitions (slug, name, description, icon_url, xp_reward, category, criteria) values
  ('first-lesson', 'First Step', 'Complete your first lesson', '/badges/first-lesson.svg', 25, 'progress', '{"type":"lesson_count","count":1}'),
  ('module-1-complete', 'Fresh Start', 'Complete Module 1', '/badges/module-1.svg', 50, 'progress', '{"type":"module_complete","module":"01-fresh-start"}'),
  ('halfway', 'Halfway There', 'Complete 5 modules', '/badges/halfway.svg', 100, 'progress', '{"type":"module_count","count":5}'),
  ('course-complete', 'Graduate', 'Complete all 10 modules', '/badges/graduate.svg', 500, 'progress', '{"type":"module_count","count":10}'),
  ('budget-master', 'Budget Master', '3 stars on Budget Builder', '/badges/budget-master.svg', 75, 'game', '{"type":"game_stars","game":"budget-builder","stars":3}'),
  ('score-perfect', 'Perfectionist', '3 stars on any 3 games', '/badges/perfectionist.svg', 100, 'game', '{"type":"perfect_games","count":3}'),
  ('all-games', 'Game Champion', 'Complete all 7 games', '/badges/game-champion.svg', 200, 'game', '{"type":"games_completed","count":7}'),
  ('streak-7', 'Week Warrior', '7-day streak', '/badges/streak-7.svg', 50, 'streak', '{"type":"streak","days":7}'),
  ('streak-30', 'Monthly Master', '30-day streak', '/badges/streak-30.svg', 200, 'streak', '{"type":"streak","days":30}'),
  ('streak-100', 'Centurion', '100-day streak', '/badges/streak-100.svg', 500, 'streak', '{"type":"streak","days":100}'),
  ('speed-learner', 'Speed Learner', 'Complete a module in one day', '/badges/speed-learner.svg', 75, 'special', '{"type":"speed_module"}'),
  ('night-owl', 'Night Owl', 'Complete a lesson after 11 PM', '/badges/night-owl.svg', 25, 'special', '{"type":"night_lesson"}');
