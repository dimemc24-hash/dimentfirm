/**
 * StudyGuide — Collapsible review section with key terms, takeaways, and action items.
 *
 * Appears at strategic points in lessons to reinforce learning.
 * Supports flashcard-style term reveals and checkbox action items.
 */

import { useState, useEffect } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Printer, CheckSquare, Square, Lightbulb } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Types ────────────────────────────────────────────────────────────

interface KeyTerm {
  term: string
  definition: string
}

export interface StudyGuideData {
  id: string
  title: string
  keyTerms: KeyTerm[]
  keyTakeaways: string[]
  actionItems: string[]
  proTip?: string
}

interface StudyGuideProps {
  data: StudyGuideData
  moduleId: string
  lessonNum: number
}

// ── Component ────────────────────────────────────────────────────────

export function StudyGuide({ data, moduleId, lessonNum }: StudyGuideProps) {
  const storageKey = `study-guide-${moduleId}-${lessonNum}-${data.id}`
  const [expanded, setExpanded] = useState(false)
  const [revealedTerms, setRevealedTerms] = useState<Set<number>>(new Set())
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  // Load checked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.checked) setCheckedItems(new Set(parsed.checked))
      } catch { /* ignore */ }
    }
  }, [storageKey])

  const toggleTerm = (idx: number) => {
    setRevealedTerms(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const toggleAction = (idx: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      localStorage.setItem(storageKey, JSON.stringify({ checked: Array.from(next) }))
      return next
    })
  }

  const completedActions = checkedItems.size
  const totalActions = data.actionItems.length

  return (
    <div className="my-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Header (always visible) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-blue-100/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{data.title}</p>
            <p className="text-xs text-gray-500">
              {data.keyTerms.length} terms · {data.keyTakeaways.length} takeaways · {totalActions} action items
              {completedActions > 0 && ` · ${completedActions}/${totalActions} done`}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-6">
          {/* Key Terms (flashcard-style) */}
          {data.keyTerms.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Key Terms</p>
              <div className="space-y-2">
                {data.keyTerms.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleTerm(idx)}
                    className={cn(
                      'w-full text-left rounded-xl border-2 p-3 transition-all',
                      revealedTerms.has(idx)
                        ? 'border-blue-300 bg-white'
                        : 'border-gray-200 bg-white/70 hover:border-blue-200',
                    )}
                  >
                    <p className="text-sm font-semibold text-gray-900">{term.term}</p>
                    {revealedTerms.has(idx) ? (
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{term.definition}</p>
                    ) : (
                      <p className="text-xs text-blue-500 mt-1">Tap to reveal definition</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {data.keyTakeaways.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Key Takeaways</p>
              <div className="space-y-2">
                {data.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-white/70 rounded-lg p-3 border border-emerald-100"
                  >
                    <span className="text-emerald-500 text-sm font-bold flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-sm text-gray-700">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items (interactive checkboxes) */}
          {data.actionItems.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">
                Action Items ({completedActions}/{totalActions})
              </p>
              <div className="space-y-2">
                {data.actionItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleAction(idx)}
                    className={cn(
                      'w-full flex items-start gap-3 text-left rounded-lg p-3 border transition-all',
                      checkedItems.has(idx)
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-gray-200 bg-white/70 hover:border-amber-200',
                    )}
                  >
                    {checkedItems.has(idx) ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={cn(
                      'text-sm',
                      checkedItems.has(idx) ? 'text-gray-500 line-through' : 'text-gray-700',
                    )}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pro Tip */}
          {data.proTip && (
            <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-amber-600 mb-1">Pro Tip</p>
                <p className="text-sm text-amber-800">{data.proTip}</p>
              </div>
            </div>
          )}

          {/* Print button */}
          <div className="flex justify-end">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Study Guide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
