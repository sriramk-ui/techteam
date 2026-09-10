'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, Loader2, Mail, MapPin, Clock } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/atoms/icons';

const serviceOptions = [
  'Custom Web Apps & SaaS',
  'Interactive Portfolios & Showcases',
  'E-Commerce & High-Converting Stores',
  '3D WebGL & Scroll-Animation Websites',
  'Full Stack Consultation & Code Audit',
];

export default function ContactPageClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(serviceOptions[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in your name and email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit inquiry.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    borderRadius: '2px',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '85vh', position: 'relative', background: 'var(--bg-base)', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '5rem 2rem 2rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span className="editorial-section-number">06 — CONTACT</span>
            <span style={{ height: '1px', width: '50px', background: '#EC170F' }} />
            <span className="editorial-metadata">[STUDIO INQUIRIES]</span>
          </div>

          <h1
            className="editorial-display-heading"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', marginBottom: '1.5rem' }}
          >
            LET&apos;S BUILD <span style={{ color: '#EC170F' }}>SOMETHING.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Have a project in mind, need full-stack engineering, or want to collaborate with Tech Team Studio? Send us your specifications below.
          </p>
        </div>

        <div className="editorial-hr" style={{ margin: '2rem 0 4rem' }} />

        {/* Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Direct Info */}
          <div>
            <div className="editorial-metadata" style={{ color: '#EC170F', marginBottom: '1.5rem' }}>
              DIRECT CHANNELS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EC170F',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div className="editorial-metadata" style={{ marginBottom: '4px' }}>EMAIL</div>
                  <a
                    href="mailto:techteam@studio.dev"
                    style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    techteam@studio.dev
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EC170F',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="editorial-metadata" style={{ marginBottom: '4px' }}>STUDIO HQ</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    Tech Engineering Collective, Building A4
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EC170F',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <div className="editorial-metadata" style={{ marginBottom: '4px' }}>RESPONSE TIME</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    Within 24 Hours Guaranteed
                  </div>
                </div>
              </div>
            </div>

            <div className="editorial-metadata" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              CONNECT WITH US
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 16px',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <GithubIcon size={16} /> GITHUB
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 16px',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LinkedinIcon size={16} /> LINKEDIN
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div
            style={{
              padding: '2.5rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(236,23,15,0.12)', border: '1px solid #EC170F',
                  color: '#EC170F', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                }}>
                  <CheckCircle size={32} />
                </div>
                <h3 className="editorial-display-heading" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  INQUIRY RECEIVED
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Thank you, <strong>{name}</strong>. Our engineering team has received your project specifications and will contact you at <strong>{email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="editorial-btn-secondary"
                >
                  <span>SUBMIT ANOTHER INQUIRY</span>
                </button>
              </div>
            ) : (
              <div>
                <h3 className="editorial-display-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  PROJECT INQUIRY FORM
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Fill out your project details for custom quotes and architecture advice:
                </p>

                {error && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(236,23,15,0.1)', border: '1px solid #EC170F',
                    color: '#EC170F', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace',
                    marginBottom: '1.5rem',
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="editorial-metadata" style={{ display: 'block', marginBottom: '6px', color: '#EC170F' }}>
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ALEX MORGAN"
                      style={inputStyle}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="editorial-metadata" style={{ display: 'block', marginBottom: '6px', color: '#EC170F' }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ALEX@COMPANY.COM"
                      style={inputStyle}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="editorial-metadata" style={{ display: 'block', marginBottom: '6px' }}>
                      SERVICE PACKAGE
                    </label>
                    <select
                      style={inputStyle}
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="editorial-metadata" style={{ display: 'block', marginBottom: '6px' }}>
                      PROJECT SPECIFICATIONS
                    </label>
                    <textarea
                      rows={4}
                      placeholder="DESCRIBE YOUR VISION, REQUIREMENTS, OR TIMELINE..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="editorial-btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '14px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    <span>{loading ? 'SENDING INQUIRY...' : 'SUBMIT INQUIRY'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
