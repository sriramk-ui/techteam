'use client';

import Link from 'next/link';
import { Zap, Mail, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/atoms/icons';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #EC170F, #0B3B9B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={16} color="white" fill="white" />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                Innovation <span style={{ color: '#EC170F' }}>Collaboration</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '260px', marginBottom: '0.5rem' }}>
              A team that ships. We build, compete, and push boundaries across every challenge we take on.
            </p>
            <p style={{ color: '#EC170F', fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.85 }}>
              "triggers change without sounding violent"
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Explore
            </h3>
            {[
              { label: 'Projects', href: '/projects' },
              { label: 'Team Members', href: '/team' },
              { label: 'Events', href: '/events' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>


        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Innovation Collaboration. Built by <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>tech team</span>
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { Icon: GithubIcon, href: '#' },
              { Icon: LinkedinIcon, href: '#' },
              { Icon: Mail, href: '#' }
            ].map((item, i) => {
              const Icon = item.Icon;
              return (
                <a key={i} href={item.href} className="social-icon-btn">
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          display: block; color: var(--text-muted); text-decoration: none; 
          font-size: 0.875rem; margin-bottom: 0.6rem; transition: color 0.2s;
        }
        .footer-link:hover { color: var(--text-primary); }
        
        .footer-link-sub {
          display: flex; align-items: center; gap: 6px; color: var(--text-muted); 
          text-decoration: none; font-size: 0.875rem; margin-bottom: 0.6rem; transition: color 0.2s;
        }
        .footer-link-sub:hover { color: var(--text-primary); }

        .social-icon-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: rgba(11,59,155,0.05);
          border: 1px solid var(--border-subtle);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted); text-decoration: none;
          transition: all 0.2s;
        }
        .social-icon-btn:hover {
          color: #EC170F;
          border-color: rgba(236,23,15,0.5);
        }
      `}</style>
    </footer>
  );
}
