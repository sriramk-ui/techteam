'use client';

import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/atoms/icons';

interface MemberCardProps {
  member: {
    _id: string;
    name: string;
    role: 'ADMIN' | 'MEMBER';
    profilePic?: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      instagram?: string;
      gmail?: string;
    };
  };
  index?: number;
}

const socialIcons = [
  { key: 'github', Icon: GithubIcon, label: 'GitHub' },
  { key: 'linkedin', Icon: LinkedinIcon, label: 'LinkedIn' },
  { key: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
  { key: 'gmail', Icon: Mail, label: 'Gmail' },
];

export default function MemberCard({ member, index = 0 }: MemberCardProps) {
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const hue = member.name.charCodeAt(0) * 137 % 360;
  const memberNum = String(index + 1).padStart(2, '0');

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        padding: '2.5rem 2rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '380px',
        transition: 'all 0.3s ease',
      }}
      className="editorial-member-card"
    >
      {/* Ghost link to member portfolio */}
      <Link
        href={`/team/${member._id}`}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        title={`View ${member.name}'s Portfolio`}
      />

      <div>
        {/* Top Bar with Number & Role */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span className="editorial-section-number">{memberNum}</span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 10px',
              border: `1px solid ${member.role === 'ADMIN' ? '#EC170F' : 'var(--border-subtle)'}`,
              color: member.role === 'ADMIN' ? '#EC170F' : 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {member.role === 'ADMIN' ? 'LEAD ARCHITECT' : 'CORE ENGINEER'}
          </span>
        </div>

        {/* Asymmetric Avatar Frame */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {member.profilePic ? (
            <img
              src={member.profilePic}
              alt={member.name}
              style={{
                width: '84px',
                height: '84px',
                objectFit: 'cover',
                border: '2px solid #EC170F',
                filter: 'brightness(0.95) contrast(1.05)',
                position: 'relative',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          ) : (
            <div
              style={{
                width: '84px',
                height: '84px',
                background: `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${(hue + 60) % 360},70%,30%))`,
                border: '2px solid #EC170F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900,
                color: 'white',
                position: 'relative',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              {initials}
            </div>
          )}

          <div>
            <h3
              className="editorial-display-heading"
              style={{
                fontSize: '1.4rem',
                color: 'var(--text-primary)',
                marginBottom: '4px',
                lineHeight: 1.1,
                position: 'relative',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              {member.name}
            </h3>
            <span
              className="editorial-metadata"
              style={{ fontSize: '0.72rem', color: '#EC170F', position: 'relative', zIndex: 2, pointerEvents: 'none' }}
            >
              FULL STACK / SYSTEMS
            </span>
          </div>
        </div>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          Specialized in full-stack architecture, high-performance web platforms, and automated system workflows.
        </p>
      </div>

      {/* Social Links & CTA */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          {member.socialLinks && socialIcons.map(({ key, Icon }) => {
            const url = member.socialLinks?.[key as keyof typeof member.socialLinks];
            if (!url) return null;
            const href = key === 'gmail' ? `mailto:${url}` : url;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={key}
                style={{
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s',
                }}
                onClick={(e) => e.stopPropagation()}
                className="editorial-social-icon"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#EC170F',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          PORTFOLIO <ArrowUpRight size={14} />
        </span>
      </div>

      <style>{`
        .editorial-member-card:hover {
          border-color: #EC170F !important;
          transform: translateY(-4px);
        }
        .editorial-social-icon:hover {
          color: #EC170F !important;
        }
      `}</style>
    </div>
  );
}
