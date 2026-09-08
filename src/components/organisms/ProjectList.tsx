'use client';

import { useState } from 'react';
import { Code2 } from 'lucide-react';
import ProjectCard from '@/components/molecules/ProjectCard';
import ProjectShowcaseModal from '@/components/molecules/ProjectShowcaseModal';

interface ProjectListProps {
  initialProjects: any[];
}

const filterOptions = ['All', 'Planning', 'Active', 'Completed'];

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showcaseProject, setShowcaseProject] = useState<any | null>(null);

  const filteredProjects = initialProjects.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter;
  });

  return (
    <>
      {/* Editorial Filter Pills */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {filterOptions.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '8px 20px',
                background: isActive ? '#EC170F' : 'transparent',
                border: `1px solid ${isActive ? '#EC170F' : 'var(--border-subtle)'}`,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              [{f}]
            </button>
          );
        })}
      </div>

      {/* Editorial Block List */}
      {filteredProjects.length > 0 ? (
        <div key={activeFilter} className="animate-fade-in">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project._id}
              project={project}
              index={idx}
              onCardClick={(p) => setShowcaseProject(p)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>NO PROJECTS FOUND IN THIS CATEGORY.</p>
        </div>
      )}

      {/* Showcase Modal */}
      <ProjectShowcaseModal
        project={showcaseProject}
        onClose={() => setShowcaseProject(null)}
      />
    </>
  );
}
