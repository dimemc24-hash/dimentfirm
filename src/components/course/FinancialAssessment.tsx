import { useState, useRef, useCallback } from 'react'
import { Printer, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Assessment data (CFPB Financial Well-Being framework) ────────────

interface RadioQuestion {
  id: number
  text: string
  options: string[]
  type: 'radio'
}

interface CheckboxQuestion {
  id: number
  text: string
  options: string[]
  type: 'checkbox'
  hasOther: boolean
}

interface OpenQuestion {
  id: number
  text: string
  type: 'open'
}

type Question = RadioQuestion | CheckboxQuestion | OpenQuestion

interface Section {
  title: string
  subtitle: string
  questions: Question[]
}

const SECTIONS: Section[] = [
  {
    title: 'Section A',
    subtitle: 'Day-to-Day Money Management',
    questions: [
      { id: 1, text: '"I feel in control of my day-to-day finances."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
      { id: 2, text: '"I know how much money I have coming in each month."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
      { id: 3, text: '"I know how much money I spend each month."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
      { id: 4, text: '"I can pay my bills on time each month."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
    ],
  },
  {
    title: 'Section B',
    subtitle: 'Handling the Unexpected',
    questions: [
      { id: 5, text: '"If I had an unexpected expense of $400, I could cover it without borrowing."', options: ['Definitely not', 'Probably not', 'Maybe', 'Probably yes', 'Definitely yes'], type: 'radio' },
      { id: 6, text: '"I have money set aside for emergencies."', options: ['None at all', 'Less than one week of expenses', '1\u20132 weeks of expenses', 'About a month of expenses', 'More than a month of expenses'], type: 'radio' },
      { id: 7, text: '"I worry about being able to cover my basic needs (food, housing, utilities)."', options: ['All the time', 'Often', 'Sometimes', 'Rarely', 'Never'], type: 'radio' },
    ],
  },
  {
    title: 'Section C',
    subtitle: 'Financial Goals and Future',
    questions: [
      { id: 8, text: '"I have financial goals for the future."', options: ['Not at all', "I've thought about it vaguely", 'I have some ideas but nothing written down', 'I have clear goals in mind', 'I have written goals with plans to achieve them'], type: 'radio' },
      { id: 9, text: '"I feel confident I can achieve financial stability."', options: ['Not at all confident', 'Slightly confident', 'Somewhat confident', 'Quite confident', 'Very confident'], type: 'radio' },
      { id: 10, text: '"I understand how credit scores work and what affects mine."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
    ],
  },
  {
    title: 'Section D',
    subtitle: 'Knowledge and Support',
    questions: [
      { id: 11, text: '"I know where to go if I have a financial question."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
      { id: 12, text: '"I feel comfortable talking about money."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
      { id: 13, text: '"I understand the terms and conditions of my current financial accounts (bank accounts, any remaining debts, etc.)."', options: ['Not at all', 'A little', 'Somewhat', 'Mostly', 'Completely'], type: 'radio' },
    ],
  },
  {
    title: 'Section E',
    subtitle: 'Emotional Relationship with Money',
    questions: [
      { id: 14, text: '"Thinking about my finances makes me feel:"', options: ['Anxious', 'Overwhelmed', 'Ashamed', 'Hopeful', 'Determined', 'Numb', 'Curious', 'Confident'], type: 'checkbox', hasOther: true },
      { id: 15, text: '"The thing I most want to learn in this course is:"', type: 'open' },
    ],
  },
]

const SECTION_LABELS = [
  'Day-to-day management',
  'Emergency preparedness',
  'Goal orientation',
  'Financial knowledge',
  'Emotional health',
]

// ── Helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'financial-assessment-responses'

interface SavedState {
  radioAnswers: Record<number, number>
  checkboxAnswers: Record<number, string[]>
  otherText: string
  openAnswers: Record<number, string>
}

function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToDisk(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* quota exceeded — silent */ }
}

// ── Component ────────────────────────────────────────────────────────

interface FinancialAssessmentProps {
  className?: string
}

export function FinancialAssessment({ className }: FinancialAssessmentProps) {
  const saved = loadSaved()
  const [radioAnswers, setRadioAnswers] = useState<Record<number, number>>(saved?.radioAnswers ?? {})
  const [checkboxAnswers, setCheckboxAnswers] = useState<Record<number, string[]>>(saved?.checkboxAnswers ?? {})
  const [otherText, setOtherText] = useState(saved?.otherText ?? '')
  const [openAnswers, setOpenAnswers] = useState<Record<number, string>>(saved?.openAnswers ?? {})
  const [showResults, setShowResults] = useState(false)
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Count how many radio questions are answered
  const radioQuestionIds = SECTIONS.flatMap(s => s.questions.filter(q => q.type === 'radio').map(q => q.id))
  const answeredCount = radioQuestionIds.filter(id => radioAnswers[id] !== undefined).length
  const totalRadio = radioQuestionIds.length
  const allRadioAnswered = answeredCount === totalRadio

  // Persist on every change
  const persist = useCallback((
    r: Record<number, number>,
    c: Record<number, string[]>,
    ot: string,
    o: Record<number, string>,
  ) => {
    saveToDisk({ radioAnswers: r, checkboxAnswers: c, otherText: ot, openAnswers: o })
  }, [])

  const handleRadioSelect = (questionId: number, optionIdx: number) => {
    const next = { ...radioAnswers, [questionId]: optionIdx }
    setRadioAnswers(next)
    persist(next, checkboxAnswers, otherText, openAnswers)
  }

  const handleCheckboxToggle = (questionId: number, option: string) => {
    const current = checkboxAnswers[questionId] || []
    const next = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option]
    const updated = { ...checkboxAnswers, [questionId]: next }
    setCheckboxAnswers(updated)
    persist(radioAnswers, updated, otherText, openAnswers)
  }

  const handleOtherText = (text: string) => {
    setOtherText(text)
    persist(radioAnswers, checkboxAnswers, text, openAnswers)
  }

  const handleOpenAnswer = (questionId: number, text: string) => {
    const next = { ...openAnswers, [questionId]: text }
    setOpenAnswers(next)
    persist(radioAnswers, checkboxAnswers, otherText, next)
  }

  const handleShowResults = () => {
    setShowResults(true)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handlePrint = () => {
    window.print()
  }

  // Calculate section averages (1-5 scale)
  const sectionScores = SECTIONS.slice(0, 4).map(section => {
    const ids = section.questions.filter(q => q.type === 'radio').map(q => q.id)
    const answered = ids.filter(id => radioAnswers[id] !== undefined)
    if (answered.length === 0) return null
    const sum = answered.reduce((acc, id) => acc + (radioAnswers[id] + 1), 0) // +1 for 1-indexed
    return { avg: sum / answered.length, count: answered.length, total: ids.length }
  })

  return (
    <div className={cn('my-8', className)} id="financial-assessment">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 p-5 sm:p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Financial Well-Being Assessment</h3>
        <p className="text-sm text-gray-600 mb-2">
          <em>Adapted from the Consumer Financial Protection Bureau (CFPB) Financial Well-Being framework</em>
        </p>
        <p className="text-sm text-gray-600">
          The <strong>CFPB</strong> (Consumer Financial Protection Bureau) is a U.S. government agency that helps
          protect consumers in the financial marketplace. They developed this framework to help people understand
          their overall financial health.
        </p>
        <p className="text-sm text-gray-700 mt-3 font-medium">
          For each statement, choose the response that best describes your situation <strong>right now, today</strong>:
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm mb-4 px-1">
        <span className="text-gray-500">{answeredCount} of {totalRadio} questions answered</span>
        <span className="text-xs text-gray-400">Responses auto-save</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / totalRadio) * 100}%` }}
        />
      </div>

      {/* Sections */}
      {SECTIONS.map((section, sIdx) => (
        <div key={sIdx} className="mb-6">
          <button
            onClick={() => setExpandedSection(expandedSection === sIdx ? null : sIdx)}
            className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">{section.title}: {section.subtitle}</p>
              <p className="text-xs text-gray-400">
                {section.questions.filter(q => q.type === 'radio').filter(q => radioAnswers[q.id] !== undefined).length}
                /{section.questions.filter(q => q.type === 'radio').length} answered
                {section.questions.some(q => q.type === 'checkbox') && checkboxAnswers[14]?.length ? ` + emotions selected` : ''}
              </p>
            </div>
            {expandedSection === sIdx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {(expandedSection === sIdx || expandedSection === null) && (
            <div className="mt-2 space-y-4 pl-1">
              {section.questions.map(question => (
                <div key={question.id} className="bg-white rounded-xl border border-gray-200 p-4 print:break-inside-avoid">
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    {question.id}. {question.text}
                    {question.type === 'checkbox' && <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>}
                    {question.type === 'open' && <span className="text-gray-400 font-normal ml-1">(open response)</span>}
                  </p>

                  {/* Radio buttons */}
                  {question.type === 'radio' && (
                    <div className="space-y-1.5">
                      {(question as RadioQuestion).options.map((option, oIdx) => (
                        <label
                          key={oIdx}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm',
                            radioAnswers[question.id] === oIdx
                              ? 'bg-indigo-50 text-indigo-800 font-medium'
                              : 'hover:bg-gray-50 text-gray-700',
                          )}
                        >
                          <input
                            type="radio"
                            name={`q-${question.id}`}
                            checked={radioAnswers[question.id] === oIdx}
                            onChange={() => handleRadioSelect(question.id, oIdx)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Checkboxes */}
                  {question.type === 'checkbox' && (
                    <div className="space-y-1.5">
                      {(question as CheckboxQuestion).options.map(option => (
                        <label
                          key={option}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm',
                            (checkboxAnswers[question.id] || []).includes(option)
                              ? 'bg-indigo-50 text-indigo-800 font-medium'
                              : 'hover:bg-gray-50 text-gray-700',
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={(checkboxAnswers[question.id] || []).includes(option)}
                            onChange={() => handleCheckboxToggle(question.id, option)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          {option}
                        </label>
                      ))}
                      {(question as CheckboxQuestion).hasOther && (
                        <div className="flex items-center gap-3 px-3 py-2">
                          <input
                            type="checkbox"
                            checked={(checkboxAnswers[question.id] || []).includes('Other')}
                            onChange={() => handleCheckboxToggle(question.id, 'Other')}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Other:</span>
                          <input
                            type="text"
                            value={otherText}
                            onChange={e => handleOtherText(e.target.value)}
                            placeholder="Type here..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Open text */}
                  {question.type === 'open' && (
                    <textarea
                      value={openAnswers[question.id] || ''}
                      onChange={e => handleOpenAnswer(question.id, e.target.value)}
                      placeholder="Take your time. There are no wrong answers..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* See Results button */}
      {!showResults && (
        <button
          onClick={handleShowResults}
          disabled={!allRadioAnswered}
          className={cn(
            'w-full py-3 rounded-xl font-semibold transition-all text-sm',
            allRadioAnswered
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          {allRadioAnswered
            ? 'See Your Results'
            : `Answer all questions to see results (${answeredCount}/${totalRadio})`}
        </button>
      )}

      {/* Results */}
      {showResults && (
        <div ref={resultsRef} className="mt-8 print:mt-4" id="assessment-results">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="text-lg font-bold text-gray-900">Your Financial Baseline</h4>
            </div>

            <p className="text-sm text-gray-600 mb-5">
              This isn't scored like a test. It shows where you are right now across five areas.
              At the end of the course, you'll take this again to see how far you've come.
            </p>

            {/* Section summaries */}
            <div className="space-y-3 mb-6">
              {sectionScores.map((score, idx) => {
                if (!score) return null
                const pct = (score.avg / 5) * 100
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-700">{SECTION_LABELS[idx]}</span>
                      <span className="text-gray-500">
                        {score.avg.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden border border-emerald-200">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Emotional check */}
            {(checkboxAnswers[14]?.length > 0 || otherText) && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">How money makes you feel</p>
                <div className="flex flex-wrap gap-1.5">
                  {(checkboxAnswers[14] || []).map(emotion => (
                    <span key={emotion} className="px-2.5 py-1 rounded-full bg-white/80 border border-emerald-200 text-xs font-medium text-gray-700">
                      {emotion === 'Other' && otherText ? otherText : emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Open response */}
            {openAnswers[15] && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">What you most want to learn</p>
                <p className="text-sm text-gray-700 italic">"{openAnswers[15]}"</p>
              </div>
            )}

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 transition-colors mt-2"
            >
              <Printer className="w-4 h-4" />
              Print Your Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
