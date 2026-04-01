/**
 * useSwipeNav — detects horizontal swipe gestures on touch devices.
 * Used for lesson prev/next navigation on mobile.
 *
 * Returns a ref to attach to the swipeable container element.
 */

import { useRef, useEffect, useCallback } from 'react'

interface UseSwipeNavOptions {
  /** Called on a left swipe (finger moves left → navigate forward) */
  onSwipeLeft?: () => void
  /** Called on a right swipe (finger moves right → navigate back) */
  onSwipeRight?: () => void
  /** Minimum horizontal distance in px to trigger (default: 80) */
  threshold?: number
  /** Maximum vertical distance to still count as horizontal swipe (default: 100) */
  maxVertical?: number
  /** Whether swipe detection is enabled (default: true) */
  enabled?: boolean
}

export function useSwipeNav<T extends HTMLElement = HTMLDivElement>({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  maxVertical = 100,
  enabled = true,
}: UseSwipeNavOptions) {
  const ref = useRef<T>(null)
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
  }, [enabled])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStart.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStart.current.x
    const dy = touch.clientY - touchStart.current.y
    const dt = Date.now() - touchStart.current.time
    touchStart.current = null

    // Must be a quick swipe (under 500ms) and primarily horizontal
    if (dt > 500) return
    if (Math.abs(dy) > maxVertical) return
    if (Math.abs(dx) < threshold) return

    if (dx < 0) {
      onSwipeLeft?.()
    } else {
      onSwipeRight?.()
    }
  }, [enabled, threshold, maxVertical, onSwipeLeft, onSwipeRight])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])

  return ref
}
