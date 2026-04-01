import { describe, it, expect } from 'vitest'
import { extractLessonContent, extractQuizContent } from '../content-loader'

// ── Sample markdown ──────────────────────────────────────────────────

const SAMPLE_MODULE_MARKDOWN = `# Module 3 — Budgeting Basics

Welcome to Module 3! In this module, you'll learn how to create a budget.

## Lesson 3.1 — Why Budgeting Matters

Budgeting is the foundation of financial recovery. After bankruptcy, every dollar counts.

### Key Concepts

- **Zero-based budgeting**: Every dollar has a job
- **50/30/20 rule**: A simple starting framework
- **Tracking expenses**: Know where your money goes

:::mascot hariette
"I know budgeting sounds boring, but trust me — it's your superpower!"
:::

## Lesson 3.2 — Your First Budget

Let's create your first post-bankruptcy budget step by step.

### Step 1: List Your Income

Write down every source of income you have:
- Primary job
- Side gigs
- Benefits / assistance

### Step 2: List Your Expenses

Categorize your expenses:
1. Housing
2. Utilities
3. Food
4. Transportation

## Lesson 3.3 — Budget Tools and Apps

There are many free tools to help you budget:

- **Mint** — automated tracking
- **YNAB** — zero-based method
- **EveryDollar** — Dave Ramsey's app
- **Pen and paper** — still works!

### Mini-Quiz: Budgeting Basics

**Q1.** What percentage should go to needs in the 50/30/20 rule?
- A) 20%
- B) 30%
- C) 50% ✓
- D) 80%

**Q2.** What is zero-based budgeting?
- A) Having zero savings
- B) Every dollar assigned a purpose ✓
- C) Spending nothing
- D) Using only cash

### Quiz Complete! 🎉

Great job! You've mastered budgeting basics.

## Module 3 Summary

You learned how to create and maintain a budget. Key takeaways:
- Budget every dollar
- Track your spending
- Use tools that work for you
`

// ── extractLessonContent ─────────────────────────────────────────────

describe('extractLessonContent', () => {
  it('extracts the first lesson content', () => {
    const result = extractLessonContent(SAMPLE_MODULE_MARKDOWN, 1)
    expect(result).not.toBeNull()
    expect(result).toContain('## Lesson 3.1 — Why Budgeting Matters')
    expect(result).toContain('Zero-based budgeting')
    expect(result).toContain('superpower')
    // Should NOT contain Lesson 3.2
    expect(result).not.toContain('## Lesson 3.2')
  })

  it('extracts the second lesson content', () => {
    const result = extractLessonContent(SAMPLE_MODULE_MARKDOWN, 2)
    expect(result).not.toBeNull()
    expect(result).toContain('## Lesson 3.2 — Your First Budget')
    expect(result).toContain('Step 1: List Your Income')
    expect(result).toContain('Step 2: List Your Expenses')
    // Should NOT contain Lesson 3.3
    expect(result).not.toContain('## Lesson 3.3')
  })

  it('extracts the last lesson content', () => {
    const result = extractLessonContent(SAMPLE_MODULE_MARKDOWN, 3)
    expect(result).not.toBeNull()
    expect(result).toContain('## Lesson 3.3 — Budget Tools and Apps')
    expect(result).toContain('Mint')
    expect(result).toContain('YNAB')
  })

  it('returns null for a non-existent lesson', () => {
    const result = extractLessonContent(SAMPLE_MODULE_MARKDOWN, 99)
    expect(result).toBeNull()
  })

  it('returns null for markdown without a module header', () => {
    const result = extractLessonContent('# Some Other Document\n\nContent here.', 1)
    expect(result).toBeNull()
  })

  it('returns trimmed content (no leading/trailing whitespace)', () => {
    const result = extractLessonContent(SAMPLE_MODULE_MARKDOWN, 1)
    expect(result).toBe(result?.trim())
  })
})

// ── extractQuizContent ───────────────────────────────────────────────

describe('extractQuizContent', () => {
  it('extracts quiz content from module markdown', () => {
    const result = extractQuizContent(SAMPLE_MODULE_MARKDOWN)
    expect(result).not.toBeNull()
    expect(result).toContain('Mini-Quiz: Budgeting Basics')
    expect(result).toContain('Q1.')
    expect(result).toContain('Q2.')
  })

  it('includes the Quiz Complete section when present', () => {
    const result = extractQuizContent(SAMPLE_MODULE_MARKDOWN)
    expect(result).not.toBeNull()
    expect(result).toContain('Quiz Complete')
  })

  it('returns null when no quiz is present', () => {
    const noQuizMarkdown = `# Module 1 — Welcome

## Lesson 1.1 — Getting Started

Welcome to the course!
`
    const result = extractQuizContent(noQuizMarkdown)
    expect(result).toBeNull()
  })

  it('returns trimmed content', () => {
    const result = extractQuizContent(SAMPLE_MODULE_MARKDOWN)
    expect(result).toBe(result?.trim())
  })
})
