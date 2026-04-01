export interface GameProps {
  scenario: GameScenario;
  savedState?: unknown;
  chapterPath: 'ch7' | 'ch13';
  onScore: (score: number, maxScore: number) => void;
  onComplete: (result: GameResult) => void;
  onSave: (state: unknown) => void;
}

export interface GameScenario {
  slug: string;
  title: string;
  description: string;
  xp_available: number;
  star_thresholds: [number, number, number];
  data: Record<string, unknown>;
  variants?: {
    ch7?: Partial<Record<string, unknown>>;
    ch13?: Partial<Record<string, unknown>>;
  };
}

export interface GameResult {
  score: number;
  maxScore: number;
  stars: number;
  duration_sec: number;
  metadata: Record<string, unknown>;
}
