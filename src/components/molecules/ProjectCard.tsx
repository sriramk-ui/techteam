'use client';

import { ExternalLink, Users, CheckCircle, Clock, Loader, Shield, Link2, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '@/components/atoms/icons';

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
  
  // Decide the main link for the "whole card click"
  const mainUrl = project.projectUrl || project.demoUrl || project.githubUrl;

  return (
    <div
      className="glow-border project-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '270px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ghost link for whole card clickability */}
      {mainUrl && (
        <a 
          href={mainUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="card-ghost-link"
          title={`Visit ${project.title}`}
        />
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', position: 'relative', zIndex: 2, pointerEvents: 'none', height: '2.8rem', flexShrink: 0 }}>
        <h3 style={{
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxHeight: '2.6rem',
          margin: 0,
        }}>
          {project.title}
          {mainUrl && <ArrowUpRight size={14} className="title-arrow" style={{ opacity: 0, transition: 'all 0.3s', display: 'inline-block', marginLeft: '4px' }} />}
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
              height: '22px', display: 'inline-flex', alignItems: 'center',
            }}>
              {project.visibility}
            </span>
          )}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
            background: status.bg, border: `1px solid ${status.border}`, color: status.color,
            height: '22px',
          }}>
            <StatusIcon size={10} /> {project.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '0.875rem', 
        lineHeight: 1.5, 
        height: '2.6rem',
        display: '-webkit-box', 
        WebkitLineClamp: 2, 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',
        zIndex: 2,
        pointerEvents: 'none',
        margin: 0,
        flexShrink: 0,
      }}>
        {project.description}
      </p>

      {/* Progress Bar */}
      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none', marginTop: 'auto', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{project.progress}%</span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${project.progress}%`,
            borderRadius: '2px',
            background: `linear-gradient(90deg, #EC170F, #0B3B9B)`,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Members + Links */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '32px', position: 'relative', zIndex: 3, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {project.assignedMembers && project.assignedMembers.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Users size={13} />
              <span>{project.assignedMembers.length}</span>
            </div>
          )}
          {onVaultClick && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVaultClick(); }}
              title="Project Vault"
              className="proj-vault-btn"
            >
              <Shield size={13} /> Vault
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {project.projectUrl && (
            <a 
              href={project.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Visit Project" 
              className="proj-link-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <Link2 size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="GitHub" 
              className="proj-github-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <GithubIcon size={14} />
            </a>
          )}
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Live Demo" 
              className="proj-demo-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        .project-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(236,23,15,0.2);
          border-color: rgba(236,23,15,0.5);
        }
        .project-card:hover .title-arrow {
          opacity: 1 !important;
          transform: translate(2px, -2px);
          color: #EC170F;
        }
        .card-ghost-link {
          position: absolute;
          inset: 0;
          z-index: 1;
          cursor: pointer;
        }
        .proj-link-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(11,59,155,0.2); border: 1px solid rgba(11,59,155,0.4);
          display: flex; align-items: center; justify-content: center;
          color: #FDFDFD; text-decoration: none; transition: all 0.2s;
        }
        .proj-link-btn:hover {
          background: rgba(11,59,155,0.4); border-color: #EC170F;
          transform: scale(1.05);
        }
        .proj-github-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); text-decoration: none; transition: all 0.2s;
        }
        .proj-github-btn:hover {
          color: white; border-color: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }
        .proj-demo-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(236,23,15,0.12); border: 1px solid rgba(236,23,15,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #EC170F; text-decoration: none; transition: all 0.2s;
        }
        .proj-demo-btn:hover {
          background: rgba(236,23,15,0.25);
          transform: scale(1.05);
        }
        .proj-vault-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 8px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5; font-size: 0.72rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        .proj-vault-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.4);
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
