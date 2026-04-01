import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSettings, DEFAULT_SETTINGS, type AppSettings } from '../useSettings'

const STORAGE_KEY = 'fsa_settings'

describe('useSettings', () => {
  beforeEach(() => {
    // localStorage is cleared by global setup, but ensure clean state
    localStorage.removeItem(STORAGE_KEY)
    document.documentElement.classList.remove('dark', 'text-lg', 'reduce-motion')
    document.documentElement.style.removeProperty('--fsa-motion')
  })

  // ── Initialization ───────────────────────────────────────────────

  it('returns default settings on first load', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  it('hydrates settings from localStorage', () => {
    const saved: Partial<AppSettings> = { darkMode: true, soundEffects: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))

    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.darkMode).toBe(true)
    expect(result.current.settings.soundEffects).toBe(false)
    // Unsaved keys should still have defaults
    expect(result.current.settings.notifications).toBe(DEFAULT_SETTINGS.notifications)
  })

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{')
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  // ── update() ─────────────────────────────────────────────────────

  it('merges partial updates into settings', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ darkMode: true, largeText: true })
    })

    expect(result.current.settings.darkMode).toBe(true)
    expect(result.current.settings.largeText).toBe(true)
    // Other settings unchanged
    expect(result.current.settings.notifications).toBe(DEFAULT_SETTINGS.notifications)
  })

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ soundEffects: false })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.soundEffects).toBe(false)
  })

  // ── toggle() ─────────────────────────────────────────────────────

  it('toggles a boolean setting', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.darkMode).toBe(false)

    act(() => {
      result.current.toggle('darkMode')
    })
    expect(result.current.settings.darkMode).toBe(true)

    act(() => {
      result.current.toggle('darkMode')
    })
    expect(result.current.settings.darkMode).toBe(false)
  })

  // ── reset() ──────────────────────────────────────────────────────

  it('resets all settings to defaults', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ darkMode: true, largeText: true, soundEffects: false })
    })
    expect(result.current.settings.darkMode).toBe(true)

    act(() => {
      result.current.reset()
    })
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  // ── Side effects ─────────────────────────────────────────────────

  it('adds "dark" class to <html> when darkMode enabled', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ darkMode: true })
    })
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    act(() => {
      result.current.update({ darkMode: false })
    })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('adds "text-lg" class to <html> when largeText enabled', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ largeText: true })
    })
    expect(document.documentElement.classList.contains('text-lg')).toBe(true)
  })

  it('sets --fsa-motion CSS property and reduce-motion class for reducedMotion', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ reducedMotion: true })
    })
    expect(document.documentElement.style.getPropertyValue('--fsa-motion')).toBe('none')
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true)

    act(() => {
      result.current.update({ reducedMotion: false })
    })
    expect(document.documentElement.style.getPropertyValue('--fsa-motion')).toBe('')
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(false)
  })

  // ── Cross-tab sync ───────────────────────────────────────────────

  it('syncs settings when a storage event fires for the same key', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.darkMode).toBe(false)

    act(() => {
      const event = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify({ darkMode: true }),
      })
      window.dispatchEvent(event)
    })

    expect(result.current.settings.darkMode).toBe(true)
  })

  it('ignores storage events for other keys', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'some_other_key',
        newValue: JSON.stringify({ darkMode: true }),
      })
      window.dispatchEvent(event)
    })

    expect(result.current.settings.darkMode).toBe(false)
  })

  it('ignores storage events with null newValue', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.update({ darkMode: true })
    })
    expect(result.current.settings.darkMode).toBe(true)

    act(() => {
      const event = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: null,
      })
      window.dispatchEvent(event)
    })

    // Should remain unchanged
    expect(result.current.settings.darkMode).toBe(true)
  })

  it('ignores storage events with invalid JSON', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      const event = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: 'broken{json',
      })
      window.dispatchEvent(event)
    })

    // Should remain defaults
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })
})
