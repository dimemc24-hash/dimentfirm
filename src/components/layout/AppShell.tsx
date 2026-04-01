import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, BookOpen, Gamepad2, Trophy, User, Settings, CreditCard, Shield } from 'lucide-react'
import { MobileBottomNav } from './MobileBottomNav'
import { cn } from '../../lib/cn'

const navItems = [
  { to: '/academy/dashboard', label: 'Dashboard', icon: Home },
  { to: '/academy/module/01-fresh-start', label: 'Course', icon: BookOpen },
  { to: '/academy/arcade', label: 'Arcade', icon: Gamepad2 },
  { to: '/academy/badges', label: 'Badges', icon: Trophy },
  { to: '/academy/profile', label: 'Profile', icon: User },
  { to: '/academy/settings', label: 'Settings', icon: Settings },
  { to: '/academy/billing', label: 'Billing', icon: CreditCard },
]

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center px-4 z-50"
        style={{ paddingTop: 'var(--sat, 0px)' }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 touch-target flex items-center justify-center"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2 ml-3">
          <span className="text-lg font-bold text-fresh-blue">Fresh Start</span>
          <span className="text-sm text-gray-500 hidden xs:inline">Academy</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="bg-warm-amber/10 text-warm-amber px-2 py-1 rounded-full text-xs font-semibold">
            0 XP
          </div>
          <div className="text-sm">🔥 0</div>
        </div>
      </header>

      {/* Sidebar — desktop always visible, mobile slide-over */}
      <aside className={cn(
        'fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-200',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-fresh-blue">Fresh Start</h1>
          <p className="text-sm text-gray-500">Academy</p>
        </div>

        {/* Mascot greeting */}
        <div className="p-4 mx-3 mt-3 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2">
            <img src="/mascots/hariette/hariette.png" alt="Hariette" className="w-10 h-10 rounded-full object-cover" />
            <p className="text-sm text-gray-700">"Welcome back! Let's keep going."</p>
          </div>
        </div>

        <nav className="p-3 mt-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target',
                location.pathname.startsWith(item.to)
                  ? 'bg-fresh-blue/10 text-fresh-blue'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Admin link */}
        <div className="absolute bottom-16 left-3 right-3">
          <Link
            to="/academy/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-100"
          >
            <Shield size={18} />
            Admin Panel
          </Link>
        </div>

        {/* Back to firm site */}
        <div className="absolute bottom-4 left-3 right-3">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            &larr; Diment &amp; Associates
          </a>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content — extra bottom padding on mobile for bottom nav */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-4 pb-20 lg:px-8 lg:py-8 lg:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  )
}
