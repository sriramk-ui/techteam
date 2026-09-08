import { Users, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import MemberCard from '@/components/molecules/MemberCard';
import Link from 'next/link';
import { User } from '@/models/User';
import connectToDatabase from '@/lib/db';

export const metadata: Metadata = {
  title: 'Team | Tech Team Studio',
  description: 'Meet the engineers, designers, and problem solvers of Tech Team Studio.',
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
    <div style={{ minHeight: '85vh', position: 'relative', background: 'var(--bg-base)', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '5rem 2rem 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">02 — PEOPLE</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
            <span className="editorial-metadata">[{members.length} MEMBERS]</span>
          </div>

          <h1
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', marginBottom: '1.5rem' }}
          >
            MEET THE <span style={{ color: '#EC170F' }}>TEAM.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            The developers, designers, and engineers behind Tech Team. Click any member to explore their developer profile and shipped projects.
          </p>
        </div>

        <div className="editorial-hr" style={{ margin: '2rem 0 3.5rem' }} />

        {/* Editorial Member Grid */}
        {members.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {members.map((member: any, idx: number) => (
              <MemberCard key={member._id} member={member} index={idx} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>NO TEAM MEMBERS FOUND</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Link href="/projects" className="editorial-btn-primary">
            <span>SEE WHAT WE BUILT</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
