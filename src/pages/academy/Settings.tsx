import { useState, useCallback } from 'react'
import {
  Bell, Moon, Sun, Smartphone, Volume2, VolumeX,
  Shield, HelpCircle, LogOut, ChevronRight,
  Palette, Eye, Type, Vibrate,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import { useSettings } from '../../hooks/useSettings'
import { cn } from '../../lib/cn'
import type { AppSettings } from '../../hooks/useSettings'

// ── Types ────────────────────────────────────────────────────────────

interface ToggleSetting {
  key: keyof AppSettings
  label: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

// ── Settings Page ────────────────────────────────────────────────────

export default function Settings() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile(user?.id)
  const { settings, toggle } = useSettings()

  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleLogout = useCallback(async () => {
    setLogoutLoading(true)
    try {
      await signOut()
    } catch {
      // handled by auth hook
    }
    setLogoutLoading(false)
  }, [signOut])

  const toggleGroups: Array<{
    title: string
    items: ToggleSetting[]
  }> = [
    {
      title: 'Notifications',
      items: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          description: 'Streak reminders and course updates',
          icon: <Bell className="w-5 h-5" />,
          enabled: settings.notifications,
        },
        {
          key: 'soundEffects',
          label: 'Sound Effects',
          description: 'XP earned, badge unlocked, quiz correct',
          icon: settings.soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />,
          enabled: settings.soundEffects,
        },
        {
          key: 'hapticFeedback',
          label: 'Haptic Feedback',
          description: 'Vibration on taps and interactions',
          icon: <Vibrate className="w-5 h-5" />,
          enabled: settings.hapticFeedback,
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Easier on the eyes at night',
          icon: settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />,
          enabled: settings.darkMode,
        },
        {
          key: 'largeText',
          label: 'Large Text',
          description: 'Increase font size for readability',
          icon: <Type className="w-5 h-5" />,
          enabled: settings.largeText,
        },
        {
          key: 'reducedMotion',
          label: 'Reduced Motion',
          description: 'Minimize animations and transitions',
          icon: <Eye className="w-5 h-5" />,
          enabled: settings.reducedMotion,
        },
        {
          key: 'showXPAnimations',
          label: 'XP Animations',
          description: 'Show floating +XP when earning points',
          icon: <Palette className="w-5 h-5" />,
          enabled: settings.showXPAnimations,
        },
      ],
    },
  ]

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Customize your learning experience</p>
      </div>

      {/* Toggle groups */}
      {toggleGroups.map(group => (
        <div key={group.title}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {group.title}
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {group.items.map(item => (
              <ToggleRow
                key={item.key}
                icon={item.icon}
                label={item.label}
                description={item.description}
                enabled={item.enabled}
                onChange={() => toggle(item.key)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Learning section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
          Learning
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          <LinkRow
            icon={<Smartphone className="w-5 h-5 text-fresh-blue" />}
            label="Install App"
            description="Add to your home screen for quick access"
            onClick={() => {
              // For PWA prompt — in real implementation would check beforeinstallprompt
              alert('To install: tap the share button in your browser, then "Add to Home Screen"')
            }}
          />
        </div>
      </div>

      {/* Support section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
          Support
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
          <LinkRow
            icon={<HelpCircle className="w-5 h-5 text-gray-400" />}
            label="Help & FAQ"
            description="Common questions and troubleshooting"
          />
          <LinkRow
            icon={<Shield className="w-5 h-5 text-gray-400" />}
            label="Privacy Policy"
            description="How we protect your data"
          />
        </div>
      </div>

      {/* Account section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
          Account
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 transition-colors touch-target"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-600">
                {logoutLoading ? 'Signing out…' : 'Sign Out'}
              </p>
              <p className="text-xs text-gray-400 truncate">{profile?.email ?? user?.email}</p>
            </div>
          </button>
        </div>
      </div>

      {/* App info */}
      <div className="text-center text-xs text-gray-300 pt-2">
        <p>Fresh Start Academy v1.0.0</p>
        <p className="mt-0.5">Made with ❤️ for fresh starts</p>
      </div>
    </div>
  )
}

// ── Toggle Row ───────────────────────────────────────────────────────

function ToggleRow({
  icon,
  label,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  enabled: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors touch-target"
    >
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
        enabled ? 'bg-fresh-blue/10 text-fresh-blue' : 'bg-gray-100 text-gray-400',
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      {/* Toggle switch */}
      <div className={cn(
        'w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0',
        enabled ? 'bg-fresh-blue' : 'bg-gray-300',
      )}>
        <div className={cn(
          'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0',
        )} />
      </div>
    </button>
  )
}

// ── Link Row ─────────────────────────────────────────────────────────

function LinkRow({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors touch-target"
    >
      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </button>
  )
}
