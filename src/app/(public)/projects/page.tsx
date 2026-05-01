import type { Metadata } from 'next';
import { Code2 } from 'lucide-react';
import Link from 'next/link';
import ProjectList from '@/components/ProjectList';
import { Project } from '@/models/Project';
import { User } from '@/models/User'; // Required for populate to work correctly
import connectToDatabase from '@/lib/db';

export const metadata: Metadata = {
  title: 'Projects | Catalyst OS',
  description: 'Explore the public projects built by Catalyst OS — spanning web apps, tools, and more.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPublicProjects() {
  try {
    await connectToDatabase();
    // Population requires the User model to be imported first
    const projects = await Project.find({ visibility: 'public' })
      .populate('assignedMembers', 'name') // Only need name for count or simple display
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

        {/* Dynamic Project List with Functional Filters */}
        {projects.length > 0 ? (
          <ProjectList initialProjects={projects} />
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
