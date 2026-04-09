import type { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import EventCard from '@/components/EventCard';

export const metadata: Metadata = {
  title: 'Events | Catalyst OS',
  description: 'Hackathons, workshops, and competitions we have participated in.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Event } from '@/models/Event';
import connectToDatabase from '@/lib/db';

async function getPublicEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getPublicEvents();

  return (
    <div style={{ minHeight: '80vh', position: 'relative' }}>
      <div className="orb" style={{ width: '350px', height: '350px', background: '#f59e0b', top: 0, right: '15%', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '20px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem',
          }}>
            <Trophy size={13} /> Events & Hackathons
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Where We <span className="gradient-text">Compete</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            From late-night hackathons to industry conferences — here&apos;s where we put our skills to the test.
          </p>
        </div>

        {events.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {events.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Trophy size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No events yet — watch this space!</p>
          </div>
        )}
      </div>
    </div>
  );
}
