'use client';

import { useState } from 'react';
import { Code2 } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  initialProjects: any[];
}

const filterOptions = ['All', 'Planning', 'Active', 'Completed'];

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = initialProjects.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter;
  });

  return (
    <>
      {/* Status filter pills */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {filterOptions.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: isActive ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(139,92,246,0.6)' : 'var(--border-subtle)'}`,
                color: isActive ? '#c4b5fd' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grid - using global animate-fade-in class from globals.css to ensure hydration safety */}
      {filteredProjects.length > 0 ? (
        <div 
          key={activeFilter} // Key change ensures animation re-triggers on filter change
          className="animate-fade-in"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.25rem'
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>No projects found in this category.</p>
        </div>
      )}
    </>
  );
}
