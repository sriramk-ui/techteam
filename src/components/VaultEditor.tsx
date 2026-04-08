'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Shield, X, Eye, EyeOff, Key, Trash2, Save, 
  Lock, Loader2, Plus, AlertTriangle 
} from 'lucide-react';

interface VaultEditorProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
};

export default function VaultEditor({ projectId, projectTitle, onClose }: VaultEditorProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [keyValuePairs, setKeyValuePairs] = useState<{ key: string, value: string }[]>([]);
  
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
          const parsed = JSON.parse(data.decryptedData);
          const pairs = Object.entries(parsed).map(([key, value]) => ({ key, value: value as string }));
          setKeyValuePairs(pairs.length > 0 ? pairs : [{ key: '', value: '' }]);
        } else {
          setKeyValuePairs([{ key: '', value: '' }]);
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
    const validPairs = keyValuePairs.filter(p => p.key.trim());
    if (validPairs.length === 0 && keyValuePairs.length > 0) {
       // Allow deleting all secrets by sending empty object? 
       // The API usually expects data.
    }
    
    const payload: Record<string, string> = {};
    validPairs.forEach(({ key, value }) => { payload[key.trim()] = value; });

    setSaving(true);
    setError('');
    
    try {
      const res = await fetch(`/api/vault/${projectId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: JSON.stringify(payload) }),
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

  const addRow = () => setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  const removeRow = (index: number) => setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
  const updateRow = (index: number, field: 'key' | 'value', val: string) => {
    const newPairs = [...keyValuePairs];
    newPairs[index][field] = val;
    setKeyValuePairs(newPairs);
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 1000, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      padding: '1rem', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' 
    }}>
      <div className="glass-strong" style={{ 
        width: '100%', maxWidth: '540px', borderRadius: 'var(--radius-xl)', 
        padding: '2rem', maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid rgba(239,68,68,0.25)',
        boxShadow: '0 0 50px rgba(239,68,68,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '4px' }}>
              <Shield size={18} />
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Project Vault</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{projectTitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <Loader2 size={30} className="animate-spin" color="var(--accent-primary)" style={{ opacity: 0.5 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ 
                padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', 
                color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' 
              }}>
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Credentials
              </label>
              <button 
                onClick={() => setRevealed(!revealed)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealed ? 'Mask Values' : 'Reveal Values'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {keyValuePairs.map((pair, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px' }}>
                  <input 
                    style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }} 
                    placeholder="KEY" 
                    value={pair.key} 
                    onChange={e => updateRow(i, 'key', e.target.value)} 
                  />
                  <input 
                    style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace' }} 
                    placeholder="value" 
                    type={revealed ? 'text' : 'password'}
                    value={pair.value} 
                    onChange={e => updateRow(i, 'value', e.target.value)} 
                  />
                  <button 
                    onClick={() => removeRow(i)} 
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '8px', border: 'none', 
                      background: 'rgba(239,68,68,0.1)', color: '#fca5a5', 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addRow}
                style={{ 
                  marginTop: '8px', padding: '10px', borderRadius: '8px', 
                  border: '1px dashed var(--border-default)', background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={onClose} 
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white', fontSize: '0.875rem', fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 0 20px rgba(239,68,68,0.25)'
                }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Secrets'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
