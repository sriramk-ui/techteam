import { Users, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import MemberCard from '@/components/MemberCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Meet the Team | TeamOS',
  description: 'Get to know the talented individuals behind TeamOS — developers, designers, and problem-solvers.',
};

import { User } from '@/models/User';
import connectToDatabase from '@/lib/db';

async function getTeamMembers() {
  try {
    await connectToDatabase();
    // Return Lean objects for plain JSON serialization
    const users = await User.find({}).select('name role profilePic socialLinks').lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Error fetching public team members:', error);
    return [];
  }
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div style={{ minHeight: '80vh', position: 'relative' }}>
      <div className="orb" style={{ width: '400px', height: '400px', background: '#8b5cf6', top: 0, right: '10%', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '20px',
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
            color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem',
          }}>
            <Users size={13} /> {members.length} Members
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            The <span className="gradient-text">People</span> Behind the Work
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            A team of passionate engineers, designers, and builders who love creating things that matter.
          </p>
        </div>

        {/* Grid */}
        {members.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {members.map((member: any) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No team members yet. Check back soon!</p>
          </div>
        )}

        {/* Bottom link */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/projects" className="team-projects-link">
            See what we built <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .team-projects-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--accent-primary); text-decoration: none; fontWeight: 600;
          transition: gap 0.2s;
        }
        .team-projects-link:hover { gap: 12px; }
      `}</style>
    </div>
  );
}
