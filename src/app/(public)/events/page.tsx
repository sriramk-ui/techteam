import type { Metadata } from 'next';
import { Trophy } from 'lucide-react';
import EventCard from '@/components/molecules/EventCard';
import { Event } from '@/models/Event';
import connectToDatabase from '@/lib/db';

export const metadata: Metadata = {
  title: 'Events & Track Record | Tech Team Studio',
  description: 'Hackathons, national competitions, and workshops participated in by Tech Team Studio.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPublicEvents() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).sort({ date: -1 }).lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error('Error fetching public events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getPublicEvents();

  return (
    <div style={{ minHeight: '85vh', position: 'relative', background: 'var(--bg-base)', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '5rem 2rem 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">04 — EVENTS</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
            <span className="editorial-metadata">[{events.length} RECORDED]</span>
          </div>

          <h1
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', marginBottom: '1.5rem' }}
          >
            WHERE WE <span style={{ color: '#EC170F' }}>COMPETE.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            National hackathons, engineering summits, and technical competitions where Tech Team tests and validates its capabilities.
          </p>
        </div>

        <div className="editorial-hr" style={{ margin: '2rem 0 3.5rem' }} />

        {/* Event Cards Grid */}
        {events.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {events.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
            <Trophy size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>NO EVENTS RECORDED YET</p>
          </div>
        )}
      </div>
    </div>
  );
}
