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
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', background: 'rgba(7, 6, 14, 0.88)', backdropFilter: 'blur(16px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '2px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #EC170F',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
        className="animate-fade-in-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'transparent', border: '1px solid var(--border-subtle)',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#EC170F'; e.currentTarget.style.borderColor = '#EC170F'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <X size={18} />
        </button>

        {/* Top Editorial Kicker Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <span className="editorial-section-number">PROJECT SPECIFICATIONS</span>
        </div>

        {/* Title & Badges */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem', color: 'var(--text-primary)' }}
          >
            {project.title}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              background: status.bg, border: `1px solid ${status.border}`, color: status.color,
            }}>
              <StatusIcon size={12} /> {project.status.toUpperCase()}
            </span>

            {project.visibility && (
              <span style={{
                padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}>
                {project.visibility}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="editorial-metadata">DEVELOPMENT PROGRESS</span>
            <span style={{ fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#EC170F' }}>
              {project.progress}%
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${project.progress}%`,
              background: '#EC170F',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>

        {/* Overview */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 className="editorial-metadata" style={{ marginBottom: '0.5rem', color: '#EC170F' }}>
            OVERVIEW
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            {project.description}
          </p>
        </div>

        {/* Notes */}
        {project.notes && (
          <div style={{ marginBottom: '1.75rem', padding: '1rem', background: 'rgba(11,59,155,0.1)', border: '1px solid rgba(11,59,155,0.3)' }}>
            <h4 className="editorial-metadata" style={{ color: '#0B3B9B', marginBottom: '0.4rem' }}>
              KEY ARCHITECTURE NOTES
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              {project.notes}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 className="editorial-metadata" style={{ marginBottom: '0.75rem' }}>
            TECH STACK & ARCHITECTURE
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {inferredTags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  background: 'rgba(236,23,15,0.08)', border: '1px solid rgba(236,23,15,0.25)',
                  color: 'var(--text-primary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Assigned Engineers */}
        {project.assignedMembers && project.assignedMembers.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 className="editorial-metadata" style={{ marginBottom: '0.75rem' }}>
              ASSIGNED ENGINEERS ({project.assignedMembers.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.assignedMembers.map((m) => (
                <Link
                  key={m._id}
                  href={`/team/${m._id}`}
                  onClick={onClose}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 14px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                  className="editorial-link-hover"
                >
                  <span>{m.name}</span>
                  <ArrowUpRight size={12} style={{ color: '#EC170F' }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.78rem' }}
            >
              <Link2 size={15} /> VISIT WEBSITE
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.78rem' }}
            >
              <ExternalLink size={15} /> LIVE DEMO
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.78rem' }}
            >
              <GithubIcon size={15} /> REPOSITORY
            </a>
          )}
          {onVaultClick && (
            <button
              onClick={() => { onClose(); onVaultClick(project._id, project.title); }}
              style={{
                padding: '10px 20px', fontSize: '0.78rem',
                background: 'rgba(236,23,15,0.1)', border: '1px solid #EC170F',
                color: '#EC170F', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <Shield size={14} /> VAULT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
