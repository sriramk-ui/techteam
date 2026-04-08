'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MemberCard from '@/components/MemberCard';
import { Users, UserPlus, X, Save, Trash2, Edit2 } from 'lucide-react';

interface Member {
  _id: string; name: string; email: string; role: 'ADMIN' | 'MEMBER'; profilePic?: string;
  socialLinks?: { github?: string; linkedin?: string; instagram?: string; gmail?: string };
}

const emptyForm = {
  name: '', email: '', password: '', role: 'MEMBER' as 'ADMIN' | 'MEMBER', profilePic: '',
  github: '', linkedin: '', instagram: '', gmail: '',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
};

export default function MembersManagerPage() {
  const { token, isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function fetchMembers() {
    const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setMembers(data.users || []);
    setLoading(false);
  }

  useEffect(() => { if (token) fetchMembers(); }, [token]);

  function openCreate() {
    setEditingMember(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  }

  function openEdit(m: Member) {
    setEditingMember(m);
    setForm({
      name: m.name,
      email: m.email,
      password: '', // Leave blank unless changing
      profilePic: m.profilePic || '',
      role: m.role,
      github: m.socialLinks?.github || '',
      linkedin: m.socialLinks?.linkedin || '',
      instagram: m.socialLinks?.instagram || '',
      gmail: m.socialLinks?.gmail || '',
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    if (!editingMember && !form.password) { setError('Password is required for new accounts.'); return; }
    
    setSaving(true); setError('');
    try {
      const url = editingMember ? `/api/users/${editingMember._id}` : '/api/users';
      const method = editingMember ? 'PUT' : 'POST';
      
      const payload: any = {
        name: form.name, email: form.email, role: form.role, profilePic: form.profilePic,
        socialLinks: { github: form.github, linkedin: form.linkedin, instagram: form.instagram, gmail: form.gmail },
      };
      // Only include password if provided (for updates) or for new users
      if (form.password) payload.password = form.password;

      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error'); return; }
      
      setShowModal(false);
      setForm(emptyForm);
      fetchMembers();
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this member?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE', headers });
    fetchMembers();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>Team Members</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>{members.length} members</p>
        </div>
        {isAdmin && (
          <button id="add-member-btn" onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
          }}>
            <UserPlus size={16} /> Add Member
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading members...</p>
      ) : members.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {members.map((m) => (
            <div key={m._id} style={{ position: 'relative' }}>
              <MemberCard member={m} />
              {isAdmin && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
                  <button onClick={() => openEdit(m)} style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    border: 'none', background: 'rgba(139,92,246,0.15)',
                    color: '#a78bfa', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Edit2 size={11} />
                  </button>
                  <button onClick={() => handleDelete(m._id)} style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    border: 'none', background: 'rgba(239,68,68,0.15)',
                    color: '#fca5a5', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <Users size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No team members yet.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {editingMember ? 'Edit Member' : 'Add Team Member'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Account Info</p>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Full Name *</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Profile Picture (Image File)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      setUploadingImage(true); setError('');
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || 'Upload failed');
                        setForm(f => ({ ...f, profilePic: data.url }));
                      } catch (err: any) {
                        setError(err.message);
                      } finally {
                        setUploadingImage(false);
                      }
                    }}
                    style={{ ...inputStyle, flex: 1, cursor: 'pointer', opacity: uploadingImage ? 0.5 : 1 }} 
                    disabled={uploadingImage}
                  />
                  {form.profilePic && (
                    <img src={form.profilePic} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-default)' }} />
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Email *</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@team.dev" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Role</label>
                  <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'ADMIN' | 'MEMBER' }))}>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>
                  {editingMember ? 'Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input type="password" style={inputStyle} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
              </div>

              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Social Links</p>
              {[
                { key: 'github', placeholder: 'https://github.com/username' },
                { key: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
                { key: 'instagram', placeholder: 'https://instagram.com/username' },
                { key: 'gmail', placeholder: 'email@gmail.com' },
              ].map(({ key, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'capitalize' }}>{key}</label>
                  <input style={inputStyle} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  color: 'white', fontSize: '0.875rem', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Save size={14} /> {saving ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
