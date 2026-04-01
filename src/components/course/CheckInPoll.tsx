import { useState } from 'react'
import { cn } from '../../lib/cn'

interface CheckInPollProps {
  id: string
  prompt: string
  options: string[]
  onSelect?: (id: string, choice: string) => void
}

export function CheckInPoll({ id, prompt, options, onSelect }: CheckInPollProps) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(option: string) {
    setSelected(option)
    onSelect?.(id, option)
  }

  return (
    <div className="my-6 p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl">
      <p className="font-semibold text-gray-800 mb-3">{prompt}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm',
              selected === option
                ? 'border-amber-400 bg-amber-100 text-amber-900 font-medium'
                : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50/50',
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-3 text-sm text-amber-700 font-medium">
          Thanks for sharing! Let's dive in.
        </p>
      )}
    </div>
  )
}
