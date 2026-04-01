/**
 * useHighScores — Persistent high score tracking per game.
 *
 * Stores top 5 scores in localStorage with timestamps.
 * Also tracks streak (consecutive plays) and personal best.
 */

import { useState, useCallback } from 'react'

interface HighScoreEntry {
  score: number
  date: string
  grade: string
}

interface HighScoreState {
  scores: HighScoreEntry[]
  personalBest: number
  totalPlays: number
  currentStreak: number // consecutive plays above C grade
}

const EMPTY: HighScoreState = { scores: [], personalBest: 0, totalPlays: 0, currentStreak: 0 }

function getGradeForScore(score: number, maxScore: number): string {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  if (pct >= 95) return 'A+'
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B'
  if (pct >= 70) return 'C'
  if (pct >= 60) return 'D'
  return 'F'
}

export function useHighScores(gameSlug: string, maxScore: number) {
  const key = `high-scores-${gameSlug}`

  const [state, setState] = useState<HighScoreState>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : EMPTY
    } catch { return EMPTY }
  })

  const saveState = useCallback((next: HighScoreState) => {
    setState(next)
    localStorage.setItem(key, JSON.stringify(next))
  }, [key])

  const submitScore = useCallback((score: number) => {
    const grade = getGradeForScore(score, maxScore)
    const entry: HighScoreEntry = {
      score,
      date: new Date().toLocaleDateString(),
      grade,
    }

    const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
    const isGoodPlay = pct >= 70 // C or above

    const newScores = [...state.scores, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    const next: HighScoreState = {
      scores: newScores,
      personalBest: Math.max(state.personalBest, score),
      totalPlays: state.totalPlays + 1,
      currentStreak: isGoodPlay ? state.currentStreak + 1 : 0,
    }

    saveState(next)
    return {
      isNewBest: score > state.personalBest && state.totalPlays > 0,
      rank: newScores.findIndex(s => s.score === score) + 1,
      streak: next.currentStreak,
    }
  }, [state, maxScore, saveState])

  return {
    ...state,
    submitScore,
  }
}
