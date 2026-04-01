/**
 * StatBox — renders the "📊 You're Not Alone" callout cards from lesson content.
 * Displays stats in a visually distinct card to reduce isolation/shame.
 */

import { BarChart3 } from 'lucide-react'
import { cn } from '../../lib/cn'
import ReactMarkdown from 'react-markdown'

interface StatBoxProps {
  lines: string[]
  className?: string
}

export function StatBox({ lines, className }: StatBoxProps) {
  // First line is the title (contains 📊)
  const title = lines[0]?.replace(/\*\*/g, '').replace(/📊\s*/, '').trim() || "You're Not Alone"
  const bullets = lines.slice(1)

  return (
    <div
      className={cn(
        'my-6 rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-5 sm:p-6',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        <h4 className="font-bold text-blue-800 text-sm uppercase tracking-wide">{title}</h4>
      </div>

      <ul className="space-y-2">
        {bullets.map((bullet, i) => {
          // Strip leading "- " if present
          const text = bullet.replace(/^-\s*/, '').trim()
          return (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span className="prose prose-sm max-w-none prose-strong:text-blue-700">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <>{children}</>,
                  }}
                >
                  {text}
                </ReactMarkdown>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
