import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Gamepad2, Trophy, User } from 'lucide-react'
import { cn } from '../../lib/cn'

const NAV_ITEMS = [
  { to: '/academy/dashboard', label: 'Home', icon: Home },
  { to: '/academy/module', label: 'Course', icon: BookOpen, matchPrefix: '/academy/module' },
  { to: '/academy/game/budget-crisis', label: 'Arcade', icon: Gamepad2, matchPrefix: '/academy/game' },
  { to: '/academy/badges', label: 'Badges', icon: Trophy },
  { to: '/academy/profile', label: 'Profile', icon: User },
]

export function MobileBottomNav() {
  const location = useLocation()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'var(--sab, 0px)' }}
    >
      <div className="flex items-stretch justify-around">
        {NAV_ITEMS.map(item => {
          const isActive = item.matchPrefix
            ? location.pathname.startsWith(item.matchPrefix)
            : location.pathname === item.to

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] touch-target transition-colors',
                isActive
                  ? 'text-fresh-blue'
                  : 'text-gray-400 active:text-gray-600',
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
              <span className={cn(
                'text-[10px] font-medium leading-tight',
                isActive ? 'font-semibold' : '',
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
