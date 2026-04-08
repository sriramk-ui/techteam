'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  FolderGit2, Calendar, Users, TrendingUp, CheckCircle,
  Clock, Loader2, ArrowRight, Shield, Plus,
} from 'lucide-react';

interface DashStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMembers: number;
  totalEvents: number;
  publicProjects: number;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<{ _id: string; title: string; status: string; progress: number }[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<{ _id: string; name: string; date: string; type: string }[]>([]);

  useEffect(() => {
    if (!token) return;
    async function fetchStats() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [projRes, usersRes, eventsRes] = await Promise.all([
          fetch('/api/projects', { headers }),
          fetch('/api/users', { headers }),
          fetch('/api/events', { headers }),
        ]);

        if (projRes.status === 503 || usersRes.status === 503 || eventsRes.status === 503) {
           throw new Error('Using Mock Data');
        }

        const [projData, usersData, eventsData] = await Promise.all([
          projRes.json(), usersRes.json(), eventsRes.json(),
        ]);
        const projects = projData.projects || [];
        const events = eventsData.events || [];
        
        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter((p: any) => p.status === 'Active').length,
          completedProjects: projects.filter((p: any) => p.status === 'Completed').length,
          totalMembers: (usersData.users || []).length,
          totalEvents: events.length,
          publicProjects: projects.filter((p: any) => p.visibility === 'public').length,
        });
        setRecentProjects(projects.slice(0, 5));
        const futureEvents = events
          .filter((e: any) => new Date(e.date) >= new Date())
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setUpcomingEvents(futureEvents);
      } catch {
        // MOCK DATA FALLBACK for Offline Mode
        setStats({
          totalProjects: 12, activeProjects: 4, completedProjects: 8,
          totalMembers: 5, totalEvents: 3, publicProjects: 6,
        });
        setRecentProjects([
          { _id: '1', title: 'AgroMind Detection', status: 'Active', progress: 65 },
          { _id: '2', title: 'Loopy Admin Portal', status: 'Completed', progress: 100 },
          { _id: '3', title: 'Antigravity Core', status: 'Planning', progress: 20 },
        ]);
        setUpcomingEvents([
          { _id: 'e1', name: 'Hack the North', date: new Date().toISOString(), type: 'Hackathon' },
          { _id: 'e2', name: 'Open Source Summit', date: new Date(Date.now() + 86400000 * 2).toISOString(), type: 'Conference' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  const statCards = stats ? [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderGit2, color: '#8b5cf6', link: '/dashboard/projects' },
    { label: 'Active Now', value: stats.activeProjects, icon: Loader2, color: '#10b981', link: '/dashboard/projects' },
    { label: 'Completed', value: stats.completedProjects, icon: CheckCircle, color: '#06b6d4', link: '/dashboard/projects' },
    { label: 'Team Size', value: stats.totalMembers, icon: Users, color: '#f59e0b', link: '/dashboard/members' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: '#f472b6', link: '/dashboard/events' },
    { label: 'Public Projects', value: stats.publicProjects, icon: TrendingUp, color: '#a78bfa', link: '/projects' },
  ] : [];

  const statusColor = { Planning: '#f59e0b', Active: '#10b981', Completed: '#06b6d4', Other: '#a09db0' };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Welcome back, <span className="gradient-text-purple">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: '110px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} href={link} style={{ textDecoration: 'none' }}>
              <div className="glow-border" style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                padding: '1.5rem', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${color}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color, marginBottom: '0.25rem', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recent Projects */}
          <div className="glass glow-border" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Active Projects</h2>
              <Link href="/dashboard/projects" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                Manage Projects <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
            ) : recentProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {recentProjects.map((proj) => (
                  <div key={proj._id} style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '12px 0', borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{proj.title}</p>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{proj.progress}%</span>
                      </div>
                      <div style={{ height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${proj.progress}%`, background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: '4px' }} />
                      </div>
                    </div>
                    <span style={{
                      flexShrink: 0, padding: '3px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                      color: statusColor[proj.status as keyof typeof statusColor] || 'var(--text-muted)',
                      background: `${statusColor[proj.status as keyof typeof statusColor] || '#888'}18`,
                      border: `1px solid ${statusColor[proj.status as keyof typeof statusColor] || '#888'}30`,
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      {proj.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <FolderGit2 size={32} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.875rem' }}>No projects found.</p>
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="glass glow-border" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Upcoming Events</h2>
              <Link href="/dashboard/events" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                Event Calendar <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
            ) : upcomingEvents.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {upcomingEvents.map((ev) => (
                  <div key={ev._id} style={{
                    padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244,114,182,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Calendar size={18} color="#f472b6" />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {ev.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.875rem' }}>No upcoming events.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div className="glass glow-border" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'New Project', href: '/dashboard/projects', icon: Plus, color: '#8b5cf6' },
                { label: 'Add Event', href: '/dashboard/events', icon: Calendar, color: '#f59e0b' },
                { label: 'Open Vault', href: '/vault', icon: Shield, color: '#ef4444' },
                { label: 'Edit Profile', href: '/dashboard/profile', icon: Users, color: '#06b6d4' },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={label} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px',
                  textDecoration: 'none',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${color}12`; e.currentTarget.style.color = color; e.currentTarget.style.borderColor = `${color}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <Icon size={16} style={{ color }} /> {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tips / Info */}
          <div style={{ 
            padding: '1.5rem', borderRadius: 'var(--radius-lg)', 
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))',
            border: '1px solid rgba(139,92,246,0.2)'
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Team Pro Tip 🚀</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Use the **Project Vault** to securely share API keys and environment secrets with the assigned team members.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </div>
  );
}
