'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ExternalLink, Shield, Users, Code2, Link2 } from 'lucide-react';
import { GithubIcon } from '@/components/atoms/icons';
import { getProjectCoverSrc } from '@/components/molecules/ProjectCard';

interface Project {
  _id: string;
  title: string;
  description: string;
  status?: 'Planning' | 'Active' | 'Completed';
  progress?: number;
  githubUrl?: string;
  demoUrl?: string;
  projectUrl?: string;
  notes?: string;
  tags?: string[];
  image?: string;
  coverImage?: string;
  assignedMembers?: { _id: string; name: string }[];
  visibility?: 'public' | 'private';
}

interface LatestProjectsShowcaseProps {
  projects: Project[];
  totalCount?: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  onProjectClick: (project: Project) => void;
  onVaultClick?: (project: Project) => void;
}

const fallbackCovers = [
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
];

export default function LatestProjectsShowcase({
  projects,
  totalCount = 0,
  selectedCategory,
  onSelectCategory,
  categories,
  onProjectClick,
  onVaultClick,
}: LatestProjectsShowcaseProps) {
  return (
    <div className="zhanx-showcase-wrapper">
      {/* Header Section */}
      <div className="showcase-header">
        <div>
          <span className="header-tag">OUR PORTFOLIO</span>
          <h2 className="header-title">
            LATEST <br />
            <span className="accent-text">PROJECTS.</span>
          </h2>
        </div>
        <div className="header-right">
          <p className="header-desc">
            A selection of live projects built across full stack development, REST APIs, and production deployments.
          </p>
          <Link href="/projects" className="view-all-btn">
            VIEW ALL PROJECTS ({totalCount > 0 ? totalCount : projects.length}) <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="filter-pills-container">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asymmetric Project Grid */}
      {projects.length > 0 ? (
        <div className="zhanx-asymmetric-grid">
          {projects.map((project, idx) => {
            const rawCover = project.coverImage || project.image || project.projectUrl || project.demoUrl;
            const coverSrc = getProjectCoverSrc(rawCover) || fallbackCovers[idx % fallbackCovers.length];
            const projectNumber = String(idx + 1).padStart(2, '0');
            const primaryTag = project.tags && project.tags.length > 0 ? project.tags[0].toUpperCase() : 'FULL-STACK';

            const patternIndex = idx % 4;
            const isPanoramicRow = patternIndex === 2 || patternIndex === 3;
            const colSpan = patternIndex === 2 ? 7 : patternIndex === 3 ? 5 : 6;
            const cardHeight = isPanoramicRow ? '290px' : '440px';

            return (
              <div
                key={project._id || idx}
                className={`zhanx-showcase-card span-col-${colSpan} ${isPanoramicRow ? 'panoramic-card' : 'tall-card'}`}
                style={{ height: cardHeight }}
                onClick={() => onProjectClick(project)}
              >
                {/* Scaled UI Screenshot Preview */}
                <div
                  className="zhanx-card-bg"
                  style={{ backgroundImage: `url(${coverSrc})` }}
                />

                {/* Subtle Gradient Overlay */}
                <div className="zhanx-card-vignette" />

                {/* Top Bar: Single Tag & Arrow Circle Button */}
                <div className="zhanx-card-top-bar">
                  <span className="zhanx-num-tag">
                    {projectNumber} / {primaryTag}
                  </span>
                  <div className="zhanx-arrow-circle">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                {/* Bottom Bar: ONLY Project Name & Minimal Action Bar */}
                <div className="zhanx-card-bottom">
                  <h3 className="zhanx-card-title">
                    {project.title}
                  </h3>

                  {/* Action Bar */}
                  <div className="zhanx-card-actions">
                    <div className="left-meta">
                      {project.assignedMembers && project.assignedMembers.length > 0 && (
                        <div className="dev-count-badge">
                          <Users size={13} color="#EC170F" />
                          <span>{project.assignedMembers.length} Devs</span>
                        </div>
                      )}
                      {onVaultClick && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVaultClick(project);
                          }}
                          className="vault-btn"
                          title="Project Vault"
                        >
                          <Shield size={13} /> Vault
                        </button>
                      )}
                    </div>

                    <div className="right-links">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-icon-link"
                          title="Visit Website"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link2 size={15} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-icon-link"
                          title="GitHub Repo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GithubIcon size={15} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-icon-link"
                          title="Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="showcase-empty-state">
          <Code2 size={42} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No projects found in this category.</p>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .zhanx-showcase-wrapper {
          width: 100%;
          position: relative;
          color: var(--text-primary);
        }

        .showcase-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .header-tag {
          color: #EC170F;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 6px;
          font-family: 'JetBrains Mono', monospace;
        }

        .header-title {
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        .accent-text {
          color: #EC170F;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .header-desc {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 440px;
          margin: 0;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #EC170F;
          font-size: 0.85rem;
          font-weight: 800;
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
          transition: transform 0.2s ease;
        }

        .view-all-btn:hover {
          transform: translateX(4px);
        }

        .filter-pills-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .filter-pill {
          padding: 6px 16px;
          border-radius: 2px;
          font-size: 0.82rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          border-color: #EC170F;
          color: #EC170F;
        }

        .filter-pill.active {
          background: #EC170F;
          border-color: #EC170F;
          color: #FFFFFF;
        }

        /* Zhanx Asymmetric Grid */
        .zhanx-asymmetric-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }

        .span-col-6 { grid-column: span 6; }
        .span-col-7 { grid-column: span 7; }
        .span-col-5 { grid-column: span 5; }

        @media (max-width: 900px) {
          .span-col-6, .span-col-7, .span-col-5 {
            grid-column: span 12 !important;
            height: 340px !important;
          }
        }

        /* Card Container */
        .zhanx-showcase-card {
          position: relative;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          background: #060913;
          border: 1px solid var(--border-subtle);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .zhanx-showcase-card:hover {
          transform: translateY(-6px);
          border-color: #EC170F;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
        }

        .zhanx-card-bg {
          position: absolute;
          inset: 0;
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: top center;
          filter: brightness(0.92) contrast(1.05);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
          z-index: 1;
        }

        .zhanx-showcase-card:hover .zhanx-card-bg {
          transform: scale(1.03);
          filter: brightness(1.0) contrast(1.1);
        }

        .zhanx-card-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 6, 14, 0.5) 0%, rgba(7, 6, 14, 0.1) 40%, rgba(7, 6, 14, 0.95) 100%);
          z-index: 2;
        }

        /* Top Bar */
        .zhanx-card-top-bar {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .zhanx-num-tag {
          font-size: 0.78rem;
          font-weight: 800;
          color: #EC170F;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
          background: rgba(7, 6, 14, 0.85);
          padding: 4px 10px;
          border: 1px solid var(--border-subtle);
        }

        .zhanx-arrow-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(7, 6, 14, 0.85);
          border: 1px solid var(--border-subtle);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          transition: all 0.3s ease;
        }

        .zhanx-showcase-card:hover .zhanx-arrow-circle {
          background: #EC170F;
          color: #FFFFFF;
          border-color: #EC170F;
          transform: scale(1.1) rotate(45deg);
        }

        /* Bottom Content */
        .zhanx-card-bottom {
          position: relative;
          z-index: 3;
        }

        .zhanx-card-title {
          font-size: clamp(1.3rem, 2.2vw, 1.75rem);
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          line-height: 1.2;
          font-family: 'Inter', sans-serif;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .zhanx-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.6rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .left-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dev-count-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #cbd5e1;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }

        .vault-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 2px;
          background: rgba(236, 23, 15, 0.15);
          border: 1px solid #EC170F;
          color: #EC170F;
          font-size: 0.72rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.2s;
        }

        .right-links {
          display: flex;
          gap: 8px;
        }

        .action-icon-link {
          width: 32px;
          height: 32px;
          border-radius: 2px;
          background: rgba(7, 6, 14, 0.85);
          border: 1px solid var(--border-subtle);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          transition: all 0.2s;
          text-decoration: none;
        }

        .action-icon-link:hover {
          border-color: #EC170F;
          color: #EC170F;
          background: rgba(236, 23, 15, 0.2);
          transform: translateY(-2px);
        }

        .showcase-empty-state {
          text-align: center;
          padding: 5rem 0;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
