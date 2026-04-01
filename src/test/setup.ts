/// <reference types="vitest/globals" />
/**
 * Vitest + React Testing Library — Global test setup
 *
 * This file is referenced by vite.config.ts → test.setupFiles.
 * It runs before every test file.
 */

import '@testing-library/jest-dom'

// ── Mock localStorage ────────────────────────────────────────────────
// jsdom provides localStorage, but we add a helper to reset it between tests.

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

// ── Mock window.matchMedia ───────────────────────────────────────────
// jsdom doesn't implement matchMedia; many components use it.

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ── Mock crypto.randomUUID ───────────────────────────────────────────
// jsdom may not have crypto.randomUUID in all environments.

if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      ...globalThis.crypto,
      randomUUID: () =>
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0
          const v = c === 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }),
    },
  })
}

// ── Suppress console noise in tests ──────────────────────────────────
// Uncomment to silence expected warnings during tests:
// vi.spyOn(console, 'warn').mockImplementation(() => {})
// vi.spyOn(console, 'error').mockImplementation(() => {})

// ── Mock IntersectionObserver ────────────────────────────────────────
// Many UI components use IntersectionObserver for lazy loading.

class MockIntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds: ReadonlyArray<number> = [0]
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// ── Mock ResizeObserver ──────────────────────────────────────────────

class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
})
