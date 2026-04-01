/**
 * ModuleAssessment — End-of-module insight assessment.
 *
 * Not a test — it's a personalized insight generator. Combines scenario-based
 * questions with self-rating sliders to produce a "Financial Profile" for
 * the topic area, with tailored recommendations.
 */

import { useState, useEffect, useCallback } from 'react'
import { Target, ChevronRight, RotateCcw, Printer, Star, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Types ────────────────────────────────────────────────────────────

interface ScenarioQuestion {
  type: 'scenario'
  scenario: string
  emoji: string
  options: { text: string; insight: string; dimension: string; score: number }[]
}

interface RatingQuestion {
  type: 'rating'
  prompt: string
  emoji: string
  lowLabel: string
  highLabel: string
  dimension: string
}

type AssessmentQuestion = ScenarioQuestion | RatingQuestion

interface ProfileDimension {
  key: string
  label: string
  emoji: string
}

interface Recommendation {
  minScore: number
  maxScore: number
  dimension: string
  title: string
  description: string
  actionStep: string
}

export interface ModuleAssessmentData {
  id: string
  moduleTitle: string
  introText: string
  questions: AssessmentQuestion[]
  dimensions: ProfileDimension[]
  recommendations: Recommendation[]
  /** Overall message keyed by total score range (e.g., "0-30", "31-60", "61-100") */
  overallMessages: { range: [number, number]; title: string; message: string; emoji: string }[]
}

interface ModuleAssessmentProps {
  data: ModuleAssessmentData
  moduleId: string
}

// ── Component ────────────────────────────────────────────────────────

export function ModuleAssessment({ data, moduleId }: ModuleAssessmentProps) {
  const storageKey = `module-assessment-${moduleId}-${data.id}`
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({})
  const [insightMessages, setInsightMessages] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [ratingValue, setRatingValue] = useState(5)
  const [animateResult, setAnimateResult] = useState(false)

  // Check for saved results
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.finished) {
          setDimensionScores(parsed.scores)
          setInsightMessages(parsed.insights || [])
          setFinished(true)
          setStarted(true)
          setTimeout(() => setAnimateResult(true), 100)
        }
      } catch { /* ignore */ }
    }
  }, [storageKey])

  const question = data.questions[currentQ]
  const totalQ = data.questions.length

  const finishAssessment = useCallback(() => {
    setFinished(true)
    setTimeout(() => setAnimateResult(true), 100)
    // Save will happen in the next render cycle when state is updated
    setTimeout(() => {
      const scores = { ...dimensionScores }
      localStorage.setItem(storageKey, JSON.stringify({
        finished: true,
        scores,
        insights: insightMessages,
      }))
    }, 200)
  }, [dimensionScores, insightMessages, storageKey])

  const handleScenarioSelect = useCallback((optIdx: number) => {
    if (!question || question.type !== 'scenario') return
    const opt = question.options[optIdx]

    setDimensionScores(prev => ({
      ...prev,
      [opt.dimension]: (prev[opt.dimension] ?? 0) + opt.score,
    }))
    setInsightMessages(prev => [...prev, opt.insight])

    if (currentQ + 1 >= totalQ) {
      finishAssessment()
    } else {
      setCurrentQ(prev => prev + 1)
      setRatingValue(5)
    }
  }, [currentQ, totalQ, question, finishAssessment])

  const handleRatingSubmit = useCallback(() => {
    if (!question || question.type !== 'rating') return

    setDimensionScores(prev => ({
      ...prev,
      [question.dimension]: (prev[question.dimension] ?? 0) + ratingValue,
    }))

    if (currentQ + 1 >= totalQ) {
      finishAssessment()
    } else {
      setCurrentQ(prev => prev + 1)
      setRatingValue(5)
    }
  }, [currentQ, totalQ, question, ratingValue, finishAssessment])

  const handleRetake = useCallback(() => {
    setStarted(true)
    setCurrentQ(0)
    setDimensionScores({})
    setInsightMessages([])
    setFinished(false)
    setRatingValue(5)
    setAnimateResult(false)
    localStorage.removeItem(storageKey)
  }, [storageKey])

  // Calculate total and per-dimension percentages
  const maxPerDimension = 10
  const totalScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0)
  const maxTotal = data.dimensions.length * maxPerDimension

  // ── Intro ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 text-center">
        <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Module Assessment</h3>
        <p className="text-sm text-gray-900 font-medium mb-1">{data.moduleTitle}</p>
        <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">{data.introText}</p>
        <p className="text-xs text-gray-400 mb-4">{totalQ} questions · Not graded · Personalized insights</p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Target className="w-4 h-4" />
          Start Assessment
        </button>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────
  if (finished) {
    const overallPct = Math.round((totalScore / maxTotal) * 100)
    const overallMsg = data.overallMessages.find(m => overallPct >= m.range[0] && overallPct <= m.range[1])
      ?? data.overallMessages[data.overallMessages.length - 1]

    // Get relevant recommendations
    const recs = data.recommendations.filter(r => {
      const dimScore = dimensionScores[r.dimension] ?? 0
      return dimScore >= r.minScore && dimScore <= r.maxScore
    }).slice(0, 3)

    return (
      <div className={cn(
        'rounded-2xl border-2 border-indigo-200 bg-white p-6 transition-all duration-500',
        animateResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}>
        {/* Overall result */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{overallMsg.emoji}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{overallMsg.title}</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">{overallMsg.message}</p>
        </div>

        {/* Dimension scores */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">Your Profile</p>
          <div className="space-y-3">
            {data.dimensions.map(dim => {
              const score = dimensionScores[dim.key] ?? 0
              const pct = Math.min(100, Math.round((score / maxPerDimension) * 100))
              return (
                <div key={dim.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">
                      {dim.emoji} {dim.label}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-gray-300',
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Personalized recommendations */}
        {recs.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              Personalized Recommendations
            </p>
            <div className="space-y-3">
              {recs.map((rec, idx) => (
                <div key={idx} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{rec.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-start gap-2 bg-white rounded-lg p-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 font-medium">{rec.actionStep}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake
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
  const progress = ((currentQ + 1) / totalQ) * 100

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-white p-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>Module Assessment</span>
        <span>{currentQ + 1} of {totalQ}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {question.type === 'scenario' ? (
        <>
          <div className="text-center mb-5">
            <div className="text-3xl mb-2">{question.emoji}</div>
            <p className="text-sm text-gray-800 leading-relaxed">{question.scenario}</p>
          </div>

          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleScenarioSelect(idx)}
                className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-sm"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">{question.emoji}</div>
            <p className="text-sm font-semibold text-gray-900">{question.prompt}</p>
          </div>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>{question.lowLabel}</span>
              <span>{question.highLabel}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={ratingValue}
              onChange={e => setRatingValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={cn(
                  ratingValue === i + 1 ? 'text-indigo-600 font-bold' : '',
                )}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          {/* Stars visualization */}
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 10 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-5 h-5 transition-all',
                  i < ratingValue
                    ? 'text-indigo-400 fill-indigo-400'
                    : 'text-gray-200',
                )}
              />
            ))}
          </div>

          <button
            onClick={handleRatingSubmit}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  )
}
