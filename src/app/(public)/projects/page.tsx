import type { Metadata } from 'next';
import ProjectCard from '@/components/ProjectCard';
import { Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects | TeamOS',
  description: 'Explore the public projects built by TeamOS — spanning web apps, tools, and more.',
};

async function getPublicProjects() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.projects || [];
  } catch {
    return [];
  }
}

const filterOptions = ['All', 'Planning', 'Active', 'Completed'];

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div style={{ minHeight: '80vh', position: 'relative' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: '#06b6d4', top: 0, left: '5%', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '20px',
            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
            color: '#67e8f9', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem',
          }}>
            <Code2 size={13} /> {projects.length} Public Projects
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Things We&apos;ve <span className="gradient-text">Built</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Real projects. Real impact. From concept to deployment — here&apos;s our portfolio.
          </p>
        </div>

        {/* Status filter pills (visual only, SSR page) */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {filterOptions.map((f) => (
            <span key={f} style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
              background: f === 'All' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
              border: f === 'All' ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border-subtle)',
              color: f === 'All' ? '#c4b5fd' : 'var(--text-muted)',
              cursor: 'pointer',
            }}>
              {f}
            </span>
          ))}
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {projects.map((project: Parameters<typeof ProjectCard>[0]['project']) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ marginBottom: '1rem' }}>No public projects yet — stay tuned!</p>
            <Link href="/team" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Meet the team instead →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
