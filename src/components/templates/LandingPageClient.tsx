'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Trophy, Code2, Users, Star, GitBranch, ChevronRight, X, Send, Filter, CheckCircle2, MessageSquare } from 'lucide-react';
import ProjectCard from '@/components/molecules/ProjectCard';
import MemberCard from '@/components/molecules/MemberCard';
import EventCard from '@/components/molecules/EventCard';
import AeroShards from '@/components/atoms/AeroShards';
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

  // Interactive enhancements states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', type: 'Collaboration' });

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

  // Parallax offsets based on mouse position relative to screen center
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
      {/* 3D WebGL AeroShards Background Layer (React Bits Style) */}
      <AeroShards
        backgroundColor="transparent"
        shardColor="#EC170F"
        accentColor="#0B3B9B"
        placement="full"
        material="pearl"
        detail="balanced"
        effect="none"
        flow="stream"
        rippleIntensity={1}
        holdToGather
        scale={1}
        spread={1}
        depth={1}
        speed={1}
        spin={1}
        interaction="repel"
        density={windowDimensions.w < 768 ? 0.7 : 1.5}
        shardSize={1.1}
        stretch={1}
        turbulence={1}
        glow={1}
        edgeSoftness={2}
        bloom={0.5}
        grain={0.05}
        chromaticAberration={0.0075}
        transitionDuration={1}
        interactionRadius={2.5}
        interactionStrength={0.6}
        paused={false}
      />

      {/* Interactive Mouse Spotlight Aura (React Bits Style) */}
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

      {/* Circuit Grid Overlay */}
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Ambient Radial Orbs */}
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

      {/* === TOP-LEFT CORNER TECH SHARDS GRAPHIC (With Mouse Parallax) === */}
      <svg className="poster-shards-top-left float-slow" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `translate3d(${offsetX * 0.3}px, ${offsetY * 0.3}px, 0)` }}
      >
        <polygon points="0,0 240,0 120,120 0,60" fill="#0B3B9B" opacity="0.85" />
        <polygon points="0,40 280,0 310,30 0,180" fill="#EC170F" opacity="0.9" />
        <polygon points="0,150 180,30 210,60 0,220" fill="#07060E" opacity="0.75" />
        <line x1="20" y1="200" x2="160" y2="60" stroke="#0B3B9B" strokeWidth="2" />
        <circle cx="160" cy="60" r="4" fill="#EC170F" />
        <line x1="60" y1="240" x2="240" y2="60" stroke="#EC170F" strokeWidth="1.5" strokeDasharray="4 4" />
        <g fill="#0C1E49" opacity="0.3">
          <circle cx="20" cy="260" r="2" /><circle cx="32" cy="260" r="2" /><circle cx="44" cy="260" r="2" />
          <circle cx="20" cy="272" r="2" /><circle cx="32" cy="272" r="2" /><circle cx="44" cy="272" r="2" />
          <circle cx="20" cy="284" r="2" /><circle cx="32" cy="284" r="2" /><circle cx="44" cy="284" r="2" />
        </g>
      </svg>

      {/* === BOTTOM-RIGHT CORNER TECH SHARDS GRAPHIC (With Mouse Parallax) === */}
      <svg className="poster-shards-bottom-right float-slow" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `translate3d(${-offsetX * 0.3}px, ${-offsetY * 0.3}px, 0)` }}
      >
        <polygon points="340,340 100,340 220,220 340,280" fill="#EC170F" opacity="0.85" />
        <polygon points="340,300 60,340 30,310 340,160" fill="#0B3B9B" opacity="0.9" />
        <polygon points="340,190 160,310 130,280 340,120" fill="#07060E" opacity="0.75" />
        <line x1="320" y1="140" x2="180" y2="280" stroke="#EC170F" strokeWidth="2" />
        <circle cx="180" cy="280" r="4" fill="#0B3B9B" />
        <g fill="#0B3B9B" opacity="0.35">
          <circle cx="300" cy="80" r="2" /><circle cx="312" cy="80" r="2" /><circle cx="324" cy="80" r="2" />
          <circle cx="300" cy="92" r="2" /><circle cx="312" cy="92" r="2" /><circle cx="324" cy="92" r="2" />
          <circle cx="300" cy="104" r="2" /><circle cx="312" cy="104" r="2" /><circle cx="324" cy="104" r="2" />
        </g>
      </svg>

      {/* === HERO SECTION === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6.5rem 1.5rem 4rem', textAlign: 'center' }}>
        {/* PARALLAX FLOATING 3D POLYGON CRYSTALS (React Bits Style) */}
        <div className="crystal-float hidden-mobile" style={{
          position: 'absolute', top: '12%', left: '7%', pointerEvents: 'none', zIndex: 1,
          transform: `translate3d(${offsetX * 0.8}px, ${offsetY * 0.8}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}>
          <svg width="65" height="75" viewBox="0 0 60 70" fill="none">
            <polygon points="30,0 60,25 30,70 0,25" fill="#EC170F" opacity="0.9" />
            <polygon points="30,0 60,25 30,35" fill="#FF4D4D" />
            <polygon points="0,25 30,35 30,70" fill="#B30E07" />
          </svg>
        </div>

        <div className="crystal-float-reverse hidden-mobile" style={{
          position: 'absolute', top: '18%', right: '8%', pointerEvents: 'none', zIndex: 1,
          transform: `translate3d(${-offsetX * 0.9}px, ${-offsetY * 0.9}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}>
          <svg width="75" height="90" viewBox="0 0 70 85" fill="none">
            <polygon points="35,0 70,30 35,85 0,30" fill="#0B3B9B" opacity="0.9" />
            <polygon points="35,0 70,30 35,42" fill="#2563EB" />
            <polygon points="0,30 35,42 35,85" fill="#072366" />
          </svg>
        </div>

        <div className="crystal-float-spin hidden-mobile" style={{
          position: 'absolute', bottom: '15%', left: '12%', pointerEvents: 'none', zIndex: 1,
          transform: `translate3d(${offsetX * 0.6}px, ${offsetY * 0.6}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}>
          <svg width="50" height="60" viewBox="0 0 45 55" fill="none">
            <polygon points="22,0 45,20 22,55 0,20" fill="#07060E" opacity="0.8" />
            <polygon points="22,0 45,20 22,28" fill="#1E293B" />
          </svg>
        </div>

        <div className="crystal-float hidden-mobile" style={{
          position: 'absolute', bottom: '25%', right: '14%', pointerEvents: 'none', zIndex: 1,
          transform: `translate3d(${-offsetX * 0.7}px, ${-offsetY * 0.7}px, 0)`,
          transition: 'transform 0.15s ease-out'
        }}>
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
            <polygon points="20,0 40,18 20,50 0,18" fill="#EC170F" opacity="0.75" />
            <polygon points="20,0 40,18 20,25" fill="#FF6B6B" />
          </svg>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Floating Tech HUD Frame Badge */}
          <div className="hud-frame float-fast" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            marginBottom: '2rem',
            animation: 'fadeIn 0.5s ease-out',
            boxShadow: '0 8px 25px rgba(11, 59, 155, 0.12)',
            transform: `translate3d(${offsetX * 0.2}px, ${offsetY * 0.2}px, 0)`,
            transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)'
          }}>
            <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.1em' }}>
              OFFICIAL TEAM PORTFOLIO & COLLECTIVE
            </span>
          </div>

          {/* Parallax Floating Headline */}
          <h1 className="float-hero-title" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            transform: `translate3d(${offsetX * 0.4}px, ${offsetY * 0.4}px, 0)`,
            transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)'
          }}>
            We Build.{' '}
            <span className="gradient-text">We Compete.</span>
            <br />
            We Deliver.
          </h1>

          <p style={{
            fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.8,
            maxWidth: '620px', margin: '0 auto 1rem',
            fontWeight: 500,
          }}>
            Welcome to our team portfolio. We are a full-stack engineering collective dedicated to solving real-world challenges, building software, and competing in hackathons.
          </p>

          <p style={{
            fontSize: '0.875rem', color: '#EC170F', fontStyle: 'italic',
            fontWeight: 600, opacity: 0.9, marginBottom: '2.5rem',
          }}>
            "triggers change without sounding violent"
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#featured-projects" id="hero-cta-projects" className="cta-primary float-fast">
              Explore Portfolio <ArrowRight size={16} />
            </Link>
            <Link href="/team" id="hero-cta-team" className="cta-secondary float-fast">
              <Users size={16} /> Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* === STATS WITH INTERACTIVE 3D TILT CARDS === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 5rem' }}>
        <div className="crystal-float-reverse hidden-mobile" style={{
          position: 'absolute', top: '10%', right: '5%', pointerEvents: 'none', zIndex: 0,
          transform: `translate3d(${-offsetX * 0.6}px, ${-offsetY * 0.6}px, 0)`
        }}>
          <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
            <polygon points="25,0 50,22 25,60 0,22" fill="#0B3B9B" opacity="0.6" />
          </svg>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {statList.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass glow-border float-card-3d" style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${stat.color}14`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.4rem' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === TECH STACK CONTINUOUS TICKER MARQUEE === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              OUR CORE STACK & TECHNOLOGIES
            </span>
          </div>
          <TechStackTicker />
        </div>
      </section>

      {/* === FEATURED PROJECTS WITH 3D TILT CARDS & CATEGORY FILTERS === */}
      <section id="featured-projects" style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 5rem' }}>
        <div className="crystal-float hidden-mobile" style={{
          position: 'absolute', top: '5%', left: '3%', pointerEvents: 'none', zIndex: 0,
          transform: `translate3d(${offsetX * 0.7}px, ${offsetY * 0.7}px, 0)`
        }}>
          <svg width="55" height="65" viewBox="0 0 55 65" fill="none">
            <polygon points="27,0 55,24 27,65 0,24" fill="#EC170F" opacity="0.75" />
          </svg>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC170F', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <Code2 size={16} /> PORTFOLIO HIGHLIGHTS
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)' }}>
                Featured Projects
              </h2>
            </div>
            <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0B3B9B', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              View All Projects <ChevronRight size={16} />
            </Link>
          </div>

          {/* Interactive Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginRight: '8px' }}>
              <Filter size={14} /> Filter:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: selectedCategory === cat ? '1px solid #EC170F' : '1px solid var(--border-default)',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, rgba(236, 23, 15, 0.15), rgba(11, 59, 155, 0.15))' : 'var(--bg-card)',
                  color: selectedCategory === cat ? '#EC170F' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedCategory === cat ? '0 4px 15px rgba(236, 23, 15, 0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredProjects.map((project) => (
                <div key={project._id} className="float-card-3d">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass glow-border float-slow" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
              <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No projects found in this category.</p>
              <button onClick={() => setSelectedCategory('All')} style={{ background: 'none', border: 'none', color: '#EC170F', fontWeight: 700, marginTop: '0.5rem', cursor: 'pointer' }}>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* === MEET THE TEAM WITH 3D TILT CARDS === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 5rem' }}>
        <div className="crystal-float-reverse hidden-mobile" style={{
          position: 'absolute', top: '15%', right: '4%', pointerEvents: 'none', zIndex: 0,
          transform: `translate3d(${-offsetX * 0.8}px, ${-offsetY * 0.8}px, 0)`
        }}>
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
            <polygon points="30,0 60,25 30,70 0,25" fill="#0B3B9B" opacity="0.8" />
          </svg>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0B3B9B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <Users size={16} /> OUR TALENT
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)' }}>
                Meet the Team
              </h2>
            </div>
            <Link href="/team" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#EC170F', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              View All Members <ChevronRight size={16} />
            </Link>
          </div>

          {teamMembers.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {teamMembers.map((member) => (
                <div key={member._id} className="float-card-3d">
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass glow-border float-slow" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Team members loading...</p>
            </div>
          )}
        </div>
      </section>

      {/* === RECENT EVENTS / HACKATHONS WITH 3D TILT CARDS === */}
      {recentEvents.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC170F', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <Trophy size={16} /> COMPETITIONS & HACKATHONS
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)' }}>
                  Recent Hackathons
                </h2>
              </div>
              <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0B3B9B', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                View All Events <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {recentEvents.map((event) => (
                <div key={event._id} className="float-card-3d">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === WHAT WE DO DOMAINS WITH 3D TILT CARDS === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 6rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Engineering Domains
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
              Our core capabilities across web applications, backend engineering, system architecture, and hackathons.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: Code2, color: '#EC170F', title: 'Full-Stack Applications', desc: 'End-to-end web applications built with Next.js, Node.js, Python, and modern cloud architecture.' },
              { icon: Trophy, color: '#0B3B9B', title: 'Hackathon Champions', desc: 'We compete in regional and global hackathons, delivering complete solutions under tight deadlines.' },
              { icon: GitBranch, color: '#2563EB', title: 'Open Source & Tooling', desc: 'Active contributors to open source projects and internal toolkits for rapid development.' },
              { icon: Zap, color: '#EC170F', title: 'Rapid Prototyping', desc: 'Moving from raw ideas to interactive, working prototypes in 48 hours.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass glow-border float-card-3d" style={{
                  borderRadius: 'var(--radius-lg)', padding: '1.75rem',
                  cursor: 'default',
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${item.color}14`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={22} color={item.color} />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === CTA BANNER WITH 3D FLOATING HUD === */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem 6rem' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
          <div className="glass-strong hud-frame float-slow" style={{ borderRadius: 'var(--radius-xl)', padding: '3.5rem 2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Want to Collaborate or Join Us?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 2rem', fontWeight: 500 }}>
              Explore our team members and featured projects, or get in touch for collaborations.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cta-primary float-fast"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                <MessageSquare size={16} /> Contact / Collaborate
              </button>
              <Link href="/team" className="cta-secondary float-fast">
                Meet the Team <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === INTERACTIVE QUICK COLLABORATION MODAL === */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(7, 6, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            className="glass-strong hud-frame"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem 2rem',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setIsModalOpen(false);
                  }}
                  className="cta-primary"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC170F', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <MessageSquare size={14} /> TEAM INQUIRY & COLLABORATION
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                  Let's Build Something
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Inquiry Type
                    </label>
                    <select
                      value={contactForm.type}
                      onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value="Collaboration">Project Collaboration</option>
                      <option value="Hackathon">Hackathon Teaming</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your project or idea..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="cta-primary"
                    style={{ border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    <Send size={16} /> Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

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
