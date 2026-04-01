export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2200,   // Level 7
  3000,   // Level 8
  4000,   // Level 9
  5200,   // Level 10
];

export const LEVEL_NAMES = [
  'Beginner',
  'Explorer',
  'Apprentice',
  'Builder',
  'Achiever',
  'Strategist',
  'Expert',
  'Master',
  'Champion',
  'Graduate',
];

export const XP_AWARDS = {
  lesson_complete: 50,
  quiz_perfect: 25,
  game_1star: 30,
  game_2star: 60,
  game_3star: 100,
  module_complete: 100,
  streak_7: 50,
  streak_30: 200,
  daily_login: 5,
} as const;

export function getLevelForXP(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForNextLevel(totalXP: number): { current: number; needed: number; progress: number } {
  const level = getLevelForXP(totalXP);
  if (level >= LEVEL_THRESHOLDS.length) {
    return { current: totalXP, needed: totalXP, progress: 100 };
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1];
  const nextThreshold = LEVEL_THRESHOLDS[level];
  const xpInLevel = totalXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const progress = Math.round((xpInLevel / xpNeeded) * 100);
  return { current: xpInLevel, needed: xpNeeded, progress };
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
}
