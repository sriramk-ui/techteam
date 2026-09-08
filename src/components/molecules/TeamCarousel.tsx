'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight, Mail, Code2, Users, Rocket } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/atoms/icons';

interface TeamCarouselProps {
  members: Array<{
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
  }>;
  autoPlayInterval?: number;
}

const socialIcons = [
  { key: 'github', Icon: GithubIcon, label: 'GitHub' },
  { key: 'linkedin', Icon: LinkedinIcon, label: 'LinkedIn' },
  { key: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
  { key: 'gmail', Icon: Mail, label: 'Gmail' },
];

export default function TeamCarousel({ members, autoPlayInterval = 4500 }: TeamCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalMembers = members.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalMembers);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalMembers) % totalMembers);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (totalMembers <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, totalMembers, autoPlayInterval]);

  if (!members || members.length === 0) return null;

  const currentMember = members[currentIndex];
  const initials = currentMember.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const hue = currentMember.name.charCodeAt(0) * 137 % 360;

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '2rem 0',
      }}
    >
      {/* Editorial Controls Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <span className="editorial-metadata" style={{ color: '#EC170F' }}>
          CORE MEMBER [{String(currentIndex + 1).padStart(2, '0')} / {String(totalMembers).padStart(2, '0')}]
        </span>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={prevSlide}
            aria-label="Previous Team Member"
            style={{
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="editorial-nav-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Team Member"
            style={{
              width: '40px',
              height: '40px',
              background: '#EC170F',
              border: '1px solid #EC170F',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="editorial-nav-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Banner Card */}
      <div
        key={currentMember._id}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid #EC170F',
          padding: '3rem 2.5rem',
          position: 'relative',
        }}
        className="animate-fade-in"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Photo Block */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {currentMember.profilePic ? (
              <img
                src={currentMember.profilePic}
                alt={currentMember.name}
                style={{
                  width: '240px',
                  height: '280px',
                  objectFit: 'cover',
                  border: '3px solid #EC170F',
                  filter: 'brightness(0.95) contrast(1.1)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '240px',
                  height: '280px',
                  background: `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${(hue + 60) % 360},70%,30%))`,
                  border: '3px solid #EC170F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Details Block */}
          <div>
            <div className="editorial-metadata" style={{ color: '#EC170F', marginBottom: '0.5rem' }}>
              {currentMember.role === 'ADMIN' ? 'LEAD SOFTWARE ARCHITECT' : 'FULL STACK DEVELOPER'}
            </div>

            <h3
              className="editorial-display-heading"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                marginBottom: '1rem',
                color: 'var(--text-primary)',
              }}
            >
              {currentMember.name}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Building high-throughput web architecture, robust backend APIs, and intuitive digital interfaces. Core contributor to Tech Team initiatives.
            </p>

            {/* Feature Tags */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                FULL-STACK
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                SYSTEMS
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              >
                AI INTEGRATION
              </span>
            </div>

            {/* Social & CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href={`/team/${currentMember._id}`} className="editorial-btn-primary" style={{ padding: '10px 22px', fontSize: '0.8rem' }}>
                <span>VIEW PROFILE</span>
                <ArrowUpRight size={14} />
              </Link>

              <div style={{ display: 'flex', gap: '12px' }}>
                {currentMember.socialLinks &&
                  socialIcons.map(({ key, Icon, label }) => {
                    const url = currentMember.socialLinks?.[key as keyof typeof currentMember.socialLinks];
                    if (!url) return null;
                    const href = key === 'gmail' ? `mailto:${url}` : url;
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label}
                        style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                        className="editorial-social-icon"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Bar */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '1.5rem' }}>
        {members.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === currentIndex ? '32px' : '8px',
              height: '4px',
              background: idx === currentIndex ? '#EC170F' : 'var(--border-subtle)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
