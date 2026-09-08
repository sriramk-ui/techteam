'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { num: '01', label: 'WORK', href: '/projects', sectionId: 'work' },
  { num: '02', label: 'TEAM', href: '/team', sectionId: 'team' },
  { num: '03', label: 'EXPERTISE', href: '/#expertise', sectionId: 'expertise' },
  { num: '04', label: 'EVENTS', href: '/events', sectionId: 'events' },
  { num: '05', label: 'ABOUT', href: '/#about', sectionId: 'about' },
  { num: '06', label: 'CONTACT', href: '/#contact', sectionId: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId?: string) => {
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMobileOpen(false);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? theme === 'dark' ? 'rgba(7, 6, 14, 0.94)' : 'rgba(248, 250, 252, 0.94)'
          : theme === 'dark' ? 'rgba(7, 6, 14, 0.85)' : 'rgba(248, 250, 252, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Editorial Brand / Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#EC170F',
              boxShadow: '0 0 10px #EC170F',
            }}
          />
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            TECH<span style={{ color: '#EC170F' }}>.</span>TEAM
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              paddingLeft: '6px',
              borderLeft: '1px solid var(--border-subtle)',
            }}
            className="hidden-mobile"
          >
            STUDIO
          </span>
        </Link>

        {/* Minimal Editorial Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.href.startsWith('/#'));
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}
                className="nav-editorial-link"
              >
                <span style={{ color: '#EC170F', fontSize: '0.7rem' }}>{link.num}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Quick CTA */}
          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, '/#contact')}
            className="editorial-btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.75rem',
            }}
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight size={14} />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={15} color="#EC170F" /> : <Moon size={15} color="#0B3B9B" />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'none',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: 'var(--bg-base)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.5rem 2rem 2rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ color: '#EC170F' }}>{link.num}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-editorial-link:hover {
          color: #EC170F !important;
        }
        @media (min-width: 900px) {
          .hidden-mobile { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 899px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
