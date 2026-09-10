'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/atoms/icons';

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '5rem 2rem 3rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        
        {/* Massive Editorial Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="editorial-metadata" style={{ color: '#EC170F', marginBottom: '1rem' }}>
            07 — CONTACT & COLLABORATION
          </div>
          <h2
            className="editorial-display-heading"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
              maxWidth: '1100px',
              marginBottom: '2rem',
            }}
          >
            LET&apos;S BUILD <br />
            <span style={{ color: '#EC170F' }}>SOMETHING.</span>
          </h2>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/contact"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-quote-modal'));
                }
              }}
              className="editorial-btn-primary"
            >
              <span>GET IN TOUCH / START A PROJECT</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Editorial Divider */}
        <div className="editorial-hr" style={{ margin: '2.5rem 0' }} />

        {/* Footer Navigation & Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.08em' }}>
              TECH<span style={{ color: '#EC170F' }}>.</span>TEAM
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, marginTop: '1rem', maxWidth: '300px' }}>
              CREATIVE-TECH & ENGINEERING STUDIO. BUILDING HIGH-PERFORMANCE WEB APPS, AI SYSTEMS & DIGITAL EXPERIENCES.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="editorial-metadata" style={{ color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              NAVIGATION
            </h4>
            {[
              { label: '01 WORK', href: '/projects' },
              { label: '02 TEAM', href: '/team' },
              { label: '03 EXPERTISE', href: '/#expertise' },
              { label: '04 EVENTS', href: '/events' },
              { label: '05 ABOUT', href: '/#about' },
              { label: '06 CONTACT', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  display: 'block',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginBottom: '0.75rem',
                  transition: 'color 0.2s',
                }}
                className="footer-editorial-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="editorial-metadata" style={{ color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              CONNECT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                className="footer-editorial-link"
              >
                <GithubIcon size={14} /> GITHUB <ArrowUpRight size={12} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                className="footer-editorial-link"
              >
                <LinkedinIcon size={14} /> LINKEDIN <ArrowUpRight size={12} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
                className="footer-editorial-link"
              >
                <InstagramIcon size={14} /> INSTAGRAM <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span className="editorial-metadata">
            © {new Date().getFullYear()} TECH TEAM STUDIO. ALL RIGHTS RESERVED.
          </span>
          <span className="editorial-metadata" style={{ color: '#EC170F' }}>
            ENGINEERING • DESIGN • TECHNOLOGY • CULTURE
          </span>
        </div>
      </div>

      <style>{`
        .footer-editorial-link:hover {
          color: #EC170F !important;
        }
      `}</style>
    </footer>
  );
}
