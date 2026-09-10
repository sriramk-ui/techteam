'use client';

import { useState } from 'react';
import { X, Send, CheckCircle, Sparkles, Loader2, DollarSign, Briefcase } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const serviceOptions = [
  'Custom Web Apps & SaaS',
  'Interactive Portfolios & Showcases',
  'E-Commerce & High-Converting Stores',
  '3D WebGL & Scroll-Animation Websites',
  'Full Stack Consultation & Code Audit',
];

export default function QuoteModal({ isOpen, onClose, initialService }: QuoteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(initialService || serviceOptions[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        setError(data.message || 'Failed to submit quote request.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    borderRadius: '2px',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', background: 'rgba(7, 6, 14, 0.88)', backdropFilter: 'blur(16px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: '2px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid #EC170F',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
        className="animate-fade-in-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'transparent', border: '1px solid var(--border-subtle)',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#EC170F'; e.currentTarget.style.borderColor = '#EC170F'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(236,23,15,0.12)', border: '1px solid #EC170F',
              color: '#EC170F', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 className="editorial-display-heading" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              INQUIRY RECEIVED
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Thank you, <strong>{name}</strong>. Our team has received your inquiry for <strong>{service}</strong> and will get back to you at <strong>{email}</strong> within 24 hours.
            </p>
            <button onClick={onClose} className="editorial-btn-primary">
              DONE
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span className="editorial-section-number">07 — INQUIRY</span>
            </div>

            <h2 className="editorial-display-heading" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              INITIATE PROJECT.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Fill out your project specifications below for a prompt response and timeline estimate:
            </p>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(236,23,15,0.1)', border: '1px solid #EC170F',
                color: '#EC170F', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace',
                marginBottom: '1.25rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  style={{ ...inputStyle, background: 'var(--bg-elevated)' }}
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
                  rows={3}
                  placeholder="DESCRIBE YOUR VISION, REQUIRMENTS, OR REFERENCES..."
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
                  marginTop: '0.5rem',
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>{loading ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
