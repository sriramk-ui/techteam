'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Mail, Save, Lock, Loader2, CheckCircle, AlertCircle, 
  Camera, ExternalLink, Globe, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/icons';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 16px', borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
  fontFamily: 'inherit', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', fontWeight: 700, 
  color: 'var(--text-muted)', marginBottom: '8px', 
  textTransform: 'uppercase', letterSpacing: '0.05em'
};

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile Form
  const [formData, setFormData] = useState({
    name: '',
    profilePic: '',
    socialLinks: {
      github: '',
      linkedin: '',
      instagram: '',
      gmail: '',
    }
  });

  // Password Form
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        profilePic: (user as any).profilePic || '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          instagram: user.socialLinks?.instagram || '',
          gmail: user.socialLinks?.gmail || '',
        }
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        refreshUser();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: pwdData.currentPassword,
          newPassword: pwdData.newPassword
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
    setLoading(true); setMessage(null);
    try {
      // 1. Upload the file
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      
      // 2. Auto-save to user profile
      const updateRes = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, profilePic: data.url })
      });
      
      if (!updateRes.ok) throw new Error('File uploaded but profile update failed');
      
      // 3. Update local state and refresh context
      setFormData(f => ({ ...f, profilePic: data.url }));
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.04em', background: 'linear-gradient(to right, white, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Profile Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
            Manage your digital identity and secure your team access.
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <div style={{ padding: '8px 16px', borderRadius: '100px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Shield size={14} /> ADMINISTRATOR
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: -20, marginBottom: 30 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ 
              padding: '14px 20px', borderRadius: '14px', 
              background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
              display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {/* Personal Info */}
        <section className="glass-strong" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)' }}>
              <User size={22} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Personal Information</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <div style={{ 
                  width: '100%', height: '100%', borderRadius: '32px', 
                  overflow: 'hidden', border: '4px solid rgba(255,255,255,0.05)',
                  background: 'rgba(0,0,0,0.2)', position: 'relative'
                }}>
                  {formData.profilePic ? (
                    <img src={formData.profilePic} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
                      <User size={48} />
                    </div>
                  )}
                  {loading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Loader2 size={24} className="animate-spin" color="white" />
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    position: 'absolute', bottom: '-8px', right: '-8px', 
                    width: '38px', height: '38px', borderRadius: '12px', 
                    background: 'var(--accent-primary)', color: 'white',
                    border: '4px solid #0a0a0a', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(139,92,246,0.3)', transition: 'transform 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '280px' }}>
                <label style={labelStyle}>Global Display Name</label>
                <input 
                  style={inputStyle} 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  required
                />
                <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  This will be visible to all team members and on public projects.
                </p>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }}></div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '-0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} /> Connection Profiles
                </h3>
                
                <div>
                  <label style={labelStyle}>Github Professional URL</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                      <GithubIcon size={18} />
                    </div>
                    <input 
                      style={{ ...inputStyle, paddingLeft: '44px' }} 
                      value={formData.socialLinks.github} 
                      onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})}
                      placeholder="github.com/your-username"
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>LinkedIn Profile</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                      <LinkedinIcon size={18} />
                    </div>
                    <input 
                      style={{ ...inputStyle, paddingLeft: '44px' }} 
                      value={formData.socialLinks.linkedin} 
                      onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                      placeholder="linkedin.com/in/your-profile"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '-0.5rem', height: '21px' }}></h3>
                
                <div>
                  <label style={labelStyle}>Instagram Username</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                      <InstagramIcon size={18} />
                    </div>
                    <input 
                      style={{ ...inputStyle, paddingLeft: '44px' }} 
                      value={formData.socialLinks.instagram} 
                      onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Public Contact Email</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                      <Mail size={18} />
                    </div>
                    <input 
                      style={{ ...inputStyle, paddingLeft: '44px' }} 
                      value={formData.socialLinks.gmail} 
                      onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, gmail: e.target.value}})}
                      placeholder="Email for public inquiries"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '14px 28px', borderRadius: '14px', border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  color: 'white', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 20px -5px rgba(139,92,246,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Update Master Profile
              </motion.button>
            </div>
          </form>
        </section>

        {/* Security / Password */}
        <section className="glass-strong" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Security Credentials</h2>
          </div>
          
          <form onSubmit={handlePasswordUpdate} style={{ display: 'grid', gap: '2rem' }}>
            <div>
              <label style={labelStyle}>Active Account Password</label>
              <input 
                type="password"
                style={inputStyle} 
                value={pwdData.currentPassword} 
                onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})}
                required
                placeholder="••••••••••••"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <label style={labelStyle}>New Complex Password</label>
                <input 
                  type="password"
                  style={inputStyle} 
                  value={pwdData.newPassword} 
                  onChange={e => setPwdData({...pwdData, newPassword: e.target.value})}
                  required
                  placeholder="••••••••••••"
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input 
                  type="password"
                  style={inputStyle} 
                  value={pwdData.confirmPassword} 
                  onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})}
                  required
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)',
                  background: 'rgba(239, 68, 68, 0.03)',
                  color: '#fca5a5', fontSize: '0.9rem', fontWeight: 700, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Rotate Access Key
              </motion.button>
            </div>
          </form>
        </section>
      </div>
    </motion.div>
  );
}
