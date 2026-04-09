'use client';

import { ExternalLink, Users, CheckCircle, Clock, Loader, Shield, Link2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description: string;
    status: 'Planning' | 'Active' | 'Completed';
    progress: number;
    githubUrl?: string;
    demoUrl?: string;
    projectUrl?: string;
    assignedMembers?: { _id: string; name: string }[];
    visibility?: 'public' | 'private';
  };
  showVisibility?: boolean;
  onVaultClick?: () => void;
}

const statusConfig = {
  Planning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', Icon: Clock },
  Active: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', Icon: Loader },
  Completed: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', Icon: CheckCircle },
};

export default function ProjectCard({ project, showVisibility = false, onVaultClick }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const StatusIcon = status.Icon;

  return (
    <div
      className="glow-border project-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.15, flex: 1 }}>
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-title-link"
            >
              {project.title}
              <Link2 size={12} style={{ marginLeft: '5px', opacity: 0.6, flexShrink: 0 }} />
            </a>
          ) : (
            project.title
          )}
        </h3>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {showVisibility && (
            <span style={{
              padding: '2px 8px', borderRadius: '20px',
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em',
              background: project.visibility === 'private' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              border: `1px solid ${project.visibility === 'private' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
              color: project.visibility === 'private' ? '#fca5a5' : '#6ee7b7',
              textTransform: 'uppercase' as const,
            }}>
              {project.visibility}
            </span>
          )}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
            background: status.bg, border: `1px solid ${status.border}`, color: status.color,
          }}>
            <StatusIcon size={10} /> {project.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.description}
      </p>

      {/* Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{project.progress}%</span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${project.progress}%`,
            borderRadius: '2px',
            background: `linear-gradient(90deg, #8b5cf6, #06b6d4)`,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Members + Links */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {project.assignedMembers && project.assignedMembers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Users size={13} />
              <span>{project.assignedMembers.length}</span>
            </div>
          )}
          {onVaultClick && (
            <button 
              onClick={onVaultClick}
              title="Project Vault"
              className="proj-vault-btn"
            >
              <Shield size={13} /> Vault
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" title="Visit Project" className="proj-link-btn">
              <Link2 size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className="proj-github-btn">
              <GithubIcon size={14} />
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" title="Live Demo" className="proj-demo-btn">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        .project-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 50px rgba(0,0,0,0.4), 0 0 30px rgba(139,92,246,0.12);
        }
        .proj-title-link {
          display: inline-flex; align-items: center;
          color: var(--text-primary); text-decoration: none;
          transition: color 0.2s;
        }
        .proj-title-link:hover {
          color: #a78bfa;
        }
        .proj-link-btn {
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #67e8f9; text-decoration: none; transition: all 0.2s;
        }
        .proj-link-btn:hover {
          background: rgba(6,182,212,0.18); border-color: rgba(6,182,212,0.5);
        }
        .proj-github-btn {
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); text-decoration: none; transition: all 0.2s;
        }
        .proj-github-btn:hover {
          color: white; border-color: rgba(255,255,255,0.2);
        }
        .proj-demo-btn {
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-primary); text-decoration: none; transition: all 0.2s;
        }
        .proj-demo-btn:hover {
          background: rgba(139,92,246,0.2);
        }
        .proj-vault-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5; font-size: 0.72rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .proj-vault-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.4);
        }
      `}</style>
    </div>
  );
}
