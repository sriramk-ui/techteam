'use client';

import { Trophy, Calendar, Users, ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  event: {
    _id: string;
    name: string;
    type: string;
    date: string;
    result?: string;
    assignedMembers?: { _id: string; name: string }[];
    images?: string[];
  };
}

export default function EventCard({ event }: EventCardProps) {
  const dateObj = new Date(event.date);
  const year = dateObj.getFullYear();
  const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase();
  const isUpcoming = dateObj > new Date();

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isUpcoming ? '#EC170F' : 'var(--border-subtle)'}`,
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '340px',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
      className="editorial-event-card"
    >
      <div>
        {/* Top Bar: Year & Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span className="editorial-display-heading" style={{ fontSize: '2.2rem', color: isUpcoming ? '#EC170F' : 'var(--text-primary)' }}>
            {year}
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              border: `1px solid ${isUpcoming ? '#EC170F' : 'var(--border-subtle)'}`,
              color: isUpcoming ? '#EC170F' : 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {isUpcoming ? 'UPCOMING' : event.type.toUpperCase()}
          </span>
        </div>

        {/* Date Kicker */}
        <div className="editorial-metadata" style={{ color: '#EC170F', marginBottom: '0.75rem' }}>
          {dateStr}
        </div>

        {/* Title */}
        <h3
          className="editorial-display-heading"
          style={{
            fontSize: '1.6rem',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          {event.name}
        </h3>

        {/* Team Members Count */}
        {event.assignedMembers && event.assignedMembers.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }}>
            <Users size={14} color="#EC170F" />
            <span>{event.assignedMembers.length} DEVS PARTICIPATING</span>
          </div>
        )}
      </div>

      {/* Result Badge / Footer */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
        {event.result ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#EC170F',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Trophy size={14} /> {event.result.toUpperCase()}
          </div>
        ) : (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <span>VIEW EVENT</span> <ArrowUpRight size={14} style={{ color: '#EC170F' }} />
          </div>
        )}
      </div>

      <style>{`
        .editorial-event-card:hover {
          border-color: #EC170F !important;
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
