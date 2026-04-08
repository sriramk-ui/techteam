'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, X, Calendar, Trophy, Trash2, Edit2, Save } from 'lucide-react';

interface Event {
  _id: string; name: string; type: string; date: string;
  result?: string; visibility: 'public' | 'private';
  images: string[]; strategyNotes?: string;
  assignedMembers?: { _id: string; name: string }[];
}

interface Member { _id: string; name: string }

const emptyForm = {
  name: '', type: 'Hackathon', date: '', result: '',
  visibility: 'private' as 'public' | 'private',
  images: [] as string[], strategyNotes: '',
  assignedMembers: [] as string[],
};

const eventTypes = ['Hackathon', 'Workshop', 'Competition', 'Conference', 'Other'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
  fontFamily: 'inherit',
};

const typeColors: Record<string, string> = {
  Hackathon: '#f59e0b', Workshop: '#06b6d4', Competition: '#8b5cf6',
  Conference: '#10b981', Other: '#a09db0',
};

export default function EventsManagerPage() {
  const { token, isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchEvents = useCallback(async () => {
    const res = await fetch('/api/events', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchEvents();
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setMembers(d.users || []));
  }, [token, fetchEvents]);

  function openCreate() {
    setEditTarget(null);
    setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] });
    setError('');
    setShowModal(true);
  }

  function openEdit(ev: Event) {
    setEditTarget(ev);
    setForm({
      name: ev.name, type: ev.type,
      date: ev.date ? ev.date.split('T')[0] : '',
      result: ev.result || '',
      visibility: ev.visibility,
      images: ev.images || [],
      strategyNotes: ev.strategyNotes || '',
      assignedMembers: (ev.assignedMembers || []).map(m => m._id),
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.date) { setError('Name and date are required.'); return; }
    setSaving(true); setError('');
    try {
      const url = editTarget ? `/api/events/${editTarget._id}` : '/api/events';
      const method = editTarget ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error saving event'); return; }
      setShowModal(false);
      fetchEvents();
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE', headers });
    fetchEvents();
  }

  function toggleMember(id: string) {
    setForm(f => ({
      ...f,
      assignedMembers: f.assignedMembers.includes(id)
        ? f.assignedMembers.filter(m => m !== id)
        : [...f.assignedMembers, id],
    }));
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>Events</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>{events.length} total events</p>
        </div>
        {isAdmin && (
          <button id="create-event-btn" onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
          }}>
            <Plus size={16} /> Add Event
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
      ) : events.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {events.map((ev) => {
            const color = typeColors[ev.type] || '#a09db0';
            const dateStr = new Date(ev.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
            return (
              <div key={ev._id} className="glow-border" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', position: 'relative', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                {/* Admin controls */}
                {isAdmin && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                    <button onClick={() => openEdit(ev)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit2 size={11} />
                    </button>
                    <button onClick={() => handleDelete(ev._id)} style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
                <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}40`, marginBottom: '0.75rem' }}>
                  {ev.type}
                </span>
                <h3 style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--text-primary)', marginBottom: '0.5rem', paddingRight: isAdmin ? '56px' : 0 }}>{ev.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.6rem' }}>
                  <Calendar size={11} /> {dateStr}
                </p>
                {ev.result && (
                  <p style={{ fontSize: '0.8rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', background: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <Trophy size={11} /> {ev.result}
                  </p>
                )}
                {ev.strategyNotes && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>📝 {ev.strategyNotes}</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: ev.visibility === 'private' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', color: ev.visibility === 'private' ? '#fca5a5' : '#6ee7b7', border: `1px solid ${ev.visibility === 'private' ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}` }}>
                    {ev.visibility}
                  </span>
                  {(ev.assignedMembers?.length ?? 0) > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👥 {ev.assignedMembers!.length}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No events yet. {isAdmin ? 'Add your first event!' : 'Ask an admin to add events.'}</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {editTarget ? 'Edit Event' : 'Add Event'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Event Name *</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Hack the North 2025" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Type</label>
                  <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Date *</label>
                  <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Result</label>
                  <input style={inputStyle} value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="e.g. 1st Place 🏆" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Visibility</label>
                  <select style={inputStyle} value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value as 'public' | 'private' }))}>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Strategy Notes (internal)</label>
                <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.strategyNotes} onChange={e => setForm(f => ({ ...f, strategyNotes: e.target.value }))} placeholder="Internal notes about approach, what worked..." />
              </div>
              {members.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Participants</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {members.map(m => {
                      const selected = form.assignedMembers.includes(m._id);
                      return (
                        <button key={m._id} onClick={() => toggleMember(m._id)} style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500,
                          border: `1px solid ${selected ? 'rgba(245,158,11,0.5)' : 'var(--border-subtle)'}`,
                          background: selected ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                          color: selected ? '#fcd34d' : 'var(--text-muted)', cursor: 'pointer',
                        }}>
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white', fontSize: '0.875rem', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
