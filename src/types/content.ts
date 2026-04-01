export interface LessonMeta {
  id: string;
  title: string;
  type?: string;
  duration_min: number;
  xp_available: number;
  badges?: string[];
  prerequisites?: string[];
}

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonMeta[];
  game: string | null;
  prerequisites: string[];
  xp_total: number;
  badges: string[];
}

export interface ModuleSummary {
  id: string;
  title: string;
  description: string;
  order: number;
  lesson_count: number;
  xp_total: number;
  game: string | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passing_score: number;
  xp_reward: number;
}
