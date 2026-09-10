'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Trash2, CheckCircle2, MessageSquare, DollarSign, Clock, Search, ExternalLink, AlertCircle, Sparkles } from 'lucide-react';

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  service: string;
  budget?: string;
  message?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminContactInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [replyModalItem, setReplyModalItem] = useState<InquiryItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyNotice, setReplyNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function fetchInquiries() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact/inquiries');
      if (!res.ok) throw new Error('Failed to load inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err: any) {
      setError(err.message || 'Error loading inquiries.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInquiries();
  }, []);

  function handleOpenReplyModal(item: InquiryItem) {
    setReplyModalItem(item);
    setReplyText(`Hello ${item.name},\n\nThank you for reaching out to Tech Team Studio regarding your inquiry for ${item.service}.\n\nOur engineering team has reviewed your specifications...`);
    setReplyNotice(null);
  }

  async function handleSendBrevoReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyModalItem || !replyText.trim()) return;

    setSendingReply(true);
    setReplyNotice(null);

    try {
      const res = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: replyModalItem._id,
          toEmail: replyModalItem.email,
          clientName: replyModalItem.name,
          service: replyModalItem.service,
          replyMessage: replyText,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReplyNotice({ type: 'success', message: 'Email reply sent successfully via Brevo API!' });
        setInquiries((prev) =>
          prev.map((item) => (item._id === replyModalItem._id ? { ...item, status: 'replied' } : item))
        );
        setTimeout(() => {
          setReplyModalItem(null);
          setReplyNotice(null);
        }, 1500);
      } else {
        setReplyNotice({ type: 'error', message: data.message || 'Failed to send email via Brevo.' });
      }
    } catch (err: any) {
      setReplyNotice({ type: 'error', message: 'Network error sending email via Brevo.' });
    } finally {
      setSendingReply(false);
    }
  }

  async function updateStatus(id: string, newStatus: 'new' | 'read' | 'replied') {
    try {
      const res = await fetch(`/api/contact/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm('Are you sure you want to delete this contact inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  }

  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const countNew = inquiries.filter((i) => i.status === 'new').length;
  const countRead = inquiries.filter((i) => i.status === 'read').length;
  const countReplied = inquiries.filter((i) => i.status === 'replied').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)', fontWeight: 700 }}>
              ADMIN NOTIFICATIONS
            </span>
            {countNew > 0 && (
              <span
                style={{
                  background: '#EC170F',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {countNew} UNREAD
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Contact Us Inquiries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage client inquiries and dispatch professional responses directly via Brevo Email API.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Inquiries</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{inquiries.length}</div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid Boolean(countNew) ? "#EC170F" : "var(--border-subtle)"' }}>
          <span style={{ fontSize: '0.75rem', color: '#EC170F', fontWeight: 700, textTransform: 'uppercase' }}>New / Unread</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EC170F', marginTop: '0.25rem' }}>{countNew}</div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Read</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{countRead}</div>
        </div>

        <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Replied</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>{countReplied}</div>
        </div>
      </div>

      {/* Controls Bar: Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {(['all', 'new', 'read', 'replied'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeFilter === filter ? 'var(--accent-primary)' : 'transparent',
                color: activeFilter === filter ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.2s',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Inquiries List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <p>Loading contact notifications...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--border-subtle)', borderRadius: '12px', background: 'var(--bg-surface)' }}>
          <Mail size={36} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Inquiries Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {searchTerm || activeFilter !== 'all' ? 'Try adjusting your search or filter.' : 'When clients submit contact forms, notifications will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredInquiries.map((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item._id}
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'var(--bg-surface)',
                  border: `1px solid ${item.status === 'new' ? '#EC170F' : 'var(--border-subtle)'}`,
                  boxShadow: item.status === 'new' ? '0 0 15px rgba(236,23,15,0.08)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {/* Top Row: Client Info & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {item.name}
                      </h3>
                      {item.status === 'new' && (
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#EC170F', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                          NEW
                        </span>
                      )}
                      {item.status === 'replied' && (
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                          REPLIED
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      {item.email}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      <Clock size={12} /> {formattedDate}
                    </div>
                  </div>
                </div>

                {/* Service Metadata Tag */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    SERVICE: {item.service}
                  </span>
                </div>

                {/* Message Body */}
                {item.message && (
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {item.message}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {item.status !== 'replied' ? (
                      <button
                        onClick={() => updateStatus(item._id, 'replied')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(16,185,129,0.12)',
                          border: '1px solid rgba(16,185,129,0.3)',
                          color: '#10b981',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle2 size={13} /> Mark Replied
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(item._id, 'read')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Mark Unreplied
                      </button>
                    )}

                    {item.status === 'new' ? (
                      <button
                        onClick={() => updateStatus(item._id, 'read')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(item._id, 'new')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Mark as New
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenReplyModal(item)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #EC170F, #0B3B9B)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 0 12px rgba(236,23,15,0.3)',
                      }}
                    >
                      <Mail size={13} /> Reply via Brevo
                    </button>

                    <button
                      onClick={() => deleteInquiry(item._id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#fca5a5',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Delete Inquiry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BREVO EMAIL REPLY MODAL OVERLAY */}
      {replyModalItem && (
        <div
          onClick={() => setReplyModalItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(7, 6, 14, 0.88)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '640px',
              padding: '2rem',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid #EC170F',
              boxShadow: '0 25px 70px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: '#EC170F', fontWeight: 800 }}>
                  BREVO EMAIL DISPATCH
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Reply to {replyModalItem.name}
                </h2>
              </div>
              <button
                onClick={() => setReplyModalItem(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {replyNotice && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  background: replyNotice.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${replyNotice.type === 'success' ? '#10b981' : '#ef4444'}`,
                  color: replyNotice.type === 'success' ? '#10b981' : '#fca5a5',
                }}
              >
                {replyNotice.message}
              </div>
            )}

            <form onSubmit={handleSendBrevoReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    RECIPIENT EMAIL
                  </label>
                  <input
                    type="email"
                    disabled
                    value={replyModalItem.email}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      borderRadius: '6px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    SERVICE CONTEXT
                  </label>
                  <input
                    type="text"
                    disabled
                    value={replyModalItem.service}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EC170F', display: 'block', marginBottom: '6px' }}>
                  REPLY MESSAGE (HTML TEMPLATE WILL WRAP THIS)
                </label>
                <textarea
                  rows={6}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    borderRadius: '6px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setReplyModalItem(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sendingReply}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: sendingReply ? 'rgba(236,23,15,0.5)' : 'linear-gradient(135deg, #EC170F, #0B3B9B)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: sendingReply ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {sendingReply ? <RefreshCw size={14} className="animate-spin" /> : <Mail size={14} />}
                  <span>{sendingReply ? 'Sending via Brevo...' : 'Send Email via Brevo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
