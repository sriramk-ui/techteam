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

const budgetRanges = [
  '$500 - $1,500',
  '$1,500 - $3,500',
  '$3,500 - $7,500',
  '$7,500+',
];

export default function QuoteModal({ isOpen, onClose, initialService }: QuoteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(initialService || serviceOptions[0]);
  const [budget, setBudget] = useState(budgetRanges[1]);
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
        body: JSON.stringify({ name, email, service, budget, message }),
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
    borderRadius: '10px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
    }}>
      <div className="glass-strong" style={{
        borderRadius: '24px', padding: '2rem',
        width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid var(--border-default)',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'rgba(255,255,255,0.05)', border: 'none',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Quote Request Received!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Thank you, <strong>{name}</strong>. Our team has received your project details for <strong>{service}</strong> and will get back to you at <strong>{email}</strong> within 24 hours.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '12px 28px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: 'white', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <Sparkles size={20} color="#EC170F" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EC170F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Client Project Inquiry
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Request a Project Quote
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Let&apos;s build something extraordinary together. Fill out your requirements below:
            </p>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  style={inputStyle}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  style={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  <Briefcase size={12} /> Service Package
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  <DollarSign size={12} /> Estimated Budget
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {budgetRanges.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      style={{
                        padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                        border: `1px solid ${budget === b ? '#EC170F' : 'var(--border-subtle)'}`,
                        background: budget === b ? 'rgba(236,23,15,0.12)' : 'rgba(255,255,255,0.03)',
                        color: budget === b ? '#EC170F' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Project Overview & Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your vision, goals, key features, or reference websites..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.5rem',
                  padding: '14px 24px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #EC170F, #0B3B9B)',
                  color: 'white', fontSize: '0.95rem', fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 8px 24px rgba(236,23,15,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
