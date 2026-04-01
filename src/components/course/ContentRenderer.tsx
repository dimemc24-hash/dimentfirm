/**
 * ContentRenderer — transforms raw markdown lesson content into an interactive UI.
 *
 * Handles:
 *  - :::chapter-7 / :::chapter-13 fenced blocks  → shown/hidden by user path
 *  - 🐇 Hariette / 🐢 Sheldon / 🐇🐢 Both      → MascotDialogue component
 *  - Quiz question blocks                         → QuizBlock component
 *  - Reflection prompts                           → ReflectionPrompt component
 *  - 📊 stat boxes                                → styled callout
 *  - Opening check-in polls                       → interactive poll card
 *  - Standard markdown                            → react-markdown with tailwind prose
 */

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChapterPath } from '../../types/database'
import { MascotDialogue, type MascotType } from './MascotDialogue'
import { FinancialAssessment } from './FinancialAssessment'
import { QuizBlock, type QuizQuestionData } from './QuizBlock'
import { ReflectionPrompt } from './ReflectionPrompt'
import { StatBox } from './StatBox'
import { CheckInPoll } from './CheckInPoll'
import { cn } from '../../lib/cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContentRendererProps {
  /** Raw markdown string from the lesson content file */
  markdown: string
  /** User's chapter path — controls which :::chapter-X blocks are visible */
  chapterPath: ChapterPath
  /** Prefix for generating unique IDs (module+lesson) */
  idPrefix?: string
  /** Callback when a quiz question is answered correctly */
  onQuizCorrect?: (questionId: string, xp: number) => void
  /** Callback when a reflection is completed */
  onReflectionComplete?: (id: string, response: string, xp: number) => void
  /** Callback when a check-in selection is made */
  onCheckIn?: (id: string, choice: string) => void
  /** Set of already-answered question IDs */
  answeredIds?: Set<string>
  /** Map of saved reflection responses by ID */
  savedReflections?: Map<string, string>
  className?: string
}

type Block =
  | { kind: 'prose'; content: string }
  | { kind: 'mascot'; mascotType: MascotType; message: string }
  | { kind: 'quiz'; question: QuizQuestionData }
  | { kind: 'reflection'; id: string; prompt: string; xp: number }
  | { kind: 'stat'; lines: string[] }
  | { kind: 'checkin'; id: string; prompt: string; options: string[] }
  | { kind: 'assessment' }
  | { kind: 'hr' }

// ---------------------------------------------------------------------------
// Markdown Parser → Block[]
// ---------------------------------------------------------------------------

const CHAPTER_FENCE_OPEN = /^:::chapter-(7|13)\s*$/
const CHAPTER_FENCE_CLOSE = /^:::\s*$/
const MASCOT_LINE = /^>\s*(?:🐇🐢|🐇|🐢)\s*\*\*(?:Both say|Hariette says?|Sheldon says?)\s*:?\*\*\s*[:：]?\s*"?(.+?)"?\s*$/
const STAT_BOX_START = /^>\s*\*\*📊/
const QUIZ_QUESTION = /^\*\*Question\s+(\d+)(?:\s*:?\s*)\*\*\s*[:：]?\s*(.+)/
const QUIZ_OPTION = /^-\s+([a-d])\)\s+(.+?)(\s*✅)?\s*$/
const QUIZ_EXPLANATION = /^\*Explanation:\s*(.+)\*$/
const QUIZ_XP = /^\*\[Correct answer:\s*(\d+)\s*XP\]\*$/
const REFLECTION_HEADING = /^###?\s*Reflection\s+Exercise/i
const REFLECTION_PROMPT_BLOCK = /^>\s*\*\*Complete this sentence:\*\*|^>\s*\*\*Reflect/i
const XP_EARN = /\*\[Completing this reflection earns\s+(\d+)\s*XP\]\*/

function detectMascotType(line: string): MascotType | null {
  if (/🐇🐢/.test(line)) return 'shared'
  if (/🐇/.test(line)) return 'ch7'
  if (/🐢/.test(line)) return 'ch13'
  return null
}

function extractMascotMessage(line: string): string {
  // Strip leading "> ", emoji, **Name says:** prefix, and surrounding quotes
  const m = line.match(/\*\*(?:Both say|Hariette says?|Sheldon says?)\s*:?\*\*\s*[:：]?\s*"?(.+?)"?\s*$/)
  return m ? m[1] : line.replace(/^>\s*/, '')
}

function parseBlocks(markdown: string, chapterPath: ChapterPath, idPrefix: string): Block[] {
  const lines = markdown.split('\n')
  const blocks: Block[] = []
  let i = 0
  let proseAccum: string[] = []
  let quizCounter = 0
  let reflectionCounter = 0
  let checkinCounter = 0

  function flushProse() {
    const text = proseAccum.join('\n').trim()
    if (text) blocks.push({ kind: 'prose', content: text })
    proseAccum = []
  }

  while (i < lines.length) {
    const line = lines[i]

    // ---------------------------------------------------------------
    // 1. Chapter-gated fences  :::chapter-7 / :::chapter-13
    // ---------------------------------------------------------------
    const fenceMatch = CHAPTER_FENCE_OPEN.exec(line)
    if (fenceMatch) {
      flushProse()
      const fenceChapter = fenceMatch[1] === '7' ? 'ch7' : 'ch13'
      i++ // skip opening fence
      const innerLines: string[] = []
      while (i < lines.length && !CHAPTER_FENCE_CLOSE.test(lines[i])) {
        innerLines.push(lines[i])
        i++
      }
      i++ // skip closing :::

      // Only include content for the user's chapter path
      if (fenceChapter === chapterPath) {
        const innerBlocks = parseInnerContent(innerLines, chapterPath, idPrefix)
        blocks.push(...innerBlocks)
      }
      continue
    }

    // ---------------------------------------------------------------
    // 2. Mascot dialogue (unfenced — shared "Both say" blocks)
    // ---------------------------------------------------------------
    if (MASCOT_LINE.test(line)) {
      flushProse()
      const mascotType = detectMascotType(line)!
      const message = extractMascotMessage(line)
      blocks.push({ kind: 'mascot', mascotType, message })
      i++
      continue
    }

    // ---------------------------------------------------------------
    // 3. Stat box — > **📊 ... multi-line blockquote
    // ---------------------------------------------------------------
    if (STAT_BOX_START.test(line)) {
      flushProse()
      const statLines: string[] = [line.replace(/^>\s*/, '')]
      i++
      while (i < lines.length && /^>/.test(lines[i])) {
        const stripped = lines[i].replace(/^>\s*/, '')
        if (stripped.trim()) statLines.push(stripped)
        i++
      }
      blocks.push({ kind: 'stat', lines: statLines })
      continue
    }

    // ---------------------------------------------------------------
    // 4. Quiz question blocks
    // ---------------------------------------------------------------
    const quizMatch = QUIZ_QUESTION.exec(line)
    if (quizMatch) {
      flushProse()
      const questionText = quizMatch[2]
      const options: { text: string; isCorrect: boolean }[] = []
      let explanation = ''
      let xp = 10
      i++

      while (i < lines.length) {
        const ol = lines[i]
        const optMatch = QUIZ_OPTION.exec(ol)
        if (optMatch) {
          options.push({ text: optMatch[2].trim(), isCorrect: !!optMatch[3] })
          i++
          continue
        }
        const explMatch = QUIZ_EXPLANATION.exec(ol)
        if (explMatch) {
          explanation = explMatch[1]
          i++
          continue
        }
        const xpMatch = QUIZ_XP.exec(ol)
        if (xpMatch) {
          xp = parseInt(xpMatch[1], 10)
          i++
          continue
        }
        // Skip blank lines and --- between questions
        if (ol.trim() === '' || ol.trim() === '---') {
          i++
          // Check if next non-blank line is another question or end of quiz section
          if (ol.trim() === '---') break
          continue
        }
        break
      }

      if (options.length > 0) {
        quizCounter++
        blocks.push({
          kind: 'quiz',
          question: {
            id: `${idPrefix}-quiz-${quizCounter}`,
            question: questionText,
            options,
            explanation,
            xp,
          },
        })
      }
      continue
    }

    // ---------------------------------------------------------------
    // 5a. Financial Well-Being Assessment (interactive component)
    // ---------------------------------------------------------------
    if (/^###\s*Your Financial Well-Being Assessment/i.test(line)) {
      flushProse()
      i++ // skip heading
      // Skip all static assessment content until next ### heading
      while (i < lines.length && !/^###\s/.test(lines[i])) {
        i++
      }
      blocks.push({ kind: 'assessment' })
      continue
    }

    // ---------------------------------------------------------------
    // 5b. Opening Check-In polls (blockquote with emoji options)
    // ---------------------------------------------------------------
    if (/^###\s*Opening Check-In/i.test(line)) {
      flushProse()
      i++ // skip heading

      // Gather lines until next --- or ###
      const pollLines: string[] = []
      while (i < lines.length && !/^---\s*$/.test(lines[i]) && !/^###?\s/.test(lines[i])) {
        pollLines.push(lines[i])
        i++
      }

      // Parse prompt and options from the poll lines
      const promptLines: string[] = []
      const optionItems: string[] = []
      let inBlockquote = false
      for (const pl of pollLines) {
        if (/^>\s/.test(pl)) {
          inBlockquote = true
          const content = pl.replace(/^>\s*/, '')
          if (/^-\s/.test(content)) {
            optionItems.push(content.replace(/^-\s*/, '').trim())
          } else if (content.trim()) {
            promptLines.push(content)
          }
        } else if (inBlockquote && /^-\s/.test(pl)) {
          optionItems.push(pl.replace(/^-\s*/, '').trim())
        } else if (pl.trim() && !inBlockquote) {
          // Non-blockquote prose before check-in
          promptLines.push(pl)
        }
      }

      if (optionItems.length > 0) {
        checkinCounter++
        const prompt = promptLines.join(' ').replace(/\*\*/g, '').trim()
        blocks.push({
          kind: 'checkin',
          id: `${idPrefix}-checkin-${checkinCounter}`,
          prompt,
          options: optionItems,
        })
      } else {
        // No options found — treat as prose
        blocks.push({ kind: 'prose', content: `### Opening Check-In\n${pollLines.join('\n')}` })
      }
      continue
    }

    // ---------------------------------------------------------------
    // 6. Reflection exercise
    // ---------------------------------------------------------------
    if (REFLECTION_HEADING.test(line) || REFLECTION_PROMPT_BLOCK.test(line)) {
      flushProse()
      const reflectionLines: string[] = []
      if (REFLECTION_HEADING.test(line)) {
        i++ // skip heading
      }

      // Gather the reflection block
      while (i < lines.length) {
        const rl = lines[i]
        if (/^---\s*$/.test(rl) || /^##\s/.test(rl)) break
        reflectionLines.push(rl)
        i++
      }

      // Extract prompt and XP
      const fullText = reflectionLines.join('\n')
      let prompt = ''
      let xpVal = 50

      // Look for blockquote prompt — gather all blockquote lines as the prompt
      const blockquoteLines = reflectionLines
        .filter(l => /^>/.test(l))
        .map(l => l.replace(/^>\s*/, '').replace(/\*\*/g, '').trim())
        .filter(l => l && !XP_EARN.test(l) && !MASCOT_LINE.test(l))
      if (blockquoteLines.length > 0) {
        prompt = blockquoteLines.join('\n')
      } else {
        // Use the whole block as the prompt
        prompt = reflectionLines
          .filter(l => l.trim() && !XP_EARN.test(l) && !MASCOT_LINE.test(l))
          .map(l => l.replace(/^>\s*/, ''))
          .join('\n')
          .trim()
      }

      const xpMatchR = XP_EARN.exec(fullText)
      if (xpMatchR) xpVal = parseInt(xpMatchR[1], 10)

      // Check for any mascot lines in the reflection block
      for (const rl of reflectionLines) {
        if (MASCOT_LINE.test(rl)) {
          const mt = detectMascotType(rl)!
          blocks.push({ kind: 'mascot', mascotType: mt, message: extractMascotMessage(rl) })
        }
      }

      if (prompt) {
        reflectionCounter++
        blocks.push({
          kind: 'reflection',
          id: `${idPrefix}-reflection-${reflectionCounter}`,
          prompt: prompt.replace(/\*\*/g, '').trim(),
          xp: xpVal,
        })
      }
      continue
    }

    // ---------------------------------------------------------------
    // 7. Horizontal rules
    // ---------------------------------------------------------------
    if (/^---\s*$/.test(line)) {
      flushProse()
      blocks.push({ kind: 'hr' })
      i++
      continue
    }

    // ---------------------------------------------------------------
    // 8. XP earning lines (standalone) — suppress from prose
    // ---------------------------------------------------------------
    if (XP_EARN.test(line)) {
      i++
      continue
    }

    // ---------------------------------------------------------------
    // Default: accumulate as prose
    // ---------------------------------------------------------------
    proseAccum.push(line)
    i++
  }

  flushProse()
  return blocks
}

/**
 * Parse inner content from a chapter-gated fence (already filtered by chapter).
 * This re-uses the mascot detection but avoids recursing into chapter fences.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseInnerContent(lines: string[], _chapterPath: ChapterPath, _idPrefix: string): Block[] {
  const blocks: Block[] = []

  for (const line of lines) {
    if (MASCOT_LINE.test(line)) {
      const mascotType = detectMascotType(line)!
      const message = extractMascotMessage(line)
      blocks.push({ kind: 'mascot', mascotType, message })
    } else if (line.trim()) {
      // Non-mascot content inside a chapter fence — render as prose
      blocks.push({ kind: 'prose', content: line.replace(/^>\s*/, '') })
    }
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Markdown prose renderer
// ---------------------------------------------------------------------------

function ProseBlock({ content }: { content: string }) {
  return (
    <div className="prose prose-gray prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-indigo-200 prose-blockquote:bg-indigo-50/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-strong:text-gray-900 prose-table:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ContentRenderer({
  markdown,
  chapterPath,
  idPrefix = 'lesson',
  onQuizCorrect,
  onReflectionComplete,
  onCheckIn,
  answeredIds,
  savedReflections,
  className,
}: ContentRendererProps) {
  const blocks = useMemo(
    () => parseBlocks(markdown, chapterPath, idPrefix),
    [markdown, chapterPath, idPrefix],
  )

  return (
    <div className={cn('space-y-1', className)}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'prose':
            return <ProseBlock key={index} content={block.content} />

          case 'mascot':
            return (
              <MascotDialogue
                key={index}
                mascotType={block.mascotType}
                message={block.message}
              />
            )

          case 'quiz':
            return (
              <QuizBlock
                key={block.question.id}
                question={block.question}
                onCorrect={onQuizCorrect}
                answered={answeredIds?.has(block.question.id)}
              />
            )

          case 'reflection':
            return (
              <ReflectionPrompt
                key={block.id}
                id={block.id}
                prompt={block.prompt}
                xp={block.xp}
                onComplete={onReflectionComplete}
                savedResponse={savedReflections?.get(block.id)}
              />
            )

          case 'stat':
            return <StatBox key={index} lines={block.lines} />

          case 'checkin':
            return (
              <CheckInPoll
                key={block.id}
                id={block.id}
                prompt={block.prompt}
                options={block.options}
                onSelect={onCheckIn}
              />
            )

          case 'assessment':
            return <FinancialAssessment key={index} />

          case 'hr':
            return <hr key={index} className="my-8 border-gray-200" />

          default:
            return null
        }
      })}
    </div>
  )
}
