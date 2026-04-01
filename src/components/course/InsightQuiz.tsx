/**
 * InsightQuiz — A personality-style quiz that gives personalized financial insights.
 *
 * Not graded — each answer maps to a "type" dimension. After all questions,
 * reveals a profile with personalized advice. Feels like a BuzzFeed quiz
 * but with genuinely useful financial coaching.
 */

import { useState, useCallback, useEffect } from 'react'
import { Sparkles, RotateCcw, Printer, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Types ────────────────────────────────────────────────────────────

interface QuizOption {
  text: string
  /** Which result type(s) this option adds weight to */
  weights: Record<string, number>
}

interface QuizQuestion {
  question: string
  emoji: string
  options: QuizOption[]
}

interface QuizResult {
  type: string
  title: string
  emoji: string
  description: string
  strengths: string[]
  watchOuts: string[]
  actionTip: string
}

export interface InsightQuizData {
  id: string
  title: string
  subtitle: string
  questions: QuizQuestion[]
  results: QuizResult[]
}

interface InsightQuizProps {
  data: InsightQuizData
  moduleId: string
}

// ── Component ────────────────────────────────────────────────────────

export function InsightQuiz({ data, moduleId }: InsightQuizProps) {
  const storageKey = `insight-quiz-${moduleId}-${data.id}`
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [resultType, setResultType] = useState<QuizResult | null>(null)
  const [animateIn, setAnimateIn] = useState(false)

  // Check for saved result
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.resultType) {
          const result = data.results.find(r => r.type === parsed.resultType)
          if (result) {
            setResultType(result)
            setFinished(true)
            setStarted(true)
          }
        }
      } catch { /* ignore */ }
    }
  }, [storageKey, data.results])

  const question = data.questions[currentQ]
  const totalQ = data.questions.length
  const progress = ((currentQ + 1) / totalQ) * 100

  const handleSelect = useCallback((idx: number) => {
    if (showingFeedback) return
    setSelectedIdx(idx)
    setShowingFeedback(true)

    const option = question.options[idx]
    const newScores = { ...scores }
    for (const [type, weight] of Object.entries(option.weights)) {
      newScores[type] = (newScores[type] ?? 0) + weight
    }
    setScores(newScores)

    setTimeout(() => {
      if (currentQ + 1 >= totalQ) {
        // Calculate result
        const topType = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        const result = data.results.find(r => r.type === topType) ?? data.results[0]
        setResultType(result)
        setFinished(true)
        localStorage.setItem(storageKey, JSON.stringify({ resultType: result.type, scores: newScores }))
        setTimeout(() => setAnimateIn(true), 100)
      } else {
        setCurrentQ(prev => prev + 1)
        setSelectedIdx(null)
        setShowingFeedback(false)
      }
    }, 800)
  }, [currentQ, totalQ, scores, question, showingFeedback, data.results, storageKey])

  const handleRetake = useCallback(() => {
    setStarted(true)
    setCurrentQ(0)
    setScores({})
    setSelectedIdx(null)
    setShowingFeedback(false)
    setFinished(false)
    setResultType(null)
    setAnimateIn(false)
    localStorage.removeItem(storageKey)
  }, [storageKey])

  // ── Intro Card ────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="my-8 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 text-center">
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{data.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{data.subtitle}</p>
        <p className="text-xs text-gray-400 mb-5">{totalQ} questions · ~2 min · Personalized results</p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Take the Quiz
        </button>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────
  if (finished && resultType) {
    return (
      <div className={cn(
        'my-8 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 transition-all duration-500',
        animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}>
        {/* Result header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{resultType.emoji}</div>
          <p className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-1">Your Result</p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{resultType.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">{resultType.description}</p>
        </div>

        {/* Strengths & Watch-outs */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs font-bold uppercase text-emerald-600 mb-2">Your Strengths</p>
            <ul className="space-y-1.5">
              {resultType.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs font-bold uppercase text-amber-600 mb-2">Watch Out For</p>
            <ul className="space-y-1.5">
              {resultType.watchOuts.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="text-amber-500 flex-shrink-0">⚡</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Tip */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
          <p className="text-xs font-bold uppercase text-blue-600 mb-1">Your Action Step</p>
          <p className="text-sm text-blue-800">{resultType.actionTip}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Results
          </button>
        </div>
      </div>
    )
  }

  // ── Question ──────────────────────────────────────────────────────
  return (
    <div className="my-8 rounded-2xl border-2 border-purple-200 bg-white p-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>{data.title}</span>
        <span>{currentQ + 1} of {totalQ}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-5">
        <div className="text-3xl mb-2">{question.emoji}</div>
        <p className="text-base font-semibold text-gray-900">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={showingFeedback}
            className={cn(
              'w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm',
              selectedIdx === idx
                ? 'border-purple-400 bg-purple-50 text-purple-900 font-medium scale-[0.98]'
                : showingFeedback
                  ? 'border-gray-100 bg-gray-50 opacity-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer',
            )}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
