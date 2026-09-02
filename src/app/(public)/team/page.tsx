import { Users, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import MemberCard from '@/components/molecules/MemberCard';
import Link from 'next/link';
import { User } from '@/models/User';
import connectToDatabase from '@/lib/db';

export const metadata: Metadata = {
  title: 'Meet the Team | Innovation Collaboration',
  description: 'Get to know the talented individuals behind Innovation Collaboration — developers, designers, and problem-solvers.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getTeamMembers() {
  try {
    await connectToDatabase();
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
    <div style={{ minHeight: '80vh', position: 'relative', paddingBottom: '6rem' }}>
      <div className="orb" style={{ width: '450px', height: '450px', background: '#EC170F', top: 0, right: '10%', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 2rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '20px',
            background: 'rgba(236, 23, 15, 0.08)', border: '1px solid rgba(236, 23, 15, 0.3)',
            color: '#EC170F', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem',
            letterSpacing: '0.05em',
          }}>
            <Users size={14} /> {members.length} TEAM MEMBERS
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            The <span className="gradient-text">People</span> Behind Innovation Collaboration
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
            Click on any member card to view their custom developer portfolio profile, skills, and shipped projects.
          </p>
        </div>

        {/* Grid */}
        {members.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
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
          color: #EC170F; text-decoration: none; font-weight: 700;
          transition: gap 0.2s;
        }
        .team-projects-link:hover { gap: 12px; }
      `}</style>
    </div>
  );
}
