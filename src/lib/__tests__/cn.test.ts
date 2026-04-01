import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn — className utility', () => {
  it('merges simple class strings', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles undefined and null inputs', () => {
    expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('handles boolean conditions via clsx', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe('btn btn-active')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    // tailwind-merge should pick the last conflicting utility
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('merges conditional objects', () => {
    expect(cn({ 'bg-red-500': true, 'bg-blue-500': false })).toBe('bg-red-500')
  })

  it('handles arrays of classes', () => {
    expect(cn(['px-2', 'py-4'])).toBe('px-2 py-4')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles empty strings', () => {
    expect(cn('', 'px-4', '')).toBe('px-4')
  })
})
