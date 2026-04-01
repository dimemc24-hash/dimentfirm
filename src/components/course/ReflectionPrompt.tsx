import { useState, useCallback } from 'react'
import { Pencil, Save, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ReflectionPromptProps {
  id: string
  prompt: string
  xp?: number
  onComplete?: (id: string, response: string, xp: number) => void
  savedResponse?: string
}

export function ReflectionPrompt({ id, prompt, xp = 50, onComplete, savedResponse }: ReflectionPromptProps) {
  const [response, setResponse] = useState(savedResponse ?? '')
  const [saved, setSaved] = useState(!!savedResponse)
  const [saving, setSaving] = useState(false)
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length

  const handleSave = useCallback(async () => {
    if (response.trim().length < 10 || saved) return
    setSaving(true)
    // Small delay for perceived save action
    await new Promise(r => setTimeout(r, 300))
    setSaved(true)
    setSaving(false)
    onComplete?.(id, response, xp)
  }, [id, response, xp, saved, onComplete])

  return (
    <div className="my-8 rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-2 mb-3">
        <Pencil className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-rose-500 mb-1">
            Reflection — {xp} XP
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{prompt}</p>
        </div>
      </div>

      {/* Private note */}
      <p className="text-xs text-gray-400 italic mb-3">
        🔒 This is private — only you can see your response.
      </p>

      {/* Text area */}
      <textarea
        value={response}
        onChange={e => { setResponse(e.target.value); setSaved(false) }}
        disabled={saved}
        placeholder="Take your time. There's no wrong answer here..."
        rows={4}
        className={cn(
          'w-full rounded-xl border-2 px-4 py-3 text-sm leading-relaxed resize-y transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300',
          saved
            ? 'border-green-200 bg-green-50/50 text-gray-600'
            : 'border-gray-200 bg-white text-gray-800 placeholder:text-gray-400',
        )}
      />

      {/* Footer: word count + save */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>

        {saved ? (
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Saved — +{xp} XP
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={response.trim().length < 10 || saving}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              response.trim().length >= 10
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            )}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Reflection'}
          </button>
        )}
      </div>
    </div>
  )
}
