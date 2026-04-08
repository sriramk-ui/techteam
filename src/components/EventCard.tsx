'use client';

import { Trophy, Calendar, Users } from 'lucide-react';

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

const typeColors: Record<string, { color: string; bg: string }> = {
  Hackathon: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Workshop: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  Competition: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  Conference: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

export default function EventCard({ event }: EventCardProps) {
  const style = typeColors[event.type] || { color: '#a09db0', bg: 'rgba(160,157,176,0.1)' };
  const dateStr = new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="glow-border event-card" style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      position: 'relative' as const,
    }}>
      {/* Image slot */}
      <div style={{
        height: '140px',
        background: `linear-gradient(135deg, ${style.bg.replace('0.1', '0.3')} 0%, rgba(5,5,8,0.8) 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {event.images && event.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.images[0]} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Trophy size={42} color={style.color} style={{ opacity: 0.4 }} />
        )}
        {/* Type badge */}
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          padding: '3px 10px', borderRadius: '6px',
          fontSize: '0.72rem', fontWeight: 700,
          background: style.bg, color: style.color,
          border: `1px solid ${style.color}40`,
        }}>
          {event.type}
        </span>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
          {event.name}
        </h3>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Calendar size={12} /> {dateStr}
          </span>
          {event.assignedMembers && event.assignedMembers.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <Users size={12} /> {event.assignedMembers.length} members
            </span>
          )}
        </div>

        {event.result && (
          <div style={{
            padding: '8px 12px', borderRadius: '8px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.25)',
            fontSize: '0.8rem', color: '#6ee7b7',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Trophy size={11} /> {event.result}
          </div>
        )}
      </div>

      <style>{`
        .event-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 50px rgba(0,0,0,0.4), 0 0 30px rgba(139,92,246,0.12);
        }
      `}</style>
    </div>
  );
}
