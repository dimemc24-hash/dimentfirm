import { useState, useEffect, useCallback } from 'react'
import { Copy, Trash2, Plus, RefreshCw, Link as LinkIcon } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { cn } from '../../../lib/cn'
import type { InviteLink } from '../../../types/database'

function generateCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default function Invites() {
  const [invites, setInvites] = useState<InviteLink[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [code, setCode] = useState(generateCode())
  const [trialDays, setTrialDays] = useState(14)
  const [maxUses, setMaxUses] = useState<string>('')
  const [expiresAt, setExpiresAt] = useState('')
  const [label, setLabel] = useState('')

  const fetchInvites = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('invite_links')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      setError(err.message)
    } else {
      setInvites((data as InviteLink[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchInvites() }, [fetchInvites])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setCreating(false); return }

    const payload: Record<string, unknown> = {
      code: code.toUpperCase().trim(),
      created_by: user.id,
      trial_days: trialDays,
      is_active: true,
      use_count: 0,
    }
    if (maxUses) payload.max_uses = parseInt(maxUses, 10)
    if (expiresAt) payload.expires_at = new Date(expiresAt).toISOString()
    if (label.trim()) payload.label = label.trim()

    const { error: err } = await supabase.from('invite_links').insert(payload)
    if (err) {
      setError(err.message)
    } else {
      setShowForm(false)
      setCode(generateCode())
      setMaxUses('')
      setExpiresAt('')
      setLabel('')
      setTrialDays(14)
      await fetchInvites()
    }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this invite link?')) return
    const { error: err } = await supabase
      .from('invite_links')
      .update({ is_active: false })
      .eq('id', id)
    if (err) setError(err.message)
    else await fetchInvites()
  }

  const copyLink = async (inviteCode: string, id: string) => {
    const url = `${window.location.origin}/academy/register?invite=${inviteCode}`
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const isExpired = (inv: InviteLink) => {
    if (!inv.expires_at) return false
    return new Date(inv.expires_at) < new Date()
  }

  const usesLeft = (inv: InviteLink) => {
    if (inv.max_uses === null) return '∞'
    const remaining = inv.max_uses - inv.use_count
    return remaining <= 0 ? '0' : String(remaining)
  }

  const getStatusInfo = (inv: InviteLink) => {
    const expired = isExpired(inv)
    const exhausted = inv.max_uses !== null && inv.use_count >= inv.max_uses
    const active = inv.is_active && !expired && !exhausted
    return {
      active,
      expired,
      exhausted,
      label: active ? 'Active' : expired ? 'Expired' : exhausted ? 'Exhausted' : 'Inactive',
      className: active
        ? 'bg-green-100 text-green-700'
        : expired
          ? 'bg-red-100 text-red-600'
          : exhausted
            ? 'bg-amber-100 text-amber-700'
            : 'bg-gray-100 text-gray-500',
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Invite Links</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create links for law firm clients to start their free trial
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={fetchInvites}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors touch-target"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className={cn(
              'flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors touch-target',
              showForm
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-fresh-blue text-white hover:bg-blue-600'
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{showForm ? 'Cancel' : 'New Invite'}</span>
            <span className="sm:hidden">{showForm ? '✕' : 'New'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">Create Invite Link</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invite Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-fresh-blue/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setCode(generateCode())}
                  className="px-3 py-2.5 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors touch-target"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trial Duration
              </label>
              <select
                value={trialDays}
                onChange={e => setTrialDays(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-blue/40"
              >
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uses <span className="text-gray-400">(blank = unlimited)</span>
              </label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={e => setMaxUses(e.target.value)}
                placeholder="Unlimited"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-blue/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires On <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-blue/40"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label <span className="text-gray-400">(internal note)</span>
              </label>
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. 'Baton Rouge Q1 clients'"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fresh-blue/40"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 bg-fresh-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors touch-target"
            >
              {creating ? 'Creating…' : 'Create Invite'}
            </button>
          </div>
        </form>
      )}

      {/* Empty / Loading states */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading invite links…</div>
      ) : invites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No invite links yet</p>
          <p className="text-gray-400 text-sm mt-1">Create one to get started</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (hidden on mobile) ──────────────────────── */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Label</th>
                    <th className="px-4 py-3 font-medium text-center">Trial</th>
                    <th className="px-4 py-3 font-medium text-center">Uses Left</th>
                    <th className="px-4 py-3 font-medium">Expires</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invites.map(inv => {
                    const status = getStatusInfo(inv)
                    return (
                      <tr
                        key={inv.id}
                        className={cn('hover:bg-gray-50 transition-colors', !status.active && 'opacity-60')}
                      >
                        <td className="px-4 py-3 font-mono font-medium text-gray-900">{inv.code}</td>
                        <td className="px-4 py-3 text-gray-500">{inv.label || '—'}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{inv.trial_days}d</td>
                        <td className="px-4 py-3 text-center text-gray-700">{usesLeft(inv)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(inv.expires_at)}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(inv.created_at)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => copyLink(inv.code, inv.id)}
                              className="p-1.5 text-gray-400 hover:text-fresh-blue rounded-md hover:bg-blue-50 transition-colors"
                              title="Copy invite link"
                            >
                              {copiedId === inv.id ? (
                                <span className="text-xs text-green-600 font-medium">Copied!</span>
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            {inv.is_active && (
                              <button
                                onClick={() => handleDelete(inv.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                title="Deactivate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile card list (hidden on desktop) ──────────────────── */}
          <div className="md:hidden space-y-3">
            {invites.map(inv => {
              const status = getStatusInfo(inv)
              return (
                <div
                  key={inv.id}
                  className={cn(
                    'bg-white border border-gray-200 rounded-xl p-4 shadow-sm',
                    !status.active && 'opacity-60',
                  )}
                >
                  {/* Top: code + status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-gray-900 text-base">{inv.code}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
                      {status.label}
                    </span>
                  </div>

                  {/* Label */}
                  {inv.label && (
                    <p className="text-sm text-gray-500 mb-2">{inv.label}</p>
                  )}

                  {/* Details grid */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide mb-0.5">Trial</p>
                      <p className="font-medium text-gray-700">{inv.trial_days}d</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide mb-0.5">Uses Left</p>
                      <p className="font-medium text-gray-700">{usesLeft(inv)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide mb-0.5">Expires</p>
                      <p className="font-medium text-gray-700">{formatDate(inv.expires_at)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => copyLink(inv.code, inv.id)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-target',
                        copiedId === inv.id
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
                      )}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedId === inv.id ? 'Copied!' : 'Copy Link'}
                    </button>
                    {inv.is_active && (
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors touch-target"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
