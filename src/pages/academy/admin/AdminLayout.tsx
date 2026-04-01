import { Outlet, NavLink } from 'react-router-dom'
import { Users, Link as LinkIcon, BarChart3 } from 'lucide-react'
import { cn } from '../../../lib/cn'

const NAV_ITEMS = [
  { to: '/academy/admin/clients', label: 'Clients', icon: Users },
  { to: '/academy/admin/invites', label: 'Invites', icon: LinkIcon },
  { to: '/academy/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminLayout() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      {/* Horizontally scrollable on mobile */}
      <nav className="flex gap-1 mb-6 border-b border-gray-200 pb-px overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/academy/admin/clients'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap flex-shrink-0',
                isActive
                  ? 'border-fresh-blue text-fresh-blue bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
