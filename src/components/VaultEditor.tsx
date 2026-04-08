'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Shield, X, Eye, EyeOff, Trash2, Save, 
  Loader2, Plus, AlertTriangle, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VaultEditorProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', 
  fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.2s ease',
};

export default function VaultEditor({ projectId, projectTitle, onClose }: VaultEditorProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [credentials, setCredentials] = useState<{ process: string, email: string, password: string }[]>([]);
  
  const headers = { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}` 
  };

  useEffect(() => {
    async function fetchVault() {
      try {
        const res = await fetch(`/api/vault/${projectId}`, { headers });
        const data = await res.json();
        if (res.ok && data.decryptedData) {
          try {
            const parsed = JSON.parse(data.decryptedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCredentials(parsed);
            } else {
              setCredentials([{ process: '', email: '', password: '' }]);
            }
          } catch {
            setCredentials([{ process: '', email: '', password: '' }]);
          }
        } else {
          setCredentials([{ process: '', email: '', password: '' }]);
        }
      } catch (err) {
        setError('Failed to load secrets');
      } finally {
        setLoading(false);
      }
    }
    fetchVault();
  }, [projectId, token]);

  const handleSave = async () => {
    const validPairs = credentials.filter(c => c.process.trim() || c.email.trim() || c.password.trim());
    
    setSaving(true);
    setError('');
    
    try {
      const res = await fetch(`/api/vault/${projectId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: JSON.stringify(validPairs) }),
      });
      
      if (res.ok) {
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to save secrets');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addRow = () => setCredentials([...credentials, { process: '', email: '', password: '' }]);
  const removeRow = (index: number) => setCredentials(credentials.filter((_, i) => i !== index));
  const updateRow = (index: number, field: 'process' | 'email' | 'password', val: string) => {
    const newPairs = [...credentials];
    newPairs[index][field] = val;
    setCredentials(newPairs);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', inset: 0, zIndex: 1000, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '1.5rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-strong" 
        style={{ 
          width: '100%', maxWidth: '720px', borderRadius: '24px', 
          padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto',
          border: '1px solid rgba(239,68,68,0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 50px rgba(239,68,68,0.1)',
          background: 'rgba(15, 15, 15, 0.85)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fca5a5', marginBottom: '6px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex' }}>
                <Shield size={20} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0, letterSpacing: '-0.02em' }}>Secure Vault</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
              Managing secrets for <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{projectTitle}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '10px', cursor: 'pointer', color: 'var(--text-muted)',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin" color="#ef4444" style={{ margin: '0 auto', opacity: 0.8 }} />
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Decrypting vault data...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', 
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' 
                }}
              >
                <AlertTriangle size={16} /> {error}
              </motion.div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Stored Credentials
              </label>
              <button 
                onClick={() => setRevealed(!revealed)}
                style={{ 
                  background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', 
                  borderRadius: '8px', cursor: 'pointer', color: '#c4b5fd', 
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px',
                  fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealed ? 'Mask Passwords' : 'Show Passwords'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence initial={false}>
                {credentials.map((cred, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                    style={{ 
                      display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1.8fr auto', gap: '10px', 
                      alignItems: 'center', padding: '4px'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <input 
                        style={{ ...inputStyle, paddingLeft: i === 0 ? '12px' : '12px' }} 
                        placeholder="Service/Process" 
                        value={cred.process} 
                        onChange={e => updateRow(i, 'process', e.target.value)} 
                      />
                    </div>
                    <input 
                      style={inputStyle} 
                      placeholder="Email / Username" 
                      value={cred.email} 
                      onChange={e => updateRow(i, 'email', e.target.value)} 
                    />
                    <div style={{ position: 'relative' }}>
                      <input 
                        style={inputStyle} 
                        placeholder="Password" 
                        type={revealed ? 'text' : 'password'}
                        value={cred.password} 
                        onChange={e => updateRow(i, 'password', e.target.value)} 
                      />
                      {!revealed && cred.password && (
                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}>
                          <Lock size={12} />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeRow(i)} 
                      style={{ 
                        width: '42px', height: '42px', borderRadius: '10px', border: 'none', 
                        background: 'rgba(239,68,68,0.08)', color: '#fca5a5', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      title="Remove Row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={addRow}
                style={{ 
                  marginTop: '8px', padding: '14px', borderRadius: '12px', 
                  border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <Plus size={16} /> Add New Credential
              </motion.button>
            </div>

            <div style={{ 
              display: 'flex', gap: '12px', justifyContent: 'flex-end', 
              marginTop: '1.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <button 
                onClick={onClose} 
                style={{ 
                  padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem', 
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                style={{
                  padding: '12px 28px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  color: 'white', fontSize: '0.9rem', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 10px 20px -5px rgba(239,68,68,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Encrypting & Saving...' : 'Securely Save Vault'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
