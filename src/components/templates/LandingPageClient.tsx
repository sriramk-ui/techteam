'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, ArrowRight, Zap, Code2, Users, Trophy, ChevronRight,
  Globe, Cpu, Layers, Smartphone, Sparkles, ChevronDown
} from 'lucide-react';
import LatestProjectsShowcase from '@/components/organisms/LatestProjectsShowcase';
import LiquidTextHero from '@/components/organisms/LiquidTextHero';
import TeamCarousel from '@/components/molecules/TeamCarousel';
import MemberCard from '@/components/molecules/MemberCard';
import EventCard from '@/components/molecules/EventCard';
import QuoteModal from '@/components/molecules/QuoteModal';
import ProjectShowcaseModal from '@/components/molecules/ProjectShowcaseModal';
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

  // Modal states
  const [isQuoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [quoteService, setQuoteService] = useState<string>('Custom Web Apps & SaaS');
  const [showcaseProject, setShowcaseProject] = useState<any | null>(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Full-Stack', 'AI / ML', 'Hackathon', 'Tools & Utils'];

  // Interactive expanded expertise state
  const [expandedCategory, setExpandedCategory] = useState<number>(0);

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

  const expertiseCategories = [
    {
      num: '01',
      title: 'WEB ENGINEERING',
      desc: 'High-performance Next.js 16 & React 19 web applications with SSR, edge caching, and atomic design systems.',
      tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
    },
    {
      num: '02',
      title: 'AI & MACHINE LEARNING',
      desc: 'Autonomous agent frameworks, LLM integrations, fine-tuned Python pipelines, and predictive analytics tools.',
      tech: ['Python', 'PyTorch', 'OpenAI', 'LangChain', 'Vector DBs'],
    },
    {
      num: '03',
      title: 'DATA & CLOUD SYSTEMS',
      desc: 'Scalable MongoDB document architectures, Mongoose ORM, microservices, and automated CI/CD pipelines.',
      tech: ['MongoDB', 'Docker', 'AWS', 'Redis', 'Node.js'],
    },
    {
      num: '04',
      title: 'UI / UX & CREATIVE DIRECTION',
      desc: 'Editorial visual systems, motion design, micro-interactions, dark mode palettes, and responsive grid layouts.',
      tech: ['Figma', 'Framer Motion', 'Editorial Grid', 'Design Tokens'],
    },
    {
      num: '05',
      title: 'APP DEVELOPMENT',
      desc: 'Cross-platform progressive web apps and mobile solutions built for speed, offline support, and security.',
      tech: ['PWA', 'React Native', 'REST API', 'JWT Security'],
    },
    {
      num: '06',
      title: '3D WEBGL & INTERACTIVE',
      desc: 'Custom Three.js shaders, 3D particle fields, interactive canvas visuals, and scroll-driven WebGL experiences.',
      tech: ['Three.js', 'WebGL', 'GLSL Shaders', 'Canvas API'],
    },
  ];

  const timelineMilestones = [
    { year: '2024', title: 'FOUNDATION & FIRST MILESTONE', desc: 'Tech Team established as an elite student-driven engineering studio. Shipped 5 core web platforms.' },
    { year: '2025', title: 'NATIONAL EXPANSION & HACKATHONS', desc: 'Won 5+ national hackathons and expanded engineering capabilities into AI agents & 3D WebGL.' },
    { year: '2026', title: 'NEXT-GEN DIGITAL PRODUCTS', desc: 'Scaling full-stack SaaS platforms, enterprise client projects, and high-impact digital experiences.' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      
      {/* 3D WebGL AeroShards Background Layer */}
      <AeroShards
        backgroundColor="transparent"
        shardColor="#EC170F"
        accentColor="#0B3B9B"
        placement="full"
        density={windowDimensions.w < 768 ? 0.6 : 1.2}
        shardSize={1.0}
        speed={0.8}
        spin={0.8}
        interaction="repel"
        interactionRadius={2.8}
        interactionStrength={0.6}
      />

      {/* Grid Overlay */}
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Mouse Aura */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236, 23, 15, 0.05), transparent 70%)`,
        }}
      />

      {/* HERO SECTION */}
      <LiquidTextHero />

      {/* Marquee Ticker Strip */}
      <TechStackTicker />

      {/* 01 — WORK / PROJECTS SECTION */}
      <section
        id="work"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '7rem 2rem',
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">01 — WORK</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
          </div>
          <h2
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            SELECTED <span style={{ color: '#EC170F' }}>PROJECTS.</span>
          </h2>
        </div>

        {/* Latest Projects Asymmetric Editorial Showcase Component */}
        <LatestProjectsShowcase
          projects={filteredProjects}
          totalCount={stats?.projectsCount || 0}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          onProjectClick={(p) => setShowcaseProject(p)}
        />
      </section>

      <div className="editorial-hr" />

      {/* 02 — TEAM / PEOPLE SECTION */}
      <section
        id="team"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '6rem 2rem',
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <span className="editorial-section-number">02 — PEOPLE</span>
              <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
            </div>
            <h2
              className="editorial-display-heading"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              MEET THE <span style={{ color: '#EC170F' }}>TEAM.</span>
            </h2>
          </div>

          <Link href="/team" className="editorial-btn-secondary">
            <span>VIEW ALL ({stats?.membersCount || teamMembers.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Team Carousel */}
        {teamMembers.length > 0 && <TeamCarousel members={teamMembers} />}
      </section>

      <div className="editorial-hr" />

      {/* 03 — EXPERTISE / TECHNOLOGY SECTION */}
      <section
        id="expertise"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '6rem 2rem',
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">03 — EXPERTISE</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
          </div>
          <h2
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', maxWidth: '1000px' }}
          >
            WE BUILD WITH <br />
            <span style={{ color: '#EC170F' }}>TECHNOLOGY.</span>
          </h2>
        </div>

        {/* Accordion / List of Editorial Tech Categories */}
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {expertiseCategories.map((cat, idx) => {
            const isExpanded = expandedCategory === idx;
            return (
              <div
                key={cat.num}
                onClick={() => setExpandedCategory(isExpanded ? -1 : idx)}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '2rem 1rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: isExpanded ? 'rgba(236, 23, 15, 0.04)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <span className="editorial-section-number" style={{ fontSize: '1.1rem' }}>
                      {cat.num}
                    </span>
                    <h3
                      className="editorial-display-heading"
                      style={{
                        fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                        color: isExpanded ? '#EC170F' : 'var(--text-primary)',
                        transition: 'color 0.2s',
                      }}
                    >
                      {cat.title}
                    </h3>
                  </div>

                  <span className="editorial-metadata" style={{ color: isExpanded ? '#EC170F' : 'var(--text-muted)' }}>
                    {isExpanded ? '[ COLLAPSE - ]' : '[ EXPAND + ]'}
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className="animate-fade-in-up"
                    style={{
                      marginTop: '1.5rem',
                      paddingLeft: '3.5rem',
                      maxWidth: '850px',
                    }}
                  >
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                      {cat.desc}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {cat.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '6px 14px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="editorial-hr" />

      {/* 04 — EVENTS & HACKATHONS SECTION */}
      {recentEvents.length > 0 && (
        <section
          id="events"
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '6rem 2rem',
            maxWidth: '1320px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '2rem',
              marginBottom: '4rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <span className="editorial-section-number">04 — EVENTS</span>
                <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
              </div>
              <h2
                className="editorial-display-heading"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                WHERE WE <span style={{ color: '#EC170F' }}>COMPETE.</span>
              </h2>
            </div>

            <Link href="/events" className="editorial-btn-secondary">
              <span>ALL ACHIEVEMENTS</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      <div className="editorial-hr" />

      {/* 05 — ABOUT & STATISTICS SECTION */}
      <section
        id="about"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '6rem 2rem',
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">05 — ABOUT</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
          </div>

          <h2
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', maxWidth: '1100px', marginBottom: '2.5rem' }}
          >
            WE DON&apos;T JUST USE TECHNOLOGY. <br />
            <span style={{ color: '#EC170F' }}>WE BUILD WITH IT.</span>
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              maxWidth: '820px',
            }}
          >
            Tech Team is an elite student engineering collective dedicated to designing and building production-grade digital products, full-stack applications, and competitive AI systems. We bridge the gap between creative visual design and complex software architecture.
          </p>
        </div>

        {/* Statistics Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '3rem',
          }}
        >
          <div>
            <div
              className="editorial-display-heading"
              style={{ fontSize: '4.5rem', color: '#EC170F', marginBottom: '0.2rem' }}
            >
              {stats?.projectsCount || 0}+
            </div>
            <div className="editorial-metadata">PROJECTS SHIPPED</div>
          </div>

          <div>
            <div
              className="editorial-display-heading"
              style={{ fontSize: '4.5rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}
            >
              {stats?.membersCount || 0}
            </div>
            <div className="editorial-metadata">CORE ENGINEERS</div>
          </div>

          <div>
            <div
              className="editorial-display-heading"
              style={{ fontSize: '4.5rem', color: '#0B3B9B', marginBottom: '0.2rem' }}
            >
              {stats?.eventsCount || 0}+
            </div>
            <div className="editorial-metadata">EVENTS & HACKATHONS</div>
          </div>

          <div>
            <div
              className="editorial-display-heading"
              style={{ fontSize: '4.5rem', color: '#EC170F', marginBottom: '0.2rem' }}
            >
              05+
            </div>
            <div className="editorial-metadata">NATIONAL AWARDS</div>
          </div>
        </div>
      </section>

      <div className="editorial-hr" />

      {/* 06 — ACHIEVEMENTS TIMELINE SECTION */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '6rem 2rem',
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">06 — TIMELINE</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
          </div>
          <h2
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            OUR <span style={{ color: '#EC170F' }}>MILESTONES.</span>
          </h2>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {timelineMilestones.map((m) => (
            <div
              key={m.year}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr',
                gap: '2rem',
                padding: '2.5rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                alignItems: 'flex-start',
              }}
            >
              <div className="editorial-display-heading" style={{ fontSize: '2.8rem', color: '#EC170F' }}>
                {m.year}
              </div>
              <div>
                <h3 className="editorial-display-heading" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  {m.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialService={quoteService}
      />

      <ProjectShowcaseModal
        project={showcaseProject}
        onClose={() => setShowcaseProject(null)}
      />
    </div>
  );
}
