'use client';

import { ExternalLink, Users, Shield, Link2, ArrowUpRight, Lock, Eye } from 'lucide-react';
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
    notes?: string;
    tags?: string[];
    image?: string;
    coverImage?: string;
    assignedMembers?: { _id: string; name: string }[];
    visibility?: 'public' | 'private';
  };
  index?: number;
  showVisibility?: boolean;
  onVaultClick?: () => void;
  onCardClick?: (project: any) => void;
}

const defaultCoverImages = [
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
];

export function getProjectCoverSrc(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(trimmed)}?w=1000`;
  }

  return trimmed;
}

export default function ProjectCard({
  project,
  index = 0,
  showVisibility = false,
  onVaultClick,
  onCardClick,
}: ProjectCardProps) {
  const rawCover = project.coverImage || project.image || project.projectUrl || project.demoUrl;
  const coverUrl = getProjectCoverSrc(rawCover) || defaultCoverImages[index % defaultCoverImages.length];

  const primaryTag = project.tags && project.tags.length > 0
    ? project.tags[0].toUpperCase()
    : 'FULL-STACK';

  const projectNumber = String(index + 1).padStart(2, '0');
  const isEven = index % 2 === 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(project);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        width: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '2px',
        overflow: 'hidden',
        cursor: 'pointer',
        marginBottom: '2rem',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
      }}
      className="editorial-project-card"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        {/* Image Block */}
        <div
          style={{
            position: 'relative',
            minHeight: '340px',
            background: '#030712',
            order: isEven ? 1 : 2,
            overflow: 'hidden',
          }}
        >
          <div
            className="editorial-project-bg"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: '100% auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
              filter: 'brightness(0.9) contrast(1.05)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              background: 'rgba(7, 6, 14, 0.85)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 14px',
              color: '#EC170F',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
            }}
          >
            {projectNumber} / {primaryTag}
          </div>
        </div>

        {/* Content Block */}
        <div
          style={{
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            order: isEven ? 2 : 1,
            background: 'var(--bg-card)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="editorial-section-number">{projectNumber}</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                YEAR 2026
              </span>
            </div>

            <h3
              className="editorial-display-heading"
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                marginBottom: '1rem',
                color: 'var(--text-primary)',
              }}
            >
              {project.title}
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="editorial-btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                VIEW PROJECT <ArrowUpRight size={14} />
              </span>

              {onVaultClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVaultClick();
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(236,23,15,0.4)',
                    color: '#EC170F',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Shield size={13} /> VAULT
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Link2 size={16} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <GithubIcon size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .editorial-project-card:hover {
          border-color: #EC170F !important;
          transform: translateY(-4px);
        }
        .editorial-project-card:hover .editorial-project-bg {
          transform: scale(1.03);
          filter: brightness(1.0) contrast(1.1) !important;
        }
      `}</style>
    </div>
  );
}
