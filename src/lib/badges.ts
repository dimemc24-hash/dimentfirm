import type { BadgeDefinition, ModuleProgress, GameScore, Streak, LessonProgress } from '../types/database';

interface UserState {
  completedLessons: LessonProgress[];
  moduleProgress: ModuleProgress[];
  gameScores: GameScore[];
  streak: Streak | null;
  earnedBadgeSlugs: string[];
}

export function checkBadgeEligibility(
  badge: BadgeDefinition,
  state: UserState
): boolean {
  if (state.earnedBadgeSlugs.includes(badge.slug)) return false;

  const criteria = badge.criteria as Record<string, unknown>;
  const type = criteria.type as string;

  switch (type) {
    case 'lesson_count': {
      const count = criteria.count as number;
      return state.completedLessons.filter(l => l.status === 'completed').length >= count;
    }
    case 'module_complete': {
      const moduleId = criteria.module as string;
      return state.moduleProgress.some(m => m.module_id === moduleId && m.status === 'completed');
    }
    case 'module_count': {
      const count = criteria.count as number;
      return state.moduleProgress.filter(m => m.status === 'completed').length >= count;
    }
    case 'game_stars': {
      const game = criteria.game as string;
      const stars = criteria.stars as number;
      return state.gameScores.some(s => s.game_slug === game && s.stars >= stars);
    }
    case 'perfect_games': {
      const count = criteria.count as number;
      const perfectGames = new Set(
        state.gameScores.filter(s => s.stars >= 3).map(s => s.game_slug)
      );
      return perfectGames.size >= count;
    }
    case 'games_completed': {
      const count = criteria.count as number;
      const completed = new Set(state.gameScores.map(s => s.game_slug));
      return completed.size >= count;
    }
    case 'streak': {
      const days = criteria.days as number;
      return (state.streak?.current_streak ?? 0) >= days;
    }
    case 'speed_module': {
      return state.moduleProgress.some(m => {
        if (m.status !== 'completed' || !m.started_at || !m.completed_at) return false;
        const start = new Date(m.started_at);
        const end = new Date(m.completed_at);
        return (end.getTime() - start.getTime()) < 24 * 60 * 60 * 1000;
      });
    }
    case 'night_lesson': {
      return state.completedLessons.some(l => {
        if (!l.completed_at) return false;
        const hour = new Date(l.completed_at).getHours();
        return hour >= 23 || hour < 5;
      });
    }
    default:
      return false;
  }
}
