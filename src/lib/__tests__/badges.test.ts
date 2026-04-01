import { describe, it, expect } from 'vitest'
import { checkBadgeEligibility } from '../badges'
import type { BadgeDefinition, LessonProgress, ModuleProgress, GameScore, Streak } from '../../types/database'

// ── Helpers ──────────────────────────────────────────────────────────

function makeBadge(overrides: Partial<BadgeDefinition> & { criteria: Record<string, unknown> }): BadgeDefinition {
  return {
    slug: 'test-badge',
    name: 'Test Badge',
    description: 'A test badge',
    icon_url: '/badges/test.png',
    xp_reward: 50,
    category: 'progress',
    ...overrides,
  }
}

function makeLesson(overrides: Partial<LessonProgress> = {}): LessonProgress {
  return {
    id: crypto.randomUUID(),
    user_id: 'user-1',
    module_id: 'mod-1',
    lesson_id: 'lesson-1',
    status: 'completed',
    progress_pct: 100,
    quiz_score: null,
    quiz_attempts: 0,
    xp_earned: 100,
    started_at: '2026-01-01T10:00:00Z',
    completed_at: '2026-01-01T11:00:00Z',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T11:00:00Z',
    ...overrides,
  }
}

function makeModuleProgress(overrides: Partial<ModuleProgress> = {}): ModuleProgress {
  return {
    id: crypto.randomUUID(),
    user_id: 'user-1',
    module_id: 'mod-1',
    status: 'completed',
    started_at: '2026-01-01T10:00:00Z',
    completed_at: '2026-01-01T15:00:00Z',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T15:00:00Z',
    ...overrides,
  }
}

function makeGameScore(overrides: Partial<GameScore> = {}): GameScore {
  return {
    id: crypto.randomUUID(),
    user_id: 'user-1',
    game_slug: 'budget-crisis',
    score: 800,
    max_score: 1000,
    stars: 2,
    xp_earned: 200,
    duration_sec: 120,
    metadata: {},
    played_at: '2026-01-01T12:00:00Z',
    ...overrides,
  }
}

const emptyState = {
  completedLessons: [] as LessonProgress[],
  moduleProgress: [] as ModuleProgress[],
  gameScores: [] as GameScore[],
  streak: null as Streak | null,
  earnedBadgeSlugs: [] as string[],
}

// ── Tests ────────────────────────────────────────────────────────────

describe('checkBadgeEligibility', () => {
  it('returns false if badge already earned', () => {
    const badge = makeBadge({ slug: 'first-steps', criteria: { type: 'lesson_count', count: 1 } })
    const state = {
      ...emptyState,
      completedLessons: [makeLesson()],
      earnedBadgeSlugs: ['first-steps'],
    }
    expect(checkBadgeEligibility(badge, state)).toBe(false)
  })

  describe('lesson_count criteria', () => {
    const badge = makeBadge({ slug: 'first-five', criteria: { type: 'lesson_count', count: 5 } })

    it('returns false when not enough lessons completed', () => {
      const state = { ...emptyState, completedLessons: [makeLesson(), makeLesson()] }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('returns true when exactly enough lessons completed', () => {
      const lessons = Array.from({ length: 5 }, () => makeLesson())
      const state = { ...emptyState, completedLessons: lessons }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns true when more than enough lessons completed', () => {
      const lessons = Array.from({ length: 8 }, () => makeLesson())
      const state = { ...emptyState, completedLessons: lessons }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('does not count in_progress lessons', () => {
      const lessons = [
        makeLesson({ status: 'completed' }),
        makeLesson({ status: 'completed' }),
        makeLesson({ status: 'in_progress' }),
        makeLesson({ status: 'in_progress' }),
        makeLesson({ status: 'in_progress' }),
      ]
      const badge2 = makeBadge({ criteria: { type: 'lesson_count', count: 3 } })
      expect(checkBadgeEligibility(badge2, { ...emptyState, completedLessons: lessons })).toBe(false)
    })
  })

  describe('module_complete criteria', () => {
    const badge = makeBadge({ criteria: { type: 'module_complete', module: 'mod-3' } })

    it('returns false when module not completed', () => {
      const state = {
        ...emptyState,
        moduleProgress: [makeModuleProgress({ module_id: 'mod-3', status: 'in_progress' })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('returns true when specific module completed', () => {
      const state = {
        ...emptyState,
        moduleProgress: [makeModuleProgress({ module_id: 'mod-3', status: 'completed' })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns false when a different module completed', () => {
      const state = {
        ...emptyState,
        moduleProgress: [makeModuleProgress({ module_id: 'mod-2', status: 'completed' })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })

  describe('module_count criteria', () => {
    const badge = makeBadge({ criteria: { type: 'module_count', count: 3 } })

    it('returns true when 3+ modules completed', () => {
      const modules = [
        makeModuleProgress({ module_id: 'mod-1' }),
        makeModuleProgress({ module_id: 'mod-2' }),
        makeModuleProgress({ module_id: 'mod-3' }),
      ]
      expect(checkBadgeEligibility(badge, { ...emptyState, moduleProgress: modules })).toBe(true)
    })

    it('returns false when fewer than required modules completed', () => {
      const modules = [
        makeModuleProgress({ module_id: 'mod-1' }),
        makeModuleProgress({ module_id: 'mod-2', status: 'in_progress' }),
      ]
      expect(checkBadgeEligibility(badge, { ...emptyState, moduleProgress: modules })).toBe(false)
    })
  })

  describe('game_stars criteria', () => {
    const badge = makeBadge({ criteria: { type: 'game_stars', game: 'credit-sim', stars: 3 } })

    it('returns true when game has enough stars', () => {
      const state = {
        ...emptyState,
        gameScores: [makeGameScore({ game_slug: 'credit-sim', stars: 3 })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns false when game has fewer stars', () => {
      const state = {
        ...emptyState,
        gameScores: [makeGameScore({ game_slug: 'credit-sim', stars: 2 })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('returns false when wrong game has enough stars', () => {
      const state = {
        ...emptyState,
        gameScores: [makeGameScore({ game_slug: 'budget-crisis', stars: 3 })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })

  describe('perfect_games criteria', () => {
    const badge = makeBadge({ criteria: { type: 'perfect_games', count: 2 } })

    it('returns true with 2 distinct perfect games', () => {
      const state = {
        ...emptyState,
        gameScores: [
          makeGameScore({ game_slug: 'game-a', stars: 3 }),
          makeGameScore({ game_slug: 'game-b', stars: 3 }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('counts unique games only (same game twice = 1)', () => {
      const state = {
        ...emptyState,
        gameScores: [
          makeGameScore({ game_slug: 'game-a', stars: 3 }),
          makeGameScore({ game_slug: 'game-a', stars: 3 }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('does not count games with < 3 stars', () => {
      const state = {
        ...emptyState,
        gameScores: [
          makeGameScore({ game_slug: 'game-a', stars: 3 }),
          makeGameScore({ game_slug: 'game-b', stars: 2 }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })

  describe('games_completed criteria', () => {
    const badge = makeBadge({ criteria: { type: 'games_completed', count: 3 } })

    it('returns true with 3 distinct games played', () => {
      const state = {
        ...emptyState,
        gameScores: [
          makeGameScore({ game_slug: 'game-a' }),
          makeGameScore({ game_slug: 'game-b' }),
          makeGameScore({ game_slug: 'game-c' }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('counts unique game slugs only', () => {
      const state = {
        ...emptyState,
        gameScores: [
          makeGameScore({ game_slug: 'game-a' }),
          makeGameScore({ game_slug: 'game-a' }),
          makeGameScore({ game_slug: 'game-b' }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })

  describe('streak criteria', () => {
    const badge = makeBadge({ criteria: { type: 'streak', days: 7 } })

    it('returns true when streak meets requirement', () => {
      const state = {
        ...emptyState,
        streak: {
          user_id: 'user-1',
          current_streak: 7,
          longest_streak: 10,
          last_active_date: '2026-01-07',
          updated_at: '2026-01-07T12:00:00Z',
        },
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns false when streak below requirement', () => {
      const state = {
        ...emptyState,
        streak: {
          user_id: 'user-1',
          current_streak: 5,
          longest_streak: 5,
          last_active_date: '2026-01-05',
          updated_at: '2026-01-05T12:00:00Z',
        },
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('returns false when streak is null', () => {
      expect(checkBadgeEligibility(badge, emptyState)).toBe(false)
    })
  })

  describe('speed_module criteria', () => {
    const badge = makeBadge({ criteria: { type: 'speed_module' } })

    it('returns true when a module was completed in under 24 hours', () => {
      const state = {
        ...emptyState,
        moduleProgress: [
          makeModuleProgress({
            started_at: '2026-01-01T10:00:00Z',
            completed_at: '2026-01-01T20:00:00Z', // 10 hours
          }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns false when all modules took more than 24 hours', () => {
      const state = {
        ...emptyState,
        moduleProgress: [
          makeModuleProgress({
            started_at: '2026-01-01T10:00:00Z',
            completed_at: '2026-01-03T10:00:00Z', // 48 hours
          }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('returns false when module not completed', () => {
      const state = {
        ...emptyState,
        moduleProgress: [
          makeModuleProgress({
            status: 'in_progress',
            started_at: '2026-01-01T10:00:00Z',
            completed_at: null,
          }),
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })

  describe('night_lesson criteria', () => {
    const badge = makeBadge({ criteria: { type: 'night_lesson' } })

    it('returns true for lesson completed at 11 PM', () => {
      const state = {
        ...emptyState,
        completedLessons: [
          makeLesson({ completed_at: '2026-01-01T23:30:00' }), // 11:30 PM local
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns true for lesson completed at 2 AM', () => {
      const state = {
        ...emptyState,
        completedLessons: [
          makeLesson({ completed_at: '2026-01-02T02:00:00' }), // 2:00 AM local
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(true)
    })

    it('returns false for lesson completed during daytime', () => {
      const state = {
        ...emptyState,
        completedLessons: [
          makeLesson({ completed_at: '2026-01-01T14:00:00' }), // 2:00 PM
        ],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })

    it('returns false when no completed_at timestamp', () => {
      const state = {
        ...emptyState,
        completedLessons: [makeLesson({ completed_at: null })],
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })

  describe('unknown criteria type', () => {
    it('returns false for unrecognized criteria type', () => {
      const badge = makeBadge({ criteria: { type: 'some_future_type' } })
      const state = {
        ...emptyState,
        completedLessons: Array.from({ length: 50 }, () => makeLesson()),
      }
      expect(checkBadgeEligibility(badge, state)).toBe(false)
    })
  })
})
