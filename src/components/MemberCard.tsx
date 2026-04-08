'use client';

import { Mail, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/icons';

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
  ADMIN: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', color: '#a78bfa', label: 'Admin' },
  MEMBER: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', color: '#67e8f9', label: 'Member' },
};

const socialIcons = [
  { key: 'github', Icon: GithubIcon, color: '#e2e8f0' },
  { key: 'linkedin', Icon: LinkedinIcon, color: '#60a5fa' },
  { key: 'instagram', Icon: InstagramIcon, color: '#f472b6' },
  { key: 'gmail', Icon: Mail, color: '#4ade80' },
];

export default function MemberCard({ member }: MemberCardProps) {
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const roleStyle = roleColors[member.role];
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
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Avatar */}
      {member.profilePic ? (
        <img
          src={member.profilePic}
          alt={member.name}
          style={{
            width: '72px', height: '72px', borderRadius: '50%',
            objectFit: 'cover', marginBottom: '1rem', flexShrink: 0,
            boxShadow: `0 0 30px hsla(${hue},70%,60%,0.3)`,
            border: `2px solid hsla(${hue},70%,60%,0.5)`
          }}
        />
      ) : (
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: `linear-gradient(135deg, hsl(${hue},70%,60%), hsl(${(hue + 60) % 360},70%,60%))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', fontWeight: 700, color: 'white',
          marginBottom: '1rem',
          boxShadow: `0 0 30px hsla(${hue},70%,60%,0.3)`,
          flexShrink: 0,
        }}>
          {initials}
        </div>
      )}

      {/* Name */}
      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {member.name}
      </h3>

      {/* Role Badge */}
      <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        background: roleStyle.bg,
        border: `1px solid ${roleStyle.border}`,
        color: roleStyle.color,
        marginBottom: '1.25rem',
      }}>
        {roleStyle.label}
      </span>

      {/* Social Links */}
      {member.socialLinks && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
                style={{
                   // base style with color set for hover
                   // using --hover-color variable for pseudo-class access
                   // but standard CSS in <style> is cleaner
                } as any}
              >
                <style>{`
                  .social-btn:hover {
                    color: ${color} !important;
                    border-color: ${color}66 !important;
                    background: ${color}15 !important;
                  }
                `}</style>
                <Icon size={14} />
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        .member-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .member-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(139,92,246,0.15);
        }
        .social-btn {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
