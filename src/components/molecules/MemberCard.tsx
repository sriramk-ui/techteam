'use client';

import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
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
}

const roleColors = {
  ADMIN: { bg: 'rgba(236,23,15,0.1)', border: 'rgba(236,23,15,0.3)', color: '#EC170F', label: 'Admin' },
  MEMBER: { bg: 'rgba(11,59,155,0.1)', border: 'rgba(11,59,155,0.3)', color: '#0B3B9B', label: 'Member' },
};

const socialIcons = [
  { key: 'github', Icon: GithubIcon, color: '#07060E' },
  { key: 'linkedin', Icon: LinkedinIcon, color: '#0B3B9B' },
  { key: 'instagram', Icon: InstagramIcon, color: '#EC170F' },
  { key: 'gmail', Icon: Mail, color: '#10b981' },
];

export default function MemberCard({ member }: MemberCardProps) {
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const roleStyle = roleColors[member.role] || roleColors.MEMBER;
  const hue = member.name.charCodeAt(0) * 137 % 360;

  return (
    <div
      className="glow-border card-shine member-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Whole Card Click Ghost Link to Member Portfolio */}
      <Link
        href={`/team/${member._id}`}
        className="card-ghost-link"
        title={`View ${member.name}'s Portfolio`}
      />

      {/* Avatar with Halo Ring */}
      {member.profilePic ? (
        <img
          src={member.profilePic}
          alt={member.name}
          style={{
            width: '80px', height: '80px', borderRadius: '50%',
            objectFit: 'cover', marginBottom: '1rem', flexShrink: 0,
            boxShadow: `0 0 25px rgba(236,23,15,0.25)`,
            border: `3px solid #EC170F`,
            position: 'relative', zIndex: 2, pointerEvents: 'none',
          }}
        />
      ) : (
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: `linear-gradient(135deg, hsl(${hue},70%,50%), hsl(${(hue + 60) % 360},70%,50%))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 800, color: 'white',
          marginBottom: '1rem',
          boxShadow: `0 0 25px rgba(236,23,15,0.25)`,
          border: `3px solid #EC170F`,
          flexShrink: 0,
          position: 'relative', zIndex: 2, pointerEvents: 'none',
        }}>
          {initials}
        </div>
      )}

      {/* Name */}
      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.4rem', position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        {member.name}
      </h3>

      {/* Role Badge */}
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: roleStyle.bg,
        border: `1px solid ${roleStyle.border}`,
        color: roleStyle.color,
        marginBottom: '1.25rem',
        position: 'relative', zIndex: 2, pointerEvents: 'none',
      }}>
        {roleStyle.label}
      </span>

      {/* Social Links */}
      {member.socialLinks && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', position: 'relative', zIndex: 3, marginBottom: '1.25rem' }}>
          {socialIcons.map(({ key, Icon, color }) => {
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
                className="social-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      )}

      {/* View Portfolio Button */}
      <div style={{ marginTop: 'auto', position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        <span className="view-profile-link" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#EC170F', fontSize: '0.85rem', fontWeight: 700,
          transition: 'gap 0.2s',
        }}>
          View Profile <ArrowRight size={14} />
        </span>
      </div>

      <style>{`
        .member-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .member-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(11,59,155,0.12), 0 0 30px rgba(236,23,15,0.2);
          border-color: rgba(236,23,15,0.5);
        }
        .member-card:hover .view-profile-link {
          gap: 10px;
        }
        .card-ghost-link {
          position: absolute;
          inset: 0;
          z-index: 1;
          cursor: pointer;
        }
        .social-btn {
          width: 32px; height: 32px;
          background: rgba(11,59,155,0.06);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s;
          text-decoration: none;
        }
        .social-btn:hover {
          color: #EC170F;
          border-color: rgba(236,23,15,0.5);
          background: rgba(236,23,15,0.1);
        }
      `}</style>
    </div>
  );
}
