export type ChapterPath = 'ch7' | 'ch13';
export type UserRole = 'learner' | 'admin';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'suspended' | 'canceled' | 'comp';
export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';
export type XPSource = 'lesson' | 'quiz' | 'game' | 'badge' | 'streak' | 'bonus';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  chapter_path: ChapterPath;
  role: UserRole;
  level: number;
  total_xp: number;
  invited_by: string | null;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_sub_id: string | null;
  status: SubscriptionStatus;
  trial_ends_at: string;
  current_period_end: string | null;
  cancel_at: string | null;
  grace_ends_at: string | null;
  comp_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface InviteLink {
  id: string;
  code: string;
  created_by: string;
  chapter_path: ChapterPath | null;
  trial_days: number;
  max_uses: number | null;
  use_count: number;
  expires_at: string | null;
  is_active: boolean;
  label: string | null;
  created_at: string;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: ModuleStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  module_id: string;
  lesson_id: string;
  status: LessonStatus;
  progress_pct: number;
  quiz_score: number | null;
  quiz_attempts: number;
  xp_earned: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface XPLedgerEntry {
  id: string;
  user_id: string;
  amount: number;
  source: XPSource;
  ref_id: string | null;
  note: string | null;
  created_at: string;
}

export interface BadgeDefinition {
  slug: string;
  name: string;
  description: string;
  icon_url: string;
  xp_reward: number;
  category: 'progress' | 'game' | 'streak' | 'special';
  criteria: Record<string, unknown>;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_slug: string;
  earned_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  updated_at: string;
}

export interface GameScore {
  id: string;
  user_id: string;
  game_slug: string;
  score: number;
  max_score: number;
  stars: number;
  xp_earned: number;
  duration_sec: number | null;
  metadata: Record<string, unknown>;
  played_at: string;
}

export interface GameSave {
  id: string;
  user_id: string;
  game_slug: string;
  state: unknown;
  saved_at: string;
}

export interface ActiveSession {
  id: string;
  user_id: string;
  device_hash: string;
  ip_address: string | null;
  user_agent: string | null;
  last_seen: string;
  created_at: string;
}
