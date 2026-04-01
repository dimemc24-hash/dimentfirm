/**
 * useGameState — Game save/load hook per architecture §8.4
 *
 * Features:
 *  - Load saved state from `game_saves` on mount
 *  - Auto-save every 30 seconds during active play
 *  - Manual save function
 *  - Delete save on completion (then write to `game_scores`)
 *  - Provides `hasSave` flag for "Continue where you left off?" prompt
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { GameSave, GameScore } from '../types/database'

const AUTO_SAVE_INTERVAL_MS = 30_000 // 30 seconds

// ── Types ────────────────────────────────────────────────────────────

export interface GameResult {
  score: number
  maxScore: number
  stars: number // 0-3
  durationSec: number
  metadata?: Record<string, unknown>
}

interface UseGameStateReturn<T> {
  /** Saved game state, or null if no save exists */
  savedState: T | null
  /** Whether a save exists for this game */
  hasSave: boolean
  /** Whether the save is still loading from DB */
  loading: boolean
  /** Save the current game state (auto-called every 30s) */
  save: (state: T) => Promise<void>
  /** Clear the save (call on game restart / new game) */
  clearSave: () => Promise<void>
  /** Submit final score, clear save, and write to game_scores */
  submitScore: (result: GameResult) => Promise<GameScore | null>
  /** Dismiss the saved state (user chose "New Game" instead of resume) */
  dismissSave: () => void
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useGameState<T = unknown>(
  userId: string | undefined,
  gameSlug: string,
): UseGameStateReturn<T> {
  const [savedState, setSavedState] = useState<T | null>(null)
  const [hasSave, setHasSave] = useState(false)
  const [loading, setLoading] = useState(true)

  // Ref to the latest state for auto-save interval
  const latestStateRef = useRef<T | null>(null)
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const saveIdRef = useRef<string | null>(null)

  // ── Load existing save on mount ──────────────────────────────────

  useEffect(() => {
    if (!userId || !gameSlug) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadSave() {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId!)
        .eq('game_slug', gameSlug)
        .order('saved_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cancelled) return

      if (!error && data) {
        const save = data as unknown as GameSave
        setSavedState(save.state as T)
        setHasSave(true)
        saveIdRef.current = save.id
      } else {
        setSavedState(null)
        setHasSave(false)
        saveIdRef.current = null
      }
      setLoading(false)
    }

    loadSave()
    return () => {
      cancelled = true
    }
  }, [userId, gameSlug])

  // ── Manual save ──────────────────────────────────────────────────

  const save = useCallback(
    async (state: T) => {
      if (!userId || !gameSlug) return
      latestStateRef.current = state

      const row = {
        user_id: userId,
        game_slug: gameSlug,
        state: state as unknown,
        saved_at: new Date().toISOString(),
      }

      if (saveIdRef.current) {
        // Update existing save
        await supabase
          .from('game_saves')
          .update({ state: row.state, saved_at: row.saved_at })
          .eq('id', saveIdRef.current)
      } else {
        // Insert new save
        const { data } = await supabase
          .from('game_saves')
          .upsert(row, { onConflict: 'user_id,game_slug' })
          .select('id')
          .single()

        if (data) {
          saveIdRef.current = data.id
        }
      }

      setHasSave(true)
      setSavedState(state)
    },
    [userId, gameSlug],
  )

  // ── Auto-save every 30s ──────────────────────────────────────────

  useEffect(() => {
    if (!userId || !gameSlug) return

    autoSaveTimerRef.current = setInterval(() => {
      if (latestStateRef.current !== null) {
        save(latestStateRef.current)
      }
    }, AUTO_SAVE_INTERVAL_MS)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
        autoSaveTimerRef.current = null
      }
    }
  }, [userId, gameSlug, save])

  // ── Clear save ───────────────────────────────────────────────────

  const clearSave = useCallback(async () => {
    if (!userId || !gameSlug) return

    await supabase
      .from('game_saves')
      .delete()
      .eq('user_id', userId)
      .eq('game_slug', gameSlug)

    setSavedState(null)
    setHasSave(false)
    saveIdRef.current = null
    latestStateRef.current = null
  }, [userId, gameSlug])

  // ── Dismiss (user chose new game) ────────────────────────────────

  const dismissSave = useCallback(() => {
    setSavedState(null)
    setHasSave(false)
    // Don't delete from DB — just clear local state so game starts fresh
    // The auto-save will overwrite with new state
  }, [])

  // ── Submit final score ───────────────────────────────────────────

  const submitScore = useCallback(
    async (result: GameResult): Promise<GameScore | null> => {
      if (!userId || !gameSlug) return null

      // 1. Write to game_scores
      const scoreRow = {
        user_id: userId,
        game_slug: gameSlug,
        score: result.score,
        max_score: result.maxScore,
        stars: result.stars,
        xp_earned: 0, // XP is awarded separately via awardXP
        duration_sec: result.durationSec,
        metadata: result.metadata ?? {},
        played_at: new Date().toISOString(),
      }

      const { data: scoreData, error: scoreErr } = await supabase
        .from('game_scores')
        .insert(scoreRow)
        .select('*')
        .single()

      // 2. Delete the save
      await clearSave()

      if (scoreErr || !scoreData) return null
      return scoreData as unknown as GameScore
    },
    [userId, gameSlug, clearSave],
  )

  // ── Cleanup on unmount ───────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [])

  return {
    savedState,
    hasSave,
    loading,
    save,
    clearSave,
    submitScore,
    dismissSave,
  }
}
