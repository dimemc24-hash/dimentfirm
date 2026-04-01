import type { ModuleSummary, ModuleMeta, LessonMeta } from '../types/content'
import modulesData from '../content/modules.json'

// ── Module metadata (eagerly loaded) ─────────────────────────────────

const metaModules = import.meta.glob<ModuleMeta>(
  '../content/modules/*/meta.json',
  { eager: true, import: 'default' },
)

export function getModuleList(): ModuleSummary[] {
  return (modulesData as ModuleSummary[]).sort((a, b) => a.order - b.order)
}

export function getModuleById(moduleId: string): ModuleMeta | null {
  const key = Object.keys(metaModules).find(k => k.includes(`/${moduleId}/`))
  if (key) return metaModules[key]

  // Fallback: find by matching id
  const altKey = Object.keys(metaModules).find(k => metaModules[k].id === moduleId)
  return altKey ? metaModules[altKey] : null
}

export function getModuleByOrder(order: number): ModuleMeta | null {
  const key = Object.keys(metaModules).find(k => metaModules[k].order === order)
  return key ? metaModules[key] : null
}

// ── Markdown content (lazy loaded) ───────────────────────────────────

// Map markdown files from docs/content/ by module number
// The markdown files follow the pattern: module-{01..10}-*.md
// We load them from public/ at runtime since they're large authored docs.

const CONTENT_BASE = '/content'

/**
 * Map a module ID to its docs filename.
 * Module IDs: "01-fresh-start", "02-money-story", etc.
 * Filenames: "module-01-welcome.md", "module-02-money-story.md", etc.
 */
const MODULE_FILE_MAP: Record<string, string> = {
  '01-fresh-start': 'module-01-welcome.md',
  '02-money-story': 'module-02-money-story.md',
  '03-budgeting': 'module-03-budgeting.md',
  '04-envelope-system': 'module-04-envelope-system.md',
  '05-emergency-fund': 'module-05-emergency-fund.md',
  '06-healing': 'module-06-healing.md',
  '07-credit-rebuilding': 'module-07-credit-rebuilding.md',
  '08-predatory-traps': 'module-08-predatory-traps.md',
  '09-income-growth': 'module-09-income-growth.md',
  '10-road-map': 'module-10-road-map.md',
}

/** Cache for fetched markdown content */
const contentCache = new Map<string, string>()

/**
 * Load the full markdown content for a module.
 * Returns the raw markdown string.
 */
export async function loadModuleContent(moduleId: string): Promise<string | null> {
  if (contentCache.has(moduleId)) {
    return contentCache.get(moduleId)!
  }

  const filename = MODULE_FILE_MAP[moduleId]
  if (!filename) return null

  try {
    const resp = await fetch(`${CONTENT_BASE}/${filename}`)
    if (!resp.ok) return null
    const text = await resp.text()
    contentCache.set(moduleId, text)
    return text
  } catch {
    console.error(`Failed to load content for module ${moduleId}`)
    return null
  }
}

/**
 * Extract a specific lesson's content from the full module markdown.
 * Lessons are separated by `## Lesson X.Y` headers.
 * Returns the markdown slice for that lesson (including its header).
 */
export function extractLessonContent(moduleMarkdown: string, lessonNum: number): string | null {
  const moduleNum = moduleMarkdown.match(/^#\s*Module\s+(\d+)/m)?.[1]
  if (!moduleNum) return null

  const lessonPattern = new RegExp(
    `^## Lesson ${moduleNum}\\.${lessonNum}\\b`,
    'm',
  )
  const match = lessonPattern.exec(moduleMarkdown)
  if (!match) return null

  const start = match.index

  // Find the start of the next lesson or end-of-module markers
  const nextLesson = new RegExp(
    `^## Lesson ${moduleNum}\\.${lessonNum + 1}\\b`,
    'm',
  )
  const nextMatch = nextLesson.exec(moduleMarkdown.slice(start + 1))

  // Also check for section separators: "### Mini-Quiz", "### Quiz", "## Module N Summary", "---\n---"
  const sectionEnders = [
    /^## Module \d+ Summary/m,
    /^### Mini-Quiz/m,
    /^### Quiz Complete/m,
  ]

  let end = moduleMarkdown.length
  if (nextMatch) {
    end = start + 1 + nextMatch.index
  }

  // Check if any section ender comes before the next lesson
  for (const pattern of sectionEnders) {
    const sectionMatch = pattern.exec(moduleMarkdown.slice(start + 1))
    if (sectionMatch && start + 1 + sectionMatch.index < end) {
      // Only use this as boundary if it's between our lesson and the next
      // (don't cut short if it's part of our lesson)
    }
  }

  return moduleMarkdown.slice(start, end).trim()
}

/**
 * Extract the quiz section from a module's markdown.
 * Quizzes follow "### Mini-Quiz" or "### Quiz" headers.
 */
export function extractQuizContent(moduleMarkdown: string): string | null {
  const quizMatch = moduleMarkdown.match(/^###?\s*(Mini-)?Quiz[:\s]/m)
  if (!quizMatch) return null

  const start = quizMatch.index!
  const endMatch = moduleMarkdown.slice(start).match(/^###?\s*(Quiz Complete|Module \d+ Summary|Badge Earned)/m)
  const end = endMatch ? start + endMatch.index! + endMatch[0].length : moduleMarkdown.length

  // Include through "Quiz Complete" if present
  const completeMatch = moduleMarkdown.slice(start, end + 500).match(/^###?\s*Quiz Complete.*?\n/m)
  if (completeMatch) {
    return moduleMarkdown.slice(start, start + completeMatch.index! + completeMatch[0].length).trim()
  }

  return moduleMarkdown.slice(start, end).trim()
}

/**
 * Get a lesson's metadata from the module meta.
 */
export function getLessonMeta(moduleId: string, lessonIndex: number): LessonMeta | null {
  const moduleMeta = getModuleById(moduleId)
  if (!moduleMeta) return null
  return moduleMeta.lessons[lessonIndex] ?? null
}
