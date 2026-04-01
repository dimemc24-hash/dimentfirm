import { Link } from 'react-router-dom'
import { Gamepad2, Zap, ChevronRight } from 'lucide-react'
import { GAME_REGISTRY } from '../../games'
import { cn } from '../../lib/cn'

export default function Arcade() {
  return (
    <div className="pb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Game Arcade</h1>
          <p className="text-sm text-gray-500">Practice financial skills through interactive games</p>
        </div>
      </div>

      <div className="grid gap-3">
        {GAME_REGISTRY.map(game => (
          <Link
            key={game.slug}
            to={`/academy/game/${game.slug}`}
            className={cn(
              'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group',
              'border-gray-200 bg-white hover:border-purple-200 hover:shadow-sm',
            )}
          >
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
              <span className="text-2xl">{game.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{game.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{game.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                  <Zap className="w-3 h-3" />
                  {game.xpAvailable} XP
                </span>
                <span className="text-xs text-gray-400">Module {game.module}</span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
