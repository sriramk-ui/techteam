'use client';

import Link from 'next/link';
import { X, ExternalLink, Link2, Users, Shield, CheckCircle, Clock, Loader, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/atoms/icons';

interface Member {
  _id: string;
  name: string;
  role?: string;
  profilePic?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed';
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  projectUrl?: string;
  notes?: string;
  tags?: string[];
  assignedMembers?: Member[];
  visibility?: 'public' | 'private';
}

interface ProjectShowcaseModalProps {
  project: Project | null;
  onClose: () => void;
  onVaultClick?: (projectId: string, title: string) => void;
}

const statusConfig = {
  Planning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', Icon: Clock },
  Active: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', Icon: Loader },
  Completed: { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.35)', Icon: CheckCircle },
};

export default function ProjectShowcaseModal({ project, onClose, onVaultClick }: ProjectShowcaseModalProps) {
  if (!project) return null;

  const status = statusConfig[project.status] || statusConfig.Active;
  const StatusIcon = status.Icon;
  const mainUrl = project.projectUrl || project.demoUrl || project.githubUrl;

  // Infer tech tags if explicit tags array is absent
  const inferredTags = project.tags && project.tags.length > 0 ? project.tags : (() => {
    const text = `${project.title} ${project.description}`.toLowerCase();
    const tags: string[] = [];
    if (text.includes('next') || text.includes('react') || text.includes('web')) tags.push('Next.js 16', 'React 19');
    if (text.includes('mongo') || text.includes('db') || text.includes('data')) tags.push('MongoDB', 'Mongoose');
    if (text.includes('auth') || text.includes('admin') || text.includes('portal') || text.includes('system')) tags.push('TypeScript', 'JWT Auth');
    if (text.includes('3d') || text.includes('three') || text.includes('shader') || text.includes('gl')) tags.push('Three.js', 'WebGL');
    if (tags.length === 0) tags.push('Full-Stack', 'TypeScript', 'Tailwind CSS');
    return tags;
  })();

  return (
    <div
      className="warp-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', background: 'rgba(5, 5, 12, 0.82)', backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="warp-modal-card glass-strong"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '24px', padding: '2.5rem 2rem',
          width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto',
          border: '1px solid rgba(236, 23, 15, 0.3)',
          background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.95), rgba(8, 8, 18, 0.98))',
          boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 50px rgba(236, 23, 15, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)',
            borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#EC170F'; e.currentTarget.style.borderColor = '#EC170F'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <X size={18} />
        </button>

        {/* Top Kicker Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <Sparkles size={16} color="#EC170F" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EC170F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Project Showcase
          </span>
        </div>

        {/* Title & Badges */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            {project.title}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
              background: status.bg, border: `1px solid ${status.border}`, color: status.color,
            }}>
              <StatusIcon size={12} /> {project.status}
            </span>

            {project.visibility && (
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                background: project.visibility === 'private' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                border: `1px solid ${project.visibility === 'private' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                color: project.visibility === 'private' ? '#fca5a5' : '#6ee7b7',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {project.visibility}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Project Development Progress</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EC170F' }}>{project.progress}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${project.progress}%`,
              borderRadius: '3px',
              background: 'linear-gradient(90deg, #EC170F, #0B3B9B)',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>

        {/* Full Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Overview & Specifications
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            {project.description}
          </p>
        </div>

        {/* Notes (if available) */}
        {project.notes && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'rgba(11,59,155,0.1)', border: '1px solid rgba(11,59,155,0.3)' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              Key Features & Notes
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              {project.notes}
            </p>
          </div>
        )}

        {/* Tech Stack Badges */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Layers size={12} /> Tech Stack & Architecture
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {inferredTags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                  background: 'rgba(236,23,15,0.08)', border: '1px solid rgba(236,23,15,0.25)',
                  color: '#fca5a5',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Assigned Team Members */}
        {project.assignedMembers && project.assignedMembers.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Users size={12} /> Assigned Engineers ({project.assignedMembers.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.assignedMembers.map((m) => (
                <Link
                  key={m._id}
                  href={`/team/${m._id}`}
                  onClick={onClose}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 14px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#EC170F'; e.currentTarget.style.color = '#EC170F'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #EC170F, #0B3B9B)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: 'white',
                  }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{m.name}</span>
                  <ArrowUpRight size={12} style={{ opacity: 0.5 }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-btn-primary"
            >
              <Link2 size={16} /> Visit Project Web
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-btn-secondary"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-btn-ghost"
            >
              <GithubIcon size={16} /> GitHub Code
            </a>
          )}
          {onVaultClick && (
            <button
              onClick={() => { onClose(); onVaultClick(project._id, project.title); }}
              className="showcase-btn-vault"
            >
              <Shield size={15} /> Project Vault
            </button>
          )}
        </div>
      </div>

      <style>{`
        .warp-backdrop {
          animation: fadeIn 0.25s ease-out;
        }
        .warp-modal-card {
          animation: warpScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes warpScale {
          from { opacity: 0; transform: scale(0.85) translateY(20px); filter: blur(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .showcase-btn-primary {
          display: inline-flex; alignItems: center; gap: 8px;
          padding: 12px 22px; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #EC170F, #0B3B9B);
          color: white; font-weight: 700; font-size: 0.9rem; text-decoration: none;
          box-shadow: 0 8px 24px rgba(236, 23, 15, 0.3); transition: all 0.2s;
        }
        .showcase-btn-primary:hover {
          transform: translateY(-2px); box-shadow: 0 12px 30px rgba(236, 23, 15, 0.45);
        }
        .showcase-btn-secondary {
          display: inline-flex; alignItems: center; gap: 8px;
          padding: 12px 20px; border-radius: 12px;
          background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.35);
          color: #6ee7b7; font-weight: 700; font-size: 0.9rem; text-decoration: none;
          transition: all 0.2s;
        }
        .showcase-btn-secondary:hover {
          background: rgba(16,185,129,0.22); transform: translateY(-2px);
        }
        .showcase-btn-ghost {
          display: inline-flex; alignItems: center; gap: 8px;
          padding: 12px 20px; border-radius: 12px;
          background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle);
          color: var(--text-secondary); font-weight: 700; font-size: 0.9rem; text-decoration: none;
          transition: all 0.2s;
        }
        .showcase-btn-ghost:hover {
          color: white; border-color: rgba(255,255,255,0.3); transform: translateY(-2px);
        }
        .showcase-btn-vault {
          display: inline-flex; alignItems: center; gap: 8px;
          padding: 12px 20px; border-radius: 12px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5; font-weight: 700; font-size: 0.9rem; cursor: pointer;
          transition: all 0.2s;
        }
        .showcase-btn-vault:hover {
          background: rgba(239,68,68,0.2); transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
