'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Trophy, Code2, Users, Star, GitBranch } from 'lucide-react';

const stats = [
  { label: 'Projects Shipped', value: '20+', icon: Code2, color: '#8b5cf6' },
  { label: 'Hackathons', value: '12+', icon: Trophy, color: '#f59e0b' },
  { label: 'Team Members', value: '8', icon: Users, color: '#06b6d4' },
  { label: 'Awards Won', value: '5', icon: Star, color: '#10b981' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background */}
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div className="orb" style={{ width: '600px', height: '600px', background: '#8b5cf6', top: '-100px', left: '-100px', zIndex: 0 }} />
      <div className="orb" style={{ width: '500px', height: '500px', background: '#06b6d4', bottom: '10%', right: '-80px', zIndex: 0 }} />

      {/* === HERO === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '7rem 1.5rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '20px',
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 600,
            marginBottom: '2rem',
            animation: 'fadeIn 0.5s ease-out',
          }}>
            <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            Open for collaborations
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            animation: 'fadeInUp 0.6s ease-out',
          }}>
            We Build.{' '}
            <span className="gradient-text">We Compete.</span>
            <br />
            We Deliver.
          </h1>

          <p style={{
            fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.8,
            maxWidth: '600px', margin: '0 auto 2.5rem',
            animation: 'fadeInUp 0.7s ease-out',
          }}>
            A full-stack development team that turns ideas into impactful software. Explore our work, meet the team, and see what we&apos;ve been competing in.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease-out' }}>
            <Link href="/projects" id="hero-cta-projects" className="cta-primary">
              View Projects <ArrowRight size={16} />
            </Link>
            <Link href="/team" id="hero-cta-team" className="cta-secondary">
              <Users size={16} /> Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* === STATS === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass glow-border" style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
                animation: `fadeInUp ${0.4 + i * 0.1}s ease-out`,
              }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${stat.color}1a`, border: `1px solid ${stat.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === FEATURED SECTION === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 6rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              What We Do
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              From weekend hackathons to fully shipped SaaS products — here&apos;s our domain.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Code2, color: '#8b5cf6', title: 'Full-Stack Applications', desc: 'End-to-end web applications using Next.js, Node.js, Python and modern cloud infrastructure.' },
              { icon: Trophy, color: '#f59e0b', title: 'Hackathon Champions', desc: 'We compete in national and international hackathons — and we win. Problems solved under pressure.' },
              { icon: GitBranch, color: '#06b6d4', title: 'Open Source', desc: 'We contribute to and build open-source projects. Collaboration is in our DNA.' },
              { icon: Zap, color: '#10b981', title: 'Rapid Prototyping', desc: 'Idea to working demo in 48 hours. We move fast without breaking things.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass glow-border feature-card" style={{
                  borderRadius: 'var(--radius-lg)', padding: '1.75rem',
                  cursor: 'default',
                  animation: `fadeInUp ${0.3 + i * 0.1}s ease-out`,
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${item.color}18`, border: `1px solid ${item.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={22} color={item.color} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 6rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div className="glass-strong glow-border" style={{ borderRadius: 'var(--radius-xl)', padding: '3rem 2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Interested in working together?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
              Whether it&apos;s a project, competition, or collab — reach out to our team.
            </p>
            <Link href="/team" className="cta-primary">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white; font-weight: 700; text-decoration: none;
          font-size: 0.95rem; box-shadow: 0 0 40px rgba(139,92,246,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(139,92,246,0.5);
        }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 12px;
          background: var(--bg-elevated); color: var(--text-primary);
          font-weight: 600; text-decoration: none; font-size: 0.95rem;
          border: 1px solid var(--border-default);
          transition: all 0.2s;
        }
        .cta-secondary:hover {
          border-color: var(--border-focus);
          background: var(--bg-card);
        }
        .feature-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(139,92,246,0.15);
        }
      `}</style>
    </div>
  );
}
