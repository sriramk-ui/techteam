import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, ArrowLeft, ExternalLink, Code2, Globe, Server, CheckCircle, ChevronRight } from 'lucide-react';
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
    if (!user) return { title: 'Member Not Found | Innovation Collaboration' };
    return {
      title: `${user.name} - Developer Portfolio | Innovation Collaboration`,
      description: `Explore ${user.name}'s developer profile, skills, and projects at Innovation Collaboration.`,
    };
  } catch {
    return { title: 'Member Profile | Innovation Collaboration' };
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

  const techStack = ['HTML5', 'CSS', 'JavaScript', 'TypeScript', 'Node.js', 'React', 'Next.js', 'Git', 'GitHub', 'MongoDB'];

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#F8FAFC', position: 'relative', overflowX: 'hidden' }}>
      
      {/* === TOP NAVIGATION HEADER === */}
      <header style={{
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/team" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#94A3B8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
            transition: 'color 0.2s',
          }}>
            <ArrowLeft size={16} /> Back to Team
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            {member.name}
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="hidden-mobile">
          <a href="#hero" style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Home</a>
          <a href="#about" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>About</a>
          <a href="#projects" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Projects</a>
          <a href="#contacts" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Contacts</a>
        </nav>
      </header>

      {/* === HERO SECTION (IMAGE MATCH: Coral Ring & Angle Brackets) === */}
      <section id="hero" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem 4rem', position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}>
          {/* Left Text Block */}
          <div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem', color: '#FFFFFF' }}>
              Hello <span style={{ color: '#EC170F', display: 'inline-block' }}>.</span>
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1rem 0 1.25rem' }}>
              <div style={{ width: '40px', height: '2px', background: '#EC170F' }} />
              <span style={{ fontSize: '1.5rem', color: '#E2E8F0', fontWeight: 500 }}>
                I&apos;m {member.name}
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
              {member.role === 'ADMIN' ? 'Lead Software Architect' : 'Software Developer'}
            </h2>

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={primaryContact} target="_blank" rel="noopener noreferrer" style={{
                padding: '12px 28px', borderRadius: '8px',
                background: '#EC170F', color: '#FFFFFF',
                fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
                boxShadow: '0 8px 25px rgba(236, 23, 15, 0.4)',
                transition: 'all 0.2s ease',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                Got a project?
              </a>
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" style={{
                  padding: '12px 24px', borderRadius: '8px',
                  background: 'transparent', color: '#FFFFFF',
                  fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}>
                  <GithubIcon size={16} /> GitHub Profile
                </a>
              )}
            </div>
          </div>

          {/* Right Avatar Frame (Exact Image Theme: Halo Circle & Angle Brackets) */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            {/* SVG Angle Bracket Left `<` */}
            <div style={{
              position: 'absolute', top: '15%', left: '0%',
              fontSize: '4rem', fontWeight: 300, color: 'rgba(236, 23, 15, 0.35)',
              fontFamily: 'monospace', pointerEvents: 'none',
              transform: 'scaleY(1.4)',
            }}>
              &lt;
            </div>

            {/* SVG Angle Bracket Right `>` */}
            <div style={{
              position: 'absolute', bottom: '15%', right: '0%',
              fontSize: '4rem', fontWeight: 300, color: 'rgba(236, 23, 15, 0.35)',
              fontFamily: 'monospace', pointerEvents: 'none',
              transform: 'scaleY(1.4)',
            }}>
              &gt;
            </div>

            {/* Coral Halo Ring */}
            <div style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              padding: '12px',
              background: 'radial-gradient(circle, rgba(236, 23, 15, 0.2) 0%, rgba(236, 23, 15, 0.05) 70%, transparent 100%)',
              border: '3px solid #EC170F',
              boxShadow: '0 0 60px rgba(236, 23, 15, 0.35), inset 0 0 30px rgba(236, 23, 15, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {member.profilePic ? (
                <img
                  src={member.profilePic}
                  alt={member.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${hue},70%,50%), hsl(${(hue + 60) % 360},70%,50%))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4.5rem',
                  fontWeight: 800,
                  color: 'white',
                }}>
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* === TECH STACK STRIP === */}
      <section style={{
        background: '#0B132B',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem 2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem' }}>
          {techStack.map((tech) => (
            <span key={tech} style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* === ABOUT ME SECTION (IMAGE MATCH: Timeline Dots + Bio + Stats) === */}
      <section id="about" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          
          {/* Left Vertical Services with Timeline Red Dots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { icon: Globe, title: 'Website Development', desc: 'Crafting responsive, high-performance web applications.' },
              { icon: Code2, title: 'App & API Architecture', desc: 'Scalable backend services, RESTful APIs & database optimization.' },
              { icon: Server, title: 'Cloud Hosting & DevOps', desc: 'Continuous integration, deployment pipelines, and cloud setup.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', position: 'relative' }}>
                  {/* Vertical line indicator with Red Dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EC170F', boxShadow: '0 0 10px #EC170F' }} />
                    {i < 2 && <div style={{ width: '2px', height: '50px', background: 'rgba(236, 23, 15, 0.3)', marginTop: '4px' }} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.3rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Bio & Stats */}
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.5rem' }}>
              About me
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              I started my engineering journey building software and solving complex challenges under pressure. As a core member of Innovation Collaboration, I love turning creative concepts into robust, production-ready code.
            </p>

            {/* Quick Stats Grid */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {projects.length > 0 ? projects.length : '10'}<span style={{ color: '#EC170F' }}>+</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Completed Projects
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  98<span style={{ color: '#EC170F' }}>%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Client Satisfaction
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Active<span style={{ color: '#EC170F' }}>+</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Team Role ({member.role})
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* === MEMBER PROJECTS SECTION === */}
      <section id="projects" style={{ background: '#0B132B', padding: '6rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Projects
            </h2>
            <div style={{ width: '40px', height: '3px', background: '#EC170F', margin: '0 auto' }} />
          </div>

          {projects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {projects.map((project: any) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem 0' }}>
              <Code2 size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p>No public projects assigned to {member.name} yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* === CONTACT / FOOTER STRIP === */}
      <footer id="contacts" style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#090F1E', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
            Connect with {member.name}
          </h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '1.5rem 0' }}>
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                <GithubIcon size={18} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                <LinkedinIcon size={18} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F472B6',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                <InstagramIcon size={18} />
              </a>
            )}
            {socialLinks.gmail && (
              <a href={`mailto:${socialLinks.gmail}`} style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ADE80',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                <Mail size={18} />
              </a>
            )}
          </div>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Innovation Collaboration • {member.name}&apos;s Portfolio
          </p>
        </div>
      </footer>
    </div>
  );
}
