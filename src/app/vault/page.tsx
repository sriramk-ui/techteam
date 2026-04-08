'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Shield, Plus, X, Eye, EyeOff, Key, Trash2, Save,
  Lock, ArrowLeft, AlertTriangle,
} from 'lucide-react';

interface VaultEntry {
  _id: string;
  project_id: { _id: string; title: string };
  encryptedData: string;
  createdAt: string;
}

interface DecryptedEntry {
  projectId: string;
  data: any;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
};

function VaultContent() {
  const { user, token, loading } = useAuth();
  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([]);
  const [projects, setProjects] = useState<{ _id: string; title: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [decrypted, setDecrypted] = useState<Record<string, DecryptedEntry>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [credentials, setCredentials] = useState([{ process: '', email: '', password: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchVault = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 503) throw new Error('Offline');
      const data = await res.json();
      const projs = data.projects || [];
      setProjects(projs);

      // Fetch vault for each project
      const entries: VaultEntry[] = [];
      await Promise.all(projs.map(async (p: { _id: string }) => {
        const r = await fetch(`/api/vault/${p._id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) {
          const d = await r.json();
          if (d.vault) entries.push(d.vault);
        }
      }));
      setVaultEntries(entries);
    } catch {
      // MOCK DATA FALLBACK
      setProjects([
        { _id: '1', title: 'AgroMind Detection' },
        { _id: '2', title: 'Loopy Admin Portal' }
      ]);
      setVaultEntries([
        {
          _id: 'v1',
          project_id: { _id: '1', title: 'AgroMind Detection' },
          encryptedData: 'encrypted-payload-here',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && user) fetchVault();
  }, [token, user, fetchVault]);

  async function revealVault(projectId: string, entryId: string) {
    if (decrypted[entryId]) {
      setRevealed(r => ({ ...r, [entryId]: !r[entryId] }));
      return;
    }
    try {
      const res = await fetch(`/api/vault/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 503) throw new Error('Offline');
      const data = await res.json();
      if (data.decryptedData) {
        setDecrypted(d => ({ ...d, [entryId]: { projectId, data: JSON.parse(data.decryptedData) } }));
        setRevealed(r => ({ ...r, [entryId]: true }));
      }
    } catch {
      // MOCK DECRYPTION
      setDecrypted(d => ({ 
        ...d, 
        [entryId]: { 
          projectId, 
          data: { 'API_KEY': 'sk_test_51Mz...demo', 'DB_PASSWORD': 'password123_mock' } 
        } 
      }));
      setRevealed(r => ({ ...r, [entryId]: true }));
    }
  }

  async function handleSave() {
    if (!selectedProject) { setError('Select a project.'); return; }
    const validPairs = credentials.filter(c => c.process.trim() || c.email.trim() || c.password.trim());
    if (!validPairs.length) { setError('Add at least one credential entry.'); return; }
    const payload = validPairs;

    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/vault/${selectedProject}`, {
        method: 'POST', headers,
        body: JSON.stringify({ data: JSON.stringify(payload) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error'); return; }
      setShowModal(false);
      setCredentials([{ process: '', email: '', password: '' }]);
      setSelectedProject('');
      fetchVault();
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(projectId: string) {
    if (!confirm('Delete this vault entry? All stored secrets will be lost!')) return;
    await fetch(`/api/vault/${projectId}`, { method: 'DELETE', headers });
    fetchVault();
  }

  if (loading || loadingData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={40} color="var(--accent-primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Unlocking vault...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <Lock size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Authentication required to access the vault.</p>
          <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: '#ef4444', top: '-100px', right: '10%', opacity: 0.08 }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.25rem' }}>
              <Shield size={24} color="#ef4444" />
              <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>Secret Vault</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>AES-encrypted secrets for internal use only — never exposed publicly.</p>
          </div>
          <button id="add-vault-btn" onClick={() => { setShowModal(true); setError(''); }} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 0 20px rgba(239,68,68,0.3)',
          }}>
            <Plus size={16} /> Store Secrets
          </button>
        </div>

        {/* Warning banner */}
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <AlertTriangle size={15} color="#fca5a5" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
            All vault data is encrypted with AES-256 before storage. Never share your credentials outside this vault.
          </p>
        </div>

        {/* Vault entries */}
        {vaultEntries.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {vaultEntries.map((entry) => {
              const isRevealed = revealed[entry._id];
              const dec = decrypted[entry._id];
              return (
                <div key={entry._id} className="glow-border" style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem',
                  border: '1px solid rgba(239,68,68,0.2)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Key size={15} color="#fca5a5" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {typeof entry.project_id === 'object' ? entry.project_id.title : 'Unknown Project'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => revealVault(typeof entry.project_id === 'object' ? entry.project_id._id : entry.project_id, entry._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '8px', border: 'none',
                          background: isRevealed ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                          color: isRevealed ? '#a78bfa' : 'var(--text-muted)',
                          fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                        {isRevealed ? 'Hide' : 'Reveal'}
                      </button>
                      <button
                        onClick={() => handleDelete(typeof entry.project_id === 'object' ? entry.project_id._id : entry.project_id)}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {isRevealed && dec ? (
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      {Array.isArray(dec.data) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {dec.data.map((cred: any, i: number) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(150px, 1.5fr)', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Process</span><span style={{ color: '#f472b6', wordBreak: 'break-all' }}>{cred.process || '—'}</span></div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email/Username</span><span style={{ color: '#a78bfa', wordBreak: 'break-all' }}>{cred.email || '—'}</span></div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</span><span style={{ color: '#6ee7b7', wordBreak: 'break-all' }}>{cred.password || '—'}</span></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        Object.entries(dec.data).map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', gap: '12px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }}>
                            <span style={{ color: '#f472b6', minWidth: '140px', flexShrink: 0 }}>{k}</span>
                            <span style={{ color: '#a78bfa', wordBreak: 'break-all' }}>=</span>
                            <span style={{ color: '#6ee7b7', wordBreak: 'break-all', flex: 1 }}>{v as string}</span>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={12} color="var(--text-muted)" />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.3em' }}>•••••••••••••••••••••••••</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Shield size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No vault entries yet. Store your first secrets!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(239,68,68,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#ef4444" /> Store Secrets
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Project</label>
                <select style={inputStyle} value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                  <option value="">Select a project...</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Credentials</label>
                  <button onClick={() => setCredentials(p => [...p, { process: '', email: '', password: '' }])} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    + Add Row
                  </button>
                </div>
                {credentials.map((cred, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) minmax(130px, 1.2fr) minmax(130px, 1.2fr) auto', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                    <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }} placeholder="Process (e.g. AWS)" value={cred.process} onChange={e => { const n = [...credentials]; n[i].process = e.target.value; setCredentials(n); }} />
                    <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }} placeholder="Email or Username" value={cred.email} onChange={e => { const n = [...credentials]; n[i].email = e.target.value; setCredentials(n); }} />
                    <input style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }} placeholder="Password" type="password" value={cred.password} onChange={e => { const n = [...credentials]; n[i].password = e.target.value; setCredentials(n); }} />
                    {i > 0 && (
                      <button onClick={() => setCredentials(p => p.filter((_, idx) => idx !== i))} style={{ width: '36px', height: '36px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white', fontSize: '0.875rem', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Save size={14} /> {saving ? 'Encrypting...' : 'Encrypt & Store'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VaultPage() {
  return (
    <VaultContent />
  );
}
