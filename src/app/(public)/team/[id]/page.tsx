import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, ArrowLeft, ExternalLink, Code2, Globe, Server, CheckCircle, ChevronRight, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/atoms/icons';
import ProjectCard from '@/components/molecules/ProjectCard';
import { User } from '@/models/User';
import { Project } from '@/models/Project';
import connectToDatabase from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    await connectToDatabase();
    const user = await User.findById(id).select('name role').lean();
    if (!user) return { title: 'Member Not Found | Tech Team Studio' };
    return {
      title: `${user.name} — Developer Profile | Tech Team Studio`,
      description: `Explore ${user.name}'s engineering profile, tech stack, and shipped projects at Tech Team Studio.`,
    };
  } catch {
    return { title: 'Developer Profile | Tech Team Studio' };
  }
}

async function getMemberData(id: string) {
  try {
    await connectToDatabase();
    const user = await User.findById(id).select('-password').lean();
    if (!user) return null;

    const assignedProjects = await Project.find({
      assignedMembers: id,
      visibility: 'public',
    }).populate('assignedMembers', 'name').lean();

    return {
      member: JSON.parse(JSON.stringify(user)),
      projects: JSON.parse(JSON.stringify(assignedProjects)),
    };
  } catch (error) {
    console.error('Error fetching member profile:', error);
    return null;
  }
}

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getMemberData(id);

  if (!data || !data.member) {
    notFound();
  }

  const { member, projects } = data;
  const initials = member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const hue = member.name.charCodeAt(0) * 137 % 360;

  const socialLinks = member.socialLinks || {};
  const primaryContact = socialLinks.gmail ? `mailto:${socialLinks.gmail}` : (socialLinks.github || '#');

  const techStack = ['Next.js 16', 'React 19', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'Three.js', 'Tailwind CSS', 'Docker', 'Git'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', position: 'relative' }}>
      
      {/* Top Header Navigation */}
      <header
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            href="/team"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
            className="editorial-link-hover"
          >
            <ArrowLeft size={16} /> BACK TO TEAM
          </Link>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <span className="editorial-metadata" style={{ color: '#EC170F' }}>
            ENGINEER SPEC // {member.name.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '6rem 2rem 4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left Text */}
          <div>
            <div className="editorial-metadata" style={{ color: '#EC170F', marginBottom: '1rem' }}>
              02 — DEVELOPER PROFILE
            </div>

            <h1
              className="editorial-display-heading"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                marginBottom: '1rem',
                color: 'var(--text-primary)',
              }}
            >
              {member.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
              <span className="editorial-metadata" style={{ color: 'var(--text-muted)' }}>
                ROLE: {member.role === 'ADMIN' ? 'LEAD SOFTWARE ARCHITECT' : 'FULL STACK ENGINEER'}
              </span>
              <span style={{ color: '#EC170F' }}>•</span>
              <span className="editorial-metadata" style={{ color: '#EC170F' }}>
                STATUS: ACTIVE
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '600px' }}>
              Passionate about full-stack engineering, clean architectural patterns, high-performance web systems, and collaborative innovation.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={primaryContact} target="_blank" rel="noopener noreferrer" className="editorial-btn-primary">
                <span>GET IN TOUCH</span>
                <ArrowUpRight size={16} />
              </a>
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="editorial-btn-secondary">
                  <GithubIcon size={16} />
                  <span>GITHUB</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Avatar Frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {member.profilePic ? (
              <img
                src={member.profilePic}
                alt={member.name}
                style={{
                  width: '280px',
                  height: '320px',
                  objectFit: 'cover',
                  border: '3px solid #EC170F',
                  filter: 'brightness(0.95) contrast(1.1)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '280px',
                  height: '320px',
                  background: `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${(hue + 60) % 360},70%,30%))`,
                  border: '3px solid #EC170F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 900,
                  color: 'white',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tech Marquee Strip */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '1.5rem 2rem', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <span className="editorial-metadata" style={{ color: '#EC170F' }}>TECHNICAL STACK</span>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {techStack.map((tech) => (
              <span key={tech} className="editorial-metadata" style={{ color: 'var(--text-primary)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Member Projects */}
      <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">PROJECTS</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
            <span className="editorial-metadata">[{projects.length} ASSIGNED]</span>
          </div>

          <h2 className="editorial-display-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            CONTRIBUTED <span style={{ color: '#EC170F' }}>WORK.</span>
          </h2>
        </div>

        {projects.length > 0 ? (
          <div>
            {projects.map((project: any, idx: number) => (
              <ProjectCard key={project._id} project={project} index={idx} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>NO PUBLIC PROJECTS ASSIGNED YET.</p>
          </div>
        )}
      </section>

      {/* Contact Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 className="editorial-display-heading" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
            CONNECT WITH {member.name.toUpperCase()}
          </h3>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>
                <GithubIcon size={20} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>
                <LinkedinIcon size={20} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>
                <InstagramIcon size={20} />
              </a>
            )}
            {socialLinks.gmail && (
              <a href={`mailto:${socialLinks.gmail}`} style={{ color: 'var(--text-primary)' }}>
                <Mail size={20} />
              </a>
            )}
          </div>

          <span className="editorial-metadata">
            © {new Date().getFullYear()} TECH TEAM STUDIO • {member.name.toUpperCase()}
          </span>
        </div>
      </footer>
    </div>
  );
}
