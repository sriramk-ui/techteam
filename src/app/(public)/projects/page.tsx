import type { Metadata } from 'next';
import { Code2 } from 'lucide-react';
import Link from 'next/link';
import ProjectList from '@/components/organisms/ProjectList';
import { Project } from '@/models/Project';
import { User } from '@/models/User';
import connectToDatabase from '@/lib/db';

export const metadata: Metadata = {
  title: 'Projects | Tech Team Studio',
  description: 'Explore the editorial showcase of projects built by Tech Team — spanning web apps, tools, and digital platforms.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPublicProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({ visibility: 'public' })
      .populate('assignedMembers', 'name')
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <div style={{ minHeight: '85vh', position: 'relative', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '5rem 2rem 6rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">01 — WORK</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
            <span className="editorial-metadata">[{projects.length} SHIPPED]</span>
          </div>

          <h1
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', marginBottom: '1.5rem' }}
          >
            PROJECT <span style={{ color: '#EC170F' }}>SHOWCASE.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Production-grade web platforms, interactive tools, and experimental software systems engineered by Tech Team.
          </p>
        </div>

        <div className="editorial-hr" style={{ margin: '2rem 0 3rem' }} />

        {/* Dynamic Project List */}
        {projects.length > 0 ? (
          <ProjectList initialProjects={projects} />
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
            <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>NO PUBLIC PROJECTS YET</p>
            <Link href="/team" className="editorial-btn-secondary">MEET THE TEAM →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
