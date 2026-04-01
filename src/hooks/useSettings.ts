/**
 * useSettings — Persistent settings hook with localStorage sync
 *
 * Extracts all user preferences from Settings.tsx into a reusable hook.
 * Settings are persisted to localStorage and hydrated on mount.
 * Other components can import this to react to settings (e.g., darkMode,
 * reducedMotion, soundEffects).
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

// ── Constants ────────────────────────────────────────────────────────

const STORAGE_KEY = 'fsa_settings'

// ── Types ────────────────────────────────────────────────────────────

export interface AppSettings {
  // Notifications
  notifications: boolean
  soundEffects: boolean
  hapticFeedback: boolean

  // Appearance
  darkMode: boolean
  largeText: boolean
  reducedMotion: boolean
  showXPAnimations: boolean
}

export interface UseSettingsReturn {
  /** Current settings object */
  settings: AppSettings
  /** Update one or more settings (partial merge) */
  update: (patch: Partial<AppSettings>) => void
  /** Toggle a boolean setting by key */
  toggle: (key: keyof AppSettings) => void
  /** Reset all settings to defaults */
  reset: () => void
}

// ── Defaults ─────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  soundEffects: true,
  hapticFeedback: true,
  darkMode: false,
  largeText: false,
  reducedMotion: false,
  showXPAnimations: true,
}

// ── Helpers ──────────────────────────────────────────────────────────

function loadFromStorage(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    // Merge with defaults so new settings added later get their defaults
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function saveToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(loadFromStorage)

  // Persist whenever settings change
  useEffect(() => {
    saveToStorage(settings)
  }, [settings])

  // Sync across tabs via storage event
  useEffect(() => {
    function handleStorageEvent(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Partial<AppSettings>
          setSettings(prev => ({ ...prev, ...parsed }))
        } catch {
          // ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [])

  // Apply side effects for certain settings
  useEffect(() => {
    // Dark mode: toggle class on <html> element
    const root = document.documentElement
    if (settings.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.darkMode])

  useEffect(() => {
    // Large text: toggle class on <html> element
    const root = document.documentElement
    if (settings.largeText) {
      root.classList.add('text-lg')
    } else {
      root.classList.remove('text-lg')
    }
  }, [settings.largeText])

  useEffect(() => {
    // Reduced motion: apply via CSS custom property
    const root = document.documentElement
    if (settings.reducedMotion) {
      root.style.setProperty('--fsa-motion', 'none')
      root.classList.add('reduce-motion')
    } else {
      root.style.removeProperty('--fsa-motion')
      root.classList.remove('reduce-motion')
    }
  }, [settings.reducedMotion])

  // ── Methods ──────────────────────────────────────────────────────

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }))
  }, [])

  const toggle = useCallback((key: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS })
  }, [])

  return useMemo(
    () => ({ settings, update, toggle, reset }),
    [settings, update, toggle, reset],
  )
}
