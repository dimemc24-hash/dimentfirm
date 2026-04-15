import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Gift, CheckCircle, XCircle, RefreshCw, Lock, Mail, MapPin } from 'lucide-react';

interface DeskPetRequest {
  id: string;
  name: string;
  email: string;
  mailing_address: string;
  status: 'pending' | 'fulfilled' | 'canceled';
  notes: string | null;
  created_at: string;
  fulfilled_at: string | null;
}

// Very simple client-side gate — not real auth. Real security comes from the
// Supabase RLS policies on the desk_pet_requests table (admin-only access).
// This just keeps the casual visitor out.
const ADMIN_PASSWORD_HASH = 'diment-admin-2026'; // Change this to set a new passphrase

export default function FirmAdmin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('firm-admin-authed') === '1');
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [requests, setRequests] = useState<DeskPetRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'fulfilled' | 'canceled' | 'all'>('pending');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('desk_pet_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests((data as DeskPetRequest[]) || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadRequests();
  }, [authed, loadRequests]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem('firm-admin-authed', '1');
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passphrase.');
    }
  };

  const updateStatus = async (id: string, status: 'fulfilled' | 'canceled' | 'pending') => {
    try {
      const payload: Record<string, unknown> = { status };
      if (status === 'fulfilled') payload.fulfilled_at = new Date().toISOString();
      else if (status === 'pending') payload.fulfilled_at = null;

      const { error } = await supabase
        .from('desk_pet_requests')
        .update(payload)
        .eq('id', id);

      if (error) throw error;
      await loadRequests();
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Failed to update request. Check the console.');
    }
  };

  const filtered = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  const counts = {
    pending: requests.filter(r => r.status === 'pending').length,
    fulfilled: requests.filter(r => r.status === 'fulfilled').length,
    canceled: requests.filter(r => r.status === 'canceled').length,
  };

  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="admin-gate__card">
          <Lock size={32} style={{ color: 'var(--color-turtle-green)', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Firm Admin</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Enter the admin passphrase to continue.
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              placeholder="Passphrase"
              autoFocus
              style={{
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
            {authError && (
              <div style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{authError}</div>
            )}
            <button
              type="submit"
              className="btn btn-turtle"
              style={{ width: '100%' }}
            >
              Sign In
            </button>
          </form>
        </div>
        <style>{`
          .admin-gate {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .admin-gate__card {
            max-width: 400px;
            width: 100%;
            background: white;
            padding: 2.5rem;
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--color-border);
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              <Gift size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--color-turtle-green)' }} />
              Desk Pet Requests
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Manage pending shipments and mark them fulfilled.
            </p>
          </div>
          <button
            onClick={loadRequests}
            className="btn btn-outline"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {(['pending', 'fulfilled', 'canceled', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="filter-btn"
              style={{
                background: filter === f ? 'var(--color-turtle-green)' : 'white',
                color: filter === f ? 'white' : 'var(--color-text-main)',
                border: `1px solid ${filter === f ? 'var(--color-turtle-green)' : 'var(--color-border)'}`,
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f}
              {f !== 'all' && ` (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Request list */}
        {loading && requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            Loading requests...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', background: 'var(--color-background)', borderRadius: 'var(--border-radius-lg)' }}>
            No {filter !== 'all' ? filter : ''} requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(req => (
              <div
                key={req.id}
                className="request-card"
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.125rem', margin: 0 }}>{req.name}</h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <Mail size={14} />
                    <a href={`mailto:${req.email}`} style={{ color: 'inherit' }}>{req.email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'pre-line' }}>{req.mailing_address}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Requested {new Date(req.created_at).toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                    {req.fulfilled_at && (
                      <> · Fulfilled {new Date(req.fulfilled_at).toLocaleDateString()}</>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, 'fulfilled')}
                        style={{
                          background: 'var(--color-turtle-green)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <CheckCircle size={14} />
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'canceled')}
                        style={{
                          background: 'white',
                          color: 'var(--color-text-muted)',
                          border: '1px solid var(--color-border)',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    </>
                  )}
                  {req.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(req.id, 'pending')}
                      style={{
                        background: 'white',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .request-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'fulfilled' | 'canceled' }) {
  const config = {
    pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
    fulfilled: { bg: '#d1fae5', color: '#065f46', label: 'Fulfilled' },
    canceled: { bg: '#f3f4f6', color: '#6b7280', label: 'Canceled' },
  }[status];

  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        padding: '0.125rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {config.label}
    </span>
  );
}
