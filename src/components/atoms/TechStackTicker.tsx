'use client';

import React from 'react';

const TECH_STACK = [
  { name: 'NEXT.JS 16', category: 'FRAMEWORK' },
  { name: 'REACT 19', category: 'FRONTEND' },
  { name: 'TYPESCRIPT', category: 'LANGUAGE' },
  { name: 'NODE.JS', category: 'BACKEND' },
  { name: 'PYTHON', category: 'AI / ML' },
  { name: 'MONGODB', category: 'DATABASE' },
  { name: 'THREE.JS', category: '3D WEBGL' },
  { name: 'TAILWIND CSS', category: 'STYLING' },
  { name: 'FRAMER MOTION', category: 'ANIMATION' },
  { name: 'MONGOOSE', category: 'ORM' },
  { name: 'DOCKER', category: 'DEVOPS' },
  { name: 'GIT & GITHUB', category: 'VCS' },
];

export default function TechStackTicker() {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        padding: '1.5rem 0',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 6, 14, 0.6)',
      }}
    >
      {/* Edge Gradients */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '100px',
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
          width: '100px',
          background: 'linear-gradient(to left, var(--bg-base), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div className="editorial-marquee-track">
        {[...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
          <div
            key={`${tech.name}-${idx}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 24px',
              borderRight: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--text-primary)',
            }}
          >
            <span style={{ color: '#EC170F' }}>—</span>
            <span>{tech.name}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 500 }}>
              [{tech.category}]
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .editorial-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 32s linear infinite;
        }
        .editorial-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
