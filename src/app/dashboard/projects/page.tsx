'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProjectCard from '@/components/ProjectCard';
import VaultEditor from '@/components/VaultEditor';
import {
  Plus, X, FolderGit2, Save, Trash2, Edit2,
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed';
  visibility: 'public' | 'private';
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  projectUrl?: string;
  notes?: string;
  assignedMembers?: { _id: string; name: string }[];
}

interface Member { _id: string; name: string }

const emptyForm: {
  title: string; description: string;
  status: 'Planning' | 'Active' | 'Completed';
  visibility: 'public' | 'private';
  progress: number; githubUrl: string; demoUrl: string;
  projectUrl: string; notes: string; assignedMembers: string[];
} = {
  title: '', description: '', status: 'Planning',
  visibility: 'private', progress: 0,
  githubUrl: '', demoUrl: '', projectUrl: '', notes: '', assignedMembers: [],
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.2s',
};

export default function ProjectsManagerPage() {
  const { token, isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeVaultProject, setActiveVaultProject] = useState<{ id: string; title: string } | null>(null);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchProjects = useCallback(async () => {
    const res = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchProjects();
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setMembers(d.users || []));
  }, [token, fetchProjects]);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  }

  function openEdit(proj: Project) {
    setEditTarget(proj);
    setForm({
      title: proj.title, description: proj.description,
      status: proj.status, visibility: proj.visibility,
      progress: proj.progress, githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '', projectUrl: proj.projectUrl || '',
      notes: proj.notes || '',
      assignedMembers: (proj.assignedMembers || []).map(m => m._id),
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title || !form.description) { setError('Title and description are required.'); return; }
    setSaving(true); setError('');
    try {
      const url = editTarget ? `/api/projects/${editTarget._id}` : '/api/projects';
      const method = editTarget ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error saving project'); return; }
      setShowModal(false);
      fetchProjects();
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE', headers });
    fetchProjects();
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>{projects.length} total projects</p>
        </div>
        {isAdmin && (
          <button
            id="create-project-btn"
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
            }}
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
      ) : projects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {projects.map((proj) => (
            <div key={proj._id} style={{ position: 'relative' }}>
              <ProjectCard 
                project={proj} 
                showVisibility 
                onVaultClick={() => setActiveVaultProject({ id: proj._id, title: proj.title })}
              />
              {isAdmin && (
                <div style={{ display: 'flex', gap: '6px', position: 'absolute', top: '12px', right: '12px' }}>
                  <button onClick={() => openEdit(proj)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(proj._id)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <FolderGit2 size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No projects yet. {isAdmin ? 'Create one to get started!' : 'Ask an admin to add projects.'}</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {editTarget ? 'Edit Project' : 'Create Project'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Title *</label>
                <input id="proj-title" style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Description *</label>
                <textarea id="proj-desc" style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this project do?" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Status</label>
                  <select id="proj-status" style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as typeof form.status }))}>
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Visibility</label>
                  <select id="proj-visibility" style={inputStyle} value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value as 'public' | 'private' }))}>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Progress ({form.progress}%)</label>
                <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: +e.target.value }))} style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>GitHub URL</label>
                  <input style={inputStyle} value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Demo URL</label>
                  <input style={inputStyle} value={form.demoUrl} onChange={e => setForm(f => ({ ...f, demoUrl: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Project URL (Hyperlink)</label>
                <input style={inputStyle} value={form.projectUrl} onChange={e => setForm(f => ({ ...f, projectUrl: e.target.value }))} placeholder="https://yourproject.com — makes the title a clickable link" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>Notes (internal)</label>
                <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Private notes..." />
              </div>
              {members.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Assign Members</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {members.map(m => {
                      const selected = form.assignedMembers.includes(m._id);
                      return (
                        <button key={m._id} onClick={() => toggleMember(m._id)} style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500,
                          border: `1px solid ${selected ? 'rgba(139,92,246,0.5)' : 'var(--border-subtle)'}`,
                          background: selected ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                          color: selected ? '#c4b5fd' : 'var(--text-muted)', cursor: 'pointer',
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
                <button
                  id="proj-save-btn"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    color: 'white', fontSize: '0.875rem', fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vault Editor Modal */}
      {activeVaultProject && (
        <VaultEditor 
          projectId={activeVaultProject.id}
          projectTitle={activeVaultProject.title}
          onClose={() => setActiveVaultProject(null)}
        />
      )}
    </div>
  );
}
