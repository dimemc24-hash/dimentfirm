import { describe, it, expect } from 'vitest'
import {
  getLevelForXP,
  getXPForNextLevel,
  getLevelName,
  LEVEL_THRESHOLDS,
  LEVEL_NAMES,
  XP_AWARDS,
} from '../xp'

describe('getLevelForXP', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevelForXP(0)).toBe(1)
  })

  it('returns level 1 for XP just below level 2 threshold', () => {
    expect(getLevelForXP(99)).toBe(1)
  })

  it('returns level 2 at exactly 100 XP', () => {
    expect(getLevelForXP(100)).toBe(2)
  })

  it('returns level 10 at max threshold', () => {
    expect(getLevelForXP(5200)).toBe(10)
  })

  it('returns level 10 for XP well beyond max threshold', () => {
    expect(getLevelForXP(99999)).toBe(10)
  })

  it('returns level 1 for negative XP (edge case)', () => {
    expect(getLevelForXP(-50)).toBe(1)
  })

  it('returns correct level at each threshold boundary', () => {
    LEVEL_THRESHOLDS.forEach((threshold, index) => {
      expect(getLevelForXP(threshold)).toBe(index + 1)
    })
  })
})

describe('getXPForNextLevel', () => {
  it('returns correct progress for 0 XP', () => {
    const result = getXPForNextLevel(0)
    expect(result.current).toBe(0)
    expect(result.needed).toBe(100) // 100 - 0
    expect(result.progress).toBe(0)
  })

  it('returns 50% progress at midpoint of level 1', () => {
    const result = getXPForNextLevel(50)
    expect(result.current).toBe(50)
    expect(result.needed).toBe(100)
    expect(result.progress).toBe(50)
  })

  it('returns 100% progress at max level', () => {
    const result = getXPForNextLevel(5200)
    expect(result.progress).toBe(100)
  })

  it('handles XP just above a threshold', () => {
    const result = getXPForNextLevel(101)
    expect(result.current).toBe(1)  // 101 - 100
    expect(result.needed).toBe(200) // 300 - 100
    expect(result.progress).toBe(1) // Math.round(1/200 * 100) = 1
  })
})

describe('getLevelName', () => {
  it('returns "Beginner" for level 1', () => {
    expect(getLevelName(1)).toBe('Beginner')
  })

  it('returns "Graduate" for level 10', () => {
    expect(getLevelName(10)).toBe('Graduate')
  })

  it('clamps to last name for levels beyond 10', () => {
    expect(getLevelName(15)).toBe('Graduate')
  })

  it('returns correct names for all standard levels', () => {
    LEVEL_NAMES.forEach((name, index) => {
      expect(getLevelName(index + 1)).toBe(name)
    })
  })
})

describe('XP_AWARDS', () => {
  it('has all expected award types', () => {
    const expected = [
      'lesson_complete',
      'quiz_perfect',
      'game_1star',
      'game_2star',
      'game_3star',
      'module_complete',
      'streak_7',
      'streak_30',
      'daily_login',
    ]
    expected.forEach((key) => {
      expect(XP_AWARDS).toHaveProperty(key)
    })
  })

  it('awards more for higher game stars', () => {
    expect(XP_AWARDS.game_3star).toBeGreaterThan(XP_AWARDS.game_2star)
    expect(XP_AWARDS.game_2star).toBeGreaterThan(XP_AWARDS.game_1star)
  })

  it('awards more for longer streaks', () => {
    expect(XP_AWARDS.streak_30).toBeGreaterThan(XP_AWARDS.streak_7)
  })

  it('all values are positive numbers', () => {
    Object.values(XP_AWARDS).forEach((val) => {
      expect(val).toBeGreaterThan(0)
    })
  })
})

describe('LEVEL_THRESHOLDS', () => {
  it('has 10 levels', () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(10)
  })

  it('starts at 0', () => {
    expect(LEVEL_THRESHOLDS[0]).toBe(0)
  })

  it('is monotonically increasing', () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i]).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1])
    }
  })
})
