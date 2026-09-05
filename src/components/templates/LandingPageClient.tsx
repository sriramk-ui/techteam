'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Zap, Trophy, Code2, Users, Star, GitBranch, ChevronRight, X, Send,
  Filter, CheckCircle2, MessageSquare, Sparkles, Layers, Globe, Smartphone, Cpu, Boxes
} from 'lucide-react';
import ProjectCard from '@/components/molecules/ProjectCard';
import MemberCard from '@/components/molecules/MemberCard';
import EventCard from '@/components/molecules/EventCard';
import QuoteModal from '@/components/molecules/QuoteModal';
import ProjectShowcaseModal from '@/components/molecules/ProjectShowcaseModal';
import TechStackTicker from '@/components/atoms/TechStackTicker';

interface PortfolioProps {
  stats: {
    projectsCount: number;
    eventsCount: number;
    membersCount: number;
  };
  featuredProjects: Array<any>;
  teamMembers: Array<any>;
  recentEvents: Array<any>;
}

export default function LandingPageClient({
  stats,
  featuredProjects = [],
  teamMembers = [],
  recentEvents = [],
}: PortfolioProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowDimensions, setWindowDimensions] = useState({ w: 1200, h: 800 });

  // Client Quote Modal state
  const [isQuoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [quoteService, setQuoteService] = useState<string>('Custom Web Apps & SaaS');

  // Showcase Modal state
  const [showcaseProject, setShowcaseProject] = useState<any | null>(null);

  // Interactive filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Full-Stack', 'AI / ML', 'Hackathon', 'Tools & Utils'];

  const filteredProjects = featuredProjects.filter((p) => {
    if (selectedCategory === 'All') return true;
    if (!p.tags || p.tags.length === 0) return true;
    const tagsLower = p.tags.map((t: string) => t.toLowerCase());
    if (selectedCategory === 'Full-Stack') return tagsLower.some((t: string) => t.includes('web') || t.includes('next') || t.includes('react') || t.includes('fullstack') || t.includes('app'));
    if (selectedCategory === 'AI / ML') return tagsLower.some((t: string) => t.includes('ai') || t.includes('ml') || t.includes('model') || t.includes('python') || t.includes('agent'));
    if (selectedCategory === 'Hackathon') return tagsLower.some((t: string) => t.includes('hackathon') || t.includes('challenge') || t.includes('event'));
    if (selectedCategory === 'Tools & Utils') return tagsLower.some((t: string) => t.includes('tool') || t.includes('util') || t.includes('cli') || t.includes('lib'));
    return true;
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleResize = () => {
      setWindowDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    
    setWindowDimensions({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const offsetX = (mousePos.x - windowDimensions.w / 2) * 0.04;
  const offsetY = (mousePos.y - windowDimensions.h / 2) * 0.04;

  const statList = [
    { label: 'Projects Shipped', value: `${stats?.projectsCount || 0}+`, icon: Code2, color: '#EC170F' },
    { label: 'Hackathons & Events', value: `${stats?.eventsCount || 0}+`, icon: Trophy, color: '#0B3B9B' },
    { label: 'Team Members', value: (stats?.membersCount || 0).toString(), icon: Users, color: '#2563EB' },
    { label: 'Awards Won', value: '5', icon: Star, color: '#EC170F' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-base)', overflow: 'hidden' }}>

      {/* Interactive Mouse Spotlight Aura */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236, 23, 15, 0.07), rgba(11, 59, 155, 0.06) 45%, transparent 80%)`,
          transition: 'background 0.15s ease-out',
        }}
      />

      {/* Grid Overlay */}
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Orbs */}
      <div className="orb" style={{
        width: '650px', height: '650px', background: '#EC170F', top: '-120px', left: '-120px', zIndex: 0,
        transform: `translate3d(${offsetX * 0.5}px, ${offsetY * 0.5}px, 0)`,
        transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)'
      }} />
      <div className="orb" style={{
        width: '550px', height: '550px', background: '#0B3B9B', bottom: '5%', right: '-100px', zIndex: 0,
        transform: `translate3d(${-offsetX * 0.5}px, ${-offsetY * 0.5}px, 0)`,
        transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)'
      }} />

      {/* HERO SECTION */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6.5rem 1.5rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 18px', borderRadius: '30px',
            background: 'rgba(236, 23, 15, 0.08)', border: '1px solid rgba(236, 23, 15, 0.3)',
            color: '#EC170F', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(236, 23, 15, 0.15)',
          }}>
            <Zap size={14} fill="#EC170F" />
            <span>Full-Stack Engineering & Web Studio</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}>
            We Build Fast, High-Converting <br />
            <span className="gradient-text">Web Apps & Digital Experiences.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            From enterprise Next.js applications and SaaS platforms to 3D WebGL sites and client portfolios — we build production-ready digital products that scale.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setQuoteService('Custom Web Apps & SaaS'); setQuoteModalOpen(true); }}
              className="cta-primary"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              <Sparkles size={18} /> Request a Quote
            </button>
            <a href="#services" className="cta-secondary">
              Explore Services <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ position: 'relative', zIndex: 1, padding: '1rem 1.5rem 3rem' }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem',
        }}>
          {statList.map(({ label, value, icon: Icon, color }, i) => (
            <div key={i} className="glow-border glass-card" style={{ padding: '1.25rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '10px', background: `${color}15`, color, marginBottom: '8px' }}>
                <Icon size={20} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH TICKER */}
      <TechStackTicker />

      {/* SERVICES & CAPABILITIES SECTION (#services) */}
      <section id="services" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(236,23,15,0.08)', border: '1px solid rgba(236,23,15,0.25)', color: '#EC170F', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Sparkles size={14} /> Client Services & Engineering
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            What We <span className="gradient-text">Build For You</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            We transform complex ideas into production-grade web platforms, high-converting portfolios, and custom interactive digital experiences.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: Globe,
              title: 'Custom Web Apps & SaaS',
              desc: 'Scalable Next.js & React platforms with authentication, real-time database, role permissions, and custom admin panels.',
              color: '#EC170F',
              service: 'Custom Web Apps & SaaS',
            },
            {
              icon: Layers,
              title: 'Interactive Portfolios',
              desc: 'High-impact personal & agency portfolios featuring liquid micro-interactions, smooth scroll, and dark mode design systems.',
              color: '#0B3B9B',
              service: 'Interactive Portfolios & Showcases',
            },
            {
              icon: Smartphone,
              title: 'E-Commerce & High-Converting Stores',
              desc: 'Mobile-first stores and high-converting landing pages built for speed, SEO ranking, and frictionless checkout flows.',
              color: '#10b981',
              service: 'E-Commerce & High-Converting Stores',
            },
            {
              icon: Cpu,
              title: '3D WebGL & Scroll-Animations',
              desc: 'Custom Three.js 3D shaders, WebGL interactive models, particle systems, and immersive scroll-driven web animations.',
              color: '#8b5cf6',
              service: '3D WebGL & Scroll-Animation Websites',
            },
          ].map((srv, idx) => (
            <div
              key={idx}
              className="glow-border glass-strong"
              style={{
                padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-default)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'all 0.3s ease',
              }}
            >
              <div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${srv.color}15`, border: `1px solid ${srv.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: srv.color, marginBottom: '1.25rem',
                }}>
                  <srv.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                  {srv.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {srv.desc}
                </p>
              </div>
              <button
                onClick={() => { setQuoteService(srv.service); setQuoteModalOpen(true); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', color: srv.color,
                  fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', padding: 0,
                }}
              >
                Request Quote <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE (#projects) */}
      <section id="projects" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#EC170F', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Our Portfolio
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Things We&apos;ve <span className="gradient-text">Built</span>
            </h2>
          </div>
          <Link href="/projects" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EC170F', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
            View All Projects ({stats?.projectsCount || 0}) <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600,
                background: selectedCategory === cat ? 'rgba(236, 23, 15, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedCategory === cat ? '#EC170F' : 'var(--border-subtle)'}`,
                color: selectedCategory === cat ? '#EC170F' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onCardClick={(p) => setShowcaseProject(p)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <Code2 size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No projects in this filter category yet.</p>
          </div>
        )}
      </section>

      {/* TEAM MEMBERS SECTION (#team) */}
      {teamMembers.length > 0 && (
        <section id="team" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#0B3B9B', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Engineering Team
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                Meet the <span className="gradient-text">Developers</span>
              </h2>
            </div>
            <Link href="/team" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0B3B9B', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
              View All Team Members <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {teamMembers.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}

      {/* RECENT EVENTS & HACKATHONS (#events) */}
      {recentEvents.length > 0 && (
        <section id="events" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Track Record
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                Events & <span className="gradient-text">Hackathons</span>
              </h2>
            </div>
            <Link href="/events" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
              All Achievements <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* SERVICE PACKAGES & PRICING TIERS (#pricing) */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(11,59,155,0.08)', border: '1px solid rgba(11,59,155,0.25)', color: '#2563EB', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Boxes size={14} /> Transparent Service Packages
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Transparent <span className="gradient-text">Pricing & Packages</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Choose a package tailored to your vision — from swift portfolio launches to enterprise SaaS engineering.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            {
              name: 'Starter Portfolio',
              price: '$500 – $1,500',
              badge: 'Fast Delivery',
              popular: false,
              desc: 'Ideal for developers, creators, and freelancers who need a sleek digital presence.',
              features: [
                'Responsive Single-Page / Multi-Tab Site',
                'Smooth Scroll & Framer Motion Animations',
                'SEO Optimized & Lightning Fast Load',
                'Contact & Lead Capture Form',
                'GitHub / Vercel One-Click Deployment',
              ],
            },
            {
              name: 'Full-Stack Web App',
              price: '$1,500 – $3,500',
              badge: 'Most Popular',
              popular: true,
              desc: 'Complete production-ready web application built with Next.js, MongoDB & Auth.',
              features: [
                'Next.js 16 + React 19 + TypeScript',
                'MongoDB Database & JWT Authentication',
                'Admin Dashboard & Management Portal',
                'Custom REST API & Role-Based Access',
                'Secure File / Image Upload Integration',
              ],
            },
            {
              name: 'Enterprise & 3D Custom',
              price: '$3,500+',
              badge: 'High Scale',
              popular: false,
              desc: 'For brands needing custom 3D WebGL experiences, encryption vaults, and dedicated team SLA.',
              features: [
                'Interactive Three.js 3D WebGL Canvas',
                'Encrypted Credentials Vault Integration',
                'Custom Microservices & Database Arch',
                'Priority 24/7 Support & Maintenance SLA',
                'Custom Domain & Brand Design System',
              ],
            },
          ].map((pkg, idx) => (
            <div
              key={idx}
              className="glass-strong"
              style={{
                padding: '2.5rem 2rem', borderRadius: '24px',
                border: pkg.popular ? '2px solid #EC170F' : '1px solid var(--border-default)',
                boxShadow: pkg.popular ? '0 15px 40px rgba(236,23,15,0.2)' : 'none',
                position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
              {pkg.badge && (
                <span style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800,
                  background: pkg.popular ? 'linear-gradient(135deg, #EC170F, #0B3B9B)' : 'rgba(255,255,255,0.06)',
                  border: pkg.popular ? 'none' : '1px solid var(--border-subtle)',
                  color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {pkg.badge}
                </span>
              )}
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {pkg.name}
                </h3>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: pkg.popular ? '#EC170F' : 'var(--text-primary)', marginBottom: '1rem' }}>
                  {pkg.price}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                  {pkg.desc}
                </p>
                <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '1.75rem' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color={pkg.popular ? '#EC170F' : '#10b981'} style={{ flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => { setQuoteService(pkg.name); setQuoteModalOpen(true); }}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  border: pkg.popular ? 'none' : '1px solid var(--border-default)',
                  background: pkg.popular ? 'linear-gradient(135deg, #EC170F, #0B3B9B)' : 'rgba(255,255,255,0.06)',
                  color: 'white', fontWeight: 800, cursor: 'pointer',
                  boxShadow: pkg.popular ? '0 8px 25px rgba(236,23,15,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                Request Quote
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENT INQUIRY CTA & CONTACT SECTION (#contact) */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem 7rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="glass-strong" style={{
          borderRadius: '32px', padding: '3.5rem 2rem', textAlign: 'center',
          border: '1px solid rgba(236,23,15,0.3)',
          background: 'linear-gradient(135deg, rgba(236,23,15,0.06) 0%, rgba(11,59,155,0.06) 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(236,23,15,0.12)', color: '#EC170F', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Zap size={14} /> Ready To Build?
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Have a Project in Mind? <span className="gradient-text">Let&apos;s Build It.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
            From concept design to full-stack deployment — get a custom quote and timeline for your web app, portfolio, or e-commerce store.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setQuoteService('Custom Web Apps & SaaS'); setQuoteModalOpen(true); }}
              className="cta-primary"
              style={{ border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '14px 32px' }}
            >
              <Sparkles size={18} /> Request a Project Quote
            </button>
            <Link href="/team" className="cta-secondary">
              <Users size={18} /> Meet the Engineering Team
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialService={quoteService}
      />

      {/* Project Showcase Modal */}
      <ProjectShowcaseModal
        project={showcaseProject}
        onClose={() => setShowcaseProject(null)}
      />

      <style>{`
        .cta-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #EC170F, #0B3B9B);
          color: white; font-weight: 700; text-decoration: none;
          font-size: 0.95rem; box-shadow: 0 10px 30px rgba(236, 23, 15, 0.28);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(236, 23, 15, 0.45);
        }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 12px;
          background: var(--bg-card); color: var(--text-primary);
          font-weight: 700; text-decoration: none; font-size: 0.95rem;
          border: 1px solid var(--border-default);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }
        .cta-secondary:hover {
          border-color: #EC170F;
          color: #EC170F;
        }
      `}</style>
    </div>
  );
}
