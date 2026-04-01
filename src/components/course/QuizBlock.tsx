import { useState } from 'react'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface QuizOption {
  text: string
  isCorrect: boolean
}

export interface QuizQuestionData {
  id: string
  question: string
  options: QuizOption[]
  explanation: string
  xp: number
}

interface QuizBlockProps {
  question: QuizQuestionData
  onCorrect?: (questionId: string, xp: number) => void
  answered?: boolean
}

export function QuizBlock({ question, onCorrect, answered: alreadyAnswered }: QuizBlockProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(alreadyAnswered ?? false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSelect = (index: number) => {
    if (submitted) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null || submitted) return
    const correct = question.options[selected].isCorrect
    setIsCorrect(correct)
    setSubmitted(true)
    if (correct && onCorrect) {
      onCorrect(question.id, question.xp)
    }
  }

  return (
    <div className="my-8 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-5 sm:p-6">
      {/* Question */}
      <div className="flex items-start gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="font-semibold text-gray-900 text-base">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {question.options.map((option, i) => {
          const letter = String.fromCharCode(97 + i) // a, b, c, d
          let optionStyle = 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'

          if (selected === i && !submitted) {
            optionStyle = 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200 cursor-pointer'
          }

          if (submitted) {
            if (option.isCorrect) {
              optionStyle = 'border-green-400 bg-green-50'
            } else if (selected === i && !option.isCorrect) {
              optionStyle = 'border-red-300 bg-red-50'
            } else {
              optionStyle = 'border-gray-200 bg-gray-50 opacity-60'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 flex items-center gap-3',
                optionStyle,
              )}
            >
              <span className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                submitted && option.isCorrect
                  ? 'bg-green-500 text-white'
                  : submitted && selected === i && !option.isCorrect
                    ? 'bg-red-400 text-white'
                    : selected === i && !submitted
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-600',
              )}>
                {submitted && option.isCorrect ? (
                  <CheckCircle className="w-4 h-4" />
                ) : submitted && selected === i && !option.isCorrect ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  letter
                )}
              </span>
              <span className="text-sm text-gray-700">{option.text}</span>
            </button>
          )
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={cn(
            'w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all',
            selected !== null
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          )}
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div className={cn(
          'mt-4 p-4 rounded-xl border',
          isCorrect
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200',
        )}>
          <p className={cn(
            'font-semibold text-sm mb-1',
            isCorrect ? 'text-green-700' : 'text-amber-700',
          )}>
            {isCorrect
              ? `✨ Correct! +${question.xp} XP`
              : "Not quite — but that's okay! Here's the explanation:"}
          </p>
          <p className="text-sm text-gray-600">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
