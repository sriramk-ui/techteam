'use client';

import React from 'react';

const TECH_STACK = [
  { name: 'Next.js 16', category: 'Framework', color: '#EC170F' },
  { name: 'React 19', category: 'Frontend', color: '#0B3B9B' },
  { name: 'TypeScript', category: 'Language', color: '#3178C6' },
  { name: 'Node.js', category: 'Backend', color: '#5FA04E' },
  { name: 'Python', category: 'AI / Backend', color: '#3776AB' },
  { name: 'MongoDB', category: 'Database', color: '#47A248' },
  { name: 'Three.js', category: '3D WebGL', color: '#000000' },
  { name: 'Tailwind CSS', category: 'Styling', color: '#06B6D4' },
  { name: 'Framer Motion', category: 'Animation', color: '#E10098' },
  { name: 'Mongoose', category: 'ORM', color: '#880000' },
  { name: 'Docker', category: 'DevOps', color: '#2496ED' },
  { name: 'Git & GitHub', category: 'VCS', color: '#F05032' },
];

export default function TechStackTicker() {
  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '1.25rem 0', position: 'relative', zIndex: 1 }}>
      {/* Fade masks on edges */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '80px',
          background: 'linear-gradient(to right, var(--bg-base), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '80px',
          background: 'linear-gradient(to left, var(--bg-base), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="ticker-track">
        {/* Double the list for infinite continuous loop */}
        {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
          <div
            key={`${tech.name}-${idx}`}
            className="glass glow-border"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'default',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: tech.color,
                boxShadow: `0 0 8px ${tech.color}`,
              }}
            />
            <span style={{ color: 'var(--text-primary)' }}>{tech.name}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {tech.category}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .ticker-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: tickerScroll 28s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
